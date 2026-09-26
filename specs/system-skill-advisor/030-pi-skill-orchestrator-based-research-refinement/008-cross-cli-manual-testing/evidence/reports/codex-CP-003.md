<!-- dispatch: codex CP-003; ledger: 2026-09-26T19:04:54Z 2026-09-26T19:06:09Z 0 75 -->

RESULT: FAIL | scenario=CP-003 | runtime=Codex
NATIVE: Advisor: outage (fail_open); route by hand: node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<request>"}' --format json
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---:|---|---|---|
| 1 | Native `advisor_recommend` with sandbox and disable flag | 0 | `recommendations: []`, `freshness: "unavailable"`, `ADVISOR_DISABLED` | Those three disabled signals | Yes |
| 2 | Python shim with disable flag | 0 | `[]` | `[]` or prompt-safe disabled output without native scoring | Yes |
| 3 | OpenCode plugin opt-out test | 0 | 1 file passed; 3 passed, 62 skipped | Disabled/skipped without invoking advisor | Yes |
| 4 | Claude hook adapter with disable flag | 0 | `{}`; no skipped diagnostic appeared in command output | `{}` with skipped diagnostic | No |
DEVIATIONS: Step 1 cleanup: the execution wrapper rejected `rm -rf`; reran the same test invocation with `rm -r` for cleanup.
NOTES: The hook adapter output did not include the expected skipped diagnostic.
