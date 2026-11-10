<!-- dispatch: opencode CP-003; ledger: 2026-09-28T07:41:04Z 2026-09-28T07:45:10Z 0 246 -->

Scenario CP-003 read. STEP 0: the Advisor line is `Advisor: live; ambiguous: cli-external-orchestration 0.95/0.18 vs sk-code 0.88/0.16 pass.`

Running step 1 as one block (native CLI + sandbox teardown, up to ~60s wait):
Step 1 matched expectations. Verifying no leftover sandbox, then running steps 2–4:
Step 2 returned `[]`. Now step 3 (plugin test) and step 4 (hook adapter):
Plugin test: 3 passed (opt-out cases). Now step 4 (hook adapter + diagnostics JSONL):
RESULT: PASS | scenario=CP-003 | runtime=opencode
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.18 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | node skill-advisor.cjs advisor_recommend --prompt "help me commit my changes" (sandboxed, SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1, idle 0.2min) + no-signal teardown | 0 | `"recommendations": []`, `"freshness": "unavailable"`, `trustState.reason: "ADVISOR_DISABLED"`, `warnings: ["ADVISOR_DISABLED"]`; teardown printed `sandbox advisor exited; sandbox removed`; `ls -d /tmp/cp003.*` → no matches | Native returns `recommendations: []`, `freshness: "unavailable"` and `ADVISOR_DISABLED`; step prints `sandbox advisor exited; sandbox removed`; no `/tmp/cp003.*` left | yes |
| 2 | python3 skill_advisor.py "help me commit my changes" (DISABLED=1) | 0 | `[]` | `[]` or prompt-safe disabled output without native scoring | yes |
| 3 | npm --prefix runtime run test -- system-skill-advisor-plugin.vitest.ts -t "opt-out" | 0 | `Tests 3 passed \| 63 skipped (66)`, file passed | Plugin returns disabled/skipped output without invoking the advisor (env opt-out case) | yes |
| 4 | printf UserPromptSubmit JSON \| user-prompt-submit.js (DISABLED=1, SKILL_ADVISOR_DEBUG=1) | 0 | `{}` then `Exit: 0`; `diagnostic lines: 265 -> 266`; last line `{"timestamp":"2026-09-28T07:43:05.921Z","runtime":"claude","status":"skipped","freshness":"unavailable","durationMs":1,"cacheHit":false}` | Hook prints `{}`, exits `0`; diagnostics JSONL gains one line; newest record `status: "skipped"`, `freshness: "unavailable"` | yes |
DEVIATIONS: Step 1 ran with two added lines outside the block text: `set -x` tracing, and `echo "CLI exit: $?"` immediately after the CLI call (the block as written does not surface the CLI exit code; executor rules require reading output AND exit status). Every original line of the block — including the teardown, unchanged — ran verbatim in order in one shell. No step skipped, no teardown command changed.
NOTES: The prompt literal appears in the step-1 shell xtrace because it is on the invocation command line; no disabled response contains it (`recommendations: []`, shim `[]`, hook `{}`). The diagnostics JSONL count here (265 -> 266) differs from the scenario's recorded 2026-09-26 example (229 -> 230) because the live file has grown; the scenario directs reading the last line instead of the count, and the last line matched. Step 1 ran once with a clean teardown; no flaky rerun; no environment limit hit.
