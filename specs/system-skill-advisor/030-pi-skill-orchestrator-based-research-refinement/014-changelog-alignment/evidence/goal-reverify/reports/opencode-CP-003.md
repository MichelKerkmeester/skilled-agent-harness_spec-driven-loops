<!-- dispatch: opencode CP-003; ledger: 2026-09-28T13:31:03Z 2026-09-28T13:36:12Z 0 309 -->

Reading scenario CP-003 complete. Running the four test blocks now, starting with step 1 as a single shell block.
Step 1 matched expectations. Running step 2 (Python shim):
Step 2 matched. Running step 3 (OpenCode plugin test):
Step 3 matched (3 opt-out tests passed). Running step 4 (hook adapter):
All four steps ran. Verifying no `/tmp/cp003.*` leftovers (step 1 expected signal):
RESULT: PASS | scenario=CP-003 | runtime=opencode
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.18 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | advisor_recommend --disable + sandbox block | 0 | recommendations: [], freshness "unavailable", trustState.reason ADVISOR_DISABLED, warnings ["ADVISOR_DISABLED"]; "sandbox advisor exited; sandbox removed"; no /tmp/cp003.* remains | recommendations [], freshness "unavailable", ADVISOR_DISABLED; "sandbox advisor exited; sandbox removed"; no /tmp/cp003.* left | Yes |
| 2 | python3 skill_advisor.py (disabled) | 0 | [] | [] or prompt-safe disabled output without native scoring | Yes |
| 3 | npm test plugin -t "opt-out" | 0 | Test Files 1 passed; Tests 3 passed \| 63 skipped | plugin returns disabled/skipped output without invoking the advisor (env opt-out case) | Yes |
| 4 | user-prompt-submit.js (disabled + SKILL_ADVISOR_DEBUG=1) | 0 | {}; Exit: 0; diagnostic lines 205 -> 206; tail: {"status":"skipped","freshness":"unavailable",...} | {}; exit 0; +1 diagnostic line; newest record status "skipped", freshness "unavailable" | Yes |
DEVIATIONS: none
NOTES: Diagnostics count differs from the file's 2026-09-26 sample (205→206 vs 229→230) — running count, not a signal mismatch; the scenario requires "gains one line" and the last-line fields, both satisfied. Step 1 teardown ran as written and printed `sandbox advisor exited; sandbox removed`; a post-check `ls /tmp/cp003.*` confirmed no leftover folder.
