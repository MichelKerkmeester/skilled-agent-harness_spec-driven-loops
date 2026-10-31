# Build Evidence: 006-goal-criteria-lint (wave 3 build orchestrator)

Worktree `069-cli-jev-workflow-integration`, HEAD at hand-off `996cf85eef`. Every command ran from the worktree root. Raw outputs sit in `baseline/`, `logs/` and `runs/` beside this file. `G=.skilled/skills/sk-doc/sk-create-goal/scripts`.

`SKDOC_SKIP_VALIDATION` is unset in this environment and `.skilled/hooks/hook-flags.env` does not exist, so every validator result below ran with validation on.

## 1. Baseline (before the first dispatch)

| Gate | Command | Result | Exit |
|------|---------|--------|------|
| Checker corpus run | `env -u SKDOC_SKIP_VALIDATION node $G/check-goal.cjs --all` | `goals_scanned=353`, `phase_parents_scanned=36`, findings: missing-binding-row 203, placeholder 86, criteria-count 38, parent-budget 4, frontmatter-fence 0. One stderr line: a scratch fixture under `038-goal-unification/.../scratch/broken-fence/goal.md` has no closing fence. No `RESULT` line: corpus mode prints none (`check-goal.cjs:540-555`) | 2 |
| Checker file | `shasum -a 256 $G/check-goal.cjs`; `CHECKS` | `4bf117a9...aadcd6`; five names | - |
| sk-create-goal tests | `node --test $G/tests/` | `tests 20`, `pass 20`, `fail 0` | 0 |
| validate_document.py | SKILL.md, README.md, scripts/README.md, playbook root, one playbook scenario, changelog v1.2.0.0, hub feature-catalog.md, one hub catalog leaf | 8 of 8 exit 0. `Total issues: 0` on six; `Total issues: 1` (the `document_type_fallback` note) on the playbook root and the catalog root, 0 with `--type playbook` and `--type feature_catalog` | 0 each |
| Playbook package | `validate-playbook-package.cjs --package .skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook` | `PASS package=sk-doc/sk-create-goal tier=FAIL_CLOSED scenarios=8 categories=1 operator=8 ... violations=0 warnings=0` | 0 |
| Catalog package | `validate_catalog_package.py --package sk-doc` | `WARN tier=warn violations=6` (0 fail, 6 warn: 4 missing compiled-routing paths, 2 root-leaf description mismatches) | 0 |
| Skill-root metadata | `ci-skill-root-metadata.cjs` | `checked=16 passed=16 failed=0 fixed=0` | 0 |
| Hermes copies | `sync-skills-hermes.cjs --check` | already drifting before this build: `DRIFT system-spec-kit` (phase 017's parallel edit), `FAIL: 1 drifted` | 1 |
| Validation switch tests | `pytest test_validation_switch.py` | `7 passed` | 0 |
| Phase docs | `validate.sh <phase> --strict`; `check-goal.cjs <phase>` | `Errors: 0 Warnings: 0`, `RESULT: PASSED`; `RESULT: PASSED (5/5 checks)` | 0, 0 |
| Population | `find specs -name goal.md -not -path '*/z_archive/*'` | 353 files: 30 under a `scratch` segment, 323 outside | - |

Planning prototype (`proto/rules.cjs`, `proto/corpus.cjs`, this folder, read only, not a build target): the rule design the briefs specify, run over the active tree, prints 323 goals, 30 scratch excluded, 1,543 criterion lines, 1,485 scored, 51 placeholder, 7 lexical_unscored, 13 no_input files, rule 4 on 1,017 scored lines, rule 5 on 41, both on 40. The built lint must print the same counts on the same tree.

## 2. Proof plan (fixed before the first dispatch)

`STUB` is a temporary directory outside the repository holding executable `jev` and `cli-deem` scripts that append their arguments to `<name>.log` beside themselves.

| Row | Criterion | Command | Expected |
|-----|-----------|---------|----------|
| P1 | Goal 1 | `PATH="$STUB:$PATH" node $G/lint-goal-criteria.cjs --all; echo $?` | `rule4_violations=` and `rule5_violations=` with counts, `scratch_excluded=30`, exit 0, and neither `$STUB/jev.log` nor `$STUB/cli-deem.log` exists |
| P2 | Goal 2 | `node --test $G/tests/` | `fail 0`; the seven named lint cases (rule 4 fail, rule 4 pass, rule 5 fail, rule 5 pass, both failing, no criteria, scratch excluded) each `ok` |
| P3 | Goal 3 | `git diff --quiet -- $G/check-goal.cjs; echo $?`; `shasum -a 256`; the baseline `--all` run again | exit 0; hash unchanged; stdout, stderr and exit 2 identical to the baseline files |
| P4 | Goal 4 | row count and a per-row schema check on `$G/goal-criteria-labels.jsonl` | 100 or more rows; each row has exactly `id`, `text_sha12`, `rubric`, `rule4_ok`, `rule5_ok`, `labeler`; `id` is `specs/.../goal.md:<line>`; `text_sha12` is 12 hex; the last four are null; no row holds criterion text; every hash matches a current lint line |
| P5 | Goal 5 | `node $G/score-goal-lint.cjs --labels $G/goal-criteria-labels.jsonl; echo $?`, the same with `--lint` on a saved `--all --json` run, then `node --test $G/tests/score-goal-lint.test.cjs` | `unlabeled=` equal to the row count, `no labeled rows`, no `labeled_violation_rate` and no `precision=`, exit 0 from both forms; the test file passes cases for per-rule precision, recall and F1, the Wilson interval, `stale=` and the stop line |
| P6 | Goal 6 | `grep -n API_KEY $G/lint-goal-criteria.cjs $G/score-goal-lint.cjs; echo $?` | no match, exit 1 |
| P7 | Goal 7 | `validate.sh <phase> --strict` | `RESULT: PASSED` (the closure leaf owns the phase docs) |
| P8 | REQ-002 | the lint on `specs/no-such-packet`, with an unknown option, and on an unreadable goal | one named `ERROR` line each, exit 0 |
| P9 | REQ-006, T020 | the scorer without `--lint` under the stub PATH; `grep -n child_process` on both scripts | stub logs absent; no match |
| P10 | T021 | the scorer on a temporary labels copy with two `rubric` values | `rubric mismatch:` with both ids, no rate, exit 0 |
| P11 | REQ-011 | `git diff --quiet -- .skilled/commands/create/assets/create-goal-auto.yaml; echo $?` | exit 0 |
| G1 | Parent 4 | `node --test $G/tests/` | no failure beyond the 20 of 20 baseline |
| G2 | Parent 3 | `validate_document.py` on each changed skill doc | exit 0 each |
| G3 | Plan | playbook package validator; catalog package validator | playbook `PASS` with one more scenario (9); catalog 0 fail, no new warning |

## 3. Dispatch log

Every brief went through `dispatch.sh`, one at a time, composed by `compose.cjs` from its `briefs/NN-*.task.txt` plus the PREAMBLE, PERSONA, RUN CONTEXT, DON'T and HANDBACK blocks of `shared-blocks.md`, pasted verbatim. Before each dispatch `snap.sh NN pre` recorded the tree and a copy of each target went to `logs/NN.pre`. After it the orchestrator read `logs/NN.last.txt`, ran `snap.sh NN post` (porcelain diff outside the other builds' paths and this scratch) and ran the brief's own accept check. Every Devin dispatch carried the DON'T block and got the post diff.

