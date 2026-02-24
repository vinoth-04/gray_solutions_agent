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
                        "date": {"type": "string"},
                        "time": {"type": "string"},
                    },
                    "required": ["date", "time"],
                },
            },
        },
        {
            "type": "function",
            "function": {
                "name": "book_appointment",
                "description": "Book an appointment",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "name": {"type": "string"},
                        "phone": {"type": "string"},
                        "date": {"type": "string"},
                        "time": {"type": "string"},
                    },
                    "required": ["name", "phone", "date", "time"],
                },
            },
        },
    ]


# FUNCTION HANDLER
async def run_function(name, arguments):
    if name == "check_slot":
        return await check_slot(**arguments)

    if name == "book_slot":
        return await book_slot(**arguments)