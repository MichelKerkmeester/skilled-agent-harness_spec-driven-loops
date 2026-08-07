# Iteration 10 (Round K): Q10 Memclaw Derived-Memory Write Safety × content-addressed derived IDs + idempotent consolidation

## Focus
Reconcile 027's derived-memory write safety against 028's content-addressed derived id (C4-B) + idempotent async consolidation (C4-A/C4-C/C-G1). Read-only.

## Findings (newInfoRatio 0.6)
**VERDICT: EXTENDS** — 028 strengthens a base 027 only partially covers.
- 027's live derived/causal-edge write path keys rows by autoincrement `id INTEGER PRIMARY KEY` with natural-key dedup `UNIQUE(source_id,target_id,relation,source_anchor,target_anchor)` + `created_by` provenance (`vector-index-schema.ts:1107-1121`) — **NOT content-addressed** (028 confirms identity = autoincrement, `001/research.md:20`).
- "Automated never overwrite manual" is enforced via `created_by` + auto-promotion skip (`causal-graph.ts:1060`; constitutional rule).
- 027 idempotency receipts exist but are **flag-OFF + wired ONLY into the synchronous CRUD path** (`memory-crud-update.ts:259-274`); **NONE in the causal/derived consolidation path**. So 028 C4-B (`derived_id=sha256(triple+source+rule_version)`) + C4-A/C4-C/C-G1 genuinely strengthen crash-replay determinism + re-derivation dedup. LEVERAGE M, EFFORT M.

## Most-likely-wrong
That receipts touch NO part of the derived/consolidation path — a reconsolidation/"goodnight" tick (`reconsolidation-bridge.ts` / `session-manager.ts`) could wire a content-hash guard I did not grep, shifting derived-write-safety toward already-covered.

## Next Focus
Round L: deep-dive the content-addressed-identity thread (Q2+Q10 shared) — confirm the causal/consolidation path has no content-hash guard; C4-B is the shared net-new for derived identity.
