<!-- dispatch: cursor CL-005; ledger: 2026-09-26T19:33:18Z 2026-09-26T19:36:34Z 0 196 -->

RESULT: PASS | scenario=CL-005 | runtime=cursor
NATIVE: none visible
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | npm --prefix …/runtime install | skipped | not run | build/install current before the advisor call | skipped |
| 1 | npm --prefix …/runtime run build | skipped | not run | build/install current before the advisor call | skipped |
| 2 | node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "save this conversation context to memory" … --format json | 0 | status=ok; freshness=live; trustState.state=live; effectiveThresholds confidenceThreshold=0.8, uncertaintyThreshold=0.35, confidenceOnly=false; recommendations include system-spec-kit (confidence 0.927, status active) | JSON status "ok" or prompt-safe fail-open; 014 thresholds 0.8 / 0.35 / false; exit 0 for live or stale | yes |
| 3 | npm --prefix …/runtime run test -- tests/system-skill-advisor-plugin.vitest.ts | 0 | Test Files 1 passed (1); Tests 65 passed (65); Duration 994ms | Plugin suite passes, including brief rendering, fail-open, and the three opt-out paths (no advisor spawn, enabled=false) | yes |
DEVIATIONS: step 1 `npm --prefix .skilled/skills/system-skill-advisor/runtime install` skipped: prebuilt by orchestrator; step 1 `npm --prefix .skilled/skills/system-skill-advisor/runtime run build` skipped: prebuilt by orchestrator
NOTES: This run is Cursor, so `spec_kit_skill_advisor_status` was not called. The playbook evidence snapshot still says 40 passed; this run passed 65/65 with zero skipped, which includes `env opt-out disables bridge invocation`, `shared hook env opt-out disables bridge invocation`, and `config opt-out disables bridge invocation`. Plugin source resolves `ADVISOR_CLI_PATH` to `../bin/skill-advisor.cjs` and passes that path as the spawned CLI argument. The daemon answer was live (generation 482), which the scenario treats as success. npm printed an unknown-env-config `devdir` warning; the test exit code was still 0.
