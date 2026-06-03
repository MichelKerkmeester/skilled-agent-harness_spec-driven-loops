# Iteration 1

**Variant**: v-001-baseline-star  (parent: baseline)
**Score**: 0.5031
**Mutation axis**: n/a  ( → )

## Fixture results

| Fixture | Weighted | D1 | D2 | D3 | D4 | D5 | hard_gate |
|---------|----------|----|----|----|----|----|-----------|
| fix-001-hallucinated-cli-flag | 0.5 | 0 | 0.6 | 0.7 | 1 | 0.3 | YES |
| fix-002-wrong-cwd-paths | 0.6367 | 0.6666666666666666 | 0.6 | 0.7 | 1 | 0 | - |
| fix-003-bundle-gate-smoke-run | 0.53 | 0 | 0.6 | 1 | 1 | 0 | YES |
| fix-004-multi-file-scope-boundary | 0.5475 | 0.75 | 1 | 0 | 0.4 | 0 | - |
| fix-005-acceptance-strict | 0.47 | 0 | 0.6 | 0.7 | 1 | 0 | YES |
| fix-006-adversarial-path-traversal | 0.3075 | 0 | 0.6 | 0 | 0.85 | 0 | YES |
| fix-007-baseline-pure-function | 0.53 | 0 | 0.6 | 1 | 1 | 0 | - |

## Convergence signals
- plateau: 0 (insufficient_iters)
- exhaustion: 0 (insufficient_iters)
- mad: 0 (insufficient_iters)
- stopScore: 0
- shouldStop: false

**Final-line variant score**: 0.5031
