# Iteration 20: Round D Adversarial Verification — Memory Determinism FIX Candidates

## Focus
Round D adversarial verification (default-to-refute) of 3 [INFERRED] Memory determinism FIX candidates against the actual ranking code. Read-only.

## Verdicts (newInfoRatio 0.55)
| Candidate | Verdict | Evidence |
|---|---|---|
| M-competition-rank-neutrality | **PARTIAL** | RRF is positional `weight*(1/(k+i+1))` (rrf-fusion.ts:310) — no tie-collapse, as observed. BUT the harmful consequence is already mitigated: `sortDeterministicRows` breaks ties by `a.id-b.id` (ranking-contract.ts:53) + stage2 intent sort (:677). No uniform re-rank field feeds RRF. |
| M-decay-defensive-guards | **PARTIAL** | clock-regression guarded (fsrs-scheduler.ts:171/81/167) + inert-half-life guarded (MIN_STABILITY floor :108/118/81). Only a residual NaN-stability gap in calculateRetrievability, mitigated by caller `|| DEFAULT` + Number.isFinite (stage2-fusion.ts:900). "No guards" largely refuted. |
| M-recency-decay-dual-axis | **REFUTED** | recency reads `created_at` (stage2-fusion.ts:1044); FSRS decay reads `last_review` (:897, created_at only as write-back fallback). Distinct primary columns; decay is a stability write-back, not an additive recency-axis score. No double-count. |

## Synthesis
The Memory determinism FIX cluster is **largely already mitigated**: the existing `sortDeterministicRows` (a.id-b.id) already provides deterministic final ordering, and decay already guards clock-regression/inert-half-life. Net residual: a NaN-stability edge guard (small) + the C5-B *content-derived* tiebreak is still a genuine improvement over `a.id` (id-order has insertion bias). This DOWNGRADES the competition-rank/decay-guard candidates from "fixes" to "minor hardening," and refutes the dual-axis double-count concern. Corroborates D6 (Memory's ordering is already content-derived).

## Next Focus
Memory determinism is in better shape than mined — only the C5-B content-tiebreak + a NaN guard survive as worthwhile; the rest is already handled. Re-tag these in synthesis.
