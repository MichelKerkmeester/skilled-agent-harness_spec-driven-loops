<!-- dispatch: cursor CL-005; ledger: 2026-09-27T13:14:02Z 2026-09-27T13:17:17Z 0 195 -->

RESULT: PASS | scenario=CL-005 | runtime=cursor
NATIVE: none visible
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | npm install; npm run build (advisor runtime) | skipped | not run | runtime build is current | skipped |
| 2 | skill-advisor.cjs advisor_recommend --json | 0 | status "ok"; freshness "live"; effectiveThresholds confidenceThreshold 0.8, uncertaintyThreshold 0.35, confidenceOnly false; recommendations present | JSON status "ok" or a prompt-safe fail-open; 014 pair 0.8 / 0.35 / confidenceOnly false; live or stale both acceptable | yes |
| 3 | vitest tests/system-skill-advisor-plugin.vitest.ts | 0 | Test Files 1 passed (1); Tests 66 passed (66); none failed | Test Files 1 passed (1); every test passed and none failed; test count is not a criterion | yes |
| 4 | opencode run -m opencode-go/deepseek-v4.1-flash (stdin closed) | 0 | opencode exit=0; load-failure grep printed nothing (grep exit 1); stdout line 1 is spec_kit_skill_advisor_status (grep exit 0) | exit 0; first grep prints nothing; second grep matches spec_kit_skill_advisor_status | yes |
DEVIATIONS: step 1 `npm --prefix .skilled/skills/system-skill-advisor/runtime install` skipped: prebuilt by orchestrator; step 1 `npm --prefix .skilled/skills/system-skill-advisor/runtime run build` skipped: prebuilt by orchestrator
NOTES: Also ran the expected-signal selection `vitest ... -t opt-out` (exit 0): Tests 3 passed | 63 skipped (66). The recorded evidence shows 65 tests and 62 skipped; the scenario says a count that differs from recorded evidence is not a mismatch, and the required 3 passed still holds. This session is Cursor, so the OpenCode-only `spec_kit_skill_advisor_status` tool call was not made. Step 4 finished in about 36 seconds.
