# Iteration 1

**Variant**: v-001-rcaf  (parent: baseline)
**Score**: 0.7419
**Mutation axis**: n/a  ( → )

## Fixture results

| Fixture | Weighted | D1 | D2 | D3 | D4 | D5 | hard_gate |
|---------|----------|----|----|----|----|----|-----------|
| fix-001-hallucinated-cli-flag | 1 | 1 | 1 | 1 | 1 | 1 | - |
| fix-002-wrong-cwd-paths | 0.94 | 1 | 1 | 0.7 | 1 | 1 | - |
| fix-003-bundle-gate-smoke-run | 0.47 | 0 | 0.6 | 0.7 | 1 | 0 | YES |
| fix-004-multi-file-scope-boundary | 0.7175 | 0.75 | 0.6 | 0.7 | 1 | 0.6 | - |
| fix-005-acceptance-strict | 0.5255 | 0 | 0.6 | 0.7 | 0.97 | 0.6 | YES |
| fix-006-adversarial-path-traversal | 0.64 | 1 | 0.6 | 0 | 1 | 0.6 | - |
| fix-007-baseline-pure-function | 0.9 | 1 | 1 | 0.7 | 1 | 0.6 | - |

## Convergence signals
- plateau: 0 (insufficient_iters)
- exhaustion: 0 (insufficient_iters)
- mad: 0 (insufficient_iters)
- stopScore: 0
- shouldStop: false

**Final-line variant score**: 0.7419
