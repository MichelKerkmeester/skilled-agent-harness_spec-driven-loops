# Iteration 001 - Correctness

## Dispatcher
- Lineage: claude2 (fan-out), session fanout-claude2-1795297959308-ycf8yr, generation 1, lineageMode new
- Dimension: correctness
- Sources: deep-review-config.json, deep-review-strategy.md, git diff of the eight scoped code/doc files, packet 056 spec/tasks/implementation-summary/goal. steer.md: not present.

## Review Focus Coverage
Traced a worktree-only goal end to end: `prepare` (session-handover.cjs `validatedNote` -> `recordGoalPacket` -> core `resolveGoalPacketResult` -> `claudeGoalPacketResult` -> `worktreeHeadlinePackets`), the note writer (`recordGoalPacket` with `root`), the readers (`usableGoal`/`noteGoalRoot` from `consume`, `claim` and the wrapper's `seeded_goal_packet`), and the wrapper's `render_goal_slice` on a hop and on a seeded first launch. The hop-1 path carries the goal correctly; two narrower cases lose or reroute it.

## Files Reviewed
- .skilled/hooks/session-handover/lib/relaunch-core.cjs:74-80, 496-602, 820-962, 1354-1390, 1436-1462, 1499-1525
- .skilled/hooks/session-handover/bin/session-handover.cjs:384-427, 450-500, 559, 655, 746-757, 844-898
- .skilled/bin/skilled-loop:182-212, 448-521, 1230-1255, 1440-1466
- .skilled/hooks/session-handover/lib/goal-handover.cjs:66-136 (context: renderGoalSlice root selection)
- .skilled/hooks/session-handover/tests/{session-handover-cli,relaunch-core,skilled-loop-wrapper-claim-goal}.test.cjs (new cases)

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **Worktree naming reads only the last 16 MiB of the session log** -- .skilled/hooks/session-handover/lib/relaunch-core.cjs:910 -- `logTailText` caps the read at `GOAL_LOG_MAX_TAIL_BYTES` (16 MiB, line 63), and `worktreeHeadlinePackets` (line 950) treats a worktree as named only when its path appears in that tail. A long session whose worktree paths all sit earlier than the last 16 MiB carries no goal and prints `the active goal names no packet this hand-over can find`. Known Limitation 2 and troubleshooting.md say "the log must name the worktree" without saying only the tail counts.
   Finding class: correctness / silent goal loss on a bounded read
   Scope proof: logTailText and the `named` test are new in this diff; the cap constant pre-exists.
   Affected surface hints: relaunch-core.cjs logTailText, worktreeHeadlinePackets; implementation-summary.md Known Limitations 2; troubleshooting.md missing goal packet entry
   Case: a Claude session that cd'd into worktree W early, then produced over 16 MiB of further log in the primary checkout without touching W again, hands over and the note gets no goal_packet.

2. **A claimed goal_root loses to a primary copy carrying the same headline on the next hop** -- .skilled/hooks/session-handover/lib/relaunch-core.cjs:888 -- `claudeGoalPacketResult` consults the claimed note's `goal_root` (line 895) only after the lineage, named-packet and primary headline searches (lines 885-893) all miss. If a copy of the packet with the same headline appears in the primary checkout between hops (a merge of the worktree branch, or a cherry-picked packet), hop 2 resolves the packet from the primary checkout with no `goal_root`, so the receiver renders the primary copy's slice. `usableGoal` (line 576) states the opposite rule: a packet proven in a worktree is read from that worktree or not at all, because another checkout can hold an older copy.
   Finding class: correctness / inconsistent root precedence between writer and reader
   Scope proof: the claimedRoot lookup and the usableGoal no-fallback branch are both new in this diff; the order of searches is the diff's choice (implementation-summary Key Decisions row 3).
   Affected surface hints: relaunch-core.cjs claudeGoalPacketResult search order; goal-carry-over.md section on the worktree search
   Case: hop 1 carries specs/x/001 with goal_root W; before hop 2 the operator merges an earlier commit of W's branch into main so main holds specs/x/001/goal.md with the same title line but older criteria; hop 2's prepare writes goal_packet specs/x/001 with no goal_root and the hop-3 receiver starts on main's older slice.

## Traceability Checks
- spec_code (partial, iteration 1 view): REQ-001..REQ-004 behaviors exist in code: worktree listing (relaunch-core.cjs:513), named-worktree search (:932-962), `goal_root` write/remove (:1513-1518), git-listed acceptance (:547-554), two-pair refusal (:958, :897-899). Full traceability deferred to iteration 3.
- checklist_evidence (pending): test counts 1065 + 8 new cases (1 core, 5 CLI, 2 wrapper) = 1073 match SC-002 and T008 by count; suites not re-run here because they write sandboxes outside the lineage, so the pass counts remain the packet's claim.

## Integration Evidence
- `.skilled/bin/skilled-loop` consumes `goal_root` via `consumed_field goal_root` (line 1460) and the seeded path's second stdout line (lines 1237-1246).
- `.skilled/hooks/goal/lib/goal-core.cjs:1257` `bindRelaunchGoal` reads `SESSION_HANDOVER_GOAL_PACKET`; its only callers are cursor/goal-inject.mjs:51, devin/goal-inject.mjs:40 and pi/goal-context.ts:104. No Claude hook binds it, so the exported packet cannot misroute a Claude receiver to a primary-checkout copy.

## Edge Cases
- Prefix collision between worktree names (`wt-1` vs `wt-10`) is prevented by the trailing `/` in the `named` test (line 950-952).
- Symlinked worktree paths are matched by both the listed and the real path.
- A stale or hand-edited `goal_root` yields no goal rather than a fallback (usableGoal:576-581); verified by the tampered-root test planting a repo copy.
- `goal_root` equal to the consumer's repoRoot would be rejected by noteGoalRoot (repoRoot is excluded from the list), but prepare also excludes searched roots and packet 055 pins one root per loop, so the writer cannot produce that value. Ruled out.
- Goal switch off: `recordGoalPacket` in the CLI returns before writing, leaving any older fields; consume drops them through `recordedGoalSwitch === false`. Pre-existing, unchanged.

## Confirmed-Clean Surfaces
- `recordGoalPacket` core: `goal_root` is written only with a packet and removed when the packet is removed or found in the usual roots (relaunch-core.cjs:1513-1518).
- `prepare` and `keep` both reach the CLI `recordGoalPacket` through `validatedNote` (session-handover.cjs:499, called at :559 and :655).
- `claimedNoteEndedGoal` refactor onto `lastClaimedNote` keeps the prior return semantics.
- Wrapper seeded path splits packet and root on the first newline; an empty answer leaves both empty.

## Ruled Out
- Claude start hook binding a worktree-only packet against its own checkout: no Claude caller of `bindRelaunchGoal`.
- Off-by-one in worktree uniqueness: `found.length > 1` returns early and `=== 1` is the only accepting branch.

## Next Focus
- Dimension: security
- Focus area: `goal_root` trust boundary (noteGoalRoot, wrapper render), completeness of the stripped git variable list (GIT_CONFIG_PARAMETERS, GIT_CONFIG_COUNT/KEY/VALUE, GIT_CEILING_DIRECTORIES removal widening discovery), path containment of the packet inside the worktree.
- Reason: rotation to D2; the trust rule for a hand-editable note field is the change's main security surface.
- Rotation status: D1 done, D2-D4 remaining.
- Required evidence: file:line reads of relaunch-core.cjs:496-560 and git behavior notes.

Review verdict: PASS
