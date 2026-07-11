# Iteration 3 (Round K): Q3 Causal-edge Lifecycle × full bi-temporal model

## Focus
Reconcile 027's causal-edge tombstones + frontmatter→edge promoter against 028's four-timestamp validity windows + SUPERSEDES/CONTRADICTS + conflict auto-invalidation (C3-A/B/C/D). Read-only.

## Findings (newInfoRatio 0.55)
**VERDICT: EXTENDS** — net-additive, NOT a competing mechanism; but a real fork risk at the promoter seam.
- 028's SUPERSEDES/CONTRADICTS + auto-invalidation primitive is **already shipped** in 027 (`contradiction-detection.ts:99-110` auto-closes via `invalidateEdge`; `temporal-edges.ts:68-101`) → C3-A is **already-covered at the primitive level** (confirms the roadmap's own kill of C3-A-as-flip, `roadmap.md:206,215`).
- Genuinely EXTENDS: C3-B's four-timestamp event/txn window (027 ships only the two-timestamp `valid_at`/`invalid_at`, `temporal-edges.ts:16-23`), C3-C TemporalMode recall, C3-D's tombstone-vs-temporal-close separation.
- **NET-NEW fork risk:** the frontmatter→edge promoter HARD-DELETES stale packet edges via `sweepCausalEdges` (`frontmatter-promoter.ts:11`) rather than temporal-closing them. Once C3-A wires edge-presence into the read path, re-promotion would *forget* (delete) edges the temporal model expects *closed* (`invalid_at` set) — exactly the causal-edge-vs-lineage fork the 028 addendum warns of (`roadmap.md:215`). LEVERAGE M, EFFORT M.

## Most-likely-wrong
That tombstone-forget and temporal-close "coexist cleanly" — they fork at the promoter delete seam unless reconciled (this is actually the finding, surfaced via the seat's own most-likely-wrong).

## Next Focus
Round L: the promoter-seam fork is a concrete feasibility item (Q3 deep-dive) + a "what speaks the old contract" for Round M.
