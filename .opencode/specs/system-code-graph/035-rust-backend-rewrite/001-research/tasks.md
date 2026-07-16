---
title: "Tasks: Phase 1 — Rust Ingestion & Storage Backend Rewrite Research"
description: "Execution checklist for the future pre-planned 16-round deep-research pass on a Rust rewrite of the system-code-graph ingestion and storage backend: setup, smoke check, loop launch, synthesis, and verification."
trigger_phrases:
  - "code graph rust ingestion tasks"
  - "011 phase 001 research tasks"
  - "ingestion storage research checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/035-rust-backend-rewrite-research/001-research"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Authored the future loop execution checklist; all execution tasks remain pending"
    next_safe_action: "Execute T001 by confirming the configured cli-codex executor"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "research/deep-research-strategy.md"
      - "research/deep-research-fanout-config.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-11-code-graph-011-001-ingestion-storage-research"
      parent_session_id: null
    completion_pct: 0
    status: "Not Started"
    open_questions:
      - "Will the future loop converge before all 16 allocated rounds?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1 — Rust Ingestion & Storage Backend Rewrite Research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm `codex` is installed/authenticated and GPT-5.6-sol is reachable with `xhigh` reasoning and `fast` service tier
- [ ] T002 Confirm `research/deep-research-fanout-config.json` parses and defines one cli-codex executor with 16 iterations
- [ ] T003 Review `research/deep-research-strategy.md` for all 12 angles, round allocation, native-vs-JS invariant, non-goals, stop conditions, and phase-002 boundary
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Smoke-test the configured executor at 1 round through the supported `/deep:research` workflow (iteration file + JSONL delta)
- [ ] T005 Launch the 16-round single-lineage loop via `/deep:research:auto`, following the allocation in `plan.md` §3
- [ ] T006 Let the workflow converge or hit the cap and synthesize `research/research.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Verify terminal `stopReason` and valid append-only records in `research/deep-research-state.jsonl`
- [ ] T008 Verify A1–A12 coverage plus the improvement matrix, new-feature-feasibility matrix, risk register, and ranked recommendation
- [ ] T009 Verify every performance verdict identifies JS-resident or FFI/native-resident work and excludes unmeasured WASM parser/SQLite execution from "big win" credit
- [ ] T010 Verify phase-002 query/traversal/context/ranking/transport scope was not absorbed; run strict packet validation; stop for human review
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Loop converged/capped and the cited ingestion/storage synthesis plus ranked recommendation are ready for review
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Spec**: `spec.md` (12 predefined angles)
- **Plan**: `plan.md` (16-round allocation)
- **Strategy**: `research/deep-research-strategy.md`
- **Sibling boundary**: `../002-research/`
<!-- /ANCHOR:cross-refs -->
