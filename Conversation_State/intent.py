from dataclasses import dataclass, field
from typing import Optional, Dict


@dataclass
class ConversationState:
    call_id: str

    # intent
    intent: Optional[str] = None

    # patient info
    name: Optional[str] = None
    phone: Optional[str] = None
    reason: Optional[str] = None

    # appointment details
    date: Optional[str] = None
    time: Optional[str] = None

    # internal flags
    verified: bool = False
    confirmation_pending: bool = False

    # conversation history (optional)
    history: list = field(default_factory=list)


class ConversationStateManager:

    def __init__(self):
        self.sessions: Dict[str, ConversationState] = {}

    # ---------------------------------------------------
    # Session Handling
    # ---------------------------------------------------

    def create_session(self, call_id: str) -> ConversationState:
        state = ConversationState(call_id=call_id)
        self.sessions[call_id] = state
        return state

    def get_state(self, call_id: str) -> ConversationState:
        return self.sessions.get(call_id)

    def delete_session(self, call_id: str):
        if call_id in self.sessions:
            del self.sessions[call_id]

    # ---------------------------------------------------
    # Update State
    # ---------------------------------------------------

    def update_state(self, call_id: str, extracted_data: dict):

        state = self.get_state(call_id)

        if not state:
            return None

        for key, value in extracted_data.items():
            if hasattr(state, key) and value:
                setattr(state, key, value)

        return state

    # ---------------------------------------------------
    # Determine Next Question
    # ---------------------------------------------------

    def get_next_required_field(self, state: ConversationState):

        if not state.name:
            return "name"

        if not state.phone:
            return "phone"

        if not state.reason:
            return "reason"

        if not state.date:
            return "date"

        if not state.time:
            return "time"

        return None

    # ---------------------------------------------------
    # Booking Readiness
    # ---------------------------------------------------

    def is_ready_for_booking(self, state: ConversationState) -> bool:

        required = [
            state.name,
            state.phone,
            state.reason,
            state.date,
            state.time
        ]

        return all(required)

    # ---------------------------------------------------
    # Question Generator
    # ---------------------------------------------------

    def generate_question(self, field: str):

        questions = {
            "name": "May I have your name?",
            "phone": "Could you share your phone number?",
            "reason": "What is the reason for your visit?",
            "date": "Which date would you prefer?",
            "time": "What time works best for you?"
        }

        return questions.get(field, "Could you please clarify?")

    # ---------------------------------------------------
    # Handle Booking Flow
    # ---------------------------------------------------

    def handle_booking(self, call_id: str):

        state = self.get_state(call_id)

        if not state:
            return "Session not found."

        if self.is_ready_for_booking(state):

            state.confirmation_pending = True

            return {
                "action": "check_slot",
                "data": {
                    "date": state.date,
                    "time": state.time
                }
            }

        field = self.get_next_required_field(state)

        return {
            "action": "ask_user",
            "question": self.generate_question(field)
        }

    # ---------------------------------------------------
    # Handle Reschedule
    # ---------------------------------------------------

    def handle_reschedule(self, call_id: str):

        state = self.get_state(call_id)

        if not state.phone:
            return {
                "action": "ask_user",
                "question": "Could you share your phone number to locate your appointment?"
            }

        if not state.date:
            return {
                "action": "ask_user",
                "question": "What new date would you prefer?"
            }

        if not state.time:
            return {
                "action": "ask_user",
                "question": "What new time works for you?"
            }

        return {
            "action": "check_slot",
            "data": {
                "date": state.date,
                "time": state.time
            }
        }

    # ---------------------------------------------------
    # Handle Cancellation
    # ---------------------------------------------------

    def handle_cancellation(self, call_id: str):

        state = self.get_state(call_id)

        if not state.phone:
            return {
                "action": "ask_user",
                "question": "Could you share your phone number to find your appointment?"
            }

        if not state.confirmation_pending:

            state.confirmation_pending = True

            return {
                "action": "ask_user",
                "question": "Are you sure you want to cancel your appointment?"
            }

        return {
            "action": "cancel_slot",
            "data": {
                "phone": state.phone
            }
        }