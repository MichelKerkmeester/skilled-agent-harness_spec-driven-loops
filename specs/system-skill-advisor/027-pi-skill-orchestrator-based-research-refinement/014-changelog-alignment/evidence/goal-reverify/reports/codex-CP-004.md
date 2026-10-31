<!-- dispatch: codex CP-004; ledger: 2026-09-28T13:01:56Z 2026-09-28T13:03:32Z 0 96 -->

RESULT: PASS | scenario=CP-004 | runtime=Codex
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.18 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---:|---|---|---|
| 1 | Forced-local Python shim | 0 | Returned a JSON array with `sk-git`, `source: local` | Python scorer returns a JSON array | Yes |
| 2 | Create sandbox and set environment | 0 | Created `/tmp/cp004.7RFo84`; exported isolated socket and DB paths | Sandbox and isolated paths configured | Yes |
| 3 | Native `advisor_recommend --warm-only` | 75 | Error envelope reported `backend unavailable: connect ENOENT /tmp/cp004.7RFo84/sock/daemon-ipc.sock` and `exitCode: 75`; no spawn observed | Retryable error envelope, exit 75, sandbox DB not created | Yes |
| 4 | Cold-start `advisor_recommend` | 0 | `status: ok`, `freshness: live`, `trustState.state: live`, recommendations returned | Sandbox daemon responds with live freshness; exit 0 | Yes |
| 5 | Scenario teardown block | 0 | Printed `live generation file unchanged` and `sandbox advisor exited; sandbox removed`; no `/tmp/cp004.*` directory remained | Both teardown lines; no sandbox remains | Yes |
DEVIATIONS: none
NOTES: Hashes before → after teardown: `skill-graph-generation.json` `8df90d80dc9b8aa85469bb85182573cdeebbf359dd0cad6e9afae659d772daeb` → `8df90d80dc9b8aa85469bb85182573cdeebbf359dd0cad6e9afae659d772daeb`; `.system-skill-advisor-launcher.json` `e15c9dd6fef843c8eeb8694eb668e71579a3eb4742e64b63c7d4501872102ec5` → `e15c9dd6fef843c8eeb8694eb668e71579a3eb4742e64b63c7d4501872102ec5`.
