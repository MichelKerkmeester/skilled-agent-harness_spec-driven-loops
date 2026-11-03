---
title: "Manual Testing Playbook Creation Router"
description: "Sibling router for sk-create-manual-testing-playbook: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "sk-create-manual-testing-playbook router"
  - "sk-create-manual-testing-playbook routing"
importance_tier: normal
contextType: general
version: 1.1.0.0
router_state: active
skill_pointer: SKILL.md
---

# Manual Testing Playbook Creation Router

The machine router for [`SKILL.md`](../../../.skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

Requests reach this skill when the `sk-doc` hub routes manual validation authoring here: the request names a manual testing playbook, a testing playbook, a deterministic scenario, evidence collection, operator validation, a playbook conversation or a multi-turn conversation script, and the hub's `sk-create-manual-testing-playbook` mode signal selects this packet. It does so only when reusable manual validation needs captured evidence rather than test steps that fit a spec-folder checklist.

The router selects from two resource families. The scaffolds sit under `assets/`: `assets/manual-testing-playbook-template.md` builds the root playbook, `assets/manual-testing-playbook-snippet-template.md` builds each single-prompt scenario file and `assets/manual-testing-playbook-conversation-snippet-template.md` builds each conversation scenario file. The references sit under `references/`: `references/README.md` is the route map, `references/prompt-voice.md` carries the natural-human versus RCAF voice decision, `references/conversation-scenarios.md` defines the `json conversation` script format, its evidence and the shared runner, `references/common-pitfalls.md` lists the recurring package defects and `references/examples.md` the shipped reference playbooks. `references/README.md` is the default resource and the fallback suggestion.

The runner itself, `scripts/run-conversation-scenario.cjs`, is a tool the conversation reference documents, not a routable resource: only markdown under `references/` and `assets/` loads.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

Each intent fires at weight 4 when one of its keywords appears in the request. When several fire, their resources load together, in the order of the map, each file once. No keyword is a substring of another in the same intent, because a phrase that matched twice would outscore a second intent the request also names.

- **`ROOT_PLAYBOOK`** fires on `testing playbook`, which also matches `manual testing playbook`, `/create:manual-testing-playbook`, `playbook system` and `release readiness`. It loads `assets/manual-testing-playbook-template.md` for the root playbook scaffold, `references/README.md`, `references/examples.md` and `references/common-pitfalls.md`.
- **`PER_FEATURE_SCENARIO`** fires on `deterministic scenario`, `manual test scenario`, `evidence collection`, `operator validation` and `multi-agent execution`. It loads `assets/manual-testing-playbook-snippet-template.md` for each single-prompt scenario file, `references/prompt-voice.md` for the voice decision, `references/common-pitfalls.md` and `references/examples.md`.
- **`CONVERSATION_SCENARIO`** fires on `playbook conversation`, `playbook scenario`, `conversation scenario`, `conversation script`, which also matches `multi-turn conversation script`, `json conversation`, `conversation runner` and `run-conversation-scenario`. It loads `references/conversation-scenarios.md` for the script format, the runner and its evidence, `assets/manual-testing-playbook-conversation-snippet-template.md`, which carries the required conversation block with placeholders and the runner command, and `references/common-pitfalls.md`.

A request that fires no intent loads `references/README.md` and returns the disambiguation checklist.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

The packet's decision rule, family boundary and the resilient router pseudocode that reads them.

### Decision Rule

Decision rule:

```text
Need reusable manual validation with captured evidence?
YES -> Create a playbook package, then pick each scenario's style:
       1. Verdict needs a person's judgment?                  -> single prompt
       2. Needs more than one exchange, a restart or compact? -> conversation
       3. Several runtimes or a regression gate, all turns
          decidable by a shell check?                         -> conversation
       4. Otherwise                                           -> single prompt
NO  -> Keep test steps in spec/checklist docs
```

The full rule, its runtime requirements and its costs live in `SKILL.md` §6, Choosing the Scenario Style.

### Family Boundary

This packet owns manual testing playbook packages and the conversation scenario format and runner they use. It consumes shared `sk-doc` standards from `../shared`, but the advisor identity lives at the `sk-doc` hub root. Do not add a packet-local `graph-metadata.json`.

### Smart Router Pseudocode

The canonical resilient router discovers resources at call time, guards and loads only what
exists, scores the three authoring scopes, loads the union of the resources the firing scopes
map, and returns a disambiguation checklist rather than silently loading nothing:

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/README.md"

# Three authoring scopes; keywords come from this packet's activation triggers.
INTENT_MODEL = {
    "ROOT_PLAYBOOK": {"weight": 4, "keywords": ["/create:manual-testing-playbook", "testing playbook", "playbook system", "release readiness"]},
    "PER_FEATURE_SCENARIO": {"weight": 4, "keywords": ["deterministic scenario", "manual test scenario", "evidence collection", "operator validation", "multi-agent execution"]},
    "CONVERSATION_SCENARIO": {"weight": 4, "keywords": ["playbook conversation", "playbook scenario", "conversation scenario", "conversation script", "json conversation", "conversation runner", "run-conversation-scenario"]},
}

RESOURCE_MAP = {
    "ROOT_PLAYBOOK": [
        "assets/manual-testing-playbook-template.md",
        "references/README.md",
        "references/examples.md",
        "references/common-pitfalls.md",
    ],
    "PER_FEATURE_SCENARIO": [
        "assets/manual-testing-playbook-snippet-template.md",
        "references/prompt-voice.md",
        "references/common-pitfalls.md",
        "references/examples.md",
    ],
    "CONVERSATION_SCENARIO": [
        "references/conversation-scenarios.md",
        "assets/manual-testing-playbook-conversation-snippet-template.md",
        "references/common-pitfalls.md",
    ],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the target skill or system and the feature set under test",
    "Confirm root playbook index scope vs per-feature scenario file scope",
    "Confirm whether the scenario is a single prompt or a multi-turn conversation (SKILL.md section 6, Choosing the Scenario Style)",
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
    fired = [intent for intent in INTENT_MODEL if scores[intent] >= 4]

    if not fired:                                             # Tier 1: unclear scope
        load_if_available(DEFAULT_RESOURCE, inventory, loaded, seen)
        return {
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    for intent in fired:                                      # Tier 2: each firing scope
        for path in RESOURCE_MAP[intent]:
            load_if_available(path, inventory, loaded, seen)
    if not loaded:                                            # Tier 3: mapped files missing
        load_if_available(DEFAULT_RESOURCE, inventory, loaded, seen)
    return {"scopes": fired, "resources": loaded}
```
