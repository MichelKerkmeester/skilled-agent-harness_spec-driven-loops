---
title: "Tasks: Packet 126 deep-agent-improvement evaluator hardening"
description: "Task list for packet 126 evaluator hardening."
trigger_phrases:
  - "packet 126 tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/005-deep-agent-improvement/006-evaluator-hardening"
    recent_action: "Completed packet 126 tasks."
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "codex"
    next_safe_action: "Run strict validation."
---
# Tasks: Packet 126 deep-agent-improvement evaluator hardening

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
| --- | --- |
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

Task format: `T### [P?] Description (path) {deps: T###}`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:milestones -->
## Milestone Reference

| Milestone | Tasks | Target |
| --- | --- | --- |
| M1 | T001-T006 | Setup complete |
| M2 | T007-T017 | Implementation complete |
| M3 | T018-T025 | Verification complete |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read packet 123 research synthesis (`research-report.md`).
- [x] T002 Read packet 123 roadmap (`improvement-roadmap.md`).
- [x] T003 Read packet 124 ADR-001 (`decision-record.md`).
- [x] T004 Read packet 121/122 precedent evidence.
- [x] T005 Inspect DAI scorer, promotion, mutation, lineage, reducer, and tests.
- [x] T006 Confirm scope boundaries and existing dirty worktree state.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 Add shared promotion gate constants (`scripts/lib/promotion-gates.cjs`) {deps: T005}.
- [x] T008 Wire named gates into scorer output (`scripts/score-candidate.cjs`) {deps: T007}.
- [x] T009 Wire named gates into promotion enforcement (`scripts/promote-candidate.cjs`) {deps: T007}.
- [x] T010 Add scorer input hash/cache and `--no-cache` (`scripts/score-candidate.cjs`) {deps: T008}.
- [x] T011 Add runtime mirror coverage checkpoint (`scripts/score-candidate.cjs`) {deps: T010}.
- [x] T012 Add empty-field signature sentinels (`scripts/mutation-coverage.cjs`) {deps: T005}.
- [x] T013 Add candidate proposal content-hash dedup (`scripts/candidate-lineage.cjs`) {deps: T005}.
- [x] T014 Add dashboard unscored dimension rendering (`scripts/reduce-state.cjs`) {deps: T005}.
- [x] T015 Add regression tests (`scripts/tests/*.vitest.ts`) {deps: T010,T012,T013,T014}.
- [x] T016 Update reference docs (`references/*.md`) {deps: T007,T010,T013}.
- [x] T017 Author Level 3 spec docs (`126-*/*.md`) {deps: T001-T016}.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T018 Run syntax checks for modified `.cjs` scripts.
- [x] T019 Attempt existing Vitest tests.
- [x] T020 Run direct Node smoke for DAI-005 reproducibility.
- [x] T021 Run direct Node smoke for DAI-012 mutation signature sentinels.
- [x] T022 Run direct Node smoke for candidate content-hash dedup.
- [x] T023 Run direct Node smoke for dashboard unscored dimensions.
- [x] T024 Run strict spec validation.
- [x] T025 Write Commit Handoff in `implementation-summary.md`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked complete.
- [x] Six P1 deliverables closed.
- [x] Strict validation passes.
- [x] Verification limitations recorded.
- [x] Commit handoff included.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Specification: `spec.md`
- Plan: `plan.md`
- Checklist: `checklist.md`
- Decision record: `decision-record.md`
- Implementation summary: `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

---

<!-- ANCHOR:architecture-tasks -->
## Architecture Tasks

- [x] AT-001 Record ADR-001 for deterministic inputs, promotion gates, and null-dimension transparency.
- [x] AT-002 Keep runtime mirror coverage advisory-only to preserve packet 127 boundary.
- [x] AT-003 Keep cache storage outside tracked source by default.
<!-- /ANCHOR:architecture-tasks -->
