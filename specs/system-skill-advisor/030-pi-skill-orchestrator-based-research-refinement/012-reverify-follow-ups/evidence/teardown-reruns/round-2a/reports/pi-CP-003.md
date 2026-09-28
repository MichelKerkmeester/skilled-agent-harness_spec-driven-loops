<!-- dispatch: pi CP-003; ledger: 2026-09-27T16:31:07Z 2026-09-27T16:32:40Z 0 93 -->

RESULT: PASS | scenario=CP-003 | runtime=pi
NATIVE: Advisor: outage (fail_open); route by hand: node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<request>"}' --format json
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | sandboxed `advisor_recommend --prompt "help me commit my changes"` with SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 + sandbox wait/teardown | 0 | `recommendations: []`, `freshness: "unavailable"`, `trustState.reason: "ADVISOR_DISABLED"`, warning `ADVISOR_DISABLED`; teardown line `sandbox advisor exited; sandbox removed`; no `/tmp/cp003.*` left | `recommendations: []`, `freshness: "unavailable"`, `ADVISOR_DISABLED`; teardown prints `sandbox advisor exited; sandbox removed`; no `/tmp/cp003.*` left behind | ✅ |
| 2 | `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 python3 …/skill_advisor.py "help me commit my changes"` | 0 | `[]` (no prompt text in output) | `[]` or prompt-safe disabled output without native scoring | ✅ |
| 3 | `npm --prefix …/runtime run test -- tests/system-skill-advisor-plugin.vitest.ts -t "opt-out"` | 0 | `Test Files 1 passed (1)`, `Tests 3 passed \| 63 skipped (66)` | Plugin returns disabled/skipped output without invoking the advisor (covered by the plugin test's env opt-out case) | ✅ |
| 4 | hook adapter `user-prompt-submit.js` with `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 SKILL_ADVISOR_DEBUG=1`, then diagnostics tail | 0 | `{}`; `Exit: 0`; `diagnostic lines: 223 -> 224` (gained one line); last record `{"timestamp":"2026-09-27T16:32:21.515Z","runtime":"claude","status":"skipped","freshness":"unavailable","durationMs":2,"cacheHit":false}` | `{}`, exit `0`, diagnostics JSONL gains one line; newest record `status: "skipped"` and `freshness: "unavailable"` (read last line, not count) | ✅ |
DEVIATIONS: none
NOTES: Step 1 teardown printed exactly `sandbox advisor exited; sandbox removed` (sandbox self-exited on the idle timeout; no signal sent; no `/tmp/cp003.*` folder remained). Failure-mode checks clean: no surface recommended a skill, and no captured output contained the prompt literal. The diagnostics file was at 223 lines before step 4 (well under the 300-line trim threshold, so the +1 count delta is reliable). Live daemon untouched.
