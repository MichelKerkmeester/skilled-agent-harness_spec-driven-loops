---
title: "Code Graph Library: Indexing, Readiness And Context"
description: "Core implementation modules for structural indexing, SQLite graph storage, readiness checks, recovery operations and compact graph context."
trigger_phrases:
  - "code graph library"
  - "structural indexer"
  - "code graph db"
  - "readiness contract"
  - "code graph apply"
---

# Code Graph Library: Indexing, Readiness And Context

> Core graph implementation behind the `mk-code-index` MCP handlers.

---

## 1. OVERVIEW

`lib/` owns the implementation behind the code graph handlers. It indexes source files, stores graph records in SQLite, resolves seeds, builds compact context payloads, runs recovery workflows and reports readiness metadata for callers that need false-safe graph reads.

Current state:

- The indexer parses TypeScript, JavaScript, Python and shell files through tree-sitter with fallback handling.
- JSON, JSONC, YAML, YML and TOML config files can be registered as `language='doc'` rows when `.opencode/` folders are explicitly opted in. Markdown and other prose docs are not indexed — the code graph models code and structured config, not documentation.
- The database layer stores files, nodes, edges, metadata, diagnostics, parser skip-list rows and verification records.
- Context builders merge structural graph, Spec Kit memory and Code Graph inputs under token budgets.
- Apply-mode recovery runs pre and post verification before committing graph repair operations.

---

## 2. ARCHITECTURE

```text
handlers/*
  -> readiness and result adapters
  -> indexer, query, context, verify or apply modules
  -> parser, database, budget and recovery helpers
  -> SQLite graph state or typed payload
```

Dependency direction:

```text
handlers -> lib/index.ts
read paths -> ensure-ready -> database and scope policy
scan paths -> structural-indexer -> parser -> database
context paths -> seed-resolver -> database -> budget allocator
apply paths -> apply-orchestrator -> recovery procedures and verification
database does not import handlers
```

---

## 3. PACKAGE TOPOLOGY

