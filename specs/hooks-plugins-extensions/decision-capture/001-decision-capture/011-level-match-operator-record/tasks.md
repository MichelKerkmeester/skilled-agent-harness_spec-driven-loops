---
title: "Tasks: Phase 11: level-match-operator-record"
description: "Baseline the suites, reproduce the false warning, add the shared predicate, wire both callers and rerun every gate."
trigger_phrases:
  - "level match operator record tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 11: level-match-operator-record

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`EXT` is `.skilled/skills/system-spec-kit/runtime/cli/tests/test-validation-extended.sh`. `UPG` is `.skilled/skills/system-spec-kit/runtime/cli/tests/test-upgrade-level.sh`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture the suite baselines. Verify: `bash EXT` prints 84 passed, 0 failed, 0 skipped and `bash UPG` prints 14 passed, 0 failed.
- [x] T002 Capture the live-path baseline. Verify: recursive strict validation of session-handover 001 prints 14 `RESULT: PASSED` and the LEVEL_MATCH warning on 007, 009, 011 and 012.
- [x] T003 Add fixtures `081` to `083` and three LEVEL_MATCH rows (`test-fixtures/`, `EXT`). Verify: `bash EXT -c LEVEL_MATCH` on the old rule fails only the writer-only row.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `decision_record_is_writer_only` (`lib/shell-common.sh`). Verify: `bash EXT -c LEVEL_MATCH` prints 6 passed.
- [x] T005 Source the helper and skip a writer-only record (`rules/check-level-match.sh`). Verify: the live run prints no `decision-record.md present` line.
- [x] T006 Infer Level 3 only from a record that is not writer-only (`spec/upgrade-level.sh`). Verify: `bash UPG` prints `Writer-only decision record infers Level 1`, and the same case fails on the old code.
- [x] T007 Update the LEVEL_MATCH reference and the fixture README (`references/validation/validation-rules.md`, `test-fixtures/README.md`). Verify: `rg -n 'operator-answers-verbatim' references/validation/validation-rules.md` prints two lines.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Rerun the whole extended suite. Verify: `bash EXT` prints 87 passed, 0 failed.
- [x] T009 Rerun the upgrade-level, writer and validation-system suites. Verify: `bash UPG` prints 16 passed. The writer and upgrade-level vitest files print 25 passed. `test-validation-system.cjs` prints `ALL VALIDATION SYSTEM TESTS PASSED`, and `test-validation.sh` prints 31 total and 0 failed.
- [x] T010 Rerun the live path. Verify: session-handover 001 prints 14 `RESULT: PASSED` and 0 LEVEL_MATCH warnings.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the live recursive strict run shows no false warning
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
