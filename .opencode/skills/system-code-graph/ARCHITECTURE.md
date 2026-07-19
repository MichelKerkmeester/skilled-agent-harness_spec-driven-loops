---
title: "Architecture: system-code-graph"
description: "Current package architecture for system-code-graph: tree-sitter parser, SQLite graph, readiness contract, MCP runtime, apply-mode recovery, hook integration, and validators."
trigger_phrases:
  - "system code graph architecture"
  - "code graph architecture"
  - "readiness contract"
  - "structural index"
  - "blast radius"
importance_tier: "important"
---

# Architecture: system-code-graph

> Current-reality architecture for the `system-code-graph` package. The skill scans source into a SQLite graph, answers structural relationship queries through a standalone MCP server, and refuses to answer on stale state.

---

## 1. OVERVIEW

`system-code-graph` is the standalone structural code intelligence runtime. It parses source files into a SQLite graph, exposes structural relationship queries through a standalone MCP server, and refuses to answer on stale state.

The package owns three authored zones:

- `mcp-server/` carries the MCP runtime, parser, storage, readiness contract, and recovery operations.
- `references/` carries operator primers on readiness, database path policy, and ownership boundaries.
- `feature-catalog/` and `manual-testing-playbook/` carry the per-tool inventory and validation scenarios.

Identity surfaces:

- Skill slug: `system-code-graph`
- MCP server name: `mk-code-index`
- Client namespace: `mcp__mk_code_index__*`
- Runtime package: `@spec-kit/system-code-graph`

Detail per tool lives in `feature-catalog/feature-catalog.md`. Readiness state details live in `references/readiness/code-graph-readiness-check.md`.

### Architecture diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                 SYSTEM-CODE-GRAPH PACKAGE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐     ┌──────────────────────┐              │
│  │   CLI Runtimes   │     │      AI Agents       │              │
│  │ Claude / OpenCode   │────▶│  (Structural queries)│              │
│  │ OpenCode         │     │                      │              │
│  └────────┬─────────┘     └──────────────────────┘              │
│           │                                                     │
│  ┌────────▼──────────────────────────────────────────────────┐  │
│  │                       mcp-server/                         │  │
│  │  ┌──────────┐ ┌──────────────────────────────────────┐   │  │
│  │  │handlers/ │ │                lib/                  │   │  │
│  │  │scan      │ │ tree-sitter parser adapter           │   │  │
│  │  │query     │ │ readiness contract                   │   │  │
│  │  │context   │ │ apply-mode recovery                  │   │  │
│  │  │status    │ │ gold-query verifier                  │   │  │
│  │  │verify    │ │ blast-radius + change detection      │   │  │
│  │  └──────────┘ └──────────────────────────────────────┘   │  │
│  │  plugin-bridges/         tests/                           │  │
│  └─────────────────────────┬─────────────────────────────────┘  │
│                            │                                    │
│                         ┌──┴──────────────┐                     │
│                         │   database/     │                     │
│                         │ code-graph      │                     │
│                         │ .sqlite         │                     │
│                         └─────────────────┘                     │
│                                                                 │
│  Dependency direction: handlers/ ──▶ lib/                       │
│                        parser adapter lives inside lib/          │
│                        lib/ ──▶ database/                       │
│                        plugin-bridges/ ──▶ lib/                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. PACKAGE TOPOLOGY

```text
system-code-graph/
├── mcp-server/             # Runtime MCP server
│   ├── index.ts            # MCP transport entrypoint (mk-code-index)
│   ├── tool-schemas.ts     # Public tool schema registry (source of truth)
│   ├── handlers/           # MCP tool handlers
│   ├── tools/              # Tool dispatcher and group helpers
│   ├── lib/                # Parser, readiness, apply-mode, query + context
│   ├── database/           # Local SQLite code-graph storage
│   ├── tests/              # Vitest + integration coverage
│   ├── stress-test/        # Pressure and degraded-mode coverage
│   ├── plugin-bridges/     # CLI bridge entrypoints
│   ├── core/               # Shared runtime helpers
│   └── dist/               # Generated build output (tsc → mcp-server/dist)
├── references/             # Operator primers
├── feature-catalog/        # Current feature inventory
└── manual_testing_playbook # Operator validation scenarios
```

Allowed dependency direction:

- `handlers/ ──▶ lib/`
- parser logic lives in `lib/tree-sitter-parser.ts`; there is no separate `parser/` package.
- `lib/ ──▶ database/`
- `plugin-bridges/ ──▶ lib/`

Reverse imports should be treated as boundary violations during review and CI.

---

## 3. CANONICAL CONTINUITY FLOWS

The code-graph treats its SQLite store as the durable record. Reads are gated by a readiness contract; the scan loop is the single writer.

**Read path:** every read tool consults `ensureCodeGraphReady()` before answering. Stale, empty, or scope-mismatched indexes return `status:"blocked"` with an explicit `requiredAction` rather than silent empty arrays. Fresh state returns structural results with readiness metadata attached.

