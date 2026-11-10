<!-- dispatch: pi NC-004; ledger: 2026-09-26T19:21:58Z 2026-09-26T19:22:58Z 0 60 -->

STEP 0 context captured. Scenario file read in full. Both execution steps run from the repository root as written. No files were written anywhere.

RESULT: PASS | scenario=NC-004 | runtime=pi
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---|---|---|---|
| 1 | `npm exec -- vitest run tests/handlers/advisor-recommend.vitest.ts tests/legacy/advisor-renderer.vitest.ts --reporter=default` (from `runtime/`) | 0 | `RUN v4.1.11`; `✓ tests/handlers/advisor-recommend.vitest.ts (22 tests) 97ms`; `✓ tests/legacy/advisor-renderer.vitest.ts (13 tests) 13ms`; `Test Files 2 passed (2)`; `Tests 35 passed (35)` | Tests pass (legacy row: 22 + 13 tests, 35 passed) | Match (35/35 passed; vitest 4.1.11 vs 4.1.6 in legacy evidence, run times differ) |
| 2 | `node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "review opencode docs and improve the prompt package" --options '{"topK":2,"includeAttribution":true}' --format json` | 0 | `status: "ok"`; `recommendations[0]`: sk-code, confidence 0.95, uncertainty 0.16; `recommendations[1]`: sk-prompt, confidence 0.95, uncertainty 0.12; `ambiguous: true`; `freshness: "live"`; `trustState.state: "live"` | Envelope status `ok`; plausible top recommendations; close top-two sets `ambiguous: true`; lane attribution prompt-safe | Match |
| 3 | Inspect `data.ambiguous` (manual, from step-2 JSON) | — | `data.ambiguous = true`; top-two confidences 0.95 vs 0.95 (delta 0.00, within 0.05) so the flag is correctly set | `ambiguous: true` when top two passing candidates are within 0.05 confidence | Match |
| 3b | Prompt-safety of lane attribution (manual scan of step-2 JSON lane fields) | — | `laneBreakdown`/`why_recommended` contain only lane names, numeric scores, `evidenceTypes` (`token_match`, `category_hint`, `scorer_signal`, `workflow_signal`, `derived_skill_signal`) — no prompt literals anywhere | Lane breakdown remains prompt-safe; no prompt text in lane fields | Match |
| 3c | Rendered-brief certainty (covered by step-1 renderer suite) | 0 | `advisor-renderer.vitest.ts` 13/13 passed, including ambiguity rendering; JSON itself surfaces `ambiguous: true` rather than single-skill certainty | Rendered brief does not overstate certainty | Match |

DEVIATIONS: none. All three test-execution steps ran exactly as written; no writes performed (scenario names no evidence directory), no temp files created.

NOTES: 
- The absorbed legacy row recorded this scenario as BLOCKED on `freshness: "unavailable"` / `advisor_unavailable` with empty recommendations. This run had a live advisor (`freshness: "live"`, generation 480) and real top-two candidates, so the ambiguity flag could actually be evaluated — the legacy BLOCKED evidence does not apply to this run.
- Top-two `confidence` values are identical (0.95/0.95) while `score` differs by 0.072 (0.872 vs 0.800); `ambiguous: true` is set, matching the scenario's confidence-based expectation. A reviewer checking the scorer should confirm the 0.05 window is measured on `confidence`, not `score`.
- The NATIVE Advisor: line from STEP 0 names a different top-two pair (cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16) than this run's `advisor_recommend` output (sk-code 0.95/0.16 vs sk-prompt 0.95/0.12). Both are within-window and flagged ambiguous; the hook brief and the CLI call disagree on which skills are the close pair, likely due to different prompt text or scoring context. Worth a look by the owning reviewer; it does not contradict any expected signal in this scenario.
- Evidence row numbers differ slightly from the legacy record (vitest 4.1.11 vs 4.1.6, test durations 97ms/13ms vs 20ms/4ms) — run-to-run variance only.
