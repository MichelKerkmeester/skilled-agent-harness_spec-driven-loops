<!-- dispatch: devin 433; ledger: 2026-09-26T18:50:28Z 2026-09-26T18:51:13Z 0 45 -->

STEP 0 captured. Now reading the scenario file.Scenario 433: run the compiled Claude `user-prompt-submit` hook three times against an absent sandbox socket, check exit 0 and the first `additionalContext` line each time. First verifying the hook script exists.Hook exists. Running the scenario's command block verbatim, minus `gtimeout` per instructions.RESULT: PASS | scenario=433 | runtime=devin
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---|---|---|---|
| 1 | `echo "$WORK" \| SPECKIT_CLAUDE_HOOK_TIMEOUT_MS=300 node "$HOOK" > short.json` | 0 | `short: Advisor: outage (fail_open); route by hand: node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<request>"}' --format json` | exit 0; first line starts `Advisor: outage (fail_open); route by hand:` | yes |
| 2 | `echo "$WORK" \| node "$HOOK" > default.json` | 0 | `default: Advisor: stale; use sk-code 0.85/0.20 pass.` | exit 0; first line starts `Advisor: live;`, `Advisor: stale;` or `Advisor: outage (fail_open);` | yes |
| 3 | `echo "$CASUAL" \| node "$HOOK" > casual.json` | 0 | `casual: Advisor: prompt skipped.` | exit 0; first line is `Advisor: prompt skipped.` | yes |
DEVIATIONS: `gtimeout` is not installed; ran all three hook invocations without the `gtimeout 20` wrapper per task instruction. All other command parts kept exactly as written, including `SPECKIT_IPC_SOCKET_DIR="$SANDBOX/sock"`.
NOTES: stderr status JSON for the short run showed `status":"fail_open","errorCode":"NONZERO_EXIT","errorDetails":"CLI_RETRYABLE_UNAVAILABLE exit 75: CLI fallback timed out` at 306ms, consistent with the 300ms hook budget ending first. Sandbox dir removed via `rm -rf "$SANDBOX"` as scripted.
