---
title: "Tasks: Phase 2 — Rust Backend Rewrite Research: Embeddings, Vector & Serving"
description: "Execution checklist for the pre-planned 16-round deep-research pass over system-skill-advisor embeddings, vector similarity, skill graph, and daemon/MCP/CLI serving."
trigger_phrases:
  - "skill advisor rust serving tasks"
  - "embedding vector research checklist"
  - "013 phase 2 research tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/013-rust-backend-rewrite-research/002-research"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Authored the future research execution checklist; all loop tasks remain pending"
    next_safe_action: "Execute T001 by confirming cli-codex authentication and GPT-5.6-sol availability"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "research/deep-research-strategy.md"
      - "research/deep-research-fanout-config.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-11-013-002-embeddings-vector-serving-research"
      parent_session_id: null
    completion_pct: 0
    status: "Not Started"
    open_questions:
      - "Will the future smoke run confirm GPT-5.6-sol and state-file writes?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2 — Rust Backend Rewrite Research: Embeddings, Vector & Serving

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

- [ ] T001 Confirm `codex` installed, authenticated, and able to reach GPT-5.6-sol with `xhigh` reasoning and `fast` service tier
- [ ] T002 Verify `research/deep-research-fanout-config.json` has one cli-codex executor, 16 iterations, 5400-second timeout, and concurrency 1
- [ ] T003 Verify `research/deep-research-strategy.md` contains 14 angles, 16-round allocation, residency framing invariant, sibling boundary, non-goals, and stop conditions
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Smoke-test the executor at 1 round; verify a non-empty iteration file and valid JSONL delta
- [ ] T005 Launch the 16-round single-lineage loop via `/deep:research:auto`, following `plan.md` §3
- [ ] T006 Complete survey Rounds 1–7 (A1–A7) with file-cited execution-residency maps
- [ ] T007 Complete deep-validation Rounds 8–16 (A8–A14 plus A8/A14 second passes) without crossing into sibling scorer scope
- [ ] T008 Let the loop converge or hit the cap; synthesize `research/research.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Verify terminal `stopReason` in `research/deep-research-state.jsonl`
- [ ] T010 Verify every A1–A14 angle is answered or explicitly unresolved with evidence
- [ ] T011 Verify the improvement matrix, new-feature-feasibility matrix, risk register, and ranked four-option recommendation exist
- [ ] T012 Verify every performance claim labels execution residency and no “big win” counts already-native/remote work
- [ ] T013 Verify the synthesis does not claim `sqlite-vec` is currently installed and names corpus-scale break-even for native vector/graph proposals
- [ ] T014 Run strict spec validation; update future completion artifacts; stop for human review
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Loop converged/capped and all four decision artifacts are ready for review
- [ ] Residency and sibling-boundary audits pass
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Spec**: `spec.md` (14 angles and acceptance criteria)
- **Plan**: `plan.md` (16-round allocation)
- **Strategy**: `research/deep-research-strategy.md`
- **Sibling boundary**: `../001-research/`
<!-- /ANCHOR:cross-refs -->
