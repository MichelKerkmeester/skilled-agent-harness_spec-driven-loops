<!-- dispatch: devin NC-004; ledger: 2026-09-26T19:26:49Z 2026-09-26T19:27:32Z 0 43 -->

I'll start by reading the scenario file.Scenario NC-004 read. Now running step 1 — the vitest command as written.Tests pass (35/35, exit 0). Now step 2 — the advisor_recommend call from repo root.RESULT: PASS | scenario=NC-004 | runtime=Devin
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | `cd .skilled/skills/system-skill-advisor/runtime && npm exec -- vitest run tests/handlers/advisor-recommend.vitest.ts tests/legacy/advisor-renderer.vitest.ts --reporter=default` | 0 | `Test Files 2 passed (2)`; `Tests 35 passed (35)`; advisor-recommend 22 tests, advisor-renderer 13 tests; vitest v4.1.11 | Tests pass | yes |
| 2 | `node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "review opencode docs and improve the prompt package" --options '{"topK":2,"includeAttribution":true}' --format json` | 0 | `status: "ok"`, `freshness: "live"`, top two = sk-code (score 0.872235, confidence 0.95) and sk-prompt (score 0.800452, confidence 0.95) | Envelope `ok`; top recommendations plausible for the prompt | yes |
| 3 | Inspect `data.ambiguous` | n/a (same output) | `ambiguous: true`; top-two confidences 0.95 vs 0.95 (within 0.05); lane fields contain only lane names/scores/evidence types — no prompt literal | `ambiguous: true` when top two within 0.05 confidence; lane breakdown prompt-safe; brief does not overstate certainty | yes |
DEVIATIONS: none — both commands run exactly as written, from the paths the file specifies.
NOTES: The native hook brief on this dispatch prompt itself rendered `ambiguous:` with both top-two scores (cli-external-orchestration vs sk-code), corroborating that the renderer surfaces ambiguity rather than a single-certainty route. The absorbed legacy row's recorded evidence shows a fail-open `advisor_unavailable` output from 2026-07-03; the live daemon was available today, so current output is live with real recommendations — consistent with, and stronger than, the recorded baseline.
