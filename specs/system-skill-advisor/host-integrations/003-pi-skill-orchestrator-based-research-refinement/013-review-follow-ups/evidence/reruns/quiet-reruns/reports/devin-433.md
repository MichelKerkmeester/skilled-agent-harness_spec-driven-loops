<!-- dispatch: devin 433; ledger: 2026-09-28T07:44:03Z 2026-09-28T07:46:16Z 0 133 -->

STEP 0 — Advisor line captured from this prompt's context:

`Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.`

Now reading the scenario file.The scenario drives the compiled hook three times against a sandbox socket/DB dir, then tears down without signals. `gtimeout` is absent, so per instructions I'll drop `gtimeout 20` from each hook call and note it under DEVIATIONS. First, a quick check that the compiled hook exists.The glob didn't match the dotfile path — checking directly:Hook exists. Running the full scenario block in one shell, verbatim except `gtimeout 20` removed from the three hook calls. The teardown loop waits ~25+ s for the sandbox daemon's 12 s idle exit, so I'm giving it a generous timeout.All three hook runs exited 0 with the expected first lines. The teardown loop is still waiting for the sandbox daemon's idle exit — waiting for it to finish.Teardown printed both expected lines. Quick check that no sandbox folder remains:RESULT: PASS | scenario=433 | runtime=devin
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---|---|---|---|
| 1 | `echo "$WORK" \| SPECKIT_CLAUDE_HOOK_TIMEOUT_MS=300 node "$HOOK" > short.json` | 0 | stderr diag: `status:"fail_open"`, `errorCode:"NONZERO_EXIT"`, `CLI fallback timed out`, durationMs 308 | exit 0; prompt never blocked | yes |
| 2 | `echo "$WORK" \| node "$HOOK" > default.json` | 0 | stderr diag: `status:"fail_open"`, `CLI fallback timed out`, durationMs 2509 | exit 0 | yes |
| 3 | `echo "$CASUAL" \| node "$HOOK" > casual.json` | 0 | stderr diag: `status:"skipped"`, `errorDetails:"short_casual_acknowledgement"`, durationMs 3 | exit 0 | yes |
| 4 | `python3` first-line extract, `short` | 0 | `short: Advisor: outage (fail_open); route by hand: node .skilled/bin/skill-advisor.cjs advisor_recommend ...` | first line starts with `Advisor: outage (fail_open); route by hand:` | yes |
| 5 | `python3` first-line extract, `default` | 0 | `default: Advisor: outage (fail_open); route by hand: node .skilled/bin/skill-advisor.cjs advisor_recommend ...` | first line starts with `Advisor: live;`, `Advisor: stale;` or `Advisor: outage (fail_open);` | yes |
| 6 | `python3` first-line extract, `casual` | 0 | `casual: Advisor: prompt skipped.` | first line is `Advisor: prompt skipped.` | yes |
| 7 | teardown block (no signal; wait loop, gen-file shasum, conditional `rm -r`) | 0 | `live generation file unchanged`; `sandbox advisor exited; sandbox removed` | both lines printed; no `/tmp/cli-playbook.*` left | yes |
| 8 | post-check `ls -d /tmp/cli-playbook.*` | 1 (no matches) | no output — no leftover sandbox | no `/tmp/cli-playbook.*` folder left behind | yes |
DEVIATIONS: `gtimeout` is not installed on this machine (verified `command -v gtimeout` → absent), so the three hook calls ran without the `gtimeout 20` wrapper per task instruction. Every other part of the block, including the entire teardown, ran verbatim in one shell.
NOTES: The sandbox daemon/launcher apparently never fully started within the CLI's cold-start window — both work-payload runs degraded to `CLI fallback timed out` (exit 75 → fail_open), so `default:` rendered the outage line rather than `live;`/`stale;`. All three `default:` outcomes are a documented pass. The teardown's no-signal wait still confirmed nothing held the sandbox (`lsof +D` clean) before removing it.
