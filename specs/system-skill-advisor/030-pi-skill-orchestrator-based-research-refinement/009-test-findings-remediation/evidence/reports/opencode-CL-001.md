<!-- dispatch: opencode CL-001; ledger: 2026-09-26T21:56:42Z 2026-09-26T22:07:13Z 0 631 -->

Scenario CL-001 read. Running preconditions and test steps.
Preconditions hold (flag unset, both compiled hooks present). Using a `mktemp -d` scratch dir per hard rules.
BEFORE was 237 (recorded prior step); AFTER is 239 — that's +2, not the expected +1. Investigating before judging.
The extra line is a concurrent `runtime:"pi"` write (22:00:06) from another process, not my test (my record is `claude` at 22:00:30). Rerunning the count atomically in one shell to isolate the delta.
Controlled window: 240→241, delta 1, newest record is `runtime:"claude"` with `emittedBytes`/`directivesSuppressed`. The earlier +2 was interleaved `pi`-runtime writes between my split shell calls. Now step 3 (inner hook stderr).
Step 3 matches. Now the extra casual-prompt run (`thanks`), expecting `Advisor: prompt skipped.`
All signals match. Cleaning up scratch dir, then reporting.
RESULT: PASS | scenario=CL-001 | runtime=opencode
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.18 vs sk-code 0.88/0.16 pass.

STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---|---|---|---|
| 0 | preconditions: echo $SPECKIT_SKILL_ADVISOR_HOOK_DISABLED; ls dist/hooks/claude/user-prompt-submit.js | 0 | flag empty/unset; shim 7086B exists at system-spec-kit dist, inner hook 15680B at system-skill-advisor dist | flag UNSET; hook script exists | yes |
| 1 | npm --prefix .skilled/skills/system-spec-kit/runtime run build | n/a | not run | build current | skipped (see DEVIATIONS) |
| 2a | resolve DIAG via advisorHookDiagnosticsPath(process.cwd()) | 0 | DIAG=/var/folders/.../speckit-skill-advisor-metrics/a9f078f65abeed95-diagnostics.jsonl; BEFORE=237 | DIAG resolves from repo root | yes |
| 2b | printf payload \| SKILL_ADVISOR_DEBUG=1 node .../system-spec-kit/dist/hooks/claude/user-prompt-submit.js | 0 | `Exit: 0`; stdout `{"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"Advisor: live; use sk-git 0.95/0.12 pass.\nDirectives:..."}}`; shim stderr bytes: 0; newest diag `{"timestamp":"2026-09-26T22:03:25.846Z","runtime":"claude","status":"ok","freshness":"live","durationMs":912,"cacheHit":false,"skillLabel":"sk-git","emittedBytes":259,"directivesSuppressed":false}`; grep -c prompt literal in DIAG = 0 | exit 0; valid JSON with hookSpecificOutput.additionalContext starting `Advisor:` + freshness (`live`); shim stderr 0 bytes; JSONL +1 line; newest record `runtime:"claude"` with `emittedBytes` and `directivesSuppressed`; prompt literal 0x | yes |
| 2c | (controlled rerun) BEFORE/BEFORE+run+AFTER in one shell | 0 | `diagnostic lines: 240 -> 241 (delta 1)`; shim stderr bytes: 0 | AFTER = BEFORE + 1 | yes |
| 3 | printf payload \| node .../system-skill-advisor/dist/hooks/claude/user-prompt-submit.js 2> inner-stderr | 0 | inner stderr 1 line: `{"timestamp":"2026-09-26T22:04:07.015Z","runtime":"claude","status":"ok","freshness":"live","durationMs":952,"cacheHit":true,"skillLabel":"sk-git","emittedBytes":259,"directivesSuppressed":false}`; grep -c prompt literal = 0 | inner hook stderr carries same record shape; prompt literal absent | yes |
| 4 | printf '{"prompt":"thanks",...}' \| node .../system-spec-kit/dist/hooks/claude/user-prompt-submit.js (extra, per task) | 0 | first line of additionalContext: `Advisor: prompt skipped.`; shim stderr bytes: 0 | `Advisor: prompt skipped.` | yes |

DEVIATIONS:
- Step 1 build: skipped: prebuilt by orchestrator (per task instruction).
- Step 2 `mkdir -p /tmp/skill-advisor-playbook` + its file paths: changed to a `mktemp -d /tmp/cl001.XXXXXX` dir, per hard rule "Temporary files go in a mktemp -d directory under /tmp that you delete at the end"; dir deleted after the run. Payload, env and hook targets unchanged.
- Step 2 first pass split the command block across separate shell calls (BEFORE in one, hook run in the next) and showed `237 -> 239`; rerun step 2 atomically in one shell as specified → `240 -> 241 (delta 1)`. The judged signal is the atomic run.
- Step 4 (casual-prompt run) is an addition requested by the dispatch, not in the scenario file.

NOTES: The diagnostics JSONL is shared and concurrently appended to by other live runtimes in this environment — a `runtime:"pi"` record (`skillLabel:"cli-external-orchestration"`, 22:00:06.454Z) landed between my split BEFORE/hook calls and caused the first-pass `+2` count. It is external interference, not a hook behavior; the atomic rerun produced exactly `+1` with the newest record from `runtime:"claude"`. If a future run repeats this in one block and still sees `+2`, look for a concurrent writer before blaming the hook. Nothing written in the repository; `git status` dirty state pre-existed this run and is untouched.
