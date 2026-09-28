<!-- dispatch: pi CL-001; ledger: 2026-09-28T12:52:39Z 2026-09-28T12:54:06Z 0 87 -->

RESULT: PASS | scenario=CL-001 | runtime=pi
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.18 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---|---|---|---|
| 1 | npm --prefix .skilled/skills/system-spec-kit/runtime run build | — | skipped (see DEVIATIONS) | build current | n/a (skipped) |
| 2a | resolve DIAG via advisorHookDiagnosticsPath(process.cwd()) | 0 | DIAG=/var/folders/.../speckit-skill-advisor-metrics/a9f078f65abeed95-diagnostics.jsonl | DIAG resolves from repo root | yes |
| 2b | printf payload \| SKILL_ADVISOR_DEBUG=1 node spec-kit/dist/hooks/claude/user-prompt-submit.js | 0 | `Exit: 0` | Exit code 0 | yes |
| 2c | diagnostics line count | — | `diagnostic lines: 282 -> 283` | AFTER = BEFORE + 1 | yes |
| 2d | cat cl-001.stdout.json | 0 | valid JSON: `hookSpecificOutput.additionalContext` starts `Advisor: live; use sk-git 0.95/0.12 pass.` + Directives block | valid JSON, additionalContext starts `Advisor:` + freshness word (`live`/`stale`); not `{}` | yes |
| 2e | shim stderr byte count | 0 | `shim stderr bytes: 0` | shim stderr empty | yes |
| 2f | tail -n 1 "$DIAG" | 0 | `{"timestamp":"2026-09-28T12:53:19.721Z","runtime":"claude","status":"ok","freshness":"live","durationMs":1419,"cacheHit":false,"skillLabel":"sk-git","emittedBytes":259,"directivesSuppressed":false}` | newest record has `runtime: "claude"`, `emittedBytes`, `directivesSuppressed` | yes |
| 2g | grep -c 'help me commit my changes' "$DIAG" | 1 (no match) | `0` | 0 occurrences | yes |
| 3a | printf same payload \| node skill-advisor/dist/hooks/claude/user-prompt-submit.js 2> inner-stderr.jsonl | 0 | (stdout discarded as scripted) | runs cleanly | yes |
| 3b | cat cl-001.inner-stderr.jsonl | 0 | `{"timestamp":"2026-09-28T12:53:27.638Z","runtime":"claude","status":"ok","freshness":"live","durationMs":1487,"cacheHit":true,"skillLabel":"sk-git","emittedBytes":259,"directivesSuppressed":false}` | same record shape as diagnostics record | yes |
| 3c | grep -c 'help me commit my changes' inner-stderr.jsonl | 1 (no match) | `0` | 0 occurrences | yes |
| 4 | printf {"prompt":"thanks",...} \| node spec-kit/dist/hooks/claude/user-prompt-submit.js (task-added run) | 0 | first line of additionalContext: `Advisor: prompt skipped.`; shim stderr 0 bytes | `Advisor: prompt skipped.` | yes |
DEVIATIONS: Step 1 skipped: prebuilt by orchestrator. No other skipped or changed steps; steps 2–3 and the casual-prompt run were executed exactly as written (scenario writes its artifacts to /tmp/skill-advisor-playbook, which is outside the repo; removed it at end of run as teardown).
NOTES: DIAG resolved to the OS temp metrics dir under /var/folders/.../speckit-skill-advisor-metrics/, not inside the repo — consistent with `advisorHookDiagnosticsPath(process.cwd())`. Line-count check was unambiguous (282 -> 283, far below the 300-line trim threshold), so no last-line-only reading was needed. The casual-prompt run used the shipped spec-kit shim ("the same compiled hook" as the primary step-2 call); its stdout matches the expected skip status exactly. Live advisor daemon and database were untouched.
