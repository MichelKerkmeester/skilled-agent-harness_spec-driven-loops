<!-- dispatch: opencode 433; ledger: 2026-09-28T07:53:10Z 2026-09-28T07:55:28Z 0 138 -->

Scenario file read. Now running the whole command block in one shell, with `gtimeout 20` removed per the dispatch (noted as a deviation).
Anchors exist. Running the full block in one shell now (teardown included, no signals).
Verifying no sandbox remnants before the verdict.
RESULT: PASS | scenario=433 | runtime=opencode
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---|---|---|---|
| 1 | `echo "$WORK" \| SPECKIT_CLAUDE_HOOK_TIMEOUT_MS=300 node "$HOOK" > short.json` | 0 | short-budget exit=0; `short: Advisor: outage (fail_open); route by hand: node .skilled/bin/skill-advisor.cjs advisor_recommend ...` | exit 0; `short:` starts with `Advisor: outage (fail_open); route by hand:` | yes |
| 2 | `echo "$WORK" \| node "$HOOK" > default.json` | 0 | default-budget exit=0; `default: Advisor: outage (fail_open); route by hand: ...` | exit 0; `default:` starts with `Advisor: live;`, `Advisor: stale;` or `Advisor: outage (fail_open);` | yes |
| 3 | `echo "$CASUAL" \| node "$HOOK" > casual.json` | 0 | casual exit=0; `casual: Advisor: prompt skipped.` | exit 0; `casual:` is `Advisor: prompt skipped.` | yes |
| 4 | Teardown loop (no signal) + gen-hash check + sandbox removal | 0 | `live generation file unchanged` then `sandbox advisor exited; sandbox removed` | teardown prints `live generation file unchanged` and `sandbox advisor exited; sandbox removed`; no `/tmp/cli-playbook.*` left | yes |
| 5 | `ls -d /tmp/cli-playbook.*` (post-run remnant check) | 1 (no match) | no sandbox folders remain | No `/tmp/cli-playbook.*` folder left behind | yes |
DEVIATIONS: `gtimeout 20` omitted from the three hook calls (gtimeout not installed on this machine, per dispatch); all other block lines, including the un-signalled teardown, run exactly as written in one shell.
NOTES: The `default:` run landed on the `Advisor: outage (fail_open);` branch — the scenario accepts `live`/`stale`/`outage` equally, so this is a pass. Hook stderr logs showed `CLI_RETRYABLE_UNAVAILABLE exit 75: CLI fallback timed out` for both work-payload runs (expected under an absent sandbox socket). Verdict is a single-run result; no flaky rerun was needed.
