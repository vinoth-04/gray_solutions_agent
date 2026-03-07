from datetime import datetime, timezone, timedelta

IST = timezone(timedelta(hours=5, minutes=30))

def get_current_context():
    now = datetime.now(IST)

    return {
        "date": now.strftime("%Y-%m-%d"),
        "day": now.strftime("%A"),
        "time": now.strftime("%H:%M"),
        "time_12h": now.strftime("%I:%M %p")
    }