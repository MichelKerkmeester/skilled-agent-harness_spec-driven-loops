# Review Iteration 001

## Dispatcher

- Mode: review | Target agent: `@deep-review` | Execution: single review iteration, inline
- Resolved route: mode=review target_agent=deep-review
- Session: `fanout-vibe-1795297959308-ycf8yr` | generation 1 | lineageMode `new`
- Iteration 1 of 5 | stopPolicy `max-iterations` (convergence 0.10 is telemetry only)
- Dimension: **correctness**
- Operator review focus: the uncommitted worktree goal carry-over change, checked against packet 056's spec, tasks and implementation-summary claims, and checked for a goal set in a worktree-only packet being carried across a hop without being lost or misrouted.

## Files Reviewed

- `.skilled/hooks/session-handover/lib/relaunch-core.cjs:63-80` (new constants), `:448-468` (`goalPacketProblem`), `:490-600` (`goalRoots`, `realPathOrNull`, `repositoryWorktrees`, `noteGoalRoot`, `usableGoal`), `:700-760` (`latestGoalLogEntry`), `:819-900` (`claudeGoalPacketResult`), `:906-960` (`logTailText`, `worktreeHeadlinePackets`), `:1354-1390` (`goalHeadlinePackets`), `:1501-1525` (`recordGoalPacket`)
- `.skilled/hooks/session-handover/bin/session-handover.cjs:383-425` (`goalRoots`, `noteGoal`, `recordGoalPacket`), `:746-760` (`claim`), `:844-900` (`consume`)
- `.skilled/bin/skilled-loop:195-215` (`consumed_field`), `:447-480` (`render_goal_slice`), `:481-515` (`seeded_goal_packet`), `:1234-1250` (seeded first launch), `:1455-1465` (hop render)
- `.skilled/hooks/session-handover/lib/goal-handover.cjs:60-140` (`packetRoot`, `renderGoalSlice`)
- `.skilled/hooks/session-handover/tests/session-handover-cli.test.cjs:3940-4092`, `tests/skilled-loop-wrapper-claim-goal.test.cjs:859-923`, `tests/relaunch-core.test.cjs:3305-3323`
- Packet docs: `spec.md`, `tasks.md`, `implementation-summary.md`, `goal.md`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **The worktree search reads only the last 16 MB of the session log, so a long session loses the goal the phase exists to carry** -- `.skilled/hooks/session-handover/lib/relaunch-core.cjs:906-920` -- `logTailText` reads `Math.min(size, GOAL_LOG_MAX_TAIL_BYTES)` bytes from the end of the log and nothing else, and `worktreeHeadlinePackets` (`:939-941`) decides whether a worktree is "named" from that text alone. The goal entry itself is found anywhere in the log, because `latestGoalLogEntry` (`:731-757`) widens the tail and then scans the bytes before it. The two reads disagree: a session whose worktree path appears only before the last 16 MB has its goal entry found but its worktree judged unnamed, so `worktreeHeadlinePackets` returns `[]` and `claudeGoalPacketResult` (`:895-897`) reports `the active goal names no packet this hand-over can find` -- the exact symptom REQ-001 removes. `implementation-summary.md` Known Limitation 2 names only "paths its log never records", which does not cover a path the log records outside the tail.
   Finding class: incomplete-implementation
   Scope proof: the read is bounded at `relaunch-core.cjs:63` (`GOAL_LOG_MAX_TAIL_BYTES = 16 * 1024 * 1024`) and consumed at `:939-941`; no widening or head scan exists on this path, unlike `:731-757`.
   Affected surface hints: `.skilled/hooks/session-handover/lib/relaunch-core.cjs` (`logTailText`, `worktreeHeadlinePackets`), `.skilled/hooks/session-handover/goal-carry-over.md` section 3, `implementation-summary.md` Known Limitations
   Case: a Claude session works in worktree 505 early, then runs long enough that its JSONL log passes 16 MB; the worktree path sits in the first 4 MB. `prepare` finds the goal entry, lists the worktree, reads the tail, does not find the path, skips the worktree, and writes no `goal_packet` -- the operator sets the goal by hand, which D1 forbids.

