# Skill Benchmark Report — sk-design

> Rendered from report.json (do not hand-edit). Scoring: `mode-a-router-replay` · trace mode: `router`.

**Verdict: PASS** · aggregate 94/100

## Coverage

- Scored (text executors): **38** · routed out to browser harness: **0**
- By class — routing: 38 · advisor: 0 · browser: 0
- By stage — holdout: 0 · negative (suppression): 4

## Generalization (fitted vs holdout)

- Fitted aggregate: **94/100** · holdout: _none declared_ · negatives: 4
- _no holdout-staged scenarios; fitted aggregate equals the overall score (score-preserving)_

## Dimension scores

| Dimension | Weight | Score |
| --------- | ------ | ----- |
| D1 inter (advisor) | 12pts | _unscored-mode-a_ |
| D1 intra (router) | 13pts | 99/100 |
| D2 discovery | 20pts | 99/100 |
| D3 efficiency | 15pts | 72/100 |
| D4 usefulness | 25pts | _unscored-mode-a_ |
| D5 connectivity (hard gate) | 15pts | 100/100 |

_Unscored in this run (need live mode): D1inter, D4._

### Advisory signals (NOT in the weighted aggregate)

- **D4 task-outcome** — routine-task usefulness (skill-on vs off), separate from D4 hallucination: _unscored (run --d4 in live mode)_
- **Asset support recall** — deferred `assets/*` gold (router defers these on demand): _deferred (router) or no asset gold_

## Route gold (hard lane)

- Gate: **ENFORCED** (flag `on`) · rows scored: **1** · matches: **1** · violations: **0** (gold parse failures: 0)

## Compiled routing parity

- Sub-verdict: **compiled-serving** · child flag forced on: **yes** · parent flag: `force-on` · parity mode: `on`
- Scored: **38** · match: **38** · drift: **0** · vacuous: **0** · resolver-missing: **0** · n/a: **0**
- Eligible rows: **38** · drift rows: **0** · breakages: **0**
- Frozen scorer hashes unchanged: **yes**
- Drift gate: single blocking owner `lane-c-compiled-parity` · report-only consumers: routing-registry-drift-ci

| Scenario | Hub | Status | Front door | Reason | First difference |
| -------- | --- | ------ | ---------- | ------ | ---------------- |
| TV-005 | sk-design | match | route | routing-parity-match |  |
| TV-003 | sk-design | match | route | routing-parity-match |  |
| TV-004 | sk-design | match | defer | routing-parity-match |  |
| TV-001 | sk-design | match | defer | routing-parity-match |  |
| TV-002 | sk-design | match | defer | routing-parity-match |  |
| SR-004 | sk-design | match | route | routing-parity-match |  |
| SR-001 | sk-design | match | route | routing-parity-match |  |
| SR-002 | sk-design | match | defer | routing-parity-match |  |
| SR-003 | sk-design | match | defer | routing-parity-match |  |
| PB-005 | sk-design | match | route | routing-parity-match |  |
| PB-002 | sk-design | match | route | routing-parity-match |  |
| PB-007 | sk-design | match | route | routing-parity-match |  |
| PB-003 | sk-design | match | route | routing-parity-match |  |
| PB-004 | sk-design | match | route | routing-parity-match |  |
| PB-001 | sk-design | match | route | routing-parity-match |  |
| PB-006 | sk-design | match | route | routing-parity-match |  |
| MDR-004 | sk-design | match | route | routing-parity-match |  |
| MDR-002 | sk-design | match | route | routing-parity-match |  |
| MDR-001 | sk-design | match | route | routing-parity-match |  |
| MDR-007 | sk-design | match | route | routing-parity-match |  |
| MDR-005 | sk-design | match | route | routing-parity-match |  |
| MDR-006 | sk-design | match | route | routing-parity-match |  |
| MDR-003 | sk-design | match | route | routing-parity-match |  |
| MG-004 | sk-design | match | route | routing-parity-match |  |
| MG-003 | sk-design | match | route | routing-parity-match |  |
| MG-001 | sk-design | match | route | routing-parity-match |  |
| MG-002 | sk-design | match | route | routing-parity-match |  |
| HM-001 | sk-design | match | route | routing-parity-match |  |
| HM-004 | sk-design | match | route | routing-parity-match |  |
| HM-003 | sk-design | match | defer | routing-parity-match |  |
| HM-002 | sk-design | match | route | routing-parity-match |  |
| FR-002 | sk-design | match | route | routing-parity-match |  |
| FR-001 | sk-design | match | route | routing-parity-match |  |
| SDG-CR-001 | sk-design | match | route | routing-parity-match |  |
| AI-004 | sk-design | match | route | routing-parity-match |  |
| AI-003 | sk-design | match | defer | routing-parity-match |  |
| AI-001 | sk-design | match | defer | routing-parity-match |  |
| AI-002 | sk-design | match | defer | routing-parity-match |  |

