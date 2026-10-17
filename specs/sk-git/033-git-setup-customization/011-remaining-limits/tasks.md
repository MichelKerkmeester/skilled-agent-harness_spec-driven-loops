---
title: "Tasks: Phase 11: remaining-limits"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "remaining limits tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 11: remaining-limits

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Verify each item against the code and record baselines. All four hold. Item 2 holds with a correction: 28 of the non-spec warnings are fixture stand-ins and six are real files. Baselines are in `plan.md` section 2.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Item 1: resolve `export default <identifier>;` to its top-level declaration, with one test per declaration form and a negative test (`git-setup-check.cjs`, `tests/git-setup-check.test.cjs`). FIXED by Luna on the first dispatch. New `findTopLevelBindingDeclaration()` finds the identifier's declaration at depth 0 in the scanned code, and `adapterBodyRegistersHandler()` now holds the body check that the inline and resolved paths share. Four form tests and one negative test with five cases. `git-setup-check.test.cjs` 59/59 to 64/64 outside the sandbox. An independent 29-case probe passes on the new code and fails 8 identifier cases on the old one. The real adapters still read `registered`.
- [x] T003 Item 2: skip `scratch` and `z_archive` below `specs/`, with a test (`verify_alignment_drift.py`, `test_verify_alignment_drift.py`). FIXED by Luna in two dispatches. The second put back the docstring's reason for skipping `evidence`, which the first had dropped. The test runs the CLI with `--fail-on-warn`, because a `scratch` path outside `specs/` is softened to WARN and exits 0 without it. Verifier tests 28 to 29 OK. Drift warnings 278 to 42.
- [x] T004 Item 2: add the missing line to the five real files the guard flags (`check-node.cjs`, `render-screenshots.cjs`, `generate-router-intent-signals.cjs`, `validate-doc-model-refs.js`, `test_template_version_seed.py`). FIXED by Luna on the first dispatch. Luna read the three CommonJS files and found no sloppy-mode code. Each script still behaves as before: `check-node.cjs` exit 0, `generate-router-intent-signals.cjs --check` `RESULT: PASSED`, `render-screenshots.cjs` usage and exit 2, template seed 3 passed. Drift warnings 42 to 37.
- [x] T005 Item 2: give the 14 sk-doc fixture stand-ins a shebang and docstring (`sk-doc/scripts/tests/code-folder/**/*.py`). FIXED by Luna on the first dispatch. All 14 files equal the old content with the two lines in front, checked byte for byte against the backups. code-folder `failures=0`, verdict parity PASS, manifest reproducible. Drift warnings 37 to 9.
- [x] T006 Item 2: untrack the ignored sk-vision bundle and keep it on disk (`sk-vision/hooks/opencode/sk-vision.js`). Done by the orchestrator, since it is an index change, not an edit: `git rm --cached`. The file's SHA-256 is unchanged on disk and `git check-ignore` now names `sk-vision/.gitignore:4`. Drift warnings 9 to 8. The deletion is staged for the coordinator's commit.
- [x] T007 Item 3: point the ten advisor scenario paths at real paths (`system-skill-advisor/manual-testing-playbook/**`). FIXED by Luna on the first dispatch, 11 lines in 9 files. Eight link texts gain their `feature-catalog/` prefix, both `lanes/derived.ts` mentions become `runtime/lib/scorer/lanes/derived.ts`, and the ignored runtime output `runtime/data/shadow-deltas.jsonl` is reworded to name the file and its folder. Link targets are unchanged. Advisor package warnings 11 to 1.
- [x] T008 Item 3: add the result-persistence marker to the advisor playbook index (`manual-testing-playbook.md`). FIXED by Luna on the first dispatch with the template's block (`manual-testing-playbook-template.md:172-175`), 5 lines after the package artifacts list. Advisor package `violations=0 warnings=0`, `hvr_scan.py` 0 hard blockers.
- [x] T009 Item 4: raise the lease stress budget to 2,000 ms and keep every correctness assertion (`single-writer-lease-stress.vitest.ts`). FIXED by Luna on the first dispatch: the budget line and one comment line, nothing else. Five local runs pass 3/3 each. The CI failure does not reproduce locally, where the old 250 ms budget also passed three of three, so the evidence for the cause is the two CI logs.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Mutation check for items 1 and 2: with the old function or rule restored, each new test fails. Item 1 done: the old function fails the four form tests (2 passed, 4 failed in the filtered run), and a mutation that accepts any resolved identifier fails the negative test. Item 2 done: with the old rule restored, the new test fails because `specs/demo/001-x/scratch/run.sh` is discovered.
- [x] T011 Run every gate from the final state and record the result lines in `implementation-summary.md`
- [x] T012 Update `implementation-summary.md` and repair derived metadata
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
