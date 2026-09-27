<!-- dispatch: devin CP-003; ledger: 2026-09-26T22:18:16Z 2026-09-26T22:19:02Z 0 46 -->

I'll run the scenario steps in order. Step 1 (native CLI, sandboxed):Step 1 matches expected signals. Step 2 (Python shim):Step 3 passed (3 opt-out tests). Step 4 (hook adapter + diagnostics JSONL):RESULT: PASS | scenario=CP-003 | runtime=devin-cli
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | `skill-advisor.cjs advisor_recommend` with `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1`, sandboxed DB+socket | 0 | `recommendations: []`, `freshness: "unavailable"`, `trustState.reason: "ADVISOR_DISABLED"`, warning `ADVISOR_DISABLED`, abstain reason "Skill advisor disabled by SPECKIT_SKILL_ADVISOR_HOOK_DISABLED." | `recommendations: []`, `freshness: "unavailable"`, `ADVISOR_DISABLED` | yes |
| 2 | `skill_advisor.py "help me commit my changes"` with disable flag | 0 | `[]` | `[]` or prompt-safe disabled output without native scoring | yes |
| 3 | `npm --prefix .../runtime run test -- tests/system-skill-advisor-plugin.vitest.ts -t "opt-out"` | 0 | vitest: 3 passed, 62 skipped (65 total), 1 file passed | plugin honors env opt-out (disabled/skipped without invoking advisor) | yes |
| 4 | claude `user-prompt-submit.js` hook with disable flag + `SKILL_ADVISOR_DEBUG=1`, JSONL line count before/after | 0 | stdout `{}`; `diagnostic lines: 266 -> 267`; last record `{"runtime":"claude","status":"skipped","freshness":"unavailable",...}` | prints `{}` exit 0; JSONL +1 line with `status:"skipped"`, `freshness:"unavailable"` | yes |
DEVIATIONS: none
NOTES: Step 1 used a `mktemp` sandbox for `SYSTEM_SKILL_ADVISOR_DB_DIR`/`SPECKIT_IPC_SOCKET_DIR` and removed it afterward, as written. The diagnostics JSONL lives under the system temp dir (`/var/folders/.../speckit-skill-advisor-metrics/`), not in the repo. No disabled-surface output contained the prompt literal; no repo files were written or modified.
