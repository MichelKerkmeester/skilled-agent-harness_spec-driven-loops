# Iteration 1: Core state, filesystem boundaries and phase-record alignment

## Focus

Check the shared relaunch core, handoff-note directory boundary and stale-lock recovery against current tests, then compare the parent worktree decision with phase 008.

## Findings

1. **LUNA-R1-001 — The handoff directory is not validated as a private path boundary (INFERRED).** Evidence: .skilled/hooks/session-relaunch/lib/nudge.cjs:219-225, 267-273; .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:128-190; .skilled/hooks/session-relaunch/tests/nudge.test.cjs:495-506. The nudge follows a pre-existing handoffs symlink, attempts chmod through it, suppresses any error and still returns a note path. The CLI then treats the resolved handoffs directory itself as the trusted root without checking that it remains inside the repository. A symlink can therefore redirect handoff writes and chmod outside the repository; a failed chmod can also leave a writable but non-private directory in use. Fix by canonicalizing the repository root, rejecting symlinks in the managed path, requiring the resolved handoffs directory to remain beneath the repository, verifying current ownership and mode 0700, and returning no path when those checks fail. Add cases for an outside symlink and a chmod failure.
2. **LUNA-R1-002 — The parent goal still names the superseded worktree (CONFIRMED).** Evidence: specs/hooks/023-session-relaunch-loop/goal.md:52 says work stays on worktrees/142-session-relaunch-loop; the same file at :131 records the D6 amendment to worktrees/148-session-relaunch-deep-review; phase 008 goal at :46 binds worktree 148. The durable decision and its later log entry conflict, and the child decision confirms the active value. Fix D6 to name worktree 148 or explicitly mark the earlier value superseded in the durable decision.
 
## Sources Consulted

- .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:35-57, 404-428, 492-532
- .skilled/hooks/session-relaunch/lib/nudge.cjs:209-273
- .skilled/hooks/session-relaunch/lib/killer.cjs:204-321, 436-449
- .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:128-190
- .skilled/hooks/session-relaunch/tests/nudge.test.cjs:445-506
- .skilled/hooks/session-relaunch/tests/killer.test.cjs:1624-1665
- specs/hooks/023-session-relaunch-loop/008-review-3-remediation/acceptance-criteria.md:54-60
- specs/hooks/023-session-relaunch-loop/goal.md:45-53, 120-132
- specs/hooks/023-session-relaunch-loop/008-review-3-remediation/goal.md:40-47

## Assessment

- newInfoRatio: 1.0
- noveltyJustification: Both findings are newly surfaced in this run; the handoff-path issue is a static inference that needs a focused symlink and chmod-failure test to confirm.
- Confidence: High that the goal record conflicts; medium that the filesystem path can be redirected, based on the call path and missing resolved-root check.
- Questions answered: Whether the directory helper rejects an unsafe path before returning it; whether the parent worktree decision matches the later amendment.
- Questions remaining: Whether adapter event handling and the wrapper preserve the same path and session invariants.

## Reflection

The core time-boundary, note-transition and stale-lock changes appear to cover the phase 008 cases in the source and tests read. The new filesystem concern is not disproved by the current happy-path permission test. No tests were run.

## Recommended Next Focus

Compare runtime adapters and the OpenCode plugin on usage input, seed parsing, pending-state suppression and arm/relaunch behavior.
