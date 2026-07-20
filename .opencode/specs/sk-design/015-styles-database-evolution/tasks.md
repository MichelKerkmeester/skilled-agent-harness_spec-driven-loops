---
title: "Tasks: sk-design styles database evolution roadmap"
description: "Planned work items T001-T019 for the 4-phase styles-DB evolution roadmap, grouped by roadmap phase and mapped to REQ-001..006; all PLANNED (nothing built)."
trigger_phrases:
  - "styles database evolution tasks"
  - "styles db roadmap task list"
  - "sk-design styles db planned work items"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/015-styles-database-evolution"
    last_updated_at: "2026-07-20T06:36:16Z"
    last_updated_by: "spec-author"
    recent_action: "Author the roadmap task list (T001-T019, all PLANNED) mapped to phases + REQs"
    next_safe_action: "Author checklist.md + implementation-summary.md for this packet"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/_db/retrieval.mjs"
      - ".opencode/skills/sk-design/styles/_db/vectors.mjs"
      - ".opencode/specs/sk-design/013-styles-database-rust-opportunities/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: sk-design styles database evolution roadmap

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [Roadmap Phase: P# | REQ: REQ-0## [, REQ-0##...] | STATUS: PLANNED] Description`

No `(file path)` segment is used in this packet's task format: per `spec.md` §3 Scope, "Files to Change" is `None` — this is a planning packet that authors only its own spec-folder docs, so no task names a source file to touch.

- **T-id**: sequential `T001`-`T019`, one per planned work item across the whole roadmap (not reset per template bucket).
- **Roadmap Phase tag** (`P0`-`P3`): the task's TRUE roadmap phase, taken from `plan.md` §4 Implementation Phases — Phase 0 Evidence & Contract, Phase 1 JS Capability Features, Phase 2 Measured Native Experiments (conditional), Phase 3 Growth Architecture (10x-100x only).
- **REQ tag**: one or more of REQ-001..REQ-006 from `spec.md` §4 Requirements that the task satisfies.
- **STATUS tag**: every task below is `PLANNED` — this packet ships the roadmap only; nothing is built yet.

**Roadmap-phase vs. template-bucket mapping**: this template's three fixed H2 buckets (`Phase 1: Setup`, `Phase 2: Implementation`, `Phase 3: Verification`) are structural anchors only — they do NOT correspond 1:1 to this packet's four roadmap phases (Roadmap Phase 0-3 defined in `plan.md`). The mapping used in this document is:

| Template bucket (this doc's H2 anchor) | Roadmap phase(s) it holds |
|---|---|
| `## Phase 1: Setup` | Roadmap Phase 0 — Evidence & Contract |
| `## Phase 2: Implementation` | Roadmap Phase 1 — JS Capability Features, and Roadmap Phase 2 — Measured Native Experiments (conditional) |
| `## Phase 3: Verification` | Roadmap Phase 3 — Growth Architecture (10x-100x only) |

Each task's `[Roadmap Phase: P#...]` tag is the authoritative phase identity. The template-bucket heading a task sits under is a structural container required by the Level 2 `tasks.md` template — it is not itself a roadmap-phase claim.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Roadmap Phase 0 — Evidence & Contract

- [ ] T001 [Roadmap Phase: P0 | REQ: REQ-001, REQ-003 | STATUS: PLANNED] Design and build the versioned multi-artifact "generation manifest": atomically publishes SQLite + screenshot features + model profiles + optional index under ONE pointer, with rollback.
- [ ] T002 [Roadmap Phase: P0 | REQ: REQ-001 | STATUS: PLANNED] Instrument stage telemetry across the indexer and query lanes (per-stage latency, throughput, RSS).
- [ ] T003 [Roadmap Phase: P0 | REQ: REQ-001, REQ-002 | STATUS: PLANNED] Pin the TypeScript differential oracle — freeze current outputs as the reference (DTO shape, hashes, ordering, tie-breaks).
- [ ] T004 [Roadmap Phase: P0 | REQ: REQ-001 | STATUS: PLANNED] Build representative 1x/10x/100x replay fixtures.
- [ ] T005 [Roadmap Phase: P0 | REQ: REQ-001 | STATUS: PLANNED] Assemble labeled relevance judgments for retrieval-quality measurement.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Roadmap Phase 1 — JS Capability Features

- [ ] T006 [Roadmap Phase: P1 | REQ: REQ-004 | STATUS: PLANNED] DOM-derived responsive layout fingerprints from the crawler's rectangles/padding/margins/gaps/flex/grid/landmarks across 5 viewports.
- [ ] T007 [Roadmap Phase: P1 | REQ: REQ-004 | STATUS: PLANNED] Screenshot palette/statistics + perceptual dedupe via sharp/libvips (pHash for near-duplicate detection ONLY, never as a semantic style ranker).
- [ ] T008 [Roadmap Phase: P1 | REQ: REQ-004 | STATUS: PLANNED] Shadow multimodal (text+image / CLIP) retrieval lane over the existing Node ONNX / Transformers.js (onnxruntime-node) stack.
- [ ] T009 [Roadmap Phase: P1 | REQ: REQ-004 | STATUS: PLANNED] Batch the embedding queue (replace today's one-embedder-call-per-job draining with batch-aware scheduling).
- [ ] T010 [Roadmap Phase: P1 | REQ: REQ-004 | STATUS: PLANNED] Auto-reindex watcher (Chokidar + periodic reconciliation; reconciliation is authority, the watcher is only a trigger).
- [ ] T011 [Roadmap Phase: P1 | REQ: REQ-004, REQ-002 | STATUS: PLANNED] Optional parsed-projection cache — build ONLY if Phase 0 cold-build telemetry proves value.

### Roadmap Phase 2 — Measured Native Experiments (conditional)

- [ ] T012 [Roadmap Phase: P2 | REQ: REQ-005, REQ-002 | STATUS: PLANNED] Evaluate maintained sqlite-vec / native EXACT vector search (removes JSON-parse + JS-sort) — conditional on a measured SLO crossing.
- [ ] T013 [Roadmap Phase: P2 | REQ: REQ-005 | STATUS: PLANNED] Prototype a supervised Rust `ort` inference sidecar for crash/RSS/deployment ISOLATION (NOT presumed speed).
- [ ] T014 [Roadmap Phase: P2 | REQ: REQ-005, REQ-002 | STATUS: PLANNED] Bounded Rust parse core — conditional on measured parse cost.
- [ ] T015 [Roadmap Phase: P2 | REQ: REQ-005, REQ-003 | STATUS: PLANNED] Enforce the sk-code/018 shape + end-to-end oracle-win + byte-for-byte parity gate on every Phase 2 experiment (TS shell + thin napi-rs adapter + `#![forbid(unsafe_code)]` core). A valid outcome is "no Rust."
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Roadmap Phase 3 — Growth Architecture (10x-100x only)

- [ ] T016 [Roadmap Phase: P3 | REQ: REQ-006 | STATUS: PLANNED] Fix the eligible-ID SQL-parameter shape (broad queries exceed SQLite's 32,766-variable limit at ~25% eligibility) — correctness BEFORE ANN.
- [ ] T017 [Roadmap Phase: P3 | REQ: REQ-006, REQ-003 | STATUS: PLANNED] Maintained HNSW/ANN with filter-aware recall + explicit approximation/byte-parity contract (separately-versioned; exact re-score + exact fallback).
- [ ] T018 [Roadmap Phase: P3 | REQ: REQ-006, REQ-002 | STATUS: PLANNED] Custom Rust ANN — last resort, only for a proven capability gap maintained ANN cannot meet.
- [ ] T019 [Roadmap Phase: P3 | REQ: REQ-006 | STATUS: PLANNED] Shared cross-skill Rust core — gated on a real second consumer (spec-memory); system-code-graph excluded.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All T001-T019 are PLANNED; this packet ships the roadmap only. Nothing is complete.
- [ ] Each future per-phase packet implements its task group after that phase's entry gate passes (Phase 0 blocks all).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md` (REQ-001..REQ-006)
- **Plan**: See `plan.md` (Phase 0-3 architecture + entry/exit gates)
- T001-T005 → REQ-001/002/003 → plan Phase 0.
- T006-T011 → REQ-004 → plan Phase 1.
- T012-T015 → REQ-005 → plan Phase 2.
- T016-T019 → REQ-006 → plan Phase 3.
- Governing invariants REQ-002 (Rust-only-if-measured) and REQ-003 (parity/rollback) apply across ALL phases.
<!-- /ANCHOR:cross-refs -->
