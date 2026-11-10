---
title: "Tasks: Phase 5: persisted-hops-validation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "persisted hops validation tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: persisted-hops-validation

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

- [x] T001 Confirm producers write hops as a number: `preparePending` (`relaunch-core.cjs:734-766`, `hops = 0` at :741, record field at :756) and the CLI prepare path (`bin/session-relaunch.cjs:496-532`); stop and report if either writes a string [EVIDENCE: relaunch-core.cjs:741 defaults `hops = 0`, :756 writes it; bin/session-relaunch.cjs:497-498 parses SKILLED_LOOP_HOPS with Number() and rejects non-integers, :532 passes the number]
- [x] T002 Run both test commands from plan.md section 5 and save the baseline under `scratch/` [EVIDENCE: scratch/baseline-node.txt 868 pass 0 fail exit 0; scratch/baseline-vitest.txt 54/54 exit 0]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the failing-first table test "shouldRelaunch declines malformed persisted hops" for -1, 1.5, null, "3", NaN, Infinity and `undefined` (the last three green before), plus a hops 0 relaunch case (`.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs`) [EVIDENCE: test added after "shouldRelaunch declines hop ten at the default cap", with "shouldRelaunch accepts hop zero below the default cap"]
- [x] T004 Run it and confirm red for -1, 1.5, null and "3" [EVIDENCE: scratch/red-before.txt exit 1, negative/fractional/null/numeric string fail, NaN/Infinity/missing pass]
- [x] T005 Replace the `Number(record.hops)` coercion with the number, integer and non-negative check in `shouldRelaunch` (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`) [EVIDENCE: relaunch-core.cjs shouldRelaunch now reads `record.hops` uncoerced with typeof, Number.isInteger and >= 0 checks]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Rerun both test commands and compare with the baseline [EVIDENCE: scratch/after-node.txt 877 pass 0 fail exit 0 (868 + 9 new); vitest 55 pass 4 fail of 59, the 4 are agent_settled Pi tests another phase is adding]
- [x] T007 Confirm the hops 10 test is unedited and still declines [EVIDENCE: "shouldRelaunch declines hop ten at the default cap" body unchanged, passes in scratch/green-after.txt]
- [x] T008 No live proof is needed for this phase [EVIDENCE: pure function covered by unit tests; no live proof required by plan.md section 5]
- [x] T009 Fill `implementation-summary.md` with producer file:line evidence and mark `acceptance-criteria.md` rows [EVIDENCE: implementation-summary.md and acceptance-criteria.md filled]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every acceptance criterion is Met
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

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: spec.md REQ-001..005]
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md section 3]
- [x] CHK-003 [P1] Dependencies identified and available [EVIDENCE: producers read, T001]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks [EVIDENCE: node --check exit 0 on both files; no linter configured for this tree]
- [x] CHK-011 [P0] No console errors or warnings [EVIDENCE: suite output shows no warnings from the changed code]
- [x] CHK-012 [P1] Error handling implemented [EVIDENCE: malformed hops return the existing hop-cap decline]
- [x] CHK-013 [P1] Code follows project patterns [EVIDENCE: same decline shape and comment style as the surrounding checks]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met [EVIDENCE: acceptance-criteria.md all Met]
- [x] CHK-021 [P0] Manual testing complete [EVIDENCE: no manual surface; plan.md section 5 says none needed]
- [x] CHK-022 [P1] Edge cases tested [EVIDENCE: 0, 9, 10, -1, 1.5, null, "3", NaN, Infinity, undefined]
- [x] CHK-023 [P1] Error scenarios validated [EVIDENCE: malformed table test]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. [EVIDENCE: class-of-bug: coercion at the read side]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. [EVIDENCE: rg hops: preparePending and CLI prepare write numbers; killer.cjs:693 coerces but only decides whether to signal, wrapper still declines]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. [EVIDENCE: rg shouldRelaunch: bin/session-relaunch.cjs:593 reads reason (unchanged hop-cap), nudge.cjs:466 reads only stale, which runs before the hop check]
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. [EVIDENCE: adversarial table: negative, fractional, null, numeric string, NaN, Infinity, missing]
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. [EVIDENCE: axes hop value x limit 10, 10 rows: 7 malformed + 0, 9, 10]
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. [EVIDENCE: function reads no env or global state; limit passed explicitly]
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. [OPEN: the orchestrator commits; pin the SHA then]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets [EVIDENCE: none added]
- [x] CHK-031 [P0] Input validation implemented [EVIDENCE: strict type and integer check on the persisted count]
- [x] CHK-032 [P1] Auth/authz working correctly [EVIDENCE: N/A, no auth surface]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized [EVIDENCE: tasks and summary match spec]
- [x] CHK-041 [P1] Code comments adequate [EVIDENCE: one durable-why comment, no ids]
- [x] CHK-042 [P2] README updated (if applicable) [EVIDENCE: N/A, no README change]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only [EVIDENCE: baseline and run output under scratch/]
- [ ] CHK-051 [P1] scratch/ cleaned before completion [OPEN: scratch/ holds the baseline and red-before evidence the plan asks to keep]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 11/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-25
<!-- /ANCHOR:summary -->

---



