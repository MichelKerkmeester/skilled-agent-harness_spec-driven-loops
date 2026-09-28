<!-- dispatch: opencode CP-003; ledger: 2026-09-27T16:39:57Z 2026-09-27T16:42:30Z 0 153 -->

Step 0: NATIVE captured. Now running Step 1 (native CLI sandbox block).
Step 1 matches. Running Step 2 (Python shim).
Step 2 matches. Running Step 3 (OpenCode plugin test).
Step 3 matches. Running Step 4 (hook adapter + diagnostics).
RESULT: PASS | scenario=CP-003 | runtime=opencode
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.18 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---|---|---|---|
| 1 | sandboxed `skill-advisor.cjs advisor_recommend` with `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` + lease/socket wait + teardown | 0 | `recommendations: []`, `freshness: "unavailable"`, `trustState.reason: "ADVISOR_DISABLED"`, warning + abstainReason `ADVISOR_DISABLED` / "Skill advisor disabled by SPECKIT_SKILL_ADVISOR_HOOK_DISABLED."; teardown printed `sandbox advisor exited; sandbox removed`; no `/tmp/cp003.*` left (zsh: no matches found) | `recommendations: []`, `freshness: "unavailable"`, `ADVISOR_DISABLED`; teardown prints `sandbox advisor exited; sandbox removed`; no `/tmp/cp003.*` left behind | yes |
| 2 | `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 python3 .../skill_advisor.py "help me commit my changes"` | 0 | `[]` | `[]` or prompt-safe disabled output without native scoring | yes |
| 3 | `npm --prefix .../runtime run test -- tests/system-skill-advisor-plugin.vitest.ts -t "opt-out"` | 0 | Test Files 1 passed; Tests 3 passed \| 63 skipped (66) | Plugin returns disabled/skipped output without invoking the advisor, covered by the plugin test's env opt-out case | yes |
| 4 | diagnostics path via `metrics.js`, then pipe JSON into `user-prompt-submit.js` with `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 SKILL_ADVISOR_DEBUG=1`, read last JSONL record | 0 | `{}`; `diagnostic lines: 228 -> 229`; last record `{"timestamp":"2026-09-27T16:41:53.397Z","runtime":"claude","status":"skipped","freshness":"unavailable","durationMs":1,"cacheHit":false}` | Prints `{}`, exit `0`; diagnostics JSONL gains one line; newest record has `status: "skipped"` and `freshness: "unavailable"` (read last line, not the count) | yes |
DEVIATIONS: none
NOTES: Teardown line reported exactly as required: `sandbox advisor exited; sandbox removed`. Diagnostics line counts (228 -> 229) differ from the scenario's 2026-09-26 historical sample (229 -> 230); per the scenario's own rule only the gained line and the last record's `status`/`freshness` are load-bearing, and both matched. No disabled output contained the prompt literal "help me commit my changes". Live daemon and live skill-advisor database untouched; sandbox was the only temp state and it was removed by the block.
