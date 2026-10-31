<!-- dispatch: pi CP-003; ledger: 2026-09-28T13:21:33Z 2026-09-28T13:24:35Z 0 182 -->

RESULT: PASS | scenario=CP-003 | runtime=pi
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.18 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| --- | --- | --- | --- | --- | --- |
| 1 | sandboxed `skill-advisor.cjs advisor_recommend` with `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1`, then teardown wait block (one shell) | 0 | `recommendations: []`, `freshness: "unavailable"`, `trustState.reason: "ADVISOR_DISABLED"`, warning/abstain `ADVISOR_DISABLED`; teardown printed `sandbox advisor exited; sandbox removed`; follow-up `ls -d /tmp/cp003.*` → `No such file or directory` | `recommendations: []`, `freshness: "unavailable"`, `ADVISOR_DISABLED`; then `sandbox advisor exited; sandbox removed` and no `/tmp/cp003.*` left behind | ✅ |
| 2 | `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 python3 …/skill_advisor.py "help me commit my changes"` | 0 | `[]` | `[]` or prompt-safe disabled output without native scoring | ✅ |
| 3 | `npm --prefix …/runtime run test -- tests/system-skill-advisor-plugin.vitest.ts -t "opt-out"` | 0 | `Test Files 1 passed`, `Tests 3 passed \| 63 skipped` | Plugin returns disabled/skipped output without invoking the advisor (env opt-out case passes) | ✅ |
| 4 | hook adapter block: `user-prompt-submit.js` with `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 SKILL_ADVISOR_DEBUG=1` | 0 | `{}`; `Exit: 0`; `diagnostic lines: 299 -> 300`; last line `{"timestamp":"2026-09-28T13:24:12.637Z","runtime":"claude","status":"skipped","freshness":"unavailable","durationMs":2,"cacheHit":false}` | `{}`, exit `0`, diagnostics JSONL gains one line, newest record `status: "skipped"` and `freshness: "unavailable"` | ✅ |
DEVIATIONS: One added observation line in step 1: `echo "adviser-exit: $?"` between the sandboxed `advisor_recommend` call and the teardown `if` block, to capture the node exit code separately. No teardown command was changed; the block still ran as one shell with `$SANDBOX` and `$$` intact and printed its teardown line as written.
NOTES: Step 1's teardown sent no signal as designed — the sandbox daemon exited on its own idle timeout (wait loop satisfied the >25s + clean-lease + empty-socket + no-open-files conditions before `rm -r`). Step 4's diagnostic count grew 299 → 300, below the 300-line trim threshold, so the count and the last-line read agree. No live daemon, database, or repository files were touched.
