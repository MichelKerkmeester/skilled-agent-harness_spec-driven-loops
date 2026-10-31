<!-- dispatch: opencode CP-003; ledger: 2026-09-27T13:53:17Z 2026-09-27T13:55:43Z 0 146 -->

Scenario CP-003 read in full. Four test-execution steps to run in order against expected signals. Running step 1 (native CLI in sandbox).
Step 1 matches expected signals (`recommendations: []`, `freshness: "unavailable"`, `ADVISOR_DISABLED`, exit 0, no prompt literal). Running step 2 (Python shim).
Step 2 matches (`[]`, no native scoring, no prompt literal). Running step 3 (OpenCode plugin opt-out test).
Step 3 matches (opt-out tests: 3 passed, 63 skipped, exit 0). Running step 4 (hook adapter + diagnostics JSONL).
RESULT: PASS | scenario=CP-003 | runtime=opencode
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| --- | --- | --- | --- | --- | --- |
| 1 | skill-advisor.cjs advisor_recommend, sandbox, SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 | 0 | recommendations: [], freshness: "unavailable", trustState.reason "ADVISOR_DISABLED", warnings ["ADVISOR_DISABLED"], no prompt literal | recommendations: [], freshness: "unavailable", ADVISOR_DISABLED | YES |
| 2 | python3 skill_advisor.py "help me commit my changes", DISABLED=1 | 0 | [] | [] or prompt-safe disabled output without native scoring | YES |
| 3 | npm run test -- system-skill-advisor-plugin.vitest.ts -t "opt-out" | 0 | 3 passed, 63 skipped (66) | plugin disabled/skipped without invoking advisor (env opt-out case) | YES |
| 4 | printf prompt JSON \| user-prompt-submit.js, DISABLED=1 SKILL_ADVISOR_DEBUG=1 | 0 | {} ; diagnostic lines 284 -> 285 ; last line {"runtime":"claude","status":"skipped","freshness":"unavailable","durationMs":1,"cacheHit":false} | {} and exit 0; JSONL gains one line; newest record status "skipped", freshness "unavailable" | YES |
DEVIATIONS: none
NOTES: Diagnostics JSONL is outside the repo (/var/folders/.../T/speckit-skill-advisor-metrics/...-diagnostics.jsonl); its append is the scenario step's own designed side effect. Baseline was 284 lines vs the file's 229->230 sample from 2026-09-26 — count drift only; the +1 append and last-record fields match. File was below the 300-line trim threshold. No failure-mode trigger: no surface recommended a skill and no disabled output echoed the prompt literal.
