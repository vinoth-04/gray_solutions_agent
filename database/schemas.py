from pydantic import BaseModel
from datetime import date, time


class CheckSlotRequest(BaseModel):
    date: date
    time: time


class BookSlotRequest(BaseModel):
    name: str
    phone: str
    date: date
    time: time