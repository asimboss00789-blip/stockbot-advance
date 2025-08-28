# app.py
import os
from prompts import PROMPTS
from conversation_manager import ConversationManager

# Initialize Conversation Manager (max 10 conversations stored per GPT)
conversation_manager = ConversationManager(max_conversations=10)

class AIResearcher:
    def __init__(self):
        self.current_gpt = "Lumina"  # default GPT
        self.memory = conversation_manager

    def switch_gpt(self, gpt_name: str):
        if gpt_name in PROMPTS:
            self.current_gpt = gpt_name
            return f"Switched to GPT: {gpt_name}"
        return f"GPT '{gpt_name}' not found!"

    def process_input(self, user_input: str):
        prompt = PROMPTS.get(self.current_gpt, "")

        # Retrieve previous conversation history for context
        conversation_history = self.memory.get_conversation(self.current_gpt)

        # Here you would normally send: prompt + conversation_history + user_input to AI
        ai_response = f"[{self.current_gpt}] responds to: {user_input}"

        # Save messages to conversation memory
        self.memory.save_message(self.current_gpt, "user", user_input)
        self.memory.save_message(self.current_gpt, "ai", ai_response)

        return ai_response

    def list_conversations(self):
        # Returns a list of all saved conversation names
        return self.memory.list_conversations()

    def delete_conversation(self, gpt_name: str):
        return self.memory.delete_conversation(gpt_name)

if __name__ == "__main__":
    ai = AIResearcher()
    print("Welcome to AI Researcher! Type 'exit' to quit.")
    print("Available GPTs:", ", ".join(PROMPTS.keys()))

    while True:
        user_input = input("You: ").strip()

        if user_input.lower() in ["exit", "quit"]:
            break

        # Switch GPT command
        if user_input.startswith("/switch"):
            parts = user_input.split(maxsplit=1)
            if len(parts) > 1:
                print(ai.switch_gpt(parts[1]))
            else:
                print("Usage: /switch [GPT name]")
            continue

        # List conversations
        if user_input.startswith("/list"):
            conversations = ai.list_conversations()
            print("Saved Conversations:", conversations)
            continue

        # Delete a conversation
        if user_input.startswith("/delete"):
            parts = user_input.split(maxsplit=1)
            if len(parts) > 1:
                print(ai.delete_conversation(parts[1]))
            else:
                print("Usage: /delete [GPT name]")
            continue

        # Regular AI input
        response = ai.process_input(user_input)
        print(f"AI: {response}")
