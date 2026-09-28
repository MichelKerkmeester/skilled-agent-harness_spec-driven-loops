<!-- dispatch: opencode CP-004; ledger: 2026-09-27T16:33:25Z 2026-09-27T16:39:53Z 0 388 -->

Scenario read. Baseline hashes recorded (pre-step-1). Running steps in order now.
Step 1 matched (JSON array, exit 0). Setting up the sandbox per step 2.
Step 3 mismatched: expected `warm-only exit=75` + ENOENT error envelope, got `status: ok` / `freshness: live` / exit 0. That is the playbook's documented failure mode ("sandbox exports are missing"). Verifying whether the exports actually reached the process before rerunning.
Confirmed: this runner's shell is **not** persistent across tool calls — every variable from step 2 was gone, so that step 3 ran against the live daemon. That is exactly the playbook's failure mode: *"The sandbox exports are missing, so the call reached the live daemon. Rerun step 2 in the same shell."*

Rerunning steps 2–5 in a single shell, exactly as written:
Corrected run matched every expected signal. Recording post-teardown hashes and removing the orphaned first sandbox:
RESULT: PASS | scenario=CP-004 | runtime=opencode
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.18 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| --- | --- | --- | --- | --- | --- |
| 1 | `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1 python3 .../skill_advisor.py "help me commit my changes"` | 0 | "Native advisor unavailable (FORCE_LOCAL; freshness=unavailable); falling back to local Python scorer." then JSON array, `sk-git` 0.95, `"source": "local"` | Forced-local shim returns a JSON array from the Python scorer | yes |
| 2 | `SANDBOX=$(mktemp -d /tmp/cp004.XXXXXX)` + 4 exports + `GEN_BEFORE=$(shasum "$GEN")` | 0 | `SANDBOX=/tmp/cp004.GYXin4`; `GEN_BEFORE=4d10166901e6a944daa7b9a2999c33c45ada91b6  .skilled/skills/.state/advisor/skill-graph-generation.json` | Sandbox under `/tmp/cp004.XXXXXX`, exports set, live generation checksum recorded | yes |
| 3 | `node .skilled/bin/skill-advisor.cjs advisor_recommend ... --warm-only --timeout-ms 3000` | 75 | `{"status":"error","error":"backend unavailable: connect ENOENT /tmp/cp004.GYXin4/sock/daemon-ipc.sock","exitCode":75}` then `warm-only exit=75`; probes: `db absent`, `lease absent`, sock empty | `warm-only exit=75` after retryable error envelope, `"status":"error"` with `"error":"backend unavailable: connect ENOENT $SANDBOX/sock/daemon-ipc.sock"` and `"exitCode":75`; nothing spawned; `$SANDBOX/db` never created | yes |
| 4 | `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN=0.2 node .skilled/bin/skill-advisor.cjs advisor_recommend ... --timeout-ms 30000` | 0 | `"status":"ok"`, `"freshness":"live"`, `trustState.state="live"` generation 1, `recommendations` 1 entry (`sk-git` 0.764957), `cache.hit:false`, then `cold-start exit=0` | `cold-start exit=0` after `"status":"ok"` envelope from the sandbox daemon with `freshness:"live"` | yes |
| 5 | teardown block (wait loop, `shasum` compare, unset exports, conditional `rm -rf`) | 0 | `live generation file unchanged`<br>`sandbox advisor exited; sandbox removed` | `live generation file unchanged` and `sandbox advisor exited; sandbox removed` | yes |

DEVIATIONS:
- Step 3 was first invoked in its own tool call before the exports from step 2 were known not to persist across this runner's shell sessions (verified after: `SANDBOX`, `SPECKIT_IPC_SOCKET_DIR`, `SYSTEM_SKILL_ADVISOR_DB_DIR`, `GEN_BEFORE` all empty in the next call). That attempt reached the live daemon and printed `"status":"ok"`, `"freshness":"live"` (generation 538), `warm-only exit=0` — the playbook's failure mode "Warm-only run exits `0` / Step 3 answers from a daemon / The sandbox exports are missing... Rerun step 2 in the same shell". Applied that action: reran steps 2–5 in a single shell. Steps 2–5 as specified were not altered; the judged run is the valid one.
- Added three read-only observation probes after step 3 (`db` exists? lease present? sock contents?) to evidence "nothing is spawned / `$SANDBOX/db` never created". No scenario command changed; no step skipped.

NOTES: sha256 before step 1 / after teardown — identical, live state unchanged by the run:
- `.skilled/skills/.state/advisor/skill-graph-generation.json`: `a5a8b8a8ce9d217b94da87aeb0d832f80be0728821eed4829fe95a03b5d98fff` (both)
- `.skilled/skills/system-skill-advisor/runtime/database/.system-skill-advisor-launcher.json`: `59b30674d78c1b3172eba59aa1fbc6e9f51ce72ae8e466518b5fc1b856b2d06e` (both)
Teardown lines reported verbatim above. The step-5 `shasum` compare (scenario-internal, SHA-1 `4d10166901e6a944daa7b9a2999c33c45ada91b6`) also printed `live generation file unchanged`. Even the accidental live-daemon contact in the invalid first step 3 left live state unchanged (hash pair identical). Environment limit: this runner's shell is not persistent across tool calls, so any scenario steps sharing exports must run in one invocation. Orphaned empty first sandbox `/tmp/cp004.WnJO4o` (created before the persistence limit was known, never used by a valid run) was removed by hand; no `/tmp/cp004.*` remains. Live daemon and live database were never stopped, moved or rebuilt. Verdict is PASS under the scenario's own failure-mode rules, which classify the warm-only `exit=0` symptom as recoverable by rerunning step 2 in the same shell (contrast "Live state changed", whose action is "Record it as a FAIL"); the judged run of every step as specified matched all expected signals.
