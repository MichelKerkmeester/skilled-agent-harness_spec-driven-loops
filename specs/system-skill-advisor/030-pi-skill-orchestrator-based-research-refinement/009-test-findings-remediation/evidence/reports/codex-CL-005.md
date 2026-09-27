<!-- dispatch: codex CL-005; ledger: 2026-09-26T22:52:16Z 2026-09-26T22:53:51Z 0 95 -->

RESULT: PASS | scenario=CL-005 | runtime=Codex
NATIVE: Advisor: live; ambiguous: sk-code 0.95/0.16 vs sk-doc 0.95/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---:|---|---|---|
| 1 | Advisor runtime install/build | skipped | Prebuilt by orchestrator | Build step skipped as directed | Yes |
| 2 | `skill-advisor.cjs advisor_recommend ... --format json` | 0 | `status: ok`; live freshness; thresholds `0.8`, `0.35`, `confidenceOnly: false` | JSON success or prompt-safe fail-open; required threshold pair | Yes |
| 3 | Runtime Vitest plugin test | 0 | `Test Files 1 passed (1)`; `Tests 65 passed (65)` | Entire plugin suite green | Yes |
| 4 | Single `opencode run ...` with 180s timeout | 0 | Output listed `spec_kit_skill_advisor_status`; plugin-load failure grep found no match | Exit 0; status tool listed; no plugin-load failure | Yes |
DEVIATIONS: Step 1 skipped: prebuilt by orchestrator. Step 4 logs used a `mktemp` directory under `/tmp`, with a 180-second subprocess timeout, then the temporary directory was removed.
NOTES: I was running in Codex, not OpenCode, so the conditional `spec_kit_skill_advisor_status` tool call did not apply. OpenCode logged unrelated snapshot symlink and duplicate-skill warnings; the requested plugin-load failure check found no match.
