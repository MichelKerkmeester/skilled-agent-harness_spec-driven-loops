---
title: "Tasks: Phase 8: push Skilled main with every overlay fix and re-pin Barter onto it"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "push and repin tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 8: push Skilled main with every overlay fix and re-pin Barter onto it

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

- `S` is the Skilled checkout. `AS` is `S/barter/ai-speckit`. `C` is the id on this phase's Target Skilled commit line. `T001`-`T006` run in a Skilled session, `T007`-`T011` in an ai-speckit session.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the baseline gates on local main before the merge (`S`). Verify: engine 262/262, guard 20/20, contract 9/9, each exit 0, and `route-validate` exits 0 with 32 routes.
- [x] T002 Fetch origin and predict the merge (`S`). Verify: `git merge-tree --write-tree --name-only main origin/main` reports no conflict, and no path it changes is dirty in the working tree. Against `origin/main` `bbbec2ed55e` it exits 1 with `CONFLICT (content)` in `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` and the three retrieval fixtures `corpus-manifest.json`, `generation-diagnostics.json` and `phrase-variants.json` under `runtime/cli/retrieval/fixtures/`. No dirty path overlaps. Resolved 2026-11-20 by the operator's decision: take origin's copies of the four generated files, then rebuild them with `generate-trigger-index.mjs`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Merge `origin/main` into main with a merge commit (`S`). Verify: `git merge-base --is-ancestor origin/main main` exits 0 and `git log -1 --format=%P main` prints two parents. Merge `8999aff6aac` and rebuild `83847bdb5fc`. The first push lost a race to two new origin commits, so a second merge `d6961a4b506` (parents `83847bdb5fc`, `698771ea279`) and rebuild `b5a630c6efa` followed, with the same four files the only conflicts.
- [x] T004 Run the gates on the merged main (`S`). Verify: the engine suite, the guard suite and the contract test print `fail 0` with exit 0, `route-validate` exits 0, and `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED`. On `b5a630c6efa`: engine 262/262, guard 20/20, contract 9/9, each exit 0; `route-validate` exit 0, 32 routes; 9 of 9 `RESULT: PASSED`, exit 0; trigger index `--check` exit 0.
- [x] T005 Push main without force or `--no-verify` (`S`). Verify: `git rev-parse origin/main` equals `git rev-parse main`. Pushed `698771ea279..b5a630c6efa`, and both refs read `b5a630c6efa`.
- [x] T006 Write the pushed id on the Target Skilled commit line and commit it docs-only (`spec.md`). Verify: `rg -n 'Target Skilled commit: [0-9a-f]{40}' spec.md` prints one line, and `git merge-base --is-ancestor C origin/main` exits 0. `C` is `b5a630c6efaf30d36bb18e2bae875b03ab8f4600`.
- [ ] T007 Re-pin ai-speckit onto `C` with `/doctor:overlay repin`, staged first (`AS/overlays/overlay-manifest.json`). Verify: `node -p "require('./overlays/overlay-manifest.json').pin.commit"` in `AS` prints `C`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Run the engine gates after the re-pin (`AS/skilled`). Verify: `overlay-engine.cjs status --audit` prints `RESULT: PASSED` with `offLayout=[]`, and `pre-commit` prints `allow` with exit 0.
- [ ] T009 Run Barter's checks and hook tests (`AS/overlays/checks`, `pre-commit.test.cjs`). Verify: both checks print `RESULT: PASSED`, and `pre-commit.test.cjs` passes 6 of 6.
- [ ] T010 Run Barter's test runner (`AS/tests/run-all.sh`). Verify: it exits 0 with 8 `PASS` lines, and the overlay test files fail only the 11 baseline cases.
- [ ] T011 Confirm phase 007's fix survives the re-pin (`AS`). Verify: `git merge-base --is-ancestor 5dd004f3faa HEAD` exits 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `origin/main` in Skilled contains `C`, and ai-speckit pins `C` with every Barter gate green
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor**: `../007-barter-review-fixes/`
<!-- /ANCHOR:cross-refs -->

---
