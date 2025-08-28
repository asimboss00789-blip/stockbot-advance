from transformers import pipeline
import requests
from bs4 import BeautifulSoup

# Hugging Face GPT-2 pipeline for free text generation
generator = pipeline("text-generation", model="gpt2")

def scrape_text(query: str) -> str:
    """
    Scrapes first few paragraphs from Wikipedia for the query.
    """
    try:
        url = f"https://en.wikipedia.org/wiki/{query.replace(' ', '_')}"
        res = requests.get(url, timeout=5)
        if res.status_code != 200:
            return ""
        soup = BeautifulSoup(res.text, "html.parser")
        paragraphs = soup.find_all('p')
        text = " ".join(p.get_text() for p in paragraphs[:3])
        return text
    except Exception:
        return ""

def generate_answer(user_input: str) -> str:
    """
    Generates a smart answer by combining scraped info and AI reasoning.
    """
    extra_info = scrape_text(user_input)
    prompt = f"""
You are an expert AI assistant. Use the following info to answer the user's question:
User question: {user_input}
Extra info: {extra_info}
Answer clearly and concisely:
"""
    output = generator(prompt, max_length=300, do_sample=True)
    return output[0]['generated_text']

# Example test
if __name__ == "__main__":
    question = input("Enter your question: ")
    answer = generate_answer(question)
    print("\nAI Answer:\n")
    print(answer)
