---
title: "Changelog: Skill Advisor Phase Parent"
description: "Chronological changelog for the Skill Advisor phase parent spec root."
trigger_phrases:
  - "root changelog"
  - "packet changelog"
  - "nested changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-06-19

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-skill-advisor` (Level 2)

### Summary

This rollup now reflects the child phase evidence instead of the raw generator output. Four phases shipped default-off or correctness-scoped scorer work, two phases shipped shadow-only builds and one phase shipped a stale-embedding signal with its rebuild gated on a shared cursor primitive. Detailed scope remains in the linked child changelogs.

### Included Phases

| Phase | Status | Summary |
|---|---|---|
| [`001-rrf-determinism-spine`](./changelog-003-001-rrf-determinism-spine.md) | Implemented default-off | Shared RRF is wired into the advisor behind a flag, with deterministic tie behavior and conflict demotion preserved outside the RRF lane sum. The live flip still needs routing-agreement evidence. |
| [`002-runtime-lane-health-degrade`](./changelog-003-002-runtime-lane-health-degrade.md) | Implemented | Runtime-degraded lanes are separated from matched-nothing lanes, confidence normalization degrades to the remaining lanes and handler output names the degraded state safely. |
| [`003-embedding-staleness-signal`](./changelog-003-003-embedding-staleness-signal.md) | Signal implemented, rebuild gated | Projection load now detects stale embedding identity and degrades semantic shadow on stale vectors. The rebuild reuse remains gated on the shared durable cursor primitive. |
| [`004-c4-shadow-seam-beta-posterior`](./changelog-003-004-c4-shadow-seam-beta-posterior.md) | Implemented shadow-only with gates pending | The shared Beta posterior primitive, the out-of-process shadow-weight promoter and the two-gate, held-out and decay policy shipped behind the frozen live channel. Live promotion still needs a micro-benchmark, per-lane attribution and a daemon reload trigger. |
| [`005-conflict-rerank-query-routing`](./changelog-003-005-conflict-rerank-query-routing.md) | Implemented default-off | Conflict demotion, query-class routing and exact semantic rerank shipped as inert flagged seams. Live promotion needs data and benchmarks. |
| [`006-provenance-drift-observability`](./changelog-003-006-provenance-drift-observability.md) | Partially implemented | The self-recommendation guard shipped default-off. Drift sweep and named skips remain blocked on a durable attested-baseline substrate. |
| [`007-outcome-weighted-ranking-followon`](./changelog-003-007-outcome-weighted-ranking-followon.md) | Implemented shadow-only with gates pending | The execution-outcome store, ambient fold tick, shadow rerank, failure recall and BM25 calibration seam landed without changing live order. Emitter trigger and shared Beta wiring remain open. |

### Added

- Added linked rollup rows for all seven child changelogs.
- Added corrected child status language grounded in each phase's task list and implementation summary.

### Changed

- Replaced the phase-parent placeholder with a narrative rollup of shipped, shadow-only and planning-only outcomes.
- Rewrote raw generated child summaries into compact house-voice rollup entries.

### Fixed

- Corrected stale draft labels for phases that had implemented or partially implemented work.
- Corrected the outcome-weighted follow-on row from planning-only to shadow-only implemented with gates pending.
- Corrected the C4 shadow-seam row from planning closeout to shadow-only implemented, after git confirmed the Beta primitive, promoter seam and tests landed.

### Verification

| Check | Result |
|-------|--------|
| Child changelog inventory | PASS, 7 child changelogs plus root |
| Source grounding | PASS, summaries checked against child specs, tasks and implementation summaries |
| Link check | PASS, each phase row links to its local changelog |

### Files Changed

| File | Action | What changed |
|---|---|---|
| `changelog-003-root.md` | Updated | Parent rollup rewritten with linked child summaries |

### Follow-Ups

- Use the child changelogs for exact verification details and open gates.
