# Iteration 19 (Round L): Bi-temporal shared-store synthesis (Q1+Q3+Q9 thread)

## Focus
Cross-cut: do 027's three temporal stores share a shape; should 028's four-timestamp window unify them? Read-only.

## Findings (newInfoRatio 0.5)
**SYNTHESIS: UNIFY CAUSAL+LINEAGE ONLY; retention TTL stays separate.** The three stores do NOT share a shape:
- **causal-edge** (`temporal-edges.ts:16-23,41,50`): 2-timestamp event-time `valid_at`/`invalid_at`, no transaction-time.
- **lineage** (`lineage-state.ts:55-56,60`): `valid_from`/`valid_to` + `created_at` — already ~3/4 bi-temporal (event window + de-facto `ingested_at`), missing only a txn-time `expired_at`.
- **retention TTL** (`memory-retention-sweep.ts:143,176,181`): NOT a validity window — physical/tombstone DELETION with tier protection. The OPPOSITE philosophy of "currentness = edge presence, not deletion" (`roadmap.md:46`). Folding it in is a category error.
- C3-B should unify causal+lineage (+ Code Graph `code_edges`, `roadmap.md:249`); retention should *consume* the window read-side but not BE one.
- **Reconciliation risk:** dual supersede truth — lineage `superseded_by_memory_id` (`lineage-state.ts:54`) vs causal-edge `invalid_at` invalidation; C3-C's current-support provider must pick ONE canonical store or pay a permanent read-time join tax. Unification cost is ASYMMETRIC (lineage 3/4 there; causal-edge zero txn-time). LEVERAGE H, EFFORT M.

## Most-likely-wrong
That causal-edge and lineage "are the same shape and should share a substrate" — edge-validity (relation between two nodes) vs lineage-validity (version of one memory) may be distinct enough that sharing the column shape invites false joins → slides toward keep-per-store with a shared TYPE def only, not a shared table contract.

## Next Focus
Round M: the canonical-supersede-writer decision (M5) is the concrete blast-radius item for unification. Feeds the ledger's shared-bi-temporal-substrate plan.
