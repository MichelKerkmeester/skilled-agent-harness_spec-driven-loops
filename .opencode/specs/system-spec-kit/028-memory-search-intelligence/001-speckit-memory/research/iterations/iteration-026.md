# Iteration 26: Round F Cross-System Verification — The PROMOTE-Off-State Meta-Spine (PARTIAL: 0 of 4 true flips)

## Focus
Round F verification of the roadmap's **#1 meta-finding**: "PROMOTE-the-off-state-flag is the single biggest pattern — highest-leverage wins are existing-but-flag-gated-OFF / structurally-half-built, NOT build-new." Default-to-qualify if flipping the flag isn't actually sufficient. Read-only across all 4 subsystems.

## Verdict: **PARTIAL — 0 of 4 are clean promote-off flips** (newInfoRatio 0.45)
| Subsystem | Claimed off-state asset | Status | Evidence |
|---|---|---|---|
| Memory | `SPECKIT_TEMPORAL_EDGES` flag-gated-OFF | **REFUTED-not-present** | flag is **graduated ON by default** (ENV_REFERENCE.md:296; search-flags.ts:706-707); write-side wired (causal-edges.ts:335-342); the gap is an unbuilt READ-side currentness filter — `getValidEdges()` has NO caller in lib/search\|lib/storage |
| Skill Advisor | shadow pipeline ready to graduate | PARTIAL-build-behind | estimator (read-only proposal) + static shadow registry exist but NO connecting apply seam; guardrails liveWeightsFrozen/autoPromotion:false |
| Code Graph | confidence/evidenceClass need scoring use | PARTIAL-build-behind | plumbed to DISPLAY only (code-graph-context.ts:350-356), min-aggregated, never multiplied into a ranking score |
| Deep Loop | Beta scorer unwired from convergence | PARTIAL-build-behind | bayesian-scorer.ts exported+tested but ZERO production importers (only README); no consumer |

## Net assessment — QUALIFY the meta-finding
The "**NOT build-new**" half HOLDS (the assets genuinely exist — it isn't build-from-scratch). But the "**flip the flag / wire the seam delivers the win**" half is **OPTIMISTIC**: 0 of 4 are clean flips. Three are structurally-half-built where the win needs real integration (estimator→registry apply path; confidence→ranking multiply; scorer→convergence wiring) **plus benefit verification**, not a one-liner. The fourth (temporal-edges) is mis-categorized — its flag is already ON, the value sits in an unbuilt read-side filter. **"Wire the seam" is accurate; "low-effort flip" is not** — effort is moderate integration + verification per asset.

**The one TRUE off-state flag:** `SPECKIT_MEMORY_IDEMPOTENCY` (idempotency-receipts.ts:54-57) — a genuine default-OFF flag with a built receipt store — but NOT the asset the meta-finding leads with.

## Synthesis impact
Re-frame the roadmap's #1 meta-finding from "**PROMOTE-the-off-state-flag** (flip the flag, wire the seam)" to "**the machinery EXISTS (not build-from-scratch), but realizing it is moderate INTEGRATION + benefit-verification per asset, not low-effort flag-flips** — only `SPECKIT_MEMORY_IDEMPOTENCY` is a literal off-state flip." Together with the determinism-spine 2-of-4 correction, **both roadmap headline meta-findings are now honestly tempered**: the wins are real but cost more than "flip a flag."

## Next Focus
Both meta-spines recalibrated (determinism 2-of-4; promote-off-state 0-of-4 clean flips). The genuine low-effort GOs are the Q6-anchor FIX + the handful of true reversible flips/additive presentation fixes; the rest is moderate integration. Feeds the synthesis re-tag.
