import os
from dotenv import load_dotenv
from loguru import logger

from pipecat.audio.vad.silero import SileroVADAnalyzer
from pipecat.frames.frames import LLMRunFrame
from pipecat.pipeline.pipeline import Pipeline
from pipecat.pipeline.runner import PipelineRunner
from pipecat.pipeline.task import PipelineParams, PipelineTask
from pipecat.processors.aggregators.llm_context import LLMContext
from pipecat.processors.aggregators.llm_response_universal import (
    LLMContextAggregatorPair,
    LLMUserAggregatorParams,
)

from pipecat.services.deepgram.stt import DeepgramSTTService
from pipecat.services.sarvam import SarvamTTSService
from pipecat.transcriptions.language import Language

from pipeline.services.openai.llm import OpenAILLMService
from prompt.clinic_system_prompt import get_system_prompt
from pipecat.adapters.schemas.tools_schema import ToolsSchema

from database.time_utils import get_current_context 
from database.tools import check_slot, book_slot, next_available_slot

load_dotenv()


async def run_bot(transport):

    # ================= LLM =================
    llm = OpenAILLMService(
        api_key=os.getenv("OPENAI_API_KEY"),
        model="gpt-4o-mini",
        params=OpenAILLMService.InputParams(
            temperature=0.4,
            max_completion_tokens=200,
            frequency_penalty=0.3,
        ),
        retry_on_timeout=True,
    )
    tools_schema = ToolsSchema(
        standard_tools=[
            check_slot,
            book_slot,
            next_available_slot
        ]
    )
    # time_context = get_current_context()
    llm.tools = tools_schema

    llm.register_direct_function(check_slot)
    llm.register_direct_function(book_slot)
    llm.register_direct_function(next_available_slot)
        # ================= STT =================
    stt = DeepgramSTTService(
        api_key=os.getenv("DEEPGRAM_API_KEY"),
    )

    # ================= TTS =================
    tts = SarvamTTSService(
        api_key=os.getenv("SARVAM_API_KEY"),
        model="bulbul:v3-beta",
        voice_id="shubh",
        params=SarvamTTSService.InputParams(
            language=Language.EN,
            pace=1.1,
            temperature=0.6,
        ),
    )

# ================= CONTEXT =================

    time_context = get_current_context()

    messages = [
        {
            "role": "system",
            "content": get_system_prompt(time_context)
        }
    ]

    context = LLMContext(
        messages=messages,
        tools=tools_schema
    )

    user_agg, assistant_agg = LLMContextAggregatorPair(
        context,
        user_params=LLMUserAggregatorParams(
            vad_analyzer=SileroVADAnalyzer(),
        ),
    )

    # ================= PIPELINE =================
    pipeline = Pipeline(
        [
            transport.input(),
            stt,
            user_agg,
            llm,
            tts,
            transport.output(),
            assistant_agg,
        ]
    )

    task = PipelineTask(
        pipeline,
        params=PipelineParams(
            audio_in_sample_rate=8000,
            audio_out_sample_rate=8000,
        ),
    )

    # ================= EVENTS =================
    @transport.event_handler("on_client_connected")
    async def on_connected(transport, client):
        logger.info("📞 Caller connected")
        # messages.append(
        #     {"role": "system", "content": "Please introduce yourself to the user."}
        # )
        await task.queue_frames([LLMRunFrame()])

    @transport.event_handler("on_client_disconnected")
    async def on_disconnected(transport, client):
        logger.info("📴 Caller disconnected")
        await task.cancel()

    runner = PipelineRunner(handle_sigint=False)
    await runner.run(task)