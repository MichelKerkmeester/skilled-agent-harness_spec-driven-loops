# Iteration 003 - Correctness Review

## Dimension

Correctness: logic correctness & state-machine edge cases.

## Files Reviewed

- `.opencode/plugins/mk-goal.js` full file, with focus on state mutation, usage accounting, verifier, continuation, injection, and tool execution paths.
- `.opencode/commands/goal.md` full file, with focus on router contract and plugin-tool calls.
- Directly coupled evidence inspected: `mk-goal-*` tests and goal plugin phase/spec notes for usage dedupe and continuation contracts.

## Findings by Severity

### P0

None.

### P1

#### R3-P1-001 - `.opencode/plugins/mk-goal.js:681`

Why: `setGoal` computes `tokenBudget` from the current goal before it knows whether it is reusing the same objective or replacing it, then the same-objective branch spreads the whole current record back into an `active` goal. A normal trigger is: a goal reaches `budget_limited`, then the user runs `/goal set <same objective>` to restart it. The plugin flips the record back to `active` while preserving `tokensUsed`, `tokenBudget`, stale verifier fields, and old completion metadata. A different new objective also inherits the previous goal's token budget when no new budget is supplied.

Suggested fix direction: Treat terminal or budget-limited records as a fresh goal on `set`, reset verifier/completion/usage/continuation fields when reactivating, and default a replacement goal's budget to `null` unless the caller explicitly passes `tokenBudget`.

#### R3-P1-002 - `.opencode/plugins/mk-goal.js:760`

Why: Usage dedupe only compares the incoming `messageID` with one stored `lastAccountedMessageID`, then overwrites that single slot. A repeated `message.updated` for message A is skipped only if it arrives immediately after A; an A/B/A event order charges A twice. That can silently inflate `tokensUsed` and prematurely move an active goal to `budget_limited`. The lifecycle test covers only the adjacent duplicate case.

Suggested fix direction: Store a bounded per-goal set/map of accounted message ids, or track per-message cumulative usage and apply deltas. If an event has usage but no stable message id, fail closed for budget accounting or derive a stable event key before charging.

### P2

#### R3-P2-001 - `.opencode/commands/goal.md:30`

Why: The router contract says unsupported verbs emit `STATUS=FAIL ERROR="unknown action: <verb>"`, but the execution order later routes any other non-empty query to `mk_goal({ action: "set", objective: QUERY })`. In practice `/goal delete` or `/goal resume` would create an objective named `delete`/`resume` rather than failing as line 30 promises.

Suggested fix direction: Pick one contract. Either remove the unsupported-verb failure promise and document all unknown text as an objective, or add explicit verb detection so command-like unknown verbs fail while ordinary bare objectives still route to `set`.

## Verdict

CONDITIONAL

## Notes

The core state store is mostly defensive: missing session ids fail closed, writes are queued in-process and atomic, supervisor updates compare the goal id before applying, and active continuation is default-off. The two P1s are state-machine edge defects around goal replacement and usage accounting, both plausible in normal long-running sessions.
