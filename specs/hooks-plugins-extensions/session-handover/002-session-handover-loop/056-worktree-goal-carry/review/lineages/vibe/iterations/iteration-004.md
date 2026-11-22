# Review Iteration 004

## Dispatcher

- Mode: review | Target agent: `@deep-review` | Execution: single review iteration, inline
- Resolved route: mode=review target_agent=deep-review
- Session: `fanout-vibe-1795297959308-ycf8yr` | generation 1 | lineageMode `new`
- Iteration 4 of 5 | stopPolicy `max-iterations` (convergence 0.10 is telemetry only)
- Dimension: **maintainability**
- Operator review focus: the uncommitted worktree goal carry-over change, checked against packet 056's spec, tasks and implementation-summary claims, and checked for a goal set in a worktree-only packet being carried across a hop without being lost or misrouted. This iteration asks whether the new helpers are shaped so the next change to the goal path is safe, and whether each new helper follows or departs from an existing convention.

## Files Reviewed

- `.skilled/hooks/session-handover/lib/relaunch-core.cjs:633-645` (`readLogTail`), `:700-760` (`latestGoalLogEntryBefore`, `latestGoalLogEntry`), `:906-920` (`logTailText`), `:922-960` (`worktreeHeadlinePackets`), `:496-553` (`realPathOrNull`, `repositoryWorktrees`, `noteGoalRoot`), `:555-600` (`usableGoal`, `usableGoalPacket`), `:819-900` (`claudeGoalPacketResult`), `:1436-1465` (`resolveGoalPacketResult`), `:1501-1525` (`recordGoalPacket`), `:2760-2775` (exports)
- `.skilled/hooks/session-handover/bin/session-handover.cjs:383-425`, `:746-760`, `:844-900`
- `.skilled/bin/skilled-loop:447-515`, `:1234-1250`, `:1455-1465`
- `.skilled/hooks/session-handover/tests/session-handover-cli.test.cjs:3940-4092`, `tests/skilled-loop-wrapper-claim-goal.test.cjs:859-923`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **`logTailText` duplicates `readLogTail` and reuses `GOAL_LOG_MAX_TAIL_BYTES` with a second meaning, which is how the two log reads came to disagree** -- `.skilled/hooks/session-handover/lib/relaunch-core.cjs:906-920` -- `readLogTail(filePath, byteCount)` at `:633-645` already opens the log, reads a bounded tail and returns `{text, whole, start, bytes}`. `logTailText` re-implements the same open, `fstat`, `read` and `close` and returns only the text, dropping `whole` and `start`. The constant it caps with, `GOAL_LOG_MAX_TAIL_BYTES` (`:63`), is documented at `:58-62` as the ceiling of a widening loop that `latestGoalLogEntry` drives; `logTailText` reads it as a hard cap with no widening. One constant therefore carries two meanings, and the second reader silently inherits the first reader's ceiling without its escape hatch. This is the structural cause of R1-P1-001, and fixing it by calling `readLogTail` and reusing the widening would close both at once.
   Finding class: duplication
   Scope proof: the duplicate body is at `:906-920`; the original is at `:633-645`; the two meanings of the constant are at `:58-62` and `:906-920`; the widening loop that the duplicate omits is at `:731-757`.
   Affected surface hints: `.skilled/hooks/session-handover/lib/relaunch-core.cjs` (`logTailText`, `readLogTail`, `latestGoalLogEntry`, `GOAL_LOG_MAX_TAIL_BYTES`)
   Case: a maintainer raises the tail cap to cover longer sessions. `latestGoalLogEntry` widens correctly, `logTailText` reads the new cap as a hard limit, and the worktree search keeps failing on the same logs -- the fix appears to have been applied and has not been.

2. **`resolveGoalPacketResult` returns `root` only on the worktree path, so every consumer must default a key the JSDoc calls optional** -- `.skilled/hooks/session-handover/lib/relaunch-core.cjs:1436-1465` -- `none` is `{packet: '', reason: '', ended: false}` with no `root`, and only the worktree branch at `:895` adds one. `usableGoal:568-588` always returns `{packet, root}`, so the module exposes two shapes for the same concept. The single consumer, `session-handover.cjs:419`, survives only because it writes `const { packet, reason, ended, root = '' } = ...`. A second consumer that destructures `root` without a default gets `undefined`, and `recordGoalPacket:1513` would then compare `frontmatter.goal_root !== undefined` and write the string `undefined` into the note.
   Finding class: api-shape
   Scope proof: the bare `none` is at `:1440` and `:820`; the only branch that adds `root` is at `:895`; the consumer default is at `session-handover.cjs:419`; the write that would receive `undefined` is at `:1513-1517`.
   Affected surface hints: `.skilled/hooks/session-handover/lib/relaunch-core.cjs` (`resolveGoalPacketResult`, `claudeGoalPacketResult`, `recordGoalPacket`), `.skilled/hooks/session-handover/bin/session-handover.cjs`
   Case: a future caller adds a second `resolveGoalPacketResult` consumer, destructures `{packet, root}` and passes both to `recordGoalPacket`. On a packet found in the usual roots, `root` is `undefined`, the comparison at `:1513` sees a difference, and the note gains `goal_root: undefined`, which `noteGoalRoot:549` then rejects as non-absolute -- so the next hop drops a goal that was fine.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | partial | Unchanged from iteration 3: REQ-001..REQ-004 are implemented, the bounded tail narrows REQ-001, and the three-CLI-tests prose is stale. This iteration adds the structural reason for the first of those. |
