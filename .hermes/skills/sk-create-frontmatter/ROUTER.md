---
title: "create-frontmatter Router"
description: "Sibling router for sk-create-frontmatter: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "sk-create-frontmatter router"
  - "sk-create-frontmatter routing"
importance_tier: normal
contextType: general
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# create-frontmatter Router

The machine router for [`SKILL.md`](../../../.skilled/skills/sk-doc/sk-create-frontmatter/SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

Requests reach this skill when a document needs a frontmatter block and its class's field set is unclear, when a validator rejected a block and named a field rather than a fix, when a `description` is over budget, when a four-part `version` needs deriving or reconciling against a changelog anchor, or when someone asks what `trigger_phrases`, `importance_tier` or `contextType` are for. It routes to two resource families: `assets/frontmatter-templates.md`, the field reference and per-class templates that load on every path, and `references/frontmatter-versioning.md`, which is conditional on the question being about `version`, its derivation or the corpus gate.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

- **`FIELDS`** (weight 5) fires on `frontmatter block`, `which fields`, `trigger_phrases`, `importance_tier`, `contexttype`, `add frontmatter` and `missing frontmatter`; it loads `assets/frontmatter-templates.md`.
- **`BUDGET`** (weight 4) fires on `description budget`, `description too long`, `trim the description` and `description length`; it loads `assets/frontmatter-templates.md`.
- **`VERSION`** (weight 5) fires on `4-part version`, `x.y.z.w`, `version field`, `frontmatter version`, `changelog anchor` and `edit count`; it loads `references/frontmatter-versioning.md`, then `assets/frontmatter-templates.md`.
- **`VALIDATION`** (weight 4) fires on `frontmatter invalid`, `validator rejected`, `malformed frontmatter` and `frontmatter fix`; it loads `assets/frontmatter-templates.md`, then `references/frontmatter-versioning.md`.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

The routing detail that does not fit the short summary: the resource domains, the loading levels and the resource-discovery pseudocode.

### Resource Domains

- `assets/frontmatter-templates.md`. The field reference and the per-class templates. Eleven sections covering every document class, the description budget, validation rules and the common fixes.
- `references/frontmatter-versioning.md`. The 4-part `X.Y.Z.W` standard: scope, format, the changelog-anchored derivation, the numstat gate, and the insertion rule.

### Resource Loading Levels

| Level | When to Load | Resources |
|-------|--------------|-----------|
| ALWAYS | Any frontmatter question | `assets/frontmatter-templates.md` |
| CONDITIONAL | The question is about `version`, its derivation, or the corpus gate | `references/frontmatter-versioning.md` |

### Smart Router Pseudocode

The canonical resilient router discovers resources at call time, guards and loads only
what exists, scores the intents, and returns a disambiguation checklist rather than
silently loading nothing:

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "assets/frontmatter-templates.md"

INTENT_MODEL = {
    "FIELDS":     {"weight": 5, "keywords": ["frontmatter block", "which fields", "trigger_phrases", "importance_tier", "contexttype", "add frontmatter", "missing frontmatter"]},
    "BUDGET":     {"weight": 4, "keywords": ["description budget", "description too long", "trim the description", "description length"]},
    "VERSION":    {"weight": 5, "keywords": ["4-part version", "x.y.z.w", "version field", "frontmatter version", "changelog anchor", "edit count"]},
    "VALIDATION": {"weight": 4, "keywords": ["frontmatter invalid", "validator rejected", "malformed frontmatter", "frontmatter fix"]},
}
RESOURCE_MAP = {
    "FIELDS":     ["assets/frontmatter-templates.md"],
    "BUDGET":     ["assets/frontmatter-templates.md"],
    "VERSION":    ["references/frontmatter-versioning.md", "assets/frontmatter-templates.md"],
    "VALIDATION": ["assets/frontmatter-templates.md", "references/frontmatter-versioning.md"],
}
UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the document class: skill manifest, readme, reference, asset, command, agent or spec doc",
    "Confirm the operation: author a new block, fix a rejected one, or derive a version",
    "Confirm whether the file is in scope for the version field at all",
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
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def load_if_available(relative_path, inventory, loaded, seen) -> None:
    guarded = _guard_in_skill(relative_path)
    if guarded in inventory and guarded not in seen:
        load(guarded)
        loaded.append(guarded)
        seen.add(guarded)

def score_intents(request) -> dict:
    text = request.text.lower()
    scores = {intent: 0 for intent in INTENT_MODEL}
    for intent, cfg in INTENT_MODEL.items():
        for kw in cfg["keywords"]:
            if kw in text:
                scores[intent] += cfg["weight"]
    return scores

def route_frontmatter_request(request):
    inventory = discover_markdown_resources()
    loaded, seen = [], set()

    # The field reference loads on every path. Every frontmatter question resolves
    # against a document class first, and that is the only place classes are defined.
    load_if_available(DEFAULT_RESOURCE, inventory, loaded, seen)
    scores = score_intents(request)

    if max(scores.values() or [0]) < 4:                       # Tier 1: unclear scope
        return {
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    intent = max(scores, key=scores.get)                      # Tier 2: happy path
    for resource in RESOURCE_MAP[intent]:
        load_if_available(resource, inventory, loaded, seen)
    return {"intent": intent, "resources": loaded}
```

Unknown intent returns the disambiguation checklist with the field reference already
loaded, because "which class is this document" is the first question on every path.
