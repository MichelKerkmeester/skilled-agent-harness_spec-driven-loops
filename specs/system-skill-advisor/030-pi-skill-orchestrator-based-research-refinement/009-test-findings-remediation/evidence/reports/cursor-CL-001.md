<!-- dispatch: cursor CL-001; ledger: 2026-09-26T22:09:08Z 2026-09-26T22:11:40Z 0 152 -->

RESULT: PASS | scenario=CL-001 | runtime=cursor
NATIVE: none visible
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | npm --prefix system-spec-kit/runtime run build | skipped | not run | build current before the hook run | skipped |
| 2 | SKILL_ADVISOR_DEBUG=1 node spec-kit .../user-prompt-submit.js (prompt: help me commit my changes) | 0 | stdout JSON additionalContext starts `Advisor: live; use sk-git 0.95/0.12 pass.`; diagnostics 249 -> 250; last record runtime=claude, emittedBytes=259, directivesSuppressed=false; shim stderr bytes 0; prompt literal count 0 | exit 0; additionalContext starts `Advisor:` plus live or stale; shim stderr 0; JSONL gains one line with runtime claude, emittedBytes, directivesSuppressed; prompt literal count 0 | yes |
| 3 | node skill-advisor .../user-prompt-submit.js, stderr captured | 0 | stderr record runtime=claude, freshness=live, emittedBytes=259, directivesSuppressed=false; prompt literal count 0 | same record shape on inner stderr; prompt literal count 0 | yes |
| 4 | same spec-kit hook, prompt thanks | 0 | first additionalContext line: `Advisor: prompt skipped.` | `Advisor: prompt skipped.` | yes |
DEVIATIONS: step 1 build skipped: prebuilt by orchestrator. Step 4 is the task-required casual prompt, not a numbered scenario step. Step 2 was prefixed with a disable-flag print and a hook-file listing; the scenario commands then ran as written. The JSONL grep was followed by `|| true` so a zero-match grep exit would not abort the script; the printed count was 0.
NOTES: SPECKIT_SKILL_ADVISOR_HOOK_DISABLED was unset and both compiled hooks were present. Diagnostics path was /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/speckit-skill-advisor-metrics/a9f078f65abeed95-diagnostics.jsonl. Inner grep -c exited 1 because the count was 0. The casual additionalContext continued with a Directives block after the matching first line. /tmp/skill-advisor-playbook was removed after the run.