| `checklist_evidence` | core | partial | Unchanged from iteration 3: T003 names three tests where five exist; T010 and T005 remain claims without artifacts in this lineage. |

## Integration Evidence

- `.skilled/bin/skilled-loop:1237-1243` is the only caller of `seeded_goal_packet`, so widening its return from one line to two breaks no other call site.
- `.skilled/bin/skilled-loop:1460` is the only hop-path caller of `render_goal_slice`, and `:1240` the only seeded-path caller; both pass the new second argument, so the signature change is complete.
- `.skilled/hooks/session-handover/lib/relaunch-core.cjs:2766` exports `usableGoal` beside the retained `usableGoalPacket`, so the wrapper can read the root while older callers keep the packet-only shape.

## Edge Cases

- **Ambiguity resolved: the `roots[0]` assumption recorded in iteration 1 is documented.** `worktreeHeadlinePackets`'s JSDoc at `:930` states "The checkouts already searched; the first is the repository", so the assumption is a stated contract rather than an undocumented one. Downgraded from an open edge case to a documented constraint.
- **Ambiguity: the two-line `seeded_goal_packet` protocol is stringly typed.** The encoding is safe because `repositoryWorktrees:533-541` splits git's porcelain output on `\n`, so a listed worktree path can never contain the delimiter. The contract is stated in the function comment at `:481-486` and exercised by the seeded first-launch test. Recorded as acceptable rather than raised.
- **Missing dependency: no test asserts the `root` key is absent on the usual-roots path.** The core test at `relaunch-core.test.cjs:3305-3323` covers `recordGoalPacket`'s four transitions but not `resolveGoalPacketResult`'s return shape, which is why P2 finding 2 is invisible to the suite.
- **Partial success: the `git()` test helper is duplicated across two test files.** `session-handover-cli.test.cjs:3945` and `skilled-loop-wrapper-claim-goal.test.cjs:864` each define a six-line wrapper. That matches the existing convention of self-contained test files, each with its own `createSandbox` and `writeHandoff`, so it is not raised.

## Confirmed-Clean Surfaces

- Every new function carries a JSDoc block with `@param` and `@returns` (`repositoryWorktrees:504-512`, `noteGoalRoot:545-546`, `usableGoal:560-567`, `worktreeHeadlinePackets:922-935`, `logTailText:905`), matching the file's existing documentation density.
- `repositoryWorktrees:513-543` follows the file's fail-closed convention: a `try` around the spawn, an early `[]` on `run.error` or a non-zero status, and a `realPathOrNull` guard per entry.
- `noteGoalRoot:547-553` follows the same guard-then-return-empty shape as `goalPacketProblem:448-468`, so a reader who knows one knows the other.
- `usableGoal:568-588` keeps the pre-existing `goalRoots` branch intact and adds the worktree branch ahead of it, so the old path is unchanged rather than rewritten.
- `recordGoalPacket:1501-1525` extends the existing `updates` map pattern rather than adding a second write path, so the note is still written once under `withAppendLock`.
- `skilled-loop:447-480` keeps `render_goal_slice`'s refusal contract: one warning line and exit 1, so a missing worktree slice degrades exactly as a missing packet slice did.

## Ruled Out

- **`seeded_goal_packet`'s widened return breaking another caller.** `skilled-loop:1237` is its only call site.
- **`render_goal_slice`'s new second argument breaking another caller.** `:1240` and `:1460` are its only call sites and both pass it.
- **`realPathOrNull` being an unnecessary helper.** It is used at `:530`, `:535`, `:550` and `:938`, four call sites, so it earns its place.
- **`goalPacketProblem` not using `realPathOrNull`.** It needs the throw to distinguish "outside the repository" from "no goal.md", which a null-returning helper would erase.
- **The local `recordGoalPacket` in `session-handover.cjs:407` shadowing `core.recordGoalPacket`.** The shadow predates this change and the local function's body already calls `core.recordGoalPacket` explicitly.
- **`GIT_REPOSITORY_VARIABLES` being rebuilt per call.** It is a module-level frozen array; only the `env` copy is per call, which is required.

## Next Focus

- Dimension: cross-reference (all four dimensions are covered; this pass cross-references the findings against each other and against the operator review focus)
- Focus area: the end-to-end worktree goal path from `prepare` to the receiver's `/goal`, and whether the six active findings describe one root cause or several
- Reason: `stopPolicy=max-iterations` runs to 5, so the fifth pass consolidates rather than opens a new dimension; the operator focus asks specifically whether a worktree-only goal is ever lost or misrouted, which is a cross-cutting question
- Rotation status: all four dimensions complete, rotating to cross-reference
- Blocked/productive carry-forward: productive -- the duplication finding came from looking for an existing helper before accepting a new one; carry that into the consolidation
- Required evidence: `file:line` for every claim, plus an explicit statement of which findings share a root cause
- Recovery note: not applicable

Review verdict: CONDITIONAL
