<!-- dispatch: cursor 433; ledger: 2026-09-26T18:51:13Z 2026-09-26T18:52:53Z 0 100 -->

RESULT: PASS | scenario=433 | runtime=cursor
NATIVE: none visible
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | `echo "$WORK" \| SPECKIT_CLAUDE_HOOK_TIMEOUT_MS=300 node "$HOOK"` | 0 | `Advisor: outage (fail_open); route by hand: node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<request>"}' --format json` | First line starts with `Advisor: outage (fail_open); route by hand:` | yes |
| 2 | `echo "$WORK" \| node "$HOOK"` | 0 | `Advisor: stale; use sk-code 0.85/0.20 pass.` | First line starts with `Advisor: live;`, `Advisor: stale;` or `Advisor: outage (fail_open);` | yes |
| 3 | `echo "$CASUAL" \| node "$HOOK"` | 0 | `Advisor: prompt skipped.` | First line is `Advisor: prompt skipped.` | yes |
DEVIATIONS: `gtimeout 20` was omitted from all three hook pipelines because gtimeout is not installed. Every other token was kept, including `SPECKIT_IPC_SOCKET_DIR="$SANDBOX/sock"` and `SPECKIT_CLAUDE_HOOK_TIMEOUT_MS=300` on the short run.
NOTES: Each hook also wrote one stderr status line: short `fail_open` at 307 ms (`CLI fallback timed out`), default `ok`/`stale` for `sk-code`, casual `skipped` (`short_casual_acknowledgement`). The command ran inside the Cursor tool sandbox; the scenario socket directory was still the empty mktemp path, and the python extractor read all three stdout files before the sandbox was removed.
