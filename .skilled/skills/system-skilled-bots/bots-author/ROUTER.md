---
title: "Bots Author Router"
description: "Sibling router for bots-author: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "bots-author router"
  - "bots-author routing"
importance_tier: normal
contextType: general
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# Bots Author Router

The machine router for [`SKILL.md`](./SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here. This file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

### Purpose

A request reaches this packet when the `system-skilled-bots` hub's `author` signal selects it, or through `/bots:author`. The router selects from one reference leaf under `references/`: `references/bot-definition.md`.

The router answers one question: given a request, which packet-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this packet folder, and no resource
loads before an intent selects it.

### Usage

- Deciding which packet-local resources a author request loads.
- Checking what happens when no intent matches.

---

## 2. INTENT MODEL

- **`DEFINITION`** fires on bot.md, bot definition, author a bot, write a bot, create a bot, new bot, edit a bot and bot template at weight 4. It loads `references/bot-definition.md`.

A request that fires no intent returns `UNKNOWN_FALLBACK` with the checklist below.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above. This section is the last in the file, and it holds the only pseudocode.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/bot-definition.md"
# Fallback-only: a zero-score route loads nothing and offers this file
# beside the disambiguation checklist; scored routes load exactly their map.
DEFAULT_RESOURCE_SEMANTICS = "fallback-only"

UNKNOWN_FALLBACK_CHECKLIST = [
    "Name the bot id and the repository it belongs to",
    "Say whether this is a new bot or an edit to an existing one",
    "Name the trigger kind: cron, queue, git-hook or manual",
]

INTENT_SIGNALS = {
    "DEFINITION": {"weight": 4, "keywords": ["bot.md", "bot definition", "author a bot", "write a bot", "create a bot", "new bot", "edit a bot", "bot template"]},
}

RESOURCE_MAP = {
    "DEFINITION": ["references/bot-definition.md"],
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
