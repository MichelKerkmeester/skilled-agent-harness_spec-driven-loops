---
title: "{{SKILL_TITLE}} Router"
description: "Sibling router for {{SKILL_NAME}}: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "{{SKILL_NAME}} router"
  - "{{SKILL_NAME}} routing"
importance_tier: normal
contextType: general
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# {{SKILL_TITLE}} Router

The machine router for [`SKILL.md`](./SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

[TODO: Name the request signals that reach this skill, and the resource families the router selects from.]

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

[TODO: Write one bullet per `INTENT_SIGNALS` key: the intent, the phrasing that fires it, and the exact files it loads.]

[TODO: Keep this section and the machine block below in sync. When a row changes here, change the matching map entry.]

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")

# The document every run loads before intent scoring. [TODO: replace this scaffold default.]
DEFAULT_RESOURCE = "{{DEFAULT_RESOURCE}}"

INTENT_SIGNALS = {
    "PRIMARY": {"weight": 4, "keywords": ["{{SKILL_NAME}}", "{{SKILL_NAME}} workflow"]},
}

RESOURCE_MAP = {
    "PRIMARY": ["{{DEFAULT_RESOURCE}}"],
}

# Every key above must appear in both maps, and every path must resolve inside this folder.
UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the task intent",
    "Provide one concrete input or expected output",
    "Confirm the verification command set before completion",
]

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

def route_resources(request):
    inventory = discover_markdown_resources()
    selected = select_resources_for_request(request, inventory)
    if not selected:
        return {"load_level": "UNKNOWN_FALLBACK", "needs_disambiguation": True, "resources": [], "checklist": UNKNOWN_FALLBACK_CHECKLIST}

    loaded = []
    for relative_path in selected:
        guarded = _guard_in_skill(relative_path)
        if guarded in inventory and guarded not in loaded:
            load(guarded)
            loaded.append(guarded)
    return {"resources": loaded}
```

A request that matches no intent returns `UNKNOWN_FALLBACK` with that checklist, never a silent default
and never an empty result. Replace `select_resources_for_request` with the domain-specific selection
logic, and keep the guarded load: the guard is what keeps a path inside this skill folder.
