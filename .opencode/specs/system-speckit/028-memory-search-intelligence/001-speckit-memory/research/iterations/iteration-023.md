# Iteration 23: Round E Verify+Feasibility — Memory Provenance/Identity Hardening (mostly N/A single-tenant)

## Focus
Round E verify+feasibility for the iter-14/19 provenance/identity hardening cluster, under the SINGLE-TENANT applicability lens. Read-only.

## Assessments (newInfoRatio 0.75)
| Candidate | Real | Feasibility | Single-tenant? | Note |
|---|---|---|---|---|
| M-clock-skew-replay-window | REFUTED | NO-GO | **no** | anti-replay clock-skew is a network/multi-writer threat; local writes have no adversarial replay + receipts already dedup |
| M-id-collision-guard | REFUTED | NO-GO | **no** | `id INTEGER PRIMARY KEY AUTOINCREMENT` (vector-index-schema.ts:355) + causal edge_id autoincrement → SQLite guarantees uniqueness; a separate guard is redundant |
| M-oracle-resistant-errors | REFUTED | NO-GO | **no** | error-oracle hardening defends an untrusted caller probing via response differences; the single-tenant caller IS the owner; the surfaced detail is an operational signal |
| M-dual-class-identity | PARTIAL | NO-GO | **no** | the capture-vs-content distinction already exists informally (autoincrement id + contentHash dedup); formalizing pays off only for distributed/multi-writer merge |
| M-system-kind-exclusion | REAL | **CAUTION** | **yes** | system-generated rows pollute default recall TODAY; `source_kind='system'` is populated (backfill :770-782) but no recall WHERE filter excludes it; tenancy-independent recall-quality win + an opt-in flag to re-include valuable reconsolidation rows |

## Key correction
**The Memory provenance/identity-hardening cluster is mostly NOT-APPLICABLE for this single-tenant local tool** — 4 of 5 are REFUTED-NO-GO (their threat models assume remote/multi-writer adversaries). This corrects iter-14's optimism (which flagged clock-skew/id-collision/oracle-errors as "applies"). The ONE genuine tenancy-independent win is **system-kind-exclusion** (recall-quality, not security).

## Next Focus
Provenance-hardening cluster collapses to system-kind-exclusion (recall-quality GO/CAUTION); the rest is correctly N/A for single-tenant. Honest correction to iter-14. Feeds synthesis.
