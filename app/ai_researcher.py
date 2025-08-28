import requests
from bs4 import BeautifulSoup
from transformers import pipeline

# Initialize Hugging Face summarization model
summarizer = pipeline("summarization")

def fetch_text_from_url(url: str) -> str:
    """
    Fetches all visible text from a web page.
    """
    response = requests.get(url)
    soup = BeautifulSoup(response.content, "html.parser")

    # Remove scripts/styles
    for script in soup(["script", "style"]):
        script.decompose()

    # Extract text
    text = " ".join(soup.stripped_strings)
    return text[:4000]  # Limit for model input

def fetch_and_answer(url: str, question: str) -> str:
    """
    Fetches page content, summarizes it, and answers the question.
    """
    text = fetch_text_from_url(url)
    
    # Summarize first
    summary = summarizer(text, max_length=300, min_length=100, do_sample=False)[0]['summary_text']
    
    # Optionally, you can do question answering with another Hugging Face pipeline
    # qa = pipeline("question-answering")
    # answer = qa(question=question, context=text)['answer']
    
    return f"Summary:\n{summary}\n\nQuestion: {question}\nAnswer (based on summary): {summary}"
