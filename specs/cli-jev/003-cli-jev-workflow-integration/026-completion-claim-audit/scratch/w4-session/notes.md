# 026 session notes (feed session-evidence.md)

## Code review (Pi MiMo, 857 s, exit 0)
- `VERDICT: PASS`. SHA-1 over `files-code.txt` `41bff71d04d3c1b09bfd90527f1c95b3591e11a9` before and after.
- P2 recorded, not chased (parent D5):
  1. The free-text guard runs only over the census object, whose sole strings are row ids, so it cannot fire, and the `deem: found=` line and the verdict lines print without it.
  2. `firstClaimWord` matches substrings, not the pattern's `\b` words ("affixed" counts as `fixed`).
  3. No test runs an arm switch below the label gate or a stop exit, so `deem arm skipped: label gate`, `jev arm skipped: label gate` and the `arm stopped:` lines are untested.
  4. The review brief named a `notes.md` that did not exist then; the runs lived in `docs/facts.txt`. This file now holds them.
- Docs d1 to d6b on Pi MiMo, each `STATUS: DONE`; all eight pass `validate_document.py` (exit 0). Catalog package `system-spec-kit` `violations=85` (the 022 baseline); playbook package `PASS ... scenarios=88 ... violations=0 warnings=1` (baseline 87 scenarios, the one warning pre-existing `PROMPT_UNSYNCED` in `ux-hooks/comment-hygiene-checker-baseline.md`).

## Doc review (DeepSeek on Cline, 422 s, exit 0)
- `VERDICT: FAIL`, 1 P1 and 2 P2. SHA-1 over `files-docs.txt` `c91fedb21683...` before and after.
- P1: the catalog entry said every printed or written string passes the allowlist, but the code checks only the census object, once, before the first line; later lines such as the Deem health line never pass it (the code review's P2 1 names the same gap from the code side). Fix `f1` (MiMo) states what the code does.
- P2 fixed because the goal asks for docs true to the code: the scripts README tree line said "Zero-call audit" without "by default". Fix `f2` (MiMo).
- P2 recorded, not chased: no test covers a label-gate skip or an `arm stopped:` exit (the code review's P2 3 too).
- Fixes `f1` and `f2` (MiMo), each `STATUS: DONE`; the session read both edits and ran `validate_document.py` on each (exit 0).
- Final-state proofs (`$SP/w4v/026-final`): code SHA-1 `41bff71d04d3...` still equal to the reviewed set; `--rows .skilled/hooks/goal/lib/verifier-labeled-set.jsonl` exit 0 ending `stop: fewer than 30 labeled rows`, stubs uncalled; `--deem --out` with a stub backend adds only `deem arm skipped: stub backend`; `--jev --out` with auth exit 3 adds only the identity line and `jev arm skipped: no credential`; `--deem` without `--out` exit 2 `--deem needs --out <dir> so every call is recorded`; `git status` equal; `completion-claim-audit.vitest.ts` `Tests 23 passed (23)`.
- Recheck, DeepSeek (60 s): `VERDICT: PASS`, both closed, no new P0 or P1. SHA-1 over the two docs `8d3f2f253d20...` before and after.