| # | Brief | Executor | Lines | Secs | Exit | Handback | Files it wrote | Brief's own check |
|---|-------|----------|-------|------|------|----------|----------------|-------------------|
| 01 | parser port, line and hash | Devin DeepSeek | 77 | 282 | 0 | DONE | lint (new), lint test (new) | node -e prints `7`, 2 files created, pass |
| 02 | rule 4 plus a 2-column header fix | Devin DeepSeek | 86 | 174 | 0 | DONE | lint, lint test | prints `["The report","the result"]`, pass |
| 03 | rule 5, line classes, `lintCriterion` | Pi MiMo | 83 | 584 | 0 | DONE | lint, lint test | prints `{"class":"scored","rule4":["the spec"],"rule5":["per the spec","where they"]}`, pass |
| 04 | walker and file, workspace and packet runners | Devin DeepSeek | 68 | 169 | 0 | DONE | lint, lint test | prints `[{"path":"specs/no-such-packet","message":"packet not found"}]`, pass |
| 05 | command line, report, `--json`, exit 0 | Pi MiMo | 77 | 471 | 0 | DONE | lint, lint test | `goals_scanned=0`, the ERROR line, `exit=0`, pass |
| 06 | remove three em dashes from comments | Devin DeepSeek | 64 | 209 | 0 | DONE | lint, lint test | prints `0` for both files, pass |
| 07 | scorer core | Devin DeepSeek | 72 | 540 | 0 | DONE | scorer (new), scorer test (new) | prints `0.3006,0.9544`, pass |
| 08 | scorer command line | Pi MiMo | 77 | 660 | 0 | DONE | scorer, scorer test | `--labels is required` ERROR line, `exit=2`, pass |
| 09 | changelog v1.3.0.0 | Pi MiMo | 58 | 34 | 0 | DONE | `changelog/v1.3.0.0.md` (new) | `cmp` 0, validate_document 0, pass |
| 10 | playbook scenario SCG-009 | Pi MiMo | 58 | 40 | 0 | DONE | `manual-testing-playbook/goal-authoring/lint-goal-criteria.md` (new) | `cmp` 0, validate_document 0, pass |
| 11 | catalog leaf | Pi MiMo | 58 | 64 | 0 | DONE | `feature-catalog/document-validation/goal-criteria-lint.md` (new) | `cmp` 0, validate_document 0, pass |
| 12 | SKILL.md | Pi MiMo | 63 | 28 | 0 | DONE | `sk-create-goal/SKILL.md` | `cmp` 0, validate_document 0, pass |
| 13 | skill README | Pi MiMo | 64 | 26 | 0 | DONE | `sk-create-goal/README.md` | `cmp` 0, validate_document 0, pass |
| 14 | scripts README | Pi MiMo | 64 | 45 | 0 | DONE | `sk-create-goal/scripts/README.md` | `cmp` 0, validate_document 0, pass |
| 15 | playbook root | Pi MiMo | 63 | 99 | 0 | DONE | `manual-testing-playbook/manual-testing-playbook.md` | `cmp` 0, validate_document 0 (1 fallback note, as baseline), pass |
| 16 | catalog root | Pi MiMo | 63 | 41 | 0 | DONE | `sk-doc/feature-catalog/feature-catalog.md` | `cmp` 0, validate_document 0 (1 fallback note, as baseline), pass |
| 17 | scenario wording follow-up | Pi MiMo | 61 | 38 | 0 | DONE | the SCG-009 scenario, line 32 only | `cmp` 0, validate_document 0, playbook package PASS, pass |

