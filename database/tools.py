from pipecat.services.llm_service import FunctionCallParams
from datetime import timedelta
from database.utils import get_free_slots, get_ist_now
from database.db import get_connection
from database.calendar import create_calendar_event, delete_calendar_event, update_calendar_event
# from pipeline.services.exotel_whatsapp import send_whatsapp_appointment_confirmation
# from pipeline.services.exotel_call_transfer import transfer_call_to_human
from loguru import logger


async def check_slot(params: FunctionCallParams, date: str, time: str):
    """Check if an appointment slot is available on a given date and time.

    Args:
        date: The appointment date in YYYY-MM-DD format (e.g. 2026-03-04).
        time: The appointment time in HH:MM 24-hour format (e.g. 10:00 for 10 AM, 14:00 for 2 PM).
    """
    try:
        conn = get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT * FROM appointments WHERE appointment_date = %s AND appointment_time = %s",
                    (date, time)
                )
                rows = cur.fetchall()
        finally:
            conn.close()

        if len(rows) == 0:
            await params.result_callback({
                "available": True
            })
        else:
            free_slots = await get_free_slots(date)
            await params.result_callback({
                "available": False,
                "suggested_slots": free_slots[:3]
            })

    except Exception as e:
        await params.result_callback({
            "error": str(e)
        })


async def book_slot(params: FunctionCallParams, name: str, phone: str, date: str, time: str):
    """Book a confirmed appointment slot for a patient. Only call this after the patient has explicitly confirmed the booking.

    Args:
        name: The full name of the patient.
        phone: The patient's phone number.
        date: The appointment date in YYYY-MM-DD format (e.g. 2026-03-04).
        time: The appointment time in HH:MM 24-hour format (e.g. 10:00 for 10 AM, 14:00 for 2 PM).
    """
    try:
        conn = get_connection()
        try:
            with conn.cursor() as cur:
                # Check if slot is already taken
                cur.execute(
                    "SELECT * FROM appointments WHERE appointment_date = %s AND appointment_time = %s",
                    (date, time)
                )
                rows = cur.fetchall()

                if len(rows) > 0:
                    await params.result_callback({
                        "status": "error",
                        "message": "Slot already booked"
                    })
                    return

                # Insert new appointment
                cur.execute(
                    """INSERT INTO appointments (name, phone, appointment_date, appointment_time)
                       VALUES (%s, %s, %s, %s) RETURNING id""",
                    (name, phone, date, time)
                )
                new_id = cur.fetchone()["id"]
                conn.commit()
        finally:
            conn.close()

        # Sync to Google Calendar
        event_id = create_calendar_event(name, phone, date, time)
        if event_id:
            try:
                conn2 = get_connection()
                with conn2.cursor() as cur2:
                    cur2.execute(
                        "UPDATE appointments SET calendar_event_id = %s WHERE id = %s",
                        (event_id, new_id)
                    )
                    conn2.commit()
                conn2.close()
            except Exception as cal_err:
                logger.warning(f"Could not save calendar_event_id: {cal_err}")

        # Send WhatsApp confirmation to the patient
        try:
            send_whatsapp_appointment_confirmation(
                to_phone=phone,
                patient_name=name,
                appointment_date=date,
                appointment_time=time,
            )
        except Exception as wa_err:
            logger.warning(f"WhatsApp notification failed (non-critical): {wa_err}")

        await params.result_callback({
            "status": "success",
            "message": "Appointment booked successfully"
        })

    except Exception as e:
        await params.result_callback({
            "error": str(e)
        })


async def next_available_slot(params: FunctionCallParams):
    """Find the next available appointment slot within the next 7 days. Use this when the patient asks for the earliest available time or does not have a preferred date."""
    try:
        # Use IST timezone so "today" is correct for Indian users
        today = get_ist_now()

        for i in range(7):
            date = (today + timedelta(days=i)).strftime("%Y-%m-%d")
            free_slots = await get_free_slots(date)

            if free_slots:
                await params.result_callback({
                    "date": date,
                    "time": free_slots[0]
                })
                return

        await params.result_callback({
            "message": "No available slots this week"
        })

    except Exception as e:
        logger.error(f"next_available_slot error: {e}")
        await params.result_callback({
            "error": str(e)
        })


