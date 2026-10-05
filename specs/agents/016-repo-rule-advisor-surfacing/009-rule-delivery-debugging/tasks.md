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

- [x] T004 Measure natural Gate 5 and reply-rule miss rates per executor with the harness, on prompts that never mention rules (`results/`)
- [x] T005 Class every missed run as not delivered, truncated, outranked or seen and skipped (`results/`)
- [x] T006 Draft candidate arms from the causes, adding a hook arm only past the D3 threshold (`experiment/`)
- [x] T007 Commit `preregistration.md` with arms, metric, sample size and decision rule before the first scored arm run
- [x] T008 Run the arms in a seeded interleaved order
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Score the arms and apply the decision rule (`results/`)
- [x] T010 Confirm no prompt set and no adopted diff contains rule-reading instructions (the only rule-like text in `prompts.json` and `prompts-write.json` is the Gate 3 pre-answer; the adopted diff edits `AGENTS.md`, not a prompt)
- [x] T011 Adopt the winner live after the 006 and 007 windows are measured, then run `check-rule-copies.js` and `check-repo-rules.cjs` (Gate 6 adopted 2026-10-05 without the windows, `decision-record.md` ADR-001; two sentences cut to keep Devin's prefix, `results/adoption-ledger.md`; `check-rule-copies.js` OK with 21 anchors, `check-repo-rules.cjs` RESULT: PASSED 11/11)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
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
- [x] CHK-003 [P1] Predecessor handoff criteria met (008 decided by its pre-registered rule, `008-gate5-card-pilot/results/decision.md`)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Any changed script passes its existing tests (`test_rule_experiment.py` and siblings 26 passed; `check-rule-copies.test.sh` all cases passed)
- [x] CHK-011 [P1] New code follows the surrounding file's patterns (the Gate 6 anchor uses the existing `section` anchor shape)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] No prompt set or adopted diff adds rule-reading instructions (T010; the adopted diff edits `AGENTS.md` only)
- [x] CHK-021 [P0] Every rate carries its denominator and Wilson interval (`results/final-scores.txt`, `final-scores-2.txt`, `control-arm-miss-rates.txt`)
- [x] CHK-022 [P0] Pre-registration committed before the first scored arm run (5750410dfd at 09:41:29, first transcript created 09:41:53; d321efd706 at 11:01:05, first replication transcript 11:03:44)
- [x] CHK-023 [P0] Every missed run classed by cause (`results/control-arm-miss-rates.txt`: 5 Gate 5 and 197 reply-rule misses, classes sum to both)
- [x] CHK-024 [P1] Hook arm run only past the stated threshold (no hook arm ran: Gate 6 misses 21.1%, under 30%)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Consumer inventory in `plan.md` affected surfaces is complete (`check-rule-copies.js` row added at adoption)
- [x] CHK-FIX-002 [P1] Evidence is pinned to a commit SHA, not a moving branch range (pre-registrations 5750410dfd and d321efd706, decisions d321efd706 and d716bddd43)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No transcript text, secret or credential in any committed artifact (run records hold paths, exit codes and ids; scored rows hold booleans and ids)
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
