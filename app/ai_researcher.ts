# web_ai_assistant.py

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
import time
from transformers import AutoModelForCausalLM, AutoTokenizer

def search_web(query: str, num_results: int = 1):
    """Perform a Google search and return page sources of top results."""
    options = Options()
    options.add_argument("--headless")  # Run Chrome in headless mode
    options.add_argument("--disable-gpu")
    
    driver = webdriver.Chrome(options=options)  # Make sure chromedriver is installed
    driver.get("https://www.google.com")

    search_box = driver.find_element("name", "q")
    search_box.send_keys(query)
    search_box.send_keys(Keys.RETURN)
    time.sleep(3)  # wait for results to load

    pages = []
    results = driver.find_elements("css selector", 'h3')
    for i, result in enumerate(results[:num_results]):
        result.click()
        time.sleep(2)
        pages.append(driver.page_source)
        driver.back()
        time.sleep(1)

    driver.quit()
    return pages

def summarize_text(text: str, model_name="gpt2"):
    """Use Hugging Face model to summarize text."""
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForCausalLM.from_pretrained(model_name)

    inputs = tokenizer(f"Summarize the following:\n{text}", return_tensors="pt", truncation=True, max_length=1024)
    outputs = model.generate(**inputs, max_length=200)
    summary = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return summary

if __name__ == "__main__":
    query = input("Enter your query: ")
    pages = search_web(query)

    for i, page_content in enumerate(pages):
        print(f"\n--- Summary of Result {i+1} ---")
        summary = summarize_text(page_content)
        print(summary)
