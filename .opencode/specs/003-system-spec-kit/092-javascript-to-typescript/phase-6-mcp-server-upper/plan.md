# Plan: Phase 5 — mcp_server/ Upper Layers TypeScript Conversion

> **Parent Spec:** 092-javascript-to-typescript/
> **Workstream:** W-E
> **Session:** 3
> **Status:** Planning
> **Created:** 2026-02-07

---

## 1. Overview

**Goal:** Convert the stateful, complex modules in `mcp_server/` that depend on the foundation layers (Phase 4).

**Scope:**
- 42 files
- ~23,300 lines
- 12 sub-layers (5a through 5l)
- Most complex files in the entire migration

**Dependency:** Phase 4 must be complete (foundation layers fully typed).

---

## 2. Conversion Strategy

### Sub-Layer Organization

Phase 5 is organized into 12 sub-layers with a strict dependency chain:

```
5a → 5b → 5c → 5d → 5e → 5f/5g/5h (parallel) → 5i → 5j → 5k/5l
```

**Parallelizable segments:**
- Sub-layers 5f, 5g, 5h can run in parallel (after 5e completes)
- Sub-layers 5k, 5l can run in parallel (after 5j completes)

### File Conversion Pattern

For each `.js` file in Phase 5:
1. Rename to `.ts`
2. Replace `require()` → `import` (source uses ES modules, output stays CommonJS)
3. Replace `module.exports` → `export`
4. Add type annotations for all function parameters and return types
5. Define TypeScript interfaces/types for all data structures
6. Type all database interactions (SQLite, better-sqlite3, sqlite-vec)
7. Type all MCP SDK interactions
8. Run `tsc --noEmit` to verify types
9. Run existing tests against compiled output

**Key principle:** Preserve all runtime behavior. TypeScript is for compile-time safety only.

---

## 3. Sub-Layer Details

### Layer 5a: lib/embeddings/ (2 files, 662 lines)

**Files:**
- `lib/embeddings/provider-chain.ts` (650 lines)
- `lib/embeddings/index.ts` (12 lines)

**Key types to define:**
- `ProviderTier` enum: `PRIMARY`, `FALLBACK`, `BM25_ONLY`
- `FallbackReason` type: `'primary_unavailable' | 'api_error' | 'timeout' | 'rate_limit'`
- `EmbeddingProviderChain` class with typed chain logic
- `BM25OnlyProvider` class implementing `IEmbeddingProvider`

**Dependencies:** Phase 4 complete, `shared/embeddings/factory.ts`

**Agent assignment:** Agent 1

---

### Layer 5b: lib/cognitive/ (11 files, 5,577 lines)

**Files:**
- `fsrs-scheduler.ts` (260 lines)
- `composite-scoring.ts` (proxy to `lib/scoring/`, 15 lines)
- `tier-classifier.ts` (784 lines)
- `summary-generator.ts` (227 lines)
- `temporal-contiguity.ts` (162 lines)
- `attention-decay.ts` (843 lines)
- `prediction-error-gate.ts` (528 lines)
- `co-activation.ts` (384 lines)
- `consolidation.ts` (1,054 lines)
- `working-memory.ts` (582 lines)
- `archival-manager.ts` (589 lines)
- `index.ts` (164 lines)

**Key types to define:**
- `DecayScore` interface with 5-factor composite
- `FSRSState` interface: stability, difficulty, retrievability, lastReview
- `ConsolidationPhase` enum: `REPLAY`, `ABSTRACT`, `INTEGRATE`, `PRUNE`
- `TierState` type: `'HOT' | 'WARM' | 'COLD' | 'DORMANT' | 'ARCHIVED'`
- `WorkingMemory` interface with capacity tracking
- `PE_ACTIONS` type: `'CREATE' | 'UPDATE' | 'SUPERSEDE' | 'REINFORCE' | 'CREATE_LINKED'`

**Top complex files:**
- `consolidation.ts` (1,054 lines) — 4-phase consolidation engine
- `attention-decay.ts` (843 lines) — 5-factor composite decay
- `tier-classifier.ts` (784 lines) — state-based classification

**Dependencies:** Layer 5a, Phase 4 scoring modules

**Agent assignment:** Agent 1

---

### Layer 5c: lib/search/ (9 files, 5,887 lines)

