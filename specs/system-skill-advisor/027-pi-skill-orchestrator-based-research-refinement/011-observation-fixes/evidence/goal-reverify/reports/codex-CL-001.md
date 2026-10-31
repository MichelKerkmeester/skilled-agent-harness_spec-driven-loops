<!-- dispatch: codex CL-001; ledger: 2026-09-27T13:31:43Z 2026-09-27T13:32:46Z 0 63 -->

RESULT: PASS | scenario=CL-001 | runtime=Codex
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.18 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---:|---|---|---|
| 1 | `npm --prefix .skilled/skills/system-spec-kit/runtime run build` | skipped | Build reported current by orchestrator | Build is current | Yes; skipped as directed |
| 2 | Pipe matching prompt to shipped shim with `SKILL_ADVISOR_DEBUG=1` | 0 | `Advisor: live`; diagnostics 254 → 255; record has `runtime: "claude"`, `emittedBytes`, `directivesSuppressed`; shim stderr 0 bytes; prompt count 0 | Exit 0; valid context JSON; one diagnostic record with required fields; empty shim stderr; no prompt text in diagnostics | Yes |
| 3 | Pipe same prompt to compiled advisor hook; capture stderr | 0 | Stderr record has required fields; prompt count 0 | Inner stderr has the same record shape; no prompt text | Yes |
| 4 | Pipe `thanks` to the same compiled advisor hook | 0 | `additionalContext` first line: `Advisor: prompt skipped.` | First line is `Advisor: prompt skipped.` | Yes |

DEVIATIONS: Step 1 build skipped: prebuilt by orchestrator. No install steps were present. Temporary output paths were placed in a disposable `mktemp` directory under `/tmp`, then removed.
NOTES: `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` was unset. The zero-match `grep` commands returned 1 as expected; both reported a count of 0.
