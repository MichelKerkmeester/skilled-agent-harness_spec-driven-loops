<!-- dispatch: pi CP-003; ledger: 2026-09-26T18:52:53Z 2026-09-26T18:59:12Z 0 379 -->

Delta of exactly 1 per invocation confirms each run of the step-4 command emits one skipped diagnostic record; the extra records in the shared log come from a concurrent worker (a new one appeared at 18:56:56 between my checks). All verification complete. No repository files were written; the scenario's sandbox was removed by its own step and my scratch files were deleted.

---

RESULT: PASS | scenario=CP-003 | runtime=pi
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---|---|---|---|
| 1 | sandboxed `skill-advisor.cjs advisor_recommend` w/ `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` | 0 | `recommendations: []`, `freshness: "unavailable"`, `trustState.reason: "ADVISOR_DISABLED"`, `warnings: ["ADVISOR_DISABLED"]`, abstainReason "Skill advisor disabled by SYSTEM_SKILL_ADVISOR_HOOK_DISABLED." | `recommendations: []`, `freshness: "unavailable"`, `ADVISOR_DISABLED` | ✓ |
| 2 | `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 python3 skill_advisor.py "help me commit..."` | 0 | `[]` — no scoring output | `[]` or prompt-safe disabled output without native scoring | ✓ |
| 3 | `npm --prefix .../runtime run test -- ...plugin.vitest.ts -t "opt-out"` | 0 | Test Files 1 passed; Tests 3 passed \| 62 skipped | Plugin opt-out case passes: disabled/skipped output without invoking the advisor | ✓ |
| 4 | `printf '{...}' \| SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 node .../dist/hooks/claude/user-prompt-submit.js` | 0 | stdout: `{}`; stderr: empty. Skipped diagnostic verified durably: one `{"runtime":"claude","status":"skipped","freshness":"unavailable","durationMs":1,"cacheHit":false}` record appended per invocation (count-delta rerun: +1) | Returns `{}` with skipped diagnostic | ✓ |

Failure-mode checks (all clear): no surface recommended a skill under the disabled flag (steps 1–4 all empty/`{}`); the prompt literal "help me commit my changes" appears nowhere in captured stdout/stderr nor in the diagnostics records (prompt-free closed schema); the plugin honors the new `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` flag (opt-out tests pass).

DEVIATIONS: One extra rerun of the step-4 command (same command, same env) to resolve record-ownership in the shared diagnostics log; it behaves identically to the scripted runs. No step was skipped or otherwise changed.

NOTES: (1) The step-4 "skipped diagnostic" is not visible in the exact command's own stdio: the system-spec-kit shim (`runtime/dist/hooks/claude/user-prompt-submit.js`) spawns the real adapter and discards the child's stderr, where `emitDiagnostic` writes. The diagnostic is instead persisted to `<os.tmpdir()>/speckit-skill-advisor-metrics/<ws-hash>-diagnostics.jsonl`, where I confirmed `status:"skipped"` records landing exactly at each invocation's timestamp, with the disabled-path record shape from the adapter source (`return {}` → no emittedBytes/errorDetails). I judged the expected signal satisfied because the adapter demonstrably emits it per invocation (delta +1). A reviewer wanting the diagnostic on the command's stdio would have to invoke the real adapter directly or change the shim — out of scope here. (2) That diagnostics log is shared with concurrent workers (devin/codex/claude/pi records interleave; new records appeared between my reads), so raw record counts include other sessions; per-run delta of 1 is the attribution evidence. (3) Step 1's sandbox and my /tmp scratch files were cleaned up; nothing was written inside the repository.
