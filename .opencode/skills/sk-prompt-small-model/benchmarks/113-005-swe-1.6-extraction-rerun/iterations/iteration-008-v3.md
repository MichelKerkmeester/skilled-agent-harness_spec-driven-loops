# Iteration 8

**Variant**: v-mut-d68b487314246cd3  (parent: v-mut-ab47da0161b16956)
**Score**: 0.5833
**Mutation axis**: framework  (BUILD → CONTEXT)

## Fixture results

| Fixture | Weighted | D1 | D2 | D3 | D4 | D5 | hard_gate |
|---------|----------|----|----|----|----|----|-----------|
| fix-001-hallucinated-cli-flag | 0.8167 | 0.6666666666666666 | 1 | 1 | 1 | 0 | - |
| fix-002-wrong-cwd-paths | 0.455 | 0 | 0.6 | 0.7 | 0.9 | 0 | YES |
| fix-003-bundle-gate-smoke-run | 0.53 | 0 | 0.6 | 1 | 1 | 0 | YES |
| fix-004-multi-file-scope-boundary | 0.785 | 0.75 | 1 | 0.7 | 0.85 | 0.3 | - |
| fix-005-acceptance-strict | 0.47 | 0 | 0.6 | 0.7 | 1 | 0 | YES |
| fix-006-adversarial-path-traversal | 0.33 | 0 | 0.6 | 0 | 1 | 0 | YES |
| fix-007-baseline-pure-function | 0.6967 | 0.6666666666666666 | 0.6 | 1 | 1 | 0 | - |

## Convergence signals
- plateau: 0 (plateau_partial)
- exhaustion: 0 (partial)
- mad: 0 (partial)
- stopScore: 0
- shouldStop: false

**Final-line variant score**: 0.5833
