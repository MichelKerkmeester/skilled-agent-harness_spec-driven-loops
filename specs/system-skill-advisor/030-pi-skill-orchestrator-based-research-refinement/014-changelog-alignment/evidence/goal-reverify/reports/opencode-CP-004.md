<!-- dispatch: opencode CP-004; ledger: 2026-09-28T13:05:08Z 2026-09-28T13:08:38Z 0 210 -->

Step 1 matches (JSON array, exit 0). Now running steps 2–5 in one shell (teardown waits ≥25s).
RESULT: PASS | scenario=CP-004 | runtime=opencode
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.18 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1 python3 .../skill_advisor.py "help me commit my changes" | 0 | JSON array from local scorer: `[{ "skill": "sk-git", ..., "source": "local" }]`, preceded by `Native advisor unavailable (FORCE_LOCAL; freshness=unavailable); falling back to local Python scorer.` | Forced-local shim returns a JSON array from the Python scorer | yes |
| 2 | mktemp -d /tmp/cp004.XXXXXX + exports + GEN_BEFORE=$(shasum "$GEN") | 0 | SANDBOX=/tmp/cp004.CInygi; GEN_BEFORE=`aab6c5d477b9bb3d17e1ee66f382dba8f3acf0b0` (scenario's own `shasum`, SHA-1) | Sandbox under /tmp/cp004.*, live generation checksum recorded | yes |
| 3 | node .../skill-advisor.cjs advisor_recommend ... --warm-only --timeout-ms 3000 | 75 | `{"status": "error", "error": "backend unavailable: connect ENOENT /tmp/cp004.CInygi/sock/daemon-ipc.sock", "exitCode": 75}` then `warm-only exit=75` | Retryable error envelope, `"status": "error"`, `"error": "backend unavailable: connect ENOENT $SANDBOX/sock/daemon-ipc.sock"`, `"exitCode": 75`, `warm-only exit=75` | yes |
| 4 | SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN=0.2 node .../skill-advisor.cjs advisor_recommend ... --timeout-ms 30000 | 0 | `{"status": "ok", ...}` with `freshness: "live"`, `trustState.state: "live"` (generation 1), `recommendations: [sk-git 0.764532 / confidence 0.9309 / status active]`, `ambiguous: false`, then `cold-start exit=0` | `"status": "ok"` envelope from sandbox daemon with `freshness: "live"`, non-empty recommendations; `cold-start exit=0` | yes |
| 5 | Teardown block verbatim (no signal, wait ≥25s, checksum compare, rm -r) | 0 | `live generation file unchanged` and `sandbox advisor exited; sandbox removed` | Same two lines; no /tmp/cp004.* folder left | yes |

DEVIATIONS: none — every command ran exactly as written in the scenario file, steps 2–5 in one shell, teardown unchanged and un-signaled.

NOTES:
- STEP 0 Advisor line taken verbatim from this prompt's runtime context.
- SHA-256 pairs (task-mandated, before step 1 / after teardown): skill-graph-generation.json `8df90d80dc9b8aa85469bb85182573cdeebbf359dd0cad6e9afae659d772daeb` / `8df90d80dc9b8aa85469bb85182573cdeebbf359dd0cad6e9afae659d772daeb`; .system-skill-advisor-launcher.json `e15c9dd6fef843c8eeb8694eb668e71579a3eb4742e64b63c7d4501872102ec5` / `e15c9dd6fef843c8eeb8694eb668e71579a3eb4742e64b63c7d4501872102ec5`. Both pairs unchanged. (Step 2's in-scenario `GEN_BEFORE` is SHA-1 via plain `shasum`, so its value differs from these sha256 figures; that is the scenario's own comparison and it reported `unchanged`.)
- Post-teardown check: `ls -d /tmp/cp004.*` → no matches; sandbox fully removed.
- The step-3 expected signal "nothing spawned and `$SANDBOX/db` never created" was not captured as a direct filesystem observation between steps 3 and 4 (step 4 legitimately creates the db and teardown removed the sandbox). It is consistent with the observed step-3 ENOENT/exit-75 envelope and with the teardown's lease/lock checks both being clean. Everything printed matched exactly.
- The shell ran with `set -x` tracing enabled for the record; no step command, argument, or teardown line was altered. No live daemon, database, or repository file was touched.
