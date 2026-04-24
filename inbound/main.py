from fastapi import FastAPI, WebSocket
from fastapi.responses import JSONResponse
from loguru import logger

from pipecat.runner.utils import parse_telephony_websocket
from pipecat.serializers.exotel import ExotelFrameSerializer
from pipeline.transports.fastapi import (
    FastAPIWebsocketTransport,
    FastAPIWebsocketParams,
)

from inbound.voice_english import run_bot
from database.db import get_connection

# ── API routers ──────────────────────────────────────────────────────────────
from api.dashboard import router as dashboard_router
from api.appointments import router as appointments_router

app = FastAPI(
    title="Exotel Voicebot API",
    description="REST API for clinic appointment management and dashboard analytics.",
    version="1.0.0",
)

# Register routers
app.include_router(dashboard_router)
app.include_router(appointments_router)


# Legacy /appointments endpoint removed.
# Use GET /api/appointments  (see api/appointments.py)


@app.websocket("/ws")
async def exotel_websocket(websocket: WebSocket):

    await websocket.accept()
    logger.info("🚀 Exotel Connected")

    # Detect Exotel transport
    transport_type, call_data = await parse_telephony_websocket(websocket)

    logger.info(f"Transport detected: {transport_type}")

    # Exotel serializer
    serializer = ExotelFrameSerializer(
        stream_sid=call_data["stream_id"],
        call_sid=call_data["call_id"],
    )

    # Create Pipecat transport
    transport = FastAPIWebsocketTransport(
        websocket=websocket,
        params=FastAPIWebsocketParams(
            audio_in_enabled=True,
            audio_out_enabled=True,
            add_wav_header=False,
            serializer=serializer,
        ),
    )

    # Start voicebot
    await run_bot(transport)