Lint is `$G/lint-goal-criteria.cjs`, lint test `$G/tests/lint-goal-criteria.test.cjs`, scorer `$G/score-goal-lint.cjs`, scorer test `$G/tests/score-goal-lint.test.cjs`. Docs 09 to 17 were copies of literal text the orchestrator wrote in `content/`, one target each.

Counts: 17 briefs. Devin DeepSeek 5 (01, 02, 04, 06, 07). Pi MiMo 12 (03, 05, 08, 09 to 17). `pi-cline` 0: no LLM Gateway 429 or quota text in any log. Cursor 0. Every brief is under 90 lines.

Re-dispatches: none. No brief failed its check, so none was sent twice and none is BLOCKED. Brief 17 is not a retry. It is a new one-line brief that the final HVR scan earned: brief 10's scenario had a serial comma before its closing `exit=0` item on line 32, in text the orchestrator wrote. `content/playbook-lint-goal-criteria.v1.md` keeps the text as first shipped.

Executor extras, all harmless and inside the target files: Devin (04, 07) and Pi (05, 08) ran extra `node --check` or `node --test` runs beyond the brief's listed checks. Pi's brief 03 handback spells the repo path `.silled` in one line of its report only. No file carries it.

The build's own write: `goal-criteria-labels.jsonl`, written by `node draw-labels.cjs 20260928 100` (seed 20260928, 100 rows over 21 strata, drawn from 1,357 distinct scored hashes). This is the one build target the brief assigns to the orchestrator.

