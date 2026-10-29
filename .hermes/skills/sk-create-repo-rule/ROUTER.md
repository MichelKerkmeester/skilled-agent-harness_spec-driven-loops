---
title: "create-repo-rule Router"
description: "Sibling router for sk-create-repo-rule: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "sk-create-repo-rule router"
  - "sk-create-repo-rule routing"
importance_tier: normal
contextType: general
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# create-repo-rule Router

The machine router for [`SKILL.md`](../../../.skilled/skills/sk-doc/sk-create-repo-rule/SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

Requests reach this skill when they ask for a repo rule, a project rule, a `REPO RULES.md` row or `/create:repo-rule`, when a recurring failure needs a constraint that binds before an action, when an existing rule no longer matches how the work is done or nothing it prevents still happens, and when a repository needs a rule router because it has none. It routes to two resource families: `references/`, which opens at `references/decision-tests.md` on every path and continues through the rule anatomy, the creation standards and the `AGENTS.md` wiring orderings, and `assets/`, the blank rule template and the router template a repository with no `REPO RULES.md` needs before any rule can load.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

`references/decision-tests.md` is `DEFAULT_RESOURCE` and loads before intent scoring, so every path carries it; each bullet lists the files its own `RESOURCE_MAP` entry adds.

- **`CREATE`** (weight 5) fires on `add a rule`, `new repo rule`, `make a rule`, `we should always` and `stop doing`; it loads `references/decision-tests.md`, the default, then `references/rule-anatomy.md` and `assets/repo-rule-template.md`.
- **`REVISE`** (weight 4) fires on `update the rule`, `change the rule`, `the rule is wrong` and `rule is out of date`; it loads `references/rule-anatomy.md` and `references/agents-md-integration.md`.
- **`RETIRE`** (weight 4) fires on `remove the rule`, `retire`, `delete the rule` and `no longer applies`; it loads `references/agents-md-integration.md`, the pointer-first ordering that retires a rule leaving no dangling row.
- **`ROUTER`** (weight 3) fires on `no repo rules`, `set up repo rules`, `REPO RULES.md` and `first rule`; it loads `assets/repo-rules-router-template.md`, the prerequisite emitted before any rule when the target repository has no router.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

The packet's resource domains, its loading levels, its prompt-intent projection and the call sequence that reads them.

### Resource Domains

- `references/decision-tests.md` — whether the request may become a rule at all. Always first.
- `references/rule-anatomy.md` — what a rule must contain, what varies, the length bands.
- `references/creation-standards.md` — five reader tests deciding whether a well-formed rule is worth loading.
- `references/agents-md-integration.md` — the three wiring points, and the create, revise and retire orderings.
- `assets/repo-rule-template.md` — the blank for a new rule.
- `assets/repo-rules-router-template.md` — the prerequisite, when no router exists.

### Resource Loading Levels

| Level | When to Load | Resources |
|-------|--------------|-----------|
| ALWAYS | Every invocation | `references/decision-tests.md` |
| CONDITIONAL | The request survived the tests | `rule-anatomy.md`, `assets/repo-rule-template.md` |
| CONDITIONAL | The target repository has no router | `assets/repo-rules-router-template.md` |
| CONDITIONAL | Wiring an accepted rule | `agents-md-integration.md` |
| CONDITIONAL | A draft exists and is being finished or reviewed | `creation-standards.md` |

### Smart Router Pseudocode

The canonical resilient router discovers resources at call time, guards and loads only
what exists, scores the four operations, and returns a disambiguation checklist rather
than silently loading nothing:

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/decision-tests.md"

INTENT_MODEL = {
    "CREATE": {"weight": 5, "keywords": ["add a rule", "new repo rule", "make a rule", "we should always", "stop doing"]},
    "REVISE": {"weight": 4, "keywords": ["update the rule", "change the rule", "the rule is wrong", "rule is out of date"]},
    "RETIRE": {"weight": 4, "keywords": ["remove the rule", "retire", "delete the rule", "no longer applies"]},
    "ROUTER": {"weight": 3, "keywords": ["no repo rules", "set up repo rules", "REPO RULES.md", "first rule"]},
}
RESOURCE_MAP = {
    "CREATE": ["references/decision-tests.md", "references/rule-anatomy.md", "assets/repo-rule-template.md"],
    "REVISE": ["references/rule-anatomy.md", "references/agents-md-integration.md"],
    "RETIRE": ["references/agents-md-integration.md"],
    "ROUTER": ["assets/repo-rules-router-template.md"],
}
UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the behaviour to bind, or the failure that keeps happening",
    "Confirm the operation: create, revise or retire",
    "Confirm the target repository and whether it already has a REPO RULES.md",
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

def route_repo_rule_request(request):
    inventory = discover_markdown_resources()
    loaded, seen = [], set()

    # The tests load on every path including RETIRE, because "should this exist"
    # and "should this still exist" are the same four questions.
    load_if_available(DEFAULT_RESOURCE, inventory, loaded, seen)
    scores = score_intents(request)

    if max(scores.values() or [0]) < 3:                       # Tier 1: unclear scope
        return {
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    intent = max(scores, key=scores.get)                      # Tier 2: happy path
    if target_repo_has_no_router():
        load_if_available("assets/repo-rules-router-template.md", inventory, loaded, seen)
    for resource in RESOURCE_MAP[intent]:
        load_if_available(resource, inventory, loaded, seen)
    return {"intent": intent, "resources": loaded}
```

Unknown intent returns the disambiguation checklist with the tests already loaded, so the
cheap refusal path stays available even when the operation is unclear.
