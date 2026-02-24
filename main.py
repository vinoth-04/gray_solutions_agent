from fastapi import FastAPI, WebSocket
from loguru import logger

from pipecat.runner.utils import parse_telephony_websocket

# from pipeline.serializers.exotel import ExotelFrameSerializer
from pipecat.serializers.exotel import ExotelFrameSerializer
from pipeline.transports.fastapi import (
    FastAPIWebsocketTransport,
    FastAPIWebsocketParams,
)

from voicebot import run_bot

app = FastAPI()


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
