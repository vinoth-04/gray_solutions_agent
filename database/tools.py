from pipecat.services.llm_service import FunctionCallParams
from database.utils import get_free_slots
from database.db import supabase


async def check_slot(params: FunctionCallParams, date: str, time: str):

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
from datetime import datetime, timedelta
from database.utils import get_free_slots


async def next_available_slot(params: FunctionCallParams):

    try:

        today = datetime.today()

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