## 4. Final gates (from the final state, after brief 17)

Raw outputs are in `runs/final/`. The stub directory was `scratchpad/w3-006-stub`, outside the repository, and was removed after P1 and P9. The P8 and P10 temp root was removed too.

| Row | Command | Result line | Exit | Verdict |
|-----|---------|-------------|------|---------|
| P1 | `PATH="$STUB:$PATH" node $G/lint-goal-criteria.cjs --all` | `goals_scanned=323 scratch_excluded=30 criteria=1543 scored=1485 rule4_violations=1017 rule5_violations=41 both_violations=40 placeholder=51 lexical_unscored=7 no_input=13 errors=0`, stderr empty, no stub log exists | 0 | PASS |
| P2 | `node --test $G/tests/` | `tests 40`, `pass 40`, `fail 0`. The seven named lint cases each `ok`: rule 4 fails a dangling definite description, rule 4 passes a line whose references resolve locally, rule 5 fails a check that needs another document, rule 5 passes a check on named commands and counts, a line can fail both rules, a goal with no criteria yields no records and counts as no_input, the walker excludes scratch paths and z_archive | 0 | PASS |
| P3 | `git diff --quiet -- $G/check-goal.cjs`; `shasum -a 256`; `env -u SKDOC_SKIP_VALIDATION node $G/check-goal.cjs --all` | diff exit 0. Hash `4bf117a9...aadcd6`, unchanged. `--all` stdout and stderr `cmp`-identical to the baseline files, exit 2 as baseline | 0, -, 2 | PASS |
| P4 | `node check-labels.cjs`, plus an independent `node -e` schema pass | `rows=100 bad_schema=0 stale_hash=0 id_moved=0 max_row_chars=262 distinct_hashes=100`. `rows=100 bad=0 distinct_ids=100`: exact keys, four nulls, 12-hex hash, `specs/.../goal.md:<line>` id. The longest row is a long id path, not text | 0, 0 | PASS |
| P5 | the scorer without `--lint`, with `--lint runs/final/lint-all.json`, then `node --test $G/tests/score-goal-lint.test.cjs` | both print `rows=100 rubric=none unlabeled=100 stale=0 not_scored=0 labeled=0 no labeled rows`, no rate, no `precision=`. The two outputs are `cmp`-identical. Tests `8`, `pass 8`, `fail 0` | 0, 0, 0 | PASS |
| P6 | `grep -n API_KEY` on lint and scorer | no match | 1 | PASS |
| P7 | `validate.sh <phase> --strict` | `Summary: Errors: 0  Warnings: 0`, `RESULT: PASSED` | 0 | PASS |
| P8 | lint on `specs/no-such-packet`, on `--bogus`, and `--all --root` on a temp tree whose only goal is mode 000 | `ERROR specs/no-such-packet: packet not found`; `ERROR unknown option: --bogus`; `ERROR specs/a/goal.md: EACCES: permission denied`. One named line each | 0, 0, 0 | PASS |
| P9 | the scorer without `--lint` under the stub PATH; `grep -n child_process` on both scripts | no stub log; no match | 0, 1 | PASS |
| P10 | the scorer on a temp labels copy with rubrics `a` and `mimo-02-strict-v1` | `rows=100`, `rubric mismatch: a,mimo-02-strict-v1`, no rate | 0 | PASS |
| P11 | `git diff --quiet -- .skilled/commands/create/assets/create-goal-auto.yaml` | no diff | 0 | PASS |
| G1 | `node --test $G/tests/` | 40 of 40 against the 20 of 20 baseline, 0 fail | 0 | PASS |
| G2 | `validate_document.py` on the 8 changed skill docs | SKILL.md, README.md, scripts/README.md, the SCG-009 scenario, changelog v1.3.0.0 and the catalog leaf: `Total issues: 0`. Playbook root and catalog root: `Total issues: 1`, the `document_type_fallback` note both had at baseline. With `--type playbook` and `--type feature_catalog`: `Total issues: 0` | 0 each | PASS |
| G3 | `validate-playbook-package.cjs --package $GS/manual-testing-playbook`; `validate_catalog_package.py --package sk-doc` | `PASS ... scenarios=9 categories=1 operator=9 ... violations=0 warnings=0`. `WARN tier=warn violations=6 (0 fail, 6 warn)`, the six warning lines identical to the baseline | 0, 0 | PASS |

