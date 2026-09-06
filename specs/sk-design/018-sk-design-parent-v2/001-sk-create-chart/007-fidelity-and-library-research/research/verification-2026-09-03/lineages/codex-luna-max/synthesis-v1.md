# Synthesis v1 — codex-luna-max

**Completed:** 2026-09-03  
**Iterations:** 10/10 (`max-iterations`)  
**Baseline citations:** 43  
**Corpus:** commit `756a7fcd4c`

## Verdicts

| VERIFIED | CORRECTED | UNVERIFIABLE |
|---:|---:|---:|
| 31 | 10 | 2 |

The complete URL-by-URL ledger, evidence, corrections, and file:line corpus audit are in `research.md` in this same lineage directory.

## Highest-impact corrections

1. ECharts tooltip support is not evidence of a global default-on tooltip; ECharts resize requires an explicit host `resize` call, and Observable Plot pointer/tip behavior requires runtime rerendering.
2. SVG `<title>` support should not be described as a universal focus-tooltip guarantee; retain accessible descriptions plus visible/table fallbacks.
3. Vega-Lite v1/v4 URLs are version-scoped; use the matching option terminology (`labelLimit` in current docs) and canonical current URLs.
4. Use `aria.show`/`aria.decal.show` with the ECharts ARIA component; the handbook’s `aria.enabled` text is inconsistent.
5. Plotly axes pages do not establish hover defaults; cite dedicated hover documentation for those claims.
6. ColorArchive and Figviz are secondary practical sources; prefer Okabe–Ito and Paul Tol for authoritative palette guidance.

## Shipped checklist

Closed: T1, T2, T3, T4, T6, T7, C2, C3.  
Partial: T5, T8, T9, C1.  
Open/deferred: T10.

Key evidence: the eight T1 helper/call pairs are in the detached-key templates (`assets/templates/{box-plot,calendar-grid,candlestick,heat-matrix,parallel-axes,scatter,treemap,waterfall}.html` at the lines listed in `research.md`); the narrow guard is present in all 20 templates; `scripts/check-corpus.cjs:476-485` confirms that C1 is stylesheet-only; `assets/color-system.html:154-168` defers pattern fills.

## Contract decision

No upstream capability changes the no-build, no-package-manager, no-remote-dependency, single-self-contained-HTML contract. Runtime tooltips, pointer transforms, generated guides, resize observers, and coarse-pointer handling remain out of scope for the shipped static templates.

