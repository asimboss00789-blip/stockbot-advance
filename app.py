import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from collections import deque
from typing import Dict
from app.ai_researcher import generate_response  # existing AI logic
from prompts import PROMPTS  # import all prompts

PORT = int(os.environ.get("PORT", 10000))  # Render-provided port

app = FastAPI(title="AI Web Researcher Bot")

# Store conversation history per user/session
conversation_memory: Dict[str, deque] = {}

class Prompt(BaseModel):
    session_id: str  # Identify user/session
    text: str
    ai_type: str = "heartmate"  # default AI type

@app.post("/generate")
async def generate(prompt: Prompt):
    # Validate AI type
    if prompt.ai_type not in PROMPTS:
        raise HTTPException(status_code=400, detail=f"Unknown AI type: {prompt.ai_type}")

    # Get or create conversation memory for session
    if prompt.session_id not in conversation_memory:
        conversation_memory[prompt.session_id] = deque(maxlen=70)
    
    memory = conversation_memory[prompt.session_id]
    memory.append({"role": "user", "content": prompt.text})

    try:
        # Generate AI response using the selected prompt from prompts.py
        ai_prompt = PROMPTS[prompt.ai_type]
        ai_output = await generate_response(prompt.text, memory, ai_prompt)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    # Save AI response in memory
    memory.append({"role": "assistant", "content": ai_output})

    return {
        "response": ai_output,
        "memory_length": len(memory),
        "ai_type": prompt.ai_type
    }

@app.get("/sessions")
async def get_sessions():
    # List all session IDs and last message for quick reference
    return [
        {"session_id": sid, "last_message": memory[-1]["content"] if memory else None}
        for sid, memory in conversation_memory.items()
    ]

@app.delete("/sessions/{session_id}")
async def delete_session(session_id: str):
    if session_id in conversation_memory:
        del conversation_memory[session_id]
        return {"status": "deleted", "session_id": session_id}
    raise HTTPException(status_code=404, detail=f"Session {session_id} not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)
