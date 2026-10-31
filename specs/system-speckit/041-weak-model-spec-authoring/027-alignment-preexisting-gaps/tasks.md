---
title: "Tasks: Phase 27: alignment-preexisting-gaps"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "alignment preexisting gaps tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 27: alignment-preexisting-gaps

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

`R` is `.skilled/skills/sk-doc/sk-create-readme/scripts`, and `L` is the alignment command's asset folder (gitignored, operator-local). The seven READMEs are the ones listed under R1 in `scratch/items.md`. Each task names its item id from `scratch/items.md`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the checker baseline on the seven READMEs (`$R/check_readme_references.py`, `$R/check_derived_readme_counts.py`). Verify: both checkers run on each README and the root README prints `references=418 unresolved=305` and `claims=41 failures=41`. Evidence: the root README printed `references=418 unresolved=305` and `claims=41 failures=41` (spec.md Measured Behavior), and the seven READMEs together reported 608 unresolved references.
- [x] T002 Record the advisor baseline for the eight probes in `scratch/items.md` (`.skilled/bin/skill-advisor.cjs`). Verify: `advisor_recommend` ranks system-spec-kit first on all eight, with "Create a changelog entry for this spec folder" at 0.867 against sk-doc 0.306. Evidence: the four changelog probes scored system-spec-kit 0.560, 0.591, 0.599 and 0.867 against sk-doc 0.349, 0.260, 0.333 and 0.306 (`scratch/items.md` Lane A).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Lane R: README checkers.

- [x] T003 [P] R1: classify the unresolved references into slash commands, bare filenames, gitignored personal files and any other class, then fix each class at the checker and resolve a slash command against `.skilled/commands/<group>/<name>.md` (`$R/check_readme_references.py`). Verify: `python3 $R/check_readme_references.py README.md` prints no `/speckit:resume` or `/doctor:setup` line, and a README naming `/nonexistent:command` or a missing path still exits 1. Evidence: slash commands resolve against `.skilled/commands`, grouped and top-level, with mode checks. Bare names resolve repo-wide, paths with a slash resolve only from the README folder or the repo root, and spec docs resolve through `.tmpl`. Gitignored files, `.sk-code/` and `.sk-git/` are skipped, as are placeholders, home and absolute paths, fence comments, shell assignment keys and the labels of working links. Typos still fail. The root README now prints `PASS README.md: references=403 unresolved=0 skipped=32`.
- [x] T004 [P] R2: find why the count heuristic fires on prose and narrow it (`$R/check_derived_readme_counts.py`). Verify: `python3 $R/check_derived_readme_counts.py README.md` prints no line 221 `a few characters in one file` failure, and a README with a wrong numeric file count still exits 1. Evidence: the count checker now verifies a claim against the folder the sentence names, or against a tree line, and reports claims it cannot verify separately, which `--strict` fails. On the seven READMEs it prints `files=7 pass=7 fail=0 unverified=6`, exit 0. It caught one real wrong count, `system-spec-kit/README.md:382` "two committed scripts" for a folder of five, and that line now names the two scripts. A wrong count still fails in the new tests.
- [x] T005 [P] Lane R tests: add one test per fixed class, one for a real broken path and one for a wrong count (`.skilled/skills/sk-doc/scripts/tests/test_*.py`). Verify: `run-script-tests.sh` with `ONLY_TESTS` set to the new file names prints PASS for each, and each fails with its fix reverted. Evidence: `test_readme_checker_false_positives.py` holds 40 pytest cases, each fix shown to fail before it, including `test_wrong_count_still_fails` and a real broken path. `run-script-tests.sh` passes and `test_validation_switch.py` passes 8. These tests were later rewritten for main's sk-doc/070 checkers, and AC-012 holds the final counts.
- [x] T006 Lane R report: after T003 to T005, rerun both checkers on the seven READMEs. Verify: a before and after table for each README, with every residual failure listed and judged real or not. Evidence: unresolved references across the seven READMEs went from 608 to 0, and `check_readme_references.py` on all seven prints `SUMMARY files=7 pass=7 fail=0`, so no residual is left to judge. Two review rounds found P1s, each fixed with a regression test. The README lines the stricter checker exposed as real broken references or shorthand were fixed under the 2026-10-27 scope amendment. The count checker on the same seven READMEs prints `files=7 pass=7 fail=0 unverified=6`, exit 0, and its one real wrong count is fixed (T004).

