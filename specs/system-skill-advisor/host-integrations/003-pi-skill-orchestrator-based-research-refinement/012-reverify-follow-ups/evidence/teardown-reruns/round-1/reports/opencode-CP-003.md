<!-- dispatch: opencode CP-003; ledger: 2026-09-27T15:47:36Z 2026-09-27T15:50:18Z 0 162 -->

I'll start by reading the scenario file, then execute it.
Step 1 matches expected signals. Running step 2 (Python shim):
Step 2 returns `[]`. Running step 3 (OpenCode plugin test):
Step 3: 3 opt-out tests passed. Running step 4 (hook adapter):
RESULT: PASS | scenario=CP-003 | runtime=opencode
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| --- | --- | --- | --- | --- | --- |
| 1 | sandbox: `node skill-advisor.cjs advisor_recommend --prompt "help me commit my changes"` with `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1`, isolated DB/sock + lease teardown | 0 | `recommendations: []`, `freshness: "unavailable"`, `trustState.reason: "ADVISOR_DISABLED"`, `warnings: ["ADVISOR_DISABLED"]`, `abstainReasons: ["Skill advisor disabled by SPECKIT_SKILL_ADVISOR_HOOK_DISABLED."]`; teardown printed `sandbox launcher 52513 stopped`; no `/tmp/cp003.*` left (`ls` exit 1) | `recommendations: []`, `freshness: "unavailable"` and `ADVISOR_DISABLED`; then `sandbox launcher <pid> stopped` and no `/tmp/cp003.*` left behind | yes |
| 2 | `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 python3 .../skill_advisor.py "help me commit my changes"` | 0 | `[]` | `[]` or prompt-safe disabled output without native scoring | yes |
| 3 | `npm --prefix .skilled/skills/system-skill-advisor/runtime run test -- tests/system-skill-advisor-plugin.vitest.ts -t "opt-out"` | 0 | Test Files 1 passed; Tests 3 passed \| 63 skipped (66) | env opt-out case covers disabled/skipped plugin output without invoking the advisor | yes |
| 4 | hook adapter: pipe prompt JSON into `user-prompt-submit.js` with `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 SKILL_ADVISOR_DEBUG=1`, read diagnostics JSONL | 0 | `{}`; `Exit: 0`; `diagnostic lines: 218 -> 219`; last line `{"timestamp":"2026-09-27T15:49:16.787Z","runtime":"claude","status":"skipped","freshness":"unavailable","durationMs":2,"cacheHit":false}` | `{}`, exit `0`, JSONL gains one line, newest record `status: "skipped"`, `freshness: "unavailable"` | yes |
DEVIATIONS: No step skipped. Observation-only additions to the blocks to capture exit status (dispatch requires reading output AND exit code) and to back the leftover-folder signal: `echo "NODE_EXIT: $?"` after step 1's node call, `ls -d /tmp/cp003.*` after step 1's `rm -rf "$SANDBOX"`, and `echo "EXIT: $?"` after steps 2 and 3. No command behavior changed.
NOTES: Diagnostics baseline count was 218 here (the file's 2026-09-26 note shows 229 -> 230); the +1 delta and record fields match the expected signals, and the scenario itself directs reading the last line rather than the count. No disabled output contained the prompt literal. Live daemon/DB untouched; sandbox removed.
