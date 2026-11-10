RESULT: FAIL | scenario=CL-005 | runtime=Codex
NATIVE: Advisor: live; ambiguous: sk-code 0.95/0.16 vs sk-doc 0.95/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---:|---|---|---|
| 1 | Advisor runtime install and build | skipped | — | Runtime is current | N/A |
| 2 | `node .skilled/bin/skill-advisor.cjs advisor_recommend … --format json` | 0 | `status: "ok"`, `freshness: "live"`; thresholds `0.8`, `0.35`, `confidenceOnly: false` | Successful or prompt-safe response with the 014 threshold pair | Yes |
| 3 | `npm … run test -- tests/system-skill-advisor-plugin.vitest.ts` | 0 | 1 test file passed; 65 tests passed | Plugin suite passes; documented evidence says 40/40 | No: count differs from documented expected output |
| 4 | `opencode run …` | 0 | OpenCode exit 0; no plugin-load failure line; `spec_kit_skill_advisor_status` listed | Exit 0, no matching load failure, status tool listed | Yes |
DEVIATIONS: Step 1 install: skipped: prebuilt by orchestrator. Step 1 build: skipped: prebuilt by orchestrator. Step 4 used a Python temporary-directory wrapper and equivalent output matching so its temporary files were cleaned up.
NOTES: Running in Codex, so the OpenCode-only status-tool call was not applicable. The test suite passed, but its 65-test count differs from the scenario’s documented 40-test result.