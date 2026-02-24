from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer("all-MiniLM-L6-v2")

intent_examples = {
    "greeting": ["hello", "hi", "good morning"],
    "book_appointment": ["book appointment", "schedule meeting"],
    "cancel_appointment": ["cancel appointment", "delete booking"],
    "goodbye": ["bye", "goodbye", "see you"]
}

intent_embeddings = {
    intent: model.encode(sentences, convert_to_tensor=True)
    for intent, sentences in intent_examples.items()
}


def detect_intent(text):
    query_embedding = model.encode(text, convert_to_tensor=True)

    best_intent = None
    best_score = 0

    for intent, embeddings in intent_embeddings.items():
        score = util.cos_sim(query_embedding, embeddings).max().item()

        if score > best_score:
            best_score = score
            best_intent = intent

    return best_intent, best_score
