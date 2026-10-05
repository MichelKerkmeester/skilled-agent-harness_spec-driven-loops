---
title: "Tasks: Rule delivery debugging"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "rule delivery debugging tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Rule delivery debugging

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

- [x] T001 Collect natural miss rates from the control arms of 007 (`current`) and 008 (`full`), which match the live rules (`results/`)
- [x] T002 Decide whether arms vary the global instructions through a project-level `AGENTS.md` or a copied global, and record why (`plan.md`)
- [x] T003 [P] Trace how each executor receives its global instructions in an isolated environment: Devin's 16,384-byte cut and the `.codex/AGENTS.md` target of `~/.codex/AGENTS.md` (`results/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Measure natural Gate 5 and reply-rule miss rates per executor with the harness, on prompts that never mention rules (`results/`)
- [x] T005 Class every missed run as not delivered, truncated, outranked or seen and skipped (`results/`)
- [x] T006 Draft candidate arms from the causes, adding a hook arm only past the D3 threshold (`experiment/`)
- [ ] T007 Commit `preregistration.md` with arms, metric, sample size and decision rule before the first scored arm run
- [ ] T008 Run the arms in a seeded interleaved order
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Score the arms and apply the decision rule (`results/`)
- [ ] T010 Confirm no prompt set and no adopted diff contains rule-reading instructions
- [ ] T011 Adopt the winner live after the 006 and 007 windows are measured, then run `check-rule-copies.js` and `check-repo-rules.cjs`
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Predecessor handoff criteria met
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Any changed script passes its existing tests
- [ ] CHK-011 [P1] New code follows the surrounding file's patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] No prompt set or adopted diff adds rule-reading instructions
- [ ] CHK-021 [P0] Every rate carries its denominator and Wilson interval
- [ ] CHK-022 [P0] Pre-registration committed before the first scored arm run
- [ ] CHK-023 [P0] Every missed run classed by cause
- [ ] CHK-024 [P1] Hook arm run only past the stated threshold
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Consumer inventory in `plan.md` affected surfaces is complete
- [ ] CHK-FIX-002 [P1] Evidence is pinned to a commit SHA, not a moving branch range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No transcript text, secret or credential in any committed artifact
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md, plan.md and tasks.md synchronized
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temporary files in scratch/ only, cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 2/9 |
| P1 Items | 6 | 0/6 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Pending
<!-- /ANCHOR:summary -->

---
