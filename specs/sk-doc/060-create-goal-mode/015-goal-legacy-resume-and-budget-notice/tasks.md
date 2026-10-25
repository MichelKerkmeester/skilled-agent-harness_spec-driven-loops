---
title: "Tasks: Phase 15: goal-legacy-resume-and-budget-notice"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "goal legacy resume budget notice tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 15: goal-legacy-resume-and-budget-notice

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

- [x] T001 Baseline: run the OpenCode goal suites and the shared hook suites and record the totals (151 of 151 and 87 of 87, both exit 0)
- [x] T002 Read the resume path and name the suppression reasons the retired caps and budget set (`opencode-goal.js`): `auto_turn_cap_reached`, `wall_clock_cap_reached`, `budget_exhausted`, `token budget reached`
- [x] T003 Check which docs and playbooks pass `--budget` today (`rg` over `.skilled` and `.opencode`): the command doc, the plugin doc, two playbooks, one catalog entry, the goal core and CLI; none is changed because the option stays
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the failing tests first: a legacy-suppressed record resumes, an unknown reason is left alone, a recorded budget prints the notice (`opencode-goal-lifecycle.test.cjs`, `opencode-goal-capabilities.test.cjs`)
- [x] T005 Make resume clear a suppression set by a retired reason (`opencode-goal.js`)
- [x] T006 Print the budget notice (`opencode-goal.js`)
- [x] T007 Say how a suppressed goal resumes and that the budget is a reading (`goal-plugin.md`, `goal-opencode.md`)
- [x] T008 Correct limitation 2 in the phase 14 summary (`014-goal-no-budget-stop/implementation-summary.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Negative control: run the new tests against today's plugin and confirm each fails (the two behavior tests fail, the two guard tests pass by design; see the summary)
- [B] T010 Run OpenCode live with autonomy off, then on, read the plugin status counter past 8, then pause and clear the goal (`scratch/`): BLOCKED, the model provider returned a 402 quota error; recorded as SKIP in `scratch/live-run-skip.txt`
- [x] T011 Rerun the whole goal gate and the sk-code drift guards and report the delta, then run `validate.sh --strict` on this folder
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` (T010 is blocked)
- [ ] No `[B]` blocked tasks remaining (T010)
- [ ] Manual verification passed (the live run is a SKIP)
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

- [x] CHK-001 [P0] Requirements documented in spec.md (documented in spec.md)
- [x] CHK-002 [P0] Technical approach defined in plan.md (plan.md)
- [x] CHK-003 [P1] Dependencies identified and available (baseline suites ran; the OpenCode model quota did not hold)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Changed code files pass `node --check` and `bash -n` where they apply (`node --check .opencode/plugins/opencode-goal.js` exit 0)
- [x] CHK-011 [P0] No console errors or warnings in the suite output (suite output has no errors or warnings: 155 of 155, exit 0)
- [x] CHK-012 [P1] Error handling implemented, and a failed step never blocks a session start (resume failures return a STATUS=FAIL envelope and a start never depends on this path)
- [x] CHK-013 [P1] Code follows project patterns and carries no artifact ids in comments (no artifact ids in the new plugin comments)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met (see acceptance-criteria.md): AC-002 is Unmet, the live run is a SKIP
- [x] CHK-021 [P0] The OpenCode goal suites and the shared hook suites pass in the final state, delta reported (155 of 155 (was 151) and 87 of 87, exit 0 each)
- [x] CHK-022 [P1] Edge cases tested (unknown reason, plain active goal, paused and budget-limited resume covered)
- [x] CHK-023 [P1] Error scenarios validated (invalid budget still fails closed (existing test); unreadable-record path unchanged)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each finding has a class: the stuck record is `class-of-bug`, the silent budget is `instance-only`, the wrong cleanup sentence is `instance-only`. (classes recorded in this row)
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. (`rg continuationSuppressed` lists every producer; the retired reasons were set only in the removed cap and budget code)
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs and tests. (consumers of `--budget` and of resume listed; only the two docs and the plugin doc change)
- [x] CHK-FIX-004 [P0] No path, parser or redaction change is in this phase, so no adversarial table applies. (no path, parser or redaction change)
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. (axes: record state (paused, usage-limited, budget-limited, legacy-suppressed, unknown-suppressed, active) by autonomy (off, on); 6 states covered by tests, autonomy off and on by the harness)
- [x] CHK-FIX-006 [P1] Hostile env and global-state variant executed when tests or code read process-wide state. (the new tests set OPENCODE_GOAL_AUTONOMY and restore it; the harness runs with it unset and set)
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or an explicit diff range, not a moving branch-relative range. (Nothing is committed yet; pin it when the phase is committed.)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets, and no credential or key read, logged or written (no key read, logged or written; the live run printed only a provider error)
- [x] CHK-031 [P0] Resume validates the record state before it clears anything (resume checks status, the suppressed flag and the reason before it clears anything)
- [x] CHK-032 [P1] Auth and authz not applicable: the state files are local and keep their `0o700` directory mode (state directory mode untouched)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks synchronized (spec, plan, tasks and summary agree on an In Progress phase)
- [x] CHK-041 [P1] Code comments carry the reason, with no artifact ids (comments carry the reason only)
- [x] CHK-042 [P2] README updated where the behavior changes (plugin and command docs updated)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files kept in the session scratchpad or scratch/ (temp files went to the session scratchpad)
- [x] CHK-051 [P1] scratch/ holds only evidence this packet cites (scratch/ holds the skip record, the harness run and the gate totals only)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 11/12 |
| P1 Items | 13 | 12/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-24
<!-- /ANCHOR:summary -->

---