Other named and cross-cutting checks:

| Check | Result line | Exit | Note |
|-------|-------------|------|------|
| `ci-skill-root-metadata.cjs` | `checked=16 passed=16 failed=0 fixed=0` | 0 | same as baseline |
| `sync-skills-hermes.cjs --check` | `DRIFT sk-create-goal`, `FAIL: 1 drifted, 0 stale` | 1 | open item, see section 7 |
| `pytest -q test_validation_switch.py` | `7 passed` | 0 | same as baseline |
| `check-goal.cjs <phase>` | `RESULT: PASSED (5/5 checks)` | 0 | same as baseline |
| `hvr_scan.py` on the three new docs | `hard blockers: 0`, mechanical ceiling 100/100 on each. The `oxford-comma-candidate` review hits left are clause joins, parentheticals and commas inside code-span lists, not serial commas | 0 | brief 17 fixed the one real serial comma |
| em dash count on the 13 build targets | 0 on 12. `feature-catalog.md` holds 3, all 3 already at HEAD. The build's added sentence adds none | - | scope lock, see section 5 |
| label gate (parent D4) | no model arm, no `--jev` or `--deem` flag (`grep` exit 1), yaml untouched, every label field null, no rubric chosen, no live call | - | the lint's rule 4 follows candidate A (`mimo-02-strict-v1`), which stays the working default until the operator adopts one |

## 5. Baselines and deltas

| Gate | Baseline | Final | Delta |
|------|----------|-------|-------|
| sk-create-goal node suite | 20 pass, 0 fail | 40 pass, 0 fail | +20 new tests (12 lint, 8 scorer), 0 regressions |
| `check-goal.cjs --all` | stdout, stderr, exit 2 | byte-identical, exit 2 | none |
| `check-goal.cjs` hash | `4bf117a9...aadcd6` | same | none |
| playbook package | `scenarios=8`, 0 violations | `scenarios=9`, 0 violations | +1 scenario |
| catalog package | 0 fail, 6 warn | 0 fail, same 6 warn | none |
| validate_document on the 5 pre-existing docs | 0, 0, 0, 1 fallback, 1 fallback | same | none |
| skill-root metadata | 16 of 16 | 16 of 16 | none |
| Hermes check | `DRIFT system-spec-kit` (not this build) | `DRIFT sk-create-goal` | the system-spec-kit drift is gone, cleared outside this build. The sk-create-goal drift is this build's, from the SKILL.md change |
| validation switch tests | 7 passed | 7 passed | none |
| phase `validate.sh --strict` | PASSED | PASSED | none |