```json
{
  "type": "claim-adjudication",
  "claim": "The worktree-naming search reads a bounded 16 MB tail while the goal-entry search reads the whole log, so a worktree named only before the tail is treated as unnamed and the goal is dropped.",
  "evidenceRefs": [
    ".skilled/hooks/session-handover/lib/relaunch-core.cjs:63",
    ".skilled/hooks/session-handover/lib/relaunch-core.cjs:906-920",
    ".skilled/hooks/session-handover/lib/relaunch-core.cjs:939-941",
    ".skilled/hooks/session-handover/lib/relaunch-core.cjs:731-757",
    ".skilled/hooks/session-handover/lib/relaunch-core.cjs:895-897"
  ],
  "counterevidenceSought": "Looked for a widening loop or head scan on the worktree path (none: logTailText is a single bounded read), for a documented limitation covering the tail cap (Known Limitation 2 covers only paths the log never records), and for a caller that passes a pre-read log text (none: worktreeHeadlinePackets calls logTailText itself).",
  "alternativeExplanation": "The 16 MB cap may be treated as unreachable because the real session 123e1c5d logged 268 worktree-path occurrences. That argues the case is uncommon, not that it is out of reach: the cap is a fixed byte count and a long session crosses it.",
  "finalSeverity": "P1",
  "confidence": "medium",
  "downgradeTrigger": "Downgrade to P2 if a Claude session log is shown to be capped well below 16 MB by the runtime, or if the worktree path is shown to be re-logged near the end of every session."
}
```

### P2 Findings

1. **The two-worktree refusal always reports "2 packets" even when more worktrees carry the headline** -- `.skilled/hooks/session-handover/lib/relaunch-core.cjs:954-957` -- `worktreeHeadlinePackets` returns as soon as `found.length > 1`, so `found.length` is exactly 2 whenever two or more worktrees match. `claudeGoalPacketResult:896` interpolates that into `the active goal headline appears in ${found.length} packets`, which an operator reads as an exact count. The pre-existing `goalHeadlinePackets:1384` has the same early return, so the wording is consistent with the older path; the new path inherits the imprecision rather than introducing a new convention.
   Finding class: message-accuracy
   Scope proof: the early return is at `:956`; the interpolation is at `:896`; the CLI test at `session-handover-cli.test.cjs:4058` pins the string to `2`.
   Affected surface hints: `.skilled/hooks/session-handover/lib/relaunch-core.cjs` (`worktreeHeadlinePackets`, `claudeGoalPacketResult`), `.skilled/hooks/session-handover/tests/session-handover-cli.test.cjs`
   Case: three linked worktrees each hold `specs/mcp/001-worktree-only-hub/goal.md` with the same opening line. `prepare` prints `the active goal headline appears in 2 packets`, so the operator who removes one worktree's copy still sees a refusal and has no signal that a third copy exists.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | partial | REQ-001 (`spec.md:118`) is implemented by `repositoryWorktrees:513` and `worktreeHeadlinePackets:936`, but the bounded tail at `:906-920` narrows "the worktrees the session log names" to "the worktrees named in the last 16 MB". REQ-002 (`spec.md:119`) is implemented at `skilled-loop:1460` and `:1240`. REQ-003 (`spec.md:120`) is implemented by `noteGoalRoot:547-553`. REQ-004 (`spec.md:126`) is implemented at `:954-957`. |
| `checklist_evidence` | core | partial | `tasks.md` T003-T007 are marked `[x]`; T003's verify line ("the three CLI worktree tests print `pass 3`") is backed by four new CLI tests at `session-handover-cli.test.cjs:3985-4092`, one more than the task names. T010's real-session probe is recorded in `implementation-summary.md` but is not reproducible in this lineage, so it is accepted as packet evidence, not re-measured. |

## Integration Evidence

- `.skilled/bin/skilled-loop:461` calls `renderGoalSlice(goalRoot ? { packet, roots: [goalRoot] } : { packet })`; `goal-handover.cjs:95-104` accepts `roots` and `packetRoot:68` checks containment inside it, so the worktree root reaches the render as a single-root search.
- `.skilled/bin/skilled-loop:1460` reads the hop root through `consumed_field goal_root`, which `session-handover.cjs:897` writes only when non-empty; `consume_record` runs at `:1391`, before the render at `:1460`, so the field is present when read.
- `.skilled/bin/skilled-loop:1237-1243` splits the seeded two-line reply on the first newline; `seeded_goal_packet:511` emits `packet + "\n" + root` only when both are non-empty, so a packet-only reply still parses.

