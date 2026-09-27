<!-- dispatch: cursor CP-004; ledger: 2026-09-26T19:16:22Z 2026-09-26T19:20:56Z 0 274 -->

RESULT: PASS | scenario=CP-004 | runtime=cursor
NATIVE: none visible
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1 python3 skill_advisor.py "help me commit my changes"` | 0 | Local Python fallback. JSON array: skill `sk-git`, confidence 0.95, source `local` | Forced-local shim returns a JSON array from the Python scorer | yes |
| 2 | `node skill-advisor.cjs advisor_recommend --prompt "help me commit my changes" --options '{"topK":1,...}' --format json` with temp socket/db and `SPECKIT_DAEMON_REELECTION=0` | 0 | `status: ok`, `freshness: live`, `trustState.state: live`, recommendations `[sk-git]` (confidence 0.9314). No throw | Cold start rebuilds to `live`. Exit 75 and the unreachable-socket envelope apply only with `--warm-only`. Absence path does not throw or block | yes |
| 3 | Inspect `freshness`, `trustState`, recommendations | n/a | `freshness=live`; `trustState.state=live`, reason null, generation 477; one recommendation | Same fields. Front door does not surface `freshness: "absent"` on a cold start | yes |
DEVIATIONS: Step 2 also set `SPECKIT_IPC_SOCKET_DIR` and `SYSTEM_SKILL_ADVISOR_DB_DIR` to a mktemp sandbox, as the task required. `--warm-only` was not added; the scenario command does not include it.
NOTES: Warm-only env vars were unset, so the CLI cold-spawned into the temp socket and returned `live`. The exit 75 signal is the `--warm-only` branch and was not this command. The temp dir was removed. Sandbox launcher pid 18604 and advisor-server pid 18605 were still running afterward and were not stopped. The live daemon and live database were not touched.
