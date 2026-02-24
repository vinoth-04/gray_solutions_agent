# import asyncpg

# # DATABASE_URL = "postgresql://postgres:password@localhost:5432/appointment_db"
# DATABASE_URL="postgresql://postgres:%40Vinoth04@localhost:5432/clinic_calendar"

# async def get_connection():
#     return await asyncpg.connect(DATABASE_URL)


import asyncpg

DB_URL = "postgresql://postgres:%40Vinoth04@localhost:5432/clinic_calendar"

async def get_db():
    return await asyncpg.connect(DB_URL)