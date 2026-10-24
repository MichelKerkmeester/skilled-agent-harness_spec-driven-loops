---
title: "Tasks: Phase 29: relaunch-evidence-gaps-and-playbook-drift"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "relaunch evidence gaps tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 29: relaunch-evidence-gaps-and-playbook-drift

<!-- SPECKIT_LEVEL: 2 -->

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

- [ ] T001 Baseline: run the relaunch gate and record the totals
- [ ] T002 Clear leftover hand-over records and tmux sessions from earlier runs
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Rerun the Codex withdraw scenario with a wait sized to the reply and save the transcript (`scratch/`)
- [ ] T004 Rerun the Claude extra-nudge scenario several times, count first-attempt successes and trace the producer if it fails (`scratch/`)
- [ ] T005 If a producer is found, write the failing test first and fix it at the source (`.skilled/hooks/session-relaunch/`)
- [ ] T006 Run the Pi adapter and extension suites and record the totals (`scratch/`)
- [ ] T007 Run the OpenCode import smoke and the shim suite, then correct the two playbook lines to the printed output (`session-relaunch-pi-opencode.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Rerun the relaunch gate and report the delta against the baseline
- [ ] T009 Run the sk-doc validators on each changed playbook and `validate.sh --strict` on this folder
- [ ] T010 Confirm no hand-over record or tmux session remains
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Codex and Claude credentials available, or the rerun recorded as SKIP
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Any changed code file passes `node --check`, and playbook snippets run under bash and zsh
- [ ] CHK-011 [P0] No console errors or warnings in the suite output
- [ ] CHK-012 [P1] Error handling implemented, and a failed step never blocks a session start
- [ ] CHK-013 [P1] Code follows project patterns and carries no artifact ids in comments
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met (see acceptance-criteria.md)
- [ ] CHK-021 [P0] The relaunch gate passes in the final state, delta against the baseline reported
- [ ] CHK-022 [P1] Edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence` or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs and tests.
- [ ] CHK-FIX-004 [P0] No path, parser or redaction change is in this phase unless the retry fix adds one, in which case adversarial table tests are added.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env and global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or an explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets, and no credential or key read, logged or written
- [ ] CHK-031 [P0] Input validation implemented for every path and value read from a note or an environment variable
- [ ] CHK-032 [P1] Auth and authz not applicable: the state files are local and keep their `0o700` directory mode
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks synchronized
- [ ] CHK-041 [P1] Code comments carry the reason, with no artifact ids
- [ ] CHK-042 [P2] Each changed playbook passes the sk-doc validators
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files kept in the session scratchpad or scratch/
- [ ] CHK-051 [P1] scratch/ holds only evidence this packet cites
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-10-24
<!-- /ANCHOR:summary -->

---
