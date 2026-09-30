# 027 session notes (feed session-evidence.md)

- Executors: c1 Pi MiMo (1,122 s, after Devin's quota ran out); c1f onward DeepSeek on Cline.
- Baseline: runtime `npx vitest run tests/unit/` `Test Files 124 passed (124)`, `Tests 2392 passed (2392)`, started 18:48 before c1 wrote the new test file.
- After c1 the check failed 5 of 6: the fixture's `git commit -qm fixture` hit the machine's global commit-msg hook (`core.hooksPath=~/.config/git/hooks`, "requires a body"). Fix brief `c1f`: pass `-c core.hooksPath=/dev/null`, as 035's test does. The same rule was added to every remaining phase's `rulings.md`.
- c6 check failed 4 of 25 with `ReferenceError: summarizeColumn is not defined`: design section 4 step 6 (Jev arm) calls `summarizeColumn`, which step 8 adds. Not a code fault. c7 and c8 run with no per-step check, then the test file runs once.
- Code done: c7 and c8 on the DeepSeek chain, then the test file once, `Tests 34 passed (34)`, exit 0.
- Session proofs (`$SP/w4v/027`): default run exit 0 in about 1 s, stub logs absent (the census lines are in `docs/facts.txt`); `--jev --deem --out` adds only `stop: fewer than 5 confirmed lineages`, stubs uncalled; the same with a failing Jev auth and a stub Deem backend is identical (the label gate runs before the backend gates); `--jev` without `--out` exit 2; key grep exit 1; comment hygiene exit 0 on S and V; `git status --porcelain` differs only by other phases' files created during the runs.
- Proof 2's past-gate skip lines need an operator gold-reads file, which carries a `labeler` field. The session wrote none (parent D4); the tests cover both skip lines on fixtures.
- Runtime suite from the final code state (`npx vitest run tests/unit/`, excluding 029's and 030's in-progress test files): `Test Files 125 passed (125)`, `Tests 2426 passed (2426)`, exit 0, against the baseline's 124 files and 2,392 tests (+1 file, +34 tests, no failure). Duration 1,151 s under the batch's load.

## Code review (Pi MiMo, 534 s, exit 0)
- `VERDICT: FAIL`, 2 P1 and 2 P2. SHA-1 over `files-code.txt` `1d68cf38a923...` before and after.
- P1 1: `no headroom` never closed an arm. Arms opened on the label gate alone, so a saturated sample with agreeing gold reads still called the backends. The design says a switch then prints `<backend> arm skipped: no headroom`. Fix `c9g` (script) and `c9i` (a test with agreeing reads for all ten lineages).
- P1 2: each sample group was ordered by the path string, where the spec's scope orders it by the SHA-256 of the lineage path. With more than 25 movable lineages (115 on the real tree) the sampled 25 differ. Fix `c9f` (script) and `c9h` (a test with 30 lineages that checks the sampled 25 against the hash order).
- P2 recorded, not chased (parent D5):
  1. C counts only calls behind a full median, so a Jev iteration answered 0, 0, unparseable adds 0 to C and F although `calls.jsonl` holds two `measured` rows.
  2. The planned-calls line counts every iteration record while the arms score only non-`thought` iterations.
- c9f (sample order) and c9g (headroom closes the arms) on the DeepSeek chain. After c9g the check failed 1 of 34: `oversize state is withheld` built five one-iteration lineages where the baseline is right on all five, so the census printed `no headroom` and the fixed script opened no arm (no `calls.jsonl`). The test had passed only because arms ignored headroom. Fix `c9j` gives it the three-iteration shape of the other Deem arm tests, which leaves headroom.
- c9j, c9h and c9i on the DeepSeek chain, each check exit 0; the test file ends at `Tests 36 passed (36)`.
- Final-state proofs after the fixes (`$SP/w4v/027-proof`): the default run exits 0 in 1 s with the same census as before (`lineages: tracked 486 ... sampled 16 inert 4`, baseline `legacy right 5 of 16`, `planned calls: deem 239 jev 718`), stubs uncalled; `--deem --out` and `--jev --out` each add only `stop: fewer than 5 confirmed lineages` (the label gate runs before either backend gate) and write `report.json`; `--deem` without `--out` exit 2; `git status` equal; key grep exit 1; hygiene exit 0 on S and T. The facts file was updated with the test count (36), the SHA-256 sample order and the headroom skip lines before doc step d2 ran.
- Recheck, Pi MiMo: `VERDICT: PASS`, fixes 1 to 3 closed, no new P0 or P1. SHA-1 over the code `7bb3775a02f5...` before and after.
- Doc review, fix and recheck: see `session-evidence.md` section 3. Build commit `709b1078ee`, then fix commit `24473df4fa` for the compiled contracts the `SKILL.md` edit left stale.