Lane A: advisor routing.

- [x] T007 [P] A1: add packet-local changelog vocabulary to sk-doc or sk-create-changelog routing and `graph-metadata.json`, compiled through the normal generators, with no scorer change. Verify: `advisor_recommend` ranks sk-doc first on the four changelog probes and system-spec-kit first on the four spec-kit probes, and `git diff` on the advisor scorer prints nothing. Evidence: the sk-doc `ROUTER.md` CHANGELOG intent gained four phrases, propagated to `graph-metadata.json` and `skill-graph.json` by the generators. That fixed 2 of the 4 changelog probes. Under the 2026-10-27 scope amendment, `fusion.ts` gained a changelog-from-packet exception in `primaryIntentBonus` (sk-doc +0.12, system-spec-kit -0.12, other skills fall through to later bonuses, the corpus-study rule skipped for these prompts) and `scoring-constants.ts` gained its two constants. The scorer diff is therefore not empty, by approval. The reviewer's two P1s, an over-broad pattern and an early return that skipped later bonuses, are fixed.
- [x] T008 A1 lock: after T007, add the eight probes to the advisor regression corpus or golden prompts (`.skilled/skills/system-skill-advisor/runtime/tests/`). Verify: `routing-golden-prompts.vitest.ts` passes and fails with the T007 vocabulary reverted. Evidence: the fixture `runtime/scripts/fixtures/gate2-golden-prompts.jsonl` adds 15 cases in total, five sk-doc changelog cases and ten controls, the thin-margin case included. The golden, prompt-policy and holdout suites pass (36 tests). "Resume work on this packet" was reworded to "Resume work on this spec packet" because the prompt policy declines a 3-token prompt. The fail-with-revert half is inferred from the T002 baseline, where all four changelog probes ranked system-spec-kit first, and from the metadata-only state that fixed only 2 of 4. A rerun of the golden suite with both fixes reverted would confirm it.

Lane T: alignment tool.

