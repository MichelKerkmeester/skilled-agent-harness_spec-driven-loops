# Skill Benchmark Report — sk-design

> Rendered from report.json (do not hand-edit). Scoring: `mode-a-router-replay` · trace mode: `router`.

**Verdict: BLOCKED-BY-ROUTE-GOLD** · aggregate 95/100

## Coverage

- Scored (text executors): **51** · routed out to browser harness: **0**
- By class — routing: 51 · advisor: 0 · browser: 0
- By stage — holdout: 0 · negative (suppression): 4

## Generalization (fitted vs holdout)

- Fitted aggregate: **95/100** · holdout: _none declared_ · negatives: 4
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

- Gate: **ENFORCED** (flag `auto`) · rows scored: **18** · matches: **15** · violations: **3** (gold parse failures: 0)
- ⚠ **Route-gold violation(s) fail this run** — a route mismatch cannot remain a PASS while the gate is on.

| Scenario | Intent | Resources | Expected | Observed |
| -------- | ------ | --------- | -------- | -------- |
| TV-001.V2 | MISMATCH | ok | intent: interface<br>resources: — | intent: interface<br>foundations<br>resources: design-interface/references/design-process/design-principles.md<br>design-interface/references/design-process/brief-to-dials.md<br>design-interface/assets/interface-preflight-card.md |
| TV-001.V3 | MISMATCH | ok | intent: interface<br>resources: — | intent: interface<br>foundations<br>resources: design-interface/references/design-process/design-principles.md<br>design-interface/references/design-process/brief-to-dials.md<br>design-interface/assets/interface-preflight-card.md |
| SR-002.P3 | MISMATCH | ok | intent: audit<br>resources: — | intent: _empty set_<br>resources: design-audit/references/corpus-map.md<br>design-audit/references/audit-contract.md<br>design-audit/references/accessibility-performance.md<br>design-audit/references/anti-patterns-production.md<br>design-audit/references/critique-hardening.md<br>design-audit/references/transform-remediation.md<br>design-audit/assets/audit-report-template.md |

## Funnel

- passed: 51

## Ranked bottlenecks

_None._

## Scenarios

| Scenario | Class | Stage | Score | First failing stage |
| -------- | ----- | ----- | ----- | ------------------- |
| TV-005 | routing | routing | 100/100 | passed |
| TV-003 | routing | routing | 100/100 | passed |
| TV-004 | routing | routing | 76/100 | passed |
| TV-001.V1 | routing | routing | 100/100 | passed |
| TV-001.V2 | routing | routing | 100/100 | passed |
| TV-001.V3 | routing | routing | 100/100 | passed |
| TV-001.V4 | routing | routing | 100/100 | passed |
| TV-002.V1 | routing | routing | 100/100 | passed |
| TV-002.V2 | routing | routing | 100/100 | passed |
| TV-002.V3 | routing | routing | 100/100 | passed |
| TV-002.V4 | routing | routing | 100/100 | passed |
| SR-004 | routing | routing | 78/100 | passed |
| SR-001 | routing | routing | 100/100 | passed |
| SR-002.P1 | routing | routing | 100/100 | passed |
| SR-002.P2 | routing | routing | 100/100 | passed |
| SR-002.P3 | routing | routing | 84/100 | passed |
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
| AI-001.P1 | routing | routing | 100/100 | passed |
| AI-001.P2 | routing | routing | 100/100 | passed |
| AI-001.P3 | routing | routing | 100/100 | passed |
| AI-001.P4 | routing | routing | 100/100 | passed |
| AI-001.P5 | routing | routing | 100/100 | passed |
| AI-001.P6 | routing | routing | 100/100 | passed |
| AI-002 | routing | negative | 100/100 | passed |

## Contamination findings (router mode — drift, not failures)

_Playbook prompts intentionally carry trigger words; these are reported as drift signals, not scenario failures._
- TV-005: polish, audit
- TV-003: hero section, clarify, hierarchy
- TV-001.V1: bolder
- TV-001.V2: quieter, layout
- TV-001.V3: distill, hierarchy
- TV-001.V4: interface, delight
- TV-002.V1: bolder, hierarchy, should it be, should it be bolder
- TV-002.V2: quieter, should it be, should it be quieter
- TV-002.V3: interface, distill, should it be, should it be distill
- TV-002.V4: delight, should it be, should it be delight
- SR-004: audit, design audit
- SR-001: less generic
- SR-002.P1: spacing system, token starter
- SR-002.P2: motion, motion budget, reduced-motion
- SR-002.P3: audit
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
- AI-001.P1: interface, less generic
- AI-001.P2: oklch palette, typography scale, spacing system, palette, oklch, typography
- AI-001.P3: motion, choreography, reduced-motion
- AI-001.P4: audit, wcag contrast
- AI-001.P5: design tokens, generate design.md, extract design tokens, design.md
- AI-001.P6: open design, od cli, wire open design

## Methodology / caveats

- Mode A is the deterministic CI gate; D1-inter (advisor) + D4 (ablation) need live mode. Advisory signals: mode precision unscored; relative ranking unscored (no advisor probe or no rank-below gold); route gold rows 0; telemetry missing n/a (0/0); route misses n/a (0/0); alias misses n/a (0/0); bundle misses n/a (0/0); recipe misses n/a (0/0).
- Scenario count: 51.
