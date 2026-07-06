# Iteration 12: Round D Adversarial Verification — Code Graph Inferred Candidates

## Focus
Round D adversarial verification (default-to-refute) of 3 [INFERRED] Code Graph candidates against live code. Read-only.

## Verdicts (newInfoRatio 0.60)
| Candidate | Verdict | Evidence |
|---|---|---|
| CG-mv-register-contested | **REFUTED** | cross-file-edge-resolver.ts:114-118 — on `candidates.length>1` it `ambiguousSkipped++` and leaves UNRESOLVED; it does NOT silently pick-one. Premise false. |
| CG-monotonic-dedup-latch | **REFUTED** | structural-indexer.ts:1894-1919 is NODE dedup by symbolId + referential-integrity edge drop; no dedup site (incl. code-graph-db.ts:976-1018) ever compares weight/confidence. "Drops rather than keeps higher" misattributed. |
| CG-convergence-property-test | **REAL** | cross-file-edges.vitest.ts:180 is same-order idempotency only; the stress README references `deep-loop-graph-convergence-stress.vitest.ts` which DOES NOT EXIST (find confirms). No test varies scan/parallel order. Genuine gap. |

## Synthesis
2 of 3 REFUTED — the resolver is conservatively correct (skips ambiguous, doesn't pick-one) and there is no confidence-downgrade-on-dedup defect. The one survivor is the **order-invariance property test gap** (and the planned stress file is absent) — which corroborates D6's finding that the CRDT/order-independence work needs a conservation test it doesn't have. The CRDT-merge candidate (CG-crdt-order-independent-merge) stands on the reindex order-sensitivity (confirmed in iter-8), not on a resolver pick-one defect.

## Next Focus
The CRDT cluster's justification narrows to reindex order-sensitivity + the missing property test (REAL), NOT resolver/dedup defects (REFUTED). Sharpens the Round-C sequencing.
