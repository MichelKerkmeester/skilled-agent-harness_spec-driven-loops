---
title: "AI Council Router"
description: "Sibling router for deep-ai-council: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "deep-ai-council router"
  - "deep-ai-council routing"
importance_tier: normal
contextType: general
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# AI Council Router

The machine router for [`SKILL.md`](../../../.skilled/skills/system-deep-loop/deep-ai-council/SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

Requests reach this skill when they name `deep-ai-council`, `ai council`, `council deliberation`, `multi-seat planning`, `planning council`, `council convergence`, `council artifacts` or `packet-local ai-council`, and the `system-deep-loop` hub's `ai-council` signal selects this packet. It routes to three resource families: the `references/` doctrine, which starts at `references/integration/quick-reference.md` on every invocation and adds the loop protocol, output schema, scoring, depth-dispatch, failure-handling, anti-pattern, folder-layout, state-format, seat-diversity, convergence, graph-support and findings-registry references as the intent asks for them, plus the `assets/` markdown templates, the `manual-testing-playbook/` operator scenarios and the `scripts/` helpers that are invoked explicitly rather than routed.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

- **`COUNCIL_RUN`** fires on `deep ai council`, `council deliberation`, `planning council` and `strategy comparison`. It loads `references/integration/loop-protocol.md`, `references/patterns/seat-diversity-patterns.md`, `references/convergence/convergence-signals.md`, `references/structure/output-schema.md`, `assets/deep-ai-council-strategy.md` and `assets/prompt-pack-round.md`.
- **`COUNCIL_SETUP`** fires on `quick reference`, `loop protocol`, `council setup`, `round strategy` and `council dashboard`. It loads `references/integration/quick-reference.md`, `references/integration/loop-protocol.md`, `assets/deep-ai-council-strategy.md` and `assets/deep-ai-council-dashboard.md`.
- **`ARTIFACT_PERSISTENCE`** fires on `persist council`, `ai-council artifact`, `council report parser` and `state jsonl`. It loads `references/structure/folder-layout.md`, `references/structure/output-schema.md`, `references/structure/state-format.md`, `references/patterns/command-wiring.md`, `references/scoring/findings-registry.md` and `assets/deep-ai-council-dashboard.md`.
- **`RECOVERY_OR_AUDIT`** fires on `rollback`, `audit`, `missing council_complete` and `completion advisory`. It loads `references/structure/state-format.md`, `references/structure/folder-layout.md`, `references/patterns/command-wiring.md` and `references/integration/loop-protocol.md`.
- **`CONVERGENCE_CHECK`** fires on `convergence`, `two-of-three`, `max rounds` and `non-converged`. It loads `references/convergence/convergence-signals.md`, `references/patterns/seat-diversity-patterns.md`, `references/structure/state-format.md` and `references/integration/loop-protocol.md`.
- **`SCORING`** fires on `scoring rubric`, `five-dimension`, `hunter skeptic referee` and `comparison table`. It loads `references/scoring/scoring-rubric.md`.
- **`DEPTH_DISPATCH`** fires on `depth 0`, `depth 1`, `parallel dispatch`, `sequential thinking` and `ndp compliant`. It loads `references/convergence/depth-dispatch.md`, `references/convergence/deep-mode.md` and `references/scoring/findings-registry.md`.
- **`FAILURE_HANDLING`** fires on `seat timeout`, `all seats fail`, `contradiction without resolution` and `insufficient vantage`. It loads `references/convergence/failure-handling.md`.
- **`ANTI_PATTERNS`** fires on `anti-pattern`, `convergence sycophancy`, `fake consensus` and `recursive council`. It loads `references/patterns/anti-patterns.md`.
- **`GRAPH_SUPPORT`** fires on `council graph`, `graph support`, `derived graph` and `council_graph`. It loads `references/integration/graph-support.md`, `references/structure/state-format.md` and `references/structure/folder-layout.md`.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

This section holds the packet's deterministic route map: detection, phase map, resource domains, loading levels and the smart-router pseudocode.

### Primary Detection Signal

```bash
request_text="$(printf '%s' "$USER_REQUEST" | tr '[:upper:]' '[:lower:]')"
case "$request_text" in
  *"deep ai council"*|*"ai council"*|*"council deliberation"*|*"planning council"*) COUNCIL_INTENT=1 ;;
  *"persist council"*|*"ai-council artifact"*|*"council_complete"*) COUNCIL_INTENT=1 ;;
  *) COUNCIL_INTENT=0 ;;
esac
```

### Phase Detection

```text
TASK CONTEXT
    |
    +- STEP 0: Detect council intent, packet persistence intent, recovery/audit intent, or convergence intent
    +- STEP 1: Score intents and keep top-2 when ambiguity is small
    +- Phase 1: Dispatch or simulate diverse council seats
    +- Phase 2: Deliberate, critique, and test convergence
    +- Phase 3: Persist artifacts, verify state, and hand off planning result
```

### Resource Domains

The router discovers markdown resources recursively from `references/`, `assets/`, and `manual-testing-playbook/`, then applies intent scoring from `INTENT_MODEL`.

```text
references/*.md
assets/*.md
manual-testing-playbook/**/*.md
```

- `references/` contains the quick reference, loop protocol, council state, folder layout, seat diversity, output schema, convergence signals, and caller wiring.
- `assets/` contains council config, round strategy, dashboard, prompt-pack, and runtime capability templates. Markdown assets are routable; JSON/TMPL assets are operator/runtime inputs.
- `manual-testing-playbook/` contains operator validation scenarios for routing, deliberation, persistence, convergence, rollback, scope boundaries, council-graph integration, and council-graph value comparison (32 scenarios across 9 categories).
- `feature-catalog/` mirrors the playbook 1:1 with one user-facing feature entry per scenario (32 entries) — start here for "what does DAC-NNN actually do" lookups.
- `scripts/` contains deterministic helpers; scripts are invoked explicitly and are not markdown-routed. Notable entries: `persist-artifacts.cjs` (artifact writer CLI), `replay-graph-from-artifacts.cjs` (DAC-025 derived-projection rebuild — reads `ai-council-state.jsonl` and writes through `runtime//scripts/upsert.cjs --loop-type council`, with `--dry-run` for payload inspection).

### Resource Loading Levels

| Level | When to Load | Resources |
| --- | --- | --- |
| ALWAYS | Every skill invocation | `references/integration/quick-reference.md` |
| CONDITIONAL | Intent signals match | Intent-mapped references from `RESOURCE_MAP` |
| ON_DEMAND | Explicit validation or operator testing | `manual-testing-playbook/manual-testing-playbook.md` and scenario files |

### Smart Router Pseudocode

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets", SKILL_ROOT / "manual_testing_playbook")
DEFAULT_RESOURCE = "references/integration/quick-reference.md"

INTENT_MODEL = {
    "COUNCIL_RUN": {"keywords": [("deep ai council", 5), ("council deliberation", 5), ("planning council", 4), ("strategy comparison", 3)]},
    "COUNCIL_SETUP": {"keywords": [("quick reference", 3), ("loop protocol", 4), ("council setup", 4), ("round strategy", 4), ("council dashboard", 3)]},
    "ARTIFACT_PERSISTENCE": {"keywords": [("persist council", 5), ("ai-council artifact", 5), ("council report parser", 4), ("state jsonl", 3)]},
    "RECOVERY_OR_AUDIT": {"keywords": [("rollback", 4), ("audit", 3), ("missing council_complete", 5), ("completion advisory", 4)]},
    "CONVERGENCE_CHECK": {"keywords": [("convergence", 4), ("two-of-three", 5), ("max rounds", 3), ("non-converged", 4)]},
    "SCORING": {"keywords": [("scoring rubric", 5), ("five-dimension", 5), ("hunter skeptic referee", 5), ("comparison table", 4)]},
    "DEPTH_DISPATCH": {"keywords": [("depth 0", 5), ("depth 1", 5), ("parallel dispatch", 4), ("sequential thinking", 4), ("ndp compliant", 4)]},
    "FAILURE_HANDLING": {"keywords": [("seat timeout", 5), ("all seats fail", 5), ("contradiction without resolution", 4), ("insufficient vantage", 4)]},
    "ANTI_PATTERNS": {"keywords": [("anti-pattern", 5), ("convergence sycophancy", 5), ("fake consensus", 4), ("recursive council", 4)]},
    "GRAPH_SUPPORT": {"keywords": [("council graph", 5), ("graph support", 4), ("derived graph", 5), ("council_graph", 5)]},
}

RESOURCE_MAP = {
    "COUNCIL_RUN": ["references/integration/loop-protocol.md", "references/patterns/seat-diversity-patterns.md", "references/convergence/convergence-signals.md", "references/structure/output-schema.md", "assets/deep-ai-council-strategy.md", "assets/prompt-pack-round.md"],
    "COUNCIL_SETUP": ["references/integration/quick-reference.md", "references/integration/loop-protocol.md", "assets/deep-ai-council-strategy.md", "assets/deep-ai-council-dashboard.md"],
    "ARTIFACT_PERSISTENCE": ["references/structure/folder-layout.md", "references/structure/output-schema.md", "references/structure/state-format.md", "references/patterns/command-wiring.md", "references/scoring/findings-registry.md", "assets/deep-ai-council-dashboard.md"],
    "RECOVERY_OR_AUDIT": ["references/structure/state-format.md", "references/structure/folder-layout.md", "references/patterns/command-wiring.md", "references/integration/loop-protocol.md"],
    "CONVERGENCE_CHECK": ["references/convergence/convergence-signals.md", "references/patterns/seat-diversity-patterns.md", "references/structure/state-format.md", "references/integration/loop-protocol.md"],
    "SCORING": ["references/scoring/scoring-rubric.md"],
    "DEPTH_DISPATCH": ["references/convergence/depth-dispatch.md", "references/convergence/deep-mode.md", "references/scoring/findings-registry.md"],
    "FAILURE_HANDLING": ["references/convergence/failure-handling.md"],
    "ANTI_PATTERNS": ["references/patterns/anti-patterns.md"],
    "GRAPH_SUPPORT": ["references/integration/graph-support.md", "references/structure/state-format.md", "references/structure/folder-layout.md"],
}

LOAD_LEVELS = {
    "COUNCIL_RUN": "CONDITIONAL",
    "COUNCIL_SETUP": "CONDITIONAL",
    "ARTIFACT_PERSISTENCE": "CONDITIONAL",
    "RECOVERY_OR_AUDIT": "CONDITIONAL",
    "CONVERGENCE_CHECK": "CONDITIONAL",
    "SCORING": "CONDITIONAL",
    "DEPTH_DISPATCH": "CONDITIONAL",
    "FAILURE_HANDLING": "CONDITIONAL",
    "ANTI_PATTERNS": "CONDITIONAL",
    "GRAPH_SUPPORT": "CONDITIONAL",
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm whether the request is council setup, planning, persistence, recovery, or convergence checking",
    "Confirm the packet/spec folder for any artifact persistence",
    "Confirm whether external AI vantages actually ran or must be labeled simulated",
    "Confirm the planning-only handoff target before implementation starts",
]

AMBIGUITY_DELTA = 1

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

def classify_intents(user_request, task=None):
    text = " ".join([str(user_request or ""), str(getattr(task, "intent", "") or "")]).lower()
    scores = {intent: 0 for intent in INTENT_MODEL}
    for intent, config in INTENT_MODEL.items():
        for keyword, weight in config["keywords"]:
            if keyword in text:
                scores[intent] += weight
    ranked = sorted(scores.items(), key=lambda pair: pair[1], reverse=True)
    primary, primary_score = ranked[0]
    if primary_score == 0:
        return ("COUNCIL_RUN", None, scores)
    secondary, secondary_score = ranked[1]
    if secondary_score > 0 and (primary_score - secondary_score) <= AMBIGUITY_DELTA:
        return (primary, secondary, scores)
    return (primary, None, scores)

def get_routing_key(task, intents: list[str]) -> str:
    override = str(getattr(task, "routing_key", "")).strip().upper()
    if override in RESOURCE_MAP:
        return override
    intent = str(getattr(task, "intent", "")).strip().upper()
    if intent in RESOURCE_MAP:
        return intent
    return intents[0] if intents else "UNKNOWN"

def route_sk_ai_council_resources(user_request, task=None):
    inventory = discover_markdown_resources()
    primary, secondary, scores = classify_intents(user_request, task)
    intents = [primary] + ([secondary] if secondary else [])
    routing_key = get_routing_key(task, intents)
    loaded = []
    seen = set()

    def load_if_available(relative_path: str):
        guarded = _guard_in_skill(relative_path)
        if guarded in inventory and guarded not in seen:
            load(guarded)
            loaded.append(guarded)
            seen.add(guarded)

    load_if_available(DEFAULT_RESOURCE)
    if max(scores.values() or [0]) < 0.5:
        return {
            "routing_key": routing_key,
            "intents": intents,
            "intent_scores": scores,
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    for intent in intents:
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)

    keyed_prefixes = [f"references/{routing_key.lower()}/", f"assets/{routing_key.lower()}/", f"manual-testing-playbook/{routing_key.lower()}/"]
    keyed_docs = sorted(path for path in inventory if any(path.startswith(prefix) for prefix in keyed_prefixes))
    for relative_path in keyed_docs:
        load_if_available(relative_path)

    if routing_key not in RESOURCE_MAP and not keyed_docs:
        return {
            "routing_key": routing_key,
            "intents": intents,
            "intent_scores": scores,
            "notice": f"No knowledge base found for routing key '{routing_key}'",
            "resources": loaded,
        }

    return {
        "routing_key": routing_key,
        "intents": intents,
        "intent_scores": scores,
        "load_level": LOAD_LEVELS.get(routing_key, "CONDITIONAL"),
        "resources": loaded,
    }
```
