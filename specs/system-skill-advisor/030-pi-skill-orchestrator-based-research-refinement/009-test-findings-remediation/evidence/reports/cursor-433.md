<!-- dispatch: cursor 433; ledger: 2026-09-26T23:10:15Z 2026-09-26T23:11:51Z 0 96 -->

RESULT: PASS | scenario=433 | runtime=cursor
NATIVE: none visible
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | echo WORK \| SPECKIT_CLAUDE_HOOK_TIMEOUT_MS=300 node user-prompt-submit.js > short.json | 0 | short-budget exit=0 | All three runs exit 0 | yes |
| 2 | echo WORK \| node user-prompt-submit.js > default.json | 0 | default-budget exit=0 | All three runs exit 0 | yes |
| 3 | echo CASUAL \| node user-prompt-submit.js > casual.json | 0 | casual exit=0 | All three runs exit 0 | yes |
| 4 | python3 first additionalContext line for short | 0 | short: Advisor: outage (fail_open); route by hand: node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<request>"}' --format json | short: starts with Advisor: outage (fail_open); route by hand: | yes |
| 5 | python3 first additionalContext line for default | 0 | default: Advisor: stale; use sk-code 0.85/0.20 pass. | default: starts with Advisor: live;, Advisor: stale;, or Advisor: outage (fail_open); | yes |
| 6 | python3 first additionalContext line for casual | 0 | casual: Advisor: prompt skipped. | casual: Advisor: prompt skipped. | yes |
| 7 | sandbox lease teardown and shasum compare of skill-graph-generation.json | 0 | no sandbox launcher recorded; live generation file unchanged | teardown prints live generation file unchanged | yes |
DEVIATIONS: gtimeout is not installed, so `gtimeout 20` was omitted from the three hook calls. Every other argument, env var, payload, sandbox path, and teardown step was kept. Two setup echoes (`SANDBOX=`, `HOOK_EXISTS=yes`) and a final `sandbox removed` echo were added around the script.
NOTES: Teardown lines: `no sandbox launcher recorded` and `live generation file unchanged`. Sandbox `/tmp/cli-playbook.neO7SP` was removed. Hook stderr (not the judged first lines) logged short `status=fail_open` `errorCode=NONZERO_EXIT` durationMs=307, default `status=ok` `freshness=stale` durationMs=1610, casual `status=skipped` `errorDetails=short_casual_acknowledgement`. The outer 20s kill was not applied; the 300 ms budget still came from `SPECKIT_CLAUDE_HOOK_TIMEOUT_MS=300`.
