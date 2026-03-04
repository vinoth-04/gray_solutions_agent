from pipecat.services.llm_service import FunctionCallParams
from datetime import timedelta
from database.utils import get_free_slots, get_ist_now
from database.db import supabase


async def check_slot(params: FunctionCallParams, date: str, time: str):
    """Check if an appointment slot is available on a given date and time.

    Args:
        date: The appointment date in YYYY-MM-DD format (e.g. 2026-03-04).
        time: The appointment time in HH:MM 24-hour format (e.g. 10:00 for 10 AM, 14:00 for 2 PM).
    """
    try:
        response = supabase.table("appointments") \
            .select("*") \
            .eq("appointment_date", date) \
            .eq("appointment_time", time) \
            .execute()

        if len(response.data) == 0:
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
        response = supabase.table("appointments") \
            .select("*") \
            .eq("appointment_date", date) \
            .eq("appointment_time", time) \
            .execute()

        if len(response.data) > 0:
            await params.result_callback({
                "status": "error",
                "message": "Slot already booked"
            })
            return

        supabase.table("appointments").insert({
            "name": name,
            "phone": phone,
            "appointment_date": date,
            "appointment_time": time
        }).execute()

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
        await params.result_callback({
            "error": str(e)
        })
