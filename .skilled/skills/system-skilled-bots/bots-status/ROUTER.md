---
title: "Bots Status Router"
description: "Sibling router for bots-status: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "bots-status router"
  - "bots-status routing"
importance_tier: normal
contextType: general
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# Bots Status Router

The machine router for [`SKILL.md`](./SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here. This file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

### Purpose

A request reaches this packet when the `system-skilled-bots` hub's `status` signal selects it, or through `/bots:status`. The router selects from one reference leaf under `references/`: `references/status-and-inbox.md`.

The router answers one question: given a request, which packet-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this packet folder, and no resource
loads before an intent selects it.

### Usage

- Deciding which packet-local resources a status request loads.
- Checking what happens when no intent matches.

---

## 2. INTENT MODEL

- **`STATUS`** fires on bot status, bots status, last bot run, which bots are installed and bot runs at weight 4. It loads `references/status-and-inbox.md`.
- **`INBOX`** fires on bot inbox, bots inbox, what do the bots need from me, bot needs-you, open needs-you items and bot needs me at weight 4. It loads `references/status-and-inbox.md`.

A request that fires no intent returns `UNKNOWN_FALLBACK` with the checklist below.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above. This section is the last in the file, and it holds the only pseudocode.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/status-and-inbox.md"
# Fallback-only: a zero-score route loads nothing and offers this file
# beside the disambiguation checklist; scored routes load exactly their map.
DEFAULT_RESOURCE_SEMANTICS = "fallback-only"

UNKNOWN_FALLBACK_CHECKLIST = [
    "Name the repository the status is for, or ask for every identity",
    "Say whether the reader wants installed bots, the last run, or the needs-you inbox",
    "Confirm the request only reads: status never writes",
]

INTENT_SIGNALS = {
    "STATUS": {"weight": 4, "keywords": ["bot status", "bots status", "last bot run", "which bots are installed", "bot runs"]},
    "INBOX": {"weight": 4, "keywords": ["bot inbox", "bots inbox", "what do the bots need from me", "bot needs-you", "open needs-you items", "bot needs me"]},
}

RESOURCE_MAP = {
    "STATUS": ["references/status-and-inbox.md"],
    "INBOX": ["references/status-and-inbox.md"],
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
