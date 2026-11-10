<!-- dispatch: codex CP-003; ledger: 2026-09-28T13:28:18Z 2026-09-28T13:29:37Z 0 79 -->

RESULT: PASS | scenario=CP-003 | runtime=Codex
NATIVE: none visible
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---:|---|---|---|
| 1 | Native `advisor_recommend` with isolated sandbox and disable flag | 0 | `recommendations: []`; `freshness: "unavailable"`; `ADVISOR_DISABLED`; `sandbox advisor exited; sandbox removed` | Empty recommendations, unavailable freshness, disabled reason; sandbox removed after teardown | Yes |
| 2 | Python shim with disable flag | 0 | `[]` | Empty or prompt-safe disabled output without native scoring | Yes |
| 3 | OpenCode plugin opt-out test | 0 | 1 test file passed; 3 passed, 63 skipped | Plugin opt-out test passes without invoking the advisor | Yes |
| 4 | Claude hook adapter with disable flag and diagnostics | 0 | `{}`; `Exit: 0`; diagnostics `202 -> 203`; latest record `status: "skipped"`, `freshness: "unavailable"` | Empty output, exit 0, one diagnostic line added with skipped status and unavailable freshness | Yes |
DEVIATIONS: none
NOTES: none
