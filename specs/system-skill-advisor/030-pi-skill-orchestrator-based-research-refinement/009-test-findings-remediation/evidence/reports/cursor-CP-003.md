<!-- dispatch: cursor CP-003; ledger: 2026-09-26T22:19:02Z 2026-09-26T22:21:45Z 0 163 -->

RESULT: PASS | scenario=CP-003 | runtime=cursor
NATIVE: none visible
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 node .skilled/bin/skill-advisor.cjs advisor_recommend` (socket+DB in mktemp) | 0 | `recommendations: []`, `freshness: "unavailable"`, `warnings: ["ADVISOR_DISABLED"]`, `trustState.reason: "ADVISOR_DISABLED"`; prompt text absent | `recommendations: []`, `freshness: "unavailable"`, and `ADVISOR_DISABLED` | yes |
| 2 | `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 python3 .../skill_advisor.py "help me commit my changes"` | 0 | `[]` | `[]` or prompt-safe disabled output without native scoring | yes |
| 3 | `npm --prefix .../runtime run test -- tests/system-skill-advisor-plugin.vitest.ts -t "opt-out"` | 0 | `Test Files 1 passed`; `Tests 3 passed \| 62 skipped` | OpenCode plugin opt-out case returns disabled/skipped output without invoking the advisor | yes |
| 4 | `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 SKILL_ADVISOR_DEBUG=1 node .../user-prompt-submit.js` | 0 | `{}`; `diagnostic lines: 270 -> 271`; last record `status: "skipped"`, `freshness: "unavailable"`, `runtime: "claude"` | prints `{}`, exits 0; diagnostics gain one line; newest record `status: "skipped"` and `freshness: "unavailable"` | yes |
DEVIATIONS: Step 1 was run twice. The first attempt ran inside the tool sandbox (exit 0) and returned a degraded `local-scorer` payload with `recommendations: []` and neither `freshness` nor `ADVISOR_DISABLED`. The same command was rerun with the tool sandbox lifted so the scenario's `/tmp` socket and DB directories could be created; that rerun is the row above. Step 4 was also run with the tool sandbox lifted because the diagnostics file is under `/var/folders`. Extra `echo` lines were added around steps 1 and 4; the scenario commands themselves were unchanged.
NOTES: The diagnostics file was at 270 lines, under the 300-line trim threshold, so the 270 → 271 count is the expected append. No captured output contained the prompt literal `help me commit my changes`.
