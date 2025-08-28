import os
from fastapi import FastAPI
from pydantic import BaseModel
from ai_researcher import fetch_and_answer  # Our web-fetching AI function

PORT = int(os.environ.get("PORT", 10000))  # Render port

app = FastAPI(title="AI Web Researcher")

class Query(BaseModel):
    url: str
    question: str

@app.post("/ask")
def ask(query: Query):
    """
    Takes a URL and a question, fetches content, and returns AI answer.
    """
    try:
        answer = fetch_and_answer(query.url, query.question)
        return {"answer": answer}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)
