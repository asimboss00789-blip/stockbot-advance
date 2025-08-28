from typing import List, Dict, Any
import re

# Track these names in incoming news items (extend as you wish)
BILLIONAIRE_NAMES = [
    "Elon Musk", "Jeff Bezos", "Warren Buffett", "Bill Gates",
    "Larry Ellison", "Bernard Arnault", "Mark Zuckerberg",
    "Larry Page", "Sergey Brin", "Tim Cook", "Jensen Huang",
    "Peter Thiel", "Ray Dalio", "Ken Griffin", "Michael Bloomberg"
]

# Simple matcher
def extract_billionaire_mentions(items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    results = []
    for it in items:
        text = " ".join([
            it.get("title",""),
            it.get("summary","")
        ])
        mentioned = [name for name in BILLIONAIRE_NAMES if re.search(rf"\b{name}\b", text, re.IGNORECASE)]
        if mentioned:
            results.append({
                **it,
                "billionaires": mentioned
            })
    return results
