# Iteration 005 - Cross-dimension hop-chain check

## Dispatcher
- Lineage: claude2 (fan-out), session fanout-claude2-1795297959308-ycf8yr, generation 1
- Dimension: correctness (stabilization pass across all four dimensions; stopPolicy max-iterations)
- Sources: relaunch-core.cjs lastClaimedNote/worktreeHeadlinePackets/usableGoal, skilled-loop hop path, CLI claimed-note test, iterations 1-4. steer.md: not present.

## Review Focus Coverage
This pass is the focus statement run as a scenario. A goal is set in a packet that exists only in worktree W, and the session hands over three times. I traced each hop's writer and reader. The aim was to see whether the goal survives, fails loudly, or is lost or misrouted without notice.

## Files Reviewed
- .skilled/hooks/session-handover/lib/relaunch-core.cjs:799-818, 893-901, 932-962, 568-596
- .skilled/bin/skilled-loop:1440-1466
- .skilled/hooks/session-handover/bin/session-handover.cjs:844-898
- .skilled/hooks/session-handover/tests/session-handover-cli.test.cjs:4056-4073

## Hop Trace
- Hop 1, session S1 with cwd primary, works in W. The primary searches miss, W is named by S1's log, and the single match gives N1 `goal_packet` and `goal_root W`. consume reports both, and the wrapper renders the slice from W. Carried.
- Hop 2, session S2 starts on `/goal <slice>` in primary and claims N1. Its prepare takes the headline from the slice. The primary searches miss, `claimedRoot` is N1's `goal_root` (relaunch-core.cjs:895), W counts as named (:950), and N2 gets `goal_root W`. Carried, as covered by cli.test:4056.
- Hop 3 is the same as hop 2 via N2. Carried.
- W is removed with `git worktree remove` between hops. consume's `noteGoalRoot` no longer finds W, `usableGoal` returns none with no fallback, and consume omits `goal_packet`. The wrapper starts on the claim seed with no warning line. This matches how a packet that lost its goal.md is handled today, so it is recorded as an edge case rather than a finding.

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **A claimed goal_root is outvoted by a second worktree the receiver's log merely mentions** -- .skilled/hooks/session-handover/lib/relaunch-core.cjs:958 -- `worktreeHeadlinePackets` treats the claimed note's root (line 950) as one named worktree among others. If the hop-2 receiver's log also contains a path inside a second worktree W2 that holds a copy of the same packet, the loop collects two matches and returns early (line 958). `claudeGoalPacketResult` then refuses with `the active goal headline appears in 2 packets` (:897-899). So a goal the previous hop already proved in W is dropped, although the claimed note names exactly which copy was proven. On hop 1 the two-pair refusal is the intended D3 rule. On a later hop it discards stronger evidence than the log mention that outvotes it.
   Finding class: correctness / goal lost on a later hop
   Scope proof: the claimedRoot input and the per-pair early return are both new in this diff.
   Affected surface hints: relaunch-core.cjs worktreeHeadlinePackets (prefer `claimed` when it matches), goal-carry-over.md uniqueness paragraph
   Case: S2 claims N1 with goal_root W, then runs `ls /w/W2/specs/x/` in a sibling worktree branched from W that holds specs/x/001 too; S2's prepare prints `goal not carried: the active goal headline appears in 2 packets` and the hop-3 receiver starts with no goal.

## Traceability Checks
- spec_code: partial overall. D3 ("two matching worktree and packet pairs refuse") is implemented literally, and this iteration's finding is about the claimed-root case D3 does not address.
- checklist_evidence: unchanged from iterations 3-4.

## Integration Evidence
- `.skilled/bin/skilled-loop:1460` reads `goal_root` from consume's record on every hop, so the hop chain needs nothing beyond the note.
- `session-handover.cjs:897` adds `goal_root` to consume's JSON only beside a packet.

## Edge Cases
- Removed worktree: silent no-goal at consume, as described in the Hop Trace above.
- Goal switch off at prepare: `recordedGoalSwitch === false` drops both fields at consume (relaunch-core.cjs:574). The root cannot outlive its packet.
- Two claimed notes by one session: `lastClaimedNote` picks the latest `claimed_at`, as `claimedNoteEndedGoal` already did.

## Confirmed-Clean Surfaces
- The three-hop chain through `claimedRoot` carries the goal in the plain case.
- The no-fallback rule holds on every reader (consume, claim, seeded first launch).

## Ruled Out
- Hop 2 losing the goal when its log never names W: the claimed-note root covers it (cli.test:4056).

## Next Focus
- Synthesis: max iterations reached. Carry 9 P2 (R1-P2-001, R1-P2-002, R2-P2-001, R3-P2-001..003, R4-P2-001..002, R5-P2-001) into the report. No P0/P1.

Review verdict: PASS
