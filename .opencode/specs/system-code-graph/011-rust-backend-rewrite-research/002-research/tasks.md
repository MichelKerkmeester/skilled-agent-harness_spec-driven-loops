---
title: "Tasks: Phase 2 - Query & Serving Rust Backend Rewrite Research"
description: "Execution checklist for the future 16-round deep-research pass on Rust feasibility for system-code-graph query and serving: setup, smoke, loop launch, synthesis, residency audit, and verification."
trigger_phrases:
  - "query serving rust research tasks"
  - "011 phase 002 tasks"
  - "code graph rust research checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/011-rust-backend-rewrite-research/002-research"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Authored the pending execution checklist for the 16-round query-and-serving research pass"
    next_safe_action: "Execute T001 by confirming cli-codex and GPT-5.6-sol access"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "research/deep-research-strategy.md"
      - "research/deep-research-fanout-config.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-11-code-graph-011-002-query-serving-rust-research"
      parent_session_id: null
    completion_pct: 0
    status: "Not Started"
    open_questions:
      - "Will the future smoke run prove executor and state-output compatibility?"
      - "Will the synthesis identify a native boundary with positive measured economics?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2 - Query & Serving Rust Backend Rewrite Research

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

- [ ] T001 Confirm `codex` authentication and `gpt-5.6-sol` xhigh/fast availability
- [ ] T002 Record the source revision and confirm the sibling phase boundary (`../001-research/`)
- [ ] T003 Verify `research/deep-research-fanout-config.json` has 16 iterations and concurrency 1
- [ ] T004 Verify `research/deep-research-strategy.md` has A1-A12, allocation, framing invariant, non-goals, stop conditions, and evidence rules
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Smoke-test one future cli-codex round through the `/deep:research` workflow (iteration file + JSONL delta)
- [ ] T006 Launch the future 16-round loop via `/deep:research:auto`, following `plan.md` survey/deep-validation allocation
- [ ] T007 Let the loop converge or reach the cap; preserve one focus and negative findings per round
- [ ] T008 Synthesize `research/research.md` with the improvement matrix, new-feature-feasibility matrix, risk register, and ranked recommendation
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Verify a terminal stop reason and coverage of A1-A12
- [ ] T010 Verify every performance claim labels JS-resident, FFI/native-resident, I/O wait, or transport/serialization
- [ ] T011 Verify no big win counts SQLite or parser execution and every native target names current JS-resident code
- [ ] T012 Verify semantic parity coverage: ordering, ambiguity, limits/depth, traces, partial outputs, readiness/trust, diff attribution, MCP schemas, and CLI parity
- [ ] T013 Verify citations and confirmed-vs-inferred labels; run strict packet validation after parent-generated metadata is available
- [ ] T014 Stop for human review; do not write Rust or modify backend source
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks are marked `[x]`
- [ ] No `[B]` tasks remain
- [ ] The loop converged/capped and all four decision artifacts are review-ready
- [ ] The recommendation ranks full rewrite, targeted napi-rs/WASM module, Rust sidecar, and do-not-rewrite
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Spec**: `spec.md` (A1-A12 charter)
- **Plan**: `plan.md` (16-round allocation)
- **Strategy**: `research/deep-research-strategy.md`
- **Config**: `research/deep-research-fanout-config.json`
<!-- /ANCHOR:cross-refs -->
