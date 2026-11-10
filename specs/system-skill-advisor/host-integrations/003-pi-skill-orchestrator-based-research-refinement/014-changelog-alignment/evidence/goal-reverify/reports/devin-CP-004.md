<!-- dispatch: devin CP-004; ledger: 2026-09-28T12:51:14Z 2026-09-28T12:52:39Z 0 85 -->

Step 1: Python forced-local fallback.Steps 2–5 in one shell (sandbox, warm-only run, cold start, teardown). This takes ~60–90 seconds due to the teardown wait.Teardown is in its wait loop. Waiting for it to finish.RESULT: PASS | scenario=CP-004 | runtime=devin
NATIVE: Advisor: outage (fail_open); route by hand: node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<request>"}' --format json
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---|---|---|---|
| 1 | `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1 python3 skill_advisor.py "help me commit my changes"` | 0 | "Native advisor unavailable (FORCE_LOCAL; freshness=unavailable); falling back to local Python scorer." then a JSON array with `sk-git`, confidence 0.95, `source: "local"` | Forced-local shim returns a JSON array from the Python scorer | YES |
| 2 | `mktemp -d /tmp/cp004.XXXXXX` + export sandbox socket/db dirs | 0 | `SANDBOX=/tmp/cp004.NwulGR`; env vars set; `GEN_BEFORE` recorded | Sandbox created under /tmp; no live daemon touched | YES |
| 3 | `skill-advisor.cjs advisor_recommend --warm-only --timeout-ms 3000` | 75 | `"status": "error"`, `"error": "backend unavailable: connect ENOENT /tmp/cp004.NwulGR/sock/daemon-ipc.sock"`, `"exitCode": 75`; `$SANDBOX/db` never created (only `sock` dir present) | `warm-only exit=75`, retryable error envelope, nothing spawned, `$SANDBOX/db` absent | YES |
| 4 | `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN=0.2 skill-advisor.cjs advisor_recommend --timeout-ms 30000` | 0 | `"status": "ok"`, `freshness: "live"`, `trustState.state: "live"`, `recommendations[0].skillId: "sk-git"` (score 0.764537, confidence 0.9309) | `cold-start exit=0`, `"status": "ok"` envelope from sandbox daemon, `freshness: "live"` | YES |
| 5 | teardown block (unchanged, verbatim) | 0 | Printed `live generation file unchanged` and `sandbox advisor exited; sandbox removed`; `ls -d /tmp/cp004.*` → none | Both lines printed; no `/tmp/cp004.*` folder left behind | YES |

DEVIATIONS: none — steps 2–5 ran in a single shell exactly as written; no teardown command changed.

NOTES:
- Step 5 teardown printed lines verbatim: `live generation file unchanged` / `sandbox advisor exited; sandbox removed`.
- Live file checksums before run: `skill-graph-generation.json` = `8df90d80dc9b8aa85469bb85182573cdeebbf359dd0cad6e9afae659d772daeb`; `.system-skill-advisor-launcher.json` = `e15c9dd6fef843c8eeb8694eb668e71579a3eb4742e64b63c7d4501872102ec5`.
- Live file checksums after teardown: identical pair (`8df90d80…daeb` and `e15c9dd6…c5`). Both unchanged by the run.
- The sandbox daemon exited on its own via the 12-second idle timeout; teardown sent no signal and the live daemon/database were never touched.
