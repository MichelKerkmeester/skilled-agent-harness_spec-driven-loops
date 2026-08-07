# Iteration 12: External Mining — aionforge forgetting.md + erasure.md → Memory

## Focus
Round B mining: forgetting + erasure docs for NET-NEW Memory candidates beyond C3-D/C7/C8. Read-only.

## Findings — NET-NEW candidates (6; newInfoRatio 0.75)
| Candidate | Seam | Lev/Eff | Class | Conf |
|---|---|---|---|---|
| erasure-cascade-multiparent-refuse-whole (closure walk over DERIVED_FROM; doomed only if EVERY source in closure; depth/node cap → typed refusal in read phase) | tools/memory-tools.ts handleMemoryDelete/BulkDelete (flat, GAP) | H/L | BUILD | CONFIRMED-gap |
| residual-retention-honesty-report (delete returns where bytes still live: dead rows + vec tombstones until compact, WAL; NO deny-list registry) | vector-index-schema.ts/mutations.ts | M/S | BUILD | CONFIRMED-seam |
| can-only-spare-eligibility-with-nonfinite-spares (full AND-conjunction; non-finite importance/trust SPARE; refuse both-floors-at-ceiling) | feedback-retention-reducer.ts:153-155 (tier/pin spare only) | H/S | FIX | CONFIRMED |
| edge-allowlist-unreferenced-check (unreferenced reads LIVE incoming edges from a protecting allowlist, not the loss-tolerant referenced_count cache) | memory-retention-sweep.ts:142-262; temporal-edges.ts | M/M | BUILD | CONFIRMED-seam |
| unforget-reversibility-status-ownership-guard (4 revision channels leave disjoint (expired_at,status,edge) fingerprints; unforget=safe bare-key; status-ownership write refusal) | contradiction-detection.ts; temporal-edges.ts | M/M | BUILD | CONFIRMED-seam |
| per-namespace-authorize-before-erase (Authorizer rules on EVERY namespace the cascade spans; one denial refuses whole; pin/attested NOT consulted — erase is explicit escalation) | scope-governance.ts:258-290 (provenance actor exists) | M/M | BUILD | CONFIRMED-seam |

**Already covered:** C3-D (2-channel soft-forget/temporal base of the 4-channel matrix); C4-A/B/C (audit co-commit, idempotency in state gate); C8 (insert-time redaction via redaction-gate.ts, distinct from erasure).

## Reconciliation flag (for synthesis)
**unforget extends C3-D from a 2-way to a 4-channel disjointness invariant.** And: if C3-D builds a tombstone deny-list registry it **collides with erasure.md's "no deny-list registry" GDPR invariant** — reconcile before both ship.

## Next Focus
The retention/forget cluster (can-only-spare FIX + edge-allowlist + cascade) is a coherent Memory governance sub-packet; feeds Round C (C3-D vs erasure reconciliation).
