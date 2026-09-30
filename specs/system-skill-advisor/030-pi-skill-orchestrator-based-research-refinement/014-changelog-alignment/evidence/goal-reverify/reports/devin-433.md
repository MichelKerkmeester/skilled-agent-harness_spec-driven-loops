<!-- dispatch: devin 433; ledger: 2026-09-28T14:03:26Z 2026-09-28T14:05:09Z 0 103 -->

STEP 0: The Advisor line from my prompt context is `Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.`

Now reading the scenario file.Read the scenario. It drives the compiled Claude hook script directly against a sandbox socket/db dir — three runs (short budget, default budget, casual), then a signal-free teardown that waits for the sandbox daemon to idle out. `gtimeout` isn't installed here, so I'll drop `gtimeout 20` from the three hook calls per instructions and run the rest verbatim in one shell.

Quick pre-check that the hook script and node exist:Prerequisites present. Running the full block in one shell now — only change is removing `gtimeout 20 ` from the three hook calls.The hook runs finished — all three exited 0 with the expected first lines. The block is now in the teardown wait loop (it sleeps at least 25 iterations while the sandbox daemon idles out). Waiting for it to finish.RESULT: PASS | scenario=433 | runtime=devin
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | `echo "$WORK" \| SPECKIT_CLAUDE_HOOK_TIMEOUT_MS=300 node "$HOOK" > short.json` | 0 | stderr-side status JSON: `status:"fail_open"`, `errorCode:"NONZERO_EXIT"`, `errorDetails:"CLI_RETRYABLE_UNAVAILABLE exit 75: CLI fallback timed out"`, durationMs=309 | exit 0 | yes |
| 2 | `echo "$WORK" \| node "$HOOK" > default.json` | 0 | `status:"fail_open"`, same `CLI_RETRYABLE_UNAVAILABLE exit 75`, durationMs=2509 | exit 0 | yes |
| 3 | `echo "$CASUAL" \| node "$HOOK" > casual.json` | 0 | `status:"skipped"`, `errorDetails:"short_casual_acknowledgement"`, durationMs=5 | exit 0 | yes |
| 4 | python3 first-line extraction — `short:` | 0 | `short: Advisor: outage (fail_open); route by hand: node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<request>"}' --format json` | first line starts with `Advisor: outage (fail_open); route by hand:` | yes |
| 5 | python3 first-line extraction — `default:` | 0 | `default: Advisor: outage (fail_open); route by hand: ...` | first line starts with `Advisor: live;`, `Advisor: stale;` or `Advisor: outage (fail_open);` | yes |
| 6 | python3 first-line extraction — `casual:` | 0 | `casual: Advisor: prompt skipped.` | first line is `Advisor: prompt skipped.` | yes |
| 7 | teardown wait loop + shasum check + sandbox removal (no signal sent) | 0 | `live generation file unchanged` then `sandbox advisor exited; sandbox removed`; block exit 0 | teardown prints `live generation file unchanged` and `sandbox advisor exited; sandbox removed`; no `/tmp/cli-playbook.*` left | yes |
DEVIATIONS: `gtimeout` is not installed on this machine (macOS), so `gtimeout 20 ` was removed from the three hook invocations as instructed. Every other line of the block ran verbatim in one shell.
NOTES: The sandbox CLI fallback timed out rather than starting a sandbox daemon in time, so `default:` rendered the outage line instead of `live`/`stale` — the scenario explicitly lists all three as pass. The status JSON objects printed to the terminal are the hook's stderr diagnostics; the `additionalContext` payloads were captured in the sandbox JSON files (removed by teardown). The wait loop took ~60s of idle polling before the sandbox was confirmed clear and removed; nothing held it, consistent with no daemon having started.
