import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from collections import deque
from typing import Dict
from app.ai_researcher import generate_response  # Your AI logic
from conversation_manager import ConversationManager

PORT = int(os.environ.get("PORT", 10000))  # Render-provided port
CONV_FILE = "conversations.json"

app = FastAPI(title="AI Web Researcher Bot")

# Initialize conversation manager
conv_manager = ConversationManager(CONV_FILE, max_conversations_per_user=10)

# Store active conversation memory in runtime (deque for each bot/session)
active_memory: Dict[str, Dict[str, deque]] = {}

class Prompt(BaseModel):
    session_id: str  # Identify user/session
    bot_id: str      # Identify which AI bot (Lumina, StockBot, etc.)
    text: str

class DeleteRequest(BaseModel):
    session_id: str
    bot_id: str

@app.post("/generate")
async def generate(prompt: Prompt):
    # Ensure session/bot memory exists
    if prompt.session_id not in active_memory:
        active_memory[prompt.session_id] = {}
    if prompt.bot_id not in active_memory[prompt.session_id]:
        # Load past conversation from JSON if exists
        past_memory = conv_manager.get_conversation(prompt.session_id, prompt.bot_id)
        active_memory[prompt.session_id][prompt.bot_id] = deque(past_memory, maxlen=70)

    memory = active_memory[prompt.session_id][prompt.bot_id]
    memory.append({"role": "user", "content": prompt.text})

    try:
        # Generate AI response
        ai_output = await generate_response(prompt.text, memory)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    memory.append({"role": "assistant", "content": ai_output})

    # Update persistent storage
    conv_manager.update_conversation(prompt.session_id, prompt.bot_id, memory)

    return {"response": ai_output, "memory_length": len(memory)}

@app.post("/delete_conversation")
async def delete_conversation(req: DeleteRequest):
    conv_manager.delete_conversation(req.session_id, req.bot_id)

    # Also remove from active memory
    if req.session_id in active_memory and req.bot_id in active_memory[req.session_id]:
        del active_memory[req.session_id][req.bot_id]

    return {"status": "deleted"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)