**Files:**
- `bm25-index.ts` (312 lines)
- `fuzzy-match.ts` (387 lines)
- `intent-classifier.ts` (457 lines)
- `rrf-fusion.ts` (292 lines)
- `reranker.ts` (98 lines)
- `cross-encoder.ts` (642 lines)
- `hybrid-search.ts` (366 lines)
- `vector-index.ts` (3,309 lines) — **LARGEST FILE**
- `index.ts` (24 lines)

**Key types to define:**
- `SearchResult` interface: id, score, metadata, content, tier, importance
- `BM25Document` interface: id, text, tokens, idf
- `HybridConfig` interface: alpha (vector weight), beta (BM25 weight)
- `RRFConfig` interface: k parameter, weight
- `IntentType` type: `'add_feature' | 'fix_bug' | 'refactor' | 'security_audit' | 'understand'`

**Top complex file:**
- `vector-index.ts` (3,309 lines) — SQLite schema, migrations, vector search operations
  - Type all database query results
  - Type `better-sqlite3` interactions with `@types/better-sqlite3`
  - Type `sqlite-vec` interactions with custom `.d.ts` from Phase 1

**Dependencies:** Layer 5b, `sqlite-vec.d.ts` from Phase 1

**Agent assignment:** Agent 2

---

### Layer 5d: lib/storage/ (8 files, 3,022 lines)

**Files:**
- `access-tracker.ts` (188 lines)
- `history.ts` (373 lines)
- `causal-edges.ts` (661 lines)
- `checkpoints.ts` (823 lines)
- `incremental-index.ts` (334 lines)
- `index-refresh.ts` (142 lines)
- `transaction-manager.ts` (474 lines)
- `index.ts` (27 lines)

**Key types to define:**
- `CausalEdge` interface: sourceId, targetId, relationType, strength, bidirectional
- `RelationType` union of 6 types: `'supersedes' | 'contradicts' | 'supports' | 'extends' | 'implements' | 'references'`
- `Checkpoint` interface with gzip compression typing
- `HistoryEvent` type: action, actor, timestamp, metadata
- `TransactionResult` interface: success, affectedRows, rollbackReason

**Dependencies:** Layer 5c

**Agent assignment:** Agent 3

---

### Layer 5e: lib/session/ (4 files, 1,217 lines)

**Files:**
- `channel.ts` (150 lines)
- `session-manager.ts` (1,045 lines)
- `index.ts` (22 lines)
- Re-export wrapper: `lib/channel.ts` (5 lines)

**Key types to define:**
- `SessionState` interface: id, startTime, channel, activeMemories, deduplicationCache
- `DeduplicationResult` type: isDuplicate, matchedId, similarity
- `Channel` enum: `CLAUDE_CODE`, `SLACK`, `API`

**Top complex file:**
- `session-manager.ts` (1,045 lines) — session state, deduplication, crash recovery

**Dependencies:** Layer 5d

**Agent assignment:** Agent 3

---

### Layers 5f–5h: Remaining lib/ modules (7 files, 1,806 lines)

**Files (parallelizable):**
- `lib/cache/tool-cache.ts` (546 lines)
- `lib/cache/index.ts` (13 lines)
- `lib/learning/corrections.ts` (698 lines)
- `lib/learning/index.ts` (14 lines)
- `lib/providers/retry-manager.ts` (515 lines)
- `lib/providers/embeddings.ts` (10 lines, re-export stub)
- `lib/providers/index.ts` (10 lines)

**Key types to define:**
- `CacheEntry<T>` generic: value, expiresAt, size, lastAccessed
- `CacheStats` interface: hits, misses, evictions, currentSize
- `CorrectionType` enum: `SUPERSEDED`, `DEPRECATED`, `REFINED`, `MERGED`
- `Correction` interface: type, targetId, replacementId, reason, timestamp

**Dependencies:** Layers 5a–5e

**Agent assignment:** Agent 4

---

### Layer 5i: hooks/ (2 files, 194 lines)

**Files:**
- `hooks/memory-surface.ts` (161 lines)
- `hooks/index.ts` (33 lines)

**Key types to define:**
- `SurfaceConfig` interface: maxMemories, triggerThreshold
- `MemoryAwareTool` interface: name, requiresContext

**Dependencies:** Layer 5c (trigger-matcher), Layer 5h (vector-index)

**Agent assignment:** Agent 5

---

### Layer 5j: handlers/ (10 files, 5,029 lines)

**Files:**
- `memory-context.ts` (396 lines)
- `memory-search.ts` (790 lines)
- `memory-triggers.ts` (263 lines)
- `memory-save.ts` (1,215 lines) — **LARGEST HANDLER**
- `memory-crud.ts` (494 lines)
- `memory-index.ts` (374 lines)
- `causal-graph.ts` (496 lines)
- `checkpoints.ts` (255 lines)
- `session-learning.ts` (691 lines)
- `index.ts` (56 lines)

