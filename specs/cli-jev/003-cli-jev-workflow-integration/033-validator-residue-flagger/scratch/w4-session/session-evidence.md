# 033 session evidence: verification, review and commit

The orchestrator session's record for phase 033. The session wrote every brief, ran the proof plan from the final state itself and made the commits. No Claude leaf wrote a file (parent D5). The run-by-run notes are `notes.md` beside this file, and the facts the docs were written from are `docs/facts.txt`.

## 1. Build

- Design and rulings: `../w4-build/design.md` (Devin `deepseek-v4-1-flash-max`) and `../w4-build/rulings.md`.
- Code step c1 ran on Pi `llmgateway/mimo-v2.6-pro` (1,707 s) after Devin's daily quota ran out. Steps c2 to c6 ran on DeepSeek V4.1 Flash through Cline (`--thinking xhigh`), each checked by the test file.
- The session's first proof failed: the default run on the real tree exited 1, because `git ls-files -z` prints 15.7 MB here and `spawnSync` stops at its 1 MB default buffer. The tests passed only because their temporary repositories are small. Fix `c7f` (DeepSeek) raises the buffer, as the 035 sibling does, and adds a test that reads a 2,000,000-character tracked file.
- The default run then took about 6 minutes and printed 928 KB. Ruling 6 counts a table as skipped only when it holds a `P0` to `P2` cell, and resolves a file's reviewed commit only when the file has rows. Fixes `c7g` and `c7h` (DeepSeek).
- Docs d8a to d10h ran on Pi MiMo at `high`, each written from the facts file.
- Deviation from design step 10: the design syncs `SKILL.md`'s `version:` with `frontmatter-version.mjs apply --skill deep-review`. Its dry run matched 0 files, and `apply` rewrites every in-scope doc's version from history, far wider than this phase. Step `d10h` set `version: 1.11.0.37` by hand, the convention the skill already kept (1.11.0.36 beside `v1.11.0.36.md`).

## 2. Session verification from the final state

Logging stubs for `jev` and `cli-deem` were first on `PATH`, and every output went to the session scratchpad (`$SP/w4v/033f-proof`). These runs used the final code, after `c8f` and `c8g`.
- The default run exits 0 in 134 s and prints 90,510 bytes: `census: commit=c91420429b7e files=5862 tables=115 rows=796 skipped=525`, the severity, dimension and header lines, `resolvable: correctness=0 traceability=7 refused=125 dropped=664`, `margin: 0.10`, the keep rule, the two instruction lines with their SHA-256 digests and `stop: fewer than 100 labeled rows`, plus 525 `census skipped:` lines. The stub log was never written. The counts equal the run before `c8f`, since the index and HEAD held the same review files.
- `--deem --out <dir>` with a stub backend adds only `deem arm skipped: stub backend` after one `cli-deem health` call. `--jev --out <dir>` with `auth status` exiting 3 adds only the identity line and `jev arm skipped: no credential` after `jev --version` and `jev auth status --provider official`. Neither writes a file in `<dir>`.
- `--deem` without `--out` exits 2 with `--jev and --deem need --out <dir> so every call is recorded`, before any call and with no stdout.
- `--draw --seed 20260929` exits 2 in 137 s with `draw needs 25 resolvable rows in correctness, found 0`, writes no file and calls no stub. Today's corpus has no correctness finding whose location resolves, so no labels file can be drawn from it.
- `git status --porcelain` was equal before and after. The key grep exits 1. The Python comment hygiene checker exits 0 on the script and its test.
- Tests: `node --test` on `deep-review/scripts/tests/` prints `tests 37`, `pass 37`, `fail 0`, the baseline's 1 plus this phase's 36.
- Runtime suite with the staged state (`npx vitest run tests/unit/` from `runtime`, leaving out the in-progress test files of 029 and 030), 1,114 s: `Test Files 1 failed | 125 passed (126)`, `Tests 1 failed | 2455 passed (2456)`. The one failure is `fanout-run.vitest.ts`, "resumes a future checkpoint before dispatching lineages" (`expected -1 to be greater than or equal to 0`). The test writes a checkpoint due 800 ms after its own clock and then spawns a child, so under load the child starts after that moment and logs no `resume_waiting` event. The suite ran beside three model queues. The same file run alone passed 3 of 3 (`Tests 154 passed (154)` each), 028's suite run passed it, and this phase touches no fan-out code, so the session records it as a timing flake, not a regression.

## 3. Cross-family review

Read-only, split by author family. The SHA-1 over each review's files was equal before and after every run.

