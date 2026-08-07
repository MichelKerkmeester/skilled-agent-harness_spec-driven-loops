---
title: "Tasks: Phase 1 — Rust Backend Rewrite Research"
description: "Execution checklist for the pre-planned 20-round deep-research pass on a Rust rewrite of the system-spec-kit backend: setup, smoke check, loop launch, synthesis, and verification."
trigger_phrases:
  - "rust rewrite research tasks"
  - "030 research tasks"
  - "rust deep research checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/030-rust-backend-rewrite-research/001-research"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the execution checklist (all pending — loop not yet run)"
    next_safe_action: "Execute T001 (confirm cli-codex auth)"
    blockers: []
    key_files:
      - "research/deep-research-strategy.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-11-030-001-research"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1 — Rust Backend Rewrite Research

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

- [ ] T001 Confirm `codex` installed + authenticated (ChatGPT OAuth) and gpt-5.5 reachable
- [ ] T002 Write `research/deep-research-fanout-config.json` (cli-codex gpt-5.5/xhigh/fast, iterations 20)
- [ ] T003 Seed `research/deep-research-strategy.md` charter (16 angles, round allocation, non-goals, stop conditions)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Smoke-test the cli-codex executor at 1 round (writes iteration file + JSONL delta)
- [ ] T005 Launch the 20-round loop in the background via `/deep:research:auto` (cli-codex), following the round→angle allocation in `plan.md` §3
- [ ] T006 Let the loop converge or hit the 20-round cap; synthesize `research/research.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Verify terminal `stopReason` in `research/deep-research-state.jsonl`
- [ ] T008 Verify `research/research.md` exists with citations + improvement matrix + new-feature-feasibility matrix + risk register + ranked recommendation
- [ ] T009 Verify REQ-004 discipline: no "big win" counts already-native (`sqlite-vec`/ONNX/tree-sitter) work; each names JS-resident code
- [ ] T010 Run `validate.sh` on the child; update implementation-summary.md; STOP for human review
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Loop converged/capped and the cited synthesis + ranked recommendation are ready for review
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Spec**: `spec.md` (16 angles)
- **Plan**: `plan.md` (round→angle allocation)
- **Strategy**: `research/deep-research-strategy.md`
<!-- /ANCHOR:cross-refs -->
