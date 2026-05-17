# Synthesis v2 — cli-devin SWE 1.6 re-run with file extraction + live grader

**Generated**: 2026-05-17T07:30:25.853Z
**Iterations completed**: 5
**Files extracted**: 17 across 35 fixture-result rows
**Blocks skipped (no path inferred)**: 52
**Final verdict**: ranking stable: v-004-rcaf-medium still wins

## v1 vs v2 ranking comparison

| Rank | v1 (text-only, mocked grader) | v2 (extraction + live grader) | Score delta |
|------|-------------------------------|-------------------------------|-------------|
| 1 | v-004-rcaf-medium (0.5796) | v-004-rcaf-medium (0.5664) | -0.0132 |
| 2 | v-003-anti-hallucination-strong (0.4961) | v-005-build-strict-bundle-gate (0.5610) | 0.0649 |
| 3 | v-005-build-strict-bundle-gate (0.4846) | v-001-baseline-star (0.5235) | 0.0389 |
| 4 | — | v-003-anti-hallucination-strong (0.5164) | — |
| 5 | — | v-002-build-dense-preplan (0.4468) | — |

## v2 detailed rankings

| Variant | Best score | Avg score | Sample count |
|---------|------------|-----------|--------------|
| v-004-rcaf-medium | 0.5664 | 0.5664 | 1 |
| v-005-build-strict-bundle-gate | 0.5610 | 0.5610 | 1 |
| v-001-baseline-star | 0.5235 | 0.5235 | 1 |
| v-003-anti-hallucination-strong | 0.5164 | 0.5164 | 1 |
| v-002-build-dense-preplan | 0.4468 | 0.4468 | 1 |

## Interaction-term diagnostics (v2)

- **D2×D1 decoupling rate**: 0.0%
- **D4×D1 inverse rate**: 57.1% (v1 was 59.5% — extraction should reduce this)
- **D5×D1 inverse rate**: 14.3%

## Verdict for cli-devin v1.0.6.0

**Ranking stable** — v-004-rcaf-medium wins under both text-only (v1) and full-D1 (v2) scoring regimes. The 114/004 RCAF default is confirmed. **No v1.0.6.0 uplift needed.**

