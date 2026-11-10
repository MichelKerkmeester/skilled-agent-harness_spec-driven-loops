<!-- dispatch: cursor 433; ledger: 2026-09-27T13:59:15Z 2026-09-27T14:00:50Z 0 95 -->

RESULT: PASS | scenario=433 | runtime=cursor
NATIVE: none visible
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | echo WORK \| SPECKIT_CLAUDE_HOOK_TIMEOUT_MS=300 node HOOK > short.json | 0 | short: Advisor: outage (fail_open); route by hand: node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<request>"}' --format json | exit 0; first line starts with `Advisor: outage (fail_open); route by hand:` | yes |
| 2 | echo WORK \| node HOOK > default.json | 0 | default: Advisor: outage (fail_open); route by hand: node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<request>"}' --format json | exit 0; first line starts with `Advisor: live;`, `Advisor: stale;` or `Advisor: outage (fail_open);` | yes |
| 3 | echo CASUAL \| node HOOK > casual.json | 0 | casual: Advisor: prompt skipped. | exit 0; first line is `Advisor: prompt skipped.` | yes |
| 4 | teardown: stop sandbox launcher, shasum GEN, rm sandbox | 0 | sandbox launcher 13324 stopped; live generation file unchanged | teardown prints `live generation file unchanged` | yes |
DEVIATIONS: gtimeout is not installed. Each of the three hook calls ran without `gtimeout 20`. Every other part of the commands was kept, including SPECKIT_CLAUDE_HOOK_TIMEOUT_MS=300 on the short run, the sandbox socket and database directories, and the teardown block.
NOTES: Teardown printed `sandbox launcher 13324 stopped`, then `live generation file unchanged`, then the sandbox directory was removed. Hook stderr also printed one JSON status object per run (fail_open / fail_open / skipped); those lines were not the additionalContext first lines.
