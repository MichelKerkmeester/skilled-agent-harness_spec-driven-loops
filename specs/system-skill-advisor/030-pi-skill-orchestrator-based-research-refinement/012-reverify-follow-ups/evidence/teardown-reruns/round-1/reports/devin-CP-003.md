<!-- dispatch: devin CP-003; ledger: 2026-09-27T15:44:32Z 2026-09-27T15:45:32Z 0 60 -->

STEP 0: The Advisor line visible in my context is:

`Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.`

Now reading the scenario file.Scenario CP-003: validate `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` across four surfaces. Running step 1 — native CLI in an isolated sandbox with teardown.Step 1 passed: empty recommendations, `freshness: "unavailable"`, `ADVISOR_DISABLED`, and `sandbox launcher 33150 stopped`. Verifying no sandbox folder remains, then running steps 2–4.Steps 1–2 pass. Running step 3 — the OpenCode plugin opt-out test.Step 3 passed (3 opt-out tests green). Running step 4 — the hook adapter with diagnostics JSONL check.All four steps ran and matched the expected signals. Printing the report.

RESULT: PASS | scenario=CP-003 | runtime=Devin CLI (SWE-2 High)
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | `mktemp` sandbox + `skill-advisor.cjs advisor_recommend` with `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1`, then launcher teardown + `rm -rf` | 0 | `recommendations: []`, `freshness: "unavailable"`, `trustState.reason: "ADVISOR_DISABLED"`, warnings `["ADVISOR_DISABLED"]`; teardown printed `sandbox launcher 33150 stopped`; `ls -d /tmp/cp003.*` → none left | `recommendations: []`, `freshness: "unavailable"`, `ADVISOR_DISABLED`; `sandbox launcher <pid> stopped`; no `/tmp/cp003.*` remains | yes |
| 2 | `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 python3 .../skill_advisor.py "help me commit my changes"` | 0 | `[]` | `[]` or prompt-safe disabled output without native scoring | yes |
| 3 | `npm --prefix .../runtime run test -- tests/system-skill-advisor-plugin.vitest.ts -t "opt-out"` | 0 | vitest: 3 passed, 63 skipped | plugin disabled/skipped output covered by env opt-out case | yes |
| 4 | hook adapter: resolve `advisorHookDiagnosticsPath`, pipe prompt JSON into `claude/user-prompt-submit.js` with flag + `SKILL_ADVISOR_DEBUG=1` | 0 | stdout `{}`, `Exit: 0`, diagnostics `216 -> 217`, last line `{"runtime":"claude","status":"skipped","freshness":"unavailable",...}` | prints `{}`, exit 0, newest record `status: "skipped"` and `freshness: "unavailable"` | yes |
DEVIATIONS: none — all four blocks ran exactly as written.
NOTES: Step 1's cold start spawned sandbox launcher pid 33150 (plus its daemon child); the block's own teardown stopped it and no `/tmp/cp003.*` folder was left behind. The disabled response contained no prompt text on any surface. The step-4 diagnostics append wrote one line to the repo-local diagnostics JSONL, which is the scenario's own designed observation channel.
