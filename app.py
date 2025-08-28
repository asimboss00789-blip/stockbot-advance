import os
import json
import datetime
import requests
from prompts import ALL_PROMPTS  # your mega prompts file

# ----------------- Conversation Manager -----------------
class ConversationManager:
    def __init__(self, file_path, max_conversations=10, max_messages=70):
        self.file_path = file_path
        self.max_conversations = max_conversations
        self.max_messages = max_messages
        self._load_conversations()

    def _load_conversations(self):
        if os.path.exists(self.file_path):
            with open(self.file_path, "r") as f:
                self.conversations = json.load(f)
        else:
            self.conversations = {}

    def save_conversation(self, user_id, conversation):
        if len(conversation) > self.max_messages:
            conversation = conversation[-self.max_messages:]
        self.conversations[user_id] = conversation

        if len(self.conversations) > self.max_conversations:
            oldest_user = list(self.conversations.keys())[0]
            del self.conversations[oldest_user]

        self._write_to_file()

    def _write_to_file(self):
        with open(self.file_path, "w") as f:
            json.dump(self.conversations, f, indent=4)

    def get_conversation(self, user_id):
        return self.conversations.get(user_id, [])

# ----------------- News Fetcher Mega -----------------
class NewsFetcher:
    def __init__(self):
        self.api_keys = {
            "newsapi": os.getenv("NEWSAPI_KEY"),
            "gnews": os.getenv("GNEWS_KEY"),
            "newsdata": os.getenv("NEWSDATA_KEY"),
            "huggingface": os.getenv("HUGGINGFACE_KEY"),
            "groq": os.getenv("GROQ_KEY")
        }
        self.daily_limits = {
            "newsapi": 100,
            "gnews": 100,
            "newsdata": 200,
            "huggingface": 50,
            "groq": 50
        }
        self.usage_today = {api: 0 for api in self.api_keys}
        self.cache_file = "news_cache.json"
        self._load_cache()

    def _load_cache(self):
        if os.path.exists(self.cache_file):
            with open(self.cache_file, "r") as f:
                self.cache = json.load(f)
        else:
            self.cache = []

    def _save_cache(self):
        with open(self.cache_file, "w") as f:
            json.dump(self.cache, f, indent=4)

    def fetch_all(self, query=""):
        results = []

        # Loop through all APIs
        for api in self.api_keys:
            if self.usage_today[api] >= self.daily_limits[api]:
                continue  # skip if limit reached

            try:
                fetch_func = getattr(self, f"_fetch_{api}")
                data = fetch_func(query)
                if data:
                    results.extend(data)
                    self.usage_today[api] += 1
            except Exception as e:
                print(f"[{api} fetch error]: {e}")
                continue  # fail-safe: move to next API

        # If all APIs exhausted, return cache
        if not results:
            results = self.cache[-50:]  # last 50 cached articles

        # Update cache
        self.cache.extend(results)
        self._save_cache()
        return results

    # ----------------- API-specific fetchers -----------------
    def _fetch_newsapi(self, query):
        url = f"https://newsapi.org/v2/everything?q={query}&apiKey={self.api_keys['newsapi']}&pageSize=10"
        r = requests.get(url).json()
        return [article for article in r.get("articles", [])]

    def _fetch_gnews(self, query):
        url = f"https://gnews.io/api/v4/search?q={query}&token={self.api_keys['gnews']}&max=10"
        r = requests.get(url).json()
        return [article for article in r.get("articles", [])]

    def _fetch_newsdata(self, query):
        url = f"https://newsdata.io/api/1/news?apikey={self.api_keys['newsdata']}&q={query}&language=en"
        r = requests.get(url).json()
        return r.get("results", [])

    def _fetch_huggingface(self, query):
        url = f"https://api-inference.huggingface.co/models/facebook/bart-large-mnli"
        headers = {"Authorization": f"Bearer {self.api_keys['huggingface']}"}
        # Example: returning empty for now, customize if model supports news
        return []

    def _fetch_groq(self, query):
        url = f"https://api.groq.com/news?query={query}"
        headers = {"Authorization": f"Bearer {self.api_keys['groq']}"}
        # Example: returning empty for now, customize with actual Groq news endpoint
        return []

# ----------------- GPT Handler -----------------
class GPTHandler:
    def __init__(self, prompts_file="prompts.py"):
        from prompts import ALL_PROMPTS
        self.prompts = ALL_PROMPTS

    def respond(self, user_input, context=None):
        # Here you can integrate your mega GPT logic
        # Use self.prompts as needed
        response = f"Simulated GPT response for input: {user_input}"
        return response

# ----------------- Main App -----------------
if __name__ == "__main__":
    conv_manager = ConversationManager("conversations.json")
    news_fetcher = NewsFetcher()
    gpt_handler = GPTHandler()

    user_id = "user123"
    user_input = "Tell me latest news about US government and billionaires"
    
    # Get previous conversation
    conv = conv_manager.get_conversation(user_id)

    # GPT response
    gpt_response = gpt_handler.respond(user_input, context=conv)
    conv.append({"user": user_input, "gpt": gpt_response})

    # Save conversation
    conv_manager.save_conversation(user_id, conv)

    # Fetch news
    news_articles = news_fetcher.fetch_all(query="US government OR billionaires")
    print(f"Top news fetched: {len(news_articles)} articles")
