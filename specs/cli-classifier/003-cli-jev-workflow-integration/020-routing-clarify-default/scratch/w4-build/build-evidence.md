# Build evidence: 020-routing-clarify-default

Build orchestrator: Opus 5.5 leaf, 2026-09-29. Start HEAD `bf830c3d47`. Executors per parent D5: Devin `deepseek-v4-1-flash-max` for code, Pi `llmgateway/mimo-v2.6-pro` at `high` for docs. All dispatches through `scratchpad/w3/dispatch.sh`, one at a time.

`S` = `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs`, `T` = `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/score-clarify-default.test.cjs`.

## 1. Pre-flight

- Phase 021 is not building: `git status --porcelain -- .skilled/skills/sk-doc/sk-create-skill` printed nothing, and no `build-021` brief exists in `scratchpad/w3/later/`.
- Parallel builds 019, 022, 023, 024 and 035 name no sk-doc hub path in their Files to Change (checked their `spec.md`).
- `git status --porcelain` at start: 3 lines, all untracked `scratch/w4-build/` folders (019, 020, 024). Saved to `base/git-status-start.txt`.
- REPO RULES loaded: delegation-and-orchestration, prevent-overengineering, evidence-and-proof.

## 2. Baselines (before the first dispatch)

| Gate | Command | Result | Exit |
|---|---|---|---|
| sk-create-skill `node --test` | `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/` | `tests 19`, `pass 18`, `fail 1` (`skill-root-metadata-contract.test.cjs`, fleet list mismatch) | 1 |
| sk-create-skill self-run | `node <file>` for each of 11 `*.test.cjs` | 10 exit 0, 1 exit 1 (same file) | - |
| sk-doc script suite | `SKIP_TESTS="test_rename_tooling_fixture_harness.py" bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` | 26 PASS, 1 SKIP, `all sk-doc script tests passed` | 0 |
| Playbook package | `validate-playbook-package.cjs --package .../sk-create-skill/manual-testing-playbook` | `PASS ... scenarios=6 categories=2 ... violations=0 warnings=0` | 0 |
| Catalog package | `validate_catalog_package.py --package sk-doc` | `WARN tier=warn violations=6` (0 fail, 6 warn, all on the older compiled-routing leaf) | 0 |
| sk-doc leaf manifest | `generate-leaf-manifest.cjs --check .skilled/skills/sk-doc` | `leaf-manifest.json OK (e29b82fc...)` | 0 |
| Hermes copies | `sync-skills-hermes.cjs --check` | `PASS: 72 Hermes skill copies in sync` | 0 |
| Trigger index | `generate-trigger-index.mjs --check --json` | `fresh: true`, 23,405 documents, 0 stale, 0 obsolete, 0 untrusted | 0 |
| Drift guards, whole repo | `run-all-drift-guards.sh` | `1 guard(s) FAILED` (alignment-drift, 16,978 findings repo-wide, 2 in sk-create-skill scripts) | 1 |
| Drift guard, scoped | `verify_alignment_drift.py --root .skilled/skills/sk-doc/sk-create-skill/scripts --fail-on-warn` | `Scanned files: 29`, `Findings: 2`, `Errors: 0`, 2 pre-existing `JS-USE-STRICT` warnings | 1 |
| validate_document.py | SKILL.md, README.md, changelog v1.3.0.0, scripts/README, tests/README, SKL-005 scenario | `Total issues: 0` each; catalog root `--type feature_catalog` 0, playbook root `--type playbook` 0 | 0 each |

Logs: `base/`.

## 3. Proof plan

`STUB` = `scratch/w4-build/stub/` (logging `jev` and `cli-deem`). Run outputs go to `scratch/w4-build/runs/`, inside the orchestrator's write scope.

