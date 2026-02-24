from pipecat.processors.frame_processor import FrameProcessor
from pipecat.frames.frames import (
    TextFrame,
    LLMContextFrame,
    StartFrame,
)

from open_intent_classifier.model import IntentClassifier


class HybridIntentProcessor(FrameProcessor):

    def __init__(self, context):
        super().__init__()

        self.context = context

        # ⭐ Intent classifier
        self.classifier = IntentClassifier()

        self.labels = [
            "book_appointment",
            "cancel_appointment",
            "clinic_info",
            "doctor_availability",
            "greeting",
        ]

    async def process_frame(self, frame, direction):

        # VERY IMPORTANT — always forward StartFrame
        if isinstance(frame, StartFrame):
            await self.push_frame(frame, direction)
            return

        # Only intercept user text
        if isinstance(frame, TextFrame) and direction == "upstream":

            text = frame.text.lower()

            intent = self.classifier.predict(text, self.labels)

            print("🎯 Detected Intent:", intent)

            # Inject into LLM context
            intent_message = {
                "role": "system",
                "content": f"User intent detected: {intent}",
            }

            self.context.messages.append(intent_message)

            # Push updated context to pipeline
            await self.push_frame(
                LLMContextFrame(self.context.messages),
                direction,
            )

        # Always forward original frame
        await self.push_frame(frame, direction)
