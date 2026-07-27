# Synthesis v3 — cli-devin SWE 1.6 mutation-depth re-run

**Generated**: 2026-05-17T10:10:13.976Z
**v3 iterations**: 8/8 (max-iters=8)
**v3 winner**: v-mut-d68b487314246cd3 (0.5833)
**v3-vs-v2 delta**: +0.0169
**Variants in v3 beating v2 winner**: 2

## Three-run side-by-side

| Rank | v1 (text-only, mock grader) | v2 (extraction + live grader) | v3 (mutation + extraction + live grader) |
|------|-------------------------------|-------------------------------|------------------------------------------|
| 1 | v-004-rcaf-medium (0.5796) | v-004-rcaf-medium (0.5664) | v-mut-d68b487314246cd3 (0.5833) |
| 2 | v-003-anti-hallucination-strong (0.4961) | v-005-build-strict-bundle-gate (0.5610) | v-mut-ab47da0161b16956 (0.5775) |
| 3 | v-005-build-strict-bundle-gate (0.4846) | v-001-baseline-star (0.5235) | v-004-rcaf-medium (0.5582) |
| 4 | — | v-003-anti-hallucination-strong (0.5164) | v-001-baseline-star (0.5031) |
| 5 | — | v-002-build-dense-preplan (0.4468) | v-mut-9c2ee996304d4de0 (0.4854) |
| 6 | — | — | v-005-build-strict-bundle-gate (0.4139) |
| 7 | — | — | v-002-build-dense-preplan (0.3925) |
| 8 | — | — | v-003-anti-hallucination-strong (0.3689) |

## v3 winner metadata

```json
{
  "id": "v-mut-d68b487314246cd3",
  "framework": "CONTEXT",
  "preplanning_density": "medium",
  "thinking_threshold": "5",
  "bundle_gate_strictness": "standard",
  "anti_hallucination_strength": "standard",
  "source": "mutated",
  "parent_signature": ""
}
```

## What changed from v2 winner

| Axis | v2 winner | v3 winner |
|------|-----------|-----------|
| id | v-004-rcaf-medium | v-mut-d68b487314246cd3 |
| framework | RCAF | CONTEXT |
| source | seeded | mutated |
| parent_signature | — | — |

## Verdict + cli-devin v1.0.6.0 recommendation

v3 result: v-mut-d68b487314246cd3. Delta vs v2: 0.0169. Result inconclusive; treat as no-change.

## Run-to-run variance check (same variants, different runs)

| Variant | v1 score | v2 score | v3 score | range |
|---------|----------|----------|----------|-------|
| v-001-baseline-star | — | 0.5235 | 0.5031 | 0.0204 |
| v-002-build-dense-preplan | — | 0.4468 | 0.3925 | 0.0543 |
| v-003-anti-hallucination-strong | 0.4961 | 0.5164 | 0.3689 | 0.1475 |
| v-004-rcaf-medium | 0.5796 | 0.5664 | 0.5582 | 0.0214 |
| v-005-build-strict-bundle-gate | 0.4846 | 0.5610 | 0.4139 | 0.1471 |

