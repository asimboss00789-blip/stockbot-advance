# app.py (in root folder)

import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from collections import deque
from typing import Dict

from app.ai_researcher import generate_response  # Import from app folder

PORT = int(os.environ.get("PORT", 10000))  # Render-provided port

app = FastAPI(title="AI Web Researcher Bot")

# Store conversation history per user/session
conversation_memory: Dict[str, deque] = {}

class Prompt(BaseModel):
    session_id: str  # Identify user/session
    text: str

@app.post("/generate")
async def generate(prompt: Prompt):
    # Get or create conversation memory for session
    if prompt.session_id not in conversation_memory:
        conversation_memory[prompt.session_id] = deque(maxlen=70)
    
    memory = conversation_memory[prompt.session_id]
    memory.append({"role": "user", "content": prompt.text})

    try:
        # Generate AI response using ai_researcher
        ai_output = await generate_response(prompt.text, memory)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    # Save AI response in memory
    memory.append({"role": "assistant", "content": ai_output})

    return {"response": ai_output, "memory_length": len(memory)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)
