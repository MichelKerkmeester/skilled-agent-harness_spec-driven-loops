---
title: "Bots Run Router"
description: "Sibling router for bots-run: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "bots-run router"
  - "bots-run routing"
importance_tier: normal
contextType: general
version: 1.0.1.0
router_state: active
skill_pointer: SKILL.md
---

# Bots Run Router

The machine router for [`SKILL.md`](./SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here. This file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

### Purpose

A request reaches this packet when the `system-skilled-bots` hub's `run` signal selects it, or through `/bots:run`. The router selects from one reference leaf under `references/`: `references/run-queue-and-answer.md`.

The router answers one question: given a request, which packet-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this packet folder, and no resource
loads before an intent selects it.

### Usage

- Deciding which packet-local resources a run request loads.
- Checking what happens when no intent matches.

---

## 2. INTENT MODEL

- **`RUN`** fires on run the bot, run a bot, bots run, drain the bot queue, drain the bot, bots drain, enqueue a bot run, queue a bot run and bots enqueue at weight 4. It loads `references/run-queue-and-answer.md`.
- **`ANSWER`** fires on answer the bot, bots answer and answer a needs-you at weight 4. It loads `references/run-queue-and-answer.md`.

A request that fires no intent returns `UNKNOWN_FALLBACK` with the checklist below.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above. This section is the last in the file, and it holds the only pseudocode.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/run-queue-and-answer.md"
# Fallback-only: a zero-score route loads nothing and offers this file
# beside the disambiguation checklist; scored routes load exactly their map.
DEFAULT_RESOURCE_SEMANTICS = "fallback-only"

UNKNOWN_FALLBACK_CHECKLIST = [
    "Name the bot id, or the needs-you item id for an answer",
    "Name the repository the bot belongs to",
    "Say whether this is a single run, a queued request, a drain or an answer",
]

INTENT_SIGNALS = {
    "RUN": {"weight": 4, "keywords": ["run the bot", "run a bot", "bots run", "drain the bot queue", "drain the bot", "bots drain", "enqueue a bot run", "queue a bot run", "bots enqueue"]},
    "ANSWER": {"weight": 4, "keywords": ["answer the bot", "bots answer", "answer a needs-you"]},
}

RESOURCE_MAP = {
    "RUN": ["references/run-queue-and-answer.md"],
    "ANSWER": ["references/run-queue-and-answer.md"],
}

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(path for path in base.rglob("*.md") if path.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only skill-local markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def select_resources_for_request(request, inventory):
    text = str(request).lower()
    selected = []
    for intent, cfg in INTENT_SIGNALS.items():
        if any(keyword in text for keyword in cfg["keywords"]):
            selected.extend(RESOURCE_MAP[intent])
    return [path for path in selected if path in inventory]

def route_resources(request):
    inventory = discover_markdown_resources()
    selected = select_resources_for_request(request, inventory)
    if not selected:
        return {"load_level": "UNKNOWN_FALLBACK", "needs_disambiguation": True, "resources": [], "checklist": UNKNOWN_FALLBACK_CHECKLIST, "suggested_fallback": DEFAULT_RESOURCE}

    loaded = []
    for relative_path in selected:
        guarded = _guard_in_skill(relative_path)
        if guarded in inventory and guarded not in loaded:
            load(guarded)
            loaded.append(guarded)
    return {"resources": loaded}
```
