# Skill Benchmark Report — sk-doc

> Rendered from report.json (do not hand-edit). Scoring: `mode-a-router-replay` · trace mode: `router`.

**Verdict: PASS** · aggregate 98/100

## Coverage

- Scored (text executors): **32** · routed out to browser harness: **0**
- By class — routing: 32 · advisor: 0 · browser: 0
- By stage — holdout: 13 · negative (suppression): 0

## Generalization (fitted vs holdout)

- Fitted (19): **98/100** · Holdout (13): **100/100** · Gap: **-2**
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

- Gate: **ENFORCED** (flag `on`) · rows scored: **32** · matches: **32** · violations: **0** (gold parse failures: 0)

## Compiled routing parity

- Sub-verdict: **compiled-serving** · child flag forced on: **yes** · parent flag: `force-on` · parity mode: `on`
- Scored: **32** · match: **32** · drift: **0** · vacuous: **0** · resolver-missing: **0** · n/a: **0**
- Eligible rows: **32** · drift rows: **0** · breakages: **0**
- Frozen scorer hashes unchanged: **yes**
- Drift gate: single blocking owner `lane-c-compiled-parity` · report-only consumers: routing-registry-drift-ci

| Scenario | Hub | Status | Front door | Reason | First difference |
| -------- | --- | ------ | ---------- | ------ | ---------------- |
| SD-007 | sk-doc | match | route | routing-parity-match |  |
| SD-009 | sk-doc | match | route | routing-parity-match |  |
| SD-008 | sk-doc | match | defer | routing-parity-match |  |
| SD-015 | sk-doc | match | defer | routing-parity-match |  |
| SD-014 | sk-doc | match | route | routing-parity-match |  |
| SD-013 | sk-doc | match | route | routing-parity-match |  |
| SD-005 | sk-doc | match | route | routing-parity-match |  |
| SD-006 | sk-doc | match | route | routing-parity-match |  |
| SD-004 | sk-doc | match | route | routing-parity-match |  |
| SD-003 | sk-doc | match | route | routing-parity-match |  |
| SD-001 | sk-doc | match | route | routing-parity-match |  |
| SD-016 | sk-doc | match | route | routing-parity-match |  |
| SD-002 | sk-doc | match | route | routing-parity-match |  |
| SD-H04 | sk-doc | match | route | routing-parity-match |  |
| SD-H02 | sk-doc | match | route | routing-parity-match |  |
| SD-H05 | sk-doc | match | route | routing-parity-match |  |
| SD-H09 | sk-doc | match | route | routing-parity-match |  |
| SD-H07 | sk-doc | match | route | routing-parity-match |  |
| SD-H13 | sk-doc | match | route | routing-parity-match |  |
| SD-H10 | sk-doc | match | route | routing-parity-match |  |
| SD-H12 | sk-doc | match | route | routing-parity-match |  |
| SD-H11 | sk-doc | match | route | routing-parity-match |  |
| SD-H08 | sk-doc | match | route | routing-parity-match |  |
| SD-H06 | sk-doc | match | route | routing-parity-match |  |
| SD-H03 | sk-doc | match | route | routing-parity-match |  |
| SD-H01 | sk-doc | match | route | routing-parity-match |  |
| SD-011 | sk-doc | match | route | routing-parity-match |  |
| SD-012 | sk-doc | match | route | routing-parity-match |  |
| SD-010 | sk-doc | match | route | routing-parity-match |  |
| SD-CR-001 | sk-doc | match | route | routing-parity-match |  |
| SD-018 | sk-doc | match | route | routing-parity-match |  |
| SD-020 | sk-doc | match | route | routing-parity-match |  |

## Funnel

- passed: 32

## Ranked bottlenecks

_None._

## Scenarios

| Scenario | Class | Stage | Score | First failing stage |
| -------- | ----- | ----- | ----- | ------------------- |
| SD-007 | routing | routing | 100/100 | passed |
| SD-009 | routing | routing | 100/100 | passed |
| SD-008 | routing | routing | 84/100 | passed |
| SD-015 | routing | routing | 89/100 | passed |
| SD-014 | routing | routing | 100/100 | passed |
| SD-013 | routing | routing | 100/100 | passed |
| SD-005 | routing | routing | 100/100 | passed |
| SD-006 | routing | routing | 100/100 | passed |
| SD-004 | routing | routing | 100/100 | passed |
| SD-003 | routing | routing | 100/100 | passed |
| SD-001 | routing | routing | 100/100 | passed |
| SD-016 | routing | routing | 100/100 | passed |
| SD-002 | routing | routing | 100/100 | passed |
| SD-H04 | routing | holdout | 100/100 | passed |
| SD-H02 | routing | holdout | 100/100 | passed |
| SD-H05 | routing | holdout | 100/100 | passed |
| SD-H09 | routing | holdout | 100/100 | passed |
| SD-H07 | routing | holdout | 100/100 | passed |
| SD-H13 | routing | holdout | 100/100 | passed |
| SD-H10 | routing | holdout | 100/100 | passed |
| SD-H12 | routing | holdout | 100/100 | passed |
| SD-H11 | routing | holdout | 100/100 | passed |
| SD-H08 | routing | holdout | 100/100 | passed |
| SD-H06 | routing | holdout | 100/100 | passed |
| SD-H03 | routing | holdout | 100/100 | passed |
| SD-H01 | routing | holdout | 100/100 | passed |
| SD-011 | routing | routing | 100/100 | passed |
| SD-012 | routing | routing | 94/100 | passed |
| SD-010 | routing | routing | 100/100 | passed |
| SD-CR-001 | routing | routing | 100/100 | passed |
| SD-018 | routing | routing | 100/100 | passed |
| SD-020 | routing | routing | 100/100 | passed |

## Contamination findings (router mode — drift, not failures)

_Playbook prompts intentionally carry trigger words; these are reported as drift signals, not scenario failures._
- SD-007: flowchart, doc quality
- SD-009: feature catalog, playbook system
- SD-015: sk-doc, assets, references
- SD-014: skill.md scaffold, create sk-, skill.md, skill
- SD-013: hvr
- SD-005: flowchart
- SD-006: readme
- SD-004: hvr
- SD-003: agent and paired, paired /create
- SD-001: sk-doc, validate, skill
- SD-016: optimize, skill.md, skill
- SD-002: sk-skill, skill.md, skill
- SD-H04: release notes
- SD-H02: review, skill
- SD-H05: text diagram, decision branch
- SD-H09: since the last version
- SD-H07: changelog, quality bar, flag, skill
- SD-H13: capabilities
- SD-H10: text characters
- SD-H12: getting our project running, running from scratch
- SD-H11: setup guide, model's budget, trim
- SD-H08: front-page overview
- SD-H06: reusable helper, starter reference docs, release notes
- SD-H03: front-page overview
- SD-H01: reusable capability
- SD-011: sk-doc, sk-skill, skill.md, skill, references, assets
- SD-012: sk-doc, create sk-, changelog, validation rules, validation
- SD-010: changelog
- SD-CR-001: sk-skill, skill.md, skill
- SD-018: sk-doc, changelog, skill
- SD-020: sk-doc, changelog, skill

## Methodology / caveats

- Mode A is the deterministic CI gate; D1-inter (advisor) + D4 (ablation) need live mode. Advisory signals: mode precision unscored; relative ranking unscored (no advisor probe or no rank-below gold); route gold rows 0; telemetry missing n/a (0/0); route misses n/a (0/0); alias misses n/a (0/0); bundle misses n/a (0/0); recipe misses n/a (0/0).
- Scenario count: 32.
