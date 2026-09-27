<!-- dispatch: codex CL-005; ledger: 2026-09-27T14:14:48Z 2026-09-27T14:16:25Z 0 97 -->

RESULT: PASS | scenario=CL-005 | runtime=Codex
NATIVE: Advisor: live; ambiguous: sk-code 0.95/0.16 vs sk-doc 0.95/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---:|---|---|---|
| 1a | `npm ... install` | Skipped | Prebuilt by orchestrator | Build/install steps skipped per instruction | Yes |
| 1b | `npm ... run build` | Skipped | Prebuilt by orchestrator | Build/install steps skipped per instruction | Yes |
| 2 | Advisor CLI recommendation | 0 | `status: "ok"`; thresholds 0.8/0.35, `confidenceOnly: false`; freshness `live` | JSON success or prompt-safe fail-open; expected thresholds | Yes |
| 3 | Plugin Vitest suite | 0 | `Test Files 1 passed (1)`; `Tests 66 passed (66)` | Whole plugin suite green | Yes |
| 4 | OpenCode live loader check and greps | 0 | `opencode exit=0`; failed-plugin grep printed no match; tool-name grep matched `spec_kit_skill_advisor_status` | Exit 0; no plugin load failure; status tool listed | Yes |

DEVIATIONS: Step 1 install and build skipped: prebuilt by orchestrator.
NOTES: The OpenCode session ran once. Its temporary output files were removed. `spec_kit_skill_advisor_status` was not called because this session was running in Codex, not OpenCode.
