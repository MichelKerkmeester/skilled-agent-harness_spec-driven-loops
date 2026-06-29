# Dimension

correctness: error handling: fail-closed on missing session id, rejected actions, budget exhaustion

# Files Reviewed

- `.opencode/plugins/mk-goal.js:1-1490`
- `.opencode/commands/goal.md:1-62`
- `.opencode/plugins/__tests__/mk-goal-lifecycle.test.cjs:1-161`
- `.opencode/plugins/__tests__/mk-goal-continuation.test.cjs:1-183`
- `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/002-goal-opencode-plugin/004-lifecycle-tracking/spec.md:100-150`
- `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/002-goal-opencode-plugin/006-active-continuation/spec.md:1-175`

# Findings by Severity

## P0

None.

## P1

### R8-P1-001 - `.opencode/plugins/mk-goal.js:1381`

Why: The lifecycle handler sets the prompt blocker on `permission.asked` or `question.asked`, and `maybeContinueGoal()` refuses to continue while that blocker is present. But the same handler clears the blocker for `question.rejected` exactly like a successful reply. A normal trigger is: an active autonomous goal asks the user a question, the user rejects/dismisses it, then the next `session.idle` sees no prompt block and can send another continuation prompt. That is fail-open on a rejected action.

Suggested fix direction: split accepted replies from rejected/denied replies. Keep `blockedByPrompt` true, or set a suppression/block reason, when a question or permission is rejected so autonomy requires an explicit user reset before continuing.

Claim: Rejected prompt actions can clear the only prompt-block guard and allow autonomous continuation after user rejection.

Evidence: `.opencode/plugins/mk-goal.js:1373`, `.opencode/plugins/mk-goal.js:1381`, `.opencode/plugins/mk-goal.js:1383`, `.opencode/plugins/mk-goal.js:1100`, `.opencode/plugins/mk-goal.js:1138`

Counterevidence sought: I checked for a later rejection-specific guard, suppression write, or unit test after `question.rejected`; the code only deletes the volatile block and writes `blockedByPrompt=false`, while tests only cover `permission.asked` setting the block.

Alternative explanation: If OpenCode uses `question.rejected` to mean a harmless resolved prompt rather than user denial, clearing may be intentional. The event name and fail-closed autonomy requirement point the other way.

Final severity: P1

Confidence: med

Downgrade trigger: Downgrade if runtime documentation proves `question.rejected` is emitted only for non-user-denial cleanup events and cannot follow a user rejection that should halt continuation.

## P2

### R8-P2-001 - `.opencode/plugins/mk-goal.js:1270`

Why: `executeGoalAction()` maps any missing or invalid `args.action` to `show`. The exported tool schema declares an enum, so the normal tool path should reject invalid actions before execute, but the callee itself fails open if schema validation is bypassed or changes. That is inconsistent with the command contract's stated router-level failure mode for unsupported verbs.

Suggested fix direction: return `STATUS=FAIL` for non-empty invalid actions inside `executeGoalAction()`, while still treating an omitted action as `show` only if that is a deliberate supported API.

### R8-P2-002 - `.opencode/plugins/__tests__/mk-goal-continuation.test.cjs:116`

Why: The continuation test suite verifies active prompting and the auto-turn cap, while lifecycle tests verify message-driven budget crossing. It does not cover the continuation budget gate itself: an active goal whose stored `tokensUsed >= tokenBudget` must suppress `promptAsync` and mark `budget_limited` before dispatch. That gate is safety-critical because it is the last fail-closed check before autonomous prompting.

Suggested fix direction: add an active-mode test with an exhausted active goal, a `promptAsync` stub that fails if called, and assertions for `decision=suppressed`, `reason=budget_exhausted`, `status=budget_limited`, and `continuationSuppressed=true`.

# Verdict

CONDITIONAL

# Notes

Missing session id handling is fail-closed on the tool path: `readGoal()` and `mutateGoal()` reach `requireSessionID()`, and the tool wrappers return `STATUS=FAIL`. Budget exhaustion is implemented in both usage accounting and continuation, but the autonomous continuation budget gate lacks direct regression coverage.