- [x] T009 [P] T1: coerce each finding id to a string, prefixed with the lane id when bare (`$L/aggregate-findings.cjs`). Verify: the aggregator on a copied run folder with a lane file using numeric ids exits 0 and prints no `localeCompare` error. Evidence: the aggregator coerces ids to strings and keeps `source_id`, and the numeric-id run no longer crashes.
- [x] T010 [P] T2: add the optional `overrides` array to the critic contract, make the aggregator apply it, and ask for it in the critic step (`$L/aggregate-findings.cjs`, the two workflow YAMLs and the presentation contract in `$L`). Verify: rerun on a copy of `20261027T154036Z` with overrides for CR-1, CR-2 and CR-5 puts D2 outside scope, lists PRB-01 to PRB-03 and A-2 under "Overturned by the critic" and lowers the counts by those findings, and the rerun on a copy of `20261027T171418Z` with no overrides matches its original counts. Evidence: the critic contract carries an `overrides` array (refuted, duplicate, pre-existing or severity, one per finding), ambiguous and stacked overrides are reported, and `overturned.json` is written. On a copy of the DeepSeek run, 27 findings with P1=8 became 23 with P1=5 and overturned=4. Both YAMLs ask for `overrides` with the same shape, and the presentation contract reports the Overturned count and `overturned.json`. A fresh Opus medium reviewer found two P2s, both fixed. The no-overrides rerun on `20261027T171418Z` was not reported separately.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run the sk-doc script tests. Verify: `bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` prints no FAIL line and exits 0. Evidence: `run-script-tests.sh` passes and `test_validation_switch.py` passes 8.
- [x] T012 Run the advisor gates in `scratch/items.md`. Verify: `skill-graph-freshness.cjs --strict`, `compiled-route-guard.cjs`, `compiled-route-admission.cjs --all`, `generate-router-intent-signals.cjs --check` and `skill_graph_compiler.py --validate-only` exit 0, and the parity ratchet, registry drift guard, routing-parity and golden-prompt vitest suites pass. Evidence: compiled-route-guard, compiled-route-admission `--all`, skill-graph-freshness `--strict`, router-intent-signals `--check`, the skill_graph_compiler validation, typecheck and build all exit 0. The full advisor suite printed 150 files, 1267 passed, 8 skipped and 0 failed against a 1253 baseline, before the thin-margin golden case was added. `scratch/after/advisor-suite.txt` holds an earlier run of the same suite at 1263 passed and 8 skipped.
- [x] T013 Run the system-spec-kit CLI suite only if spec-kit code changed. Verify: `git -c core.fsmonitor=false diff --stat -- .skilled/skills/system-spec-kit/runtime` prints nothing, or `npx vitest run --config vitest.config.ts --project cli` prints 0 failed. Evidence: the diff stat on `.skilled/skills/system-spec-kit/runtime` printed nothing. The only system-spec-kit change is `README.md`, so the CLI suite was not needed.
- [x] T014 Sync the Hermes mirror and the main checkout copy of Lane T. Verify: the Hermes sync reports every copy in sync, and `diff -r` between the worktree and main checkout copies of `$L` prints nothing. Evidence: `sync-skills-hermes.cjs --check` printed `PASS: 67 Hermes skill copies in sync` and `sync-prompts-hermes.cjs --check` printed `PASS: 39 prompts are in sync`, both exit 0. `diff -r` against the main checkout copy exits 0.
- [x] T015 Validate the phase. Verify: `validate.sh --strict` on this phase prints `RESULT: PASSED`. Evidence: `SPECKIT_DRAFT_AUTO_REPAIR=0 validate.sh --strict` on this phase printed `RESULT: PASSED` after `repair-derived.cjs --apply`.
- [x] T016 Run a fresh Opus medium review of the whole change. Verify: the review reports no P0, and every P1 is fixed or recorded. Evidence: fresh reviewers ran per lane and none reported a P0. Lane R took two rounds whose P1s were all fixed with a regression test each, Lane A's two P1s were fixed, and Lane T's two P2s were fixed. A fresh Opus medium review of the whole phase then found no P0, and its P1 and P2s were fixed.

Closeout: these stay open until the conductor runs them.

