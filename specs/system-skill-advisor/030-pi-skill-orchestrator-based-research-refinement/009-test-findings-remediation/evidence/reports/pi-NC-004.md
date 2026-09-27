<!-- dispatch: pi NC-004; ledger: 2026-09-26T22:30:40Z 2026-09-26T22:48:08Z 0 1048 -->

All steps complete. Judging against the scenario's expected signals:

- Tests pass: 35/35, exit 0 ✓
- `data.ambiguous` inspection: top two are `sk-code` (score 0.872159, confidence 0.95) and `sk-prompt` (score 0.800387, confidence 0.95) — confidence gap 0.00 ≤ 0.05 (score gap 0.0718), so the either-axis rule requires `ambiguous: true`; observed `ambiguous: true` ✓
- Lane breakdown fields contain only lanes/scores/evidence-type tokens — no prompt literal ✓

RESULT: PASS | scenario=NC-004 | runtime=pi
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---|---|---|---|
| 1 | `cd .skilled/skills/system-skill-advisor/runtime && npm exec -- vitest run tests/handlers/advisor-recommend.vitest.ts tests/legacy/advisor-renderer.vitest.ts --reporter=default` | 0 | `Test Files 2 passed (2)`, `Tests 35 passed (35)` (22 advisor-recommend + 13 advisor-renderer) | Tests pass (legacy row: 22 + 13 = 35 tests) | yes |
| 2 | `node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "review opencode docs and improve the prompt package" --options '{"topK":2,"includeAttribution":true}' --format json` | 0 | `status: "ok"`, top-2 `sk-code` score 0.872159/conf 0.95/unc 0.16 and `sk-prompt` score 0.800387/conf 0.95/unc 0.12; `ambiguous: true`; `freshness: "live"`; lane fields contain only lane/score/evidence-type tokens, no prompt literal | `ambiguous: true` when second passing candidate within 0.05 on score OR confidence gap (confidence gap here 0.00); brief must not overstate certainty; lane breakdown prompt-safe | yes |
| 3 | inspect `data.ambiguous` | 0 | `data.ambiguous` = `true`, consistent with confidence gap 0.00 ≤ 0.05 despite score gap 0.0718 > 0.05 | Close top-two results set `ambiguous: true`; only a candidate outside both margins leaves top result unambiguous | yes |
DEVIATIONS: none — both commands were run exactly as written in the scenario file.
NOTE: brief-rendering evidence comes from the renderer unit tests in step 1 (both pass); the step-2 CLI call returns JSON (`--format json`), so no rendered brief text exists to inspect directly. The absorbed legacy row records a prior BLOCKED run (`advisor_unavailable`, freshness `unavailable`); today freshness was `live` with a populated top-two, so the ambiguity condition was fully evaluable. No reruns needed; no temp files created.
