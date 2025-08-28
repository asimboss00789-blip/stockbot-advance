import json
from collections import deque
from typing import List

class ConversationManager:
    def __init__(self, filepath: str, max_conversations_per_user: int = 10):
        self.filepath = filepath
        self.max_conversations = max_conversations_per_user
        self._load()

    def _load(self):
        try:
            with open(self.filepath, "r") as f:
                self.data = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            self.data = {}

    def _save(self):
        with open(self.filepath, "w") as f:
            json.dump(self.data, f, indent=2)

    def get_conversation(self, session_id: str, bot_id: str) -> List[dict]:
        """Return conversation messages for a session and bot."""
        return self.data.get(session_id, {}).get(bot_id, [])

    def update_conversation(self, session_id: str, bot_id: str, messages: deque):
        """Update messages and keep only max_conversations per user."""
        if session_id not in self.data:
            self.data[session_id] = {}
        self.data[session_id][bot_id] = list(messages)

        # Limit number of bots stored per user
        if len(self.data[session_id]) > self.max_conversations:
            oldest = list(self.data[session_id].keys())[0]
            del self.data[session_id][oldest]

        self._save()

    def delete_conversation(self, session_id: str, bot_id: str):
        """Delete a specific conversation."""
        if session_id in self.data and bot_id in self.data[session_id]:
            del self.data[session_id][bot_id]
            self._save()
