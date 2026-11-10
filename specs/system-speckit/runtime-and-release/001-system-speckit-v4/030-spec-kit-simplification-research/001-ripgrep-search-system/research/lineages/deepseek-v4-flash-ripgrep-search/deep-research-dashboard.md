# Deep Research Dashboard — deepseek-v4-flash-ripgrep-search

Auto-generated from `deep-research-state.jsonl`, `deep-research-strategy.md`, and the per-iteration deltas.

## Iteration Table

| Run | Status | Focus | Findings | newInfoRatio |
|-----|--------|-------|----------|--------------|
| 1 | complete | Remediation verification, doc-side residue (presentation vocabulary, recipe parity, concept-lane removal, README counts) | 4 | 1.0 |
| 2 | complete | Remediation verification, code/data-side residue (committed pair, doctor signal, retrofit imports, exclusion record) | 5 | 0.9 |
| 3 | complete | NEW angle: the index's own content — single-token/numeric/generic/fragment phrase census | 3 | 1.0 |
| 4 | complete | Enforcement-stack gap for phrase quality (judge classes, doctor sampling, generator diagnostics) | 3 | 0.85 |
| 5 | complete | NEW angle: coverage — repo-rules/ trigger_phrases dead to the keyed lane | 2 | 0.9 |
| 6 | complete | Generator static re-verification (constants, README contract, variants sidecar, ignored path) | 4 | 0.55 |
| 7 | complete | Lookup static re-verification + edge behaviors (exit codes, floors, caps, scope) | 4 | 0.5 |
| 8 | complete | Caller/consultation census re-verification (hooks, doctor wiring, generator consumers) | 3 | 0.45 |
| 9 | complete | Round-one kept rows with new evidence only (L1 pins, L9 slot, F6.2 source, shortlist 6) | 4 | 0.45 |
| 10 | complete | Ledger consolidation: severity roll-up, open-question audit, count provenance | 4 | 0.4 |

## Question Status

| Question | Status |
|----------|--------|
| q-verify-doc | answered (iter 1) |
| q-verify-data | answered (iter 2, 6) |
| q-verify-move | answered (iter 2) |
| q-corpus | answered (iter 3) |
| q-enforcement | answered (iter 4) |
| q-coverage | answered (iter 5) |
| q-verify-round1 | answered (iter 7, 8, 9) |
| q-removal | answered (iter 10) |

## Convergence Trend

Descending 1.0 → 0.4 across 10 iterations; stop policy max-iterations (convergence telemetry only per charter); cap reached; stop reason `maxIterationsReached`. See `convergence-report.json`.

## Ledger Summary (this round)

0 P0 · 8 P1 · 12 P2 · 11 verified-positive · 5 re-verified decisions. P1 concentration: two incomplete 006 fixes in the presentation asset (V1, V2) and six new gaps (N1-N5, N7) around phrase-quality enforcement and repo-rules coverage.

## Dead Ends (ruled out)

- Re-list L5 (hook-system column is `Manual fallback`)
- Re-list L9 "remove the slot" (reason still true; nuance only)
- Generator fail-closed to phrase quality (policy call, 826-doc blast radius)
- Digits in multi-token phrases are corruption (documented normalization)
- Determinism re-claim as executed evidence (no-node policy)
