<!-- dispatch: devin CL-005; ledger: 2026-09-26T19:32:19Z 2026-09-26T19:33:18Z 0 59 -->

STEP 0 — Advisor line captured from this prompt's context:

`Advisor: live; ambiguous: sk-code 0.95/0.16 vs sk-doc 0.95/0.16 pass.`

Now reading the scenario file.Scenario read. Now verifying contract preconditions (plugin file exists, spawns the CLI path, runtime dist present — without rebuilding) before running steps 2–3.RESULT: PASS | scenario=CL-005 | runtime=Devin CLI (SWE-2 High)
NATIVE: Advisor: live; ambiguous: sk-code 0.95/0.16 vs sk-doc 0.95/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | `npm --prefix …/runtime install` + `run build` | — | not run | build current | skipped (see DEVIATIONS) |
| 2 | `node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "save this conversation context to memory" --options '{…0.8,…0.35}' --format json` | 0 | `status:"ok"`, `freshness:"live"`, `trustState.state:"live"` (gen 482), `effectiveThresholds:{confidenceThreshold:0.8, uncertaintyThreshold:0.35, confidenceOnly:false}`, 3 ranked recommendations (system-spec-kit 0.927 top) | JSON `status:"ok"` or prompt-safe fail-open; 014 threshold pair `0.8/0.35/confidenceOnly:false`; ranked recs | yes |
| 3 | `npm --prefix …/runtime run test -- tests/system-skill-advisor-plugin.vitest.ts` | 0 | `Test Files 1 passed (1)`, `Tests 65 passed (65)`, Duration 1.54s | plugin test suite passes; covers brief-render, cache, timeout, fail-open, opt-out paths | yes |
| 4 | contract check: `ls` + grep on `.skilled/plugins/system-skill-advisor.js` | 0 | plugin exists (61,565 B); `ADVISOR_CLI_PATH = …new URL('../bin/skill-advisor.cjs', import.meta.url)` (line 219); `spawn` from `node:child_process` (line 15, used ~line 1075); no imports of handler internals — dist paths at lines 227/239 referenced for preflight existence checks only | plugin host file exists; plugin spawns `.skilled/bin/skill-advisor.cjs`, never private handler paths | yes |
DEVIATIONS: step 1 (runtime `npm install` and `npm run build`) — skipped: prebuilt by orchestrator. All other steps run verbatim from the repository root.
NOTES: The plugin test suite now contains 65 tests (all passed); the playbook's §6 evidence recorded 40 at v0.8.0.17 — the suite grew, the pass signal still matches. The full-suite pass subsumes the opt-out disable tests, so no separate `-t opt-out` run was needed. The opt-out env-var signal (`SYSTEM_SKILL_ADVISOR_HOOK_DISABLED=1` / `SYSTEM_SKILL_ADVISOR_PLUGIN_DISABLED=1` → disabled brief, no spawn) is covered by those passing tests. Not running inside OpenCode, so the conditional `spec_kit_skill_advisor_status` / `lastBridgeStatus` call does not apply (no such tool exists in this runtime). The `Advisor:` brief recorded in NATIVE came from this runtime's own advisor injection, confirming native brief rendering; the CLI payload observed directly confirms `route` viability end-to-end. Trust state was `live` (not `stale`), which is the non-degraded case.
