<!-- dispatch: cursor CL-001; ledger: 2026-09-28T12:59:09Z 2026-09-28T13:01:56Z 0 167 -->

RESULT: PASS | scenario=CL-001 | runtime=cursor
NATIVE: none visible
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | npm --prefix .skilled/skills/system-spec-kit/runtime run build | n/a | skipped | Advisor runtime build is current | skipped |
| 2 | SKILL_ADVISOR_DEBUG=1 node spec-kit .../user-prompt-submit.js (prompt: help me commit my changes) | 0 | additionalContext starts `Advisor: live; use sk-git 0.95/0.12 pass.`; diagnostic lines 289 -> 290; last record `runtime:"claude"` `emittedBytes:259` `directivesSuppressed:false` `freshness:"live"`; shim stderr bytes 0; prompt literal count 0 | Exit 0; additionalContext starts `Advisor:` plus `live` or `stale`; shim stderr 0 bytes; JSONL gains one line with `runtime:"claude"`, `emittedBytes`, `directivesSuppressed`; prompt literal count 0 | yes |
| 3 | node advisor .../user-prompt-submit.js (same payload; stderr captured) | 0 | stderr record `runtime:"claude"` `status:"ok"` `freshness:"live"` `emittedBytes:259` `directivesSuppressed:false`; prompt literal count 0 | Same record shape on the inner hook stderr; prompt literal count 0 | yes |
| 4 | node spec-kit .../user-prompt-submit.js (prompt: thanks) | 0 | first additionalContext line `Advisor: prompt skipped.` | `Advisor: prompt skipped.` | yes |
DEVIATIONS: step 1 skipped: prebuilt by orchestrator. Step 4 added by dispatch (casual prompt), not in the scenario file. Both `grep -c` calls were followed by `|| true` so a zero-count exit would not replace the hook exit; printed counts were 0.
NOTES: Diagnostics path was `/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/speckit-skill-advisor-metrics/a9f078f65abeed95-diagnostics.jsonl` at 289 lines, so the 300-line trim did not apply. `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` was unset. Hook commands ran unsandboxed so they could reach the live advisor. Capture files under `/tmp/skill-advisor-playbook` were removed.
