<!-- dispatch: codex CP-004; ledger: 2026-09-28T07:29:18Z 2026-09-28T07:30:36Z 0 78 -->

RESULT: PASS | scenario=CP-004 | runtime=Codex
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.18 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---:|---|---|---|
| 1 | Forced-local Python shim | 0 | Returned a JSON array with `sk-git`; local scorer fallback message. | Shim returns a JSON array from the Python scorer. | Yes |
| 2 | Create `/tmp/cp004.*` sandbox and export isolated paths | 0 | Setup succeeded; warm-only used the sandbox socket path. | Sandbox uses its own socket and database directories. | Yes |
| 3 | Native `advisor_recommend --warm-only` | 75 | Retryable error envelope; `backend unavailable: connect ENOENT /tmp/cp004.GL74rN/sock/daemon-ipc.sock`; `warm-only exit=75`. | ENOENT error envelope, exit code 75; no spawn and no sandbox DB creation. | Yes |
| 4 | Native cold start with 0.2-minute idle timeout | 0 | `status: ok`, `freshness: live`; `cold-start exit=0`. | Sandbox daemon returns an OK envelope with live freshness and exit 0. | Yes |
| 5 | Scenario teardown block | 0 | `live generation file unchanged`; `sandbox advisor exited; sandbox removed`. | Both lines print; no `/tmp/cp004.*` folder remains. | Yes |
DEVIATIONS: none
NOTES: Hashes before → after teardown: `skill-graph-generation.json` 273b4a2712f799789eeb802370574fa037f4b4502461028999db50daa518daa3 → 273b4a2712f799789eeb802370574fa037f4b4502461028999db50daa518daa3; `.system-skill-advisor-launcher.json` e138f337d5e627f74fb098f0b0119cbced403b02b5c36bf143b630dcc959b9ec → e138f337d5e627f74fb098f0b0119cbced403b02b5c36bf143b630dcc959b9ec. The steps 2–5 shell exited 0.
