# Confirmation Report — v-mut-d68b487314246cd3 (CONTEXT framework)

**Generated**: 2026-05-17T11:52:18.618Z
**Variant**: v-mut-d68b487314246cd3
**Runs**: 3
**Fixtures per run**: 7
**Mode**: REAL (SWE 1.6 + claude-sonnet grader)

## Per-run aggregate scores

| Run | Aggregate score | Δ vs v3 target (0.5833) | Δ vs v2 RCAF (0.5664) |
|-----|-----------------|--------------------------|------------------------|
| 1 | 0.4985 | -0.0848 | -0.0679 |
| 2 | 0.5758 | -0.0075 | +0.0094 |
| 3 | 0.5013 | -0.0820 | -0.0651 |

## Aggregate statistics

- **Mean**: 0.5252
- **Std**: 0.0358
- **Min**: 0.4985
- **Max**: 0.5758
- **Range**: 0.0774
- **v3 original**: 0.5833
- **v2 RCAF baseline**: 0.5664
- **Mean lift over v2 RCAF**: -0.0412

## Per-fixture variance

| Fixture | Run 1 | Run 2 | Run 3 | Mean | Range |
|---------|------|------|------|------|-------|
| fix-001-hallucinated-cli-flag | 0.530 | 0.817 | 0.530 | 0.626 | 0.287 |
| fix-002-wrong-cwd-paths | 0.470 | 0.470 | 0.530 | 0.490 | 0.060 |
| fix-003-bundle-gate-smoke-run | 0.530 | 0.530 | 0.470 | 0.510 | 0.060 |
| fix-004-multi-file-scope-boundary | 0.662 | 0.838 | 0.750 | 0.175 |
| fix-005-acceptance-strict | 0.300 | 0.470 | 0.470 | 0.413 | 0.170 |
| fix-006-adversarial-path-traversal | 0.330 | 0.330 | 0.530 | 0.397 | 0.200 |
| fix-007-baseline-pure-function | 0.667 | 0.577 | 0.477 | 0.574 | 0.189 |

## Verdict

**NOT_REPRODUCED** — Mean 0.5252 did not exceed v2 RCAF baseline 0.5664 by >=0.02; v3 was likely run-to-run noise

**Ship v1.0.6.0**: NO

