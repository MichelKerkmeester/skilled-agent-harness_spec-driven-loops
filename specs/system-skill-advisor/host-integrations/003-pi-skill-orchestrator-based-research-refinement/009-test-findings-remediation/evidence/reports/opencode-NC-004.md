<!-- dispatch: opencode NC-004; ledger: 2026-09-26T22:30:07Z 2026-09-26T22:33:11Z 0 184 -->

RESULT: PASS | scenario=NC-004 | runtime=opencode
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---|---|---|---|
| 1 | cd .skilled/skills/system-skill-advisor/runtime && npm exec -- vitest run tests/handlers/advisor-recommend.vitest.ts tests/legacy/advisor-renderer.vitest.ts --reporter=default | 0 | `✓ tests/handlers/advisor-recommend.vitest.ts (22 tests)`, `✓ tests/legacy/advisor-renderer.vitest.ts (13 tests)`, `Test Files 2 passed (2)`, `Tests 35 passed (35)` | Tests pass | yes |
| 2 | node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "review opencode docs and improve the prompt package" --options '{"topK":2,"includeAttribution":true}' --format json | 0 | `status: "ok"`; rec[0] sk-code score 0.872164 conf 0.95; rec[1] sk-prompt score 0.800392 conf 0.95; `ambiguous: true`; `freshness: "live"`; trustState live | Envelope status ok; top recommendations plausible; close top-two set `ambiguous: true`; lane attribution prompt-safe | yes |
| 3 | inspect `data.ambiguous` | n/a | `data.ambiguous: true`; confidence gap 0.0 (≤0.05), score gap 0.071772 | `ambiguous: true` when second passing candidate within 0.05 on score or confidence axis; only outside both margins leaves it false | yes |

Additional expected signals: rendered brief does not overstate certainty — the Advisor line marks `ambiguous:` and names both routes with scores/confidence, no single-route certainty claim. Lane breakdown prompt-safe — `laneBreakdown`/`why_recommended` lane fields contain only lane ids, numeric scores/weights and generic evidence types (`token_match`, `category_hint`, `scorer_signal`, `derived_skill_signal`, `workflow_signal`); no prompt literal appears in any lane field.

DEVIATIONS: none
NOTES: The legacy row's recorded Evidence column captured a past run with `advisor_unavailable` fail-open output; this run had a live advisor (freshness live, generation 498), which is the condition the Expected Signals describe. Test counts (22/13/35) match the recorded evidence; vitest is v4.1.11 here vs v4.1.6 in the recorded evidence and duration differs (811ms vs 444ms) — neither affects the expected signals.
