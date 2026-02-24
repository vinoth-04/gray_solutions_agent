from pipecat.processors.frame_processor import FrameProcessor
from pipecat.frames.frames import TextFrame
from intent.intent_service import detect_intent


class IntentProcessor(FrameProcessor):

    async def process(self, frame, direction):

        # ALWAYS forward non-text frames
        if not isinstance(frame, TextFrame):
            await self.push_frame(frame, direction)
            return

        text = frame.text.strip()

        if not text:
            await self.push_frame(frame, direction)
            return

        # Detect intent
        intent, confidence = detect_intent(text)

        print(f"Intent: {intent} ({confidence:.2f})")

        # Inject intent into frame metadata
        frame.metadata["intent"] = intent
        frame.metadata["confidence"] = confidence

        # VERY IMPORTANT — forward frame
        await self.push_frame(frame, direction)