async def cancel_slot(params: FunctionCallParams, phone: str):
    """Cancel an existing appointment for a patient using their phone number. Only call this after the patient has explicitly confirmed they want to cancel.

    Args:
        phone: The patient's phone number used when the appointment was booked.
    """
    try:
        conn = get_connection()
        try:
            with conn.cursor() as cur:
                # Find the upcoming appointment for this phone number
                cur.execute(
                    """
                    SELECT id, name, appointment_date, appointment_time, calendar_event_id
                    FROM appointments
                    WHERE phone = %s
                      AND appointment_date >= CURRENT_DATE
                    ORDER BY appointment_date ASC, appointment_time ASC
                    LIMIT 1
                    """,
                    (phone,)
                )
                row = cur.fetchone()

                if not row:
                    await params.result_callback({
                        "status": "not_found",
                        "message": "No upcoming appointment found for this phone number."
                    })
                    return

                # Delete the appointment
                cur.execute(
                    "DELETE FROM appointments WHERE id = %s",
                    (row["id"],)
                )
                conn.commit()

                appt_date = str(row["appointment_date"])
                appt_time = str(row["appointment_time"])[:5]
                logger.info(f"Cancelled appointment for {row['name']} on {appt_date} at {appt_time}")

                # Remove from Google Calendar
                if row.get("calendar_event_id"):
                    delete_calendar_event(row["calendar_event_id"])

        finally:
            conn.close()

        await params.result_callback({
            "status": "success",
            "message": f"Appointment on {appt_date} at {appt_time} has been successfully cancelled."
        })

    except Exception as e:
        logger.error(f"cancel_slot error: {e}")
        await params.result_callback({
            "error": str(e)
        })


async def reschedule_slot(params: FunctionCallParams, phone: str, new_date: str, new_time: str):
    """Reschedule an existing appointment to a new date and time. Only call this after verifying the new slot is available using check_slot, and after the patient has confirmed the new time.

    Args:
        phone: The patient's phone number used when the appointment was booked.
        new_date: The new appointment date in YYYY-MM-DD format (e.g. 2026-03-15).
        new_time: The new appointment time in HH:MM 24-hour format (e.g. 14:00 for 2 PM).
    """
    try:
        conn = get_connection()
        try:
            with conn.cursor() as cur:
                # Find existing upcoming appointment
                cur.execute(
                    """
                    SELECT id, name, phone, appointment_date, appointment_time, calendar_event_id
                    FROM appointments
                    WHERE phone = %s
                      AND appointment_date >= CURRENT_DATE
                    ORDER BY appointment_date ASC, appointment_time ASC
                    LIMIT 1
                    """,
                    (phone,)
                )
                row = cur.fetchone()

                if not row:
                    await params.result_callback({
                        "status": "not_found",
                        "message": "No upcoming appointment found for this phone number."
                    })
                    return

                # Check if new slot is already taken by someone else
                cur.execute(
                    """
                    SELECT id FROM appointments
                    WHERE appointment_date = %s
                      AND appointment_time = %s
                      AND id != %s
                    """,
                    (new_date, new_time, row["id"])
                )
                conflict = cur.fetchone()

                if conflict:
                    free_slots = await get_free_slots(new_date)
                    await params.result_callback({
                        "status": "slot_taken",
                        "message": "That slot is already taken.",
                        "suggested_slots": free_slots[:3]
                    })
                    return

                old_date = str(row["appointment_date"])
                old_time = str(row["appointment_time"])[:5]

                # Update appointment to new date/time
                cur.execute(
                    """
                    UPDATE appointments
                    SET appointment_date = %s, appointment_time = %s
                    WHERE id = %s
                    """,
                    (new_date, new_time, row["id"])
                )
                conn.commit()
                logger.info(f"Rescheduled {row['name']} from {old_date} {old_time} to {new_date} {new_time}")

                # Update Google Calendar event
                if row.get("calendar_event_id"):
                    update_calendar_event(
                        row["calendar_event_id"],
                        name=row["name"],
                        phone=row["phone"],
                        new_date=new_date,
                        new_time=new_time,
                    )

        finally:
            conn.close()

        await params.result_callback({
            "status": "success",
            "message": f"Appointment rescheduled from {old_date} at {old_time} to {new_date} at {new_time}."
        })

    except Exception as e:
        logger.error(f"reschedule_slot error: {e}")
        await params.result_callback({
            "error": str(e)
        })


async def transfer_to_human(params: FunctionCallParams):
    """Transfer the call to a human agent. Call this ONLY when the user explicitly asks to speak with a human, a doctor, the clinic staff, or a real person."""
    call_sid = getattr(params, "call_sid", None) or ""

    # Acknowledge first so the caller hears something before the transfer
    await params.result_callback({
        "action": "transfer",
        "message": (
            "Sure! Please hold on while I connect you to our clinic staff. "
            "One moment please."
        ),
    })

    # Trigger Exotel redirect (non-blocking best-effort)
    success = transfer_call_to_human(call_sid)
    if not success:
        logger.warning(
            "⚠️  Human transfer API call failed – caller will stay with bot."
        )
