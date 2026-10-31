<!-- dispatch: cursor CL-001; ledger: 2026-09-26T18:47:04Z 2026-09-26T18:49:25Z 0 141 -->

RESULT: FAIL | scenario=CL-001 | runtime=cursor
NATIVE: none visible
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | npm --prefix .skilled/skills/system-spec-kit/runtime run build | skipped | not run | runtime build completes | skipped |
| 2 | printf help-me-commit payload \| node .../dist/hooks/claude/user-prompt-submit.js | 0 | stdout JSON; additionalContext starts `Advisor: live; use sk-git 0.95/0.12 pass.` | exit 0; additionalContext present and starts `Advisor:` plus freshness `live` or `stale` | yes |
| 3 | same invocation, stderr captured separately | 0 | stderr empty; prompt literal absent | stderr JSONL with `runtime: "claude"`, `emittedBytes`, and `directivesSuppressed`; raw prompt absent | no |
| 4 | printf thanks payload \| same compiled hook | 0 | first additionalContext line `Advisor: prompt skipped.` | `Advisor: prompt skipped.` | yes |
DEVIATIONS: step 1 skipped: prebuilt by orchestrator. Steps 2 and 3 were one invocation with stdout and stderr redirected to a temp dir, then the dir was removed. The absorbed legacy prompt was not run; numbered step 2 uses `help me commit my changes`.
NOTES: `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` was unset and the compiled hook existed. Stdout was not `{}`. The spec-kit shim returns the child stdout and writes parent stderr only for shim failure codes, so the success path produced no diagnostic JSONL.
