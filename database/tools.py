from pipecat.services.llm_service import FunctionCallParams
from database.db import supabase


async def check_slot(params: FunctionCallParams, date: str, time: str):
    try:
        response = supabase.table("appointments") \
            .select("*") \
            .eq("appointment_date", date) \
            .eq("appointment_time", time) \
            .execute()

        is_free = len(response.data) == 0

        await params.result_callback({
            "available": is_free
        })

    except Exception as e:
        await params.result_callback({
            "error": str(e)
        })


async def book_slot(params: FunctionCallParams, name: str, phone: str, date: str, time: str):
    try:
        # Check first
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

        # Insert
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