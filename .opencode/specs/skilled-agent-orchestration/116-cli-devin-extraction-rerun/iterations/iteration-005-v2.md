# Iteration 5

**Variant**: v-005-build-strict-bundle-gate  (parent: v-004-rcaf-medium)
**Score**: 0.561
**Mutation axis**: n/a  ( → )

## Fixture results

| Fixture | Weighted | D1 | D2 | D3 | D4 | D5 | hard_gate |
|---------|----------|----|----|----|----|----|-----------|
| fix-001-hallucinated-cli-flag | 0.7567 | 0.6666666666666666 | 1 | 0.7 | 1 | 0 | - |
| fix-002-wrong-cwd-paths | 0.47 | 0 | 0.6 | 0.7 | 1 | 0 | YES |
| fix-003-bundle-gate-smoke-run | 0.47 | 0 | 0.6 | 0.7 | 1 | 0 | YES |
| fix-004-multi-file-scope-boundary | 0.8375 | 0.75 | 1 | 1 | 1 | 0 | - |
| fix-005-acceptance-strict | 0.4325 | 0 | 0.6 | 0.7 | 0.75 | 0 | YES |
| fix-006-adversarial-path-traversal | 0.49 | 1 | 0.3 | 0 | 1 | 0 | - |
| fix-007-baseline-pure-function | 0.47 | 0 | 0.6 | 0.7 | 1 | 0 | - |

## Convergence signals
- plateau: 0.2330000000000001 (plateau_partial)
- exhaustion: 0 (partial)
- mad: 0.14199999999999902 (partial)
- stopScore: 0.1287
- shouldStop: false

**Final-line variant score**: 0.561
