# Tasks: Phase 5 — mcp_server/ Upper Layers TypeScript Conversion

> **Parent Spec:** 092-javascript-to-typescript/

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format:**
```
T### [W-X] [P?] Description (file path) [effort] {deps: T###}
```

---

## Phase 5: Convert mcp_server/ Upper Layers (42 files)

> **Goal:** Convert the stateful, complex modules that depend on the foundation.
> **Workstream:** W-E
> **Effort:** 42 files, ~23,300 lines

### Layer 5a: lib/embeddings/ (2 files)

- [ ] T100 [W-E] Convert `lib/embeddings/provider-chain.ts` (650 lines) [1.5h] {deps: T092, T039}
  - Define `ProviderTier` enum, `FallbackReason` type
  - `EmbeddingProviderChain` class with typed chain logic
  - `BM25OnlyProvider` class implements `IEmbeddingProvider`
- [ ] T101 [W-E] Convert `lib/embeddings/index.ts` barrel [10m] {deps: T100}

### Layer 5b: lib/cognitive/ (11 files)

- [ ] T102 [W-E] Convert `lib/cognitive/fsrs-scheduler.ts` (260 lines) [45m] {deps: T092}
  - Type FSRS v4 algorithm: `calculateRetrievability`, `updateStability`
  - Define grade constants as enum: `GRADE_AGAIN`, `GRADE_HARD`, `GRADE_GOOD`, `GRADE_EASY`

- [ ] T103 [W-E] Convert `lib/cognitive/composite-scoring.ts` (proxy to lib/scoring/) [15m] {deps: T066}

- [ ] T104 [W-E] Convert `lib/cognitive/tier-classifier.ts` (784 lines) [1.5h] {deps: T102}
  - Define `TierState` type: `'HOT' | 'WARM' | 'COLD' | 'DORMANT' | 'ARCHIVED'`
  - Define `STATE_THRESHOLDS` as typed constant
  - Type all classification and filtering functions

- [ ] T105 [W-E] [P] Convert `lib/cognitive/summary-generator.ts` (227 lines) [30m] {deps: T092}
- [ ] T106 [W-E] [P] Convert `lib/cognitive/temporal-contiguity.ts` (162 lines) [30m] {deps: T092}

- [ ] T107 [W-E] Convert `lib/cognitive/attention-decay.ts` (843 lines) [1.5h] {deps: T102, T104}
  - Type 5-factor composite scoring integration
  - Type decay configuration by importance tier

- [ ] T108 [W-E] Convert `lib/cognitive/prediction-error-gate.ts` (528 lines) [1h] {deps: T092}
  - Define `PE_ACTIONS` type: `'CREATE' | 'UPDATE' | 'SUPERSEDE' | 'REINFORCE' | 'CREATE_LINKED'`
  - Type conflict detection logic

- [ ] T109 [W-E] Convert `lib/cognitive/co-activation.ts` (384 lines) [45m] {deps: T104}
- [ ] T110 [W-E] Convert `lib/cognitive/consolidation.ts` (1,054 lines) [2h] {deps: T104}
  - Type 4-phase engine: REPLAY, ABSTRACT, INTEGRATE, PRUNE
  - Define `ConsolidationPhase` enum
- [ ] T111 [W-E] Convert `lib/cognitive/working-memory.ts` (582 lines) [1h] {deps: T092}
- [ ] T112 [W-E] Convert `lib/cognitive/archival-manager.ts` (589 lines) [1h] {deps: T104}
- [ ] T113 [W-E] Convert `lib/cognitive/index.ts` barrel (164 lines) [30m] {deps: T102-T112}

### Layer 5c: lib/search/ (9 files)

- [ ] T114 [W-E] Convert `lib/search/bm25-index.ts` (312 lines) [45m] {deps: T092}
  - `BM25Index` class with typed document interface
- [ ] T115 [W-E] [P] Convert `lib/search/fuzzy-match.ts` (387 lines) [45m] {deps: T092}
- [ ] T116 [W-E] [P] Convert `lib/search/intent-classifier.ts` (457 lines) [45m] {deps: T092}
  - Define `IntentType` type: `'add_feature' | 'fix_bug' | 'refactor' | 'security_audit' | 'understand'`
- [ ] T117 [W-E] [P] Convert `lib/search/rrf-fusion.ts` (292 lines) [45m] {deps: T092}
- [ ] T118 [W-E] [P] Convert `lib/search/reranker.ts` (98 lines) [15m] {deps: T092}
- [ ] T119 [W-E] Convert `lib/search/cross-encoder.ts` (642 lines) [1h] {deps: T092}
- [ ] T120 [W-E] Convert `lib/search/hybrid-search.ts` (366 lines) [45m] {deps: T114, T117}
- [ ] T121 [W-E] Convert `lib/search/vector-index.ts` (3,309 lines) [4h] {deps: T092, T019}
  - LARGEST FILE — SQLite + sqlite-vec, schema migrations, vector operations
  - Type all database query results, schema management
  - Type `better-sqlite3` interactions with `@types/better-sqlite3`
  - Type `sqlite-vec` interactions with custom `.d.ts`
- [ ] T122 [W-E] Convert `lib/search/index.ts` barrel [10m] {deps: T114-T121}

### Layer 5d: lib/storage/ (8 files)

- [ ] T123 [W-E] [P] Convert `lib/storage/access-tracker.ts` (188 lines) [30m] {deps: T092}
- [ ] T124 [W-E] [P] Convert `lib/storage/history.ts` (373 lines) [45m] {deps: T092}
  - Define `HistoryEvent` type, `HistoryActor` union
- [ ] T125 [W-E] Convert `lib/storage/causal-edges.ts` (661 lines) [1h] {deps: T092}
  - Define `CausalEdge` interface, `RelationType` union of 6 types
