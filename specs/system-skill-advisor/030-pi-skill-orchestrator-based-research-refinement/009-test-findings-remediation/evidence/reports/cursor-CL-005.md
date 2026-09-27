<!-- dispatch: cursor CL-005; ledger: 2026-09-26T21:50:16Z 2026-09-26T21:55:04Z 0 288 -->

RESULT: PASS | scenario=CL-005 | runtime=cursor
NATIVE: none visible
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | npm install && npm run build (advisor runtime) | skipped | not run | runtime build is current | skipped |
| 2 | node skill-advisor.cjs advisor_recommend --prompt "save this conversation context to memory" --format json | 0 | status "ok"; freshness "live"; trustState.state "live"; effectiveThresholds confidenceThreshold 0.8, uncertaintyThreshold 0.35, confidenceOnly false; top recommendation system-spec-kit confidence 0.927 | JSON status "ok" or a prompt-safe fail-open; 014 thresholds 0.8 / 0.35 / confidenceOnly false; live daemon maps to route "cli" | yes |
| 3 | npm run test -- tests/system-skill-advisor-plugin.vitest.ts | 0 | Test Files 1 passed (1); Tests 65 passed (65); duration 985ms | plugin status-tool test passes, including brief rendering and the opt-out paths that spawn no advisor and report enabled=false | yes |
| 4 | opencode run -m opencode-go/deepseek-v4.1-flash … </dev/null, then both greps | 0 | opencode exit=0; stdout is exactly spec_kit_skill_advisor_status; grep for failed to load plugin naming system-skill-advisor.js printed nothing (grep exit 1) | exit 0; first grep prints nothing; second grep matches spec_kit_skill_advisor_status | yes |
DEVIATIONS: step 1 npm install skipped: prebuilt by orchestrator. step 1 npm run build skipped: prebuilt by orchestrator. Step 2 was repeated outside the sandbox after the sandboxed call could not reach the daemon socket; the row above is that unsandboxed run.
NOTES: This session is Cursor, so spec_kit_skill_advisor_status was not called here. The plugin sets ADVISOR_CLI_PATH to ../bin/skill-advisor.cjs and does not import a private handler. The playbook's pasted evidence still says 40 tests; this run passed 65/65, including env opt-out, shared hook env opt-out, and config opt-out. /tmp/skill-advisor-playbook was removed after the greps.
