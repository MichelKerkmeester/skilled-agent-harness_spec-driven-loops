<!-- dispatch: cursor CP-003; ledger: 2026-09-28T13:26:04Z 2026-09-28T13:28:17Z 0 133 -->

RESULT: PASS | scenario=CP-003 | runtime=cursor
NATIVE: none visible
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | skill-advisor.cjs advisor_recommend with SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1, then sandbox wait/teardown | 0 | recommendations: []; freshness: "unavailable"; warnings and trustState.reason: ADVISOR_DISABLED; "sandbox advisor exited; sandbox removed"; no /tmp/cp003.* left | recommendations: []; freshness: "unavailable"; ADVISOR_DISABLED; then "sandbox advisor exited; sandbox removed" and no /tmp/cp003.* left | yes |
| 2 | SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 python3 skill_advisor.py "help me commit my changes" | 0 | [] | [] or prompt-safe disabled output without native scoring | yes |
| 3 | npm --prefix runtime run test -- plugin vitest -t "opt-out" | 0 | Test Files 1 passed; Tests 3 passed, 63 skipped | OpenCode plugin env opt-out case returns disabled/skipped output without invoking the advisor | yes |
| 4 | SKILL_ADVISOR_DEBUG=1 disabled user-prompt-submit.js, then diagnostics tail | 0 | {}; Exit: 0; diagnostic lines: 201 -> 202; last record status "skipped", freshness "unavailable" | {}; exit 0; diagnostics JSONL gains one line; newest record status "skipped" and freshness "unavailable" | yes |
DEVIATIONS: none
NOTES: Step 1 finished in about 29s and printed the required teardown line. The hook diagnostics file is outside the repo at /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/speckit-skill-advisor-metrics/a9f078f65abeed95-diagnostics.jsonl; the line count stayed under 300, so no trim to 200. Disabled outputs did not contain the prompt text. npm printed an unknown-env-config warning and an update notice; the opt-out tests still passed.
