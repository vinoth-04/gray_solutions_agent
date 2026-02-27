from database.db import get_db


# ===============================
# CHECK SLOT
# ===============================

async def check_slot(params):

    # Convert params to Pydantic model
    request = CheckSlotRequest(**params)

    conn = await get_db()

    try:
        query = """
        SELECT 1 FROM appointments
        WHERE appointment_date = $1
        AND appointment_time = $2
        """

        result = await conn.fetch(
            query,
            request.date,
            request.time
        )

        return {"available": not bool(result)}

    finally:
        await conn.close()


# ===============================
# BOOK SLOT
# ===============================

async def book_slot(params):

    request = BookSlotRequest(**params)

    conn = await get_db()

    try:
        query = """
        INSERT INTO appointments
        (patient_name, phone_number, appointment_date, appointment_time)
        VALUES ($1, $2, $3, $4)
        """

        await conn.execute(
            query,
            request.name,
            request.phone,
            request.date,
            request.time
        )

        return {"status": "booked"}

    finally:
        await conn.close()