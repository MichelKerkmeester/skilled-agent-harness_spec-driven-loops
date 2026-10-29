---
title: "Autonomous Deep Review Loop Router"
description: "Sibling router for deep-review: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "deep-review router"
  - "deep-review routing"
importance_tier: normal
contextType: general
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# Autonomous Deep Review Loop Router

The machine router for [`SKILL.md`](../../../.skilled/skills/system-deep-loop/deep-review/SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

Requests reach this skill when someone asks for a deep review, a convergence review, an iterative review loop, a release-readiness or pre-release check, a spec-folder audit, or a multi-round code-quality audit whose dimensions feed each other. It routes to three resource families: `references/protocol/` for `quick-reference.md`, which loads first on every invocation, plus the loop protocol, the completion criteria and the state gates; `references/convergence/` for the threshold semantics, the stop signals and the recovery path; and `references/state/` with `assets/` for the state format, the outputs, the reducer registry, the dashboard and the strategy templates.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

- **`REVIEW_SETUP`** (weight 4) fires on `deep review`, `review mode`, `convergence review`, `iterative review`, `:review`, `audit spec`, `audit code`, `review spec folder`, `release readiness` and `pre-release`; it loads `references/protocol/loop-protocol.md`, `references/state/state-format.md`, `references/state/state-outputs.md`, `references/state/state-reducer-registry.md`, `assets/deep-review-strategy.md`, then `references/state/state-jsonl.md`.
- **`REVIEW_ITERATION`** (weight 4) fires on `review iteration`, `dimension review`, `review findings`, `P0`, `P1`, `P2`, `review dimension`, `check correctness`, `check security` and `check alignment`; it loads `references/protocol/loop-protocol.md`, `references/convergence/convergence.md`, then `references/convergence/convergence-signals.md`.
- **`REVIEW_CONVERGENCE`** (weight 3) fires on `review convergence`, `coverage gate`, `verdict`, `binary gate`, `all dimensions`, `all dimensions covered`, `coverage complete` and `stop review`; it loads `references/convergence/convergence.md`, `references/convergence/convergence-signals.md`, `references/state/state-outputs.md`, `references/protocol/completion-criteria.md`, `references/protocol/loop-state-and-gates.md`, then `references/convergence/convergence-recovery.md`.
- **`REVIEW_REPORT`** (weight 3) fires on `review report`, `remediation`, `verdict`, `release readiness`, `planning packet`, `review results`, `what to fix`, `ship decision` and `final report`; it loads `references/state/state-format.md`, `references/state/state-outputs.md`, `references/state/state-reducer-registry.md`, then `assets/deep-review-dashboard.md`.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

This section holds the packet's resource loading levels, its routing pseudocode and its phase detection rules.

### Resource Loading Levels

| Level | When to Load | Resources |
|-------|-------------|-----------|
| ALWAYS | Every skill invocation | `references/protocol/quick-reference.md` |
| CONDITIONAL | If intent signals match | Loop protocol, convergence, state format, review contract |
| ON_DEMAND | Only on explicit request | Full protocol docs, detailed specifications |

### Smart Router Pseudocode

- Pattern 1: Runtime Discovery - `discover_markdown_resources()` recursively inventories `references/` and `assets/`.
- Pattern 2: Existence-Check Before Load - `load_if_available()` guards markdown paths, checks `inventory`, and uses `seen`.
- Pattern 3: Extensible Routing Key - `get_routing_key()` derives the review phase from dispatch context.
- Pattern 4: Multi-Tier Graceful Fallback - `UNKNOWN_FALLBACK` returns review disambiguation and missing phases return a "no review resources" notice.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/protocol/quick-reference.md"

INTENT_SIGNALS = {
    "REVIEW_SETUP":       {"weight": 4, "keywords": ["deep review", "review mode", "convergence review", "iterative review", ":review", "audit spec"]},
    "REVIEW_ITERATION":   {"weight": 4, "keywords": ["review iteration", "dimension review", "review findings", "P0", "P1", "P2"]},
    "REVIEW_CONVERGENCE": {"weight": 3, "keywords": ["review convergence", "coverage gate", "verdict", "binary gate", "all dimensions"]},
    "REVIEW_REPORT":      {"weight": 3, "keywords": ["review report", "remediation", "verdict", "release readiness", "planning packet"]},
}

NOISY_SYNONYMS = {
    "REVIEW_SETUP":       {"audit code": 2.0, "review spec folder": 1.8, "release readiness": 1.5, "pre-release": 1.5},
    "REVIEW_ITERATION":   {"review dimension": 1.5, "check correctness": 1.4, "check security": 1.4, "check alignment": 1.4},
    "REVIEW_CONVERGENCE": {"all dimensions covered": 1.6, "coverage complete": 1.5, "stop review": 1.4},
    "REVIEW_REPORT":      {"review results": 1.5, "what to fix": 1.4, "ship decision": 1.6, "final report": 1.5},
}

# RESOURCE_MAP: local markdown assets + local review-specific protocol docs
RESOURCE_MAP = {
    "REVIEW_SETUP":       [
        "references/protocol/loop-protocol.md",
        "references/state/state-format.md",
        "references/state/state-outputs.md",
        "references/state/state-reducer-registry.md",
        "assets/deep-review-strategy.md",
        "references/state/state-jsonl.md",
    ],
    "REVIEW_ITERATION":   [
        "references/protocol/loop-protocol.md",
        "references/convergence/convergence.md",
        "references/convergence/convergence-signals.md",
    ],
    "REVIEW_CONVERGENCE": [
        "references/convergence/convergence.md",
        "references/convergence/convergence-signals.md",
        "references/state/state-outputs.md",
        "references/protocol/completion-criteria.md",
        "references/protocol/loop-state-and-gates.md",
        "references/convergence/convergence-recovery.md",
    ],
    "REVIEW_REPORT":      [
        "references/state/state-format.md",
        "references/state/state-outputs.md",
        "references/state/state-reducer-registry.md",
        "assets/deep-review-dashboard.md",
    ],
}

LOADING_LEVELS = {
    "ALWAYS":            [DEFAULT_RESOURCE],
    "ON_DEMAND_KEYWORDS": ["full protocol", "all templates", "complete reference", "resume deep review", "deep-review wave", "review artifact", "release-readiness audit", "convergence-tracked", "same session lineage", "P0"],
    "ON_DEMAND":         [
        "references/protocol/loop-protocol.md",
        "references/state/state-format.md",
        "references/convergence/convergence.md",
        "references/convergence/convergence-signals.md",
        "references/state/state-outputs.md",
        "references/state/state-reducer-registry.md",
    ],
}

PHASE_RESOURCE_MAP = {
    "init": ["references/protocol/loop-protocol.md", "references/state/state-format.md", "references/state/state-outputs.md"],
    "iteration": ["references/protocol/loop-protocol.md", "references/convergence/convergence.md", "references/convergence/convergence-signals.md"],
    "stuck": ["references/convergence/convergence.md", "references/convergence/convergence-signals.md", "references/protocol/loop-protocol.md", "references/state/state-reducer-registry.md"],
    "synthesis": ["references/state/state-format.md", "references/state/state-outputs.md", "references/state/state-reducer-registry.md", "assets/deep-review-dashboard.md"],
}

NON_MARKDOWN_REFERENCES = {
    "review_contract": "assets/review-mode-contract.yaml",
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the review target or spec folder",
    "Confirm the review phase",
    "Provide one concrete file, diff range, or expected finding class",
    "Confirm the verification command set before final review",
]

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
            docs.extend(path for path in base.rglob("*.md") if path.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def get_routing_key(dispatch_context) -> str:
    phase = str(getattr(dispatch_context, "phase", "")).strip().lower()
    if phase:
        return phase
    text = str(getattr(dispatch_context, "text", "")).lower()
    if "recovery" in text:
        return "stuck"
    if "convergence" in text or "synthesis" in text:
        return "synthesis"
    if "iteration" in text or "dimension" in text:
        return "iteration"
    return "init"

def route_review_resources(task, dispatch_context):
    inventory = discover_markdown_resources()
    routing_key = get_routing_key(dispatch_context)
    scores = score_intents(task, INTENT_SIGNALS, NOISY_SYNONYMS)
    intents = select_intents(scores, ambiguity_delta=1.0)

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

    if max(scores.values() or [0]) < 0.5:
        return {
            "routing_key": routing_key,
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    phase_resources = PHASE_RESOURCE_MAP.get(routing_key, [])
    if routing_key == "unknown" or not phase_resources:
        return {
            "routing_key": routing_key,
            "notice": f"No review resources found for routing key '{routing_key}'",
            "resources": loaded,
        }

    for intent in intents:
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)

    for relative_path in phase_resources:
        load_if_available(relative_path)

    task_text = str(getattr(task, "text", "")).lower()
    if any(keyword in task_text for keyword in LOADING_LEVELS["ON_DEMAND_KEYWORDS"]):
        for relative_path in LOADING_LEVELS["ON_DEMAND"]:
            load_if_available(relative_path)

    return {
        "routing_key": routing_key,
        "intents": intents,
        "resources": loaded,
        "non_markdown_references": NON_MARKDOWN_REFERENCES,
    }
```

### Phase Detection

Detect the current review phase from dispatch context to load appropriate resources:

| Phase | Signal | Resources to Load |
|-------|--------|-------------------|
| Init | No JSONL exists in `review/` | Loop protocol, state format, state outputs, review contract |
| Iteration | Dispatch context includes dimension + iteration number | Loop protocol, convergence, convergence signals, review contract |
| Stuck | Dispatch context includes "RECOVERY" | Convergence, convergence signals, loop protocol, reducer registry |
| Synthesis | Convergence triggered STOP | Review contract, state format, state outputs, reducer registry |
