<!-- dispatch: opencode CL-001; ledger: 2026-09-28T14:15:30Z 2026-09-28T14:20:52Z 0 321 -->

Scenario file read. Now checking preconditions and hook script presence.
Preconditions pass: hook scripts exist, `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` unset, `DIAG` resolves outside the repo. Running step 2 (shim run) as written.
Step 2 matches all expected signals. Running step 3 (inner hook stderr).
Step 3 matches. Now the casual-prompt run (task addition).
All scenario steps match. Cleaning up temp artifacts and confirming no repo writes.
RESULT: PASS | scenario=CL-001 | runtime=opencode
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.18 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---|---|---|---|
| 1 | npm --prefix .skilled/skills/system-spec-kit/runtime run build | n/a | not run | build advisor runtime | skipped: prebuilt by orchestrator |
| 2 | SKILL_ADVISOR_DEBUG=1 node .skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js < "help me commit my changes" payload | 0 | additionalContext begins `Advisor: live; use sk-git 0.95/0.12 pass.`; `diagnostic lines: 248 -> 249`; `shim stderr bytes: 0`; last JSONL record `{"runtime":"claude","status":"ok","freshness":"live","emittedBytes":259,"directivesSuppressed":false}`; `grep -c` prompt literal = 0 | Exit 0; stdout `hookSpecificOutput.additionalContext` starting `Advisor:` + freshness word; shim stderr empty (0 bytes); AFTER = BEFORE + 1; newest record `runtime:"claude"` with `emittedBytes` + `directivesSuppressed`; prompt literal 0 in JSONL | yes |
| 3 | node .skilled/skills/system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js < same payload (stderr capture) | 0 | stderr JSONL `{"timestamp":...,"runtime":"claude","status":"ok","freshness":"live","durationMs":1045,"cacheHit":true,"skillLabel":"sk-git","emittedBytes":259,"directivesSuppressed":false}` (same record shape as step 2); `grep -c` prompt literal = 0 | inner hook stderr carries the same record shape; prompt literal absent | yes |
| 4 | node .../user-prompt-submit.js < `{"prompt":"thanks","cwd":"<repo root>","hook_event_name":"UserPromptSubmit"}` | 0 | additionalContext first line: `Advisor: prompt skipped.` (identical from spec-kit shim and inner advisor hook) | `Advisor: prompt skipped.` | yes |
DEVIATIONS: step 1 build: skipped: prebuilt by orchestrator (same build also listed in the absorbed SAD-003 legacy row step 1: skipped: prebuilt by orchestrator)
NOTES: "the same compiled hook" was ambiguous, so the casual payload was run through both compiled hooks (step-2 shim and step-3 inner); both returned the expected first line. Diagnostics JSONL resolved outside the repo (`/var/folders/.../speckit-skill-advisor-metrics/...`), 248→249 (no trim). Scenario temp artifacts in `/tmp/skill-advisor-playbook` deleted after the run; the repository's 12 dirty git entries pre-existed this run and none were written by it.
