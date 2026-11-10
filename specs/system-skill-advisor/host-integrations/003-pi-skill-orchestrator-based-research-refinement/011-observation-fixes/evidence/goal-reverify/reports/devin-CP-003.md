<!-- dispatch: devin CP-003; ledger: 2026-09-27T13:35:41Z 2026-09-27T13:36:29Z 0 48 -->

I'll read the scenario file first.Running step 1 — native CLI in an isolated sandbox.Step 1 matches expectations. Step 2 — Python shim.Step 2 matches. Step 3 — OpenCode plugin test.Step 3 passes. Step 4 — hook adapter with diagnostics JSONL.RESULT: PASS | scenario=CP-003 | runtime=devin
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | `skill-advisor.cjs advisor_recommend` under `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` with sandboxed DB+socket | 0 | `recommendations: []`, `freshness: "unavailable"`, `trustState.reason: "ADVISOR_DISABLED"`, warnings `["ADVISOR_DISABLED"]` | `recommendations: []`, `freshness: "unavailable"`, `ADVISOR_DISABLED` | yes |
| 2 | `python3 .../skill_advisor.py "help me commit my changes"` under disabled flag | 0 | `[]` | `[]` or prompt-safe disabled output without native scoring | yes |
| 3 | `npm --prefix .../runtime run test -- tests/system-skill-advisor-plugin.vitest.ts -t "opt-out"` | 0 | 3 tests passed, 63 skipped (filter matched opt-out cases) | plugin returns disabled/skipped output without invoking advisor (env opt-out case) | yes |
| 4 | spec-kit claude `user-prompt-submit.js` hook under disabled flag + `SKILL_ADVISOR_DEBUG=1` | 0 | stdout `{}`; diagnostics 261 -> 262; last line `{"runtime":"claude","status":"skipped","freshness":"unavailable","durationMs":1,"cacheHit":false}` | prints `{}`, exits 0, JSONL gains one line with `status:"skipped"` and `freshness:"unavailable"` | yes |
DEVIATIONS: none
NOTES: No disabled-surface output contained the prompt literal "help me commit my changes" (failure-mode check). Sandbox from step 1 removed via `rm -rf` inside the block as written.
