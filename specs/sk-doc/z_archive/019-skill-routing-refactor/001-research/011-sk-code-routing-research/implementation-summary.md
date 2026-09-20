---
title: "Implementation Summary: sk-code Typed-Pair Routing and Leaf Recall Research"
description: "Outcome of the eight-iteration sk-code routing deep-research: surface selection ruled out as the primary fault, monolithic leaf selection and an untyped preamble identified, anti-gamed leaf-recall candidates delivered. Findings only; handoff to 014-sk-code-router-alignment."
trigger_phrases:
  - "sk-code routing research outcome"
  - "sk-code leaf recall research status"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/001-research/011-sk-code-routing-research"
    last_updated_at: "2026-07-24T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Extracted sk-code routing research into its own 001-research phase; authored conforming docs"
    next_safe_action: "Apply the recall/typed-pair findings in 014-sk-code-router-alignment"
    blockers: []
    key_files:
      - "research/research.md"
      - "spec.md"
---
# Implementation Summary: sk-code Typed-Pair Routing and Leaf Recall Research

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete (research) |
| **Level** | 1 |
| **Packet** | sk-doc/019-skill-routing-refactor/001-research/011-sk-code-routing-research |
| **Iterations** | Eight-iteration deep-research loop |
| **Handoff** | `../014-sk-code-router-alignment/` (measurement + implementation) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A research packet — no source changes. It separated sk-code hub/surface routing from leaf-resource
routing and evaluated typed-pair recall honestly, producing:

- Evidence that **surface selection is not the primary fault**; monolithic leaf selection expands the
  candidate set.
- Identification of the untyped `DEFAULT_RESOURCE` preamble as a **separate typed-identity defect**,
  distinct from leaf recall.
- A dependency-ordered set of anti-gamed leaf-recall candidates: freeze same-revision baselines,
  separate minimum from exhaustive gold, instrument ordered successful reads + route-decision
  provenance, then test two-tier resource selection before specificity weighting.

The canonical synthesis and supporting evidence live under `research/`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

An eight-iteration deep-research loop read the current router inputs, the index-table leaf shape, the
shared benchmark replay + scorer chain, the universal preamble, and the available live leaf-read
evidence, pinning each claim to file-level evidence and recording an append-only iteration/delta state.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- Findings-only: implementation and measurement are out of scope and hand off to `014-sk-code-router-alignment`.
- The index-table's lossy typed-pair recovery is treated as a documented characteristic, not a defect.
- Every leaf-recall candidate must be validated against gaming before it is proposed for the build.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

All in-scope research questions are answered with evidence in `research/research.md`. This is a
research packet; there is no runtime verification gate — the deliverable is the evidence-backed
synthesis and the anti-gamed candidate list.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Live leaf-read evidence is bounded; the research recommends ordered-successful-read and
   route-provenance instrumentation to strengthen it in the implementation phase.
2. Findings are not applied here — the recall/typed-pair improvements have no effect until the sk-code
   implementation phase builds them.
<!-- /ANCHOR:limitations -->
