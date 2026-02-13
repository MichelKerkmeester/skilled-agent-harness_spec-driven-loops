# Verification Checklist: Phase 5 — mcp_server/ Upper Layers TypeScript Conversion

> **Parent Spec:** 092-javascript-to-typescript/

---

## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval to defer |
| **[P2]** | Optional | Can defer with documented reason |

**Evidence format:** When marking `[x]`, provide evidence on the next line:
```
- [x] CHK-NNN [Px] Description
  - **Evidence**: [compilation output / test result / file existence / screenshot]
```

---

## Phase 5: mcp_server/ Upper Layers Verification

### Complex Module Conversion

- [ ] CHK-100 [P0] `lib/cognitive/` (11 files) — FSRS, decay, consolidation, tier classifier all typed
  - **Evidence**:
  - `TierState` type: `'HOT' | 'WARM' | 'COLD' | 'DORMANT' | 'ARCHIVED'`
  - `PE_ACTIONS` type: `'CREATE' | 'UPDATE' | 'SUPERSEDE' | 'REINFORCE' | 'CREATE_LINKED'`
  - `ConsolidationPhase` enum: REPLAY, ABSTRACT, INTEGRATE, PRUNE
  - FSRS grade constants typed

- [ ] CHK-101 [P0] `lib/search/` (9 files) — vector-index (3,309 lines) fully typed
  - **Evidence**:
  - All SQLite query results typed
  - Schema migration functions typed
  - Vector search input/output typed
  - `better-sqlite3` and `sqlite-vec` interactions properly typed

- [ ] CHK-102 [P0] `lib/storage/` (8 files) — causal edges, checkpoints, transactions typed
  - **Evidence**:
  - `CausalEdge` interface with 6 `RelationType` values
  - `Checkpoint` interface with gzip compression
  - `TransactionResult` interface for atomic operations

- [ ] CHK-103 [P0] `lib/session/` (4 files) — session manager (1,045 lines) fully typed
  - **Evidence**:
  - Deduplication logic typed
  - Crash recovery typed
  - Session state management typed

- [ ] CHK-104 [P0] `lib/cache/` (2 files) — `CacheEntry<T>` generic, LRU eviction typed
  - **Evidence**:

- [ ] CHK-105 [P0] `lib/learning/` (2 files) — corrections with `CorrectionType` enum
  - **Evidence**:

- [ ] CHK-106 [P0] `lib/embeddings/` (2 files) — provider chain with `ProviderTier` enum
  - **Evidence**:

- [ ] CHK-107 [P0] `lib/providers/` (3 files) — retry manager re-export typed
  - **Evidence**:

### Handler Conversion

- [ ] CHK-108 [P0] `handlers/memory-search.ts` (790 lines) — search pipeline fully typed
  - **Evidence**:
  - Query → hybrid search → reranking → dedup → format pipeline typed end-to-end

- [ ] CHK-109 [P0] `handlers/memory-save.ts` (1,215 lines) — PE gating, FSRS, atomic saves typed
  - **Evidence**:
  - Prediction error evaluation typed
  - FSRS scheduling typed
  - Causal link processing typed
  - Atomic save transaction typed

- [ ] CHK-110 [P0] All 9 handlers + index (10 files) — compile and export correctly
  - **Evidence**:

- [ ] CHK-111 [P0] `hooks/memory-surface.ts` — auto-surface typed
  - **Evidence**:

### Entry Points

- [ ] CHK-112 [P0] `context-server.ts` (525 lines) — MCP entry point with all 20+ tool definitions typed
  - **Evidence**:
  - All tool input schemas typed
  - Tool dispatch switch typed
  - MCP SDK initialization typed

- [ ] CHK-113 [P0] `lib/index.ts` master barrel — all sub-module exports resolve
  - **Evidence**:

### Phase 5 Quality Gate

- [ ] CHK-114 [P0] `tsc --build mcp_server` — full compilation, 0 errors
  - **Evidence**:

- [ ] CHK-115 [P0] All 46 mcp_server tests pass against compiled TypeScript output
  - **Evidence**:

- [ ] CHK-116 [P0] MCP server starts: `node mcp_server/context-server.js` initializes without errors
  - **Evidence**:

- [ ] CHK-117 [P0] All 20+ MCP tools listed in server initialization log
  - **Evidence**:

---

## Verification Summary

| Category | Total | Verified | Priority Breakdown |
|----------|------:|--------:|-------------------|
| Complex Module Conversion | 8 | /8 | 8 P0 |
| Handler Conversion | 4 | /4 | 4 P0 |
| Entry Points | 2 | /2 | 2 P0 |
| Phase 5 Quality Gate | 4 | /4 | 4 P0 |
| **TOTAL** | **18** | **/18** | **18 P0** |

**Verification Date**: ________________

---

## Cross-References

- **Parent Spec:** `092-javascript-to-typescript/spec.md`
- **Master Checklist:** `092-javascript-to-typescript/checklist.md` (lines 343–429)
- **Plan:** See `plan.md`
- **Tasks:** See `tasks.md`