**Write path:** `code_graph_scan` walks the workspace via `ignore`-aware globbing, parses changed files through tree-sitter, and persists file, symbol, and edge rows in SQLite under a single transactional writer. Meta fields track `last_scan_at`, `last_persisted_at`, and `last_git_head`.

**Key modules:**

- `mcp-server/lib/ensure-ready.ts` owns the read-path gate.
- `mcp-server/lib/structural-indexer.ts` owns the scan loop.
- `mcp-server/lib/readiness-contract.ts` owns the state machine.

---

## 4. RUNTIME SUBSYSTEMS

The MCP server is composed of focused subsystems that share the transport layer and the SQLite store.

**Parser.** Tree-sitter via `web-tree-sitter` and `tree-sitter-wasms` multi-language WASM grammars. Extracts files, symbols, and edges. Maintains a parser-skip list for files that fail parsing, surfaced through status metadata.

**Storage.** Primary store is SQLite via `better-sqlite3` at `.opencode/skills/system-code-graph/mcp-server/database/code-graph.sqlite`. The launcher's standalone-storage guard refuses to point the database outside the workspace.

**Readiness contract.** A hard refuse, not a soft degrade. <!-- OR-8-01: GraphFreshness is the four-value enum below; `absent` is the empty-graph trust-state projection, not a freshness state. --> Freshness states are `fresh`, `stale`, `empty`, `error` (`absent` is the empty-graph trust-state projection, not a freshness state). Read paths gate on the state machine and return blocked payloads with required actions; the contract avoids serving incorrect structural answers. Detail per state lives in `references/readiness/code-graph-readiness-check.md`.

**Apply-mode recovery.** Gated recovery operations (rescan, prune-excludes, repair-nodes, recover-sqlite-corruption, rollback-bad-apply) run the gold-query verification battery before AND after each operation. Audit log writes to JSONL. Rollback restores the last known-good baseline.

**Index lifecycle.** `code_graph_status` reports graph health and readiness, `code_graph_scan` runs the tree-sitter (re)index, and `code_graph_verify` runs the gold-query battery. All operate in-process against the local SQLite graph — there is no external search binary or separate semantic-index runtime.

---

## 5. HOOK AND PLUGIN INTEGRATION

The code-graph does not own its own SessionStart hook surface. The hook runtime lives in a sibling spec-kit package and reaches code-graph data through a stable boundary import. This asymmetry vs the advisor pattern is intentional and documented as ADR-001 below. Plugin bridges under `plugin-bridges/` provide CLI entrypoints for context-compaction callers; current status is documented inside the per-folder README.

---

## 6. ENFORCEMENT AND VERIFICATION

Verification runs at two layers.

**Gold-query battery.** `code_graph_verify` runs a curated set of structural queries against the current index and compares against persisted baselines. Apply-mode operations run this battery before and after every recovery action; failure rolls back to the last known-good baseline.

**Test surfaces.** Default vitest run covers unit and integration suites under `mcp-server/tests/`. Stress and degraded-mode coverage lives under `mcp-server/stress-test/`. Operator playbook scenarios live in `manual-testing-playbook/`.

---

## 7. DECISION RECORDS

| ADR | Subject | Status |
|---|---|---|
| ADR-001 | Hook ownership stays with the spec-kit sibling package; code-graph data accessed through a stable boundary import | Accepted |
| ADR-002 | Plugin and bridge names use `mk-code-graph` while the MCP server identity stays as `mk-code-index` for caller stability | Accepted |
| ADR-003 | Single-writer invariant on the SQLite graph: the scan loop (`code_graph_scan`) is the only writer of graph rows. Other tools are graph-read-only; `code_graph_status` is read-only with no readiness-marker write (the file-based readiness marker is written only at server startup and by the scan path). The read-path handlers may still run an inline self-heal reindex (`ensureCodeGraphReady`) which itself goes through the scan path. `code_graph_apply` mutates only under its verification-gated recovery contract. | Accepted |
| ADR-004 | Standalone-storage guard refuses to point the database outside the workspace | Accepted |
| ADR-005 | Three-way isolation finalize: code-graph runs as a standalone MCP server with no required runtime dependency on adjacent skills | Accepted |

---

## 8. RELATED

- [README.md](./README.md): Human-facing package overview
- [SKILL.md](./SKILL.md): Runtime routing and invariants
- [INSTALL-GUIDE.md](./INSTALL-GUIDE.md): Native bootstrap and per-runtime configuration
- [feature-catalog/feature-catalog.md](./feature-catalog/feature-catalog.md): Current feature inventory and per-tool detail
- [manual-testing-playbook/manual-testing-playbook.md](./manual-testing-playbook/manual-testing-playbook.md): Operator validation scenarios
- [references/readiness/code-graph-readiness-check.md](./references/readiness/code-graph-readiness-check.md): Readiness contract primer with state-machine detail
- [references/runtime/ownership-boundary.md](./references/runtime/ownership-boundary.md): Boundary rules for adjacent runtimes
- [references/config/database-path-policy.md](./references/config/database-path-policy.md): Workspace containment policy
