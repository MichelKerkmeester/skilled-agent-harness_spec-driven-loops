---
title: "Save Handler: Memory Save Pipeline"
description: "Code-folder guide for the memory_save handler modules that validate, arbitrate, persist, enrich and format memory saves."
trigger_phrases:
  - "save handler"
  - "memory save pipeline"
  - "memory_save handler"
  - "atomic memory save"
---

# Save Handler: Memory Save Pipeline

> Runtime stages for validating, arbitrating, persisting, enriching and formatting `memory_save` requests.

---

## 1. OVERVIEW

`handlers/save/` owns the decomposed runtime path behind the `memory_save` MCP handler. The folder keeps save orchestration split into small stages for validation, duplicate detection, embedding, prediction-error arbitration, record creation, enrichment, atomic file promotion and response formatting.

Current responsibilities:

- Keep save-stage code below the top-level MCP tool handler and above storage/search adapters.
- Preserve same-folder save ordering through `withSpecFolderLock()`.
- Build rejection, dry-run, planner and success responses without leaking storage internals into callers, including the `metadataRefresh` advisory for content-only `memory_save` lanes.
- Route persistence through `createMemoryRecord()` and storage/search helpers rather than direct SQL scattered across the handler.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                         HANDLERS / SAVE                          │
╰──────────────────────────────────────────────────────────────────╯

┌─────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│ MCP save tool   │ ───▶ │ save modules     │ ───▶ │ create-record.ts │
│ memory_save     │      │ validation + PE  │      │ vector + BM25    │
└────────┬────────┘      └────────┬─────────┘      └────────┬─────────┘
         │                        │                         │
         │                        ▼                         ▼
         │              ┌──────────────────┐      ┌──────────────────┐
         └──────────▶   │ atomic wrapper   │ ───▶ │ storage/search   │
                        │ file promotion   │      │ adapters         │
                        └────────┬─────────┘      └──────────────────┘
                                 │
                                 ▼
                        ┌──────────────────┐
                        │ response builder │
                        └──────────────────┘

Dependency direction:
MCP tool handler ───▶ handlers/save ───▶ lib/storage + lib/search + lib/cognitive
handlers/save does not import from MCP transport or spec-folder docs.
```

---

## 3. PACKAGE TOPOLOGY

```text
handlers/save/
+-- index.ts                    # Test-facing export barrel
+-- types.ts                    # Shared contracts for save stages
+-- dedup.ts                    # Existing row and content-hash checks
+-- embedding-pipeline.ts       # Embedding cache and provider path
+-- pe-orchestration.ts         # Prediction-error decision routing
+-- reconsolidation-bridge.ts   # Optional reconsolidation pass
+-- create-record.ts            # Memory row creation and indexing
+-- db-helpers.ts               # Local metadata and checkpoint helpers
+-- post-insert.ts              # Entity, summary and causal enrichment
+-- response-builder.ts         # MCP result envelopes
+-- atomic-index-memory.ts      # Pending-file promotion and rollback wrapper
+-- markdown-evidence-builder.ts # Markdown evidence extraction for validation
+-- spec-folder-mutex.ts        # In-process and interprocess save lock
+-- validation-responses.ts     # Rejection, dry-run and planner builders
`-- README.md
```

Allowed dependency direction:

```text
handler entrypoint → handlers/save → lib/storage
handler entrypoint → handlers/save → lib/search
handler entrypoint → handlers/save → lib/cognitive
handlers/save → handlers shared utilities
```

Disallowed dependency direction:

```text
lib/storage → handlers/save
lib/search → handlers/save
handlers/save → spec packet files
handlers/save → MCP transport internals
```

---

## 4. DIRECTORY TREE

