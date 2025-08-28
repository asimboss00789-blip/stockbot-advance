from typing import List, Dict, Any
import re

# Very simple signal mapping. Expand as needed.
SECTOR_SIGNALS = [
    # China / rare earth / critical minerals
    {
        "name": "Critical Minerals / Rare Earths",
        "keywords": ["rare earth", "critical mineral", "lithium", "cobalt", "nickel", "neodymium", "supply chain", "export controls", "tariff", "sanction"],
        "implication": "Potential impact on miners (lithium, cobalt, nickel), EV supply chain, magnet producers."
    },
    # Ukraine / defense
    {
        "name": "Defense / Ukraine War",
        "keywords": ["Ukraine", "NATO", "military aid", "missile defense", "Patriot", "F-16", "artillery", "defense budget"],
        "implication": "Possible tailwind for defense contractors, aerospace, ammunition manufacturers."
    },
    # Semiconductors / export controls
    {
        "name": "Semiconductors & AI",
        "keywords": ["semiconductor", "chip", "ASML", "TSMC", "export control", "AI compute", "GPU", "foundry"],
        "implication": "Impacts chip makers, equipment suppliers, and AI hardware ecosystem."
    },
    # Energy policy
    {
        "name": "Energy Policy",
        "keywords": ["OPEC", "SPR release", "oil price cap", " LNG ", "renewable", "solar subsidy", "wind tax credit"],
        "implication": "Could move oil & gas, LNG exporters, or renewables depending on policy."
    },
    # Sanctions / tariffs
    {
        "name": "Trade Policy / Tariffs",
        "keywords": ["tariff", "sanction", "export ban", "entity list", "WTO", "trade dispute"],
        "implication": "Supply chain shifts; import/export-sensitive sectors react."
    },
]

def score_item(text: str, keywords: List[str]) -> int:
    score = 0
    for kw in keywords:
        if re.search(rf"\b{re.escape(kw)}\b", text, re.IGNORECASE):
            score += 1
    return score

def generate_signals(items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    signals = []
    for it in items:
        text = " ".join([it.get("title",""), it.get("summary","")])
        hits = []
        for rule in SECTOR_SIGNALS:
            s = score_item(text, rule["keywords"])
            if s > 0:
                hits.append({
                    "theme": rule["name"],
                    "score": s,
                    "implication": rule["implication"]
                })
        if hits:
            hits.sort(key=lambda x: x["score"], reverse=True)
            signals.append({
                "title": it.get("title",""),
                "link": it.get("link",""),
                "source": it.get("source",""),
                "published": it.get("published",""),
                "hits": hits[:3]
            })
    # Sort strongest first
    signals.sort(key=lambda s: sum(h["score"] for h in s["hits"]), reverse=True)
    return signals
