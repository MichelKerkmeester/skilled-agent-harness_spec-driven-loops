# Skill Benchmark Report — sk-code-review

> Rendered from report.json (do not hand-edit). Scoring: `live-finding-accuracy` · trace mode: `live`.

**Verdict: FAIL** · aggregate D4 only: 67/100

## Coverage

- Scored (text executors): **3** · routed out to browser harness: **0**
- By class — routing: 0 · advisor: 0 · browser: 0

## Dimension scores

| Dimension | Weight | Score |
| --------- | ------ | ----- |
| D1 inter (advisor) | 12pts | _not in this run_ |
| D1 intra (router) | 13pts | _not in this run_ |
| D2 discovery | 20pts | _not in this run_ |
| D3 efficiency | 15pts | _not in this run_ |
| D4 usefulness | 25pts | 67/100 |
| D5 connectivity (hard gate) | 15pts | _not in this run_ |

_Unscored in this run (need live mode): D1inter, D1intra, D2, D3, D5._

## Funnel

- passed: 2
- failed: 1

## Ranked bottlenecks

| Severity | Class | Locus | Finding |
| -------- | ----- | ----- | ------- |
| P1 | false positive | CR-027 | The clean control drew a P1 for NaN bounds, a case the gold treats as advisory at most |

## Scenarios

| Scenario | Class | Score | First failing stage |
| -------- | ----- | ----- | ------------------- |
| CR-025 | finding-accuracy | 100/100 | passed |
| CR-026 | finding-accuracy | 100/100 | passed |
| CR-027 | finding-accuracy | 0/100 | clean control raised a P1 (NaN bounds at clamp.js:5) and ended REQUESTED_CHANGES |

## Methodology / caveats

- One live review per scenario on 2026-10-27, scored by hand against the scenario gold and checked with check-review-final-line.js. Raw review outputs and per-run usage live in specs/sk-code/016-review-mode-followups/evidence/finding-accuracy-run/. A single run per scenario measures one sample, not a rate.
- Scenario count: 3.
