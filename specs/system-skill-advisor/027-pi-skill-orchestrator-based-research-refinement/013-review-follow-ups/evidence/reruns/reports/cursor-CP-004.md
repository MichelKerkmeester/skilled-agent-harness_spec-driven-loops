<!-- dispatch: cursor CP-004; ledger: 2026-09-28T07:32:20Z 2026-09-28T07:34:38Z 0 138 -->

RESULT: PASS | scenario=CP-004 | runtime=cursor
NATIVE: none visible
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1 python3 skill_advisor.py "help me commit my changes" | 0 | "Native advisor unavailable (FORCE_LOCAL; freshness=unavailable); falling back to local Python scorer." then a JSON array with skill sk-git, source "local", confidence 0.95 | Forced-local shim returns a JSON array from the Python scorer | yes |
| 2 | mktemp -d /tmp/cp004.XXXXXX; export sandbox socket/db env; GEN_BEFORE=$(shasum GEN) | 0 | SANDBOX=/tmp/cp004.DKnOQZ; GEN_BEFORE=5719d3273e32aeebb03de16990872a2a1b15b6b9 skill-graph-generation.json | Sandbox under /tmp/cp004.* with its own socket and database dirs; live generation checksum recorded | yes |
| 3 | node skill-advisor.cjs advisor_recommend --warm-only --timeout-ms 3000 | 75 | {"status":"error","error":"backend unavailable: connect ENOENT /tmp/cp004.DKnOQZ/sock/daemon-ipc.sock","exitCode":75}; warm-only exit=75; $SANDBOX/db absent (listing was only sock/) | warm-only exit=75 after retryable envelope status error, that ENOENT error, exitCode 75; nothing spawned; $SANDBOX/db never created | yes |
| 4 | SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN=0.2 node skill-advisor.cjs advisor_recommend --timeout-ms 30000 | 0 | {"status":"ok", ... "freshness":"live", "trustState":{"state":"live",...}, "recommendations":[{"skillId":"sk-git",...}]}; cold-start exit=0 | cold-start exit=0 after status ok from the sandbox daemon with freshness live | yes |
| 5 | wait until lease/socket/open files gone and i>25; shasum compare; rm -r sandbox | 0 | live generation file unchanged; sandbox advisor exited; sandbox removed; no /tmp/cp004.* left | live generation file unchanged and sandbox advisor exited; sandbox removed; no /tmp/cp004.* left | yes |
DEVIATIONS: Before step 3 I ran mkdir -p "$SPECKIT_IPC_SOCKET_DIR" and, after step 3, read-only checks that the db dir was absent. Teardown was unchanged. The socket file was still missing, so step 3 still returned connect ENOENT and did not create $SANDBOX/db.
NOTES: sha256 before step 1 and after teardown are identical. skill-graph-generation.json 24d2a0bc8f51a1ea39f6b8120f27e86f8aa68fdc2a60317aa9a3c40c2d3cd9f3 both times. .system-skill-advisor-launcher.json e138f337d5e627f74fb098f0b0119cbced403b02b5c36bf143b630dcc959b9ec both times. Live daemon and live database were not stopped, moved, or rebuilt.
