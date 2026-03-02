from database.db import supabase
from database.slots import AVAILABLE_SLOTS


async def get_free_slots(date):

    response = supabase.table("appointments") \
        .select("appointment_time") \
        .eq("appointment_date", date) \
        .execute()

    booked_slots = [row["appointment_time"] for row in response.data]

    free_slots = [slot for slot in AVAILABLE_SLOTS if slot not in booked_slots]

    return free_slots