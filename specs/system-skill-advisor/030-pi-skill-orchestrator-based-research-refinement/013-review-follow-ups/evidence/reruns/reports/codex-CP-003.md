<!-- dispatch: codex CP-003; ledger: 2026-09-28T07:37:40Z 2026-09-28T07:41:04Z 0 204 -->

RESULT: PASS | scenario=CP-003 | runtime=Codex
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.18 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---:|---|---|---|
| 1 | Native `advisor_recommend` with isolated DB/socket and disable flag | 0 | `recommendations: []`, `freshness: "unavailable"`, `ADVISOR_DISABLED`; teardown: `sandbox advisor exited; sandbox removed` | Disabled response signals; sandbox removed | Yes |
| 2 | Python shim with disable flag | 0 | `[]` | `[]` or prompt-safe disabled output without native scoring | Yes |
| 3 | OpenCode plugin opt-out test | 0 | 1 test file passed; 3 passed, 63 skipped | Disabled/skipped output without invoking advisor | Yes |
| 4 | Claude hook adapter with disable flag and diagnostics | 0 | `{}`; `Exit: 0`; diagnostic lines `260 -> 261`; latest record has `status: "skipped"` and `freshness: "unavailable"` | `{}`, exit 0, one diagnostic line added with skipped/unavailable status | Yes |
DEVIATIONS: none
NOTES: Step 4 appended the expected diagnostics JSONL record.
