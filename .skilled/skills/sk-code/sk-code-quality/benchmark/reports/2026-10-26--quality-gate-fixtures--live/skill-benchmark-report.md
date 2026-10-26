# Skill Benchmark Report — sk-code-quality

> Rendered from report.json (do not hand-edit). Scoring: `catch rate, false positive count, wall time and intent recall per scenario, with no weighted dimension score` · trace mode: `live`.

**Verdict: not recorded** · aggregate not recorded

## Dimension scores

| Dimension | Weight | Score |
| --------- | ------ | ----- |
| D1 inter (advisor) | 0pts | _not recorded_ |
| D1 intra (router) | 0pts | _not recorded_ |
| D2 discovery | 0pts | _not recorded_ |
| D3 efficiency | 0pts | _not recorded_ |
| D4 usefulness | 0pts | _not recorded_ |
| D5 connectivity (hard gate) | 0pts | _not recorded_ |

## Funnel

- passed: 5
- recorded with no target: 1

## Ranked bottlenecks

_None._

## Scenarios

| Scenario | Class | Score | First failing stage |
| -------- | ----- | ----- | ------------------- |
| F01 | fixture | not recorded | passed |
| F02 | fixture | not recorded | passed |
| F05 | fixture | not recorded | passed |
| F06 | fixture | not recorded | passed |
| 50-file timing set | generated | not recorded | passed |
| intent prompts | routing | not recorded | recorded |

## Methodology / caveats

- Every number in this folder is read from the measurement record this run wrote. The catch rate is 7 of 7 seeded exact labels on fixture F01, with 0 unseeded findings. There were 0 false positive findings on fixture F02. Both of those come from the suite fixtures the gate's own tests assert, so they prove the fixtures rather than an independent corpus. The measured wall time on the 50-file set is five full runs at 1561.0, 1576.3, 1608.3, 1581.0 and 1661.0 ms, each with both built-in checks RAN_CLEAN and a NO_BLOCKER_FOUND gate, with the largest at 1661.0 ms against a 2000 ms target. An earlier set of runs with --no-run measured 138.2, 144.5 and 166.7 ms, replayed at 142.8, 178.6 and 165.4 ms, and is kept as setup only, because those runs start neither built-in check. Measured intent recall is 4 of 4 prompts routed single to sk-code-quality, recorded as found with no target. The read-only invariant held on every run and the transcript scan found 0 passing claims. The run measured commit 716a1a8ac4e37478835e14e91b804811e686875d on Node v26.8.2, darwin arm64, Apple M5 Max, 18 cores, load average 5.40 at the first full timing run. No weighted benchmark dimension was scored here, so the verdict and the aggregate read as not recorded rather than as a number nothing measured. A scenario whose recorded result matched the expectation it was written against reads as passed, and a scenario measured against no target reads as recorded rather than passed, so neither reading is a claim that the gate let a change through. F01 is meant to block, F05 to report NOTHING_CHECKED and F06 to report UNVERIFIED.
- Scenario count: 6.
