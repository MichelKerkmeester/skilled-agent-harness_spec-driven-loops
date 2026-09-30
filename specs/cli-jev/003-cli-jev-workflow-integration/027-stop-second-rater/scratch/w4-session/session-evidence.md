# 027 session evidence: verification, review and commit

The orchestrator session's record for phase 027. The session wrote every brief, ran the proof plan from the final state itself and made the commits. No Claude leaf wrote a file (parent D5). The run-by-run notes are `notes.md` beside this file, and the facts the docs were written from are `docs/facts.txt`.

## 1. Build

- Design and rulings: `../w4-build/design.md` (Devin `deepseek-v4-1-flash-max`, 503 s) and `../w4-build/rulings.md`.
- Code step c1 ran on Pi `llmgateway/mimo-v2.6-pro` (1,122 s) after Devin's daily quota ran out. Its check failed 5 of 6: the fixture's `git commit` hit the machine's global commit-msg hook. Fix `c1f` passes `-c core.hooksPath=/dev/null`, and the same rule went into every remaining phase's `rulings.md`.
- Code steps c2 to c8 and every fix ran on DeepSeek V4.1 Flash through Cline (`--thinking xhigh`). Step c6's check failed on `summarizeColumn`, which design step 8 adds, so c7 and c8 ran without a per-step check and the test file ran once after c8: `Tests 34 passed (34)`.
- Docs d1 to d6b ran on Pi MiMo at `high`, each written from the facts file.

## 2. Session verification from the final state

Logging stubs for `jev` and `cli-deem` were first on `PATH`, and every output went to the session scratchpad (`$SP/w4v/027-proof`).
- The default run exits 0 in about 1 s. It prints `lineages: tracked 486 ... sampled 16 inert 4`, the baseline `legacy right 5 of 16`, `planned calls: deem 239 jev 718` and `stop: fewer than 5 confirmed lineages`. The stub logs were never written.
- `--deem --out <dir>` and `--jev --out <dir>` each add only `stop: fewer than 5 confirmed lineages`, since the label gate runs before either backend gate, and each writes only `report.json`.
- `--deem` without `--out` exits 2 with `--deem needs --out <dir> so every call is recorded`, before any call.
- `git status --porcelain` was equal before and after. The key grep exits 1. The Python comment hygiene checker (`sk-code-quality/scripts/check-comment-hygiene.sh`) exits 0 on the script and its test.
- The past-gate skip lines need an operator gold-reads file. The session wrote none (parent D4), and the tests cover both skip lines on fixtures.
- Tests: `score-stop-rater.vitest.ts` prints `Tests 36 passed (36)`.
- Runtime suite from the committed state (`npx vitest run tests/unit/` from `runtime`, leaving out the in-progress test files of 028, 029 and 030), 1,131 s: `Test Files 2 failed | 123 passed (125)`, `Tests 5 failed | 2423 passed (2428)`. The baseline before any wave-4 file was 124 files and 2,392 tests, all passing. The five failures are this phase's own regression, below in section 5, and the fix commit closes them.
- The code's SHA-1 is still `7bb3775a02f5...`, the set the code recheck read.

## 3. Cross-family review

Read-only, split by author family. The SHA-1 over each review's files was equal before and after every run.

- **Code, reviewed by Pi MiMo** (534 s, `review-code-pi.md`): `VERDICT: FAIL`, 2 P1 and 2 P2. MiMo wrote c1 and DeepSeek the rest, so MiMo reviewed the file as a whole with DeepSeek's steps named.
  - P1: `no headroom` never closed an arm. Arms opened on the label gate alone, so a saturated sample would still call the backends. Fix `c9g` closes both arms with `<backend> arm skipped: no headroom`, and `c9i` pins it with agreeing reads for all ten lineages.
  - P1: each sample group was ordered by the path string, where the spec orders it by the SHA-256 of the lineage path. With more than 25 movable lineages (115 on the real tree) the sampled 25 differ. Fix `c9f` sorts by the hash, and `c9h` checks 30 lineages against the hash order.
  - After `c9g` the test `oversize state is withheld` failed: it had passed only because arms ignored headroom. Fix `c9j` gives it the three-iteration shape of the other Deem arm tests.
