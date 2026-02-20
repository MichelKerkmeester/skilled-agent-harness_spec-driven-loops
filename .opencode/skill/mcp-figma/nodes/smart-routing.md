---
description: "Intent-based resource routing logic for loading Figma skill references on demand."
---
# Smart Routing

Controls which references and assets are loaded based on the user's intent, using weighted keyword scoring and tiered loading levels.

## Resource Loading Levels

| Level       | When to Load             | Resources                    |
| ----------- | ------------------------ | ---------------------------- |
| ALWAYS      | Every skill invocation   | Quick start baseline         |
| CONDITIONAL | If intent signals match  | Tool and category references |
| ON_DEMAND   | Only on explicit request | Full-reference materials     |

## Smart Router Pseudocode

The authoritative routing logic for scoped loading, weighted intent scoring, and ambiguity handling.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/quick_start.md"

INTENT_SIGNALS = {
    "QUICK_START": {"weight": 4, "keywords": ["first use", "setup", "verify", "token", "getting started"]},
    "TOOL_REFERENCE": {"weight": 4, "keywords": ["which tool", "all tools", "parameters", "components", "styles", "comments", "export"]},
}

RESOURCE_MAP = {
    "QUICK_START": ["references/quick_start.md"],
    "TOOL_REFERENCE": ["references/tool_reference.md", "assets/tool_categories.md"],
}

LOADING_LEVELS = {
    "ALWAYS": [DEFAULT_RESOURCE],
    "ON_DEMAND_KEYWORDS": ["full reference", "deep dive", "all figma tools"],
    "ON_DEMAND": ["references/tool_reference.md", "assets/tool_categories.md"],
}

def _task_text(task) -> str:
    parts = [
        str(getattr(task, "query", "")),
        str(getattr(task, "text", "")),
        " ".join(getattr(task, "keywords", []) or []),
    ]
    return " ".join(parts).lower()

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(p for p in base.rglob("*.md") if p.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def score_intents(task) -> dict[str, float]:
    """Weighted intent scoring from request text and signals."""
    text = _task_text(task)
    scores = {intent: 0.0 for intent in INTENT_SIGNALS}
    for intent, cfg in INTENT_SIGNALS.items():
        for keyword in cfg["keywords"]:
            if keyword in text:
                scores[intent] += cfg["weight"]
    if getattr(task, "is_first_use", False):
        scores["QUICK_START"] += 4
    if getattr(task, "needs_tool_discovery", False) or getattr(task, "needs_full_reference", False):
        scores["TOOL_REFERENCE"] += 4
    return scores

def select_intents(scores: dict[str, float], ambiguity_delta: float = 1.0, max_intents: int = 2) -> list[str]:
    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    if not ranked or ranked[0][1] <= 0:
        return ["QUICK_START"]
    selected = [ranked[0][0]]
    if len(ranked) > 1 and ranked[1][1] > 0 and (ranked[0][1] - ranked[1][1]) <= ambiguity_delta:
        selected.append(ranked[1][0])
    return selected[:max_intents]

def route_figma_resources(task):
    inventory = discover_markdown_resources()
    intents = select_intents(score_intents(task), ambiguity_delta=1.0)
    loaded = []
    seen = set()

    def load_if_available(relative_path: str) -> None:
        guarded = _guard_in_skill(relative_path)
        if guarded in inventory and guarded not in seen:
            load(guarded)
            loaded.append(guarded)
            seen.add(guarded)

    for relative_path in LOADING_LEVELS["ALWAYS"]:
        load_if_available(relative_path)
    for intent in intents:
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)

    text = _task_text(task)
    if any(keyword in text for keyword in LOADING_LEVELS["ON_DEMAND_KEYWORDS"]):
        for relative_path in LOADING_LEVELS["ON_DEMAND"]:
            load_if_available(relative_path)

    if not loaded:
        load_if_available(DEFAULT_RESOURCE)

    return {"intents": intents, "resources": loaded}
```

## Cross References
- [[when-to-use]] -- Activation triggers that feed into intent scoring
- [[related-resources]] -- The resources loaded by this router