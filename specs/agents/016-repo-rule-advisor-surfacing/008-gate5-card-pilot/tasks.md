---
title: "Tasks: Gate 5 card pilot"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "gate 5 card pilot tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Gate 5 card pilot

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

- [x] T001 Confirm `check-repo-rules.cjs` ignores a `cards/` subdirectory (count parity reads 13 files with 13 cards present)
- [x] T002 Check the arm C size condition against the post-003 `AGENTS.md` (26,778 B plus 7,677 B is 34,455 B, arm C dropped)
- [x] T003 Compute run counts and sample size, then commit `preregistration.md` (`3990bc9fa5` at 2026-10-04 23:58:14, earliest scored transcript 23:58:29)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the generator and generate the 13 cards (`build-rule-cards.cjs`, `edba53daeb`)
- [x] T005 Add check 11 (`check-repo-rules.cjs`, `edba53daeb`)
- [x] T006 Write pytest for determinism and drift (`test_build_rule_cards.py`, 4 passed)
- [x] T007 Prepare the arm `cards` router variant (`experiment/arms.json`)
- [x] T008 Run both arms in isolated environments, interleaved in a seeded order (318 scored runs, 162 cards and 156 full, 0 unscorable: Luna 235, SWE-2 Max 23, DeepSeek through OpenCode Go 30, DeepSeek through Cline 30, under `results/deviations.md` 1 to 4)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Analyze per arm and apply the decision rule (`results/decision.md`: rule 1, adopt cards. Primary -4.0 points, -15.5 to +7.6. Gate 5 miss +2.2, -3.3 to +7.9. Bytes 42,064 against 59,620. Committed in `6ffe5e5514`)
- [ ] T010 If arm `cards` wins, make checks 2 and 10 accept card links, then adopt it after the 006 window and the 007 decision. Otherwise remove the generator, check 11 and its tests (checker half done 2026-10-05: `ruleLinkDir` credits a rule through its card, and the cards router passes 11/11 with check 10 counting 61 bullets. The router change waits on the 006 and 007 live windows under parent D2)
- [ ] T011 Run the checker and the phase 003 guard on the final state (open: runs after the T010 adoption)
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

- [ ] CHK-010 [P0] Changed scripts pass their existing lint or syntax checks
- [ ] CHK-011 [P1] New code follows the surrounding file's patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Generator deterministic and check 11 catches drift
- [x] CHK-021 [P0] Pre-registration committed before the first scored run (`3990bc9fa5` at 23:58:14, first transcript 23:58:29)
- [ ] CHK-022 [P0] Each arm at sample size (open: deviation 3 cut the schedule, so the arms hold 162 and 156 runs against 180 per arm per executor)
- [x] CHK-023 [P1] Arm C size condition recorded
- [ ] CHK-024 [P1] No unused card artifacts remain
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
| P0 Items | 8 | 4/8 |
| P1 Items | 7 | 1/7 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-10-05, partial. Adoption items stay open
<!-- /ANCHOR:summary -->

---
