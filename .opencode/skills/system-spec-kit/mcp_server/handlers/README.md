---
title: "Handlers"
description: "MCP tool handlers and save/index orchestration helpers."
trigger_phrases:
  - "MCP handlers"
  - "memory handlers"
---

# Handlers

---

## 1. OVERVIEW

`handlers/` is the MCP-facing handler layer. `handlers/index.ts` lazily imports handler modules and re-exports public functions used by the tool dispatch layer.

Current state:

- Memory context, search, trigger, save, CRUD, indexing, ingestion, embedder management, embedding reconcile, lifecycle, checkpoint, causal graph, session bootstrap, session health, session resume, session learning, and evaluation handlers live here.
- `memory-crud.ts` is a stable facade over the decomposed `memory-crud-*` submodules (list, delete, update, stats, health, plus shared utils and types).
- `memory-index.ts` owns scan and re-index work with concurrent-scan coalescing and orphan sweep, while `memory-index-discovery.ts` and `memory-index-alias.ts` hold the spec-discovery and alias-reconcile helpers it depends on.
- `memory-save.ts` is the public save entrypoint and delegates to the decomposed `save/` pipeline.
- `mutation-hooks.ts` coordinates post-mutation cache invalidation for index and update flows.
- Packet continuity remains owned by resume tools and spec docs rather than handler-local state.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                            HANDLERS                              │
╰──────────────────────────────────────────────────────────────────╯

┌────────────────┐      ┌────────────────────┐      ┌────────────────────┐
│ MCP tool       │ ───▶ │ handlers/index.ts  │ ───▶ │ handler modules    │
│ dispatch       │      │ lazy registry      │      │ memory, session,   │
└───────┬────────┘      └─────────┬──────────┘      │ causal, eval       │
        │                         │                 └─────────┬──────────┘
        │                         ▼                           ▼
        │              ┌────────────────────┐       ┌────────────────────┐
        └──────────▶   │ handler-utils.ts   │ ───▶  │ storage, graph,    │
                       │ shared responses   │       │ search, scripts    │
                       └─────────┬──────────┘       └─────────┬──────────┘
                                 │                            │
                                 ▼                            ▼
                       ┌────────────────────┐       ┌────────────────────┐
                       │ mutation-hooks.ts  │       │ typed MCP result   │
                       │ cache invalidation │       │ and metadata       │
                       └────────────────────┘       └────────────────────┘

