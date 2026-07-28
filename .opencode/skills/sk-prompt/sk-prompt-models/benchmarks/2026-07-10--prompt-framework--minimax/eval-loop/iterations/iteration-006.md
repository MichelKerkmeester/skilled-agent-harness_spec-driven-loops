# Iteration 6

**Variant**: v-mut-f30510bd5b57d861  (parent: v-004-tidd-ec)
**Score**: 0.725
**Mutation axis**: preplanning_density  (medium → sparse)

## Fixture results

| Fixture | Weighted | D1 | D2 | D3 | D4 | D5 | hard_gate |
|---------|----------|----|----|----|----|----|-----------|
| fix-001-hallucinated-cli-flag | 0.8925 | 1 | 1 | 1 | 0.95 | 0 | - |
| fix-002-wrong-cwd-paths | 0.9 | 1 | 1 | 0.7 | 1 | 0.6 | - |
| fix-003-bundle-gate-smoke-run | 0.47 | 0 | 0.6 | 0.7 | 1 | 0 | YES |
| fix-004-multi-file-scope-boundary | 0.7775 | 0.75 | 1 | 0.7 | 1 | 0 | - |
| fix-005-acceptance-strict | 0.53 | 0 | 0.6 | 0.7 | 1 | 0.6 | YES |
| fix-006-adversarial-path-traversal | 0.565 | 1 | 0.6 | 0 | 0.9 | 0 | - |
| fix-007-baseline-pure-function | 0.94 | 1 | 1 | 0.7 | 1 | 1 | - |

## Convergence signals
- plateau: 0.37200000000000033 (plateau_partial)
- exhaustion: 0 (partial)
- mad: 0 (partial)
- stopScore: 0.1488
- shouldStop: false

**Final-line variant score**: 0.725
