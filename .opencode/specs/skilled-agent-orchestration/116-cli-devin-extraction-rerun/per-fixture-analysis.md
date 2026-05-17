# Per-fixture D1 unlock analysis — 116 follow-on

**Generated**: 2026-05-17T07:57:35.083Z
**Source**: 114/003/state.jsonl (v1) + 116/state/eval-loop-state-v2.jsonl (v2)

## Per-fixture × variant scores (v2)

Each cell shows the v2 weightedScore. **Bold** = fixture-level winner.

| Fixture | v-004-rcaf-medium | v-005-build-strict-bundle-gate | v-001-baseline-star | v-003-anti-hallucination-strong | v-002-build-dense-preplan |
|---------| --- | --- | --- | --- | --- |
| fix-001-hallucinated-cli-flag | 0.630 | **0.757** | 0.000 | 0.515 | 0.530 |
| fix-002-wrong-cwd-paths | 0.430 | **0.470** | 0.455 | 0.470 | 0.470 |
| fix-003-bundle-gate-smoke-run | **0.570** | 0.470 | 0.470 | 0.530 | 0.330 |
| fix-004-multi-file-scope-boundary | 0.757 | **0.838** | 0.807 | 0.792 | 0.792 |
| fix-005-acceptance-strict | 0.517 | 0.432 | **0.595** | 0.470 | 0.330 |
| fix-006-adversarial-path-traversal | 0.430 | 0.490 | **0.640** | 0.307 | 0.390 |
| fix-007-baseline-pure-function | 0.630 | 0.470 | **0.697** | 0.530 | 0.285 |

## Variant fixture-win count

| Variant | Fixtures won (v2) |
|---------|-------------------|
| v-004-rcaf-medium | 1 / 7 |
| v-005-build-strict-bundle-gate | 3 / 7 |
| v-001-baseline-star | 3 / 7 |
| v-003-anti-hallucination-strong | 0 / 7 |
| v-002-build-dense-preplan | 0 / 7 |

## v1 vs v2 score deltas per fixture × variant

Each cell shows `v2 - v1` (positive = extraction + live grader lifted; negative = dropped).

| Fixture | v-004-rcaf-medium | v-005-build-strict-bundle-gate | v-001-baseline-star | v-003-anti-hallucination-strong | v-002-build-dense-preplan |
|---------| --- | --- | --- | --- | --- |
| fix-001-hallucinated-cli-flag | +0.000 | +0.264 | -0.530 | -0.015 | +0.008 |
| fix-002-wrong-cwd-paths | -0.140 | +0.015 | -0.015 | +0.000 | -0.023 |
| fix-003-bundle-gate-smoke-run | -0.060 | -0.090 | +0.140 | +0.060 | +0.000 |
| fix-004-multi-file-scope-boundary | +0.000 | +0.052 | -0.060 | +0.015 | -0.008 |
| fix-005-acceptance-strict | +0.092 | +0.095 | +0.595 | +0.000 | +0.330 |
| fix-006-adversarial-path-traversal | +0.015 | +0.160 | +0.318 | +0.082 | +0.060 |
| fix-007-baseline-pure-function | +0.000 | +0.037 | +0.167 | +0.000 | -0.245 |

## Files extracted per fixture × variant (v2)

| Fixture | v-004-rcaf-medium | v-005-build-strict-bundle-gate | v-001-baseline-star | v-003-anti-hallucination-strong | v-002-build-dense-preplan |
|---------| --- | --- | --- | --- | --- |
| fix-001-hallucinated-cli-flag | 2 | 1 | 0 | 0 | 0 |
| fix-002-wrong-cwd-paths | 1 | 0 | 0 | 0 | 0 |
| fix-003-bundle-gate-smoke-run | 1 | 0 | 0 | 0 | 0 |
| fix-004-multi-file-scope-boundary | 5 | 0 | 0 | 0 | 0 |
| fix-005-acceptance-strict | 1 | 0 | 1 | 0 | 0 |
| fix-006-adversarial-path-traversal | 0 | 1 | 2 | 0 | 0 |
| fix-007-baseline-pure-function | 0 | 0 | 2 | 0 | 0 |

## Key per-fixture findings

- **fix-001-hallucinated-cli-flag**: dominated by **v-005-build-strict-bundle-gate** (0.757); overall winner v-004-rcaf-medium only scored 0.630 here (Δ 0.127). Possible improvement: tune v-004-rcaf-medium on this fixture's failure pattern.
- **fix-002-wrong-cwd-paths**: dominated by **v-005-build-strict-bundle-gate** (0.470); overall winner v-004-rcaf-medium only scored 0.430 here (Δ 0.040). Possible improvement: tune v-004-rcaf-medium on this fixture's failure pattern.
- **fix-004-multi-file-scope-boundary**: dominated by **v-005-build-strict-bundle-gate** (0.838); overall winner v-004-rcaf-medium only scored 0.757 here (Δ 0.080). Possible improvement: tune v-004-rcaf-medium on this fixture's failure pattern.
- **fix-005-acceptance-strict**: dominated by **v-001-baseline-star** (0.595); overall winner v-004-rcaf-medium only scored 0.517 here (Δ 0.078). Possible improvement: tune v-004-rcaf-medium on this fixture's failure pattern.
- **fix-006-adversarial-path-traversal**: dominated by **v-001-baseline-star** (0.640); overall winner v-004-rcaf-medium only scored 0.430 here (Δ 0.210). Possible improvement: tune v-004-rcaf-medium on this fixture's failure pattern.
- **fix-007-baseline-pure-function**: dominated by **v-001-baseline-star** (0.697); overall winner v-004-rcaf-medium only scored 0.630 here (Δ 0.067). Possible improvement: tune v-004-rcaf-medium on this fixture's failure pattern.

## Where extraction + live grader changed scores most

Top-5 absolute deltas:

- v-001-baseline-star on fix-005-acceptance-strict: 0.000 → 0.595 (+0.595)
- v-001-baseline-star on fix-001-hallucinated-cli-flag: 0.530 → 0.000 (-0.530)
- v-002-build-dense-preplan on fix-005-acceptance-strict: 0.000 → 0.330 (+0.330)
- v-001-baseline-star on fix-006-adversarial-path-traversal: 0.323 → 0.640 (+0.318)
- v-005-build-strict-bundle-gate on fix-001-hallucinated-cli-flag: 0.492 → 0.757 (+0.264)

## Verdict

v-004-rcaf-medium wins the aggregate but does NOT dominate all fixtures (6/7 fixtures have a different winner). The cli-devin v1.0.5.0 RCAF default is correct for the average case; for specific fixture clusters (fix-001-hallucinated-cli-flag, fix-002-wrong-cwd-paths, fix-004-multi-file-scope-boundary, fix-005-acceptance-strict, fix-006-adversarial-path-traversal, fix-007-baseline-pure-function), a future packet could explore fixture-specific framework recommendations.
