<!-- dispatch: opencode CL-005; ledger: 2026-09-26T21:44:22Z 2026-09-26T22:03:14Z 0 1132 -->

Step 2 matches (exit 0, `status: "ok"`, 014 threshold pair). Running step 3 — plugin test suite.
Step 3 matches (exit 0, all tests passed — 65/65 vs historical 40). Verifying plugin-source signals and plugin locations before step 4.
Checking the plugin's dist-path references (private-handler question) and SYSTEM_ vs SPECKIT_ flag names before step 4.
Source checks match the scenario contract (CLI spawn at `skill-advisor.cjs:131`/`:987`; `renderAdvisorBrief` loaded from the compiled package per the feature catalog, not handler pinning). Running step 4 — the single allowed `opencode run` loader check.
Step 4 matches all three signals (exit 0, no load failure, tool listed). Inspecting the captured artifacts, then cleaning up.
All signals checked. Cleaning up the temporary output directory before reporting.
RESULT: PASS | scenario=CL-005 | runtime=opencode
NATIVE: Advisor: live; ambiguous: sk-code 0.95/0.16 vs sk-doc 0.95/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | npm --prefix .skilled/skills/system-skill-advisor/runtime install + run build | — | not run | install+build current before steps 2–4 | — (see DEVIATIONS) |
| 2 | node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "save this conversation context to memory" --options '{topK:3,…,confidenceThreshold:0.8,uncertaintyThreshold:0.35}' --format json | 0 | JSON `status:"ok"`; `effectiveThresholds:{confidenceThreshold:0.8, uncertaintyThreshold:0.35, confidenceOnly:false}`; 3 ranked recs (system-spec-kit 0.927 top); `freshness:"live"` | JSON `status:"ok"` or prompt-safe fail-open; effectiveThresholds = 014 pair (0.8 / 0.35 / confidenceOnly:false) | Yes |
| 3 | npm --prefix .skilled/skills/system-skill-advisor/runtime run test -- tests/system-skill-advisor-plugin.vitest.ts | 0 | Test Files 1 passed (1); Tests 65 passed (65), incl. the 3 opt-out tests (env / shared-hook / config) | plugin suite passes incl. brief-rendering, cache, timeout, fail-open, opt-out; opt-out paths assert no advisor spawn + `enabled=false` + matching `disabled_reason` | Yes |
| 4 | opencode run --print-logs --log-level INFO --dir $PWD -m opencode-go/deepseek-v4.1-flash "List every tool…advisor…" + 2 greps | opencode=0; grep1=1; grep2=0 | stdout line 1: `spec_kit_skill_advisor_status`; log contains 0 `failed to load plugin` lines (so grep1 prints nothing) | step 4 exits 0; first grep prints nothing; second grep prints a match (`spec_kit_skill_advisor_status`) | Yes |
DEVIATIONS:
- `npm --prefix .skilled/skills/system-skill-advisor/runtime install` — skipped: prebuilt by orchestrator
- `npm --prefix .skilled/skills/system-skill-advisor/runtime run build` — skipped: prebuilt by orchestrator
- Step 4: appended `echo "grepN exit=$?"` probes after the two greps to read their exit codes (dispatch requires exit codes); command behavior unchanged.
- Step 4: outputs written to the step's hardcoded `/tmp/skill-advisor-playbook` (not a mktemp dir, since the scenario hardcodes the path); directory deleted after the run per the temp-file rule.
NOTES:
- spec_kit_skill_advisor_status called once (OpenCode session): last_bridge_status=ok (last_runtime_status=ok, enabled=true, disabled_reason=none).
- The NATIVE excerpt (first Advisor line only) does not expose the `route` label; the daemon was live (status tool + step 2 `freshness:"live"`), so the contract's `route: "cli"` branch applies rather than `cli-local-scorer`. The label itself was not directly observed — not guessed.
- Disable-flag signal: the suite's opt-out tests exercise the legacy `SPECKIT_SKILL_ADVISOR_{HOOK,PLUGIN}_DISABLED` names plus config opt-out and all pass (no spawn, `enabled=false`, matching `disabled_reason`); the plugin checks `SYSTEM_SKILL_ADVISOR_*` first (`.skilled/plugins/system-skill-advisor.js:56-57`, `:251-261`), so both families are effective — SYSTEM_ names are source-confirmed, not directly exercised by the suite.
- Spawn-path signal confirmed in source: `ADVISOR_CLI_PATH = …/bin/skill-advisor.cjs` (`system-skill-advisor.js:131`), spawned at `:987`; the shared `renderAdvisorBrief` contract is dynamically loaded from the compiled package — the feature catalog's sanctioned render path, not private handler pinning (no import of `advisor-server` internals).
- Suite grew from the scenario evidence's 40 to 65 tests; all pass — no contradiction of any expected signal.
- Log WARN "duplicate skill name" for system-skill-advisor (`.claude/skills` vs `.opencode/skills`) — not a plugin load failure; outside the scenario's signals.
- Preconditions verified: `.skilled/plugins/system-skill-advisor.js` and `.skilled/bin/skill-advisor.cjs` present; no repository files written.
