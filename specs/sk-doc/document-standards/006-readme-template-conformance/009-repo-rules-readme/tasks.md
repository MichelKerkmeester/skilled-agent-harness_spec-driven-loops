---
title: "Tasks: Phase 9: repo-rules-readme"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "repo rules readme tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 9: repo-rules-readme

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

`S` is `.skilled/skills/sk-doc/sk-create-repo-rule/scripts/`. `T` is `.skilled/skills/sk-doc/scripts/tests/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Probe the checker with a stub README in the rules folder. Verify: `node $S/check-repo-rules.cjs` prints `FAILED`. Evidence: `RESULT: FAILED (7/11 checks)`, with count parity, row coverage, frontmatter keys and fires-when sections failing. The stub was removed.
- [x] T002 Confirm the document validator types the README as a README. Verify: `validate_document.py` prints `Document type: readme`. Evidence: it lowercases the path before its `readme.md` match.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the two README tests and run them before the fix (`$T/test_check_repo_rules.py`, `$T/test_build_rule_cards.py`). Verify: both fail. Evidence: `2 failed`, with `files=2` from the checker and `README.md: no "## Fires when" section` from the builder.
- [x] T004 Skip `readme.md` in `loadContext` and `listRules` (`$S/check-repo-rules.cjs`, `$S/build-rule-cards.cjs`). Verify: `node --check` on both exits 0 and the five repo-rules test files pass. Evidence: `36 passed`.
- [x] T005 Write the folder README (`.skilled/repo-rules/README.md`). Verify: `validate_document.py` prints `VALID`. Evidence: `✅ VALID`, `Document type: readme`, `Total issues: 0`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Gate the README. Verify: 0 hard voice blockers and both README checkers pass. Evidence: `hard blockers: 0`, ceiling 100/100, `references=37 unresolved=0`, `claims=0 failures=0`.
- [x] T007 Run the real checker and the card check. Verify: the checker passes 11/11 and the card check matches its baseline. Evidence: `files=10 triggerRows=10 indexRows=10`, `RESULT: PASSED (11/11 checks)`. The card check prints `FAILED (10 card problems)`, the same 10 missing cards the pre-change builder reports, because the repository has no cards folder.
- [x] T008 Render the README through GitHub. Verify: one alert, no fold. Evidence: 1 `markdown-alert-warning`, 0 `<details>`, and the files table holds 10 rule rows, under the 15-row fold threshold.
- [x] T009 Run the wider gates. Verify: each exits 0. Evidence: doctor `agents-md-check` 44 pass, `agents-md-embed` 43, `overlay-engine-repin` 30, `doctor-agents-md-contract` 39, `typo-flags` 17. `all sk-doc script tests passed`, `PARITY PASS`, `0 broken markdown links`.
- [x] T010 Validate the phase. Verify: `validate.sh --strict` prints `RESULT: PASSED`. Evidence: `RESULT: PASSED` on the program recursively.
- [x] T011 Commit, merge origin/main and push under sk-git. Verify: the phase commit is an ancestor of origin/main. Evidence: commit `c958cf99914`, pushed inside merge `09067be7079`. The merge was built with `git merge-tree` because another session had files staged in the checkout, which blocks `git merge`.
- [x] T012 Skip the README in the compliance measurer too (`$S/measure-rule-compliance.py`, `$T/test_measure_rule_compliance.py`). Verify: the new test fails first, then the five repo-rules test files pass. Evidence: a session that read the README was credited with a rule named `README.md`, because a file with no rule section matches on its title alone. `1 failed` before the skip, `37 passed` after. Found after the first push, by checking the claim that the measurer built no marker for the README.
- [ ] T013 Push the measurer fix. Verify: the fix commit is an ancestor of origin/main.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the GitHub render shows the alert and no fold
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
