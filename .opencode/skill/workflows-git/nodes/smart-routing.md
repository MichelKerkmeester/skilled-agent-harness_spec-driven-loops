---
description: "Intent routing logic with weighted scoring, resource loading levels, and disambiguation"
---
# Smart Routing

The routing engine that determines which resources to load based on user intent.

## Resource Loading Levels

| Level       | When to Load             | Resources                  |
| ----------- | ------------------------ | -------------------------- |
| ALWAYS      | Every skill invocation   | Quick reference baseline   |
| CONDITIONAL | If intent signals match  | Setup/commit/finish docs   |
| ON_DEMAND   | Only on explicit request | Extended patterns/templates|

## Smart Router Pseudocode

The authoritative routing logic for scoped loading, weighted intent scoring, and ambiguity handling.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/quick_reference.md"

INTENT_SIGNALS = {
    "WORKSPACE_SETUP": {"weight": 4, "keywords": ["worktree", "workspace", "branch strategy", "parallel work"]},
    "COMMIT": {"weight": 4, "keywords": ["commit", "staged", "message", "conventional commit"]},
    "FINISH": {"weight": 4, "keywords": ["finish", "merge", "pr", "pull request", "integrate"]},
    "SHARED_PATTERNS": {"weight": 3, "keywords": ["convention", "pattern", "reference", "branch naming"]},
}

NOISY_SYNONYMS = {
    "WORKSPACE_SETUP": {"dirty workspace": 2.2, "unclean": 1.4, "mixed changes": 1.5},
    "COMMIT": {"half-staged": 2.0, "boundary": 1.4, "split commit": 1.4},
    "FINISH": {"ship": 1.5, "hotfix": 1.6, "trunk": 1.8, "minimal risk": 1.4},
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm base branch (main/master/trunk)",
    "Confirm whether staged/unstaged changes should be split",
    "Provide required PR policy (squash, template fields, checks)",
    "Confirm hotfix urgency versus cleanup tolerance",
]

RESOURCE_MAP = {
    "WORKSPACE_SETUP": ["references/worktree_workflows.md", "assets/worktree_checklist.md"],
    "COMMIT": ["references/commit_workflows.md", "assets/commit_message_template.md"],
    "FINISH": ["references/finish_workflows.md", "assets/pr_template.md"],
    "SHARED_PATTERNS": ["references/shared_patterns.md"],
}

LOADING_LEVELS = {
    "ALWAYS": [DEFAULT_RESOURCE],
    "ON_DEMAND_KEYWORDS": ["full git flow", "all templates", "full reference"],
    "ON_DEMAND": ["references/shared_patterns.md", "assets/commit_message_template.md"],
}

def _task_text(task) -> str:
    return " ".join([
        str(getattr(task, "text", "")),
        str(getattr(task, "query", "")),
        " ".join(getattr(task, "keywords", []) or []),
    ]).lower()

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
    """Weighted intent scoring from request text and workflow flags."""
    text = _task_text(task)
    scores = {intent: 0.0 for intent in INTENT_SIGNALS}
    for intent, cfg in INTENT_SIGNALS.items():
        for keyword in cfg["keywords"]:
            if keyword in text:
                scores[intent] += cfg["weight"]
    for intent, synonyms in NOISY_SYNONYMS.items():
        for term, weight in synonyms.items():
            if term in text:
                scores[intent] += weight
    if getattr(task, "needs_isolated_workspace", False):
        scores["WORKSPACE_SETUP"] += 4
    if getattr(task, "has_staged_changes", False):
        scores["COMMIT"] += 4
    if getattr(task, "ready_to_integrate", False):
        scores["FINISH"] += 4
    return scores

def select_intents(scores: dict[str, float], task_text: str, ambiguity_delta: float = 1.0, base_max_intents: int = 2, adaptive_max_intents: int = 3) -> list[str]:
    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    if not ranked or ranked[0][1] <= 0:
        return ["SHARED_PATTERNS"]

    noisy_hits = sum(1 for term in ["dirty workspace", "half-staged", "hotfix", "minimal risk", "trunk"] if term in (task_text or ""))
    max_intents = adaptive_max_intents if noisy_hits >= 2 else base_max_intents

    selected = [ranked[0][0]]
    for intent, score in ranked[1:]:
        if score <= 0:
            continue
        if (ranked[0][1] - score) <= ambiguity_delta:
            selected.append(intent)
        if len(selected) >= max_intents:
            break
    return selected[:max_intents]

def route_git_resources(task):
    inventory = discover_markdown_resources()
    task_text = _task_text(task)
    scores = score_intents(task)
    intents = select_intents(scores, task_text, ambiguity_delta=1.0)
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

    if sum(scores.values()) < 0.5:
        load_if_available("references/shared_patterns.md")
        return {
            "intents": ["SHARED_PATTERNS"],
            "intent_scores": scores,
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    for intent in intents:
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)

    text = _task_text(task)
    if any(keyword in text for keyword in LOADING_LEVELS["ON_DEMAND_KEYWORDS"]):
        for relative_path in LOADING_LEVELS["ON_DEMAND"]:
            load_if_available(relative_path)

    if not loaded:
        load_if_available(DEFAULT_RESOURCE)

    return {"intents": intents, "intent_scores": scores, "resources": loaded}
```

## Cross References

- [[when-to-use]] - Keyword triggers that feed into routing
- [[how-it-works]] - The phases that routing selects between
