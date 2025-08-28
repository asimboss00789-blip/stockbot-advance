# news_fetcher.py
"""
news_fetcher: lightweight RSS + NewsAPI fetcher with fallback.
No external dependencies required (only `requests` and stdlib).
Functions:
 - fetch_rss(limit_per_feed=10) -> aggregate configured RSS_FEEDS
 - fetch_google_news_rss(query, limit=10) -> Google News RSS (no API)
 - fetch_newsapi(query, limit=10) -> NewsAPI if NEWS_API_KEY present
 - fetch_with_fallback(query=None, limit=10) -> NewsAPI -> Google RSS -> fetch_rss()
Return format (list of dicts):
{
  "source": str,
  "title": str,
  "link": str,
  "summary": str,
  "published": str,
  "tags": list[str],
  "fetched_at": int (unix epoch)
}
"""

import os
import time
import requests
import xml.etree.ElementTree as ET
from typing import List, Dict, Any
from html import unescape
from urllib.parse import quote_plus

# Minimal set of government + policy/market feeds (you can extend)
RSS_FEEDS = [
    "https://www.whitehouse.gov/briefing-room/feed/",
    "https://home.treasury.gov/news/press-releases/feed",
    "https://www.defense.gov/Newsroom/News/News-Stories/News-Stories/rss/",
    "https://www.state.gov/feed/",
    "https://www.federalreserve.gov/feeds/press_all.xml",
    "https://www.reuters.com/politics/rss.xml",
    "https://apnews.com/hub/ap-top-news?outputType=xml",
    "https://www.politico.com/rss/politics-news.xml",
    "https://ec.europa.eu/commission/presscorner/home/en?format=rss"
]

HEADERS = {"User-Agent": "Lumina-NewsFetcher/1.0 (+https://example.com)"}
NEWSAPI_KEY = os.getenv("NEWS_API_KEY", "").strip()


def _safe_text(elem):
    if elem is None:
        return ""
    # .text may be None for some elements
    txt = elem.text or ""
    return unescape(txt).strip()


def _extract_text_by_tags(item, candidates):
    """Return first non-empty text for any tag name in candidates (case-insensitive)."""
    for tag in candidates:
        # try direct (no namespace)
        el = item.find(tag)
        if el is not None and (el.text and el.text.strip()):
            return unescape(el.text.strip())
        # try searching ignoring namespace
        for child in list(item):
            name = child.tag
            if name is None:
                continue
            if name.lower().endswith(tag.lower()):
                if child.text and child.text.strip():
                    return unescape(child.text.strip())
    return ""


def _extract_link(item):
    # RSS: <link>http...</link> OR Atom: <link href="..."/>
    link_el = item.find("link")
    if link_el is not None:
        # Atom style: <link href="..."/>
        href = link_el.get("href")
        if href:
            return href.strip()
        # otherwise text inside link
        if link_el.text and link_el.text.strip():
            return link_el.text.strip()

    # look for any 'link'-like child with href attribute
    for child in list(item):
        tag = child.tag.lower()
        if tag.endswith("link"):
            href = child.get("href") or child.text
            if href:
                return href.strip()

    # fallback: find any <guid> child
    guid = item.find("guid")
    if guid is not None and guid.text:
        return guid.text.strip()

    return ""


def _extract_categories(item):
    cats = []
    for c in item.findall("category"):
        if c.text and c.text.strip():
            cats.append(c.text.strip())
    # try namespaced <category> or other tags
    for child in list(item):
        if child.tag.lower().endswith("category") and child.text:
            if child.text.strip() not in cats:
                cats.append(child.text.strip())
    return cats


def parse_rss_items(xml_text: str, source_name: str = "") -> List[Dict[str, Any]]:
    out = []
    try:
        root = ET.fromstring(xml_text)
    except Exception:
        return out

    # find items (RSS) or entries (Atom)
    items = root.findall(".//item") + root.findall(".//entry")
    fetched_at = int(time.time())

    for it in items:
        title = _extract_text_by_tags(it, ["title"])
        link = _extract_link(it)
        summary = _extract_text_by_tags(it, ["description", "summary", "{http://purl.org/rss/1.0/modules/content/}encoded", "content"])
        if not summary:
            # try to collect text from first paragraph children
            texts = []
            for child in list(it):
                if child.text:
                    texts.append(child.text.strip())
            summary = " ".join(texts[:2])[:800]  # trim

        published = _extract_text_by_tags(it, ["pubDate", "published", "updated", "dc:date"])
        tags = _extract_categories(it)

        out.append(
            {
                "source": source_name or "",
                "title": title,
                "link": link,
                "summary": summary,
                "published": published,
                "tags": tags,
                "fetched_at": fetched_at,
            }
        )
    return out


