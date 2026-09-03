# Deep Research Dashboard — evilcharts reference research (deepseek-flash-max)

Lineage `deepseek-flash-max` · session `fanout-deepseek-flash-max-1788412334414-fbd7s9` · status: complete (max-iterations, 5/5)

## Iteration Table

| run | focus | newInfoRatio | findings | status |
|-----|-------|--------------|----------|--------|
| 1 | Component architecture: container, tooltip, legend, dot, brush, background vs corpus | 0.90 | 8 | complete |
| 2 | Catalog of forms: 8 types x2 + 22 blocks vs 20 corpus templates | 0.80 | 8 | complete |
| 3 | Styling and theming: radius, typography, dark mode, chromatic default, system assignments | 0.85 | 8 | complete |
| 4 | Beauty specifics: stroke weights, grid, area fade, gradient strokes, reveal, dim, empty state | 0.75 | 9 | complete |
| 5 | Registry/CLI install + NEVER-clause re-verdict | 0.70 | 6 | complete |

## Question Status

- Q1 Component architecture — **answered** (iteration 1)
- Q2 Catalog of forms — **answered** (iteration 2)
- Q3 Styling and theming — **answered** (iteration 3)
- Q4 Beauty specifics — **answered** (iteration 4)
- Q5 Registry and CLI install — **answered** (iteration 5)
- Answered: 5/5

## Convergence Trend

Stop policy: `max-iterations` (convergence disabled). newInfoRatio trend: 0.90 → 0.80 → 0.85 → 0.75 → 0.70 (average 0.80). Declining across a fixed 856-file corpus as expected; iteration 5 still produced the NEVER-clause re-verdict (a verdict-changing find), so the tail was not empty.

## Dead Ends (ruled out)

- Interactive range brush — static read artifact; stateful figure breaks two-screenshots-agree (iter 1)
- Loading skeleton state — no async phase in a static file; random data fails rule 12 (iter 1)
- Pie/donut — catalog's documented unit-ring/unit-grid substitution (iter 2)
- Radar — parallel-axes already answers the question (iter 2)
- Sankey — contract excludes layout-engine forms (iter 2)
- Glow filter / endless animated dash — watch-me effects; infinite animation breaks rule 12's purpose (iter 4)
- Strip SVG focus / disable selection — document, not dashboard (iter 3)
- Geist/JetBrains fonts — web fonts banned; system mono stack adopted instead (iter 3)
- Code-copy under MIT — blocked by SKILL.md:134 NEVER clause (iter 5)

## Blocked Stops

None (stop policy max-iterations; no quality-guard stops triggered).

## Graph Convergence

Not tracked (convergence disabled for this fan-out lineage).

## Next Focus

Synthesis complete — `research.md` holds the ranked list (16 adoptions across four tiers + 10 rejections with reasons), the convergence report, and the answers to both spec open questions.
