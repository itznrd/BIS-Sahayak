"""
generate.py
Takes a user query plus retrieved chunks and produces a final answer.

If GROQ_API_KEY is set, this calls Groq with a strict "answer only from
context, cite sources" system prompt. Otherwise it falls back to returning
the best-matching chunk directly, so the pipeline still works end-to-end
with no API key at all.

Get a free Groq API key at https://console.groq.com/keys
"""

from config import GROQ_API_KEY, GROQ_MODEL

SYSTEM_PROMPT = """You are a BIS (Bureau of Indian Standards) assistant. Answer the
user's question using ONLY the provided context chunks. For every claim, cite the
source document name in square brackets, e.g. [IS_LED_Bulbs.txt].

If the context does not contain enough information to answer, say so plainly
instead of guessing. Keep answers concise and practical. This is a hackathon
prototype using sample/illustrative data, not the official BIS database."""


def _build_context_block(chunks):
    lines = []
    for c in chunks:
        lines.append(f"[Source: {c['source']}]\n{c['text']}")
    return "\n\n".join(lines)


def _fallback_answer(query, chunks):
    """Best-effort answer with no LLM call. Used either when no key is set,
    or when nothing relevant was retrieved (in which case an LLM call would
    have nothing to ground an answer in anyway)."""
    if not chunks:
        return "I couldn't find anything relevant to that in the current knowledge base."

    top = chunks[0]
    note = ("[No GROQ_API_KEY set -- showing the best-matching excerpt instead "
            "of an LLM-generated answer. Set the key in a .env file for full answers.]\n\n")
    return f"{note}{top['text']}\n\n(Source: {top['source']})"


def _llm_answer(query, chunks):
    from groq import Groq

    client = Groq(api_key=GROQ_API_KEY)
    context_block = _build_context_block(chunks)

    user_message = (
        f"Context:\n{context_block}\n\n"
        f"Question: {query}\n\n"
        "Answer using only the context above, with source citations."
    )

    completion = client.chat.completions.create(
        model=GROQ_MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_message},
        ],
        temperature=1,
        max_completion_tokens=500,
        top_p=1,
        reasoning_effort="medium",
        stream=False,   # set True + iterate chunks if you want streaming in chat.py
        stop=None,
    )

    return completion.choices[0].message.content


def generate_answer(query, chunks):
    """Main entry point used by chat.py. Returns the answer string."""
    if not chunks:
        return _fallback_answer(query, chunks)

    if GROQ_API_KEY:
        try:
            return _llm_answer(query, chunks)
        except Exception as e:
            return f"(LLM call failed: {e})\n\n" + _fallback_answer(query, chunks)

    return _fallback_answer(query, chunks)



if __name__ == "__main__":
    from retrieve import get_retriever

    r = get_retriever()
    q = "What is the certification process for helmets?"
    results = r.retrieve(q)
    print(generate_answer(q, results))
