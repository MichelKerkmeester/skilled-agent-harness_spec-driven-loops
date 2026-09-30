<!-- dispatch: cursor CP-004; ledger: 2026-09-28T12:54:07Z 2026-09-28T12:57:10Z 0 183 -->

RESULT: PASS | scenario=CP-004 | runtime=cursor
NATIVE: none visible
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1 python3 skill_advisor.py "help me commit my changes" | 0 | "falling back to local Python scorer"; JSON array with skill sk-git, source local | Forced-local shim returns a JSON array from the Python scorer | yes |
| 2 | mktemp -d /tmp/cp004.XXXXXX; export sandbox socket and db dirs | 0 | SANDBOX=/tmp/cp004.6cQHKr; GEN_BEFORE recorded | Sandbox under /tmp with its own socket and database directories | yes |
| 3 | advisor_recommend --warm-only --timeout-ms 3000 | 75 | {"status":"error","error":"backend unavailable: connect ENOENT /tmp/cp004.6cQHKr/sock/daemon-ipc.sock","exitCode":75}; warm-only exit=75; sandbox db absent | warm-only exit=75 after retryable error envelope, exitCode 75, ENOENT on $SANDBOX/sock/daemon-ipc.sock; $SANDBOX/db never created | yes |
| 4 | SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN=0.2 advisor_recommend --timeout-ms 30000 | 0 | {"status":"ok", freshness:"live", trustState.state:"live", recommendations:[sk-git]}; cold-start exit=0 | cold-start exit=0 after status ok from the sandbox daemon with freshness live | yes |
| 5 | teardown wait, shasum compare, rm -r sandbox | 0 | live generation file unchanged; sandbox advisor exited; sandbox removed | live generation file unchanged and sandbox advisor exited; sandbox removed | yes |
DEVIATIONS: none to the scenario commands. Inserted three read-only probes: printed the sandbox path, checked that $SANDBOX/db was absent after step 3, and listed /tmp/cp004.* after teardown.
NOTES: sha256 before and after were identical. skill-graph-generation.json 8df90d80dc9b8aa85469bb85182573cdeebbf359dd0cad6e9afae659d772daeb. .system-skill-advisor-launcher.json e15c9dd6fef843c8eeb8694eb668e71579a3eb4742e64b63c7d4501872102ec5. Step 5 printed exactly: live generation file unchanged / sandbox advisor exited; sandbox removed. The leftover probe printed zsh "no matches found: /tmp/cp004.*", so no sandbox folder remained.
