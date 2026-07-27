# Skill Benchmark Report — sk-design

> Rendered from report.json (do not hand-edit). Scoring: `mode-b-live` · trace mode: `live`.

**Verdict: PASS** · aggregate 93/100

> **Scope note:** PASS is computed over the four weighted, scored dimensions (D1intra, D2, D3, D5); D1-inter and D4 remain unscored this run (see Methodology below). It does **not** certify the browser-class scenarios — see the P1 `funnel_attrition` bottleneck under Ranked bottlenecks: 6 of 7 browser scenarios first-fail at the `browser` stage because the harness has no per-URL export/motion/video probe for 3 scenario types (`PARTIAL-NEEDS-ARTIFACT`) and no recipe at all for the other 3 (`SKIP-NO-BROWSER`). That is a benchmark-harness instrumentation gap, not an observed routing/discovery defect in the skill; treat it as an open item tracked via the bottlenecks table, not resolved by this headline.

## Coverage

- Scored (text executors): **22** · routed out to browser harness: **0**
- By class — routing: 12 · advisor: 6 · browser: 7

## Dimension scores

| Dimension | Weight | Score |
| --------- | ------ | ----- |
| D1 inter (advisor) | 12pts | _unscored-mode-a_ |
| D1 intra (router) | 13pts | 82/100 |
| D2 discovery | 20pts | 82/100 |
| D3 efficiency | 15pts | 63/100 |
| D4 usefulness | 25pts | _unscored-mode-a_ |
| D5 connectivity (hard gate) | 15pts | 100/100 |

_Unscored in this run (need live mode): D1inter, D4._

### Advisory signals (NOT in the weighted aggregate)

- **D4 task-outcome** — routine-task usefulness (skill-on vs off), separate from D4 hallucination: _unscored (run --d4 in live mode)_
- **Asset support recall** — deferred `assets/*` gold (router defers these on demand): _deferred (router) or no asset gold_

## Funnel

- passed: 19
- browser: 6

**Headline bottleneck: browser**

## Ranked bottlenecks

| Severity | Class | Locus | Finding |
| -------- | ----- | ----- | ------- |
| P1 | funnel_attrition | browser | 6 scenario(s) first fail at stage 'browser' |

## Scenarios

| Scenario | Class | Score | First failing stage |
| -------- | ----- | ----- | ------------------- |
| MR-001 | browser | 100/100 | passed |
| MR-002 | browser | 50/100 | browser |
| MR-003 | browser | 50/100 | browser |
| MR-004 | browser | 50/100 | browser |
| MR-005 | browser | — | browser |
| MR-006 | browser | — | browser |
| MR-007 | browser | — | browser |
| AI-001 | routing | 100/100 | passed |
| AI-002 | routing | 100/100 | passed |
| AI-003 | routing | 100/100 | passed |
| TV-001 | routing | 100/100 | passed |
| TV-002 | routing | 100/100 | passed |
| TV-003 | routing | 100/100 | passed |
| TV-004 | routing | 100/100 | passed |
| TV-005 | routing | 100/100 | passed |
| MG-001 | advisor | 100/100 | passed |
| MG-002 | advisor | 100/100 | passed |
| MG-003 | advisor | 100/100 | passed |
| SR-001 | routing | 100/100 | passed |
| SR-002 | routing | 100/100 | passed |
| SR-003 | routing | 100/100 | passed |
| SR-004 | routing | 100/100 | passed |
| PB-001 | advisor | 100/100 | passed |
| PB-002 | advisor | 100/100 | passed |
| PB-003 | advisor | 100/100 | passed |

## Methodology / caveats

- This run's trace mode is `live` (see header), but D1-inter and D4 still show `unscored-mode-a` here because this pass supplied no advisor probe/rank-gold (D1-inter) and no `--d4` ablation flag (D4) — not because live mode is inherently unable to score them. Advisory signals: mode precision unscored; relative ranking unscored (no advisor probe or no rank-below gold); route gold rows 0; telemetry missing n/a (0/0); route misses n/a (0/0); alias misses n/a (0/0); bundle misses n/a (0/0); recipe misses n/a (0/0).
- Scenario count: 25.
