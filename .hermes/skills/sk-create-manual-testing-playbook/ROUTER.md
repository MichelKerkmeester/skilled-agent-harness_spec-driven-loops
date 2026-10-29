---
title: "Manual Testing Playbook Creation Router"
description: "Sibling router for sk-create-manual-testing-playbook: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "sk-create-manual-testing-playbook router"
  - "sk-create-manual-testing-playbook routing"
importance_tier: normal
contextType: general
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# Manual Testing Playbook Creation Router

The machine router for [`SKILL.md`](../../../.skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

Requests reach this skill when the `sk-doc` hub routes manual validation authoring here: the request names a manual testing playbook, a testing playbook, a deterministic scenario, evidence collection or operator validation, and the hub's `sk-create-manual-testing-playbook` mode signal selects this packet, which it does only when reusable manual validation needs captured evidence rather than test steps that fit a spec-folder checklist. It routes to two resource families: the scaffolds under `assets/`, where `assets/manual-testing-playbook-template.md` builds the root playbook and `assets/manual-testing-playbook-snippet-template.md` builds each per-feature scenario file, and the overflow references under `references/`, where `references/README.md` is the route map, `references/prompt-voice.md` carries the natural-human versus RCAF voice decision, `references/common-pitfalls.md` the recurring package defects and `references/examples.md` the shipped reference playbooks. `references/README.md` is the default resource and the fallback suggestion, and no other resource loads without an intent that selects it.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

- **`root_playbook`** fires on `manual testing playbook`, `/create:manual-testing-playbook`, `testing playbook` and `release readiness` at weight 4. It selects `assets/manual-testing-playbook-template.md` for the root playbook scaffold, then loads the flat markdown inventory under `references/` and `assets/`, with `references/README.md` as the fallback route map.
- **`per_feature_scenario`** fires on `deterministic scenario`, `evidence collection`, `operator validation` and `multi-agent execution` at weight 4. It selects `assets/manual-testing-playbook-snippet-template.md` for each per-feature scenario file, then loads the same flat inventory, with `references/prompt-voice.md` carrying the natural-human versus RCAF voice decision and `references/common-pitfalls.md` the recurring package defects.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

The packet's decision rule, family boundary and the resilient router pseudocode that reads them.

### Decision Rule

Decision rule:

```text
Need reusable manual validation with captured evidence?
YES -> Create a playbook package
NO  -> Keep test steps in spec/checklist docs
```

### Family Boundary

This packet owns manual testing playbook packages only. It consumes shared `sk-doc` standards from `../shared`, but the advisor identity lives at the `sk-doc` hub root. Do not add a packet-local `graph-metadata.json`.

### Smart Router Pseudocode

For this flat-reference packet, the canonical resilient router discovers resources at call
time, guards and loads only what exists, scores the two authoring scopes, and returns a
disambiguation checklist rather than silently loading nothing:

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/README.md"

# Two authoring scopes; keywords come from this packet's activation triggers.
INTENT_MODEL = {
    "root_playbook": {"weight": 4, "keywords": ["manual testing playbook", "/create:manual-testing-playbook", "testing playbook", "release readiness"]},
    "per_feature_scenario": {"weight": 4, "keywords": ["deterministic scenario", "evidence collection", "operator validation", "multi-agent execution"]},
}
UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the target skill or system and the feature set under test",
    "Confirm root playbook index scope vs per-feature scenario file scope",
    "Confirm the evidence and pass/fail validation expectations",
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

def route_manual_testing_playbook_request(request):
    inventory = discover_markdown_resources()
    loaded, seen = [], set()
    scores = score_intents(request)

    if max(scores.values() or [0]) < 4:                      # Tier 1: unclear scope
        load_if_available(DEFAULT_RESOURCE, inventory, loaded, seen)
        return {
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    scope = max(scores, key=scores.get)                       # Tier 2: happy path
    # Flat resource topology: no references/<key>/ subdirectories. The scope selects the
    # authoring target documented above, not a keyed subtree; load the flat refs that exist.
    for path in sorted(inventory):
        load_if_available(path, inventory, loaded, seen)
    return {"scope": scope, "resources": loaded}
```
