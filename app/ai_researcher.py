# ai_researcher.py

import requests
from bs4 import BeautifulSoup
from transformers import pipeline
from collections import deque
from typing import List, Dict
import random

# -----------------------------
# 1️⃣ Conversation Memory
# -----------------------------
class ConversationMemory:
    def __init__(self, max_messages=70):
        self.max_messages = max_messages
        self.messages = deque(maxlen=max_messages)  # automatically discards oldest

    def add_message(self, role: str, content: str):
        self.messages.append({"role": role, "content": content})

    def get_context(self) -> List[Dict[str, str]]:
        return list(self.messages)

# -----------------------------
# 2️⃣ NLP Pipelines
# -----------------------------
# Sentiment Analysis
sentiment_analyzer = pipeline("sentiment-analysis")

# Named Entity Recognition
ner_analyzer = pipeline("ner", grouped_entities=True)

# Summarization (for long news/articles)
summarizer = pipeline("summarization")

# Topic Modeling Helper (basic)
def extract_keywords(text: str, top_n=5) -> List[str]:
    entities = ner_analyzer(text)
    keywords = [e['word'] for e in entities]
    # deduplicate and select top_n
    return list(dict.fromkeys(keywords))[:top_n]

# -----------------------------
# 3️⃣ Web Scraping Helper
# -----------------------------
def scrape_news(url: str) -> str:
    """
    Scrapes the main text content of a webpage
    """
    try:
        resp = requests.get(url, timeout=10)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, 'html.parser')
        # Get text from paragraphs
        paragraphs = soup.find_all('p')
        content = ' '.join([p.get_text() for p in paragraphs])
        return content[:2000]  # limit for processing
    except Exception as e:
        return f"Error scraping {url}: {str(e)}"

# -----------------------------
# 4️⃣ AI Researcher Main Class
# -----------------------------
class AIResearcher:
    def __init__(self):
        self.memory = ConversationMemory(max_messages=70)

    def process_user_input(self, user_input: str) -> str:
        # Add user message to memory
        self.memory.add_message("user", user_input)

        # Detect if input is a URL to scrape
        if user_input.startswith("http"):
            scraped_text = scrape_news(user_input)
            summary = summarizer(scraped_text, max_length=150, min_length=50, do_sample=False)[0]['summary_text']
            sentiment = sentiment_analyzer(summary)[0]
            entities = ner_analyzer(summary)
            response = (
                f"Summary: {summary}\n"
                f"Sentiment: {sentiment}\n"
                f"Entities: {entities}"
            )
        else:
            # For normal chat, just do sentiment and NER
            sentiment = sentiment_analyzer(user_input)[0]
            entities = ner_analyzer(user_input)
            keywords = extract_keywords(user_input)
            response = (
                f"Sentiment: {sentiment}\n"
                f"Entities: {entities}\n"
                f"Keywords: {keywords}\n"
                f"Answer: Here is a researched answer based on your input..."
            )

        # Add AI response to memory
        self.memory.add_message("ai", response)

        return response

    def get_conversation(self) -> List[Dict[str, str]]:
        return self.memory.get_context()

# -----------------------------
# 5️⃣ Example Usage
# -----------------------------
if __name__ == "__main__":
    ai = AIResearcher()
    print("Welcome to the Lumina! Type 'exit' to quit.")

    while True:
        user_input = input("You: ")
        if user_input.lower() in ["exit", "quit"]:
            break
        response = ai.process_user_input(user_input)
        print(f"AI: {response}")
