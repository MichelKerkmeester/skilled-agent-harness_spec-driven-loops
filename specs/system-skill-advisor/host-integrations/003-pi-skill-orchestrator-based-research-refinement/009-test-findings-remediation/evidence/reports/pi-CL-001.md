<!-- dispatch: pi CL-001; ledger: 2026-09-26T22:03:14Z 2026-09-26T22:16:00Z 0 766 -->

RESULT: PASS | scenario=CL-001 | runtime=pi
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---|---|---|---|
| 0 | `npm --prefix .skilled/skills/system-spec-kit/runtime run build` | n/a | not run | Build advisor runtime | skipped (see DEVIATIONS) |
| 1 | precondition check: hook scripts exist, `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` | 0 | shim exists, inner exists, flag unset | Scenario contract: flag unset, hook script exists | ✅ |
| 2 | resolve `DIAG` via `advisorHookDiagnosticsPath(process.cwd())` | 0 | `/var/folders/.../speckit-skill-advisor-metrics/a9f078f65abeed95-diagnostics.jsonl` | DIAG resolves from repo root | ✅ |
| 3 | pipe `{"prompt":"help me commit my changes",...}` into spec-kit shim with `SKILL_ADVISOR_DEBUG=1` | 0 | `Exit: 0`; stdout JSON `hookSpecificOutput.additionalContext` starts `Advisor: live; use sk-git 0.95/0.12 pass.` | Exit 0; valid JSON with `additionalContext`; matching prompt starts `Advisor:` + freshness word (`live`) | ✅ |
| 3a | `wc -c` shim stderr | 0 | `shim stderr bytes: 0` | Shim stderr empty | ✅ |
| 3b | diagnostics count before→after | 0 | `diagnostic lines: 243 -> 244` (no 300-line trim triggered) | JSONL gains one line (AFTER = BEFORE + 1) | ✅ |
| 3c | `tail -n 1 "$DIAG"` | 0 | `{"timestamp":"2026-09-26T22:06:39.376Z","runtime":"claude","status":"ok","freshness":"live","durationMs":802,"cacheHit":true,"skillLabel":"sk-git","emittedBytes":259,"directivesSuppressed":false}` | Newest record has `runtime:"claude"` plus `emittedBytes` and `directivesSuppressed` | ✅ |
| 3d | `grep -c 'help me commit my changes' "$DIAG"` | 1 (no matches) | `0` | Prompt literal found 0 times in JSONL (privacy) | ✅ |
| 4 | pipe same payload into inner hook `.skilled/skills/system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js`, capture stderr | 0 | `{"timestamp":"2026-09-26T22:06:54.863Z","runtime":"claude","status":"ok","freshness":"live","durationMs":840,"cacheHit":true,"skillLabel":"sk-git","emittedBytes":259,"directivesSuppressed":false}` | Inner hook stderr carries same record shape | ✅ |
| 4a | `grep -c 'help me commit my changes' inner-stderr.jsonl` | 1 (no matches) | `0` | Prompt literal 0 times in inner hook stderr | ✅ |
| 5 (extra per task) | pipe `{"prompt":"thanks",...}` into same compiled (shim) hook | 0 | first line of `additionalContext` = `Advisor: prompt skipped.`; shim stderr 0 bytes | `Advisor: prompt skipped.` | ✅ |
DEVIATIONS: Step 1 `npm --prefix .skilled/skills/system-spec-kit/runtime run build` — skipped: prebuilt by orchestrator. Absorbed Legacy row's identical build command — skipped: prebuilt by orchestrator. Scenario's `mkdir -p /tmp/skill-advisor-playbook` and its fixed output paths were replaced with a `mktemp -d` directory (`/tmp/skill-advisor-playbook.KPj7sA`), per dispatch hard rule that temp files live in a mktemp dir; all output filenames preserved. That temp dir was deleted after the run.
NOTES: The diagnostics JSONL was at 243 lines before the run (below the 300-line trim threshold), so the BEFORE+1 count rule applied and held. Grep exit code 1 in rows 3d/4a is `grep -c` reporting zero matches, which is the expected privacy signal. The extra casual-prompt run used the spec-kit shim (the "same compiled hook" as the main scenario run); its full stdout was valid JSON `hookSpecificOutput` and carried the expected `Advisor: prompt skipped.` status line. Live daemon and skill-advisor database untouched.