## Edge Cases

- **Ambiguity: `roots[0]` is assumed to be the repository root.** `worktreeHeadlinePackets:939` passes `roots[0]` to `repositoryWorktrees`. Every production caller builds roots as `[repoRoot, noteCwd]` (`session-handover.cjs:384-386`), so the assumption holds today; a future caller that reorders roots would list the wrong repository. Recorded, not raised: no current caller sends the failing input.
- **Ambiguity: a stale `goal_root` drops the goal instead of falling back to the usual roots.** `usableGoal:580-583` returns `none` when `noteGoalRoot` rejects the root. This is decision D2 ("readers accept it only while `git worktree list` names it"), so it is a frozen choice, not a defect. The next `prepare` re-resolves and rewrites both fields.
- **Missing dependency: the real session log and the 26-worktree repository are not present in this lineage.** SC-001 and the 14-second walk measurement are taken from `spec.md` and `implementation-summary.md` rather than re-measured. This narrows what the iteration can prove; it does not convert the claim into a pass.
- **Partial success: the budget manifest is a tracked repository file.** `goal-handover.cjs:127` refuses a slice with no budget, and the manifest is `.skilled/skills/system-spec-kit/templates/spec-kit-docs.json`, which a linked worktree shares through the same commit. The wrapper test writes it into the worktree (`skilled-loop-wrapper-claim-goal.test.cjs:519-536`), which matches that reality.

## Confirmed-Clean Surfaces

- `recordGoalPacket:1501-1525` writes `goal_root` only beside a packet and removes it when the packet goes or is found in the usual roots; the new core test at `relaunch-core.test.cjs:3305-3323` exercises all four transitions.
- `repositoryWorktrees:513-543` fails closed on a spawn error, a non-zero status and a timeout, drops the repository root itself, and dedupes by real path.
- `noteGoalRoot:547-553` rejects a relative, missing or unlisted root, so a hand-edited note cannot widen the packet search to an arbitrary directory.
- `usableGoal:568-588` keeps the pre-existing `goalRoots` path unchanged when the note carries no `goal_root`, so a packet on main resolves exactly as before.
- `consume:894-897` adds `goal_root` only when non-empty, so a note without a worktree keeps the output shape its callers already parse.

## Ruled Out

- **`goal_root` written unquoted into the frontmatter.** `updateFrontmatter:256` writes `${key}: ${value}` with no quoting, but `cwd` is an absolute path written the same way and read back the same way (`usableGoal:585`), so `goal_root` follows an established convention rather than introducing a parsing risk.
- **Git config variables redirecting the worktree list.** `GIT_REPOSITORY_VARIABLES:74-77` strips the seven variables that move git's repository, work tree, common dir, index, namespace, ceiling and filesystem discovery. `GIT_CONFIG_*` cannot redirect `worktree list` away from the repository `-C` names, so no exploit path was found.
- **A `goal_root` that points at a worktree of another repository.** `repositoryWorktrees` runs `git -C <repoRoot> worktree list`, which lists only this repository's checkouts, so a foreign worktree never matches.
- **The seeded two-line protocol breaking on a packet-only reply.** `seeded_goal_packet:511` emits the root line only when the root is non-empty, and `skilled-loop:1239-1243` leaves `goal_root` empty when no newline is present.

## Next Focus

- Dimension: security
- Focus area: the trust boundary around `goal_root` -- `noteGoalRoot`, `repositoryWorktrees` environment scrubbing, and the `renderGoalSlice` single-root search
- Reason: iteration 1 confirmed the field is validated against `git worktree list`, but the note is an operator- and model-writable file and the root decides which directory a `goal.cjs` subprocess reads
- Rotation status: correctness complete, rotating to security
- Blocked/productive carry-forward: productive -- the bounded-tail finding came from comparing two reads of the same log; carry that comparison habit into the security pass
- Required evidence: `file:line` for every trust-boundary claim, plus the containment check each path relies on
- Recovery note: not applicable

Review verdict: CONDITIONAL
