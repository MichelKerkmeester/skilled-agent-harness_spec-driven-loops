<!-- dispatch: codex 433; ledger: 2026-09-28T07:42:35Z 2026-09-28T07:43:45Z 0 70 -->

RESULT: PASS | scenario=433 | runtime=Codex
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---:|---|---|---|
| 1 | Short-budget hook call | 0 | `Advisor: outage (fail_open); route by hand:` | Exit 0; first line starts with outage status | Yes |
| 2 | Default-budget hook call | 0 | `Advisor: outage (fail_open); route by hand:` | Exit 0; first line starts with live, stale, or outage status | Yes |
| 3 | Casual hook call | 0 | `Advisor: prompt skipped.` | Exit 0; first line is `Advisor: prompt skipped.` | Yes |
| 4 | Teardown wait and cleanup | 0 | `live generation file unchanged`; `sandbox advisor exited; sandbox removed` | Both lines print; sandbox removed | Yes |
DEVIATIONS: Removed `gtimeout 20` from all three hook calls as directed because `gtimeout` is not installed. No other command or teardown changes.
NOTES: All three hook calls exited 0. No sandbox was kept.
