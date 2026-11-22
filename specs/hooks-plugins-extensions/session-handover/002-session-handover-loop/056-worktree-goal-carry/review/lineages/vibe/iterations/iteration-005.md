# Review Iteration 005

## Dispatcher

- Mode: review | Target agent: `@deep-review` | Execution: single review iteration, inline
- Resolved route: mode=review target_agent=deep-review
- Session: `fanout-vibe-1795297959308-ycf8yr` | generation 1 | lineageMode `new`
- Iteration 5 of 5 | stopPolicy `max-iterations` (this is the terminal iteration; convergence 0.10 was telemetry only)
- Dimension: **cross-reference** (all four configured dimensions were covered in iterations 1-4; this pass consolidates and answers the operator focus end to end)
- Operator review focus: the uncommitted worktree goal carry-over change, checked against packet 056's spec, tasks and implementation-summary claims, and checked for a goal set in a packet that exists only in a worktree being carried across a hop without being lost or misrouted.

## Files Reviewed

- The full worktree goal path, read end to end: `session-handover.cjs:407-425` (`recordGoalPacket`) to `relaunch-core.cjs:1436-1465` (`resolveGoalPacketResult`) to `:819-900` (`claudeGoalPacketResult`) to `:936-960` (`worktreeHeadlinePackets`) to `:1501-1525` (`recordGoalPacket`) to `session-handover.cjs:844-900` (`consume`) to `skilled-loop:1455-1465` (hop render) to `goal-handover.cjs:95-140` (`renderGoalSlice`)
- The seeded first-launch path: `skilled-loop:481-515` (`seeded_goal_packet`) to `:1234-1250` (split and render)
- All eight active findings across `iterations/iteration-001.md` through `iteration-004.md`
- `spec.md` REQ-001..REQ-005, `tasks.md` T001..T010, `implementation-summary.md` Verification and Known Limitations

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. One P1 remains active from iteration 1 (R1-P1-001, the bounded log tail), refined in iteration 4 by R4-P2-001.

### P2 Findings

None new. Seven P2 findings remain active from iterations 1-4.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | partial | Final state: REQ-001..REQ-004 are implemented at `relaunch-core.cjs:513`, `:547-553`, `:936-960` and `skilled-loop:1460`, `:1240`; REQ-005 is claimed at `implementation-summary.md:112-114` and not re-measured. The bounded tail at `:906-920` narrows REQ-001, and `spec.md:110` plus `tasks.md:44` still say three CLI tests where five ship. |
| `checklist_evidence` | core | partial | Final state: T001-T010 all `[x]`; T003's verify line names three tests where five exist; T005's `bash -n` and `pass 0 fail 2` and T010's real-session probe are claims without artifacts in this lineage. |
| `skill_agent` | overlay | notApplicable | No `SKILL.md` or agent definition is in the diff or the declared scope. |
| `agent_cross_runtime` | overlay | notApplicable | No `.claude/agents` or `.opencode/agents` file is in the diff or the declared scope. |
| `feature_catalog_code` | overlay | fail | `session-handover-loop.md:98` omits `goal_root` and the worktree search (R3-P2-002). |
| `playbook_capability` | overlay | partial | `session-handover-claude.md:758` has no worktree-only case; out of the declared change scope, recorded as follow-up. |

## Integration Evidence

- **Hop path, traced end to end.** `prepare` calls `recordGoalPacket` (`session-handover.cjs:499`) which calls `resolveGoalPacketResult` (`:419`); a worktree match returns `{packet, root}` from `relaunch-core.cjs:895`; `core.recordGoalPacket` writes both fields (`:1513-1517`). The wrapper's `consume_record` (`skilled-loop:1391`) reads `goal_root` through `consumed_field` (`:1460`), and `render_goal_slice` passes `roots: [goalRoot]` to `renderGoalSlice` (`:461`), which runs `goal.cjs packet <packet> --workspace <goalRoot>` (`goal-handover.cjs:104-118`). Every link is present and ordered.
- **Seeded first-launch path, traced end to end.** `seeded_goal_packet` (`skilled-loop:481-515`) reads the note through `core.usableGoal` and prints `packet` then optionally `root`; `:1237-1243` splits on the first newline; `:1240` passes the root to `render_goal_slice`. The split is safe because `repositoryWorktrees:533-541` cannot return a path containing a newline.
- **Misrouting is closed on every path checked.** `usableGoal:578-583` reads a `goal_root` packet from that worktree alone, so an older copy in another checkout can never stand in; `worktreeHeadlinePackets:954-957` refuses two worktree-and-packet pairs; `goalPacketProblem:453-462` keeps the slice inside the named worktree.
- **The `noteCwd` path cannot diverge from the wrapper's cwd.** `goalHeadlinePackets` is also called with `roots` including `noteCwd` (`:888`), and a match there returns no `goal_root`. That looked like a gap until the cwd source was traced: `prepare` writes `cwd` from the sender's working directory and the wrapper runs in that same directory, so `renderGoalSlice`'s default `roots` (`goal-handover.cjs:97`) already include it. No `--cwd` flag exists to separate them (`session-handover.cjs` has no such option).

