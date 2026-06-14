# Remediation Summary - All 24 Deep-Review Advisories Applied

**Date:** 2026-06-10 | **Verdict before:** PASS hasAdvisories=true (P2=24) | **After:** all advisories remediated or formally accepted-by-design
**Commits:** Barter `9d4525a` (instances), Public `64fa6dcbdf` + `a8e5b9c724` (kit + shared + docs). Joint work between two parallel operator sessions.

## Functional fixes (the ones that mattered most)

- **Deals make_worktree wrong-target path** (iter-9 KEEP-P1 evidence; iter-10 close applied only to the Copywriter instance): the deals loop's worktree promotion path targeted the COPYWRITER packaging inside its own worktree. Fixed in the instance and made structurally impossible in the template (`os.path.basename(CW)`).
- Template/live behavioral divergences closed: lint `ignorecase` parity (R5-P2-001), gauntlet A5 threshold >=3 (R5-P2-002), grader rubric subset instead of the full frozen surface (R5-P2-003).
- Instance edge cases: HELD_OUT in the resume-cache hash (R8-P2-001), exact run-tag regex in lint_held_out (R8-P2-002), worktree-base walk-up (R8-P2-003), gates.py missing-doc tolerance.
- Scaffolder: prelude-key validation (R5-P2-004), atomic two-phase render (R5-P2-006), shell-context escaping for instructions (R2-P2-001), rubric selection honoring explicit `in_rubric` with the anchor heuristic as fallback.
- Shared: phantom-gap pattern hard length refusal (R1-P2-004), explicit `thresholdDelta: 0` honored, readScoreDelta dual-shape contract documented (R1-P1-002 reconcile).

## Doc fixes

loop_contract gains `LOOP_SKIP_PROBE` + `promote_skip` (R3-P2-001/002); gauntlet capability stated accurately as 9 attacks / 10 checks everywhere (R3-P2-003); T6 attribution separates the skill-side `fixture-lint.cjs` from the packaging-side `lint_held_out()` (R3-P2-004); schema drops dead fields + phantom tokens (R4-P2-003/004); operator guide documents kit versioning + the re-render-diff adoption procedure and the template-as-source maintenance model (R4-P2-001/006 acceptance branch); stale Copywriter docstrings in the deals ports corrected (R1-P2-001).

## Accepted-by-design (documented, no code change)

Lock stale-evict TOCTOU residual window (fail-safe by O_EXCL; R1-P2-003), gauntlet template generic file-walking (functional choice; R5-P2-005), full packaging dedup deferred in favor of the documented template-as-source model (R4-P2-002).

## Post-remediation validation

Gates + derive checks green on both packagings (after the a_Global KB symlink repair, 46 links restored by a MiMo dispatch and independently verified). Both gauntlets 10/10. Scaffolder renders compile and match the live instances on every remediated divergence. Vitest battery 243/243.
