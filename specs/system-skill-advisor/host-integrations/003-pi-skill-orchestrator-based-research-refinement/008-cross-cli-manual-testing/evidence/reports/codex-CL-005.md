<!-- dispatch: codex CL-005; ledger: 2026-09-26T19:36:32Z 2026-09-26T19:37:13Z 0 41 -->

RESULT: PASS | scenario=CL-005 | runtime=Codex
NATIVE: Advisor: outage (fail_open); route by hand: node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<request>"}' --format json
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---:|---|---|---|
| 1a | `npm ... install` | skipped | Skipped as instructed | Runtime build current | N/A |
| 1b | `npm ... run build` | skipped | Skipped as instructed | Runtime build current | N/A |
| 2 | `node .skilled/bin/skill-advisor.cjs advisor_recommend ... --format json` | 0 | `status: ok`; thresholds `0.8`, `0.35`, `confidenceOnly: false`; freshness `live` | JSON success and expected thresholds | Yes |
| 3 | `npm ... run test -- tests/system-skill-advisor-plugin.vitest.ts` | 0 | 1 test file passed; 65 tests passed | Plugin bridge and status tests pass | Yes |

DEVIATIONS: Step 1 install and build skipped: prebuilt by orchestrator.
NOTES: Not running inside OpenCode; status tool call not applicable.
