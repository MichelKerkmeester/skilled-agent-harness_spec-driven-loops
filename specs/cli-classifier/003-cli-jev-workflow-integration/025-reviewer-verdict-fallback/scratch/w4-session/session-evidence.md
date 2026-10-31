# 025 session evidence: verification, review and commit

The orchestrator session's record for phase 025. The session wrote every brief, ran the proof plan from the final state itself and made the commits. No Claude leaf wrote a file (parent D5). The run-by-run notes are `notes.md` beside this file.

## 1. Build

- Design and rulings: `../w4-build/design.md` and `../w4-build/rulings.md`.
- Code steps c1 to c5 and the fixture fix c1b ran on Devin `deepseek-v4-1-flash-max`. Devin's daily quota ran out at step c6 before it wrote anything. Pi `llmgateway/mimo-v2.6-pro` wrote c6, the zero-call `main` (1,548 s). Steps c6f to c10 ran on DeepSeek V4.1 Flash through Cline, each `STATUS: DONE` with the test file's check at exit 0.
- After c6 the check failed 4 of 16: `main([])` exited 2 with `ENOENT`. The shipped profile names `fixtureDir` relative to the repository, and `loadFixtureCases` tried only the working directory and the profile's folder, so it worked only from the repository root. Fix `c6f` tries the repository root between the two. This deviates from design section 2, which said to resolve paths as `reviewer-scorer.cjs` does. The new order is a superset of the sibling's, so any path the sibling resolves still resolves the same way.
- Docs d11 to d19 ran on Pi MiMo, each written from a facts file the session built from its own runs (`docs/facts.txt`).

## 2. Session verification from the final state

`$SP/w4v/proof.sh 025`, with logging stubs for `jev` and `cli-deem` first on `PATH` and every output in the session scratchpad.
- The default run exits 0 and prints `fixture cases: 8 hits: 8 misses: 0`, the two baselines, the keep rule and `stop: fewer than 12 labeled regex-miss outputs`. The stub log was never written.
- `--deem --out <dir>` against a stub health reporting backend `stub` exits 0 and adds only `deem arm skipped: stub backend`.
- `--jev --out <dir>` with `auth status` exiting 3 exits 0 and adds only the identity line and `jev arm skipped: no credential`. Each `--out` folder holds only `report.json`, which the spec's file table allows.
- `--deem` without `--out` exits 2 with `--deem needs --out <dir> so every call is recorded`, before any call.
- `git status --porcelain` was equal before and after. The key grep exits 1. The comment hygiene checker exits 0 on the script and its test.
- Tests: `verdict-fallback.vitest.ts` 31 of 31. `npx vitest run model-benchmark/tests/` from `deep-improvement/scripts` prints `Test Files 15 passed (15)` and `Tests 236 passed (236)`. HEAD before this phase had 14 files and 205 tests.
- The whole deep-improvement suite prints `43 failed | 395 passed (438)`. Its 46 FAIL names are identical to 024's baseline list, so this phase adds no failure.

## 3. Cross-family review

Read-only, split by author family. The SHA-1 over each review's files was equal before and after every run.

- **Code, reviewed by Pi MiMo** (871 s, `review-code-pi.md`): `VERDICT: FAIL`, 1 P1 and 3 P2.
  - P1: `calls.jsonl` records kept `pick` but dropped the picked key's probability, which REQ-009 takes from phase 017's REQ-008.
  - Fix `c11f` (DeepSeek) adds `pickProb` to every record: the probability from `answers.answer.probabilities`, else null.
  - Fix `c11g` pins it in the tests. The Deem stub now answers with a probability of 0.9, the Jev stub with none.
  - Session ruling: 017 also logs a `none` probability, but this script's three options (pass, fail, block) hold no `none` key, so there is nothing to log for it.
- **Docs and step 6, reviewed by DeepSeek on Cline** (354 s, `review-docs-ds.md`): `VERDICT: FAIL`, 2 P1 and 2 P2.
  - P1: `lib/README.md` called the new script the folder's single entrypoint, but `reviewer-scorer.cjs` also runs from the command line.
  - P1: its `Imports` row called `sweep-reporter.cjs` the one intra-lib edge, but the new script requires `./reviewer-scorer.cjs`.
  - Fix `f1` (MiMo) corrects both rows.
- **Fixed although rated P2**, because the goal asks for docs true to the code:
  - DeepSeek: the playbook's section 15 lead list and its Model-Benchmark Mode cross-reference row left out the new entry. Fix `f2` (MiMo).
  - Session: the catalog package validator printed 37 warnings for `system-deep-loop/deep-improvement`. One was new, `root_leaf_description_mismatch` on `reviewer-verdict-fallback.md`. Fix `f3` (MiMo) set the root description to the entry's frontmatter, and the package is back to `violations=36`, none of them in this phase's files.
- **Rechecks:**
  - Pi MiMo on `c11f` and `c11g` (106 s): `VERDICT: PASS`. The P1 is closed and the `none` ruling agreed.
  - DeepSeek on `f1` to `f3`: `VERDICT: PASS`, all four closed.

P2 findings, recorded, not chased (parent D5):
1. MiMo: the `USAGE` comment says the line prints when the run cannot start, but no path prints it. The session had flagged the same line before the review.
2. MiMo: the Jev version gate reads only the first stdout line, where REQ-006 asks for exactly `jev 0.6.2`.
3. MiMo: the test "a bad label exits 2 naming the row" asserts only the parser's throw, never `main`'s exit 2.
4. DeepSeek: the deep-improvement `README.md` frontmatter stays at 1.17.0.38 and the playbook root at 1.17.0.44, while the release is 1.19.0.0. The drift predates this phase.

## 4. Generated files and package checks

- `sync-skills-hermes.cjs --check`: `PASS: 72 Hermes skill copies in sync`. The deep-improvement copy carries the version change.
- Catalog package `system-deep-loop/deep-improvement`: `violations=36`, none in this phase's files.
- Playbook package: `PASS ... scenarios=55 ... violations=0 warnings=1`. The one warning is the pre-existing `PROMPT_UNSYNCED` on MB-R01.
- `ci-leaf-manifest-freshness.cjs` `checked=15 fresh=15 failed=0`. README verdict parity `PARITY PASS`. README manifest `manifest=reproducible`. `compiled-route-guard.cjs` exit 0, all hubs fresh.

## 5. Commit

`d657558a2e` feat(deep-improvement): the script, its test, the nine docs and the Hermes copy, 12 files, not pushed. The pre-commit route-remint gate re-minted `system-deep-loop`. The manifests came out unchanged, and after the commit `compiled-route-guard.cjs` exit 0 and `ci-leaf-manifest-freshness.cjs` `checked=15 fresh=15 failed=0`. The trigger index follows in its own commit.

## 6. Open for the operator

- At least 12 labeled regex-miss outputs (`--outputs <file>`) with each verdict present, then a live Deem run, and a Jev run on the operator's yes.
- The P2 findings above.

## 7. Closure

DeepSeek on Cline (622 s, exit 0) edited the phase docs and re-derived `graph-metadata.json`. The session reran the gates from the final state:
- `repair-derived.cjs` (dry run): `repairable=0`.
- `validate.sh --strict`: `RESULT: PASSED`, with Errors 0 and Warnings 0.
- `check-goal.cjs`: `RESULT: PASSED (5/5 checks)`.
- `goal.cjs packet`: `packet_durable_chars=3403`.

Status is `Complete` at the label-gate stop. T016 and T017 stay `[B]` for the operator.
