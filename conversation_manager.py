import json
from pathlib import Path

class ConversationManager:
    def __init__(self, file_path='conversations.json', max_conversations=10, max_messages=70):
        self.file_path = Path(file_path)
        self.max_conversations = max_conversations
        self.max_messages = max_messages
        self.conversations = {}
        self._load_conversations()

    def _load_conversations(self):
        if self.file_path.exists():
            with open(self.file_path, 'r', encoding='utf-8') as f:
                self.conversations = json.load(f)
        else:
            self.conversations = {}

    def _write_to_file(self):
        with open(self.file_path, 'w', encoding='utf-8') as f:
            json.dump(self.conversations, f, ensure_ascii=False, indent=2)

    def save_conversation(self, conv_id, messages):
        # Trim messages to max_messages
        if len(messages) > self.max_messages:
            messages = messages[-self.max_messages:]

        self.conversations[conv_id] = messages

        # Trim to max_conversations
        if len(self.conversations) > self.max_conversations:
            oldest_keys = list(self.conversations.keys())[:len(self.conversations) - self.max_conversations]
            for key in oldest_keys:
                del self.conversations[key]

        self._write_to_file()

    def get_conversation(self, conv_id):
        return self.conversations.get(conv_id, [])

    def delete_conversation(self, conv_id):
        if conv_id in self.conversations:
            del self.conversations[conv_id]
            self._write_to_file()