## Edge Cases

- **Contradictory evidence adjudicated: R1-P1-001 (the search can miss) and R2-P2-001 (the trust base is wide) pull in opposite directions.** They are not in conflict. R1-P1-001 is a false negative caused by reading too little of the *same* log; R2-P2-001 is a false positive caused by trusting any git-listed worktree. Reusing `readLogTail`'s widening fixes the first without touching the second, because it reads more of one log rather than more worktrees. Recorded so a remediation does not widen the trust base while fixing the miss.
- **Missing dependency: the three suites and the real-session probe remain unverified in this lineage.** `implementation-summary.md:112-116` and the goal's completion criteria claim 1073 / 75 / 509 and a 2088 ms real-session resolve. None is re-measured here. This is the largest single limit on what this review can assert.
- **Partial success: the `playbook_capability` overlay is partial and out of the declared change scope.** Recorded as follow-up in the protocol table, not as a finding.
- **Ambiguity: `spec.md:110` and `tasks.md:44` disagree with the diff on the CLI test count.** Resolved in iteration 3 in favour of the diff, because `spec.md:139`'s 1065-to-1073 arithmetic reconciles with five CLI tests and not three.

## Confirmed-Clean Surfaces

- The end-to-end hop path and the seeded first-launch path both carry `goal_root` from the note to the slice render with no missing link.
- `goal-carry-over.md` describes the worktree search, the claimed-note signal, the two-pair refusal, the `goal_root` ownership rule, the `git worktree list` gate and the single-root render, and every claim matches the code.
- `specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/spec.md` phase-map row 56 and the 055-to-056 transition row agree with `implementation-summary.md` on all three suite counts.
- `implementation-summary.md` Known Limitations 1-3 are honest: the mid-session goal limitation, the log-must-name-the-worktree limitation and the inferred Pi/OpenCode behaviour are all stated as limits rather than as passes.
- The four canonical dimensions are covered, and no dimension produced a P0.

## Ruled Out

- **A `noteCwd` match being misrouted to the wrong checkout.** `prepare` writes `cwd` from the sender's working directory and the wrapper runs there, so `renderGoalSlice`'s default roots already include it; no `--cwd` flag exists to separate them.
- **A packet that exists on main and in a worktree being resolved from the worktree.** `claudeGoalPacketResult:888-893` returns the usual-roots match before the worktree search runs, which is the documented Key Decision.
- **The two-worktree refusal being bypassed by a claimed note.** `worktreeHeadlinePackets:948-951` treats the claimed root as one more named worktree, so two matching pairs still refuse.
- **`goal_root` surviving a packet that moved back to the usual roots.** `recordGoalPacket:1513-1517` removes the field whenever the packet is found without a root, and the core test at `relaunch-core.test.cjs:3305-3323` asserts it.
- **A P0 hiding in the unverified suite claims.** No code path was found that fails on an input the code's own contract allows, so the unverified claims limit confidence rather than raise severity.

## Next Focus

- Dimension: none remaining; all four configured dimensions are covered and this consolidation pass is the terminal iteration
- Focus area: remediation of R1-P1-001 by reusing `readLogTail` and its widening, which also closes R4-P2-001; then the four documentation findings
- Reason: `stopPolicy=max-iterations` reached iteration 5 of 5
- Rotation status: complete
- Blocked/productive carry-forward: productive -- the two-reads comparison and the existing-helper search were the two highest-yield moves; a future review of this path should start there
- Required evidence: none outstanding for this run
- Recovery note: not applicable

Review verdict: CONDITIONAL
