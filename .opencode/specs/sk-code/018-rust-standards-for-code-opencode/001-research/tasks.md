---
title: "Tasks: Phase 1 — Rust Standards Deep Research"
description: "Execution checklist for the 10-round GPT-5.6-sol deep-research pass on Rust standards for code-opencode: setup, worktree isolation, smoke check, loop launch, synthesis, and verification."
trigger_phrases:
  - "018 rust research tasks"
  - "rust standards research checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/018-rust-standards-for-code-opencode/001-research"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the execution checklist (all pending — loop not yet run)"
    next_safe_action: "Execute T001 (executor pre-flight)"
    blockers: []
    key_files:
      - "research/deep-research-strategy.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-11-sk-code-018-001-rust-standards-research"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1 — Rust Standards Deep Research

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

- [ ] T001 Pre-flight: `opencode` installed, `openai` provider authed, `openai/gpt-5.6-sol-fast` resolvable (`opencode models openai`)
- [ ] T002 Write `research/deep-research-fanout-config.json` (cli-opencode, openai/gpt-5.6-sol-fast, high, iterations 10) — done
- [ ] T003 Seed `research/deep-research-strategy.md` (3 thrusts, 11 angles, framing invariant, deliverables, stop conditions) — done
- [ ] T004 Create/point at an isolated git worktree for the run; record a clean baseline commit hash
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Smoke-test the cli-opencode executor at 1 round (writes iteration file + JSONL delta)
- [ ] T006 Launch the 10-round loop via the `/deep:research` owned runner, following the round→angle allocation in `plan.md` §3
- [ ] T007 Let the loop converge or hit the 10-round cap; synthesize `research/research.md` with the four deliverables
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Verify terminal `stopReason` in `research/deep-research-state.jsonl`
- [ ] T009 Verify `research/research.md` has the Rust standard synthesis + upgrade manifest + template-conformance map + gate plan, with citations
- [ ] T010 Verify every angle A1–A11 appears in at least one round; confirm the manifest preserves the parent-hub union equality
- [ ] T011 Run `validate.sh` on the child; update `implementation-summary.md`; hand off to `002-upgrade/`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Loop converged/capped and the Rust standard + upgrade manifest are ready for phase 002
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Spec**: `spec.md` (11 angles)
- **Plan**: `plan.md` (round→angle allocation)
- **Strategy**: `research/deep-research-strategy.md`
<!-- /ANCHOR:cross-refs -->
