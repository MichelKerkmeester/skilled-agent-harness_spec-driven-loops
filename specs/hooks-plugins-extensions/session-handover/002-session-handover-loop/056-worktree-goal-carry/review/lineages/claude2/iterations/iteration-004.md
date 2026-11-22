# Iteration 004 - Maintainability

## Dispatcher
- Lineage: claude2 (fan-out), session fanout-claude2-1795297959308-ycf8yr, generation 1
- Dimension: maintainability
- Sources: relaunch-core.cjs log readers (readLogTail, latestGoalLogEntry, logTailText), worktree helpers, skilled-loop seeded split, new test files. steer.md: not present.

## Review Focus Coverage
The focus asks that a worktree goal is never lost or misrouted on later edits as well as today. I looked at where the new code duplicates an existing reader, so a later change to one would silently diverge from the other. I also checked whether the new tests would catch a regression without false failures.

## Files Reviewed
- .skilled/hooks/session-handover/lib/relaunch-core.cjs:63, 633-645, 728-755, 905-962, 547-602
- .skilled/bin/skilled-loop:1234-1255, 482-521
- .skilled/hooks/session-handover/tests/session-handover-cli.test.cjs:3945-4091
- .skilled/hooks/session-handover/tests/skilled-loop-wrapper-claim-goal.test.cjs:864-923

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **logTailText re-implements the existing readLogTail helper** -- .skilled/hooks/session-handover/lib/relaunch-core.cjs:905 -- `readLogTail(filePath, byteCount)` (line 633) already returns the tail text for a byte cap, and `latestGoalLogEntry` uses it with `GOAL_LOG_MAX_TAIL_BYTES` (lines 731, 743). `logTailText` (905-920) opens, stats and reads the same tail again with its own copy of the arithmetic, and adds a swallow-all `catch`. A later change to how the tail is bounded, for example lifting the 16 MiB cap behind iteration 1's R1-P2-001, has to be made twice or the goal reader and the worktree naming read different windows. The worktree path also reads the log a second time on every hand-over that reaches it.
   Finding class: maintainability / duplicated I/O helper
   Scope proof: logTailText is new in this diff; readLogTail pre-exists in the same file.
   Affected surface hints: relaunch-core.cjs logTailText, readLogTail, latestGoalLogEntry
   Case: a follow-up raises GOAL_LOG_MAX_TAIL_BYTES handling inside readLogTail only, so the goal entry is found in a 32 MiB window while logTailText still names worktrees from 16 MiB, and a goal whose worktree path sits between them is dropped.

2. **The claim-line assertion builds a regex from an unescaped temp path** -- .skilled/hooks/session-handover/tests/session-handover-cli.test.cjs:4019 -- `new RegExp(\`Goal packet: ${WORKTREE_PACKET} in ${worktree} \\(\`)` interpolates the realpath of a temp directory. A tmpdir holding a regex metacharacter such as `+`, `(` or `[` (possible with a custom TMPDIR) makes the test fail or throw for a reason unrelated to the code. `.` in the path silently over-matches.
   Finding class: maintainability / brittle test
   Scope proof: the assertion is new in this diff.
   Affected surface hints: session-handover-cli.test.cjs claim assertion; `assert.ok(stdout.includes(...))` is the plain-text alternative
   Case: TMPDIR=/tmp/ci+run makes `new RegExp` treat `+` as a quantifier, so the happy-path test fails although the claim line is correct.

## Refinement of an earlier finding
- R3-P2-003 stands, but its Case line in iteration 3 is wrong. The pattern `linked worktree|two linked worktrees|not a linked worktree` matches exactly three CLI test names. The claimed-note test reads "the worktree goal" and the GIT_DIR test reads "repository worktrees", so neither contains "linked worktree". T003's `pass 3` is therefore literally reproducible. The drift is that the two later CLI tests have no task, REQ or Files-to-Change row, not that the count is wrong. Severity unchanged (P2).

## Traceability Checks
- spec_code: pass for the decisions row "Search worktrees only after the usual roots find nothing" (relaunch-core.cjs:885-893 precede :895).
- checklist_evidence: no change from iteration 3.

## Integration Evidence
- `.skilled/bin/skilled-loop:1237-1242` splits the seeded answer on the first newline, the same shape `seeded_goal_packet` prints at :511. Producer and consumer agree.

## Edge Cases
- `usableGoalPacket` is kept as a thin shim over `usableGoal` (relaunch-core.cjs:599-601). Callers that still use it get the packet without its root. In scope, only the CLI and the wrapper read the root, and both moved to `usableGoal`. A remaining shim caller would re-check against the usual roots and drop a worktree packet. Grep shows no other in-scope caller, so this is recorded rather than reported.
- The two test files each define a local `git()` helper. That is two instances, not yet a pattern. Not reported.

## Confirmed-Clean Surfaces
- The JSDoc for `worktreeHeadlinePackets` states that `roots[0]` is the repository, which `repositoryWorktrees(roots[0])` relies on.
- The comments carry durable WHY and no ephemeral ids (comment-hygiene check over the diff).

## Ruled Out
- A missing seeded-path split for a packet with no root: `${seeded_goal%%$'\n'*}` on a one-line answer yields the whole answer and leaves goal_root empty.

## Next Focus
- Dimension: cross-dimension hop-chain check (all four dimensions done)
- Focus area: hop 2 and hop 3 via claimedRoot, a worktree removed between hops, two named worktrees where one is claimed, and goal switch toggling. Confirm a worktree-only goal survives each hop or fails loudly.
- Rotation status: D1-D4 complete; iteration 5 is the stabilization pass.

Review verdict: PASS
