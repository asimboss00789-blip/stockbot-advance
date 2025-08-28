import os
import json
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from collections import deque
from typing import Dict, List
from app.ai_researcher import generate_response  # your AI code

PORT = int(os.environ.get("PORT", 10000))

app = FastAPI(title="AI Web Researcher Bot")

CONVERSATION_FILE = "conversation.json"
MAX_CONVERSATIONS = 10
MAX_MESSAGES = 70

# Load conversation data or initialize
if os.path.exists(CONVERSATION_FILE):
    with open(CONVERSATION_FILE, "r") as f:
        conversation_data: Dict[str, List[Dict]] = json.load(f)
else:
    conversation_data = {}

class Prompt(BaseModel):
    session_id: str
    bot_name: str
    text: str

class DeleteConversation(BaseModel):
    session_id: str
    bot_name: str

def save_conversations():
    with open(CONVERSATION_FILE, "w") as f:
        json.dump(conversation_data, f, indent=2)

def get_or_create_bot(session_id: str, bot_name: str):
    user_bots = conversation_data.setdefault(session_id, [])
    
    # Check if bot already exists
    for bot in user_bots:
        if bot["bot_name"] == bot_name:
            return bot
    
    # Create new bot conversation
    if len(user_bots) >= MAX_CONVERSATIONS:
        user_bots.pop(0)  # Remove oldest bot
    
    new_bot = {
        "bot_name": bot_name,
        "messages": []
    }
    user_bots.append(new_bot)
    return new_bot

@app.post("/generate")
async def generate(prompt: Prompt):
    bot_conversation = get_or_create_bot(prompt.session_id, prompt.bot_name)
    messages = bot_conversation["messages"]
    
    # Append user message
    messages.append({"role": "user", "content": prompt.text})
    if len(messages) > MAX_MESSAGES:
        messages.pop(0)  # Remove oldest message
    
    try:
        ai_output = await generate_response(prompt.text, messages)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    messages.append({"role": "assistant", "content": ai_output})
    
    save_conversations()
    
    return {"response": ai_output, "memory_length": len(messages)}

@app.post("/delete_conversation")
async def delete_conversation(data: DeleteConversation):
    user_bots = conversation_data.get(data.session_id, [])
    for i, bot in enumerate(user_bots):
        if bot["bot_name"] == data.bot_name:
            user_bots.pop(i)
            save_conversations()
            return {"status": "deleted"}
    raise HTTPException(status_code=404, detail="Conversation not found")

@app.get("/list_bots/{session_id}")
async def list_bots(session_id: str):
    user_bots = conversation_data.get(session_id, [])
    return {"bots": [bot["bot_name"] for bot in user_bots]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)