```text
lib/
+-- index.ts                    # Public library barrel
+-- structural-indexer.ts       # Workspace walk, parse and persist pipeline
+-- tree-sitter-parser.ts       # AST extraction and parser selection
+-- parser-skip-list.ts         # Parser-failure quarantine storage
+-- code-graph-db.ts            # SQLite schema and graph queries
+-- canonical-db-dir.ts         # Canonical DB directory resolution and containment
+-- close-db-assertion.ts       # DB close assertion helper
+-- code-graph-context.ts       # Compact context assembly
+-- seed-resolver.ts            # File and line seeds to graph nodes
+-- compact-merger.ts           # Memory, graph and Code Graph merge
+-- ensure-ready.ts             # Readiness guard and scan trigger logic
+-- readiness-contract.ts       # Readiness and trust vocabulary
+-- owner-lease.ts              # Single-owner lifecycle lease
+-- query-result-adapter.ts     # Stable handler result shapes
+-- apply-orchestrator.ts       # Verification-gated recovery dispatcher
+-- apply-metadata.ts           # Apply-mode audit metadata helpers
+-- recovery-procedures.ts      # Graph recovery operations
+-- diff-parser.ts              # Unified diff parsing for detect_changes
+-- edge-drift.ts               # Edge distribution drift checks
+-- gold-query-verifier.ts      # Verification query execution
+-- gold-battery-runner.ts      # Verification battery orchestration
+-- budget-allocator.ts         # Token-budget distribution
+-- working-set-tracker.ts      # Recent file and symbol tracking
+-- runtime-detection.ts        # Runtime and hook policy checks
+-- indexer-types.ts            # Graph types and scan defaults
+-- index-scope-policy.ts       # Env and per-call scan scope policy
+-- ops-hardening.ts            # Query timeout and retry guards
+-- query-intent-classifier.ts  # Query intent routing
+-- startup-brief.ts            # Startup graph summary payloads
+-- phase-runner.ts             # Ordered phase execution helper
+-- shared/                     # Local contracts and runtime helper modules
+-- ipc/                        # Launcher socket bridge
+-- utils/                      # Workspace path helpers
`-- README.md
```

Allowed dependency direction:

```text
handlers -> lib/index.ts
lib/context modules -> lib/database and lib/seed modules
lib/indexer modules -> lib/parser modules -> lib/types
shared utilities -> no handler imports
```

Disallowed dependency direction:

```text
lib -> handlers
database layer -> MCP transport layer
parser layer -> startup or compaction surfaces
```

---

## 4. DIRECTORY TREE

```text
lib/
+-- apply-metadata.ts
+-- apply-orchestrator.ts
+-- auto-rescan-policy.ts
+-- budget-allocator.ts
+-- canonical-db-dir.ts
+-- close-db-assertion.ts
+-- code-graph-context.ts
+-- code-graph-db.ts
+-- compact-merger.ts
+-- diff-parser.ts
+-- edge-drift.ts
+-- ensure-ready.ts
+-- exclude-rule-classifier.ts
+-- gold-battery-runner.ts
+-- gold-query-verifier.ts
+-- index-scope-policy.ts
+-- index.ts
+-- indexer-types.ts
+-- ops-hardening.ts
+-- owner-lease.ts
+-- parser-skip-list.ts
+-- phase-runner.ts
+-- query-intent-classifier.ts
+-- query-result-adapter.ts
+-- readiness-contract.ts
+-- recovery-procedures.ts
+-- runtime-detection.ts
+-- seed-resolver.ts
+-- startup-brief.ts
+-- structural-indexer.ts
+-- tree-sitter-parser.ts
+-- working-set-tracker.ts
+-- shared/
+-- ipc/
+-- utils/
`-- README.md
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `structural-indexer.ts` | Walks files, applies scan filters, parses symbols and persists graph rows. |
| `tree-sitter-parser.ts` | Extracts AST-backed nodes and edges, skips doc-language rows and reports parser health. |
| `parser-skip-list.ts` | Stores per-file parser skip-list rows for repeated tree-sitter failures. |
| `code-graph-db.ts` | Owns SQLite schema, graph CRUD, statistics and startup highlights. |
| `canonical-db-dir.ts` | Resolves canonical DB directories and enforces workspace-contained overrides. |
| `close-db-assertion.ts` | Asserts stale DB handles are closed after lifecycle shutdown. |
| `code-graph-context.ts` | Builds token-bounded neighborhoods for `code_graph_context`. |
| `seed-resolver.ts` | Resolves manual, graph and Code Graph seeds to indexed graph nodes. |
| `compact-merger.ts` | Merges Spec Kit memory, code graph and Code Graph context payloads. |
| `ensure-ready.ts` | Determines whether graph reads can proceed or must return a blocked payload. |
| `readiness-contract.ts` | Defines readiness, canonical readiness and trust-state terms. |
| `query-result-adapter.ts` | Normalizes query handler result shapes. |
| `apply-orchestrator.ts` | Coordinates verification-gated graph recovery operations and rollback behavior. |
| `apply-metadata.ts` | Builds apply-mode audit metadata and log paths. |
| `recovery-procedures.ts` | Provides repair, rollback and corruption-recovery helpers. |
| `diff-parser.ts` | Parses unified diffs for `detect_changes`. |
| `edge-drift.ts` | Compares edge distributions for graph-quality drift. |
| `gold-query-verifier.ts` | Executes gold-query assertions against the current graph. |
| `gold-battery-runner.ts` | Runs and summarizes verification batteries. |
| `index-scope-policy.ts` | Resolves end-user-vs-skill-inclusive scan scope from env and per-call args. |
| `indexer-types.ts` | Defines graph node, edge, parse result, language and scan default types. |
| `startup-brief.ts` | Builds compact startup graph summaries for runtime surfaces. |
| `owner-lease.ts` | Acquires, refreshes, classifies and releases the single Code Graph owner lease. |
| `utils/workspace-path.ts` | Canonicalizes caller-supplied paths and enforces workspace containment. |
| `shared/` | Local contracts for payloads, metrics stubs, path helpers and MCP types. |
| `ipc/` | Socket bridge used by launcher-managed secondary clients. |

---

## 6. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Library modules may import local utilities, shared MCP server types and storage adapters. |
| Exports | `index.ts` exposes library modules to handlers and startup surfaces, including lifecycle helpers (`owner-lease.ts`, `canonical-db-dir.ts`, `close-db-assertion.ts`). |
| Ownership | Core graph state, parser behavior, readiness, recovery and context assembly live here. MCP argument handling lives in `../handlers/`. |
| Storage | SQLite persistence flows through `code-graph-db.ts`; callers should not write database files directly. |

Indexing flow:

```text
code_graph_scan handler
  -> structural-indexer applies scan filters
  -> parser extracts nodes and edges
  -> code-graph-db persists files and graph rows
  -> status and context reads use fresh graph state
