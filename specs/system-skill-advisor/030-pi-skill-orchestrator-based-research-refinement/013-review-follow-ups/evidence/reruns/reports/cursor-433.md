<!-- dispatch: cursor 433; ledger: 2026-09-28T07:40:29Z 2026-09-28T07:42:35Z 0 126 -->

RESULT: PASS | scenario=433 | runtime=cursor
NATIVE: none visible
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | echo WORK \| SPECKIT_CLAUDE_HOOK_TIMEOUT_MS=300 node HOOK > short.json | 0 | short: Advisor: outage (fail_open); route by hand: node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<request>"}' --format json | exit 0; first line starts with `Advisor: outage (fail_open); route by hand:` | yes |
| 2 | echo WORK \| node HOOK > default.json | 0 | default: Advisor: live; ambiguous: system-skill-advisor 0.82/0.34 vs sk-vision 0.82/0.30 pass. | exit 0; first line starts with `Advisor: live;`, `Advisor: stale;` or `Advisor: outage (fail_open);` | yes |
| 3 | echo CASUAL \| node HOOK > casual.json | 0 | casual: Advisor: prompt skipped. | exit 0; first line is `Advisor: prompt skipped.` | yes |
| 4 | teardown wait, shasum compare, lsof check, rm sandbox | 0 | live generation file unchanged / sandbox advisor exited; sandbox removed | prints `live generation file unchanged` and `sandbox advisor exited; sandbox removed` | yes |
DEVIATIONS: Dropped `gtimeout 20` from the three hook invocations because gtimeout is not installed. Every other token in the block was unchanged, and the block ran in one shell.
NOTES: Hook stderr printed JSON status lines (fail_open, ok/live, skipped) before each exit echo. Those lines are not the additionalContext first lines. The three additionalContext first lines and both teardown lines matched. The block finished in about 29s and removed the sandbox.
