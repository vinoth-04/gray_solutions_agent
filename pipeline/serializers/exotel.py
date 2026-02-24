#
# Copyright (c) 2024-2026, Daily
#
# SPDX-License-Identifier: BSD 2-Clause License
#

"""Exotel Media Streams serializer for Pipecat."""

import base64
import json
from typing import Optional

from loguru import logger
from pydantic import BaseModel

from pipecat.audio.dtmf.types import KeypadEntry
from pipecat.audio.utils import create_stream_resampler
from pipecat.frames.frames import (
    AudioRawFrame,
    Frame,
    InputAudioRawFrame,
    InputDTMFFrame,
    InterruptionFrame,
    OutputTransportMessageFrame,
    OutputTransportMessageUrgentFrame,
    StartFrame,
)
from pipecat.serializers.base_serializer import FrameSerializer


class ExotelFrameSerializer(FrameSerializer):
    """Serializer for Exotel Media Streams."""

    class InputParams(BaseModel):
        exotel_sample_rate: int = 8000
        sample_rate: Optional[int] = None

    def __init__(
        self,
        stream_sid: str,
        call_sid: Optional[str] = None,
        params: Optional[InputParams] = None,
    ):
        super().__init__(params or ExotelFrameSerializer.InputParams())
        self._stream_sid = stream_sid
        self._call_sid = call_sid

        self._exotel_sample_rate = self._params.exotel_sample_rate
        self._sample_rate = 0

        self._input_resampler = create_stream_resampler()
        self._output_resampler = create_stream_resampler()
        
    async def serialize(self, frame: Frame) -> str | bytes | None:
        """Serializes a Pipecat frame to Exotel WebSocket format."""
        if isinstance(frame, InterruptionFrame):
            answer = {"event": "clear", "streamSid": self._stream_sid}
            return json.dumps(answer)

        elif isinstance(frame, AudioRawFrame):
            # Resample from pipeline rate to Exotel's sample rate
            data = frame.audio
            serialized_data = await self._output_resampler.resample(
                data, frame.sample_rate, self._exotel_sample_rate
            )
            if not serialized_data:
                return None

            payload = base64.b64encode(serialized_data).decode("ascii")

            answer = {
                "event": "media",
                "streamSid": self._stream_sid,
                "media": {"payload": payload},
            }
            return json.dumps(answer)

        elif isinstance(frame, (OutputTransportMessageFrame, OutputTransportMessageUrgentFrame)):
            if self.should_ignore_frame(frame):
                return None
            return json.dumps(frame.message)

        return None

    async def deserialize(self, data: str | bytes) -> Frame | None:
        """Deserializes Exotel WebSocket data into Pipecat frames."""
        message = json.loads(data)

        if message["event"] == "media":
            payload_base64 = message["media"]["payload"]
            payload = base64.b64decode(payload_base64)

            deserialized_data = await self._input_resampler.resample(
                payload,
                self._exotel_sample_rate,
                self._sample_rate,
            )
            if not deserialized_data:
                return None

            return InputAudioRawFrame(
                audio=deserialized_data,
                num_channels=1,
                sample_rate=self._sample_rate,
            )

        elif message["event"] == "dtmf":
            digit = message.get("dtmf", {}).get("digit")
            try:
                return InputDTMFFrame(KeypadEntry(digit))
            except ValueError:
                logger.info(f"Invalid DTMF digit: {digit}")
                return None

        return None