```

Recovery flow:

```text
code_graph_apply handler
  -> apply-orchestrator runs preflight verification
  -> selected recovery procedure executes
  -> post verification confirms graph quality
  -> audit metadata records the outcome
```

---

## 7. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `index.ts` | Module | Public export surface for handlers and startup code. |
| `indexFiles()` | Function | Scans and indexes workspace files. |
| `initDb()` / `getDb()` / `closeDb()` | Functions | Manage the SQLite graph database lifecycle. |
| `upsertFile()` / `replaceNodes()` / `replaceEdges()` / `removeFile()` / `pruneDanglingEdges()` | Functions | Persist file, node, edge, deletion and dangling-edge cleanup state. |
| `getStats()` / `queryOutline()` / `queryEdgesFrom()` / `queryEdgesTo()` | Functions | Read graph statistics, file outlines and edge relationships. |
| `buildCodeGraphContext()` | Function | Produces compact graph neighborhoods. |
| `resolveSeeds()` | Function | Maps context seeds to graph nodes. |
| `ensureCodeGraphReady()` | Function | Checks readiness before graph reads. |
| `applyCodeGraph()` | Function | Runs verification-gated graph recovery operations. |
| `buildStartupBrief()` | Function | Builds startup graph summary payloads. |
| `acquireOwnerLease()` / `refreshOwnerLease()` / `releaseOwnerLease()` | Functions | Manage the Code Graph single-owner lifecycle lease. |
| `resolveCanonicalDbDir()` | Function | Resolves DB directory identity for owner and DB lifecycle boundaries. |
| `assertDbHandleClosed()` | Function | Proves a closed SQLite handle no longer accepts queries. |
| `lookupSkipList()` / `addToSkipList()` / `getSkipListSummary()` / `seedFromProduction()` / `recordSuccess()` | Functions | Skip-list reads, writes, summary and seed backfill. |
| `getParserHealth()` / `classifyError()` | Functions | Parser-health getter and parser-error classifier. |

---

## 8. VALIDATION

Run from the repository root.

```bash
.opencode/skills/system-code-graph/node_modules/.bin/tsc --noEmit -p .opencode/skills/system-code-graph/tsconfig.json
.opencode/skills/system-code-graph/node_modules/.bin/vitest --config .opencode/skills/system-code-graph/vitest.config.ts --run code-graph
```

Expected result: TypeScript exits `0`, and parser, indexer, context, readiness, recovery and database suites pass.

---

## 9. RELATED

| Document | Purpose |
|---|---|
| [../../README.md](../../README.md) | Skill-level overview and operator guide. |
| [../handlers/README.md](../handlers/README.md) | Handler-layer request adapters. |
| [../tools/README.md](../tools/README.md) | MCP dispatch and exports. |
| [shared/README.md](./shared/README.md) | Local contracts and shared helper modules. |
| [ipc/README.md](./ipc/README.md) | Launcher IPC socket bridge. |
| [utils/README.md](./utils/README.md) | Workspace path helper contract. |