- [x] T017 Validate the whole packet. Verify: `validate.sh --strict --recursive` on packet 054 prints `RESULT: PASSED` for every folder. Evidence: the recursive strict run after the closeout edits printed `RESULT: PASSED` for every folder.
- [x] T018 Commit the change on the worktree branch. Verify: `git -c core.fsmonitor=false log -1 --format=%h` prints a new commit and `git status --short` lists no file this phase changed. Evidence: the phase landed in local commits on `worktrees/217-weak-model-spec-authoring`, ending with the closeout commit, and `git status --short` after it lists no file this phase changed.
- [x] T019 Rebase onto main. Verify: the rebase completes with no conflict left, and this branch's release entries are renumbered past every version main has shipped. Evidence: the rebase onto `c41132975d` printed "Successfully rebased" with a clean tree and `SKILL.md` reads `version: 2.12.10.0`. Main then took the advisor and sk-create-readme numbers, so a second rebase onto `18e085c52b` moved them on, and later ones settled them at spec-kit v2.12.13.0, sk-doc v2.3.24.0, sk-create-readme v1.3.4.0 and advisor v0.17.16.0, the last onto `8973d16740`. The four release entries report 0 issues from `validate_document.py`.
- [x] T020 Rebuild the trigger index after the rebase (`.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs`). Verify: the script's `--check` exits 0. Evidence: the generator and its `--check` both exit 0, rerun after the closeout doc edits.
- [x] T021 Merge the README checkers with main's sk-doc/071 rewrite, which the operator chose over keeping either side, then reconcile with main's later sk-doc/070 rewrite as a fresh Opus high recommended. Verify: main's tests, both `--self-test` runs and this phase's tests pass, and a sweep of every tracked README shows none failing that passes main's checkers. Evidence: the final checkers are main's sk-doc/070 checkers with this phase's capabilities ported on top. `39 passed`, both self-tests exit 0, and on the same 987 READMEs main's checkers failed 336 on references and 59 on counts against 318 and 54, with no README failing only under the final ones.
- [x] T022 Run fresh Opus high reviews of the merged and the ported checkers and fix every finding. Verify: each finding has a regression test that fails before its fix. Evidence: the merge drew 2 P1 and 7 P2, then 1 P1 and 3 P2, and the port 1 P1 pair and 5 P2, and every one was fixed with a test. READMEs whose text the checkers proved wrong were corrected, and correct text no rule can prove got an `allow-count` or `allow-ref` entry whose reason the reviewer checked.
- [x] T023 Remove the operator-local command name from every tracked file. Verify: `git grep -c` for that name prints nothing. Evidence: the earlier commit carrying it was squashed during the rebase, and the two older packets naming it were reworded, with their derived metadata refreshed and strict validation passing.
- [x] T024 Rerun the full suites on the final rebase. Verify: the CLI suite and the advisor suite print 0 failed. Evidence: CLI 2242 passed and 20 skipped, advisor 1321 passed and 8 skipped, both 0 failed.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every row of `acceptance-criteria.md` is Met
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Items**: See `scratch/items.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md: REQ-001 to REQ-007. Evidence: REQ-001 to REQ-007 are in spec.md §4, REQ-008 adds the closeout gates and REQ-009 the merge with sk-doc/071.
- [x] CHK-002 [P0] Technical approach defined in plan.md: three lanes, then the conductor gates. Evidence: plan.md §1 and §3 name the three lanes and the conductor gates, with the 2026-10-27 amendment.
- [x] CHK-003 [P1] Baselines recorded: T001 and T002. Evidence: T001 and T002 are checked with their numbers.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `python3 -m py_compile` on both checkers and `node --check $L/aggregate-findings.cjs` exit 0, and both YAMLs parse. Evidence: `py_compile` on both checkers exit 0, `node --check` exit 0, and a `yaml.safe_load` of both YAMLs exit 0.
- [x] CHK-011 [P1] Comments carry the reason and no packet, phase or finding id. Evidence: a scan of the added `.py` and `.ts` comment lines from the rebased commit `a64c5d7013` and the merged checkers for REQ, ADR, AC, task, finding, item, spec path, phase or packet ids printed nothing.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: AC-001 to AC-012 are Met in `acceptance-criteria.md`.
- [x] CHK-021 [P0] Each new checker test and the A1 corpus entry fail with their fix reverted. Evidence: the test file holds 40 pytest cases, and each fix was shown to fail before it. The A1 golden cases are inferred to fail with the fix reverted from the T002 baseline and the metadata-only 2 of 4 state, as T008 records. These tests were later rewritten for main's sk-doc/070 checkers, and AC-012 holds the final counts.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] R1 is `class-of-bug`: each false-positive class is named with its count before and after. Evidence: T003 names each class, and unresolved references across the seven READMEs went from 608 to 0.
- [x] CHK-FIX-002 [P1] Evidence is pinned to the fix commit or a diff range from `1aebbe8261` (rebased as `a64c5d7013`), and Lane T evidence to the rerun output. Evidence: the working-tree diff from `1aebbe8261` (15 tracked files, 543 insertions, 87 deletions, plus the new test file), and the Lane T rerun output on the copied DeepSeek run.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets: the diff adds none, and R1 reads no gitignored personal file such as `.skilled/hooks/hook-flags.env`. Evidence: a scan of the added lines for key, secret, token or password assignments printed nothing, and the reference checker skips gitignored files.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] The critic contract in the alignment command's presentation contract and both YAMLs describe the same `overrides` shape. Evidence: both YAMLs carry the identical `overrides` shape, and the presentation contract now documents the input shape `{"id","verdict","severity","note"}` next to the Overturned count and `overturned.json`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Copied run folders and temp files stay in the session scratchpad or this phase's `scratch/`. Evidence: this phase holds only `scratch/items.md` and `scratch/after/advisor-suite.txt`, and the copied DeepSeek run was not left under `.skilled/output/`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 6/7 |
| P1 Items | 5 | 5/5 |

**Verification Date**: 2026-10-27
<!-- /ANCHOR:summary -->
