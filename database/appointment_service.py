from database.db import get_db


# CHECK SLOT FUNCTION
# async def check_slot(date: str, time: str):
#     conn = await get_db()

#     query = """
#         SELECT * FROM appointments
#         WHERE appointment_date=$1 AND appointment_time=$2
#     """

#     result = await conn.fetch(query, date, time)

#     await conn.close()

#     if result:
#         return {"available": False, "message": "Slot already booked"}
#     else:
#         return {"available": True, "message": "Slot available"}


# # BOOK APPOINTMENT FUNCTION
# async def book_appointment(name: str, phone: str, date: str, time: str):
#     conn = await get_db()

#     query = """
#         INSERT INTO appointments
#         (customer_name, phone, appointment_date, appointment_time)
#         VALUES ($1, $2, $3, $4)
#     """

#     await conn.execute(query, name, phone, date, time)

#     await conn.close()

#     return {"status": "success", "message": "Appointment booked"}

async def check_slot(params, date: str = "", time: str = ""):
    """
    Check if appointment slot is available.

    Args:
        date: appointment date
        time: appointment time
    """
    conn = await get_db()
    try:
        query = """
        SELECT * FROM appointments
        WHERE appointment_date = $1::DATE AND appointment_time = $2::TIME
        """

        result = await conn.fetch(query, date, time)

        if result:
            return {"available": False}
        else:
            return {"available": True}
    finally:
        await conn.close()

async def book_slot(params, name: str = "", phone: str = "", date: str = "", time: str = ""):
    """
    Book appointment slot.

    Args:
        name: patient name
        phone: phone number
        date: appointment date
        time: appointment time
    """
    conn = await get_db()
    try:
        query = """
        INSERT INTO appointments (patient_name, phone_number, appointment_date, appointment_time)
        VALUES ($1, $2, $3::DATE, $4::TIME)
        """

        await conn.execute(query, name, phone, date, time)

        return {"status": "booked"}
    finally:
        await conn.close()