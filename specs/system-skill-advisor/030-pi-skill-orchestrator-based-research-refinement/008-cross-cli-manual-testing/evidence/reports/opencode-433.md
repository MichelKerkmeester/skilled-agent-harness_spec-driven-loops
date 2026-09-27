<!-- dispatch: opencode 433; ledger: 2026-09-26T18:49:25Z 2026-09-26T18:52:23Z 0 178 -->

Scenario read. STEP 0: no `Advisor:` line is visible in my runtime context for this prompt → `none visible`. Verifying the compiled hook exists, then running the sandbox steps without `gtimeout`.
Hook present. Running the scenario block verbatim minus `gtimeout`.
RESULT: PASS | scenario=433 | runtime=opencode
NATIVE: none visible
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---|---|---|---|
| 1 | `echo "$WORK" \| SPECKIT_CLAUDE_HOOK_TIMEOUT_MS=300 node $HOOK > short.json` | 0 | `short: Advisor: outage (fail_open); route by hand: node .skilled/bin/skill-advisor.cjs advisor_recommend ...` | exit 0; first line starts `Advisor: outage (fail_open); route by hand:` | yes |
| 2 | `echo "$WORK" \| node $HOOK > default.json` | 0 | `default: Advisor: outage (fail_open); route by hand: node .skilled/bin/skill-advisor.cjs advisor_recommend ...` | exit 0; first line starts `Advisor: live;`, `Advisor: stale;` or `Advisor: outage (fail_open);` | yes |
| 3 | `echo "$CASUAL" \| node $HOOK > casual.json` | 0 | `casual: Advisor: prompt skipped.` | exit 0; first line is `Advisor: prompt skipped.` | yes |
DEVIATIONS: `gtimeout` is not installed on this machine; each hook call was run without it (per dispatch instruction). All other parts of the commands kept exactly as written, including `SPECKIT_IPC_SOCKET_DIR="$SANDBOX/sock"` sandbox socket dir and `rm -rf "$SANDBOX"` cleanup.
NOTES: Hook stderr telemetry (not part of the verdict) confirms transport-down fail-open: status `fail_open`, `errorCode: NONZERO_EXIT`, `errorDetails: "CLI_RETRYABLE_UNAVAILABLE exit 75: CLI fallback timed out"` for runs 1-2, and `status: skipped` / `short_casual_acknowledgement` for run 3. The default-budget run landed on the outage line, which the scenario explicitly allows (depends on whether the CLI starts a sandbox daemon in time). Sandbox was deleted; nothing written inside the repository.
