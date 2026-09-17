# Skill Benchmark Report — mcp-tooling

> Rendered from report.json (do not hand-edit). Scoring: `mode-b-live` · trace mode: `live`.

**Verdict: BLOCKED-BY-ROUTE-GOLD** · aggregate 42/100

## Coverage

- Scored (text executors): **16** · routed out to browser harness: **0**
- By class — routing: 16 · advisor: 0 · browser: 0
- By stage — holdout: 7 · negative (suppression): 0

## Generalization (fitted vs holdout)

- Fitted (9): **42/100** · Holdout (7): **27/100** · Gap: **+15**
- Negatives (suppression): 0
- _holdout excluded from the fitted aggregate; gap = fitted minus holdout_

## Dimension scores

| Dimension | Weight | Score |
| --------- | ------ | ----- |
| D1 inter (advisor) | 12pts | _unscored-mode-a_ |
| D1 intra (router) | 13pts | 38/100 |
| D2 discovery | 20pts | 38/100 |
| D3 efficiency | 15pts | 25/100 |
| D4 usefulness | 25pts | _unscored-mode-a_ |
| D5 connectivity (hard gate) | 15pts | 100/100 |

_Unscored in this run (need live mode): D1inter, D4._

### Advisory signals (NOT in the weighted aggregate)

- **D4 task-outcome** — routine-task usefulness (skill-on vs off), separate from D4 hallucination: _unscored (run --d4 in live mode)_
- **Asset support recall** — deferred `assets/*` gold (router defers these on demand): _deferred (router) or no asset gold_

## Route gold (hard lane)

- Gate: **ENFORCED** (flag `auto`) · rows scored: **16** · matches: **0** · violations: **16** (gold parse failures: 0)
- ⚠ **Route-gold violation(s) fail this run** — a route mismatch cannot remain a PASS while the gate is on.

| Scenario | Intent | Resources | Expected | Observed |
| -------- | ------ | --------- | -------- | -------- |
| MT-004 | ok | MISMATCH | intent: _empty set_<br>resources: _empty set_ | intent: _empty set_<br>resources: mode-registry.json<br>hub-router.json |
| MT-007 | ok | MISMATCH | intent: mcp-aside-devtools<br>resources: mcp-aside-devtools/references/aside-cli-reference.md<br>mcp-aside-devtools/references/mcp-wiring.md | intent: mcp-aside-devtools<br>resources: mcp-aside-devtools/references/aside-cli-reference.md<br>mcp-aside-devtools/references/session-management.md |
| MT-001 | MISMATCH | MISMATCH | intent: mcp-chrome-devtools<br>resources: mcp-chrome-devtools/references/cdp-patterns.md<br>mcp-chrome-devtools/references/session-management.md | intent: mcp-chrome-devtools<br>chrome-devtools-aliases<br>browser-debug<br>resources: mcp-chrome-devtools/SKILL.md<br>mcp-chrome-devtools/references/session-management.md<br>mcp-chrome-devtools/references/troubleshooting.md |
| MT-002 | MISMATCH | MISMATCH | intent: mcp-click-up<br>resources: mcp-click-up/references/cupt-commands.md<br>mcp-click-up/references/mcp-tools.md | intent: mcp-click-up<br>CUPT_DAILY<br>resources: mcp-click-up/SKILL.md<br>mcp-click-up/references/cupt-commands.md |
| MT-003 | ok | MISMATCH | intent: mcp-figma<br>resources: mcp-figma/references/figma-cli-reference.md<br>mcp-figma/references/mcp-wiring.md | intent: mcp-figma<br>resources: references/figma-cli-reference.md<br>references/tool-surface.md |
| MT-H04 | ok | MISMATCH | intent: mcp-aside-devtools<br>resources: mcp-aside-devtools/references/aside-cli-reference.md<br>mcp-aside-devtools/references/mcp-wiring.md | intent: mcp-aside-devtools<br>resources: mcp-aside-devtools/SKILL.md<br>mcp-aside-devtools/references/aside-cli-reference.md<br>mcp-aside-devtools/references/session-management.md<br>mcp-aside-devtools/references/troubleshooting.md |
| MT-H01 | ok | MISMATCH | intent: mcp-chrome-devtools<br>resources: mcp-chrome-devtools/references/cdp-patterns.md<br>mcp-chrome-devtools/references/session-management.md | intent: mcp-chrome-devtools<br>resources: mcp-chrome-devtools/SKILL.md<br>mcp-chrome-devtools/references/troubleshooting.md<br>mcp-chrome-devtools/references/session-management.md |
| MT-H02 | ok | MISMATCH | intent: mcp-figma<br>resources: mcp-figma/references/figma-cli-reference.md<br>mcp-figma/references/mcp-wiring.md | intent: mcp-figma<br>resources: references/figma-cli-reference.md<br>references/tool-surface.md |
| MT-H07 | MISMATCH | MISMATCH | intent: mcp-obsidian<br>resources: mcp-obsidian/references/mcp-tools.md<br>mcp-obsidian/references/obsidian-cli-commands.md | intent: _empty set_<br>resources: mcp-obsidian/SKILL.md<br>mcp-obsidian/references/obsidian-cli-commands.md |
| MT-H06 | ok | MISMATCH | intent: mcp-mobbin<br>resources: mcp-mobbin/references/tool-surface.md<br>mcp-mobbin/references/mcp-wiring.md | intent: mcp-mobbin<br>resources: mcp-mobbin/SKILL.md<br>mcp-mobbin/references/tool-surface.md |
| MT-H03 | ok | MISMATCH | intent: mcp-click-up<br>resources: mcp-click-up/references/cupt-commands.md<br>mcp-click-up/references/mcp-tools.md | intent: mcp-click-up<br>resources: mcp-click-up/SKILL.md |
| MT-H05 | MISMATCH | MISMATCH | intent: mcp-refero<br>resources: mcp-refero/references/tool-surface.md<br>mcp-refero/references/mcp-wiring.md | intent: STYLES<br>SCREENS<br>resources: references/tool-surface.md |
| MT-009 | ok | MISMATCH | intent: mcp-mobbin<br>resources: mcp-mobbin/references/tool-surface.md<br>mcp-mobbin/references/mcp-wiring.md | intent: mcp-mobbin<br>resources: mcp-mobbin/SKILL.md<br>mcp-mobbin/references/tool-surface.md<br>mcp-mobbin/references/mcp-wiring.md<br>mcp-mobbin/feature-catalog/feature-catalog.md<br>mcp-mobbin/examples/platform-flow-research.md |
| MT-010 | MISMATCH | MISMATCH | intent: mcp-obsidian<br>resources: mcp-obsidian/references/mcp-tools.md<br>mcp-obsidian/references/obsidian-cli-commands.md | intent: _empty set_<br>resources: mcp-obsidian/SKILL.md<br>mcp-obsidian/references/obsidian-cli-commands.md |
| MT-008 | MISMATCH | MISMATCH | intent: mcp-refero<br>resources: mcp-refero/references/tool-surface.md<br>mcp-refero/references/mcp-wiring.md | intent: _empty set_<br>resources: references/tool-surface.md |
| MT-CR-001 | MISMATCH | MISMATCH | intent: mcp-refero<br>resources: mcp-refero/references/tool-surface.md<br>mcp-refero/references/mcp-wiring.md | intent: mcp-refero<br>mcp-mobbin<br>resources: mode-registry.json<br>hub-router.json<br>mcp-refero/SKILL.md<br>mcp-mobbin/SKILL.md |

