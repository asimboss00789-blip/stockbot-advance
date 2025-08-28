import os
import requests
from typing import List, Dict, Any

GOVINFO_API_KEY = os.environ.get("GOVINFO_API_KEY", "")

def try_govinfo_search(query: str, page_size: int = 20) -> List[Dict[str, Any]]:
    if not GOVINFO_API_KEY:
        return []
    try:
        resp = requests.get(
            "https://api.govinfo.gov/search",
            params={"query": query, "pageSize": page_size, "api_key": GOVINFO_API_KEY},
            timeout=10
        )
        resp.raise_for_status()
        data = resp.json()
        out = []
        for d in data.get("results", []):
            out.append({
                "title": d.get("title",""),
                "date": d.get("dateIssued",""),
                "collection": d.get("collectionCode",""),
                "link": d.get("pdfLink") or d.get("detailsLink") or "",
                "source": "GovInfo API"
            })
        return out
    except Exception:
        return []