- [ ] T126 [W-E] Convert `lib/storage/checkpoints.ts` (823 lines) [1.5h] {deps: T092, T040}
  - Define `Checkpoint` interface with gzip compression typing
- [ ] T127 [W-E] [P] Convert `lib/storage/incremental-index.ts` (334 lines) [45m] {deps: T092}
- [ ] T128 [W-E] [P] Convert `lib/storage/index-refresh.ts` (142 lines) [20m] {deps: T092}
- [ ] T129 [W-E] Convert `lib/storage/transaction-manager.ts` (474 lines) [1h] {deps: T092}
  - Define `TransactionResult` interface, atomic operation types
- [ ] T130 [W-E] Convert `lib/storage/index.ts` barrel [10m] {deps: T123-T129}

### Layer 5e: lib/session/ (4 files)

- [ ] T131 [W-E] [P] Convert `lib/session/channel.ts` (150 lines) [20m] {deps: T092}
- [ ] T132 [W-E] Convert `lib/session/session-manager.ts` (1,045 lines) [2h] {deps: T092}
  - Type deduplication logic, crash recovery, session state
- [ ] T133 [W-E] Convert `lib/session/index.ts` barrel [10m] {deps: T131, T132}
- [ ] T134 [W-E] Convert `lib/channel.ts` re-export wrapper [5m] {deps: T133}

### Layer 5f–5h: Remaining lib/ (7 files)

- [ ] T135 [W-E] [P] Convert `lib/cache/tool-cache.ts` (546 lines) [1h] {deps: T092}
  - Type `CacheEntry<T>` generic, LRU eviction, TTL logic
- [ ] T136 [W-E] Convert `lib/cache/index.ts` barrel [10m] {deps: T135}
- [ ] T137 [W-E] [P] Convert `lib/learning/corrections.ts` (698 lines) [1h] {deps: T092}
  - Define `CorrectionType` enum: `SUPERSEDED | DEPRECATED | REFINED | MERGED`
- [ ] T138 [W-E] Convert `lib/learning/index.ts` barrel [10m] {deps: T137}
- [ ] T139 [W-E] [P] Convert `lib/providers/retry-manager.ts` (515 lines) [1h] {deps: T121, T100}
- [ ] T140 [W-E] Convert `lib/providers/embeddings.ts` re-export stub [10m] {deps: T040}
- [ ] T141 [W-E] Convert `lib/providers/index.ts` barrel [10m] {deps: T139, T140}

### Layer 5i: hooks/ (2 files)

- [ ] T142 [W-E] Convert `hooks/memory-surface.ts` (161 lines) [30m] {deps: T078, T121}
- [ ] T143 [W-E] Convert `hooks/index.ts` barrel [10m] {deps: T142}

### Layer 5j: handlers/ (10 files)

- [ ] T144 [W-E] Convert `handlers/memory-context.ts` (396 lines) [1h] {deps: T113, T116, T150}
- [ ] T145 [W-E] Convert `handlers/memory-search.ts` (790 lines) [1.5h] {deps: T121, T100, T119, T132, T135}
  - Type search pipeline: query → hybrid search → reranking → dedup → format
- [ ] T146 [W-E] Convert `handlers/memory-triggers.ts` (263 lines) [45m] {deps: T078, T107, T104}
- [ ] T147 [W-E] Convert `handlers/memory-save.ts` (1,215 lines) [2.5h] {deps: T108, T121, T129}
  - LARGEST HANDLER — PE gating, FSRS scheduling, causal links, atomic saves
- [ ] T148 [W-E] Convert `handlers/memory-crud.ts` (494 lines) [1h] {deps: T121, T068}
- [ ] T149 [W-E] Convert `handlers/memory-index.ts` (374 lines) [45m] {deps: T077, T121, T127}
- [ ] T150 [W-E] Convert `handlers/causal-graph.ts` (496 lines) [1h] {deps: T125, T121}
- [ ] T151 [W-E] Convert `handlers/checkpoints.ts` (255 lines) [30m] {deps: T126, T067}
- [ ] T152 [W-E] Convert `handlers/session-learning.ts` (691 lines) [1.5h] {deps: T121}
- [ ] T153 [W-E] Convert `handlers/index.ts` barrel (56 lines) [15m] {deps: T144-T152}

### Layer 5k–5l: Entry Points (2 files)

- [ ] T154 [W-E] Convert `scripts/reindex-embeddings.ts` (119 lines) [30m] {deps: T121, T100}
- [ ] T155 [W-E] Convert `context-server.ts` (525 lines) [2h] {deps: T153, T143}
  - MCP entry point with 20+ tool definitions
  - Type all tool input schemas and dispatch logic
  - Type MCP SDK server initialization

### Layer 5m: lib master barrel

- [ ] T156 [W-E] Convert `lib/index.ts` master barrel (50 lines) [15m] {deps: all lib/}

### Phase 5 Verification

- [ ] T157 [W-E] Verify full mcp_server compilation and tests [1h] {deps: T155, T156}
  - `tsc --build mcp_server` compiles with 0 errors
  - All 46 mcp_server tests pass against compiled output
  - MCP server starts and initializes all tools

>>> SYNC-006: Phase 5 complete — Full MCP server in TypeScript. All tools operational. <<<

---

## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All verification tasks pass (T157)
- [ ] Phase 5 checklist items verified (CHK-100 through CHK-117)

---

## Cross-References

- **Parent Spec:** `092-javascript-to-typescript/spec.md`
- **Master Tasks:** `092-javascript-to-typescript/tasks.md` (lines 492–630)
- **Plan:** See `plan.md`
- **Checklist:** See `checklist.md`
