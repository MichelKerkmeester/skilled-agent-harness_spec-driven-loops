<!-- dispatch: cursor CL-001; ledger: 2026-09-27T13:28:00Z 2026-09-27T13:30:21Z 0 141 -->

RESULT: PASS | scenario=CL-001 | runtime=cursor
NATIVE: none visible
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 2 | SKILL_ADVISOR_DEBUG=1 node spec-kit .../claude/user-prompt-submit.js (prompt: help me commit my changes) | 0 | stdout JSON hookSpecificOutput.additionalContext starts `Advisor: live; use sk-git 0.95/0.12 pass.`; shim stderr bytes 0; diagnostics 251 -> 252; last record runtime=claude, emittedBytes=259, directivesSuppressed=false; prompt literal grep count 0 | Exit 0; additionalContext starts `Advisor:` plus freshness `live` or `stale`; shim stderr 0 bytes; JSONL gains one line with runtime `claude`, emittedBytes, directivesSuppressed; prompt literal count 0 | yes |
| 3 | node advisor .../claude/user-prompt-submit.js (same payload, stderr captured) | 0 | stderr one JSON line runtime=claude, status=ok, freshness=live, emittedBytes=259, directivesSuppressed=false; prompt literal grep count 0 | Inner stderr carries the same record shape; prompt literal count 0 | yes |
| 4 | node spec-kit .../claude/user-prompt-submit.js (prompt: thanks) | 0 | first additionalContext line `Advisor: prompt skipped.` | `Advisor: prompt skipped.` | yes |
DEVIATIONS: skipped: prebuilt by orchestrator — `npm --prefix .skilled/skills/system-spec-kit/runtime run build`. Step 2 prompt grep was run as `grep -c ... \|\| true` so a zero-match exit would not abort the script; the printed count was 0. Step 4 is the extra casual-prompt run from the task, against the same spec-kit compiled hook as step 2. Temp files under /tmp/skill-advisor-playbook were removed after the output was read.
NOTES: Disable flag and Claude hook timeout were unset. Both compiled hook scripts were present. The diagnostics JSONL is outside the repo and was left at 252 lines after the step 2 append. The casual additionalContext continued with a Directives line after the required first line.
