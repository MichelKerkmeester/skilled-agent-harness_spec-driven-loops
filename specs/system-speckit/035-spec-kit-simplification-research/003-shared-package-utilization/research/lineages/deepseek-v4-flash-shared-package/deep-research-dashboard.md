# Deep Research Dashboard — deepseek-v4-flash-shared-package

> Reducer-owned lifecycle view. Final state.

## Lifecycle

| Field | Value |
|-------|-------|
| Lineage | `deepseek-v4-flash-shared-package` |
| Session | `fanout-deepseek-v4-flash-shared-package-1788760496905-1nuwxt` |
| Executor | cli-pi / deepseek-v4-flash-vision-exp (inline, no nested dispatch) |
| Loop | research — round two, post-009 remediation verification |
| Phase | complete (synthesis done) |
| Iterations | 10 / 10 |
| Stop policy | max-iterations — **stopReason: maxIterationsReached** |

## Convergence Summary

| Signal | Value | Vote |
|--------|-------|------|
| Rolling avg (last 3) | 0.57 | below configured 3.0 threshold |
| MAD noise floor | — | telemetry only |
| Question entropy | 9/9 (1.0) | telemetry only |
| Composite | — | — |

*Stop policy is max-iterations; convergence signals were telemetry only; no early synthesis; angle-broadening was preferred to early stop.*

## Findings Ledger (cumulative)

| Iteration | Focus | New findings | newInfoRatio | Status |
|-----------|-------|--------------|---------------|--------|
| 1 | Residue verification (imports, exports, fixtures, docs) | 6 | 1.0 | complete |
| 2 | L2 verification: telemetry chain + survivor derivations | 6 | 0.9 | complete |
| 3 | L3/L9 verification: spelling, dtype, error class, README table | 5 | 0.7 | complete |
| 4 | L8/L7 verification: parity test sites, isolation enforcement | 5 | 0.8 | complete |
| 5 | Job2 A: embeddings live termination | 5 | 0.85 | complete |
| 6 | Job2 B: root resolvers, derivations, layout assumptions | 5 | 0.8 | complete |
| 7 | Job2 C: kept-modules census with tiering | 6 | 0.75 | complete |
| 8 | Job2 D: coverage per module + test lane | 5 | 0.65 | complete |
| 9 | Job2 E + job 3: types crossing, kept-row re-exam | 5 | 0.55 | complete |
| 10 | Final reconciliation: L-row disposition + backlog | 3 | 0.5 | complete |

**Totals: 49 findings (7 P1 / 42 P2 / 0 P0)**

## Question Ledger

- q-verify-l1 ✓ (code residue clean; main + doc + fixture rows behind)
- q-verify-l2 ✓ (readers fixed; derivations survive — R2-01, R2-03)
- q-verify-l39 ✓ (L9 fixes landed; README reader columns drift)
- q-verify-l8 ✓ (parity test landed; file-name constant unasserted)
- q-new-embeddings ✓ (adapter path live; parallel implementations)
- q-new-roots ✓ (8 resolvers; 3 divergent predicates)
- q-new-docs ✓ (env doc row + fixture row; README correct otherwise)
- q-new-coverage ✓ (inventory complete; jsonc-strip + context-types uncovered)
- q-kept ✓ (all four recorded decisions stand; no new evidence)
