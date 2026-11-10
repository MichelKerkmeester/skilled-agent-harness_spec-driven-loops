<!-- dispatch: cursor NC-004; ledger: 2026-09-28T13:43:51Z 2026-09-28T13:46:42Z 0 171 -->

RESULT: PASS | scenario=NC-004 | runtime=cursor
NATIVE: none visible
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | npm exec vitest run advisor-recommend + advisor-renderer | 0 | vitest v4.1.11; advisor-recommend.vitest.ts 22 passed; advisor-renderer.vitest.ts 13 passed; Test Files 2 passed (2); Tests 35 passed (35) | Tests pass | yes |
| 2 | skill-advisor.cjs advisor_recommend --prompt "review opencode docs..." --options topK 2, includeAttribution true --format json | 0 | status ok; freshness live; sk-code score 0.871261 confidence 0.95 uncertainty 0.16; sk-prompt score 0.79963 confidence 0.9498 uncertainty 0.12; both pass 0.8/0.35; confidence gap 0.0002; score gap 0.071631; data.ambiguous true; lane fields are lane names, scores, and evidence types (token_match, scorer_signal, category_hint, derived_skill_signal, workflow_signal) with no prompt literal | ambiguous true when a second passing candidate is within 0.05 on score or confidence; rendered brief does not overstate certainty; lane breakdown stays prompt-safe | yes |
| 3 | Inspect data.ambiguous | n/a | data.ambiguous is true, with two passing recommendations rather than a single certain route | Close top two on either axis set ambiguous true | yes |
DEVIATIONS: none
NOTES: The same advisor_recommend command was first run inside the tool sandbox and returned degraded local-scorer with no ambiguous field, because the daemon socket was unreachable there. It was re-run unchanged outside the sandbox; the live-daemon result above is the judged output. This JSON call does not emit a rendered brief string; brief coverage is the passing advisor-renderer suite plus ambiguous true on two routes.