- **Docs, reviewed by DeepSeek on Cline** (257 s, `review-docs-ds.md`): `VERDICT: FAIL`, 1 P1 and 2 P2.
  - P1: the playbook scenario and its index said 34 passing tests in three places. The suite prints 36. Fix `f1` (MiMo, 108 s).
  - Fixed although rated P2, because the goal asks for docs true to the code: the catalog said ties keep `legacy`, while `pickBaseline` gives a tie to the first of `legacy`, `sources` and `recorded` in that order. Also in `f1`.
- **Rechecks:**
  - Pi MiMo on c9f to c9j (404 s): `VERDICT: PASS`, all closed.
  - DeepSeek on `f1` (51 s): `VERDICT: PASS`. It ran the test file (`Tests 36 passed (36)`) and read `pickBaseline`.

P2 findings, recorded, not chased (parent D5):
1. MiMo: C counts only calls behind a full median, so a Jev iteration answered 0, 0, unparseable adds 0 to C and F although `calls.jsonl` holds two `measured` rows.
2. MiMo: the planned-calls line counts every iteration record while the arms score only non-`thought` iterations.
3. DeepSeek: the "unpublished lineage is withheld from jev" test asserts the helpers only and never runs `runJevArm`, so the arm's skip of withheld paths is untested.

## 4. Generated files and package checks

- `sync-skills-hermes.cjs --check` first printed `DRIFT system-deep-loop`. The session regenerated it (`Wrote 1 of 72`, only `.hermes/skills/system-deep-loop/SKILL.md` changed), then `PASS: 72 Hermes skill copies in sync`.
- Catalog package `system-deep-loop/runtime`: `violations=173`, warn tier. Against HEAD the only added finding is one `packet_history_metadata` warning on the new entry's `Feature ID: F056` line, a line all 55 runtime entries carry.
- Playbook package: `PASS ... scenarios=55 ... violations=0 warnings=1`, one scenario more than HEAD's 54. The one warning is `HAND_TYPED_CENSUS` on the root's census line, whose typed count matches the derived one.
- `ci-leaf-manifest-freshness.cjs` `checked=15 fresh=15 failed=0`. README verdict parity `PARITY PASS`. README manifest `manifest=reproducible`.

## 5. Commit

`709b1078ee` feat(deep-loop): the script, its test, the eight docs and the Hermes copy, 11 files, not pushed. The pre-commit route-remint gate re-minted `system-deep-loop` and staged both manifests, since the hub `SKILL.md` is a routing input. After the commit `compiled-route-guard.cjs` exits 0 and `ci-leaf-manifest-freshness.cjs` prints `checked=15 fresh=15 failed=0`. The trigger index follows in its own commit.

- **Regression found after the commit, and fixed.** The three compiled deep command contracts (`.skilled/commands/deep/assets/compiled/deep-*.contract.md`) record the hub `SKILL.md` by SHA-256. This phase's `SKILL.md` sentence left them at the old digest `357e168254b1...` while the commit holds `a659804524fa...`. So `check-contract-drift.vitest.ts` failed 2 tests and `render-command-contract.vitest.ts` 3, the suite's five failures above. The session's pre-commit checks had run only this phase's test file, and the earlier whole-suite run came before the docs. The session recompiled the three contracts with the repository's own `compile-command-contracts.cjs --write` against an export of the commit's tree, not the working tree, which held other phases' uncommitted edits. Only the digest line changed in each. In that export `check-contract-drift.cjs` printed `[CONTRACT DRIFT] OK commands=3`, exit 0, and the two test files printed `Tests 42 passed (42)`. Fix commit `24473df4fa`, 3 files, not pushed. Every later commit that stages a hub or deep-review `SKILL.md` recompiles the contracts from its staged tree first.

## 6. Open for the operator

- At least 5 confirmed lineages in a gold-reads file (`--gold-reads <file>`), then a live Deem run, and a Jev run on the operator's yes.
- The P2 findings above.

## 7. Closure

DeepSeek on Cline (679 s, exit 0) edited the phase docs and re-derived `graph-metadata.json`. The session reran the gates from the final state:
- `repair-derived.cjs` (dry run): `repairable=0`.
- `validate.sh --strict`: `RESULT: PASSED`, with Errors 0 and Warnings 0.
- `check-goal.cjs`: `RESULT: PASSED (5/5 checks)`.
- `goal.cjs packet`: `packet_durable_chars=3956`.

Status is `Complete` at the label-gate stop. T017 stays `[B]` for the operator.
