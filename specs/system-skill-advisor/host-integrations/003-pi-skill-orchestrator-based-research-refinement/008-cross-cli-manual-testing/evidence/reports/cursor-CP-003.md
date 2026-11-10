<!-- dispatch: cursor CP-003; ledger: 2026-09-26T19:01:33Z 2026-09-26T19:04:54Z 0 201 -->

RESULT: FAIL | scenario=CP-003 | runtime=cursor
NATIVE: none visible
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 node skill-advisor.cjs advisor_recommend` (socket+DB sandbox) | 0 | `recommendations: []`, `freshness: "unavailable"`, `warnings: ["ADVISOR_DISABLED"]`, `trustState.reason: "ADVISOR_DISABLED"` | `recommendations: []`, `freshness: "unavailable"`, `ADVISOR_DISABLED` | yes |
| 2 | `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 python3 skill_advisor.py` | 0 | `[]` | `[]` or prompt-safe disabled output without native scoring | yes |
| 3 | `npm --prefix runtime run test -- plugin.vitest.ts -t "opt-out"` | 0 | `Test Files 1 passed (1)`; `Tests 3 passed \| 62 skipped (65)` | disabled/skipped output without invoking the advisor, covered by the plugin env opt-out test | yes |
| 4 | `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 node user-prompt-submit.js` | 0 | stdout `{}` (3 bytes); stderr empty (0 bytes) | `{}` with skipped diagnostic | no |
DEVIATIONS: Step 1 was run once inside the tool filesystem sandbox and returned a degraded `local-scorer` payload with `recommendations: []` and neither `freshness` nor `ADVISOR_DISABLED`. That run is not the recorded result. The same block was rerun with the tool sandbox disabled so the scenario's own `/tmp` socket and database could be created; that output is step 1. Step 4 was repeated once to split stdout and stderr; both runs printed `{}` and no diagnostic.
NOTES: No captured output contained the prompt literal `help me commit my changes`. Step 1 `abstainReasons` text names `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED` while the scenario set `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`. The hook command's stderr stayed empty, so the skipped diagnostic was not in the command output. The invoked file is a shim that forwards the child's stdout and does not write the child's stderr.
