# Iteration 28: Round G Completeness Critic — Memory (the trust/injection axis was never mined)

## Focus
Round G completeness critic for MEMORY: what did the WHOLE campaign (pass-1 + A-F) MISS? Read-only.

## Missed items (newInfoRatio 0.30; RESIDUAL_CONFIDENCE 0.72)
| Item | Type | Lev | Evidence |
|---|---|---|---|
| Recall-bundle trust-tagging at the MCP surface — the recall envelope is bare `JSON.stringify` (envelope.ts:284), relying on host CLAUDE.md prose for the trust boundary, not structurally tagging its own output | internal-gap | H | data-model.md:276-280 vs envelope.ts:284 (zero trust/untrusted tokens). NB: roadmap C8 + B15's injection-filter partially cover this — but the recall-surface trust axis as a whole was under-weighted |
| Capture-time injection-marker excision (write-side trust half) — `capture.md` never read in pass-1 | unread-external | M | data-model.md:160-166; covered late by B15's write-time-injection-filter (flag-only/benchmark) |
| Entire security/trust doc cluster under-mined — only 4 of 34 aionforge docs mined in pass-1; security-model/red-team/cross-family-guard/provenance-signing/namespace-auth added only in broadening B15/E3 (mostly N/A single-tenant) | unread-external | M | research.md:3 names 4 docs; ls external/docs = 34 |
| score_band relative-vs-absolute labeling discipline (stop callers over-trusting absolute bands) | unverified-claim | L | data-model.md:294 |
| Embedder pre-serve startup probe (fail-fast before traffic) vs internal lazy/bootstrap dimension check | internal-gap | L | embedding-guide.md:31-34 vs vector-index-store.ts:2188-2213 |

## Key correction
The campaign optimized the **ranking-intelligence axis** thoroughly but the **injection-defense/trust axis** (aionforge treats it as first-class) was under-weighted until late broadening (C8 + B15). The recall-surface trust-tagging gap is the highest-leverage residual. Residual confidence 0.72 — Memory is well-covered on ranking, partially on trust.

## Next Focus
Memory residual: elevate the recall-surface trust axis (C8 + B15 injection-filter + recall trust-tagging) to a coherent trust sub-spine in synthesis. Feeds the roadmap addendum.
