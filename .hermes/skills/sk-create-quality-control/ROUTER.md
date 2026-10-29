---
title: "Doc Quality (quality) Router"
description: "Sibling router for sk-create-quality-control: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "sk-create-quality-control router"
  - "sk-create-quality-control routing"
importance_tier: normal
contextType: general
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# Doc Quality (quality) Router

The machine router for [`SKILL.md`](../../../.skilled/skills/sk-doc/sk-create-quality-control/SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

The `sk-doc` hub routes existing-document quality work here: a request to validate, score, audit or optimize an existing markdown file, whose vocabulary is `doc quality`, `/doc:quality`, `audit documentation quality`, `document audit`, `validate a document`, `validate markdown`, `validation rules`, `score this document`, `optimize this doc`, `DQI`, `AI-friendly documentation`, `extract structure`, `quality bar`, `flag`, `model's budget` and `trim`, selects this packet, while a request to author a new artifact belongs to the matching `create-*` packet instead. It routes to two resource families: the single-concern references under `references/`, which start at `references/README.md`, the route map every run reads first, and carry the four execution modes, the optimization procedure, the 16 transformation patterns with their before/after examples, the validation touchpoints and the worked batch examples, and the shared `sk-doc` scripts and standards the workflow runs, `../shared/scripts/extract_structure.py`, `../shared/scripts/validate_document.py`, `../shared/scripts/quick_validate.py` and `../shared/scripts/check_authored_name_kebab.py` for the structure, validation and naming evidence, with `../shared/references/validation.md` and `../sk-create-with-human-voice/references/hvr-rules.md` for the DQI bands and the voice rules. `references/README.md` is the default resource and the fallback suggestion, and no other resource loads without an intent that selects it.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

- **`validate`** fires on `validate a document`, `validate markdown`, `audit documentation quality` and `document audit` at weight 4. It routes to `references/validation-and-enforcement.md` for the validation touchpoints, the enforcement approval-prompt templates and the troubleshooting path, then loads the flat markdown inventory under `references/`, with `references/README.md` as the fallback route map.
- **`score_dqi`** fires on `doc quality`, `/doc:quality`, `score this document` and `dqi` at weight 4. It routes to `references/README.md` for the route map and to `../shared/references/validation.md` for the DQI scoring, the quality bands and the gate interpretation, then loads the same flat inventory.
- **`optimize`** fires on `optimize this doc` and `ai-friendly documentation` at weight 4. It routes to `references/optimization.md` for the optimization procedure and to `references/transformation-patterns.md` for the 16 transformation patterns, then loads the same flat inventory.
- **`extract_structure`** fires on `extract structure`, `hvr` and `human voice` at weight 4. It routes to `../shared/scripts/extract_structure.py` for the structure, metrics, checklist and DQI evidence and to `../sk-create-with-human-voice/references/hvr-rules.md` for the Human Voice Rules, then loads the same flat inventory.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

The packet's family boundary, its intent model and the router block that encodes them.

### Family Boundary

This is an independently invokable nested workflow packet under `sk-doc`. It owns existing-document validation and optimization, not artifact scaffolding. It has no packet-local `graph-metadata.json`; the advisor identity lives at the `sk-doc` hub root.

### Smart Router Pseudocode

For this flat-reference packet, the canonical resilient router discovers resources at call
time, guards and loads only what exists, scores the four audit/execution intents documented
in WHEN TO USE, and returns a disambiguation checklist rather than silently loading nothing:

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/README.md"

# Four routing targets this packet distinguishes; keywords come from its activation triggers.
INTENT_MODEL = {
    "validate": {"weight": 4, "keywords": ["validate a document", "validate markdown", "audit documentation quality", "document audit"]},
    "score_dqi": {"weight": 4, "keywords": ["doc quality", "/doc:quality", "score this document", "dqi"]},
    "optimize": {"weight": 4, "keywords": ["optimize this doc", "ai-friendly documentation"]},
    "extract_structure": {"weight": 4, "keywords": ["extract structure", "hvr", "human voice"]},
}
UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the target document and execution mode (report-only audit, structure validation, content optimization, or batch snapshot)",
    "Confirm whether the expected output is a DQI score/report or an optimized rewrite of the document",
    "Confirm the quality-gate or DQI expectation driving this request",
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

def route_quality_control_request(request):
    inventory = discover_markdown_resources()
    loaded, seen = [], set()
    scores = score_intents(request)

    if max(scores.values() or [0]) < 4:                      # Tier 1: unclear target/mode
        load_if_available(DEFAULT_RESOURCE, inventory, loaded, seen)
        return {
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    intent = max(scores, key=scores.get)                      # Tier 2: happy path
    # Flat resource topology: no references/<key>/ subdirectories. The intent selects the
    # workflow step already documented above, not a keyed subtree; load the flat refs that exist.
    for path in sorted(inventory):
        load_if_available(path, inventory, loaded, seen)
    return {"intent": intent, "resources": loaded}
```
