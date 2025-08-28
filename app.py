from fastapi import FastAPI
from pydantic import BaseModel
from ai_researcher import generate_answer

app = FastAPI(title="AI Researcher Bot")
PORT = int(os.environ.get("PORT", 10000))

class Prompt(BaseModel):
    text: str

@app.post("/generate")
def generate(prompt: Prompt):
    answer = generate_answer(prompt.text)
    return {"answer": answer}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)
