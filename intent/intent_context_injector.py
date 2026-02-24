from pipecat.processors.frame_processor import FrameProcessor
from pipecat.frames.frames import TextFrame
from loguru import logger


class IntentContextInjector(FrameProcessor):
    def __init__(self, context):
        super().__init__()
        self.context = context

    async def process_frame(self, frame, direction):

        if isinstance(frame, TextFrame) and hasattr(frame, "metadata"):

            intent = frame.metadata.get("intent")
            score = frame.metadata.get("intent_score", 0)

            if intent:
                logger.info(f"🧠 Injecting intent into LLM context: {intent}")

                # Inject as SYSTEM message so LLM follows it strongly
                self.context.messages.append({
                    "role": "system",
                    "content": f"Detected caller intent: {intent} (confidence {score:.2f}). Follow this intent when handling the conversation."
                })

        await self.push_frame(frame, direction)
