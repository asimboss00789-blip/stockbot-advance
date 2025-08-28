import time
from typing import List, Dict, Any
import feedparser

# Free, reliable RSS sources (government & geopolitics heavy)
RSS_FEEDS = [
    # US Government & Policy
    "https://www.whitehouse.gov/briefing-room/feed/",
    "https://home.treasury.gov/news/press-releases/feed",
    "https://www.defense.gov/Newsroom/News/News-Stories/News-Stories/rss/",
    "https://www.state.gov/rss-feed/press-releases/",
    "https://www.federalreserve.gov/feeds/press_all.xml",
    # Major outlets (policy/markets)
    "https://www.reutersagency.com/feed/?best-topics=politics,world,markets&post_type=best",
    "https://apnews.com/hub/ap-top-news?output=rss",
    "https://www.politico.com/rss/politics-news.xml",
    "https://www.nato.int/cps/en/natohq/news_rss.htm",
    # EU (policy impacts across supply chains)
    "https://ec.europa.eu/commission/presscorner/home/en?format=rss"
]

def fetch_rss() -> List[Dict[str, Any]]:
    items: List[Dict[str, Any]] = []
    fetched_at = int(time.time())
    for url in RSS_FEEDS:
        try:
            feed = feedparser.parse(url)
            for e in feed.entries:
                items.append({
                    "source": feed.feed.get("title", url),
                    "title": e.get("title", ""),
                    "link": e.get("link", ""),
                    "summary": e.get("summary", "") or e.get("description", ""),
                    "published": e.get("published", ""),
                    "tags": [t["term"] for t in e.get("tags", [])] if e.get("tags") else [],
                    "fetched_at": fetched_at
                })
        except Exception:
            # Keep running even if one feed fails
            continue
    return items
