<!-- dispatch: codex CL-001; ledger: 2026-09-26T22:11:40Z 2026-09-26T22:12:34Z 0 54 -->

RESULT: PASS | scenario=CL-001 | runtime=Claude Code
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---:|---|---|---|
| 1 | `npm --prefix .skilled/skills/system-spec-kit/runtime run build` | — | Skipped | Build step skipped per orchestrator instruction | Yes |
| 2 | Prompt through system-spec-kit Claude hook shim with `SKILL_ADVISOR_DEBUG=1` | 0 | Valid JSON; `additionalContext` starts `Advisor: live`; diagnostics 254 → 255, latest record has `runtime: "claude"`, `emittedBytes`, `directivesSuppressed`; shim stderr 0 bytes; prompt matches 0 | Exit 0, Advisor context, one diagnostic record with expected fields, empty shim stderr, prompt absent | Yes |
| 3 | Same prompt through system-skill-advisor inner hook | 0 | Stderr record has expected fields; prompt matches 0 | Inner stderr record with expected fields; prompt absent | Yes |
| 4 | Casual `thanks` prompt through the same compiled shim | 0 | First `additionalContext` line: `Advisor: prompt skipped.` | `Advisor: prompt skipped.` | Yes |
DEVIATIONS: Build skipped: prebuilt by orchestrator. Used a temporary directory under `/tmp` for scenario output files and removed it after the run.
NOTES: `grep -c` returned 0 matches (grep exit 1), as expected. Hook scripts existed and `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` was unset.