## Funnel

- passed: 38

## Ranked bottlenecks

_None._

## Scenarios

| Scenario | Class | Stage | Score | First failing stage |
| -------- | ----- | ----- | ----- | ------------------- |
| TV-005 | routing | routing | 100/100 | passed |
| TV-003 | routing | routing | 100/100 | passed |
| TV-004 | routing | routing | 76/100 | passed |
| TV-001 | routing | routing | 100/100 | passed |
| TV-002 | routing | routing | 100/100 | passed |
| SR-004 | routing | routing | 78/100 | passed |
| SR-001 | routing | routing | 100/100 | passed |
| SR-002 | routing | routing | 100/100 | passed |
| SR-003 | routing | negative | 100/100 | passed |
| PB-005 | routing | routing | 100/100 | passed |
| PB-002 | routing | routing | 100/100 | passed |
| PB-007 | routing | routing | 50/100 | passed |
| PB-003 | routing | routing | 77/100 | passed |
| PB-004 | routing | routing | 100/100 | passed |
| PB-001 | routing | routing | 90/100 | passed |
| PB-006 | routing | routing | 100/100 | passed |
| MDR-004 | routing | routing | 91/100 | passed |
| MDR-002 | routing | routing | 100/100 | passed |
| MDR-001 | routing | routing | 100/100 | passed |
| MDR-007 | routing | routing | 100/100 | passed |
| MDR-005 | routing | routing | 95/100 | passed |
| MDR-006 | routing | routing | 79/100 | passed |
| MDR-003 | routing | routing | 95/100 | passed |
| MG-004 | routing | routing | 82/100 | passed |
| MG-003 | routing | routing | 79/100 | passed |
| MG-001 | routing | routing | 97/100 | passed |
| MG-002 | routing | routing | 79/100 | passed |
| HM-001 | routing | routing | 100/100 | passed |
| HM-004 | routing | routing | 100/100 | passed |
| HM-003 | routing | routing | 100/100 | passed |
| HM-002 | routing | routing | 100/100 | passed |
| FR-002 | routing | routing | 100/100 | passed |
| FR-001 | routing | routing | 100/100 | passed |
| SDG-CR-001 | routing | routing | 100/100 | passed |
| AI-004 | routing | negative | 100/100 | passed |
| AI-003 | routing | negative | 100/100 | passed |
| AI-001 | routing | routing | 100/100 | passed |
| AI-002 | routing | negative | 100/100 | passed |

## Contamination findings (router mode — drift, not failures)

_Playbook prompts intentionally carry trigger words; these are reported as drift signals, not scenario failures._
- TV-005: polish, audit
- TV-003: hero section, clarify, hierarchy
- SR-004: audit, design audit
- SR-001: less generic
- PB-005: sk-design, audit, wcag contrast
- PB-002: hierarchy
- PB-007: sk-design, visual direction, aesthetic
- PB-003: md-generator, design.md
- PB-004: sk-design, motion, reduced-motion
- PB-001: sk-design, less generic
- PB-006: sk-design, interface, polish, foundations, motion, audit
- MDR-004: audit, wcag contrast
- MDR-002: color token system, typography scale, grid, oklch, typography
- MDR-001: less generic, visual direction
- MDR-007: open design, od cli, wire open design
- MDR-005: style reference, design.md
- MDR-006: bolder, motion
- MDR-003: motion, micro-interactions, reduced-motion
- MG-004: style reference, design.md
- MG-003: tokens.json, design fidelity check, design.md, design fidelity
- MG-001: tokens.json, design.md
- MG-002: tokens.json, design.md
- HM-001: interface, foundations, motion, audit
- HM-004: open design
- HM-002: visual direction
- FR-002: motion, reduced-motion
- FR-001: foundations
- SDG-CR-001: tokens.json, design.md
- AI-004: design review
- AI-003: sk-design

## Methodology / caveats

- Mode A is the deterministic CI gate; D1-inter (advisor) + D4 (ablation) need live mode. Advisory signals: mode precision unscored; relative ranking unscored (no advisor probe or no rank-below gold); route gold rows 0; telemetry missing n/a (0/0); route misses n/a (0/0); alias misses n/a (0/0); bundle misses n/a (0/0); recipe misses n/a (0/0).
- Scenario count: 38.
