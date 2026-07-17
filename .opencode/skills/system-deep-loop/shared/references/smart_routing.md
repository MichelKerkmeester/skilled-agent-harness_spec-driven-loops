---
title: system-deep-loop Surface Router — per-mode leaf sets
description: Second-layer (surface) router for the system-deep-loop hub. hub-router.json selects the workflow mode; this doc maps a request's deep-loop intent to the exact packet-local leaf resources that mode should load, emitting canonical (workflowMode, leafResourceId) pairs.
trigger_phrases:
  - "system-deep-loop smart routing"
  - "deep-loop surface router"
  - "deep-loop leaf routing"
  - "deep-loop resource map"
importance_tier: important
contextType: general
version: 1.0.0.0
---

# system-deep-loop Surface Router — per-mode leaf sets

This is system-deep-loop's second-layer (surface) router. The hub selects a
workflow mode in [`hub-router.json`](../../hub-router.json) (`research`,
`review`, `ai-council`, the three improvement lanes, or `alignment`); this doc
maps a request's deep-loop intent to the exact packet-local leaf resources that
mode should load. Every path is packet-qualified (`<packet>/references|assets/…`,
where `<packet>` is the mode's `mode-registry.json` `packet` field) and converts
to the canonical `(workflowMode, leafResourceId)` pair at the one contract
boundary (`sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs`).

Routing is two stages: the hub picks the WORKFLOW mode (mode telemetry), this
router picks the LEAVES within it. The two layers stay separate — the hub never
emits leaf paths, and this router never re-decides the mode.

---

## 1. INTENT MODEL

- **research leaves** — the deep-research loop protocol, externalized state, and
  convergence references a `/deep:research` iteration loads.
- **review leaves** — the deep-review loop protocol, completion criteria, and
  convergence references a `/deep:review` audit loop loads.
- **ai-council leaves** — the council loop protocol, scoring rubric, and output
  schema a multi-seat deliberation loads.
- **agent-improvement leaves** — the agent-candidate proposal format, score
  dimensions, and shared promotion-gate contract the agent-improvement lane loads.
- **model-benchmark / skill-benchmark leaves** — the per-lane evaluator and
  scoring references. NOTE: all three improvement lanes multiplex onto the single
  `deep-improvement` packet, so the canonical dual-read binds any
  `deep-improvement/…` path to the first-declared improvement mode
  (`agent-improvement`); the model/skill-benchmark rows below are the disk truth
  for those lanes but cannot emit a distinct observed workflowMode without a
  per-lane packet split.
- **alignment leaves** — the scoping protocol, discover contract, and lane-config
  schema a read-only conformance audit loads.

A bare deep-loop identity term (e.g. "deep loop") names no mode, so it fires no
intent and falls back to the hub default (disambiguation).

---

## 2. MACHINE-READABLE ROUTER (replay / benchmark source)

The single machine-readable projection of the intent model above. The prose is
the human-facing contract; this block is the byte-for-byte source the
deterministic router-replay parses. Keep them in sync: when a map row changes
above, update the matching `RESOURCE_MAP` entry here. Every `RESOURCE_MAP` path
resolves on disk and is registered in `leaf-manifest.json`, so each dual-reads to
a canonical typed pair.

```python
# No always-loaded preamble: deep-loop routing loads only the selected mode's
# leaves so the hub default route stays minimal (disambiguation on no match).
DEFAULT_RESOURCE = []

INTENT_SIGNALS = {
    "RESEARCH":          {"weight": 4, "keywords": ["deep research", "iterative investigation", "research loop", "research summary", "investigate why", "autoresearch", "research convergence"]},
    "REVIEW":            {"weight": 4, "keywords": ["deep-review", "deep review of", "before running deep review", "review request", "review loop", "iterative review", "severity findings", "release readiness", "review convergence", "audit the diff"]},
    "AI_COUNCIL":        {"weight": 4, "keywords": ["ai council", "council deliberation", "multi-seat", "planning council", "council convergence", "seat diversity"]},
    "AGENT_IMPROVEMENT": {"weight": 4, "keywords": ["improve agent", "evaluate agent", "score agent", "agent candidate", "promote or roll back the agent", "agent-improvement"]},
    "MODEL_BENCHMARK":   {"weight": 4, "keywords": ["/deep:model-benchmark"]},
    "SKILL_BENCHMARK":   {"weight": 4, "keywords": ["/deep:skill-benchmark"]},
    "ALIGNMENT":         {"weight": 4, "keywords": ["conformance audit", "alignment lane", "standard authority", "conformance review", "align against the standard", "named standard"]},
}

RESOURCE_MAP = {
    "RESEARCH": [
        "deep-research/references/protocol/loop_protocol.md",
        "deep-research/references/state/state_jsonl.md",
        "deep-research/references/convergence/convergence.md"
    ],
    "REVIEW": [
        "deep-review/references/protocol/loop_protocol.md",
        "deep-review/references/protocol/completion_criteria.md",
        "deep-review/references/convergence/convergence.md"
    ],
    "AI_COUNCIL": [
        "deep-ai-council/references/integration/loop_protocol.md",
        "deep-ai-council/references/scoring/scoring_rubric.md",
        "deep-ai-council/references/structure/output_schema.md"
    ],
    "AGENT_IMPROVEMENT": [
        "deep-improvement/references/agent_improvement/candidate_proposal_format.md",
        "deep-improvement/references/agent_improvement/score_dimensions.md",
        "deep-improvement/references/shared/promotion_gate_contract.md"
    ],
    "MODEL_BENCHMARK": [
        "deep-improvement/references/model_benchmark/evaluator_contract.md",
        "deep-improvement/references/model_benchmark/lane_b_mechanics.md"
    ],
    "SKILL_BENCHMARK": [
        "deep-improvement/references/skill_benchmark/scoring_contract.md",
        "deep-improvement/references/skill_benchmark/routing_optimization.md"
    ],
    "ALIGNMENT": [
        "deep-alignment/references/scoping_protocol.md",
        "deep-alignment/references/discover_contract.md",
        "deep-alignment/references/lane_config_schema.md"
    ],
}
```

## 3. How to read this

- One dominant intent routes to one mode's leaf set.
- Two near-tied intents (within the ambiguity delta) route to both leaf sets; the
  union is deduped by canonical pair and capped at the selected-map union limit.
- The three improvement lanes share the `deep-improvement` packet: their leaves
  are distinct on disk, but the canonical dual-read attributes every
  `deep-improvement/…` observation to `agent-improvement`. Author model/skill
  benchmark typed gold from stated intent, and read observed-side collapse to
  `agent-improvement` as the shared-packet fan-out, not a routing miss.
- No keyword match is the hub's UNKNOWN fallback: confirm the target deep-loop
  mode before loading anything.
