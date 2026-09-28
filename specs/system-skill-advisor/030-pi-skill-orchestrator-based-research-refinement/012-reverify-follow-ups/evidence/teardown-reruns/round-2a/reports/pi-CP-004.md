<!-- dispatch: pi CP-004; ledger: 2026-09-27T16:39:53Z 2026-09-27T16:41:50Z 0 117 -->

RESULT: PASS | scenario=CP-004 | runtime=pi
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.18 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---|---|---|---|
| 1 | `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1 python3 .../skill_advisor.py "help me commit my changes"` | 0 | Fallback notice (FORCE_LOCAL; freshness=unavailable), then a JSON array: sk-git, confidence 0.95, `"source": "local"` | Forced-local shim returns a JSON array from the Python scorer | yes |
| 2 | `mktemp -d /tmp/cp004.XXXXXX`; export sock/db/reelection/model-server vars; `GEN_BEFORE=$(shasum "$GEN")` | 0 | SANDBOX=/tmp/cp004.KM1ilr; GEN_BEFORE=4d10166901e6a944daa7b9a2999c33c45ada91b6 (shasum) | Sandbox created under /tmp with own socket+db dirs; generation checksum recorded | yes |
| 3 | `node .skilled/bin/skill-advisor.cjs advisor_recommend ... --warm-only --timeout-ms 3000` | 75 | `{"status":"error","error":"backend unavailable: connect ENOENT /tmp/cp004.KM1ilr/sock/daemon-ipc.sock","exitCode":75}` then `warm-only exit=75` | Retryable error envelope, `"status": "error"`, `"error": "backend unavailable: connect ENOENT $SANDBOX/sock/daemon-ipc.sock"`, `"exitCode": 75`, prints `warm-only exit=75`; nothing spawned, `$SANDBOX/db` never created | yes |
| 4 | `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN=0.2 node .skilled/bin/skill-advisor.cjs advisor_recommend ... --timeout-ms 30000` | 0 | `{"status":"ok", ... "recommendations":[sk-git 0.764956], "freshness":"live", "trustState":{"state":"live","generation":1,...}}` then `cold-start exit=0` | `cold-start exit=0` after a `"status": "ok"` envelope from the sandbox daemon with `freshness: "live"` | yes |
| 5 | Teardown loop (no signal) + shasum compare + sandbox removal | 0 | `live generation file unchanged` and `sandbox advisor exited; sandbox removed` | Step 5 prints `live generation file unchanged` and `sandbox advisor exited; sandbox removed` | yes |

DEVIATIONS: none — every scenario step ran exactly as written, in order, including the signal-free step 5 teardown (loop broke at iteration 26, ~26 s, with lease gone and socket folder empty).

NOTES:
- Teardown printed exactly: `live generation file unchanged` and `sandbox advisor exited; sandbox removed`.
- Live-state sha256 pairs (required by task): before — `skill-graph-generation.json` = `a5a8b8a8ce9d217b94da87aeb0d832f80be0728821eed4829fe95a03b5d98fff`, `.system-skill-advisor-launcher.json` = `59b30674d78c1b3172eba59aa1fbc6e9f51ce72ae8e466518b5fc1b856b2d06e`; after — identical (`a5a8b8a8…` / `59b30674…`). Unchanged by the run, as required.
- The scenario's own `GEN_BEFORE` uses `shasum` (SHA-1 on macOS): `4d10166901e6a944daa7b9a2999c33c45ada91b6`, stable across the run — its digits differ from the sha256 above only because the hash algorithms differ.
- Step 3's "$SANDBOX/db is never created / nothing spawned" is not checked by the scenario commands themselves and was unobservable after step 5 removed the sandbox, so I confirmed it with one supplementary warm-only probe in a fresh /tmp/cp004probe.* sandbox: `warm-only exit=75`, `db exists: no`, `sock entries: []`, probe sandbox then removed. No daemon was spawned or contacted; the live daemon and database were never touched.