- **Code, reviewed by Pi MiMo** (837 s, `review-code-pi.md`): `VERDICT: PASS`, 3 P2. MiMo wrote c1, so it reviewed DeepSeek's steps c2 to c7h.
- **Docs and step c1, reviewed by DeepSeek on Cline** (1,064 s, `review-docs-ds.md`): `VERDICT: FAIL`, 2 P1 and 4 P2.
  - P1: a review file in the git index but not at HEAD aborted the run. `trackedFiles` listed the index (`ls-files`) while every read is `git show HEAD:<path>`. Fixed at the source: `c8f` (MiMo, as c1's author) lists HEAD's tree (`git ls-tree -r -z --name-only HEAD`), so a file staged for deletion also stays in. `c8g` (MiMo) adds the test `staged review file`.
  - P1: the Hermes copy of the deep-review `SKILL.md` was not regenerated. The session regenerates every copy at commit (section 4).
  - Fixed although rated P2, because the goal asks for docs true to the code: the catalog leaf said every run prints the margin, the keep rule and the questions, which `--draw` does not, and the playbook leaf's `version:` was 1.11.0.37 where a new leaf takes 1.11.0.0. Fix `f1` (MiMo, 187 s) corrects both. It also rewrites "tracked" as HEAD's tree in the catalog leaf and the changelog, because of `c8f`.
- **Recheck:** DeepSeek on `c8f`, `c8g` and `f1` (254 s): `VERDICT: PASS`, the P1 and both P2 closed. It ran the test file (`tests 36`, `pass 36`, `fail 0`).
- **Session finding after the reviews:** the playbook package validator printed `CENSUS_MISMATCH manual-testing-playbook.md:31`: the index still said 55 scenarios (39 in the first 7 categories) where the tree now holds 56, and the catalog overview still said `Review dimensions | 4 features` where the folder holds 5. HEAD's counts matched HEAD's tree, so the gap was this phase's. Fix `f2` (MiMo, 247 s) sets 56, 40 and 5. Recheck, DeepSeek (131 s): `VERDICT: PASS`.

P2 findings, recorded, not chased (parent D5):
1. MiMo and DeepSeek: `labelGate` completes only at exactly 100 labeled rows, so a hand-edited file with 101 prints the stop line. `--draw` always writes 100, and the catalog says "exactly 100".
2. MiMo: the unmeasured-row exclusion is never driven through an arm. The "2 of 10 rows unmeasured" case hand-feeds the counts.
3. MiMo and DeepSeek: `parseArgs`' error branches, `readJsonl`'s corrupt-line throw and a run with both switches have no test, and `censusLines`' format is only prefix-checked.
4. DeepSeek: the deep-review `README.md` frontmatter says 1.11.0.36, at HEAD too, so the drift predates this phase.
5. Session: the default run still reads each of the 5,862 review files with one `git show`, about 1 min 48 s.

## 4. Generated files and package checks

- `sync-skills-hermes.cjs` regenerated the deep-review copy. The session staged `.hermes/skills/deep-review/SKILL.md` only.
- The three compiled deep command contracts were recompiled from this phase's staged tree (`recompile-contracts.sh`): `[CONTRACT DRIFT] OK commands=3`, and only `deep-review.contract.md` changed, since it alone hashes `deep-review/SKILL.md`.
- Catalog package `system-deep-loop/deep-review`: `violations=101`, HEAD's count.
- Playbook package: `PASS ... scenarios=56 ... violations=0 warnings=3`. HEAD held 55 scenarios. The three warnings are the advisory result-persistence marker, `HAND_TYPED_CENSUS` (typed 56, derived 56) and a pre-existing `PROMPT_UNSYNCED` on `graph-events-review.md`.
- `ci-leaf-manifest-freshness.cjs` `checked=15 fresh=15 failed=0`. README verdict parity `PARITY PASS`. README manifest `manifest=reproducible`.

## 5. Commit

`c13e968a58` feat(deep-review): the script, its test, the nine docs, the Hermes copy and the recompiled deep-review contract, 13 files, not pushed. The staged set passed the key grep (exit 1). The pre-commit route-remint gate re-minted `system-deep-loop`, and its manifests came out unchanged. After the commit `compiled-route-guard.cjs` lists every hub fresh.

029's uncommitted edit to the hub `SKILL.md` was set aside for the suite and the commit, since the contracts and the route manifest hash that file, and restored afterward with the same SHA-1 (`a959b7f8f00f`). The trigger index follows in its own commit.

## 6. Open for the operator

- A corpus with at least 25 resolvable correctness rows, then `--draw` and 100 operator labels, then a live Deem run, and a Jev run on the operator's yes. Today's tree has 0 resolvable correctness rows, so the draw exits 2 naming the shortfall.
- The P2 findings above.
