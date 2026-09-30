<!-- dispatch: codex CL-001; ledger: 2026-09-28T13:03:32Z 2026-09-28T13:05:08Z 0 96 -->

RESULT: PASS | scenario=CL-001 | runtime=Codex CLI
NATIVE: Advisor: outage (fail_open); route by hand: node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<request>"}' --format json
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---:|---|---|---|
| 1 | `npm --prefix .skilled/skills/system-spec-kit/runtime run build` | SKIP | Build not run | Build is current | N/A |
| 2 | Piped prompt into spec-kit shim with `SKILL_ADVISOR_DEBUG=1`; checked diagnostics | 0 | `Advisor: outage (fail_open)`; diagnostics `0 -> 1`, runtime `claude`, `emittedBytes:361`, `directivesSuppressed:false`; shim stderr 0 bytes; prompt matches 0 | Exit 0; valid additional context with an accepted status line; one diagnostic record; empty shim stderr; prompt absent | PASS |
| 3 | Piped same prompt into advisor hook; captured stderr | 0 | Diagnostic runtime `claude`, status `ok`, freshness `live`, with `emittedBytes` and `directivesSuppressed`; prompt matches 0 | Inner stderr has the diagnostic shape; prompt absent | PASS |
| 4 | Piped `thanks` into the shim; read first `additionalContext` line | 0 | `Advisor: prompt skipped.` | `Advisor: prompt skipped.` | PASS |
DEVIATIONS: Step 1 skipped: prebuilt by orchestrator. Used a fresh `/tmp` sandbox for `TMPDIR`, IPC, database, and captured files instead of the playbook’s fixed `/tmp/skill-advisor-playbook` paths; sandbox cleanup exited 0.
NOTES: Scenario preconditions passed: both compiled hooks exist and `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` is unset.
