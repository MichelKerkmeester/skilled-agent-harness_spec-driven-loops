<!-- dispatch: pi CL-005; ledger: 2026-09-26T19:30:07Z 2026-09-26T19:32:19Z 0 132 -->

All steps complete. Evidence record follows.

RESULT: PASS | scenario=CL-005 | runtime=pi
NATIVE: Advisor: live; ambiguous: sk-code 0.95/0.16 vs sk-doc 0.95/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | npm --prefix …/runtime install && run build | — | not run (see DEVIATIONS) | advisor runtime build current | MATCH (skipped: prebuilt by orchestrator) |
| 2 | node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "save this conversation context to memory" --options '{…0.8/0.35…}' --format json | 0 | `"status": "ok"`; `"effectiveThresholds": {"confidenceThreshold": 0.8, "uncertaintyThreshold": 0.35, "confidenceOnly": false}`; 3 ranked recs (system-spec-kit 0.927, memory:save, command-memory-save); `freshness: "live"`, trustState live gen 482 | JSON with `status: "ok"` or prompt-safe fail-open; effectiveThresholds = 0.8/0.35/confidenceOnly:false | MATCH |
| 3 | npm --prefix …/runtime run test -- tests/system-skill-advisor-plugin.vitest.ts | 0 | `Test Files 1 passed (1)`, `Tests 65 passed (65)`, Duration 1.44s | plugin test suite passes (brief rendering, cache, timeout, fail-open, opt-out); plugin spawns `.skilled/bin/skill-advisor.cjs`, never private handler paths | MATCH (all 65 pass; recorded evidence had 40 at authoring time — suite grew, see NOTES) |
| 3b | same test with `-t opt-out` | 0 | `Tests 3 passed \| 62 skipped (65)` | 3 opt-out paths pass: env opt-out, shared hook env opt-out, config opt-out — each spawns no advisor and reports `enabled=false` with matching `disabled_reason` | MATCH (exactly 3 selected, all pass) |
| 3c | source inspection of `.skilled/plugins/system-skill-advisor.js` (grep) | 0 | `ADVISOR_CLI_PATH = fileURLToPath(new URL('../bin/skill-advisor.cjs', …))`; advisor call at line 1075 does `options.spawnAdvisor(options.nodeBinary, advisorCliArgs(…))`; DISABLED_ENV=`SYSTEM_SKILL_ADVISOR_HOOK_DISABLED`, DISABLED_ENV_PLUGIN=`SYSTEM_SKILL_ADVISOR_PLUGIN_DISABLED`, legacy `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`/`SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED` all present | plugin spawns `skill-advisor.cjs` and never private handler paths; `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED=1` / `SYSTEM_SKILL_ADVISOR_PLUGIN_DISABLED=1` disable without spawning; legacy `SPECKIT_` names still work | MATCH |

DEVIATIONS:
- Step 1 (`npm --prefix .skilled/skills/system-skill-advisor/runtime install` + `run build`) — skipped: prebuilt by orchestrator.
- Step 3b (`-t opt-out`) is an addition beyond the three numbered steps, run to judge the disable-flag expected signal directly; it mirrors the scenario's own §6 evidence.

NOTES:
- Not running inside OpenCode (runtime is pi), so `spec_kit_skill_advisor_status` was not callable and no `lastBridgeStatus` exists to record. The plugin's status-tool behavior is covered by the passing vitest suite, which the scenario designed to run "without an interactive OpenCode session".
- Test count 65 vs the §6 recorded evidence of 40: the suite has grown since the playbook's evidence was captured. All tests pass and the opt-out selection is still exactly the three documented paths (3 passed | 62 skipped), so the expected signals themselves are unaffected — but a reviewer should know the evidence block's counts are stale.
- The plugin does `import()` of `dist/runtime/lib/render.js` (shadow renderer) and lists `dist/runtime/advisor-server.js` in cache-signature paths; neither is a handler import or an advisor entrypoint — the advisor call path spawns `skill-advisor.cjs` (line 1075), satisfying the "never private handler paths" signal as the scenario defines it.
- Step 2 returned `freshness: "live"` / trustState `live` (the scenario's recorded run showed `stale`); the file states either is an expected exit-0 outcome, so this is not a mismatch.
- No repository files were written; no temp files created; no daemon or database touched.
