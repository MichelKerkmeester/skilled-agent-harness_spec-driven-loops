# 028 session evidence: verification, review and commit

The orchestrator session's record for phase 028. The session wrote every brief, ran the proof plan from the final state itself and made the commits. No Claude leaf wrote a file (parent D5). The run-by-run notes are `notes.md` beside this file, and the facts the docs were written from are `docs/facts.txt`.

## 1. Build

- Design and rulings: `../w4-build/design.md` (DeepSeek V4.1 Flash on Cline, 173 lines) and `../w4-build/rulings.md`.
- Code steps c1 to c5 and both code fixes ran on DeepSeek V4.1 Flash through Cline (`--thinking xhigh`), each checked by the test file. The last printed `Tests 28 passed (28)`.
- Docs d1 to d6b ran on Pi `llmgateway/mimo-v2.6-pro` at `high`, each written from the facts file, after 027 committed, since the two phases share `runtime/` files and the hub `SKILL.md`. Ruling 2 set runtime changelog v1.7.0.0, F057 and DLR-057. Ruling 3 left the hub version unchanged.

## 2. Session verification from the final state

The proofs ran against 027's final real report, whose label gate stopped (`$SP/w4v/028-final`), with logging stubs for `jev` and `cli-deem` first on `PATH`.
- The default run exits 0 with one line, `stop: rater report has no confirmed gold`. With `--jev --deem --out <dir>` it prints the same line and creates no `<dir>`. `--jev` without `--out` also exits 0 with that line, since the script makes no call in any mode. The stub logs were never written.
- The three refusals each exit 2 before any output line: no `--rater-report` (`--rater-report <dir> is required`), a missing report (`rater report not found: <path>`) and `--out` equal to the report folder (`--out <dir> would overwrite the rater report: <path>`).
- The script spawns no process: it holds no `spawn` or `child_process`. `git status` outside `specs/` was equal before and after. The key grep exits 1. The Python comment hygiene checker (`sk-code-quality/scripts/check-comment-hygiene.sh`) exits 0 on the script and its test.
- Tests: `score-stop-hint.vitest.ts` prints `Tests 28 passed (28)`.
- Runtime suite from the staged state (`npx vitest run tests/unit/` from `runtime`, leaving out the in-progress test files of 029 and 030), 1,111 s: `Test Files 126 passed (126)`, `Tests 2456 passed (2456)`. After 027's contract fix the suite held 125 files and 2,428 tests, all passing, so this phase adds one file and its 28 tests and no failure. 033's uncommitted edit to `deep-review/SKILL.md` was set aside for the run and the commit, since the contracts and the route manifest hash it.
- All eight docs pass `validate_document.py` (exit 0).

## 3. Cross-family review

Read-only, split by author family. The SHA-1 over each review's files was equal before and after every run.

- **Code, reviewed by Pi MiMo** (396 s, `review-code-pi.md`): `VERDICT: FAIL`, 2 P1 and 2 P2.
  - P1: `requalify: rater changed` printed on every rerun. `main` stored the identity as one `rater` string and read it back through `raterSuffix`, which looks for the rater report's own fields. Fix `c6f` compares the stored `rater` string.
  - P1: the requalify test hand-wrote the stored file in the rater report's shape, so the round trip was untested. Fix `c6g` runs the script three times into one `--out` folder: the first run and an unchanged rerun print no requalify line, and a changed Deem identity prints it before the verdict.
  - Session check: with the old comparison restored in a scratch copy, an unchanged rerun printed the requalify line once. The fixed script printed none.
- **Docs, reviewed by DeepSeek on Cline** (437 s, `review-docs-ds.md`): `VERDICT: PASS`, 1 P2 fixed and 1 recorded.
  - Fixed although rated P2, because the goal asks for docs true to the code: the catalog's gate-stop sentence was unconditional, but the refusals run first, so an ungated report with `--out` naming its own folder exits 2 with the collision line and never prints the stop line. Fix `f1` (MiMo, 170 s) conditions the sentence on the refusals.
- **Rechecks:**
  - Pi MiMo on `c6f` and `c6g` (314 s): `VERDICT: PASS`, both closed.
  - DeepSeek on `f1` (78 s): `VERDICT: PASS`.

P2 findings, recorded, not chased (parent D5):
1. MiMo: the reader exits 2 on a lineage with `lastIteration: null`, a shape the rater writes when a lineage has no state iterations. 027's real report holds 16 lineages, none of them null, so today's run is not hit.
2. MiMo: the injected `env` seam is never read, and `decideVerdict` re-encodes the exported threshold constants as integer forms instead of reading them.
3. DeepSeek: the `--out` collision refusal has no vitest case and no playbook step.

## 4. Generated files and package checks

- `sync-skills-hermes.cjs --check` printed `DRIFT system-deep-loop` (and three other hubs whose edits belong to phases not yet committed). The session regenerated the copies and staged only `.hermes/skills/system-deep-loop/SKILL.md`.
- The three compiled deep command contracts were recompiled from this phase's staged tree (`recompile-contracts.sh`): `[CONTRACT DRIFT] OK commands=3`. Only the hub `SKILL.md` digest changed, `a6598045...` to `dc3f83aa...`.
- Catalog package `system-deep-loop/runtime`: `violations=174`, warn tier. Against 027's 173 the one added finding is a `packet_history_metadata` warning on the new entry's `Feature ID: F057` line, a line every runtime entry carries.
- Playbook package: `PASS ... scenarios=56 ... violations=0 warnings=1`, one scenario more than 027's 55. The warning is the root's `HAND_TYPED_CENSUS`, whose typed count matches the derived one.
- `ci-leaf-manifest-freshness.cjs` `checked=15 fresh=15 failed=0`. README verdict parity `PARITY PASS`. README manifest `manifest=reproducible`.

## 5. Commit

`97200ea481` feat(deep-loop): the script, its test, the eight docs, the Hermes copy and the three recompiled contracts, 14 files staged, not pushed. The pre-commit route-remint gate re-minted `system-deep-loop` and staged both manifests, 16 files in all. After the commit `compiled-route-guard.cjs` prints `system-deep-loop fresh` and `ci-leaf-manifest-freshness.cjs` prints `checked=15 fresh=15 failed=0`. 033's `deep-review/SKILL.md` went back from the scratchpad copy with the same SHA-1 (`40f1164ec420`). The trigger index follows in its own commit.

## 6. Open for the operator

- A rater report whose label gate passed (027's operator gold), then a rerun of this script against it. A live Deem run and a Jev run follow 027's, on the operator's yes.
- The P2 findings above.
