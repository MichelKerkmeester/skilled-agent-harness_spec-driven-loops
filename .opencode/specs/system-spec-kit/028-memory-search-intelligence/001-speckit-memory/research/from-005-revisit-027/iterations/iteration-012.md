# Iteration 12 (Round L): Q3 deep — promoter-fork → CONFIRMED but DORMANT + minimal fix

## Focus
Resolve the Round K Q3 promoter-fork hypothesis: would re-promotion hard-delete temporally-closed edges. Read-only deep-dive.

## Findings (newInfoRatio 0.55)
**RESOLUTION: FORK CONFIRMED at the data-model layer, but DORMANT until C3-A lands.**
- The mechanism is real end-to-end: frontmatter relations are contradiction-reachable (`enabled`↔`contradicts`, `supersedes`; `causal-edges.ts:23-26` vs `contradiction-detection.ts:38-42`), `detectContradictions` runs inside `insertEdge` under the already-ON temporal gate (`causal-edges.ts:336`), and the promoter's `cleanupStaleGeneratedEdges` selects stale edges with **no `invalid_at` filter** (`frontmatter-promoter.ts:304-318`) then tombstones + hard-DELETEs (`sweep.ts:255-269`).
- **Dormant today:** the live causal read path ignores `invalid_at` entirely — `getValidEdges` (the only filtering reader) has **zero callers** (`temporal-edges.ts:111-145`). So a closed edge reads identically to a valid one; deletion is currently harmless. Harm activates the instant C3-A wires `invalid_at` into reads.
- **Smallest fix:** add a temporal-gated `AND invalid_at IS NULL` to the promoter cleanup SELECT (`frontmatter-promoter.ts:304-318`) so closed edges aren't re-forgotten by the sweep (exactly C3-D's separation). One guarded WHERE clause, additive. (Option "promoter closes instead of deletes" regresses today's unfiltered readers; "read unions tombstones" is largest.)
- **What speaks the old contract:** 5+ readers rely on stale edges being physically gone (`causal-boost.ts:706-708`, `graph-search-fn.ts:272/515/520`, `bfs-traversal.ts:248-253`, `recovery-payload.ts:273`, `stage2-fusion.ts:466`). LEVERAGE H, EFFORT S — gating blocker for C3-A.

## Most-likely-wrong
Whether closed frontmatter edges actually arise in production (the `enabled`↔`contradicts`/`supersedes` collision is structurally possible; no producer confirmed to insert it on the same source/target). If none, the delete-fork is theoretical.

## Next Focus
This is a Wave-0 sequencing constraint for any C3-A adoption: skip-closed-in-sweep MUST land before edge-presence read-wiring. Feeds Round M sequencing + the ledger.
