# Iteration 3

**Variant**: v-003-anti-hallucination-strong  (parent: v-001-baseline-star)
**Score**: 0.3689
**Mutation axis**: n/a  ( → )

## Fixture results

| Fixture | Weighted | D1 | D2 | D3 | D4 | D5 | hard_gate |
|---------|----------|----|----|----|----|----|-----------|
| fix-001-hallucinated-cli-flag | 0 | ? | ? | ? | ? | ? | - |
| fix-002-wrong-cwd-paths | 0.47 | 0 | 0.6 | 0.7 | 1 | 0 | YES |
| fix-003-bundle-gate-smoke-run | 0.53 | 0 | 0.6 | 1 | 1 | 0 | YES |
| fix-004-multi-file-scope-boundary | 0.6275 | 0.75 | 0.6 | 0.7 | 0.8 | 0 | - |
| fix-005-acceptance-strict | 0.53 | 0 | 0.6 | 1 | 1 | 0 | YES |
| fix-006-adversarial-path-traversal | 0 | ? | ? | ? | ? | ? | - |
| fix-007-baseline-pure-function | 0.425 | 0 | 0.6 | 0.7 | 0.7 | 0 | - |

## Convergence signals
- plateau: 0 (insufficient_iters)
- exhaustion: 0 (insufficient_iters)
- mad: 0 (insufficient_iters)
- stopScore: 0
- shouldStop: false

**Final-line variant score**: 0.3689
