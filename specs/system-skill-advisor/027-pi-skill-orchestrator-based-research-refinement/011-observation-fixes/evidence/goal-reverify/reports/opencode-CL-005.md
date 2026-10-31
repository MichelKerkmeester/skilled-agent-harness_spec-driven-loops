<!-- dispatch: opencode CL-005; ledger: 2026-09-27T13:05:01Z 2026-09-27T13:12:11Z 0 430 -->

Scenario CL-005 read. Now running test execution steps. Step 1 (build) is skipped per orchestrator. Running step 2 (advisor CLI call path):
Step 2 passed (exit 0, status ok, 014 threshold pair). Now the plugin status tool and step 3 tests:
Status tool recorded (`last_bridge_status=ok`). Step 3 green (66/66). Running the `-t opt-out` selection required by the expected signals:
Opt-out selection green (3 passed). Plugin spawns the CLI path (line 670/976). Quick check of the dist-path references, then step 4:
Dist paths are cache-signature/shadow-renderer inputs; the advisor call path spawns the CLI (line 976). Now step 4 — live OpenCode load (timeout 300s):
All step 4 signals match. Capturing key output for the evidence record:
All step 4 signals match. Verifying the legacy `SPECKIT_` disable-name signal coverage before the verdict:
REPORT
RESULT: PASS | scenario=CL-005 | runtime=opencode
NATIVE: Advisor: live; ambiguous: sk-code 0.95/0.16 vs sk-doc 0.95/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---|---|---|---|
| 0 | (runtime context) | — | First `Advisor:` line: `Advisor: live; ambiguous: sk-code 0.95/0.16 vs sk-doc 0.95/0.16 pass.` | Native brief starts with `Advisor: live;` on live graph | Yes |
| 1 | npm install + npm run build (runtime) | — | not run | build current | skipped: prebuilt by orchestrator |
| 2 | printf …json… \| node .skilled/bin/skill-advisor.cjs advisor_recommend --json - --format json | 0 | `status:"ok"`, `freshness:"live"`, trustState live gen 528, 3 recs (system-spec-kit conf 0.9268), `effectiveThresholds:{confidenceThreshold:0.8, uncertaintyThreshold:0.35, confidenceOnly:false}` | JSON `status:"ok"` or prompt-safe fail-open; 014 threshold pair `0.8/0.35/confidenceOnly:false` | Yes |
| 3 | npm … run test -- tests/system-skill-advisor-plugin.vitest.ts | 0 | `Test Files  1 passed (1)` / `Tests  66 passed (66)` | whole suite green: `1 passed (1)`, every test passed, none failed (count growth allowed) | Yes |
| 3b | same test file `-t opt-out` | 0 | `Tests  3 passed \| 63 skipped (66)` | opt-out selection reports 3 passed (skipped count not a criterion) | Yes |
| 3c | plugin source inspect (read-only) | 0 | spawn path `[ADVISOR_CLI_PATH, 'advisor_recommend', '--json', '-', '--format', 'json']` (lines 134/670/976); dist refs only cache-signature + shadow renderer | plugin spawns `.skilled/bin/skill-advisor.cjs`, never private handler paths | Yes |
| 4 | opencode run --print-logs --log-level INFO -m opencode-go/deepseek-v4.1-flash "List every tool…advisor…" | 0 | `opencode exit=0`; grep1 (`failed to load plugin` + `system-skill-advisor.js`) printed nothing (exit 1); grep2 printed `1:spec_kit_skill_advisor_status` (exit 0) | step 4 exits 0; first grep prints nothing; second grep prints a match | Yes |
DEVIATIONS: Step 1 skipped: prebuilt by orchestrator (both `npm --prefix .skilled/skills/system-skill-advisor/runtime install` and `run build`). Step 3b (`-t opt-out`) run in addition to the literal step 3 command because the Expected Signals make "3 passed" in that selection a pass criterion. `spec_kit_skill_advisor_status` tool called once per task instruction (running inside OpenCode). Step 4 wrote to the scenario-mandated `/tmp/skill-advisor-playbook/` (its grep commands pin those filenames) instead of a `mktemp -d` dir; directory left in place as the scenario's named evidence output, nothing written inside the repository. A stray `opencode_goal_status` call was issued in error before the required tool; it is not the advisor status tool and had no side effects.
NOTES: `spec_kit_skill_advisor_status` last_bridge_status=ok (also last_runtime_status=ok, enabled=true, disabled_reason=none). Step 2 returned `freshness:"live"` this run vs `stale` in the scenario's recorded evidence — both permitted (`stale` is the documented degraded answer; the native brief's `Advisor: live;` prefix matches a live graph). The three opt-out tests exercise the legacy `SPECKIT_`-prefixed names; the plugin's env gate (lines 254-264) treats `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED`/`_PLUGIN_DISABLED` and the legacy names identically. Test count 66 vs recorded 65 is growth, explicitly not a mismatch. Log carries one unrelated WARN (`duplicate skill name` system-skill-advisor, `.claude/skills` vs `.opencode/skills`); no plugin load failure. Verdict rests on steps 2-4 all matching; nothing operator-only remains to verify.