def fetch_rss(limit_per_feed: int = 8) -> List[Dict[str, Any]]:
    """
    Aggregate items from RSS_FEEDS (no external libs).
    Returns a list of items (no particular order).
    """
    aggregated: List[Dict[str, Any]] = []
    fetched_at = int(time.time())

    for url in RSS_FEEDS:
        try:
            resp = requests.get(url, headers=HEADERS, timeout=10)
            if resp.status_code != 200 or not resp.text:
                continue
            items = parse_rss_items(resp.text, source_name=url)
            if items:
                aggregated.extend(items[:limit_per_feed])
        except Exception:
            # ignore single-feed failure
            continue

    # optionally sort by fetched_at (all same), or by 'published' if parse-able - skip for simplicity
    return aggregated


# ---------------------------
# Google News RSS fallback (no extra libs)
# ---------------------------
def fetch_google_news_rss(query: str, limit: int = 8) -> List[Dict[str, Any]]:
    """Query Google News RSS and parse results"""
    safe_q = quote_plus(query)
    rss_url = f"https://news.google.com/rss/search?q={safe_q}&hl=en-US&gl=US&ceid=US:en"
    try:
        resp = requests.get(rss_url, headers=HEADERS, timeout=10)
        if resp.status_code != 200 or not resp.text:
            return []
        return parse_rss_items(resp.text, source_name="Google News RSS")[:limit]
    except Exception:
        return []


# ---------------------------
# NewsAPI (optional, needs NEWSAPI_KEY env var)
# ---------------------------
def fetch_newsapi(query: str, limit: int = 8) -> List[Dict[str, Any]]:
    """
    Use NewsAPI.org (requires NEWS_API_KEY environment variable).
    This will throw an exception or return empty if no key or request fails.
    """
    key = NEWSAPI_KEY
    if not key:
        raise RuntimeError("NEWS_API_KEY not set")

    url = "https://newsapi.org/v2/everything"
    params = {"q": query, "pageSize": limit, "language": "en", "sortBy": "publishedAt", "apiKey": key}
    try:
        resp = requests.get(url, params=params, headers=HEADERS, timeout=10)
        if resp.status_code != 200:
            raise RuntimeError(f"NewsAPI error {resp.status_code}")
        data = resp.json()
        articles = []
        fetched_at = int(time.time())
        for a in data.get("articles", []):
            articles.append(
                {
                    "source": a.get("source", {}).get("name", "NewsAPI"),
                    "title": a.get("title", ""),
                    "link": a.get("url", ""),
                    "summary": a.get("description", "") or a.get("content", ""),
                    "published": a.get("publishedAt", ""),
                    "tags": [],
                    "fetched_at": fetched_at,
                }
            )
        return articles
    except Exception as e:
        raise


# ---------------------------
# High-level helper: try NewsAPI then Google RSS then aggregate RSS
# ---------------------------
def fetch_with_fallback(query: str = None, limit: int = 8) -> List[Dict[str, Any]]:
    """
    If query is provided and NEWS_API_KEY exists, try NewsAPI first.
    If that fails (rate-limit or other), fallback to Google News RSS.
    If no query provided, return aggregated configured RSS_FEEDS (fetch_rss).
    """
    # no query -> return aggregated feeds
    if not query:
        return fetch_rss(limit_per_feed=limit)

    # try NewsAPI first if key present
    if NEWSAPI_KEY:
        try:
            return fetch_newsapi(query, limit=limit)
        except Exception:
            # fallback silently to Google News RSS
            pass

    # fallback to Google News RSS
    google = fetch_google_news_rss(query, limit=limit)
    if google:
        return google

    # final fallback -> return aggregated feeds
    return fetch_rss(limit_per_feed=limit)


# Exports
__all__ = ["fetch_rss", "fetch_google_news_rss", "fetch_newsapi", "fetch_with_fallback"]
