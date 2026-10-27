# Skill Benchmark Report — sk-code-review

> Rendered from report.json (do not hand-edit). Scoring: `live-finding-accuracy` · trace mode: `live`.

**Verdict: PASS** · aggregate D4 only: 100/100

## Coverage

- Scored (text executors): **9** · routed out to browser harness: **0**
- By class — routing: 0 · advisor: 0 · browser: 0

## Dimension scores

| Dimension | Weight | Score |
| --------- | ------ | ----- |
| D1 inter (advisor) | 12pts | _not in this run_ |
| D1 intra (router) | 13pts | _not in this run_ |
| D2 discovery | 20pts | _not in this run_ |
| D3 efficiency | 15pts | _not in this run_ |
| D4 usefulness | 25pts | 100/100 |
| D5 connectivity (hard gate) | 15pts | _not in this run_ |

_Unscored in this run (need live mode): D1inter, D1intra, D2, D3, D5._

## Funnel

- passed: 9
- failed: 0

## Ranked bottlenecks

| Severity | Class | Locus | Finding |
| -------- | ----- | ----- | ------- |
| P2 | severity calibration | CR-027 supplemental | With the min > max guard removed the review still flagged the inverted-range defect, but graded it P2 under the reach rule, so the supplemental shows detection, not blocking |

## Scenarios

| Scenario | Class | Score | First failing stage |
| -------- | ----- | ----- | ------------------- |
| CR-025 run 1 | finding-accuracy | 100/100 | passed |
| CR-025 run 2 | finding-accuracy | 100/100 | passed |
| CR-025 run 3 | finding-accuracy | 100/100 | passed |
| CR-026 run 1 | finding-accuracy | 100/100 | passed |
| CR-026 run 2 | finding-accuracy | 100/100 | passed |
| CR-026 run 3 | finding-accuracy | 100/100 | passed |
| CR-027 run 1 | finding-accuracy | 100/100 | passed |
| CR-027 run 2 | finding-accuracy | 100/100 | passed |
| CR-027 run 3 | finding-accuracy | 100/100 | passed |
| CR-027 supplemental (guard removed) | finding-accuracy | not recorded | recorded |

## Methodology / caveats

- Three live reviews per scenario plus one supplemental run on 2026-10-27, after the reach calibration was added to the review mode. Same executor, model, flags and prompt builder as the first live run that day; fixtures sat in a folder holding only the three fixture files. Each run was scored by hand against its scenario gold and checked with check-review-final-line.js. Raw review outputs, final-line results and per-run usage live in specs/sk-code/016-review-mode-followups/evidence/finding-accuracy-rerun/. Three runs per scenario is a small sample, not a stable rate.
- Scenario count: 3.
