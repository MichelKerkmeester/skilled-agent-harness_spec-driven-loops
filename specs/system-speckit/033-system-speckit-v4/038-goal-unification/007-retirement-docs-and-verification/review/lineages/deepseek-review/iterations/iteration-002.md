---
title: "Iteration 2: Security — packet-path escape, log serialization, lifecycle transitions"
trigger_phrases: []
---
# Iteration 2: Security — packet-path escape, log serialization, lifecycle transitions

## Focus

The packet path as operator input (lexical guard versus symlinks), serialization of the packet log and the scope of its lock, input hardening of log rows, and the state transitions that gain or lose the packet pointer.

## Files Reviewed

- `.opencode/hooks/goal/lib/goal-slice.cjs` (`resolvePacketDir`, `readPacketGoal`)
- `.opencode/hooks/goal/lib/goal-core.cjs` (`acquireFileLock`, `withFileLocks`, `packetLockName`, `bindGoal`, `unbindGoal`, `appendGoalLog`, `setGoal`)
- `.opencode/hooks/goal/bin/goal.cjs` (bind, log, unbind envelopes)
- `.opencode/plugins/opencode-goal.js` (`GOAL_ACTIONS`, `setGoal`, `bindGoal`, `mutateGoal`, `executeGoalAction`)
- `.opencode/hooks/goal/lib/goal-core.test.cjs:795-857`
- `.opencode/commands/goal-opencode.md`
- `.opencode/hooks/goal/README.md:60`

## Scorecard

- Dimensions covered: security (primary), correctness, maintainability
- New findings: P0=0 P1=1 P2=4
- New findings ratio: 1.00

## Findings

### P0

- None.

### P1

- **F005**: Symlinked packet path escapes the workspace: bind reads and log writes a goal.md outside it — `.opencode/hooks/goal/lib/goal-slice.cjs:131` — The guard at `:131-138` refuses only lexical escapes; a symlinked directory inside the workspace resolves textually and `readPacketGoal` follows it. Observed with the shipped CLI on a fixture: `bind linked-packet` returned `STATUS=OK mutation=bound`, and `log "escape probe | Done | wrote outside"` appended the row into `/tmp/gt-escape/outside/goal.md`. ADR-001 and `README.md:60` require the path to resolve inside the workspace; `goal-core.test.cjs:795` covers only the lexical case. [SOURCE: .../decision-record.md:57] [SOURCE: .opencode/hooks/goal/lib/goal-slice.cjs:131]

### P2

- **F006**: Log serialization is stateDir-scoped and the durable-slice guard is an advisory pre-write check — `.opencode/hooks/goal/lib/goal-core.cjs:1046` — `appendGoalLog` locks `packetLockName` under the caller's stateDir (`:894` hashes workspace+packetPath, the lock directory does not); two sessions with different state roots share no lock, and the hash guard at `:1069` refuses after a re-read rather than comparing-and-swapping. The suite pins same-state-dir behavior only. [SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:1046] [SOURCE: .opencode/hooks/goal/lib/goal-core.test.cjs:832]
- **F007**: OpenCode plugin exposes no unbind and no log action, so ADR-007's log authority is unreachable through the primary tool — `.opencode/plugins/opencode-goal.js:168` — `GOAL_ACTIONS` lists set, bind, resent, packet, show, clear, complete, pause, history, resume, doctor, health; no `appendGoalLog` or `unbindGoal` exists in the plugin, and `/goal-opencode`'s contract matches. Core and the CLI expose both. [SOURCE: .opencode/plugins/opencode-goal.js:168] [SOURCE: .opencode/hooks/goal/lib/goal-core.test.cjs:841]
- **F008**: Setting a new objective on a bound record silently drops the packet pointer — `.opencode/plugins/opencode-goal.js:1792` — The `replaced` branch returns `buildNewGoal(...)` with no `packetPath`/`workspace`/`boundAtMs`; core mirrors it through `buildNewRecord` (`goal-core.cjs:1140-1150`). Only `unbindGoal` is documented as dropping the pointer, and ADR-001 says it is written only by a deliberate bind. No test covers set-on-bound. [SOURCE: .../decision-record.md:57] [SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:1140]
- **F009**: Rebinding never archives the prior record: core's replace branch is dead code and the plugin has no archive path — `.opencode/hooks/goal/lib/goal-core.cjs:937` — `base` is a spread copy (`:934-936`), so `base === current` is never true and `archiveGoalRecord` on that line is unreachable; the plugin sets `mutation='rebound'` with no archive call (`opencode-goal.js:1830`). set/complete/pause still archive. [SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:937] [SOURCE: .opencode/plugins/opencode-goal.js:1830]

## Claim Adjudication

```json
{"findingId":"F005","claim":"A packet path that is a symlink to a directory outside the workspace passes the only guard, so bind reads and log writes a goal.md outside the workspace.","evidenceRefs":[".opencode/hooks/goal/lib/goal-slice.cjs:131-138",".opencode/hooks/goal/bin/goal.cjs",".opencode/hooks/goal/lib/goal-core.test.cjs:795"],"counterevidenceSought":"Read resolvePacketDir and readPacketGoal; ran the fixture end-to-end through the shipped CLI and verified the outside file received the appended row; checked for a realpath-based guard anywhere in the hook tree (none).","alternativeExplanation":"The guard could be considered sufficient because the operator supplies the path, but the frozen decision and README both promise refusal outside the workspace, and the log action turns the read into a write.","finalSeverity":"P1","confidence":0.98,"downgradeTrigger":"Downgrade if packet resolution realpaths the target and refuses a symlinked or outside-resolving packet directory, or if the decision explicitly accepts symlinked packets.","transitions":[{"iteration":2,"from":null,"to":"P1","reason":"Initial observed escape"}]}
```

## Traceability Checks

- Not the dedicated traceability iteration; ADR-001's workspace constraint, ADR-002's store rationale, ADR-005's capability decision and ADR-007's log authority were read as bearing decisions.

## Assessment

- New findings ratio: 1.00
- Dimensions addressed: security, correctness, maintainability
- Novelty justification: one reproduced path escape, one lock-scope limitation, one capability gap, two lifecycle-state defects.

## Ruled Out

- Log-row injection altering the durable slice: ruled out; `sanitizeInlineText` collapses newlines and the handler refuses any write whose durable hash changed (`goal-core.cjs:1038-1041,1069`), pinned by `goal-core.test.cjs:814`. [SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:1069]
- Lexical path escape: ruled out; `../outside`, absolute and empty targets are refused (`goal-slice.cjs:132-136`; test `goal-core.test.cjs:795`). [SOURCE: .opencode/hooks/goal/lib/goal-slice.cjs:132]
- Resend hash stability: ruled out; a log append and a reflow do not change the hash while a criterion change does (`goal-core.test.cjs:801`). [SOURCE: .opencode/hooks/goal/lib/goal-core.test.cjs:801]
- State-file atomicity and modes: ruled out for this review; temp+fsync+rename with 0600/0700 documented and unchanged. [SOURCE: .opencode/hooks/goal/README.md:52]

## Dead Ends

- Treating the per-packet lock as sufficient without naming the state-dir precondition: the lock name is packet-scoped but its directory is not.
- Expecting the plugin's record replacement to preserve the pointer: `buildNewGoal` starts from an empty record by construction.

Review verdict: CONDITIONAL
