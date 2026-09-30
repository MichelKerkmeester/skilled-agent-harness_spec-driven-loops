<!-- dispatch: devin NC-004; ledger: 2026-09-28T13:43:07Z 2026-09-28T13:43:51Z 0 44 -->

I'll start by reading the scenario file and confirming the environment setup.Scenario NC-004. Running step 1: the vitest ambiguity test.Step 1 passed. Now step 2: the advisor_recommend call.All steps ran cleanly. Verifying the ambiguity logic: confidence gap between top two is 0.95 − 0.9498 = 0.0002 (≤ 0.05), so `ambiguous: true` is the correct flag even though the score gap (~0.072) exceeds 0.05 — the scenario requires either axis within 0.05. Lane fields contain only generic feature names (token_match, scorer_signal, etc.) — no prompt literal leakage. The session's rendered brief also displayed "ambiguous:" with both candidates, not a single-skill certainty.

RESULT: PASS | scenario=NC-004 | runtime=devin
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---|---|---|---|
| 1 | `npm exec -- vitest run tests/handlers/advisor-recommend.vitest.ts tests/legacy/advisor-renderer.vitest.ts` | 0 | `Test Files 2 passed (2)`; `Tests 35 passed (35)`; vitest v4.1.11 | Tests pass (absorbed row cites same 2 files / 35 tests) | yes |
| 2 | `skill-advisor.cjs advisor_recommend --prompt "review opencode docs and improve the prompt package" --options '{"topK":2,"includeAttribution":true}' --format json` | 0 | `status: ok`; top two: sk-code (score 0.871261, conf 0.95), sk-prompt (score 0.79963, conf 0.9498); `ambiguous: true`; `freshness: live` | Close top-two results set `ambiguous: true`; envelope `ok`; recommendations plausible | yes |
| 3 | inspect `data.ambiguous` + lane safety | — | `ambiguous: true`; confidence gap 0.0002 ≤ 0.05 (score gap ~0.072 > 0.05, but either axis triggers); lane fields hold only feature names, no prompt text | Ambiguity flagged when second passing candidate within 0.05 on either axis; lane breakdown prompt-safe; brief does not overstate certainty | yes |
DEVIATIONS: none
NOTES: The absorbed legacy row's sample advisor output (empty recommendations, `advisor_unavailable`, generation 9476) is a stale fail-open snapshot from 2026-07-03; the live daemon answered normally this run (generation 582, cache hit). Session native brief (NATIVE line) corroborates ambiguous top-two rendering.
