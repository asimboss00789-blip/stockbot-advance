import json
import os
import uuid
from datetime import datetime
from typing import Dict, Any, List

CONVERSATION_FILE = "conversations.json"
MAX_CONVERSATIONS = 10  # keep only last 10 conversations


def _load_data() -> Dict[str, Any]:
    """Load conversation data from JSON file."""
    if not os.path.exists(CONVERSATION_FILE):
        return {"conversations": []}
    with open(CONVERSATION_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def _save_data(data: Dict[str, Any]) -> None:
    """Save conversation data back to JSON file."""
    with open(CONVERSATION_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


def save_conversation(messages: List[Dict[str, str]]) -> str:
    """Save a new conversation and return its ID."""
    data = _load_data()
    conv_id = str(uuid.uuid4())
    conversation = {
        "id": conv_id,
        "created_at": datetime.utcnow().isoformat(),
        "messages": messages,
    }
    data["conversations"].append(conversation)

    # Keep only latest N conversations
    if len(data["conversations"]) > MAX_CONVERSATIONS:
        data["conversations"] = data["conversations"][-MAX_CONVERSATIONS:]

    _save_data(data)
    return conv_id


def get_conversations() -> List[Dict[str, Any]]:
    """Get all conversations metadata (id + created_at)."""
    data = _load_data()
    return [{"id": c["id"], "created_at": c["created_at"]} for c in data["conversations"]]


def get_conversation(conv_id: str) -> Dict[str, Any]:
    """Get a single conversation by ID."""
    data = _load_data()
    for conv in data["conversations"]:
        if conv["id"] == conv_id:
            return conv
    return {}


def delete_conversation(conv_id: str) -> bool:
    """Delete a conversation by ID."""
    data = _load_data()
    before = len(data["conversations"])
    data["conversations"] = [c for c in data["conversations"] if c["id"] != conv_id]
    after = len(data["conversations"])
    _save_data(data)
    return before != after
