from database.appointment_service import check_slot, book_slot


def get_tools():
    return [
        {
            "type": "function",
            "function": {
                "name": "check_slot",
                "description": "Check if appointment slot is available",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "date": {
                            "type": "string",
                            "description": "Date in format YYYY-MM-DD"
                        },
                        "time": {
                            "type": "string",
                            "description": "Time in format HH:MM (24-hour)"
                        },
                    },
                    "required": ["date", "time"],
                },
            },
        },
        {
            "type": "function",
            "function": {
                "name": "book_slot",  # ✅ FIXED NAME
                "description": "Book an appointment slot",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "name": {"type": "string"},
                        "phone": {"type": "string"},
                        "date": {
                            "type": "string",
                            "description": "Date in format YYYY-MM-DD"
                        },
                        "time": {
                            "type": "string",
                            "description": "Time in format HH:MM (24-hour)"
                        },
                    },
                    "required": ["name", "phone", "date", "time"],
                },
            },
        },
    ]

async def run_function(name, arguments):

    if name == "check_slot":
        request = CheckSlotRequest(**arguments)
        return await check_slot(request)

    if name == "book_slot":
        request = BookSlotRequest(**arguments)
        return await book_slot(request)

    return {"error": f"Unknown function: {name}"}