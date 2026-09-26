<!-- dispatch: codex CP-004; ledger: 2026-09-26T19:20:56Z 2026-09-26T19:21:58Z 0 62 -->

RESULT: PASS | scenario=CP-004 | runtime=Codex
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---:|---|---|---|
| 1 | `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1 python3 .../skill_advisor.py "help me commit my changes"` | 0 | JSON array; `sk-git`, `"source": "local"` | Forced-local shim returns a JSON array from the Python scorer | Yes |
| 2 | `SPECKIT_IPC_SOCKET_DIR=<tmp>/sock SYSTEM_SKILL_ADVISOR_DB_DIR=<tmp>/db SPECKIT_DAEMON_REELECTION=0 node ... advisor_recommend ... --format json` | 0 | JSON envelope; `freshness: "live"`, `trustState.state: "live"`, one `sk-git` recommendation | Without `--warm-only`, a cold start rebuilds to live; the absent freshness branch is not surfaced | Yes |
| 3 | Inspect Step 2 `freshness`, `trustState`, and recommendations | N/A | `live`; trust state `live`; one recommendation | Inspect these fields; absence path does not throw or block prompt handling | Yes |

DEVIATIONS: The first attempt to run Step 2 was rejected because its cleanup command used `rm -rf`; reran the same scenario invocation with temporary-directory cleanup handled by Python. No test step was skipped or changed.
NOTES: The prescribed Step 2 command did not include `--warm-only`; the observed cold start rebuilt to `live`, as described in the scenario’s expected signals.
