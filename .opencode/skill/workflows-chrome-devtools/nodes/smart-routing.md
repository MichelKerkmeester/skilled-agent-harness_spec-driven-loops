---
description: "Smart routing logic for resource loading: intent scoring, loading levels, and routing pseudocode"
---
# Smart Routing

Defines the resource loading strategy and intent scoring system that determines which reference files to load based on the user's request.

## Resource Loading Levels

| Level       | When to Load             | Resources                       |
| ----------- | ------------------------ | ------------------------------- |
| ALWAYS      | Every skill invocation   | Core CDP pattern reference      |
| CONDITIONAL | If intent signals match  | CLI/MCP/session/troubleshooting |
| ON_DEMAND   | Only on explicit request | Full diagnostics set            |

## Smart Router Pseudocode

The authoritative routing logic for scoped loading, weighted intent scoring, and ambiguity handling.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/cdp_patterns.md"

INTENT_SIGNALS = {
    "CLI": {"weight": 4, "keywords": ["bdg", "browser-debugger-cli", "terminal", "cli"]},
    "MCP": {"weight": 4, "keywords": ["mcp", "code mode", "multi-tool", "parallel sessions"]},
    "INSTALL": {"weight": 4, "keywords": ["install", "setup", "not installed", "command -v bdg"]},
    "TROUBLESHOOT": {"weight": 4, "keywords": ["error", "failed", "troubleshoot", "session issue"]},
    "AUTOMATION": {"weight": 3, "keywords": ["ci", "pipeline", "automation", "production"]},
}

RESOURCE_MAP = {
    "CLI": ["references/cdp_patterns.md", "references/session_management.md"],
    "MCP": ["references/session_management.md", "references/cdp_patterns.md"],
    "INSTALL": ["references/troubleshooting.md"],
    "TROUBLESHOOT": ["references/troubleshooting.md"],
    "AUTOMATION": ["examples/README.md"],
}

LOADING_LEVELS = {
    "ALWAYS": [DEFAULT_RESOURCE],
    "ON_DEMAND_KEYWORDS": ["full troubleshooting", "full session guide", "all patterns"],
    "ON_DEMAND": ["references/troubleshooting.md", "references/session_management.md"],
}

def _task_text(task) -> str:
    parts = [
        str(getattr(task, "text", "")),
        str(getattr(task, "query", "")),
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
    docs.extend(p for p in (SKILL_ROOT / "examples").rglob("*.md") if (SKILL_ROOT / "examples").exists())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def score_intents(task) -> dict[str, float]:
    """Weighted intent scoring from request text and capability signals."""
    text = _task_text(task)
    scores = {intent: 0.0 for intent in INTENT_SIGNALS}
    for intent, cfg in INTENT_SIGNALS.items():
        for keyword in cfg["keywords"]:
            if keyword in text:
                scores[intent] += cfg["weight"]
    if getattr(task, "cli_available", False):
        scores["CLI"] += 5
    if getattr(task, "code_mode_configured", False):
        scores["MCP"] += 4
    if getattr(task, "has_error", False):
        scores["TROUBLESHOOT"] += 4
    return scores

def select_intents(scores: dict[str, float], ambiguity_delta: float = 1.0, max_intents: int = 2) -> list[str]:
    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    if not ranked or ranked[0][1] <= 0:
        return ["CLI"]
    selected = [ranked[0][0]]
    if len(ranked) > 1 and ranked[1][1] > 0 and (ranked[0][1] - ranked[1][1]) <= ambiguity_delta:
        selected.append(ranked[1][0])
    return selected[:max_intents]

def route_chrome_devtools_resources(task):
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
- [[when-to-use|When To Use]] -- Activation triggers that feed into routing
- [[routing-decision|Routing Decision]] -- CLI vs MCP approach selection