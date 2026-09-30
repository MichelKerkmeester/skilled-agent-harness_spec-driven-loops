# 028 session notes (feed session-evidence.md)

- Design on the DeepSeek chain (Cline), with the batch rules added to the brief (step order, reachable gate cases, git maxBuffer, fast real-tree run, hooksPath, Jev first, no real-repo counts). 173 lines, 6 sections. Rulings in `../w4-build/rulings.md`.
- Baseline for the runtime suite is 027's (`tests/unit/` 124 files, 2,392 tests, before any wave-4 test file).
- Code c1 to c5 on the DeepSeek chain, each checked by the test file.
- Code done: c1 to c5 on the DeepSeek chain, each check exit 0, the last `Tests 28 passed (28)`.
- Session proofs (`$SP/w4v/028`), against 027's real report (`$SP/w4v/027/c2a-out/report.json`, label gate stopped): the default run exit 0 with one line, `stop: rater report has no confirmed gold`, stubs uncalled; with `--jev --deem --out <dir>` the same line, stubs uncalled, no `<dir>` created (ruling Q4). No `--rater-report` exit 2 `--rater-report <dir> is required`; a missing report exit 2 `rater report not found: <path>`; `--out` equal to the report folder exit 2 `--out <dir> would overwrite the rater report: <path>`. The script spawns no process (no `spawn` or `child_process` in it); key grep exit 1; comment hygiene exit 0 on S and V.
- Docs wait: they share `runtime/` files and the hub `SKILL.md` with 027, so they start after 027 commits.

## Code review (Pi MiMo, 396 s, exit 0)
- `VERDICT: FAIL`, 2 P1 and 2 P2. SHA-1 over `files-code.txt` `c2e01e3cbe9fd4d233172e0a714165ac57379f44` before and after.
- P1 1: `requalify: rater changed` printed on every rerun, since `main` stored the identity as one `rater` string and read it back through `raterSuffix`, which looks for the rater report's own fields. Fix `c6f` (DeepSeek on Cline, 20 s): compare the stored `rater` string.
- P1 2: the requalify test hand-wrote the stored file in the rater report's shape, so the round trip was untested. Fix `c6g` (DeepSeek on Cline, 23 s): one test runs the script three times into one `--out` folder (first run and unchanged rerun print no requalify line, a changed Deem identity prints it before the verdict).
- After both: `npx vitest run tests/unit/score-stop-hint.vitest.ts` `Tests 28 passed (28)`. Session check in `$SP/w4v/028rt`: with the old comparison restored in a scratch copy, an unchanged rerun printed the requalify line (count 1); the fixed script printed none (count 0).
- P2 recorded, not chased (parent D5):
  1. The reader exits 2 on a lineage with `lastIteration: null`, a shape the rater writes when a lineage has no state iterations.
  2. The injected `env` seam is never read, and the exported threshold constants are unused by `decideVerdict`, which re-encodes the rule as integer forms.
  Session check on P2 1: 027's real report (`$SP/w4v/027/c2a-out/report.json`) holds 16 lineages, none with `lastIteration: null`, so the real run is not hit today.
- Proofs rerun against 027's final report (`$SP/w4v/028-final`), since 027's sample order changed after this phase's first proofs: 027 with `--deem --out <dir>` stops at `stop: fewer than 5 confirmed lineages`; this script on that report prints only `stop: rater report has no confirmed gold`, exit 0, with or without `--jev --deem --out <dir>` (no `<dir>` created); the four exit-2 cases hold; `--jev` without `--out` exits 0 with the same stop line, since the script makes no call in any mode; stub logs absent; `git status` outside `specs/` equal. Tests `28 passed (28)`; key grep exit 1; the Python comment hygiene checker exits 0 on the script and its test.
- Docs on Pi MiMo from `docs/facts.txt` (ruling 2: runtime changelog v1.7.0.0, F057, DLR-057, read after 027's commit; ruling 3: hub version unchanged): d1 504 s, d2 232 s, d3 137 s, d4 286 s, d5a 267 s, d5b 641 s, d6a 966 s, d6b 499 s. Each `STATUS: DONE`; all eight docs `VALID` on `validate_document.py` (the two index files with `--type feature_catalog` and `--type playbook`).

## Doc review (DeepSeek on Cline, 437 s, exit 0)
- `VERDICT: PASS`, 1 P2. SHA-1 over `files-docs.txt` `d65d5906ebf9...` before and after.
- P2, fixed because the goal asks for docs true to the code: the catalog's gate-stop sentence was unconditional, but the refusals run first, so an ungated report with `--out` naming its own folder exits 2 with the collision line and never prints the stop line (the reviewer ran it outside the repository). Fix `f1` (MiMo) conditions the sentence on the refusals.
- P2 recorded, not chased (parent D5): the `--out` collision refusal has no vitest case and no playbook step.