## 6. Deviations and stale premises

Deviations, each with its reason:

1. `scripts/README.md` got two doc-truth fixes beyond the lint additions: "four things" became five (HEAD line 16), and the `--all` sentence that said it "exits 2 when any goal has a finding" (HEAD line 70) now says it exits 2 only when a goal cannot be read, which is what `check-goal.cjs:700-703` does. The README tests row also read `pass 15` at HEAD line 161, against a 20-test baseline, and now reads `pass 40`. All three sit in files the build had to change anyway.
2. The lint test file carries five cases beyond the seven named ones: parser parity with `checkCriteriaCount`, line and hash, the placeholder and unscored classes, the command line exit 0, and the report format. Each fails for a reason the named seven do not cover.
3. The draw deduplicates by `text_sha12` and draws scored lines only, so no label is spent on a placeholder or a repeated line. The label ids are `path:line` and can move when a goal's frontmatter changes. The scorer joins on the hash, so a moved id does not stale a label.
4. Only `SKILL.md` took a version bump (1.2.0.0 to 1.3.0.0). The new child docs took the anchor's major and minor. The other changed docs kept their versions.
5. The em dashes in briefs 01 and 02, and in the first lint and test files, came from the orchestrator's brief header text and from Pi's JSDoc. Brief 06 removed them from the build targets. The two scratch briefs were fixed with `perl` after dispatch. The scratch now holds none outside `logs/`, except `content/catalog-root.new.md`, which copies the catalog root's 3 pre-existing em dashes.
6. `feature-catalog.md` keeps its 3 em dashes from HEAD, one on the intro line the build extended. Rewriting them would edit text outside this change, so they stay.
7. Brief 17, a follow-up after the dispatch plan, fixed one serial comma in the orchestrator's own scenario text.

Premises that no longer match the code:

1. `spec.md:151` (REQ-003) says "`CHECKS` still lists four names". `check-goal.cjs:46` lists five. `spec.md:217` already records the fifth check as a risk.
2. `spec.md:151`, `spec.md:200`, `plan.md:91`, `plan.md:116`, `tasks.md:42` and `tasks.md:73` expect a `RESULT` line from `check-goal.cjs --all`. Corpus mode prints none (`check-goal.cjs:540-555`) and returns 2 only on read errors (`:700-703`). P3 compared the full stdout, stderr and exit instead, which is stricter.
3. `plan.md:130` names `.skilled/skills/sk-doc/scripts/validate_document.py`. That is a symlink to `../shared/scripts/validate_document.py`, the path the brief names, so both run the same file.
4. `spec.md:47`, `plan.md:31` and `goal.md:131` name Pi on Cline and Cursor. The operator's roster of 2026-09-28 20:30 (Devin DeepSeek and Pi MiMo, Cursor retired) governed this run. The closure leaf owns those lines.

## 7. Open items

1. `sync-skills-hermes.cjs --check` reports `DRIFT sk-create-goal` because `SKILL.md` changed. Regenerating the Hermes copy is outside this build's write scope. The orchestrator session can run `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs` (no `--check`), then rerun the check.
2. The trigger index was not regenerated, by instruction, so it does not know the new trigger phrases yet.
3. The phase's spec docs (T-row checkboxes, `implementation-summary.md`, the stale premises in section 6) belong to the closure leaf.
4. The operator's label gate: adopt a rubric (T001), fill the 100 rows, then run the scorer. Until then every row is unlabeled and the scorer prints no rate by design.
5. The cross-family code review and the commit are the orchestrator session's. Nothing here is staged or committed.
6. HEAD moved from `996cf85eef` to `1da5b193d2` during the run: 5 commits from other sessions. `git log --name-only 996cf85eef..HEAD` names no path under `sk-doc/` or this phase, so the final gates ran on this build's files as the executors left them.
