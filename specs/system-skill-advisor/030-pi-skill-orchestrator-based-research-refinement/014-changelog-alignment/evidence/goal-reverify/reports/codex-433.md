<!-- dispatch: codex 433; ledger: 2026-09-28T14:06:59Z 2026-09-28T14:08:34Z 0 95 -->

RESULT: PASS | scenario=433 | runtime=Codex
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---:|---|---|---|
| 1 | Short-budget hook call | 0 | `Advisor: outage (fail_open); route by hand:` | Starts with the outage line | Yes |
| 2 | Default-budget hook call | 0 | `Advisor: outage (fail_open); route by hand:` | Starts with live, stale or outage line | Yes |
| 3 | Casual-prompt hook call | 0 | `Advisor: prompt skipped.` | Exactly `Advisor: prompt skipped.` | Yes |
| 4 | Teardown | 0 | `live generation file unchanged`; `sandbox advisor exited; sandbox removed` | Both lines printed; sandbox removed | Yes |
DEVIATIONS: Removed `gtimeout 20` from each hook call because it is unavailable, as instructed. No other command was changed.
NOTES: None
