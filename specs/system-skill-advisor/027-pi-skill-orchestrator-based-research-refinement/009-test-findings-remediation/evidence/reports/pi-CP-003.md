<!-- dispatch: pi CP-003; ledger: 2026-09-26T22:16:00Z 2026-09-26T22:18:16Z 0 136 -->

RESULT: PASS | scenario=CP-003 | runtime=pi
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | sandboxed `skill-advisor.cjs advisor_recommend` with `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` (DB+socket isolated) | 0 | `recommendations: []`, `freshness: "unavailable"`, `trustState.reason: "ADVISOR_DISABLED"`, warnings `["ADVISOR_DISABLED"]` | `recommendations: []`, `freshness: "unavailable"`, `ADVISOR_DISABLED` | yes |
| 2 | `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 python3 .../skill_advisor.py "help me commit my changes"` | 0 | prints `[]` | `[]` or prompt-safe disabled output without native scoring | yes |
| 3 | `npm --prefix .../runtime run test -- tests/system-skill-advisor-plugin.vitest.ts -t "opt-out"` | 0 | vitest: 1 file passed, `Tests 3 passed \| 62 skipped (65)` | plugin opt-out case passes: disabled/skipped output without invoking the advisor | yes |
| 4 | hook adapter `user-prompt-submit.js` with `SKILL_ADVISOR_DEBUG=1` + disabled flag; read diagnostics JSONL | 0 | prints `{}`; `diagnostic lines: 263 -> 264`; last record `{"timestamp":"2026-09-26T22:17:48.134Z","runtime":"claude","status":"skipped","freshness":"unavailable","durationMs":1,"cacheHit":false}` | `{}`, exit 0, JSONL gains one line (or trims to newest 200 past 300), newest record `status: "skipped"` and `freshness: "unavailable"` | yes |
DEVIATIONS: none
NOTES: Failure-mode checks came back clean: no surface returned a non-empty recommendation and no captured output contains the prompt literal "help me commit my changes". Step 4's diagnostics counts (263→264) differ from the scenario's dated example (229→230) because the live JSONL has grown since 2026-09-26; the expectation is "gains one line", which holds, and the file never crossed the 300-line trim threshold. Per the scenario as written, step 4 appended one record to the live diagnostics JSONL (it reads `advisorHookDiagnosticsPath(process.cwd())`); nothing else in the repository was modified, and the step-1 sandbox dir was created and removed inside its own command block.
