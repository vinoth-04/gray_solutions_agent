from datetime import datetime, timezone, timedelta
from database.db import supabase
from database.slots import AVAILABLE_SLOTS

# Indian Standard Time = UTC+5:30
IST = timezone(timedelta(hours=5, minutes=30))


def get_ist_now() -> datetime:
    """Return current datetime in IST."""
    return datetime.now(IST)


async def get_free_slots(date: str) -> list[str]:
    """
    Returns free appointment slots for the given date (YYYY-MM-DD).
    For today's date, past time slots are excluded based on IST current time.
    """
    response = supabase.table("appointments") \
        .select("appointment_time") \
        .eq("appointment_date", date) \
        .execute()

    booked_slots = [row["appointment_time"] for row in response.data]

    now_ist = get_ist_now()
    today_str = now_ist.strftime("%Y-%m-%d")
    current_time_str = now_ist.strftime("%H:%M")

    free_slots = []
    for slot in AVAILABLE_SLOTS:
        if slot in booked_slots:
            continue
        # If the requested date is today, skip slots that are in the past
        if date == today_str and slot <= current_time_str:
            continue
        free_slots.append(slot)

    return free_slots