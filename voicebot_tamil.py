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
from pipecat.services.sarvam.stt import SarvamSTTService
from pipecat.services.deepgram.stt import DeepgramSTTService
from pipecat.services.sarvam import SarvamTTSService
from pipecat.transcriptions.language import Language

from pipeline.services.openai.llm import OpenAILLMService
from prompt.clinic_system_prompt import SYSTEM_PROMPT
from pipecat.adapters.schemas.tools_schema import ToolsSchema
from database.tools import check_slot, book_slot

load_dotenv()

async def run_bot(transport):

    # ================= LLM =================
    llm = OpenAILLMService(
        api_key=os.getenv("OPENAI_API_KEY"),
        model="gpt-4o-mini",
        params=OpenAILLMService.InputParams(
            temperature=0.5,
            max_completion_tokens=200,
            frequency_penalty=0.3,
        ),
        retry_on_timeout=True,
    )

    # ================= TOOLS =================
    tools_schema = ToolsSchema(
        standard_tools=[check_slot, book_slot]
    )
    llm.tools = tools_schema
    llm.register_direct_function(check_slot)
    llm.register_direct_function(book_slot)

    stt = SarvamSTTService(
        api_key=os.getenv("SARVAM_API_KEY"),
        model="saarika:v2.5",
        params=SarvamSTTService.InputParams(
            language=None,  # auto detect Tamil or any other language
        ),
    )

    tts = SarvamTTSService(
        api_key=os.getenv("SARVAM_API_KEY"),
        model="bulbul:v3",            # advanced Indian language voice
        voice_id="shubh",             # choose one voice (male)
        params=SarvamTTSService.InputParams(
            language=Language.TA,      # Tamil TTS output
            pace=1.0,                  # normal speed
            temperature=0.7,           # voice variation
        ),
    )

    # ================= CONTEXT =================
    messages = [{"role": "system", "content": SYSTEM_PROMPT+"""
இந்த AI உதவியாளர் முழுமையாக தமிழ் மொழியில் பதிலளிக்க வேண்டும்.
பயனர் பேசும்போது தமிழில் பதில்களை உருவாக்கவும் மற்றும் அத்துடன் தெளிவாகவும் நட்பு உளவும் பதிலளிக்கவும்.
பயனர் அறிமுகம் கேட்டால் எளிதாக தமிழில் சமர்ப்பிக்கவும்.
"""}]
    context = LLMContext(messages=messages, tools=tools_schema)

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
        #     {"role": "system", "content": "Please introduce yourself in Tamil."}
        # )
        await task.queue_frames([LLMRunFrame()])

    @transport.event_handler("on_client_disconnected")
    async def on_disconnected(transport, client):
        logger.info("📴 Caller disconnected")
        await task.cancel()

    runner = PipelineRunner(handle_sigint=False)
    await runner.run(task)