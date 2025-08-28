import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from collections import deque
from typing import Dict

from app.ai_researcher import generate_response  # Import AI researcher
from conversation_manager import (
    save_conversation,
    get_conversations,
    get_conversation,
    delete_conversation,
)  # Manage JSON conversations

PORT = int(os.environ.get("PORT", 10000))  # Render-provided port

app = FastAPI(title="Lumina AI Researcher Bot")

# Store conversation memory per user/session (RAM only for live chat)
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
        # Generate AI response
        ai_output = await generate_response(prompt.text, memory)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    # Save response in memory
    memory.append({"role": "assistant", "content": ai_output})

    # Save conversation snapshot to JSON (persistent history)
    save_conversation(prompt.session_id, list(memory))

    return {"response": ai_output, "memory_length": len(memory)}

# -------- Conversation Management Routes -------- #

@app.get("/conversations")
def list_conversations():
    """List all saved conversations (max 10)."""
    return get_conversations()

@app.get("/conversations/{session_id}")
def read_conversation(session_id: str):
    """Get one conversation by ID."""
    convo = get_conversation(session_id)
    if not convo:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return convo

@app.delete("/conversations/{session_id}")
def remove_conversation(session_id: str):
    """Delete a conversation by ID."""
    success = delete_conversation(session_id)
    if not success:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return {"message": f"Conversation {session_id} deleted"}

# ------------------------------------------------ #

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)
