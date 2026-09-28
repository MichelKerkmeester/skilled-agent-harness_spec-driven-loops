<!-- dispatch: devin CP-004; ledger: 2026-09-28T07:25:06Z 2026-09-28T07:26:49Z 0 103 -->

STEP 0 — Advisor line captured from context:

`Advisor: outage (fail_open); route by hand: node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<request>"}' --format json`

Now reading the scenario file.Read the scenario. Now recording the pre-run checksums (task requirement) and running step 1 in parallel.Step 1 passed: exit 0, JSON array from the Python scorer (`"source": "local"`). Now running steps 2–5 verbatim in a single shell.Step 5 is waiting out the daemon idle timeout. Reading the background output.Teardown printed both expected lines. Now the post-run checksums for NOTES.RESULT: PASS | scenario=CP-004 | runtime=devin
NATIVE: Advisor: outage (fail_open); route by hand: node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<request>"}' --format json
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1 python3 .../skill_advisor.py "help me commit my changes"` | 0 | "falling back to local Python scorer"; JSON array with `sk-git`, `"source": "local"` | Forced-local shim returns a JSON array from the Python scorer | yes |
| 2 | `mktemp -d /tmp/cp004.XXXXXX` + export sandbox env vars + `GEN_BEFORE=$(shasum $GEN)` | 0 | `SANDBOX=/tmp/cp004.9H1JV2`; socket/db dirs exported; generation checksum recorded | Sandbox created under /tmp with own socket and db dirs | yes |
| 3 | `skill-advisor.cjs advisor_recommend --warm-only --timeout-ms 3000` | 75 | `warm-only exit=75`; `"status": "error"`, `"error": "backend unavailable: connect ENOENT /tmp/cp004.9H1JV2/sock/daemon-ipc.sock"`, `"exitCode": 75` | exit 75 after retryable error envelope with ENOENT on `$SANDBOX/sock/daemon-ipc.sock`; nothing spawned, `$SANDBOX/db` never created | yes |
| 4 | `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN=0.2 skill-advisor.cjs advisor_recommend --timeout-ms 30000` | 0 | `cold-start exit=0`; `"status": "ok"`, `freshness: "live"`, `trustState.state: "live"`, `generation: 1`, recommendation `sk-git` | `cold-start exit=0` after `"status": "ok"` envelope from sandbox daemon with `freshness: "live"` | yes |
| 5 | teardown wait loop + shasum compare + `rm -r "$SANDBOX"` | 0 | `live generation file unchanged`; `sandbox advisor exited; sandbox removed`; `/tmp/cp004.9H1JV2` gone | `live generation file unchanged` and `sandbox advisor exited; sandbox removed`; no `/tmp/cp004.*` left | yes |
DEVIATIONS: none
NOTES: sha256 before run — skill-graph-generation.json `910b4e92982a34c582eab755e6957e565754d291`, .system-skill-advisor-launcher.json `a50e6c24ecfdcecd90471ba7db16a0fc76736a93`. sha256 after teardown — `910b4e92982a34c582eab755e6957e565754d291` and `a50e6c24ecfdcecd90471ba7db16a0fc76736a93` respectively; both unchanged. Step 5 teardown printed `live generation file unchanged` then `sandbox advisor exited; sandbox removed`. Live daemon/db untouched; step 4 output also included a `_shadow` block (advisor-shadow-learned-weights-v1) not mentioned by the scenario, benign.
