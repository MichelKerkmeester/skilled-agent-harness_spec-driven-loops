<!-- dispatch: devin 433; ledger: 2026-09-28T07:38:45Z 2026-09-28T07:40:29Z 0 104 -->

STEP 0: The `Advisor:` line in my context is:
`Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.`

Now I'll read the scenario file.I've read the scenario. It drives the compiled Claude hook script three times (300 ms budget, default budget, casual prompt) against a sandbox socket/db dir, then tears down without signaling. Per the dispatch, I'll drop `gtimeout 20` from the three hook calls and run the whole block in one shell from the repo root. The teardown wait loop can take up to ~60 s, so I'll allow a generous timeout.The three hook runs completed with matching signals; the teardown wait loop is still running. I'll wait for it to finish.The teardown printed `live generation file CHANGED`, which the scenario marks as a Fail condition. Let me quickly verify the sandbox is gone and check what changed in the repo.RESULT: FAIL | scenario=433 | runtime=devin
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---|---|---|---|
| 1 | `mktemp -d`, export `SPECKIT_IPC_SOCKET_DIR`, `SYSTEM_SKILL_ADVISOR_DB_DIR`, `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED=0`, `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN=0.2`, capture `GEN_BEFORE` | 0 | Sandbox created; env pointed at `$SANDBOX/sock` and `$SANDBOX/db` | Sandbox dirs under mktemp; never touches host daemon/db | yes |
| 2 | `echo "$WORK" \| SPECKIT_CLAUDE_HOOK_TIMEOUT_MS=300 node "$HOOK"` | 0 | `short-budget exit=0`; stderr status: `fail_open`, `NONZERO_EXIT`, `CLI fallback timed out`, durationMs=308 | Exit 0; first line starts `Advisor: outage (fail_open); route by hand:` | yes |
| 3 | `echo "$WORK" \| node "$HOOK"` | 0 | `default-budget exit=0`; status `ok`/`stale`, errorDetails `advisor-server-post-index-assertion-failed`, durationMs=2316 | Exit 0; first line starts `Advisor: live;`, `Advisor: stale;` or `Advisor: outage (fail_open);` | yes |
| 4 | `echo "$CASUAL" \| node "$HOOK"` | 0 | `casual exit=0`; status `skipped`, `short_casual_acknowledgement`, durationMs=3 | Exit 0; first line `Advisor: prompt skipped.` | yes |
| 5 | `for f in short default casual; do python3 … additionalContext.splitlines()[0]` | 0 | `short: Advisor: outage (fail_open); route by hand: node .skilled/bin/skill-advisor.cjs advisor_recommend …` / `default: Advisor: stale; ambiguous: system-skill-advisor 0.82/0.34 vs sk-vision 0.82/0.30 pass.` / `casual: Advisor: prompt skipped.` | Same three expected signals | yes |
| 6 | Teardown wait loop + `shasum "$GEN"` vs `GEN_BEFORE` | 0 | `live generation file CHANGED` | `live generation file unchanged` | **NO** |
| 7 | `rm -r "$SANDBOX"` branch of teardown | 0 | `sandbox advisor exited; sandbox removed`; no `/tmp/cli-playbook.*` remains (verified) | `sandbox advisor exited; sandbox removed`; no leftover folder | yes |
DEVIATIONS: `gtimeout` is not installed; the three hook calls ran without `gtimeout 20` as instructed. No other part of the block was changed; the whole block ran in one shell from the repository root.
NOTES: The only mismatch is step 6: `skill-graph-generation.json` changed between the pre-run and post-run `shasum`. The file is gitignored live state, so the repo is not dirtied. The `default:` run surfaced `advisor-server-post-index-assertion-failed` with a `stale` verdict — plausibly the sandbox daemon (or the concurrently live daemon) rewrote the shared generation file during the ~30 s run; the scenario counts any change as Fail regardless of cause. Sandbox daemon exited on its own; no signal was sent; no `/tmp/cli-playbook.*` folder remains.
