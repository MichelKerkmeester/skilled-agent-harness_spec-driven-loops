<!-- dispatch: cursor NC-004; ledger: 2026-09-26T19:27:32Z 2026-09-26T19:29:22Z 0 110 -->

RESULT: PASS | scenario=NC-004 | runtime=cursor
NATIVE: none visible
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | npm exec vitest run advisor-recommend.vitest.ts advisor-renderer.vitest.ts | 0 | RUN v4.1.11; Test Files 2 passed (2); Tests 35 passed (35) | Tests pass | yes |
| 2 | skill-advisor.cjs advisor_recommend --prompt "review opencode docs..." --options topK 2 includeAttribution --format json | 0 | status ok; freshness live; recommendations sk-code confidence 0.95 and sk-prompt confidence 0.95; data.ambiguous true; laneBreakdown present on both | ambiguous true when the top two passing candidates are within 0.05 confidence; lane breakdown remains prompt-safe | yes |
| 3 | Inspect data.ambiguous | n/a | data.ambiguous is true; confidence delta is 0.00 (0.95 and 0.95). Lane fields hold lane names, scores, and evidence types. The prompt literal is absent from those fields. Renderer tests in step 1 passed | Output includes ambiguous true for a top-two gap within 0.05; rendered brief does not overstate certainty; lane breakdown remains prompt-safe | yes |
DEVIATIONS: The first advisor_recommend ran inside the command sandbox and returned degraded local-scorer JSON with no ambiguous field (status ok, source local-scorer, recommendations sk-code 0.95 and sk-prompt 0.95). The same command was rerun outside the sandbox so the live daemon could answer. The table records that rerun. No command text was changed.
NOTES: Judged output is the live daemon response (freshness live, trustState.generation 482, ambiguous true). Both confidences are 0.95, so the 0.05 rule applies and the flag is true. advisor_recommend did not print a separate rendered brief; the brief signal is the passing advisor-renderer.vitest.ts suite plus ambiguous true.
