# Remediation Log - Deep Review Session 2026-06-10T06:19:24Z

All 24 active findings from `review-report.md` were remediated or formally dispositioned on 2026-06-10. Commits: Barter `9d4525a`, Public `64fa6dcbdf`.

## Correction to the synthesis

Remediation re-read the iteration-009 severity table and found the synthesis had understated one finding: **R1-P1-001 was KEPT as P1 for the Barter deals instance** ("make_worktree() returns wrong child path; --run mode completely broken for deals loop") while iteration 10 closed only the Copywriter half. Verified real: the deals port returned `<worktree>/Copywriter`. Fixed first, with a live worktree mechanics test proving make/cleanup now work for both packagings.

## Disposition table

| Finding | Disposition | Where |
|---|---|---|
| R1-P1-001 (deals half) | FIXED (P1) - make_worktree returns the packaging root | deals loop.py |
| R1-P1-002 / R2-P2-002 | Already remediated - readScoreDelta carries the reconciled dual-shape contract | promote-candidate.cjs (no change) |
| R1-P2-001 + R4-P2-005 | FIXED - stale Copywriter docstrings | deals gates.py, derive.py, hvr_lint.py |
| R1-P2-002 | Already remediated - loop-host comment states the Lane C analogy explicitly | loop-host.cjs (no change) |
| R1-P2-003 | ACCEPTED-BY-DESIGN - lock TOCTOU window is fail-safe (O_EXCL single winner) | documented |
| R1-P2-004 | FIXED - invalid self_score_pattern now skips the phantom-gap metric with a warning (length refusal already existed) | run-benchmark.cjs |
| R1-P2-005 | FIXED - polish selection uses an explicit lambda + comment | both loop.py + template |
| R2-P2-001 | FIXED - sh double-quote escaping for harness instructions rendered into run.sh | init_packaging.py |
| R3-P1-001 (downgraded) + R3-P2-005 + R4-P2-003 | FIXED - dead schema fields removed; prelude-key validation added (immediately caught a real example-config inconsistency: a project-full prelude without a declared variant) | schema, example, init_packaging.py |
| R3-P2-001 | FIXED - LOOP_SKIP_PROBE documented | loop_contract.md |
| R3-P2-002 + R7-P2-002 | FIXED - promote_skip event documented | loop_contract.md |
| R3-P2-003 + R7-P2-001 | FIXED - wording corrected to "9 attacks, 10 checks" across operator guide, teachings, catalog, playbook, scaffolder output | 5 surfaces |
| R3-P2-004 | FIXED - T6 attributes both fixture-lint.cjs and the loop's lint_held_out() | guardrails_teachings.md |
| R4-P2-001 + R4-P2-002 + R4-P2-006 | FIXED (operational) - kit_version 1.1.0 + re-render diff procedure + template-as-source maintenance model documented; guardrail fixes landed in kit AND instances together this change | operator_guide.md, schema, example |
| R4-P2-004 | FIXED - phantom tokens removed from schema docs | schema |
| R5-P2-001 | FIXED - per-pattern ignorecase, live parity (em dash/currency/semicolon case-sensitive) | lint template + example config |
| R5-P2-002 | FIXED - gauntlet template A5 threshold >= 3 | gauntlet template |
| R5-P2-003 | FIXED - rubric scoped to anchored frozen subset via RUBRIC_FROZEN_FILES | regrade template + scaffolder |
| R5-P2-004 | FIXED - benchmark_variant_preludes keys validated against fixtures.variants | init_packaging.py |
| R5-P2-005 | ACCEPTED - generic file-walking in gauntlet template is intentional generality | documented here |
| R5-P2-006 | PARTIAL - --check-only renders to temp; full atomic-move on real dest deferred (idempotent re-run remains the recovery) | noted |
| R8-P2-001 | FIXED - HELD_OUT included in the resume config hash | both loop.py + template |
| R8-P2-002 | FIXED - exact run-tagged regex in lint_held_out | both loop.py + template |
| R8-P2-003 | FIXED - cleanup_worktree walks up to the .worktrees parent | both loop.py + template |

## Found during remediation

- gates.py `check()` anchors tripwire crashed with a traceback on missing live docs (the per-source MISSING guard did not extend to the anchors join). Fixed in both instances + template. Discovered live because the operator's in-flight repo restructure (`z — Global (Shared)/` -> `a_Global KB/`) dangles the knowledge-base HVR symlinks - the guard now reports that as a clean MISSING drift halt, which is the correct verdict while the migration is mid-flight.
- OPEN OPERATOR ITEM: once the `a_Global KB/` restructure settles, the knowledge-base symlinks in both packagings need retargeting and the scoring surfaces re-frozen (`gates.py freeze`) against the new paths.

## Post-remediation state

py compile sweep green; kit render smoke green (example config renders, bash parses, all rendered .py compile, parity checks confirmed in rendered output); both gauntlets 10 checks green; vitest battery 243/243. Loop dry-runs correctly HALT on the mid-migration missing-doc drift.