| # | Criterion | Command | Expected |
|---|---|---|---|
| P1 | goal 1, spec proof 1 | `PATH="$STUB:$PATH" node S --report runs/census --rows-out runs/census/rows.jsonl` | exit 0, a line per hub and source, `real clarify rate: not measured`, both stub logs empty. Boundary: canary clarify 1 each for system-deep-loop, cli-external-orchestration and sk-doc, deep-loop's under `clarify_checklist` |
| P2 | goal 2, spec proof 2 | every rows line has `"label":""`, then `node S --score runs/census/rows.jsonl`, then the same with `--deem --out runs/gate-deem` and `STUB` first on PATH | `stop: fewer than 30 labeled rows (<n> labeled)`, exit 0, both times, and no stub call |
| P3 | goal 3, spec proof 3 and 5 | `node --test T` | exit 0, at least 16 pass, including `verdict deem: keep` and `stop (margin)` on 30 synthetic labels |
| P4 | goal 4, spec proof 4 | `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization' S`; `git status --porcelain` before and after P1 and P2 | grep exit 1; porcelain identical apart from other builds' paths |
| P5 | goal 5 | `validate_document.py` on SKILL.md, README.md, changelog v1.4.0.0, the catalog entry, plus every other changed doc | exit 0 each |
| P6 | goal 6 | `validate.sh <phase> --strict` | `RESULT: PASSED` (spec docs are the closure leaf's; this run is read-only) |
| P7 | plan DoD | sk-create-skill `node --test` dir and self-run, sk-doc suite, playbook and catalog packages, scoped drift guard | nothing beyond the baselines above |

## 4. Dispatch log

Each row: brief, executor, wall time, exit, files the tree diff showed for this phase, the orchestrator's own check. Other paths that appeared in `git status` between pre and post snapshots belong to 023 (`sk-communication`) and 024 (`deep-improvement`) and were not touched.

| # | Brief | Executor | Secs | Exit | Phase files changed | Orchestrator check |
|---|---|---|---|---|---|---|
| 01 | `briefs/01-census-core.md` | devin | 157 | 0 | S (new, 142 lines), T (new) | `node --test T`: tests 3, pass 3, fail 0, exit 0. Code read against the brief: matches |
| 02 | `briefs/02-sources-and-cli.md` | devin | 180 | 0 | S (491 lines), T | `node --test T`: tests 6, pass 6, fail 0, exit 0. Real-tree census (`runs/census-b02.out`): exit 0 in 1 s, 359 prompts, canary clarify 1 each on system-deep-loop (checklist), cli-external-orchestration (mode) and sk-doc (mode), 2 rows written, 0 with gold, stub log absent |
| 03 | `briefs/03-transcripts.md` | devin | 269 | 0 | S (595 lines), T | `node --test T`: tests 8, pass 8, fail 0, exit 0. Code read: count-only walk, distinct pairs per line, non-directory refused with exit 2 before census work |
| 04 | `briefs/04-scorer-gate.md` | devin | 276 | 0 | S (797 lines), T | `node --test T`: tests 12, pass 12, fail 0, exit 0. Code read: foreign label refused before stdout, gate line, baseline, rule lines, headroom. P2 noted: a `describeModes` throw is uncaught (exit 1, stack) |
| 05 | `briefs/05-verdict.md` | devin | 252 | 0 | S (935 lines), T | `node --test T`: tests 15, pass 15, fail 0, exit 0. Diff against the 04 snapshot: only the two renumbered dividers removed. Code read: kill before margin, unstable adds 3 flips, A/B/W/L over measured rows |
| 06 | `briefs/06-gates.md` | devin | 195 | 0 | S (1,136 lines), T | `node --test T`: tests 19, pass 19, fail 0, exit 0. Diff against the 05 snapshot: only the lines the brief named. Gate code equals 002's `score-jev-tiebreak.mjs:1359-1506` with the 2,000 ms health timeout. P2 noted: `jevGate`'s local `path` shadows the module |
| 07 | `briefs/07-deem-arm.md` | devin | 186 | 0 | S (1,397 lines), T | `node --test T`: tests 24, pass 24, fail 0, exit 0 (7.0 s). Tree diff clean. Code read: every spawn recorded before a stop, exit 4 rechecks health, 2/3/130 stop with `partial_rows`, verdict suffix carries the commit pair |
| 08 | `briefs/08-jev-arm.md` | devin | 193 | 0 | S (1,566 lines), T | `node --test T`: tests 27, pass 27, fail 0, exit 0 (11.8 s). Tree diff clean. Code read: payload and cost line before any call, one `auth test`, exit 4 records the first spawn then backs off once, 2/3/130 stop with `partial_rows`, Jev runs before the Deem gate |
| 08b | `briefs/08b-deem-skip-tests.md` | devin | 42 | 0 | T | `node --test T`: tests 28, pass 28, fail 0, exit 0 (11.9 s). Tree diff clean, S unchanged against the 08 snapshot. Test-only: pins the `model` and `bad health response` skip lines with their `deem: found=` details |
| 09 | `briefs/09-scripts-readme.md` | pi | 38 | 0 | `sk-create-skill/scripts/README.md` | `cmp` against `drafts/scripts-readme.after.md`: identical. `validate_document.py`: `Total issues: 0`, exit 0. Tree diff: only this file |
| 10 | `briefs/10-tests-readme.md` | pi | 48 | 0 | `sk-create-skill/scripts/tests/README.md` | `cmp` against `drafts/tests-readme.after.md`: identical. `validate_document.py`: `Total issues: 0`, exit 0. Tree diff: only this file |
| 11 | `briefs/11-skill-md.md` | pi | 44 | 0 | `sk-create-skill/SKILL.md` | `cmp` against `drafts/skill.after.md`: identical. `validate_document.py`: `Total issues: 0`, exit 0. Tree diff: only this file |
| 12a | `briefs/12a-readme-rows.md` | pi | 36 | 0 | `sk-create-skill/README.md` | Diff against the pre-dispatch copy: exactly the version line and the two rows (`pass 28`). `validate_document.py`: `Total issues: 0`, exit 0. Tree diff: only this file. The handback misspelled the paths as `.sskilled/`; the file itself is right |
| 12b | `briefs/12b-readme-subsection.md` | pi | 31 | 0 | `sk-create-skill/README.md` | `cmp` against `drafts/readme.after.md` (both README briefs): identical. `validate_document.py`: `Total issues: 0`, exit 0. Tree diff: nothing new. The first draft of this brief named only the tail of line 87 as "whole lines"; I rewrote it to the whole line before dispatch |
| 13 | `briefs/13-changelog.md` | pi | 40 | 0 | `sk-create-skill/changelog/v1.4.0.0.md` (new) | `cmp` against `drafts/v1.4.0.0.md`: identical. `validate_document.py`: `Total issues: 0`, exit 0. Tree diff: only this file. Before dispatch I corrected the draft's Upgrade line, which said no playbook scenario changed while SKL-007 is new |
| 14 | `briefs/14-playbook-scenario.md` | pi | 47 | 0 | `manual-testing-playbook/parent-hub/count-clarify-and-stop-at-the-label-gate.md` (new) | `cmp` against the draft: identical. `validate_document.py`: `Total issues: 0`, exit 0. Tree diff: only this file |
| 15 | `briefs/15-playbook-index.md` | pi | 46 | 0 | `sk-create-skill/manual-testing-playbook/manual-testing-playbook.md` | `cmp` against `drafts/playbook-index.after.md` (HEAD plus the nine edits in `drafts/playbook-index.edits.json`, rechecked against the live file before dispatch): identical. `validate_document.py --type playbook`: `Total issues: 0`, exit 0. Tree diff: only this file |
| 16 | `briefs/16-catalog-entry.md` | pi | 52 | 0 | `feature-catalog/compiled-routing-and-legacy-fallback/clarify-default-measurement.md` (new) | `cmp` against the draft: identical. `validate_document.py`: `Total issues: 0`, exit 0. Tree diff: only this file |
| 17a | `briefs/17a-catalog-index-frontmatter.md` | pi | 100 | 0 | `sk-doc/feature-catalog/feature-catalog.md` | Diff against the pre-dispatch copy: the description clause, one trigger phrase and `last_updated`, nothing else. `validate_document.py --type feature_catalog`: `Total issues: 0`. Without `--type` it prints one `document_type_fallback` warning, which HEAD prints too (checked on a HEAD copy under `drafts/mirror/`). Tree diff: this file plus `system-skill-advisor/runtime/tests/manual-testing-playbook.vitest.ts`, which is another build's path and was not touched here |
| 17c | `briefs/17c-catalog-index-body.md` | pi | 59 | 0 | `sk-doc/feature-catalog/feature-catalog.md` | Diff: lines 18 and 94 only. `--type feature_catalog`: `Total issues: 0`. Tree diff: nothing new. Before dispatch I rewrote both edits to whole lines (the first draft named mid-line fragments as "whole lines") and moved the line numbers to the post-17a file |
| 17b | `briefs/17b-catalog-index-section.md` | pi | 120 | 0 | `sk-doc/feature-catalog/feature-catalog.md` | `cmp` against `drafts/catalog-index.after.md` (all three catalog briefs): identical. `--type feature_catalog`: `Total issues: 0`, exit 0. Tree diff: three new `system-skill-advisor` files from build 019, not touched here. Line number moved from 59 to 60 after 17a before dispatch |

Brief count: 21 dispatched, all exit 0 on the first attempt, no re-dispatch. Devin 9 (01 to 08, 08b), Pi 12 (09 to 17c; 17c ran before 17b; no Devin fallback needed). Every Pi brief was checked with the tree diff, `cmp` against its draft (or a diff against a pre-dispatch copy for 12a and 17a) and `validate_document.py`.

## 5. Gates from the final state

Logs: `final/` and `runs/`.

| # | Result | Evidence |
|---|---|---|
| P1 | PASS | `PATH="$STUB:$PATH" node S --report runs/census --rows-out runs/census/rows.jsonl`: exit 0, empty stderr, 19 hub and source lines, `total prompts=359 unparsed=24 route=239 clarify=3 defer=86 reject=7 clarify_mode=2 clarify_checklist=1 gold_in_alternatives=0`, `corpus: rows=265 none=24 skill_firing=241 mapped=146 no_compiled_hub=95`, `real clarify rate: not measured`, `rows written: 2 with_gold=0`. Canary clarify 1 each on system-deep-loop (`clarify_checklist=1`), cli-external-orchestration and sk-doc (`clarify_mode=1`). `stub/calls.log` never created |
| P2 | PASS | Both rows have `"label":""` (`grep -c` 2 of 2). `--score`, `--score --deem --out runs/gate-deem` and `--score --jev --deem --out runs/gate-both`, stubs first on PATH: each exit 0, `rows: 2 labeled=0 operator=0 committed_gold=0` then `stop: fewer than 30 labeled rows (0 labeled)`. No stub call logged, no out folder created |
| P3 | PASS | `node --test T`: tests 28, pass 28, fail 0, exit 0. Includes `a deem stub that answers the label keeps` (`verdict deem: keep ... p=9.313e-10`) and `a deem stub that answers the first alternative stops on margin` |
| P4 | PASS | `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization'` on S and on T: exit 1 each. `git status --porcelain` before P1 and after P2 differ only by `system-skill-advisor/feature-catalog/feature-catalog.md`, which is build 019's path |
| P5 | PASS | `validate_document.py`, exit 0 and `Total issues: 0` on all nine changed docs (`final/p5.txt`); the playbook root with `--type playbook`, the catalog root with `--type feature_catalog` |
| P6 | PASS | `validate.sh <phase> --strict`: `Errors: 0  Warnings: 0`, `RESULT: PASSED`, exit 0. Phase porcelain unchanged by the run |
| P7 | PASS | See the delta table below |

| Gate | Baseline | Final | Delta |
|---|---|---|---|
| sk-create-skill `node --test` dir | tests 19, pass 18, fail 1 | tests 47, pass 46, fail 1 | +28 new tests, all pass; the same `skill-root-metadata-contract` fleet-list failure |
| sk-create-skill self-run | 10 of 11 exit 0 | 11 of 12 exit 0 | +1 file passing; same file fails |
| sk-doc script suite | 26 PASS, 1 SKIP, exit 0 | 26 PASS, 1 SKIP, exit 0 | none (includes `test_readme_manifest.py` and `test_readme_verdict_parity.py`, both PASS) |
| Playbook package | PASS, scenarios=6, 0 violations | PASS, scenarios=7, 0 violations | +1 scenario (SKL-007) |
| Catalog package | WARN, 6 warn, 0 fail | WARN, 6 warn, 0 fail | none; violation lines byte-identical |
| Drift guard, scoped | 29 files, 2 warnings | 29 tracked files, 2 warnings; with git hidden (`GIT_DIR=/nonexistent-020`) 31 files, the same 2 warnings, 0 on the new files | none |
| `node --check` S and T | n/a | exit 0 each | n/a |

## 6. Generator checks (read-only)

| Generator | Result | Owner |
|---|---|---|
| sk-doc leaf manifest `--check` | `leaf-manifest.json OK (e29b82fc...)`, unchanged; `leaf-aliases.json` is authored input, nothing to regenerate | this phase, nothing to do |
| Hermes `sync-skills-hermes.cjs --check` | exit 1: `DRIFT sk-create-skill` (this phase's SKILL.md edit) and `DRIFT system-skill-advisor` (build 019) | session |
| Trigger index `--check` | exit 1, 7 stale: 3 from this phase (`clarify-default-measurement.md`, `feature-catalog.md`, `changelog/v1.4.0.0.md`), 4 from builds 019 and 024 | session |

## 7. Live runs

- No call to `jev` or to the Deem server (`127.0.0.1:8300`) was made by the orchestrator or any executor; every run used the logging stubs.
- Live Jev run pending the operator's yes, and only after 30 rows carry an operator label: `node .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs --score <labeled rows file> --jev --out <dir>`.
- Deem runs locally, but no Deem run is possible before labels exist: the label gate stops first.
- No labels were written by me or by any model. The phase ends at its label gate.

## 8. Deviations

- The shared-description ` [key]` suffix departs from REQ-006's "verbatim" for the two shared pairs, following 002's precedent (Deem refuses duplicate option descriptions).
- Run outputs went under `scratch/w4-build/runs/` rather than outside the repo as T014 asked; the brief's write scope wins.
- The sk-doc suite skips `test_rename_tooling_fixture_harness.py` at baseline and final alike (it fails in a live tree with concurrent writers).
- Long new docs and the playbook index were placed by `cp` from verified drafts and checked with `cmp`, instead of inline old and new text, to keep briefs under 90 lines.
- Interpretations: p is always the sign-test tail; A, B, W and L count over measured rows only; the `--out` refusal writes one line to stderr.

## 9. Premises checked

- The spec counts 82 playbook files with gold; I counted 83.
- Committed prompts give 3 clarify answers in 359 and 2 mode rows, none with gold. The 30-row gate cannot be reached from committed prompts alone; the operator needs transcripts (`--transcripts`) or hand-picked prompts to fill it.
- 24 playbook scenarios did not parse (sk-code 7, cli-external-orchestration 17). They are counted as `unparsed`, not dropped silently.

## 10. Open items

- P2 candidates, not fixed: `runCensus` reads `result.decision.action` outside its try; a `describeModes` throw in `--score` ends with a stack trace; `jevGate`'s local `path` shadows the module; an unreadable corpus file is skipped with no line.
- The code files' box headers carry an em dash, matching the sk-code header template and 20 of 22 sibling scripts.
- Hermes and trigger-index drift listed in section 6 wait for the session's regeneration.
