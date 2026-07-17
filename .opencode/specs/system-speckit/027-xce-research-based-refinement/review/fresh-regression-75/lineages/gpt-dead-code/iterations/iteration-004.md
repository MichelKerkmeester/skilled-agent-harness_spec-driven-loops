# Seat gpt-dead-code — iteration 4 (global #57)

- Model: `claude-opus-4-8` · Executor: claude · Angle: gpt-dead-code
- Verdict: **PASS** · Findings: P0=0 P1=0 P2=1

## Analysis

## Analysis

I reviewed the five-port storage adapter seam at `lib/storage/ports/` and traced every concrete adapter to its production callers.

**The seam is largely wired — the angle's premise ("no concrete implementation wired") is mostly refuted.** Each of the five ports has a concrete implementation, and four of five are consumed in production:

| Port | Concrete adapter | Production caller |
|---|---|---|
| `VectorStore` | `BetterSqliteVectorStore` | `lib/search/vector-index.ts` re-export (used widely) ✓ |
| `ContentionPolicy` | `BetterSqliteContentionPolicy` | `ops/sqlite-busy-retry.ts`, `ops/file-watcher.ts`, `eval/eval-db.ts`, `analytics/session-analytics-db.ts` ✓ |
| `Maintenance` | `BetterSqliteMaintenance` | `embedders/reindex.ts`, `governance/memory-retention-sweep.ts` ✓ |
| `GraphTraversal` | `BetterSqliteGraphTraversal` | `search/causal-boost.ts:428`, `storage/memo.ts:223` ✓ (partial) |
| `LexicalSearch` | `PackedBm25LexicalSearch` | **none** — documented exception |

**LexicalSearch is genuinely unadopted in production** (only `tests/storage-ports-contract.vitest.ts` and the `FakeLexicalSearch` fake reference it; the hybrid path calls `combinedLexicalSearch` in `hybrid-search.ts` directly). However this is explicitly documented at `lexical-search.ts:58-65` ("No production caller adopts this port yet... routing it through this port regresses hybrid ranking behavior"). Per review rules, a documented design choice with stated rationale is not a defect — I am not flagging it.

**Genuine (minor) finding — GraphTraversal partial adoption.** The `GraphTraversal` interface declares four methods, but production only ever calls two through the adapter: `collectCausalWeightedNeighbors` (`causal-boost.ts:428`) and `collectDependencyReachability` (`memo.ts:223`). The other two adapter methods — `collectWeightedWalk` (`graph-traversal.ts:57-61`) and `collectDirectedReachability` (`graph-traversal.ts:63-67`) — have no production caller. Worse, both ignore the instance's `this.database` field entirely and are pure pass-throughs to the imported module functions, so as instance methods they carry zero value over calling the module functions directly. The underlying module functions are *not* dead (they're reached internally by `collectCausalWeightedNeighbors`/`collectDependencyReachability` per `bfs-traversal.ts:291,330`), and the adapter methods do have contract-test coverage — so this is hygiene, not correctness. P2.

No P0/P1 issues. No data-loss, concurrency, security, or traceability defects surfaced on this angle. The adapter seam is real and wired; the only unwired port is documented as intentional.

```json
{"seat":"gpt-dead-code","model":"openai/gpt-5.5-fast","angle":"Storage adapter ports defined but unused; an adapter seam with no concrete implementation wired.","verdict":"PASS","summary":"Premise mostly refuted: 4/5 ports wired to production, 5th (LexicalSearch) unadopted but documented-intentional. One minor P2: 2 GraphTraversal adapter methods are unused prod passthroughs that ignore this.database.","files_reviewed":["lib/storage/ports/index.ts","lib/storage/ports/common.ts","lib/storage/ports/vector-store.ts","lib/storage/ports/lexical-search.ts","lib/storage/ports/graph-traversal.ts","lib/storage/ports/maintenance.ts","lib/storage/ports/contention-policy.ts","lib/search/causal-boost.ts","lib/storage/memo.ts","lib/graph/bfs-traversal.ts","lib/search/vector-index.ts","lib/ops/sqlite-busy-retry.ts","lib/ops/file-watcher.ts","lib/embedders/reindex.ts","lib/governance/memory-retention-sweep.ts","lib/eval/eval-db.ts","lib/analytics/session-analytics-db.ts","lib/search/hybrid-search.ts","tests/fakes/storage-ports.ts","tests/storage-ports-contract.vitest.ts"],"findings":[{"severity":"P2","dimension":"maintainability","title":"Two GraphTraversal adapter methods are unused prod passthroughs that ignore instance database","file":"lib/storage/ports/graph-traversal.ts:57","evidence":"BetterSqliteGraphTraversal.collectWeightedWalk (lines 57-61) and collectDirectedReachability (lines 63-67) delegate straight to the imported module functions and never reference this.database. A grep across non-test/non-dist code finds production calls only to collectCausalWeightedNeighbors (causal-boost.ts:428) and collectDependencyReachability (memo.ts:223); the other two adapter methods have no production caller.","why":"Dead interface surface: instance methods that ignore instance state add maintenance weight and falsely imply the adapter owns those traversals, while the only value (db binding) is absent. They are reachable only via the contract test.","recommendation":"Either drop collectWeightedWalk/collectDirectedReachability from the GraphTraversal port (callers can use the bfs-traversal module functions directly, as they already do internally), or add a one-line comment documenting that they are reserved/contract-only — mirroring the explicit unadopted-port note already present in lexical-search.ts:58-65."}]}
```
