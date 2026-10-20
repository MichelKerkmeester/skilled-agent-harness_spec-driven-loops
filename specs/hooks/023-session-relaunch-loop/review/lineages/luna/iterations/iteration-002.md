# Iteration 2 — correctness

## Dimension

Correctness: suppression guards, reminder state, and nudge delivery across the automatic adapters.

## Files Reviewed

- .skilled/hooks/session-relaunch/lib/nudge.cjs:270-310, 318-458, 466-500
- .skilled/hooks/session-relaunch/pi/session-relaunch.ts:313-403
- .skilled/hooks/session-relaunch/opencode/session-relaunch.js:110-153, 329-347
- .skilled/hooks/session-relaunch/codex/shared.mjs:65-115
- .skilled/hooks/session-relaunch/hermes/context-nudge.mjs:54-103
- .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:485-503
- .skilled/hooks/session-relaunch/tests/nudge.test.cjs:655-658, 700-755, 1012-1066
- specs/hooks/023-session-relaunch-loop/review/lineages/luna/steer.md:1-23

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

- The phase 013 requirement says a nudge is useful only inside skilled-loop; the shared decision returns quietly when the wrapper identifier is absent.
- The phase 016 review target asks for each automatic runtime. Claude, Pi, OpenCode, Codex, and Hermes use the shared suppression and threshold decision; Pi and OpenCode add stateful delivery behavior that was reviewed here.
- Checklist evidence and the command-contract dimension remain assigned to later passes.

## Edge Cases and Ruled Out

- Threshold comparison is inclusive, and the one extra reminder is allowed at threshold plus 0.05; shared tests cover the boundary and the spent-level case.
- Pending handoff records suppress repeat prompts. Armed records suppress only while still current under the wrapper's max-age rule.
- The earlier DS-009 report claimed a future armedAt remained fresh after a backward clock change. Current shouldRelaunch explicitly returns stale when now is earlier than armedAt, so that finding is no longer present in this code.
- Pi holds its prompt until agent_end, attempts arming first, and drops the held text only when a live handoff or hop cap makes it redundant.
- OpenCode queues the nudge, records the level as it consumes pending output, and requests replay after plugin restart only when a level is persisted but no active nudge exists.

## EXECUTION CONFLICT

After iteration 1's reducer pass, the generated strategy labeled “Cross-runtime adapter parity: deferred to later iterations” as BLOCKED, although the lead's steer requires every automatic runtime and chain step to be reviewed. This is an internal strategy-state conflict, not a product finding. Following the dispatcher ruling and current steer, runtime coverage continues in the next iterations.

## Next Focus

Review handoff note creation, continuity save instructions, prepare validation, and runtime/session refusal paths.

## Claim Adjudication

No P0 or P1 findings were introduced in this iteration.

Review verdict: PASS