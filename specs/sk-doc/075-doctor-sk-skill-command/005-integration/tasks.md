---
title: "Tasks: Phase 5: integration"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "integration tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 5: integration

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`DOC` is `.skilled/commands/doctor`. `REACH` is `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Capture the reach fleet output before any change (`scratch/reach-before.txt`). Verify: the file is non-empty.
- [ ] T002 Build a temp-repo harness that sets `HERMES_SKILLS_OUTPUT_DIR` and `SKILL_GRAPH_FRESHNESS_ROOT` (`DOC/scripts/tests/sk-skill-convert.test.cjs`). Verify: the harness removes its temp dir after each case.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 I1 scan with `skill_graph_scan --trusted` and the printed rebuild fallback (`DOC/scripts/sk-skill-convert.cjs`). Verify: no `advisor_rebuild` call appears in a traced run.
- [ ] T004 I2 compiled graph export, named as a tracked-file write (`DOC/scripts/sk-skill-convert.cjs`). Verify: the plan line names `skill-graph.json`.
- [ ] T005 I3 warm-only probes on three phrases plus the budget row, and `--skill <id>` on the reach script (`REACH`). Verify: `node REACH --skill <fixture>` reports one row.
- [ ] T006 [P] I4 regression rows: append for a framework skill, print rows and `--dataset` command for an adopter skill (`DOC/scripts/sk-skill-convert.cjs`). Verify: the adopter case leaves `skill-advisor-regression-cases.jsonl` unchanged.
- [ ] T007 [P] I5 Hermes sync then `--check`, n/a when `.hermes/` is absent (`DOC/scripts/sk-skill-convert.cjs`). Verify: the absent case creates no `.hermes/`.
- [ ] T011 I4 skill-local cases: write an adopter skill's rows to `<skill>/benchmark/advisor-cases.jsonl`, and if `package_skill.py` rejects the file, teach it to accept `.jsonl` under `benchmark/` with a test (`DOC/scripts/sk-skill-convert.cjs`, `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py`). Verify: `package_skill.py <fixture> --check --strict` prints `Result: PASS` and `skill_advisor_regression.py --dataset <fixture>/benchmark/advisor-cases.jsonl` exits 0.
- [ ] T008 I6 `changelog/v<version>.md` and the relative link (`DOC/scripts/sk-skill-convert.cjs`). Verify: `readlink .skilled/changelog/<name>` prints `../skills/<name>/changelog`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Run the temp-repo cases (`DOC/scripts/tests/sk-skill-convert.test.cjs`). Verify: Hermes `--check` PASS and `skill-graph-freshness.cjs --strict` exits 0.
- [ ] T010 Capture the fleet output after the change and compare (`scratch/reach-after.txt`). Verify: `cmp scratch/reach-before.txt scratch/reach-after.txt` prints nothing.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] Temp-repo checks pass and reach fleet output is byte-identical
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Design**: See `../scratch/design.md` section 3 rows I1 to I6
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

A blocked task is marked `[B]` with the blocking cause on the same line.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Reach fleet output captured before the change
- [ ] CHK-003 [P1] Temp-repo harness in place
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `node --check` exits 0 on every changed script
- [ ] CHK-011 [P0] Reach default path unchanged
- [ ] CHK-012 [P1] Every integration step records created and overwritten paths
- [ ] CHK-013 [P1] No integration step runs after a failed V8
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Temp-repo Hermes and freshness checks pass
- [ ] CHK-022 [P1] Hermes-absent case tested
- [ ] CHK-023 [P1] Adopter regression case tested
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A: this phase fixes no reported finding.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Tests write only inside their temp repo
- [ ] CHK-032 [P1] No `local-` prefixed name reaches the regression fixture
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] `--skill` usage line added to the reach script's help text
- [ ] CHK-042 [P2] README entries deferred to phase 007
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Reach captures live under scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 10 | 0/10 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Pending
<!-- /ANCHOR:summary -->

---
