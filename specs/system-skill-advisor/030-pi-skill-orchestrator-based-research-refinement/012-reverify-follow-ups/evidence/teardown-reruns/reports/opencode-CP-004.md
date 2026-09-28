<!-- dispatch: opencode CP-004; ledger: 2026-09-28T05:17:42Z 2026-09-28T05:22:30Z 0 288 -->

Gate 3 pre-resolved (child dispatch). Now reading the scenario file.
Scenario read. Now recording pre-run checksums and verifying the live state files exist.
Shell is not persistent across calls, so sandbox steps 2–5 must run in one shell (the scenario itself requires same-shell exports). Step 1 first.
Step 1 matches (JSON array, exit 0). Now steps 2–5 in a single shell so the sandbox exports persist.
All steps ran. Now post-teardown checksums of both live state files.
RESULT: PASS | scenario=CP-004 | runtime=opencode
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.18 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | FORCE_LOCAL=1 python3 skill_advisor.py "help me commit my changes" | 0 | stderr fallback notice; JSON array, sk-git confidence 0.95, source "local" | Forced-local shim returns a JSON array from the Python scorer | yes |
| 2 | mktemp -d /tmp/cp004.XXXXXX; export sock/db/REELECTION/MODEL_SERVER_ENABLED=0; GEN_BEFORE=$(shasum "$GEN") | 0 | sandbox=/tmp/cp004.0O1Xk6 (empty, under /tmp); GEN_BEFORE=256d4520ab0bf6fcfb07d92d41e935ed7240900e | Sandbox under /tmp/cp004.XXXXXX with own socket and db dirs; GEN_BEFORE recorded | yes |
| 3 | skill-advisor.cjs advisor_recommend --warm-only --timeout-ms 3000 | 75 | {"status":"error","error":"backend unavailable: connect ENOENT /tmp/cp004.0O1Xk6/sock/daemon-ipc.sock","exitCode":75}; "warm-only exit=75"; $SANDBOX/db never created | Retryable error envelope, "status":"error", "error":"backend unavailable: connect ENOENT $SANDBOX/sock/daemon-ipc.sock", "exitCode":75; nothing spawned; $SANDBOX/db never created | yes |
| 4 | SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN=0.2 skill-advisor.cjs advisor_recommend --timeout-ms 30000 | 0 | {"status":"ok",...} freshness:"live", trustState state "live" generation 1, recommendations [sk-git 0.764692], "cold-start exit=0" | "cold-start exit=0" after "status":"ok" envelope with freshness "live"; non-empty recommendations | yes |
| 5 | teardown loop (no signal; wait lease/sock/open-files clear, then shasum compare, unset, rm) | 0 | "live generation file unchanged" and "sandbox advisor exited; sandbox removed" | Those two lines | yes |
DEVIATIONS: No step was skipped or its command changed. Execution arrangement only: steps 2–5 ran inside one shell invocation because the tool shell is not persistent across calls (verified: an export did not survive a second call) — the scenario itself requires same-shell exports ("Rerun step 2 in the same shell"). One read-only observation added between steps 3 and 4: `[ -e "$SANDBOX/db" ]` to confirm the "db never created" signal before step 4 would create it. Steps 3 and 4 each ran once; no failure-mode reruns needed.
NOTES: sha256 pairs (task-mandated) before step 1 and after teardown, unchanged:
- .skilled/skills/.state/advisor/skill-graph-generation.json: c887ca200cedf3d0004bfa5f56dea9d34d32d04c855e3796ae5184ddd0105623 (both)
- .skilled/skills/system-skill-advisor/runtime/database/.system-skill-advisor-launcher.json: 1e7b7e019ee07b7646530e20e4a701dc3641ffc4c44f914fc1a1b73af4f8990e (both)
The scenario's own GEN_BEFORE/step-5 comparison used `shasum` (SHA-1 default) as written and reported "live generation file unchanged"; the sha256 pairs above are the independent check. Sandbox /tmp/cp004.0O1Xk6 is gone (glob /tmp/cp004.* finds nothing). Live daemon and live database were never touched: no signal sent, no live process stopped, sandbox paths used for all sandboxed calls. All observed claims are OBSERVED (command output and exit status read); no inference. Nothing remains for the operator to verify.
