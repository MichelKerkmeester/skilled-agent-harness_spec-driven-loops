<!-- Reconstructed excerpt. The 22:46Z run's report file was overwritten by the next rerun before it was copied. The orchestrator recorded these lines from the report when it read it. -->

RESULT: FAIL | scenario=CL-005 | runtime=Codex
NATIVE: Advisor: live; ambiguous: sk-code 0.95/0.16 vs sk-doc 0.95/0.16 pass.
| 3 | Plugin test suite; `-t opt-out` selection | 0 / 0 | 65 passed; opt-out selection 3 passed, 62 skipped | Whole suite green; opt-out selection still reports 3 passed | Yes |
| 4 | `opencode run ...` live loader check | 0 | No plugin load error; output lists `spec_kit_skill_advisor_status`. The captured native Advisor line has no `route: "cli"` field. Plugin source resolves and spawns `.skilled/bin/skill-advisor.cjs`. | Live load exits 0, status tool appears, and native success brief carries the CLI route (or local-scorer route) | No |
DEVIATIONS: Step 1 skipped: prebuilt by orchestrator. Ran the scenario's opt-out test selection as an additional check. Step 4 used a Python tempfile harness with the same OpenCode arguments and a 240-second timeout; temporary output was stored in a `mktemp` directory and removed afterward.
NOTES: The native Advisor line reports `live` and `ambiguous`, but does not include the expected route field; this is the mismatch driving FAIL.
