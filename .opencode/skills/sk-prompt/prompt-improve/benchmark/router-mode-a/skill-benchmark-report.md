# Skill Benchmark Report — prompt-improve

> Rendered from report.json (do not hand-edit). Scoring: `mode-a-router-replay` · trace mode: `router`.

**Verdict: NO-SCENARIOS**

## Coverage

- Scored (text executors): **0** · routed out to browser harness: **0**
- By class — routing: 0 · advisor: 0 · browser: 0

## Dimension scores

| Dimension | Weight | Score |
| --------- | ------ | ----- |
| D1 inter (advisor) | 12pts | _unscored-mode-a_ |
| D1 intra (router) | 13pts | _unscored_ |
| D2 discovery | 20pts | _unscored_ |
| D3 efficiency | 15pts | _unscored_ |
| D4 usefulness | 25pts | _unscored-mode-a_ |
| D5 connectivity (hard gate) | 15pts | 16/100 |

_Unscored in this run (need live mode): D1inter, D4._

### Advisory signals (NOT in the weighted aggregate)

- **D4 task-outcome** — routine-task usefulness (skill-on vs off), separate from D4 hallucination: _unscored (run --d4 in live mode)_
- **Asset support recall** — deferred `assets/*` gold (router defers these on demand): _deferred (router) or no asset gold_

## Funnel


## Ranked bottlenecks

| Severity | Class | Locus | Finding |
| -------- | ----- | ----- | ------- |
| P1 | dead_intent_key | RESOURCE_MAP.TEXT_ENHANCE | TEXT_ENHANCE has no INTENT_SIGNALS entry |
| P1 | dead_intent_key | RESOURCE_MAP.FRAMEWORK | FRAMEWORK has no INTENT_SIGNALS entry |
| P1 | dead_intent_key | RESOURCE_MAP.DESIGN_GEN | DESIGN_GEN has no INTENT_SIGNALS entry |
| P1 | dead_intent_key | RESOURCE_MAP.FORMAT_MARKDOWN | FORMAT_MARKDOWN has no INTENT_SIGNALS entry |
| P1 | dead_intent_key | RESOURCE_MAP.FORMAT_JSON | FORMAT_JSON has no INTENT_SIGNALS entry |
| P1 | dead_intent_key | RESOURCE_MAP.FORMAT_YAML | FORMAT_YAML has no INTENT_SIGNALS entry |
| P1 | dead_intent_key | RESOURCE_MAP.RAW | RAW has no INTENT_SIGNALS entry |

## Scenarios

_No scenarios._

## Methodology / caveats

- Mode A is the deterministic CI gate; D1-inter (advisor) + D4 (ablation) need live mode. Advisory signals: mode precision unscored; relative ranking unscored (no advisor probe or no rank-below gold); route gold rows 0; telemetry missing n/a (0/0); route misses n/a (0/0); alias misses n/a (0/0); bundle misses n/a (0/0); recipe misses n/a (0/0).
- Scenario count: 0.
