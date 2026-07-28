# Iteration 5

**Variant**: v-005-build-strict-bundle-gate  (parent: v-004-rcaf-medium)
**Score**: 0.4139
**Mutation axis**: n/a  ( → )

## Fixture results

| Fixture | Weighted | D1 | D2 | D3 | D4 | D5 | hard_gate |
|---------|----------|----|----|----|----|----|-----------|
| fix-001-hallucinated-cli-flag | 0.5075 | 0 | 0.6 | 1 | 0.85 | 0 | YES |
| fix-002-wrong-cwd-paths | 0 | ? | ? | ? | ? | ? | - |
| fix-003-bundle-gate-smoke-run | 0.47 | 0 | 0.6 | 0.7 | 1 | 0 | YES |
| fix-004-multi-file-scope-boundary | 0.4875 | 0.75 | 1 | 0 | 0 | 0 | - |
| fix-005-acceptance-strict | 0.47 | 0 | 0.6 | 0.7 | 1 | 0 | YES |
| fix-006-adversarial-path-traversal | 0.44 | 0 | 0.6 | 1 | 0.4 | 0 | YES |
| fix-007-baseline-pure-function | 0.5225 | 0 | 0.6 | 1 | 0.95 | 0 | - |

## Convergence signals
- plateau: 0 (plateau_partial)
- exhaustion: 0 (partial)
- mad: 0 (partial)
- stopScore: 0
- shouldStop: false

**Final-line variant score**: 0.4139
