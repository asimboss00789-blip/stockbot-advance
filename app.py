class ConversationManager:
    def __init__(self, file_path, max_conversations=10, max_messages=70):
        self.file_path = file_path
        self.max_conversations = max_conversations
        self.max_messages = max_messages
        self._load_conversations()

    def save_conversation(self, user_id, conversation):
        # Trim messages to max_messages
        if len(conversation) > self.max_messages:
            conversation = conversation[-self.max_messages:]

        # Save conversation
        self.conversations[user_id] = conversation

        # Trim to max_conversations
        if len(self.conversations) > self.max_conversations:
            # Remove oldest
            oldest_user = list(self.conversations.keys())[0]
            del self.conversations[oldest_user]

        self._write_to_file()
