# Topic Report: Phase 004 route proof smoke for ai-council

## Status

- STATUS: FAIL
- Stop reason: `executor_self_invocation_blocked`
- Rounds completed: 0

## Topic Result

The topic did not dispatch a council round. The configured external executor was `cli-opencode` with `openai/gpt-5.5` and reasoning `high`, but the required self-invocation guard detected `OPENCODE_PID` in the current OpenCode runtime.

## Validation

- Route proof: FAIL
- Required `round_completed` records: absent because no literal `opencode run` subprocess was invoked.
- Agent definition loaded before failure: TRUE

## Preserved Blocker

`cli-opencode self-invocation guard blocked literal opencode subprocess from inside OpenCode`
