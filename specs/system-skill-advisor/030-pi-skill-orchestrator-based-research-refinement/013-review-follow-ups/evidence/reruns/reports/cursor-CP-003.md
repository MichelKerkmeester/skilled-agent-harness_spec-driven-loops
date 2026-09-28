<!-- dispatch: cursor CP-003; ledger: 2026-09-28T07:26:40Z 2026-09-28T07:29:18Z 0 158 -->

RESULT: PASS | scenario=CP-003 | runtime=cursor
NATIVE: none visible
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | skill-advisor.cjs advisor_recommend, HOOK_DISABLED=1, sandbox socket+db, then idle wait and rm | 0 | recommendations: []; freshness: "unavailable"; warnings/trustState ADVISOR_DISABLED; then `sandbox advisor exited; sandbox removed`. No /tmp/cp003.* left. | recommendations: [], freshness: "unavailable", ADVISOR_DISABLED; then `sandbox advisor exited; sandbox removed`; no /tmp/cp003.* left | yes |
| 2 | skill_advisor.py with HOOK_DISABLED=1 | 0 | `[]` | `[]` or prompt-safe disabled output without native scoring | yes |
| 3 | vitest system-skill-advisor-plugin.vitest.ts -t opt-out | 0 | Test Files 1 passed; Tests 3 passed, 63 skipped | Plugin env opt-out case returns disabled/skipped output without invoking the advisor | yes |
| 4 | user-prompt-submit.js with HOOK_DISABLED=1 and SKILL_ADVISOR_DEBUG=1 | 0 | `{}`; Exit: 0; diagnostic lines: 245 -> 246; last record status "skipped", freshness "unavailable" | `{}`, exit 0; diagnostics JSONL gains one line; newest record status "skipped" and freshness "unavailable" | yes |
DEVIATIONS: none
NOTES: none
