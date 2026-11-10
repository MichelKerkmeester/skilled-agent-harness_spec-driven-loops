<!-- dispatch: cursor NC-004; ledger: 2026-09-26T22:33:48Z 2026-09-26T22:35:48Z 0 120 -->

RESULT: PASS | scenario=NC-004 | runtime=cursor
NATIVE: none visible
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | vitest run advisor-recommend + advisor-renderer | 0 | Test Files 2 passed (2); Tests 35 passed (35); advisor-recommend 22 passed; advisor-renderer 13 passed | Tests pass | yes |
| 2 | skill-advisor.cjs advisor_recommend --prompt "review opencode docs…" --options topK 2, includeAttribution true --format json | 0 | status ok; freshness live; recommendations sk-code score 0.872164 confidence 0.95, sk-prompt score 0.800392 confidence 0.95; data.ambiguous true; laneBreakdown present on both | Envelope status ok; ambiguous true when the second passing candidate is within 0.05 on score or confidence; lane breakdown prompt-safe | yes |
| 3 | Inspect data.ambiguous | n/a | data.ambiguous is true. Confidence gap is 0.00. Score gap is 0.071772. Lane fields and why_recommended text do not contain the prompt literal | ambiguous true because the confidence gap is within 0.05; rendered path does not claim a single certain skill; lanes stay prompt-safe | yes |
DEVIATIONS: The same advisor_recommend command was first run in the sandbox and returned degraded local-scorer JSON with no ambiguous field (exit 0). That output was discarded and the command was rerun outside the sandbox so the live daemon socket was reachable. The verdict uses the unsandboxed output. No other step was skipped or changed.
NOTES: Renderer coverage is the advisor-renderer vitest file in step 1, which passed. The recommend JSON has no separate rendered-brief string. Both top candidates pass the 0.8 confidence threshold. The score gap is above 0.05 and the confidence gap is 0.00, so the either-axis rule requires ambiguous true, which is what the payload returned.
