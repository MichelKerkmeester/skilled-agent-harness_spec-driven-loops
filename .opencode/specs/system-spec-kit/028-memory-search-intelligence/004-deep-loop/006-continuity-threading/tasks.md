---
title: "Tasks: Deep Loop Continuity Threading (028/004 continuity / iterative-retrieval cluster)"
description: "Task breakdown for the deep-loop continuity GO cluster: the per-iteration self-owned carried-forward block (C1) ships first, then the answer-as-next-query next-focus derivation (C2). Planning/research tasks pre-checked; both candidates PENDING (neither shipped in 030 Wave-0)."
trigger_phrases:
  - "continuity threading tasks"
  - "carried forward block tasks"
  - "iterative retrieval tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/004-deep-loop/006-continuity-threading"
    last_updated_at: "2026-06-19T10:30:00+02:00"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored task breakdown for the continuity-threading cluster"
    next_safe_action: "Begin T007 seam read, then decide the carried-forward block carrier"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-004-006-replan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: Deep Loop Continuity Threading (028/004 continuity / iterative-retrieval cluster)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

> **Candidate status (against 030 §14):** BOTH candidates are **PENDING**. `Q5-carried-forward` and `DL-iterative-retrieval-loop` appear NOWHERE in `030-memory-search-intelligence-impl/spec.md` §14 (13 candidates) or its body — the 030 Deep-Loop entry (candidate 12, commit `46812f12a8`) shipped merge total-order + pool gauges + graceful-self-stop only. No implementation task here is pre-checked `[x]`; only the planning/research tasks that produced this sub-phase are.

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Pull Q5-carried-forward detail from research (`../research/research.md` Q5; `iteration-002.md`, `iteration-006.md`, `iteration-009.md`) [research]
- [x] T002 Pull DL-iterative-retrieval-loop detail from the MEMORY-SYSTEMS ADDENDUM (`../../research/roadmap.md`; `../../research/synthesis/06-memory-systems-findings.md` #15) [research]
- [x] T003 Confirm continuity is EXACTLY two injection paths (reducer anchors `reduce-state.cjs:734-745` + prompt-pack vars `prompt_pack_iteration.md.tmpl:9-26`) — iter-6 F6-02 [research]
- [x] T004 Confirm the `resolveNextFocus` hand-written seam (`reduce-state.cjs:519-541`, return `:538`) and the machine-owned `openQuestions` fold (`:629-650`) against live code [research]
- [x] T005 Confirm the convergence stop is already built (`convergence.cjs:107,285,368`) so C2 is bounded [research]
- [x] T006 Confirm neither candidate shipped in 030 §14 (both PENDING) [research]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### C1 — Q5-carried-forward (the durable self-owned thread)
- [ ] T007 Read `reduce-state.cjs:519-541,629-650,734-745` + `prompt_pack_iteration.md.tmpl:9-26` + `prompt-pack.ts:55-73` before editing (`reduce-state.cjs`) [20m]
- [ ] T008 Decide and record the carrier for the self-owned block: strategy anchor section vs new prompt-pack variable vs per-iteration delta-record field (§3 seam-confirmation note) (`spec.md` OPEN QUESTIONS) [15m]
- [ ] T009 Emit a per-iteration SELF-owned carried-forward open-questions block, host-computed from existing iteration records — NO new model call (`reduce-state.cjs`) [1h]
- [ ] T010 De-duplicate the self-owned block against the machine-owned `openQuestions` fold (`:629-650`) so no question is double-listed (`reduce-state.cjs`) [30m]
- [ ] T011 [P] If a new prompt-pack variable is used, have the reducer supply it; preserve the throw-on-missing renderer contract (`prompt_pack_iteration.md.tmpl`, `prompt-pack.ts`) [30m]

### C2 — DL-iterative-retrieval-loop (derive next-focus from the prior answer)
- [ ] T012 Rewrite `resolveNextFocus`'s hand-written return (`:538`) to DERIVE the next focus from the prior iteration's answer/findings, reading C1's block where present (`reduce-state.cjs`) [1h]
- [ ] T013 Preserve the blocked-stop precedence branch (`:520-535`) ahead of the derived focus (REQ-C4) (`reduce-state.cjs`) [20m]
- [ ] T014 Preserve the terminal sentinel (`:540`) and add the iteration-1 / empty-findings fallback to the strategy-question focus — no regression (`reduce-state.cjs`) [30m]
- [ ] T015 Verify NO new convergence/saturation primitive is added; the existing `convergence.cjs` stop is the only loop bound (SC-002) (`reduce-state.cjs`) [20m]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Unit Tests
- [ ] T016 Test the carried-forward block is emitted and distinguishable from the machine-owned fold (no double-listing) [30m]
- [ ] T017 Test the carried-forward block is idempotent on re-reduce (REQ-C5) [20m]
- [ ] T018 Test next-focus is derived from a prior answer (answer-as-next-query) [30m]
- [ ] T019 Test iteration-1 / empty-findings falls back to the strategy-question focus (regression) [20m]
- [ ] T020 Test the blocked-stop precedence is preserved ahead of the derived focus [20m]
- [ ] T021 Test the all-resolved terminal sentinel still fires [15m]

### Integrity & Regression
- [ ] T022 Confirm continuity is still EXACTLY two injection paths — grep the diff for any new inject/append/anchor seam (REQ-C3) [20m]
- [ ] T023 `node --check` on every touched `.cjs` [10m]
- [ ] T024 Capture the reducer/prompt-pack test baseline, then run the focused suite green vs baseline (regression-baseline rule) [30m]

### Documentation
- [ ] T025 Update spec.md with implementation notes (carrier decision, final seams) [15m]
- [ ] T026 Complete implementation-summary.md (per-candidate DONE + commit evidence) [20m]
- [ ] T027 `validate.sh --strict` on this sub-phase passes [10m]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All implementation tasks marked `[x]` with commit evidence
- [ ] No `[B]` blocked tasks remaining
- [ ] All unit tests passing
- [ ] Continuity verified to remain exactly two injection paths (no third channel)
- [ ] C2 verified to add no new convergence/saturation primitive
- [ ] `node --check` + reducer/prompt-pack suite green vs baseline
- [ ] `validate.sh --strict` passes

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent research**: `../research/research.md` (Q5); `../../research/synthesis/06-memory-systems-findings.md` (#15)
- **Shipped record**: `../../../030-memory-search-intelligence-impl/spec.md` §14 (neither candidate present)

<!-- /ANCHOR:cross-refs -->
