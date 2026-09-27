<!-- dispatch: pi CL-001; ledger: 2026-09-27T13:21:45Z 2026-09-27T13:24:40Z 0 175 -->

RESULT: PASS | scenario=CL-001 | runtime=pi
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.18 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---|---|---|---|
| 1 | `npm --prefix .skilled/skills/system-spec-kit/runtime run build` | — | not run | build current (orchestrator confirmed) | SKIP (deviation) |
| 2a | `node -e "import metrics.js; advisorHookDiagnosticsPath(cwd)"` | 0 | DIAG=/var/folders/.../speckit-skill-advisor-metrics/a9f078f65abeed95-diagnostics.jsonl | DIAG resolves from repo root | yes |
| 2b | `printf '{"prompt":"help me commit my changes",...}' \| SKILL_ADVISOR_DEBUG=1 node spec-kit .../dist/hooks/claude/user-prompt-submit.js` + `echo "Exit: $?"` | 0 | `Exit: 0` | Exit code 0 | yes |
| 2c | stdout inspect | 0 | `{"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"Advisor: live; use sk-git 0.95/0.12 pass.\nDirectives:\n- Comment hygiene [HARD BLOCK]: ..."}}` | Valid JSON with `hookSpecificOutput.additionalContext` starting `Advisor: <live\|stale>`; not `{}` | yes |
| 2d | `wc -c` on shim stderr | 0 | `shim stderr bytes: 0` | Shim stderr empty (`shim stderr bytes: 0`) | yes |
| 2e | diagnostics before/after counts | 0 | `diagnostic lines: 243 -> 244` | `AFTER` is `BEFORE + 1` | yes |
| 2f | `tail -n 1 "$DIAG"` | 0 | `{"timestamp":"2026-09-27T13:23:25.356Z","runtime":"claude","status":"ok","freshness":"live","durationMs":1034,"cacheHit":false,"skillLabel":"sk-git","emittedBytes":259,"directivesSuppressed":false}` | Newest record has `runtime: "claude"`, `emittedBytes`, `directivesSuppressed` | yes |
| 2g | `grep -c 'help me commit my changes' "$DIAG"` | 1 (no matches) | `0` | Prompt literal 0 times in JSONL | yes |
| 3a | `printf <same payload> \| node skill-advisor .../dist/hooks/claude/user-prompt-submit.js 2> inner-stderr.jsonl` | 0 | `Exit: 0` | Exit code 0 | yes |
| 3b | `cat cl-001.inner-stderr.jsonl` | 0 | `{"timestamp":"2026-09-27T13:23:33.644Z","runtime":"claude","status":"ok","freshness":"live","durationMs":732,"cacheHit":true,"skillLabel":"sk-git","emittedBytes":259,"directivesSuppressed":false}` | Inner hook stderr carries the same record shape | yes |
| 3c | `grep -c 'help me commit my changes' inner-stderr.jsonl` | 1 (no matches) | `0` | Prompt literal 0 times in inner stderr | yes |
| 4a | `printf '{"prompt":"thanks",...}' \| node spec-kit shim` (extra task step) | 0 | additionalContext first line: `Advisor: prompt skipped.` (shim stderr 0 bytes) | `Advisor: prompt skipped.` | yes |
| 4b | `printf '{"prompt":"thanks",...}' \| node skill-advisor inner hook` (extra task step) | 0 | additionalContext first line: `Advisor: prompt skipped.` | `Advisor: prompt skipped.` | yes |
DEVIATIONS: Step 1 skipped: prebuilt by orchestrator. Step 4 (casual prompt) run through BOTH compiled hooks (spec-kit shim and inner advisor hook) because "the same compiled hook" was ambiguous — scenario step 2's compiled hook is the shim, step 3's is the inner hook; both returned the identical expected line, so the verdict is unaffected. All scenario command output paths kept exactly as the file specifies (`/tmp/skill-advisor-playbook/...`); that directory was deleted at the end of the run per the temp-file rule.
NOTES: The diagnostics JSONL resolved to an OS temp path (`/var/folders/.../speckit-skill-advisor-metrics/…-diagnostics.jsonl`), not inside the repository; the two mandated debug appends are its intended behavior under `SKILL_ADVISOR_DEBUG=1` and the file (a live advisor artifact) was left in place, untouched otherwise. The worktree shows pre-existing modified/untracked files (`write-containment.ts`, `specs/agents/…`, `specs/sk-doc/059-…`, `specs/…/011-observation-fixes/evidence/goal-reverify/`) that predate this run; this test wrote nothing inside the repository. `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` confirmed unset and `SPECKIT_CLAUDE_HOOK_TIMEOUT_MS` unset before the run. Grep exits of 1 are the expected "no match" exits for the privacy checks.
