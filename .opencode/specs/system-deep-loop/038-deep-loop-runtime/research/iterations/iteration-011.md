# Iteration 11: Round D Adversarial Verification — Deep Loop Inferred Candidates

## Focus
Round D adversarial verification (default-to-refute) of 3 [INFERRED] Deep Loop candidates against live code. Read-only.

## Verdicts (newInfoRatio 0.30)
| Candidate | Verdict | Evidence |
|---|---|---|
| DL-recover-vs-fresh-gate | **REFUTED** | reduce-state.cjs:434/795 `String(config.status \|\| 'initialized')` is a READ-ONLY reducer rendering a dashboard; the `\|\| 'initialized'` is a cosmetic display default, NOT a recover-vs-fresh init gate (no status write, no init/recover/resume fn here). Misattributed. |
| DL-arrival-order-property-test | **REAL** | fanout-merge.cjs:335 `readdirSync(...).filter` has NO `.sort()`, feeding :125-132 first-write-wins; same-id divergent payloads + `_lineages` ordering are order-sensitive; no order-invariance test. Blast confined (membership/counts/severity rollup :221 are order-invariant). |
| DL-preserve-before-trim | **REFUTED** | No `max_tokens/overflow/trimContext` path exists in deep-loop (only "truncate" hit is JSONL tail repair); the working set is EXTERNALIZED to JSONL registries re-read per iteration/merge (fanout-merge.cjs:351-365) — externalization IS the preserve mechanism. Premise of an in-context trim is absent. |

## Synthesis
1 REAL, 2 REFUTED. The deep-loop architecture is already more robust than the galadriel-derived candidates assumed: state is externalized to JSONL (no in-context working-set to lose), and the reducer is a read-only renderer (the "fresh-init gate" was a misread). The genuine survivor — **DL-arrival-order-property-test** — corroborates D1 (Code Graph) and D6: the deep-loop determinism work needs a conservation/order-invariance test, and the **order-independent-merge-tiebreak (Round C GO)** is the real fix that test would protect. Refutes the recover/preserve candidates.

## Next Focus
Deep-loop determinism narrows to: order-independent-merge-tiebreak (Round C GO) + the arrival-order property test (REAL). The recover-vs-fresh + preserve-before-trim galadriel candidates refuted (externalized-state architecture already handles them).
