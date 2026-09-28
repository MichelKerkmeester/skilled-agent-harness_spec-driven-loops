<!-- dispatch: cursor CL-005; ledger: 2026-09-28T13:10:50Z 2026-09-28T13:14:40Z 0 230 -->

RESULT: PASS | scenario=CL-005 | runtime=cursor
NATIVE: none visible
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1a | npm --prefix .../runtime install | skipped | not run | advisor runtime install | skipped |
| 1b | npm --prefix .../runtime run build | skipped | not run | advisor runtime build | skipped |
| 2 | skill-advisor.cjs advisor_recommend --json | 0 | status ok; degraded true; source local-scorer; effectiveThresholds confidenceThreshold 0.8, uncertaintyThreshold 0.35, confidenceOnly false; recommendations present | JSON status ok or prompt-safe fail-open; 014 thresholds 0.8 / 0.35 / confidenceOnly false; local-scorer is the documented stale path | yes |
| 3 | vitest tests/system-skill-advisor-plugin.vitest.ts | 0 | Test Files 1 passed (1); Tests 66 passed (66); none failed | Test Files 1 passed (1); every test passed and none failed; count is not a criterion | yes |
| 4 | opencode run ... system-skill-advisor load | 0 | opencode exit=0; first grep printed nothing; second grep printed `1:spec_kit_skill_advisor_status` | exit 0; no `failed to load plugin` line naming system-skill-advisor.js; stdout lists spec_kit_skill_advisor_status | yes |
DEVIATIONS: Step 1 `npm --prefix .skilled/skills/system-skill-advisor/runtime install` skipped: prebuilt by orchestrator. Step 1 `npm --prefix .skilled/skills/system-skill-advisor/runtime run build` skipped: prebuilt by orchestrator. Step 4 appended `echo "GREP2_EXIT=$?"` after the scenario block; the scenario commands and redirects were otherwise unchanged, and that echo printed 0. Also ran `vitest ... -t opt-out` because Expected Signals require that selection to report 3 passed; it is not a numbered execution step. It exited 0 with `Test Files  1 passed (1)` and `Tests  3 passed | 63 skipped (66)`.
NOTES: This session is Cursor, so `spec_kit_skill_advisor_status` was not called here. Step 2 ran in the sandbox and answered from `local-scorer` with `degraded: true`, which the scenario treats as the prompt-safe stale path. The opt-out skipped count is 63 of 66; the file's recorded evidence says 62 skipped of 65, and the scenario says a differing skipped count is not a mismatch. The 3 passed count matches.
