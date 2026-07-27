# Skill Benchmark Report — mcp-tooling

> Rendered from report.json (do not hand-edit). Scoring: `mode-a-router-replay` · trace mode: `router`.

**Verdict: PASS** · aggregate 98/100

## Coverage

- Scored (text executors): **14** · routed out to browser harness: **0**
- By class — routing: 14 · advisor: 0 · browser: 0
- By stage — holdout: 6 · negative (suppression): 0

## Generalization (fitted vs holdout)

- Fitted (8): **98/100** · Holdout (6): **100/100** · Gap: **-2**
- Negatives (suppression): 0
- _holdout excluded from the fitted aggregate; gap = fitted minus holdout_

## Dimension scores

| Dimension | Weight | Score |
| --------- | ------ | ----- |
| D1 inter (advisor) | 12pts | _unscored-mode-a_ |
| D1 intra (router) | 13pts | 97/100 |
| D2 discovery | 20pts | 100/100 |
| D3 efficiency | 15pts | 100/100 |
| D4 usefulness | 25pts | _unscored-mode-a_ |
| D5 connectivity (hard gate) | 15pts | 100/100 |

_Unscored in this run (need live mode): D1inter, D4._

### Advisory signals (NOT in the weighted aggregate)

- **D4 task-outcome** — routine-task usefulness (skill-on vs off), separate from D4 hallucination: _unscored (run --d4 in live mode)_
- **Asset support recall** — deferred `assets/*` gold (router defers these on demand): _deferred (router) or no asset gold_

## Route gold (hard lane)

- Gate: **ENFORCED** (flag `on`) · rows scored: **14** · matches: **14** · violations: **0** (gold parse failures: 0)

## Compiled routing parity

- Sub-verdict: **compiled-serving** · child flag forced on: **yes** · parent flag: `force-on` · parity mode: `on`
- Scored: **14** · match: **14** · drift: **0** · vacuous: **0** · resolver-missing: **0** · n/a: **0**
- Eligible rows: **14** · drift rows: **0** · breakages: **0**
- Frozen scorer hashes unchanged: **yes**
- Drift gate: single blocking owner `lane-c-compiled-parity` · report-only consumers: routing-registry-drift-ci

| Scenario | Hub | Status | Front door | Reason | First difference |
| -------- | --- | ------ | ---------- | ------ | ---------------- |
| MT-004 | mcp-tooling | match | defer | routing-parity-match |  |
| MT-007 | mcp-tooling | match | route | routing-parity-match |  |
| MT-001 | mcp-tooling | match | route | routing-parity-match |  |
| MT-002 | mcp-tooling | match | route | routing-parity-match |  |
| MT-003 | mcp-tooling | match | route | routing-parity-match |  |
| MT-H04 | mcp-tooling | match | route | routing-parity-match |  |
| MT-H01 | mcp-tooling | match | route | routing-parity-match |  |
| MT-H02 | mcp-tooling | match | route | routing-parity-match |  |
| MT-H06 | mcp-tooling | match | route | routing-parity-match |  |
| MT-H03 | mcp-tooling | match | route | routing-parity-match |  |
| MT-H05 | mcp-tooling | match | route | routing-parity-match |  |
| MT-009 | mcp-tooling | match | route | routing-parity-match |  |
| MT-008 | mcp-tooling | match | route | routing-parity-match |  |
| MT-CR-001 | mcp-tooling | match | route | routing-parity-match |  |

## Funnel

- passed: 14

## Ranked bottlenecks

_None._

## Scenarios

| Scenario | Class | Stage | Score | First failing stage |
| -------- | ----- | ----- | ----- | ------------------- |
| MT-004 | routing | routing | 84/100 | passed |
| MT-007 | routing | routing | 100/100 | passed |
| MT-001 | routing | routing | 100/100 | passed |
| MT-002 | routing | routing | 100/100 | passed |
| MT-003 | routing | routing | 100/100 | passed |
| MT-H04 | routing | holdout | 100/100 | passed |
| MT-H01 | routing | holdout | 100/100 | passed |
| MT-H02 | routing | holdout | 100/100 | passed |
| MT-H06 | routing | holdout | 100/100 | passed |
| MT-H03 | routing | holdout | 100/100 | passed |
| MT-H05 | routing | holdout | 100/100 | passed |
| MT-009 | routing | routing | 100/100 | passed |
| MT-008 | routing | routing | 100/100 | passed |
| MT-CR-001 | routing | routing | 100/100 | passed |

## Contamination findings (router mode — drift, not failures)

_Playbook prompts intentionally carry trigger words; these are reported as drift signals, not scenario failures._
- MT-007: console errors, aside, aside browser
- MT-001: chrome devtools
- MT-002: clickup, clickup task
- MT-003: figma, design tokens
- MT-H04: click through, on its own
- MT-H01: network requests
- MT-H02: design file
- MT-H06: phone apps
- MT-H03: project tracker
- MT-H05: web products
- MT-009: mobbin
- MT-008: refero, references
- MT-CR-001: refero, ui reference, mobbin, references

## Methodology / caveats

- Mode A is the deterministic CI gate; D1-inter (advisor) + D4 (ablation) need live mode. Advisory signals: mode precision unscored; relative ranking unscored (no advisor probe or no rank-below gold); route gold rows 0; telemetry missing n/a (0/0); route misses n/a (0/0); alias misses n/a (0/0); bundle misses n/a (0/0); recipe misses n/a (0/0).
- Scenario count: 14.
