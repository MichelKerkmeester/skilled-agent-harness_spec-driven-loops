<!-- dispatch: cursor CP-003; ledger: 2026-09-27T16:32:40Z 2026-09-27T16:35:30Z 0 170 -->

RESULT: PASS | scenario=CP-003 | runtime=cursor
NATIVE: none visible
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | skill-advisor.cjs advisor_recommend (sandbox, HOOK_DISABLED=1) then idle teardown | 0 | recommendations: []; freshness: "unavailable"; warnings/trustState reason ADVISOR_DISABLED; teardown line: sandbox advisor exited; sandbox removed; no /tmp/cp003.* left | recommendations: [], freshness "unavailable", ADVISOR_DISABLED; then sandbox advisor exited; sandbox removed; no /tmp/cp003.* left | yes |
| 2 | python3 skill_advisor.py (HOOK_DISABLED=1) | 0 | [] | [] or prompt-safe disabled output without native scoring | yes |
| 3 | npm test plugin vitest -t opt-out | 0 | Test Files 1 passed; Tests 3 passed \| 63 skipped | plugin env opt-out case returns disabled/skipped without invoking the advisor | yes |
| 4 | user-prompt-submit.js (HOOK_DISABLED=1, SKILL_ADVISOR_DEBUG=1) | 0 | {}; Exit: 0; diagnostic lines: 224 -> 225; last record status "skipped", freshness "unavailable" | {}; exit 0; diagnostics gain one line; newest record status "skipped" and freshness "unavailable" | yes |
DEVIATIONS: none
NOTES: The 229 -> 230 count in the scenario file is the 2026-09-26 sample. This run gained one line, 224 -> 225, under the 300-line trim, and the newest record is status skipped with freshness unavailable (durationMs 2). An extra leftover ls after the step 1 block printed a zsh nomatch line; the scenario teardown line itself was sandbox advisor exited; sandbox removed. npm printed an unknown devdir env warning and an update notice; the opt-out tests still passed. Disabled outputs did not contain the prompt text.
