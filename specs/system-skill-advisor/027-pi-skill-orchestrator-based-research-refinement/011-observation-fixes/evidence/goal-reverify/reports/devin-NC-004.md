<!-- dispatch: devin NC-004; ledger: 2026-09-27T13:49:02Z 2026-09-27T13:49:51Z 0 49 -->

STEP 0 — the Advisor line is visible in my context. Now reading the scenario file.Scenario understood. Two commands: a vitest run on the advisor runtime tests, then a live `advisor_recommend` call with `topK:2`. Running step 1.All 35 tests pass. Now step 2 — the broad prompt `advisor_recommend` call.Both steps ran cleanly. Analysis against expected signals:

- **Step 1 (vitest):** 2 files, 35 tests, all passed, exit 0 — matches "Tests pass".
- **Step 2 (advisor_recommend):** `status: "ok"`, `freshness: "live"`. Top two: `sk-code` (score 0.87181, confidence 0.95) vs `sk-prompt` (score 0.800093, confidence 0.95). Score gap = 0.072 (> 0.05) but confidence gap = 0.00 (< 0.05) → a close top-two on the confidence axis, and `data.ambiguous: true` was set. Matches the rule exactly.
- **Lane safety:** `laneBreakdown` contains only lane enums, weights and numeric scores — no prompt literal leaked.
- **Brief certainty:** the native Advisor line for this session itself renders `ambiguous: … vs …` with both candidates, so the brief does not overstate certainty.

No temp files were created; nothing to clean up.

RESULT: PASS | scenario=NC-004 | runtime=devin-cli (SWE-2 High)
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---|---|---|---|
| 1 | `npm exec -- vitest run tests/handlers/advisor-recommend.vitest.ts tests/legacy/advisor-renderer.vitest.ts` (in runtime dir) | 0 | `Test Files 2 passed (2)`, `Tests 35 passed (35)`, vitest v4.1.11 | Tests pass | yes |
| 2 | `skill-advisor.cjs advisor_recommend --prompt "review opencode docs and improve the prompt package" --options '{"topK":2,"includeAttribution":true}'` | 0 | `status:"ok"`, `freshness:"live"`, top-2 `sk-code` (score 0.87181, conf 0.95) / `sk-prompt` (score 0.800093, conf 0.95), `ambiguous: true` | `ambiguous: true` when second passing candidate within 0.05 on score or confidence; prompt-safe lanes; brief not overstated | yes |
DEVIATIONS: none — both commands run verbatim from repo root as written.
NOTES: Confidence gap was 0.00 (within 0.05) while score gap was 0.072 (outside) — the confidence axis alone drove `ambiguous: true`, consistent with the either-axis rule. Recorded legacy evidence shows vitest v4.1.6; observed v4.1.11 — version drift only, all tests still pass. Native Advisor line for this prompt also rendered an ambiguous two-skill brief, corroborating non-overstated certainty on the rendered surface.