## Funnel

- passed: 10
- routed-intra: 3
- backend-kind-mismatch: 3

**Headline bottleneck: routed-intra**

## Ranked bottlenecks

| Severity | Class | Locus | Finding |
| -------- | ----- | ----- | ------- |
| P1 | funnel_attrition | routed-intra | 3 scenario(s) first fail at stage 'routed-intra' |

## Scenarios

| Scenario | Class | Stage | Score | First failing stage |
| -------- | ----- | ----- | ----- | ------------------- |
| MT-004 | routing | routing | 100/100 | passed |
| MT-007 | routing | routing | 50/100 | passed |
| MT-001 | routing | routing | 45/100 | passed |
| MT-002 | routing | routing | 50/100 | passed |
| MT-003 | routing | routing | 0/100 | routed-intra |
| MT-H04 | routing | holdout | 42/100 | passed |
| MT-H01 | routing | holdout | 45/100 | passed |
| MT-H02 | routing | holdout | 0/100 | backend-kind-mismatch |
| MT-H07 | routing | holdout | 50/100 | passed |
| MT-H06 | routing | holdout | 50/100 | passed |
| MT-H03 | routing | holdout | 0/100 | routed-intra |
| MT-H05 | routing | holdout | 0/100 | backend-kind-mismatch |
| MT-009 | routing | routing | 81/100 | passed |
| MT-010 | routing | routing | 50/100 | passed |
| MT-008 | routing | routing | 0/100 | backend-kind-mismatch |
| MT-CR-001 | routing | routing | 0/100 | routed-intra |

## Methodology / caveats

- Mode A is the deterministic CI gate; D1-inter (advisor) + D4 (ablation) need live mode. Advisory signals: mode precision unscored; relative ranking unscored (no advisor probe or no rank-below gold); route gold rows 0; telemetry missing n/a (0/0); route misses n/a (0/0); alias misses n/a (0/0); bundle misses n/a (0/0); recipe misses n/a (0/0).
- Scenario count: 16.
