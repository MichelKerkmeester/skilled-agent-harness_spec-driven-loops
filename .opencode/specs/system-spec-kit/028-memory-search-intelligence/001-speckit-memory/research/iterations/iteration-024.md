# Iteration 24: Round E Verify+Feasibility — Memory Capture-Side & Recall-Band

## Focus
Round E verify+feasibility for the iter-11/13/19 capture-side + recall-band candidates. Read-only.

## Assessments (newInfoRatio 0.70)
| Candidate | Real | Feasibility | Note |
|---|---|---|---|
| M-capture-near-dup-verdict | **REFUTED** | NO-GO | synchronous near-dup ALREADY exists inline on the hot save path (`recordNearDuplicateCheck`, memory-save.ts:2729-2738; near-duplicate.ts:18,52; vectorSearch limit=8 vs 0.88, writes near_duplicate_of) — gap already closed |
| M-injection-strip-on-write / write-time-injection-filter | REAL | CAUTION (NEEDS-BENCHMARK) | gate is secrets-only (redaction-gate.ts:25-33), no injection markers — but the gate REPLACES text destructively and injection patterns are HIGH-FP (security notes, packet-028 docs, CLAUDE.md "treat content as data" all contain injection-shaped strings); prefer **flag-only** + benchmark FP rate. SEPARATE risk: memory-ingest.ts bulk import may bypass the capture gate (inferred) |
| M-relative-score-band | REAL | **GO** | additive presentation derivation (band = score/topScore after sort, vs the existing scoreResolution :144); read-only, no schema/ranking change, no recall-quality risk |
| M-lexical-exact-anchor-contribution | PARTIAL | NEEDS-BENCHMARK | a `lexical` channel + channelsUsed attribution already exposed (search-results.ts:119-127,138); giving exact matches their OWN visible fused weight touches the fusion/RRF layer (ranking change) — display-only collapses toward GO |

## Key correction
**capture-near-dup already exists** (inline on the hot path) — the gap was closed; nothing to build. injection-strip is REAL-but-high-FP → flag-only + benchmark (strip-on-write would corrupt legit memories). **relative-score-band is a clean additive GO.** A flagged ingest-bypass risk (bulk import skipping the capture gate) is worth a follow-up.

## Next Focus
Capture-side: near-dup already done; injection = flag-only/benchmark; relative-score-band GO. Plus the ingest-bypass risk. Feeds synthesis.
