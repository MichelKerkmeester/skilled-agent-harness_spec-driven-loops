# Iteration 16: Round C Feasibility — Memory Governance / Retention / Forgetting + C3-D-vs-erasure Reconciliation

## Focus
Round C feasibility for M-spare-only-eligibility, M-edge-allowlist-unreferenced, M-erasure-cascade-refuse-whole, M-residual-retention-report, M-unforget-channel-disjointness + resolve the C3-D-vs-erasure "no deny-list" contradiction. Read-only.

## Feasibility verdicts (newInfoRatio 0.70)
| Candidate | Verdict | Note |
|---|---|---|
| M-spare-only-eligibility | **GO** (standalone) | real gap: `EXTENDABLE_TIERS={'important'}` only — a non-important row with strong positive feedback is annotated but still deletes; fix internal to `evaluateFeedbackRetention`; double-gated OFF (ships dark) |
| M-residual-retention-report | **CAUTION (GO if scoped to reading-b)** | as an ADDITIVE field on the EXISTING sweep result = GO; as `EraseReport.residual_retention` = NO-GO until erasure exists |
| M-edge-allowlist-unreferenced | **NEEDS-BENCHMARK** | couldn't locate the unreferenced-allowlist symbol (honest UNKNOWN); likely coupled to C3-A `SPECKIT_TEMPORAL_EDGES` flip |
| M-erasure-cascade-refuse-whole | **NEEDS-BENCHMARK (own packet)** | net-new PORT from aionforge Rust (no TS erasure module, no Authorizer/provenance seam verified); GDPR-facing; each erase IRREVERSIBLE |
| M-unforget-channel-disjointness | **NEEDS-BENCHMARK (defer)** | cross-channel invariant; depends on both an unforget channel AND erasure, only one half-present |

## C3-D vs erasure — they do NOT collide
C3-D (roadmap.md:53) is **"BUILD-new (decision note)"**, effort S — a documentation artifact codifying that tombstone-sweep ("off-state forgetting") and temporal-close ("not current") are separate concerns; it is NOT a tombstone deny-list registry. erasure.md:103-106 forbids ONE thing: a persistent deny-list of already-erased ids (which would itself defeat erasure). Three distinct mechanisms stay separate, none is a deny-list: (1) ERASURE = irreversible hard purge (GDPR); (2) TOMBSTONE-SWEEP = reversible soft-delete via `deleted_at` purgeable partition (`SPECKIT_SOFT_DELETE_TOMBSTONES`, off); (3) TEMPORAL-CLOSE = `invalid_at` edge invalidation. The clash is purely terminological ("tombstone" in both). **Resolution: keep C3-D a pure decision note codifying the 3-way separation + one guard rail (never persist a list of hard-erased ids). No registry built by C3-D.**

## Sequencing
Wave 0 (independent, low-blast): M-spare-only-eligibility → M-residual-retention (reading-b, additive on sweep) → C3-D decision note. Deferred: M-edge-allowlist (locate symbol, behind C3-A); separate future packet: erasure-cascade → residual (EraseReport) → unforget-disjointness.

## Next Focus
spare-only is a clean GO FIX; erasure is correctly scoped to its own GDPR packet (not the retention cluster). Open: locate the edge-allowlist symbol; does a Principal/Authorizer seam exist in TS (gates erasure)?
