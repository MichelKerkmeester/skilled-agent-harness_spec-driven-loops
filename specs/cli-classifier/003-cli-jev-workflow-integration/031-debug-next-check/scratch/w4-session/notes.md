# 031 session notes (feed session-evidence.md)

- Executors: design on Devin before its quota ran out; code c1 onward on the DeepSeek chain.
- After c2 the check failed 2 of 11: `gate at 29` and `gate at 30` timed out at 30 s. The default run on the real tree took 25.9 s: `minedCorpus` runs two `git grep` passes over all 104,521 tracked files under `specs/` (10.7 s and 10.9 s). Ruling 6 narrows it to one `git grep -cE ... -- 'specs/*.md'` (5.6 s). Fix brief `c2f`.
- For review (P2 candidate): the tests `mined corpus` and the default run assert the real repository's counts (`debug_delegation=1`), so they change when the repository does.
- c3 to c7 on the DeepSeek chain, each check exit 0 until c7. After c7 the check failed 1 of 30: `verdict kill` expects `A=5 B=12 W=0 L=12`, counts that cannot occur together (A - B must equal W - L). Session run in `$SP/w4v/031k` with the test's pick stub: `STUB_PICKS=instrument` prints `verdict deem: stop (margin) K=30 M=30 A=5 B=12 W=5 L=12 F=0 p=0.9755`, and a schedule wrong on every row prints `verdict deem: kill K=30 M=30 A=0 B=12 W=0 L=12 F=0 p=0.0002441`. The script is right and the test's schedule is wrong. Fix brief `c7f` gives the test that schedule.
- Timing: each test spawns S, which runs `minedCorpus` (one `git grep` over `specs/*.md`) on the real repository even with `--fixture`; one run takes about 8 s here and the test file about 207 s. Recorded for the review.
- c7f and c8 on the DeepSeek chain, each check exit 0; the test file ends at `Tests 30 passed (30)`.
- Session proofs from the code's final state (`$SP/w4v/031-proof`, `$SP/w4v/031-p2`): the default run exits 0 in 5 s with `seam: none`, `mined: debug_delegation=1 hypothesis_files=0` and `mined rows: 0`, stubs uncalled; `--fixture` inside the repository exits 2 `refused: fixture path inside the repository`; `--fixture <29 rows> --jev --deem --out <dir>` exits 0 ending `stop: fewer than 30 labeled rows`, stubs uncalled; a 30-row fixture with every `jev_ok` false and `--jev --out` prints `jev arm skipped: payload not accepted` with no stub call; a 30-row fixture with `--deem --out` and a stub backend prints `deem arm skipped: stub backend` after one `cli-deem health`; `--deem` without `--out` exits 2 `--jev or --deem need --out <dir> so every call is recorded`; `git status` equal before and after; key grep exit 1; hygiene exit 0 on S and T.

## Code review (Pi MiMo, exit 0)
- `VERDICT: PASS`, 7 P2. SHA-1 over `files-code.txt` `632fc977575d...` before and after.
- P2 recorded, not chased (parent D5):
  1. `unmeasured_withheld` Jev records carry no `jevVersion`, `provider` or `model`.
  2. The comment "a skipped arm still writes no file" is false: a failed Jev gate still leaves `calls.jsonl` with the withheld records.
  3. `HEALTH_TIMEOUT_MS` is 10,000 where REQ-006 bounds the health check at 2,000 ms (the real client bounds itself at 2 s).
  4. `Number(1n << BigInt(n))` overflows past 1,023 disagreements, so `p=NaN` would print; the verdict itself stays exact.
  5. The verdict line and report column spell `0.6.2` instead of reading `JEV_VERSION`.
  6. Two tests pin a live-repo count (`debug_delegation=1`), against ruling 6.
  7. No test reaches `jev arm skipped: jev not on PATH`, `unmeasured_timeout` or the Jev exit-4 retry.
- Docs on Pi MiMo from `docs/facts.txt` (orchestrator ruling 2 moved the release to 4.6.0.0 and scenario 463, since 026 used 4.5.0.0 and 462): d1 228 s, d2 189 s, d3 184 s, d4 324 s, d5a 669 s, d5b 232 s, d6a 832 s, d6b 240 s. Each `STATUS: DONE`; all eight docs `VALID` on `validate_document.py` (the two index files with `--type feature_catalog` and `--type playbook`).

## Doc review (DeepSeek on Cline, 527 s, exit 0)
- `VERDICT: PASS`, 1 P2. SHA-1 over `files-docs.txt` `fb224a413980...` before and after.
- P2: the changelog's seam bullet leaves out the `runtime/cli/retrieval/fixtures` exclusion, and "once the new script, test and catalog entry (each holding `next_check`) are tracked, the same run prints `seam: <path>` lines".
- Session ruling: the second half is P1, not P2. `seamSearch` greps tracked files for the literal `next_check`, and this phase's script, test and catalog entry hold it. They are untracked today, so the run prints `seam: none`, but the build commit would make every default run list them as caller seams, and every doc stating `seam: none` would be false. Fix `c9f` (DeepSeek) leaves out every path whose name holds `debug-next-check` (`:(exclude,glob)**/*debug-next-check*` and `.../**`, both checked in a scratch repo: the census's own files drop out and `caller.md` stays); `c9g` adds the test "seam skips its own files". The changelog bullet is fixed with the docs that describe the search (fix `f1`, MiMo).

## Fix round after the doc review
- `c9f` and `c9g` on DeepSeek: the test file printed `Tests 31 passed (31)` (session run).
- Recheck of `c9f` and `c9g` by Pi MiMo: `VERDICT: PASS`, the P1 closed. It confirmed every untracked file outside `specs/` that holds `next_check` has `debug-next-check` in its path, so `SEAM_SELF` leaves all of them out, and the default run's first line is `seam: none`.
- Doc fix `f1` on Pi MiMo: the changelog bullet, the catalog paragraph and playbook item 2 now name both exclusions, and the playbook no longer says the scorer's own files appear as hits once tracked. All three `VALID`.
- Recheck of `f1` by DeepSeek on Cline (68 s): `VERDICT: PASS`. SHA-1 over `files-docs.txt` `66b3882823af` before and after.
- Final-state proofs (`$SP/w4v/031f-proof`, stubs first on PATH): the default run exits 0 in 5 s with `seam: none`, `mined: debug_delegation=1 hypothesis_files=0` and `mined rows: 0`; `--deem --out <dir>` and `--jev --out <dir>` print the same three lines and write only `report.json`; `--deem` without `--out` exits 2 with `--jev or --deem need --out <dir> so every call is recorded`, no stdout; stub logs never written; `git status` equal; key grep exit 1; the Python comment hygiene checker exits 0 on the script and its test. The `--fixture` proofs in `$SP/w4v/031-p2` were not rerun: `c9f` changed only the seam pathspec, and the test file covers the gates at 31 of 31.
- Packages: catalog `system-spec-kit` `violations=85` (026's baseline); playbook `PASS ... scenarios=89 ... violations=0 warnings=1` (026's 88 plus one), the warning the pre-existing `PROMPT_UNSYNCED`.