**Key types to define:**
- `HandlerResult<T>` generic: success, data, error, metadata
- Per-handler input/output types (e.g., `MemorySearchInput`, `MemorySearchOutput`)

**Top complex files:**
- `memory-save.ts` (1,215 lines) — PE gating, FSRS scheduling, causal links, atomic saves
  - Type prediction error evaluation
  - Type FSRS scheduling integration
  - Type causal link processing
  - Type atomic save transaction
- `memory-search.ts` (790 lines) — full search pipeline
  - Type query → hybrid search → reranking → dedup → format flow

**Dependencies:** All 5a–5i

**Agent assignment:** Agent 5

---

### Layers 5k–5l: Entry Points (2 files, 644 lines)

**Files (parallelizable):**
- `scripts/reindex-embeddings.ts` (119 lines)
- `context-server.ts` (525 lines)

**Key types for context-server.ts:**
- MCP SDK `Server` initialization types
- All 20+ tool input schemas (TypeScript interfaces)
- Tool dispatch switch with typed handlers
- Request/response envelope types

**Dependencies:** All handlers (5j)

**Agent assignment:** Agent 6

---

### Layer 5m: Master Barrel (1 file)

**File:**
- `lib/index.ts` (50 lines)

**Purpose:** Re-export all lib/ sub-modules in organized sections.

**Dependencies:** All lib/ modules

**Agent assignment:** Agent 6

---

## 4. Agent Allocation (Session 3)

| Agent | Task | Est. files |
|-------|------|-----------|
| Agent 1 | Phase 5a+5b: lib/embeddings/ + lib/cognitive/ | 13 files |
| Agent 2 | Phase 5c: lib/search/ | 9 files |
| Agent 3 | Phase 5d+5e: lib/storage/ + lib/session/ | 12 files |
| Agent 4 | Phase 5f+5g+5h: lib/cache/ + lib/learning/ + lib/providers/ | 7 files |
| Agent 5 | Phase 5i+5j: hooks/ + handlers/ | 12 files |
| Agent 6 | Phase 5k+5l: scripts/ + context-server.ts + lib/index.ts | 3 files |

**Parallel execution:**
- Agents 1–3 work sequentially on dependent layers
- Agent 4 starts after Agent 3 completes 5e
- Agent 5 starts after Agent 4 completes 5h
- Agent 6 starts after Agent 5 completes 5j

---

## 5. Verification Strategy

### Per-File Verification
1. `tsc --noEmit` on individual file — 0 errors
2. Import from compiled output in test file — exports resolve correctly
3. Run existing tests — 100% pass rate

### Per-Layer Verification
1. All files in layer compile together
2. Barrel exports resolve correctly
3. No circular imports within layer

### Phase 5 Final Verification
1. `tsc --build mcp_server` — full compilation, 0 errors
2. All 46 mcp_server tests pass against compiled TypeScript output
3. MCP server starts: `node mcp_server/context-server.js` initializes without errors
4. All 20+ MCP tools listed in server initialization log

---

## 6. Risk Mitigations

| Risk | Mitigation |
|------|-----------|
| `vector-index.ts` is 3,309 lines | Break into 3-hour work session with incremental compilation checks |
| `memory-save.ts` has complex PE gating | Type PE evaluation separately, then integrate with save logic |
| SQLite query results vary by schema version | Type all schema migration functions first, then queries |
| MCP SDK types may be incomplete | Use `@modelcontextprotocol/sdk` types where available, fallback to `unknown` + narrow |
| Handler input schemas are JSON | Define TypeScript interfaces matching JSON schema structure |

---

## 7. Success Criteria

- [ ] All 42 files converted to TypeScript
- [ ] `tsc --build mcp_server` completes with 0 errors
- [ ] All 46 mcp_server tests pass (100% pass rate)
- [ ] MCP server starts and initializes all 20+ tools
- [ ] No `any` in handler public API signatures
- [ ] All database interactions properly typed

---

## Cross-References

- **Parent Spec:** `092-javascript-to-typescript/spec.md`
- **Master Plan:** `092-javascript-to-typescript/plan.md` (lines 264–285)
- **Tasks:** See `tasks.md`
- **Checklist:** See `checklist.md`
- **Decisions:** Inherits D1–D7 from parent `decision-record.md`
