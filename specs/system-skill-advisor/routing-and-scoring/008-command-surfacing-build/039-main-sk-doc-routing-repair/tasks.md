---
title: "Tasks: Phase 39: main-sk-doc-routing-repair"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "main sk doc routing repair tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 39: main-sk-doc-routing-repair

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
| `[C]` | Coordinator task: a gate, a rescore or the close-out |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Every command runs from the repository root. Set the names once with `export ADV=.skilled/skills/system-skill-advisor/runtime RAD=$ADV/scripts/routing-accuracy PK=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build SP=$PK/039-main-sk-doc-routing-repair/scratch DOC=.skilled/skills/sk-doc`. `FLOOR`, `EVAL` and `PLOG` are as phase 036's `tasks.md` defines them. `SEVEN` is the five failing test files: `tests/scorer/doctor-bridge-isolation.vitest.ts tests/doctor-routing-slice.vitest.ts tests/parity/local-native-divergence-ratchet.vitest.ts tests/parity/holdout-independent.vitest.ts tests/compat/python-compat.vitest.ts`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [C] Record the failing tests and the before gates (`$SP/before.txt`). Verify: `SEVEN` shows 7 failed, and `FLOOR` and `EVAL` print 24/44 0/35 2/44 and [160,49,21,5]. Evidence:
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Narrow the named hook README phrases (`$DOC/ROUTER.md`). Verify: the four isolation cases and slice rows doctor-control-11, 12 and 14 pass. Evidence:
- [ ] T003 Narrow the runtime folder and hook mirror README phrases (`$DOC/ROUTER.md`, `$DOC/sk-create-readme/ROUTER.md`). Verify: slice row doctor-a-10 passes. Evidence:
- [ ] T004 Find which of main's new intents moved the holdout row and `rr-iter3-069`, reading only row ids and expected skills, and narrow it (`$DOC/ROUTER.md`). Verify: the holdout prints 49 of 63 or more and the ratchet passes. Evidence:
- [ ] T005 Regenerate the intent signals and recompile the graph (`$DOC/graph-metadata.json`, `$ADV/scripts/skill-graph.json`). After T004. Verify: `generate-router-intent-signals.cjs --check` and `skill-graph-freshness.cjs --strict` exit 0. Evidence:
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 [C] Probe README requests through the advisor CLI (`$SP/readme-probes.txt`). After T005. Verify: the session-handover hook, git-preflight hook and runtime folder README requests each top sk-doc. Evidence:
- [ ] T007 [C] Rebuild and rerun the gates both ways (`$SP/after.txt`). After T006. Verify: 0 failed with the flag unset and set, `FLOOR` unchanged, `EVAL` [160,49,21,5] or better, stored sets unchanged. Evidence:
- [ ] T008 [C] Log the fix and the criterion 2 recheck (`../goal.md`). After T007. Verify: `packet_budget=ok`. Evidence:
- [ ] T009 [C] Close the phase (`implementation-summary.md`). After T008. Verify: `validate.sh $PK/039-main-sk-doc-routing-repair --strict` prints `RESULT: PASSED`. Evidence:
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] The goal log records the fix and the criterion 2 recheck
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

- [ ] CHK-001 [P0] The seven failures reproduced on the merged HEAD and clean origin/main (T001). Evidence:
- [ ] CHK-002 [P1] The cause of each failure attributed to one of main's commits. Evidence:
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The change touches the router keyword lists and the two generated files only (`git diff --stat`). Evidence:
- [ ] CHK-011 [P1] No test, baseline or ledger file changed. Evidence:
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met. Evidence:
- [ ] CHK-021 [P0] Full suite 0 failed with the flag unset and set (`after.txt`). Evidence:
- [ ] CHK-022 [P1] README requests still reach sk-doc (`readme-probes.txt`). Evidence:
- [ ] CHK-023 [P1] `FLOOR` unchanged and `EVAL` not lower. Evidence:
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] Each fix names its class. Evidence:
- [ ] CHK-FIX-002 [P0] Every README intent main added was checked for the same class. Evidence:
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No holdout or command prompt text read or printed; rows named by id and expected skill only. Evidence:
- [ ] CHK-031 [P0] `.skilled/hooks/hook-flags.env` neither read nor created. Evidence:
- [ ] CHK-032 [P1] N/A: no credential or auth path is touched. Evidence:
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, tasks and the goal rows name the same narrowed intents. Evidence:
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Evidence lives in this phase's `scratch/` only. Evidence:
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 0/7 |
| P1 Items | 7 | 0/7 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-11-16
<!-- /ANCHOR:summary -->

---