```text
handlers/save/
+-- atomic-index-memory.ts
+-- create-record.ts
+-- db-helpers.ts
+-- dedup.ts
+-- embedding-pipeline.ts
+-- index.ts
+-- markdown-evidence-builder.ts
+-- pe-orchestration.ts
+-- post-insert.ts
+-- reconsolidation-bridge.ts
+-- response-builder.ts
+-- spec-folder-mutex.ts
+-- types.ts
+-- validation-responses.ts
`-- README.md
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `types.ts` | Shared interfaces for parsed memory, save arguments, PE decisions, planner payloads, atomic saves and post-insert metadata. |
| `index.ts` | Export barrel for tests and controlled consumers. Production imports usually target concrete modules. |
| `dedup.ts` | Detects unchanged paths and duplicate content hashes before heavier save work runs. |
| `embedding-pipeline.ts` | Reads and writes embedding cache entries, calls the embedding provider when needed and supports pending embedding status. |
| `pe-orchestration.ts` | Finds similar memories, runs prediction-error gating and applies create, update, reinforce, supersede or linked-create actions. |
| `reconsolidation-bridge.ts` | Runs optional checkpoint-gated reconsolidation before normal record creation. |
| `create-record.ts` | Inserts memory rows, records lineage/history, writes vector/BM25 data and applies post-insert metadata. |
| `db-helpers.ts` | Applies guarded metadata updates and checks reconsolidation checkpoint prerequisites. |
| `post-insert.ts` | Runs feature-flagged enrichment for causal links, entities, summaries and cross-document entity links. Default-on; runs async/deferred via a background scheduler unless `SPECKIT_POST_INSERT_ENRICHMENT_SYNC=true`. |
| `response-builder.ts` | Converts save results and planner payloads into MCP success or error envelopes, including `metadataRefresh: { refreshed:false, refreshedBy:'generate-context save lane' }` on mutating packet-doc saves where the MCP content-indexing lane did not refresh packet metadata. |
| `atomic-index-memory.ts` | Coordinates pending-file writes, file promotion, rollback, retry and save-result mapping for atomic save paths. |
| `markdown-evidence-builder.ts` | Extracts headings, lists, tables and summary evidence from markdown for memory sufficiency checks. |
| `spec-folder-mutex.ts` | Serializes saves per spec folder across local async chains and temporary interprocess lock directories. |
| `validation-responses.ts` | Builds insufficiency rejections, template-contract rejections, dry-run summaries and planner diagnostics. |

---

## 6. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Save modules may call handler utilities plus `lib/storage`, `lib/search`, `lib/cognitive`, parsing and provider modules. |
| Exports | `index.ts` exposes stable test and helper exports. Runtime code should prefer direct module imports when it owns a specific stage. |
| Storage | Record persistence belongs in `create-record.ts`, `db-helpers.ts` or `lib/storage/*`, not in validation or response modules. |
| Validation | Rejection builders stay pure. They receive parsed validation results and return `IndexResult` or planner objects without DB writes. |
| Concurrency | Any atomic file save must run through `withSpecFolderLock()` before promotion and indexing. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ memory_save request                      │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ parse and validate memory file            │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ dedup and embedding pipeline              │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ prediction-error and reconsolidation      │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ create record; post-insert enrichment     │
│ scheduled async (deferred) by default     │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ response builder and mutation hooks       │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ MCP response envelope                     │
╰──────────────────────────────────────────╯
```

---

## 7. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `createMemoryRecord()` | Function | Inserts a parsed memory and related index metadata after validation and PE routing. |
| `generateOrCacheEmbedding()` | Function | Resolves the embedding vector or pending status for save/index flows. |
| `evaluateAndApplyPeDecision()` | Function | Applies prediction-error decisions against similar memories. |
| `runPostInsertEnrichment()` | Function | Runs the default-on enrichment steps after a row exists. Default is async/deferred: the save returns immediately with `enrichmentStatus: deferred` and a bounded background scheduler runs the steps after commit. `SPECKIT_POST_INSERT_ENRICHMENT_SYNC=true` forces synchronous execution. |
| `buildSaveResponse()` | Function | Produces the final MCP success payload for a save result. |
| `withSpecFolderLock()` | Function | Wraps critical save sections with a per-spec-folder mutex. |
| `atomicIndexMemory()` | Function | Coordinates pending file promotion and indexing for atomic file-save callers. |

---

## 8. VALIDATION

Run from the repository root unless noted.

```bash
python3 .opencode/skills/sk-doc/scripts/extract_structure.py .opencode/skills/system-spec-kit/mcp_server/handlers/save/README.md
```

Expected result: the document is detected as a README and the extracted structure has no critical section or HVR issues.

Focused code checks for this folder normally run through the package test suite that covers `handlers/save/*` exports.

---

## 9. RELATED

- [`../README.md`](../README.md)
- [`../../lib/storage/README.md`](../../lib/storage/README.md)
- [`../../lib/search/README.md`](../../lib/search/README.md)
- [`../../database/README.md`](../../database/README.md)
