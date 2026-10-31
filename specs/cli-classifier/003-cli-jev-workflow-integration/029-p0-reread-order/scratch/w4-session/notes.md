# 029 session notes (feed session-evidence.md)

- Executors: design on Devin; c1 and c2 DeepSeek on Cline; c2f onward on the DeepSeek chain.
- After c2 the check failed 1 of 12: design section 3's `no headroom` case (30 rows, 28 real) cannot pass the label gate first. Ruling 5 and fix brief `c2f` (T only: K 201, 20 negatives, 181 real).
- c2f passed; c3 and c4 passed their checks; c5 failed 1 of 27 with `ReferenceError: stubs is not defined` (a case table reads `stubs` outside the loop). Fix brief `c5f` (T only), then c6 and c7.
- Code done: c5f to c7 on the DeepSeek chain, `Tests 33 passed (33)`.
- Session proofs (`$SP/w4v/029`): default run exit 0 in 1.9 s, stubs uncalled: `registries: 413`, `findings: 2771 (P0 96, P1 1298, P2 1377, other 0)`, `p0 rows: 95 in 37 registries (one 21, two or more 16)`, `labels needed: 20 P0 negatives among 95 P0 rows`, `stop: fewer than 20 labeled P0 negatives`. `--write-label-sheet specs/inside-sheet.jsonl` exit 2 `refusing to write the label sheet inside the repository`, no file; outside the repo exit 0, 95 rows, every `label` empty. `--jev --deem --out` adds only `jev arm skipped: label gate` and `deem arm skipped: label gate`, stubs uncalled, `report.json` written. `--deem` without `--out` exit 2. Key grep exit 1; comment hygiene exit 0 on S and V.
- Proof 2's 19- and 20-negative runs need label files, which the session does not write (parent D4); the tests cover both.
- For review: 1 of the 95 P0 rows comes from a test fixture registry (`deep-review/scripts/tests/fixtures/blocked-stop-session/review/deep-review-findings-registry.json`).
- Docs wait: they share `runtime/` README, changelog, catalog and playbook with 027, so they start after 027 commits, reading the version and IDs then.

## Code review (Pi MiMo, 879 s, exit 0)
- `VERDICT: PASS`, REQ-001 to REQ-010 met, REQ-011 not checked (docs not written yet). SHA-1 over `files-code.txt` `00a0a127efc22948c40969d40e68b85e04396b25` before and after.
- P2 recorded, not chased (parent D5):
  1. The `USAGE` comment says the line prints whenever the run cannot start, but nothing prints it (`--oops` exits 2 with no usage line).
  2. A timed-out or exit-1/4 `jev auth test` stops as `usage error` and logs `unmeasured`, where REQ-009 gives `unmeasured_timeout` past 90 s.
  3. `recorded` ranks only rows carrying a P0 probability, not the registry's own order (REQ-010).
  4. The label-sheet refusal is lexical, not realpath, so a symlink into the tree gets past it.
  5. The test "an unreadable registry exits 2" asserts only the `loadRegistries` throw, never `main`'s exit 2.
  6. A comment cites the id shape `P2-001` as an example. The hygiene checker exits 0 on the script (session run): it explains why ids stay out of the row text, not a pointer to a finding.
- Docs d8 to d15 on Pi MiMo from `docs/facts.txt`, after 028's commit `97200ea481` (versions line: runtime changelog v1.8.0.0, F058, DLR-058, hub version unchanged). Each `STATUS: DONE`; all eight `VALID` on `validate_document.py` (the two indexes with `--type feature_catalog` and `--type playbook`). Runtime playbook package `scenarios=57`, typed census matching; runtime catalog package one new `packet_history_metadata` warning on the F058 line, as every runtime entry carries.

## Doc review (DeepSeek on Cline, 398 s, exit 0)
- `VERDICT: FAIL`, 1 P1 and 6 P2. SHA-1 over `files-docs.txt` `c5ac2b360cdc...` before and after.
- P1: REQ-011 says `SKILL.md`, both READMEs, the changelog, the catalog entry and the playbook entry each name the script, the gate and both switches. The hub sentence on line 111 named only the script. Fix `f1` (MiMo) names the label-gate stop line, `--jev` and `--deem`, `--out <dir>` and the backend gates.
- Fixed although rated P2: a JSDoc comment gave `P2-001` as an example of an id shape. The comment's reason is sound, and the Python hygiene checker exits 0 on it, but the repository bans finding ids in code comments, and an id-shaped literal falls in that class. Fix `c8f` (DeepSeek, the code's author) keeps the reason without the literal. The session had ruled the other way after the code review (P2 6 above); this reverses that ruling.
- The other five P2 repeat the code review's P2 1 to 5 (the `recorded` rank, the `USAGE` comment, the `jev auth test` status, the lexical label-sheet refusal, the unreadable-registry test), recorded, not chased (parent D5).
- Rechecks: Pi MiMo on `c8f` (271 s) `VERDICT: PASS`; DeepSeek on `f1` (73 s) `VERDICT: PASS`, checking all six REQ-011 docs. SHA-1 over the rechecked files `e0dff3fb30fd` before and after. The test file after both: `Tests 33 passed (33)`.
