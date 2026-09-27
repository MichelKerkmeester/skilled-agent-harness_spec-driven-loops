<!-- dispatch: cursor CP-003; ledger: 2026-09-27T13:36:29Z 2026-09-27T13:38:53Z 0 144 -->

RESULT: PASS | scenario=CP-003 | runtime=cursor
NATIVE: none visible
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 node skill-advisor.cjs advisor_recommend (sandboxed socket+DB) | 0 | recommendations: []; freshness: "unavailable"; warnings and trustState.reason: ADVISOR_DISABLED; abstain reason names SPECKIT_SKILL_ADVISOR_HOOK_DISABLED; prompt text absent | recommendations: [], freshness: "unavailable", and ADVISOR_DISABLED | yes |
| 2 | SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 python3 skill_advisor.py | 0 | [] | [] or prompt-safe disabled output without native scoring | yes |
| 3 | npm test system-skill-advisor-plugin.vitest.ts -t "opt-out" | 0 | Test Files 1 passed; Tests 3 passed, 63 skipped (includes shared hook env opt-out for SPECKIT_SKILL_ADVISOR_HOOK_DISABLED) | OpenCode plugin disabled/skipped without invoking the advisor, covered by the plugin env opt-out case | yes |
| 4 | SKILL_ADVISOR_DEBUG=1 node user-prompt-submit.js with the disable flag | 0 | {} ; Exit: 0 ; diagnostic lines: 262 -> 263 ; last record status: "skipped", freshness: "unavailable", runtime: "claude" | prints {}, exits 0; diagnostics JSONL gains one line; newest record status "skipped" and freshness "unavailable" | yes |
DEVIATIONS: Step 1 was first run inside the tool filesystem sandbox. That attempt returned a degraded local-scorer body with empty recommendations and no freshness or ADVISOR_DISABLED, because the scenario /tmp socket and database could not be written. That attempt was discarded. The recorded step 1 is an exact rerun of the scenario block with unrestricted filesystem access. Steps 2–4 used the same unrestricted access. No scenario command text was changed.
NOTES: Diagnostic file stayed under the 300-line trim (262 to 263), so the line count is the right signal. The prompt literal did not appear in any captured output. Step 4 appended one line to the existing diagnostics JSONL outside the repo; no repository files were edited.