Dependency direction: tool dispatch ───▶ handler registry ───▶ focused handlers ───▶ lib and storage.
```

---

## 3. DIRECTORY TREE

```text
mcp_server/handlers/
├── index.ts                       # Lazy-loading handler registry
├── types.ts                       # Shared handler types
├── handler-utils.ts               # Shared response helpers
├── mutation-hooks.ts              # Post-mutation cache invalidation
├── memory-context.ts              # L1 intent-aware context assembly
├── memory-search.ts               # L2 hybrid search with telemetry and profiles
├── memory-triggers.ts             # L2 trigger matching and tiered content injection
├── memory-save.ts                 # Public save entrypoint into save/
├── memory-crud.ts                 # Stable CRUD facade over the focused submodules
├── memory-crud-list.ts            # CRUD list submodule
├── memory-crud-delete.ts          # CRUD delete submodule
├── memory-crud-update.ts          # CRUD update submodule
├── memory-crud-stats.ts           # CRUD stats submodule
├── memory-crud-health.ts          # memory_health endpoint + data.routing telemetry block
├── memory-crud-utils.ts           # Shared CRUD helpers
├── memory-crud-types.ts           # Shared CRUD types
├── memory-bulk-delete.ts          # Bulk delete by importance tier
├── memory-retention-sweep.ts      # Expired record retention enforcement
├── memory-index.ts                # Scan and re-index with coalescing and orphan sweep
├── memory-index-scan-jobs.ts      # Background memory_index_scan status/cancel handlers
├── memory-index-discovery.ts      # Spec document discovery and spec-level detection
├── memory-index-alias.ts          # Alias conflict and divergence reconcile summaries
├── memory-ingest.ts               # Async ingestion lifecycle
├── memory-embedding-reconcile.ts  # memory_embedding_reconcile tool handler
├── embedder-list.ts               # embedder_list tool handler
├── embedder-set.ts                # embedder_set tool handler
├── embedder-status.ts             # embedder_status tool handler
├── checkpoints.ts                 # Checkpoint create, list, restore, delete, validate
├── session-bootstrap.ts           # session_bootstrap tool handler
├── session-health.ts              # session_health tool handler
├── session-resume.ts              # session_resume tool handler
├── session-learning.ts            # Preflight, postflight, and learning history
├── causal-graph.ts                # Causal link, unlink, stats, and drift why
├── causal-links-processor.ts      # Save-time causal edge processing
├── chunking-orchestrator.ts       # Save and index chunking orchestration
├── eval-reporting.ts              # Ablation analysis and dashboard reports
├── pe-gating.ts                   # Prediction-error save arbitration
├── quality-loop.ts                # Verify-fix-verify scoring loop
├── v-rule-bridge.ts               # Validation script bridge
├── save/                          # Decomposed save pipeline modules
└── README.md
```

---

## 4. KEY FILES

| File or directory | Responsibility |
|---|---|
| `index.ts` | Lazy-loads and re-exports public handler functions. |
| `memory-context.ts` | Builds intent-aware context for auto, deep, focused, and resume modes. |
| `memory-search.ts` | Runs hybrid memory retrieval with profiles and telemetry. When the embedder is unavailable, search degrades to lexical retrieval and the response carries `embedder_available:false` rather than returning empty. |
| `memory-triggers.ts` | Matches trigger phrases and injects tiered content. |
| `memory-save.ts` | Owns save entry validation and routes work into `save/`. Invalidates entity-density cache via `invalidateEntityDensityCache()` after successful single-row commit (warn-once on failure). |
| `memory-crud.ts` | Provides the stable CRUD facade for list, delete, update, stats, and health. |
| `memory-crud-health.ts` | `memory_health` handler. Exposes auto-repair, FTS rebuild stats, orphan cleanup, and a `data.routing` telemetry block with `graphChannelInvocationRate`, `channelInvocationCounts`, `channelInvocationRates`, graph contribution counters, degree contribution counters, `totalRecorded`, and `windowSize`. The `backgroundEnrichment` block also surfaces `pending` and `failed` enrichment gauges derived from the at-rest `post_insert_enrichment_status` distribution so a stuck enrichment backlog is visible. |
| `memory-bulk-delete.ts` | Bulk delete by importance tier. Invalidates entity-density cache after successful bulk commit (also fires on partial-failure bulk paths to be safe). |
| `mutation-hooks.ts` | Clears trigger, constitutional, graph, co-activation, tool, and degree caches after mutations. |
| `memory-index.ts` | Runs `memory_index_scan` work. Coalesces concurrent scans onto an in-flight or recent scan, re-indexes changed spec docs, and runs a global orphan sweep over stale index rows. |
| `memory-index-scan-jobs.ts` | Implements `memory_index_scan_status` and `memory_index_scan_cancel` for background scan jobs created with `memory_index_scan({ background: true })`. |
| `memory-index-discovery.ts` | Discovers spec documents under a workspace and detects spec level through `findSpecDocuments` and `detectSpecLevel`. |
| `memory-index-alias.ts` | Builds alias-conflict and divergence-reconcile summaries used by index scan. |
| `memory-crud-*.ts` | Focused CRUD submodules (`memory-crud-list`, `memory-crud-delete`, `memory-crud-update`, `memory-crud-stats`, `memory-crud-utils`, `memory-crud-types`) behind the `memory-crud.ts` facade. `memory-crud-update.ts` rejects edits that remove a constitutional row's own protection (`E_CONSTITUTIONAL_SELF_EDIT`) and honors an optional `expectedHash` compare-and-swap that rejects a stale-read constitutional overwrite (`E_STALE_CONSTITUTIONAL_UPDATE`); the non-constitutional update path is unchanged and `expectedHash` is an additive optional tool param. |
| `memory-embedding-reconcile.ts` | `memory_embedding_reconcile` tool handler. Reconciles stored embeddings against the active embedder shard. |
| `embedder-list.ts`, `embedder-set.ts`, `embedder-status.ts` | `embedder_list`, `embedder_set`, and `embedder_status` tool handlers for embedder selection and health. |
| `session-bootstrap.ts`, `session-health.ts`, `session-resume.ts` | `session_bootstrap`, `session_health`, and `session_resume` tool handlers for session context and continuity recovery. |
| `save/` | Contains the decomposed save pipeline modules. |

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Public surface | Export callable handler functions through `index.ts`. |
| Module loading | Keep handler modules lazy so startup stays light. |
| Save pipeline | Keep orchestration in `memory-save.ts` and detailed stages in `save/`. |
| Cache invalidation | Route mutation cleanup through `mutation-hooks.ts`. |
| Continuity | Do not treat handler-local output as canonical packet continuity. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ MCP tool dispatch receives tool request  │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ handlers/index.ts resolves handler       │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Focused handler validates and runs work  │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Shared libs, storage, graph, or scripts  │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Mutation hook clears affected caches     │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ Handler returns typed MCP response       │
╰──────────────────────────────────────────╯
```

---

## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `index.ts` | Module | Public handler registry for tool dispatch. |
| `handleMemoryContext` | Function | Builds unified memory context responses. |
| `handleMemorySearch` | Function | Runs indexed continuity search. |
| `handleMemoryMatchTriggers` | Function | Runs fast trigger phrase matching. |
| `handleMemorySave` | Function | Saves and indexes spec or constitutional documents. |
| `runPostMutationHooks` | Function | Clears affected caches after mutation handlers. |

---

## 7. VALIDATION

Run from `.opencode/skills/system-spec-kit/mcp_server` unless noted.

```bash
npx vitest run handlers
```

Expected result: handler suites exit with Vitest success.

---

## 8. RELATED

- [`../tools/README.md`](../tools/README.md)
- [`../core/README.md`](../core/README.md)
- [`../hooks/README.md`](../hooks/README.md)
