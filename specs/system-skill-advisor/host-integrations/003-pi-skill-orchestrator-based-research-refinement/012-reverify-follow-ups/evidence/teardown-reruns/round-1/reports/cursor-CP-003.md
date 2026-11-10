<!-- dispatch: cursor CP-003; ledger: 2026-09-27T15:45:32Z 2026-09-27T15:47:36Z 0 124 -->

RESULT: PASS | scenario=CP-003 | runtime=cursor
NATIVE: none visible
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | skill-advisor.cjs advisor_recommend, HOOK_DISABLED=1, sandbox socket+db, then launcher teardown | 0 | recommendations: []; freshness: "unavailable"; warnings and trustState.reason ADVISOR_DISABLED; teardown printed `sandbox launcher 44506 stopped`; no /tmp/cp003.* left | recommendations: [], freshness: "unavailable", ADVISOR_DISABLED; teardown prints `sandbox launcher <pid> stopped`; no /tmp/cp003.* left | yes |
| 2 | python3 skill_advisor.py, HOOK_DISABLED=1 | 0 | [] | [] or prompt-safe disabled output without native scoring | yes |
| 3 | npm test system-skill-advisor-plugin.vitest.ts -t opt-out | 0 | Test Files 1 passed; Tests 3 passed, 63 skipped | plugin env opt-out case: disabled/skipped output, advisor not invoked | yes |
| 4 | user-prompt-submit.js, HOOK_DISABLED=1, SKILL_ADVISOR_DEBUG=1 | 0 | {}; Exit: 0; diagnostic lines: 217 -> 218; last record status "skipped", freshness "unavailable" | {}; exit 0; diagnostics JSONL gains one line; newest record status "skipped" and freshness "unavailable" | yes |
DEVIATIONS: none
NOTES: Step 1 was run twice. The first attempt was inside the tool sandbox, returned a degraded local-scorer with `no sandbox launcher recorded`, and was discarded. The recorded step 1 is the same block with the tool sandbox disabled, so the scenario sandbox could start a cold daemon. Teardown line: `sandbox launcher 44506 stopped`.
