<!-- dispatch: cursor 433; ledger: 2026-09-28T14:05:09Z 2026-09-28T14:06:59Z 0 110 -->

RESULT: PASS | scenario=433 | runtime=cursor
NATIVE: none visible
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | echo WORK \| SPECKIT_CLAUDE_HOOK_TIMEOUT_MS=300 node HOOK > short.json | 0 | short-budget exit=0 | All three runs exit 0 | yes |
| 2 | echo WORK \| node HOOK > default.json | 0 | default-budget exit=0 | All three runs exit 0 | yes |
| 3 | echo CASUAL \| node HOOK > casual.json | 0 | casual exit=0 | All three runs exit 0 | yes |
| 4 | python3 first additionalContext line for short | 0 | short: Advisor: outage (fail_open); route by hand: node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<request>"}' --format json | short: starts with Advisor: outage (fail_open); route by hand: | yes |
| 5 | python3 first additionalContext line for default | 0 | default: Advisor: outage (fail_open); route by hand: node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<request>"}' --format json | default: starts with Advisor: live;, Advisor: stale; or Advisor: outage (fail_open); | yes |
| 6 | python3 first additionalContext line for casual | 0 | casual: Advisor: prompt skipped. | casual: Advisor: prompt skipped. | yes |
| 7 | teardown wait, shasum compare, lsof, rm sandbox | 0 | live generation file unchanged; sandbox advisor exited; sandbox removed | live generation file unchanged then sandbox advisor exited; sandbox removed | yes |
DEVIATIONS: Dropped `gtimeout 20` from the three hook calls because gtimeout is not installed. Every other part of the block ran unchanged in one shell, including the teardown.
NOTES: Each hook also wrote a JSON status line to stderr (short and default: status fail_open, errorCode NONZERO_EXIT, CLI fallback timed out; casual: status skipped, short_casual_acknowledgement). Stdout first lines and exit codes matched. The default run landed on the allowed outage line. Teardown removed the sandbox.
