---
title: system-deep-loop Surface Router — per-mode leaf sets
description: First-class surface router document at the system-deep-loop hub root (ROUTER.md). hub-router.json selects the workflow mode; this doc maps a request's deep-loop intent to the exact packet-local leaf resources that mode should load, emitting canonical (workflowMode, leafResourceId) pairs. Relocated verbatim from shared/references/smart-routing.md (v1.0.0.0) as the ROUTER.md consolidation pattern.
trigger_phrases:
  - "system-deep-loop smart routing"
  - "deep-loop surface router"
  - "deep-loop leaf routing"
  - "deep-loop resource map"
importance_tier: important
contextType: general
version: 1.6.1.0
router_state: active
skill_pointer: SKILL.md
---

# system-deep-loop Surface Router — per-mode leaf sets

## 1. OVERVIEW

This is system-deep-loop's second-layer (surface) router, first-class at the hub root
as `ROUTER.md`. The hub selects a
workflow mode in [`hub-router.json`](hub-router.json) (`research`,
`review`, `ai-council`); this doc
maps a request's deep-loop intent to the exact packet-local leaf resources that
mode should load. Every path is packet-qualified (`<packet>/references|assets/…`,
where `<packet>` is the mode's `mode-registry.json` `packet` field) and converts
to the canonical `(workflowMode, leafResourceId)` pair at the one contract
boundary (`sk-doc/sk-create-skill/scripts/lib/leaf-resource-contract.cjs`).

Routing is two stages: the hub picks the WORKFLOW mode (mode telemetry), this
router picks the LEAVES within it. The two layers stay separate — the hub never
emits leaf paths, and this router never re-decides the mode.

---

## 2. INTENT MODEL

- **research leaves** — the deep-research loop protocol, externalized state, and
  convergence references a `/deep:research` iteration loads.
- **review leaves** — the deep-review loop protocol, completion criteria, and
  convergence references a `/deep:review` audit loop loads.
- **ai-council leaves** — the council loop protocol, scoring rubric, and output
  schema a multi-seat deliberation loads.

A bare deep-loop identity term (e.g. "deep loop") names no mode, so it fires no
intent and falls back to the hub default (disambiguation).

---

## 3. MACHINE-READABLE ROUTER (replay / benchmark source)

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
    "AI_COUNCIL":        {"weight": 4, "keywords": ["ai council", "council deliberation", "multi-seat", "planning council", "council convergence", "seat diversity"]}
}

RESOURCE_MAP = {
    "RESEARCH": [
        "deep-research/references/protocol/loop-protocol.md",
        "deep-research/references/state/state-jsonl.md",
        "deep-research/references/convergence/convergence.md"
    ],
    "REVIEW": [
        "deep-review/references/protocol/loop-protocol.md",
        "deep-review/references/protocol/completion-criteria.md",
        "deep-review/references/convergence/convergence.md"
    ],
    "AI_COUNCIL": [
        "deep-ai-council/references/integration/loop-protocol.md",
        "deep-ai-council/references/scoring/scoring-rubric.md",
        "deep-ai-council/references/structure/output-schema.md"
    ]
}
```

---

## 4. HOW TO READ THIS

- One dominant intent routes to one mode's leaf set.
- Two near-tied intents (within the ambiguity delta) route to both leaf sets; the
  union is deduped by canonical pair and capped at the selected-map union limit.
- No keyword match is the hub's UNKNOWN fallback: confirm the target deep-loop
  mode before loading anything.
