# Iteration 5 (Round K): Q5 Incremental Index / Statediff × determinism + generation watermark

## Focus
Reconcile 027's incremental memory index + statediff reconciliation against 028's determinism (content-derived order, idempotent no-op rescan) + Q6-C1 generation watermark. Read-only.

## Findings (newInfoRatio 0.4)
**VERDICT: ALREADY-COVERED** (determinism half); **no-transfer** (watermark half, Code-Graph-scoped).
- 027's incremental index already satisfies the 028 determinism property: idempotent no-op rescan (mtime fast-path → content-hash equality skip, `incremental-index.ts:208-225`) and deterministic integer-id ordering (`ORDER BY id`, `:155-158,:461,:470`; numeric sort `:421`).
- 028's Q6-C1 hard generation watermark is **scoped to Code Graph** (`roadmap.md:56`), not the Memory statediff path → no new work imposed. 027 already ships a monotonic-generation-bump-before-cache-invalidation in the causal-edge layer (`before-vs-after.md:509`), though as a silent cache flush, not Q6-C1's stale-read-as-ERROR posture.
- Memoization DAG has cycle-guard + path-set invalidation, no watermark (`memo.ts:52-68`). LEVERAGE L, EFFORT S.

## Most-likely-wrong (the lone residual)
That `incremental-index.ts:421`'s `(a,b)=>a-b` is immune to the 028 total_cmp gotcha — IF any null/undefined id can enter that array the comparator is non-total, and a tiny hand-written total comparator would be a genuine S-effort hardening transfer from 028. The one real residual on Q5.

## Next Focus
Round L: confirm whether null/undefined ids can reach `incremental-index.ts:421` (the total_cmp residual); otherwise Q5 is closed already-covered.
