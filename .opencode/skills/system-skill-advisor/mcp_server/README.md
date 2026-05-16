---
title: "System Skill Advisor MCP Server"
description: "Standalone package home for skill-advisor handlers, libraries, schemas, scripts, tests, benchmarks and database ownership."
trigger_phrases:
  - "system skill advisor mcp server"
  - "advisor mcp server"
  - "advisor standalone package"
---

# System Skill Advisor MCP Server

> Standalone MCP runtime for skill recommendation routing, freshness tracking and skill graph relationship queries.

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. ARCHITECTURE](#2--architecture)
- [3. PACKAGE TOPOLOGY](#3--package-topology)
- [4. DIRECTORY TREE](#4--directory-tree)
- [5. KEY FILES](#5--key-files)
- [6. BOUNDARIES AND FLOW](#6--boundaries-and-flow)
- [7. ENTRYPOINTS](#7--entrypoints)
- [8. VALIDATION](#8--validation)
- [9. RELATED](#9--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`mcp_server/` owns the standalone `mk_skill_advisor` MCP server. It exposes 9 public tools across two surfaces: advisor routing (`advisor_*`) and skill graph queries (`skill_graph_*`).

Current state:

- `advisor-server.ts` (262 lines) is the MCP transport entrypoint. It registers tools, manages daemon lifecycle and triggers skill metadata indexing on startup.
- `tools/` defines tool descriptors and dispatches calls. `tools/index.ts:37-43` registers `TOOL_DEFINITIONS` with 4 advisor tools plus the spread of skill-graph tools.
- `handlers/` owns orchestration for advisor tools (recommend, rebuild, status, validate) and skill-graph subhandlers (scan, query, status, validate, propagate_enhances).
- `lib/` carries the runtime helpers across 11 subdirectories: `scorer/`, `daemon/`, `freshness/`, `lifecycle/`, `derived/`, `compat/`, `auth/`, `corpus/`, `cross-skill-edges/`, `context/` and `shadow/`, plus several flat modules.
- `database/skill-graph.sqlite` stores skill metadata, relationships and derived signals. Schema initialization and prepared queries live in `lib/skill-graph/skill-graph-db.ts` and `lib/skill-graph/skill-graph-queries.ts`.
- Packet 013/009/011 moved the skill graph DB/query library and startup lifecycle under this package. Extraction is complete.

This package is local-first. It reads repository-local skill metadata, writes package-local SQLite state and communicates with MCP clients via stdio transport.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:architecture -->
## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                 SKILL ADVISOR MCP SERVER                         │
╰──────────────────────────────────────────────────────────────────╯

┌──────────────┐      ┌──────────────────┐      ┌─────────────────┐
│ MCP clients  │ ───▶ │ advisor-server.ts│ ───▶ │ tools/          │
│ hooks / CLI  │      │ transport layer  │      │ tool dispatch   │
└──────┬───────┘      └────────┬─────────┘      └────────┬────────┘
       │                       │                         │
       │                       ▼                         ▼
       │              ┌──────────────────┐      ┌─────────────────┐
       └───────────▶  │ handlers/        │ ───▶ │ lib/            │
                      │ tool execution   │      │ runtime helpers │
                      └────────┬─────────┘      └────────┬────────┘
                               │                         │
                               ▼                         ▼
                      ┌──────────────────┐      ┌─────────────────┐
                      │ lib/skill-graph/ │ ───▶ │ database/       │
                      │ SQLite queries   │      │ skill-graph.db  │
                      └──────────────────┘      └─────────────────┘

Dependency direction:
advisor-server.ts ───▶ tools/ ───▶ handlers/ ───▶ lib/* ───▶ database/
handlers/ ───▶ schemas/ for contract validation
lib/ ───▶ database/skill-graph.sqlite through lib/skill-graph/ adapters
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:package-topology -->
## 3. PACKAGE TOPOLOGY

```text
mcp_server/
+-- advisor-server.ts        # MCP transport entrypoint and daemon lifecycle
+-- tools/                   # MCP tool descriptors and dispatch
+-- handlers/                # Tool handler orchestration
+-- lib/                     # Runtime helpers (scorer, daemon, freshness, skill-graph)
+-- schemas/                 # Zod and JSON contracts
+-- database/                # Local SQLite state
+-- data/                    # Package-local runtime data
+-- compat/                  # TypeScript bridge surface
+-- bench/                   # Benchmark harnesses
+-- tests/                   # Vitest and Python coverage
+-- scripts/                 # Python CLI and graph compiler utilities
+-- plugin_bridges/          # Runtime bridge packages
`-- README.md
```

Allowed dependency direction:

```text
advisor-server.ts → tools/ → handlers/ → lib/
handlers/ → schemas/
lib/ → database/
scripts/ → lib/
tests/ → lib/, handlers/, schemas/
```

Disallowed dependency direction:

```text
lib/ → tools/ (no MCP registration in lib)
lib/ → handlers/ (domain logic stays in lib)
database/ → runtime modules
schemas/ → handlers/ (schemas are contracts, not orchestration)
```

<!-- /ANCHOR:package-topology -->

---

<!-- ANCHOR:directory-tree -->
## 4. DIRECTORY TREE

```text
mcp_server/
+-- advisor-server.ts              # MCP server entrypoint and transport layer
+-- tools/                         # MCP tool definitions and dispatch
|   +-- advisor-recommend.ts
|   +-- advisor-rebuild.ts
|   +-- advisor-status.ts
|   +-- advisor-validate.ts
|   +-- skill-graph-tools.ts
|   +-- advisor-contract-keys.ts
|   +-- types.ts
|   +-- index.ts
|   `-- README.md
+-- handlers/                      # MCP tool handlers
|   +-- advisor-recommend.ts
|   +-- advisor-rebuild.ts
|   +-- advisor-status.ts
|   +-- advisor-validate.ts
|   +-- skill-graph/
|   |   +-- scan.ts
|   |   +-- query.ts
|   |   +-- status.ts
|   |   +-- validate.ts
|   |   +-- propagate-enhances.ts
|   |   +-- response-envelope.ts
|   |   +-- index.ts
|   |   `-- README.md
|   +-- index.ts
|   `-- README.md
+-- lib/                           # Runtime helpers and business logic
|   +-- skill-graph/               # SQLite schema and prepared queries
|   +-- scorer/                    # Lane attribution and fusion
|   +-- daemon/                    # Daemon lifecycle and watcher
|   +-- freshness/                 # Cache invalidation and trust state
|   +-- lifecycle/                 # Status, supersession, rollback
|   +-- derived/                   # Derived-metadata extraction and provenance
|   +-- compat/                    # Daemon probe and redirect metadata
|   +-- auth/                      # Trusted caller checks
|   +-- corpus/                    # df-idf corpus utilities
|   +-- cross-skill-edges/         # Inbound enhance-edge propagation
|   +-- context/                   # Caller context helpers
|   +-- shadow/                    # Shadow delta sink
|   +-- utils/                     # Internal utilities
|   +-- *.ts                       # Flat runtime modules (metrics, prompt-cache, render, etc.)
|   `-- README.md
+-- schemas/                       # Zod and JSON contracts
|   +-- advisor-tool-schemas.ts
|   +-- compat-contract.json
|   +-- daemon-status.ts
|   +-- generation-metadata.ts
|   +-- skill-derived-v2.ts
|   `-- README.md
+-- database/                      # SQLite runtime state
|   +-- skill-graph.sqlite
|   +-- .mk-skill-advisor-launcher.json
|   `-- README.md
+-- data/                          # Runtime data (shadow deltas)
|   +-- shadow-deltas.jsonl
|   `-- README.md
+-- compat/                        # Package-level compatibility export
|   +-- index.ts
|   `-- README.md
+-- bench/                         # Benchmark suites and baselines
|   +-- code-graph-parse-latency.bench.ts
|   +-- scorer-bench.ts
|   +-- scorer-calibration.bench.ts
|   +-- watcher-benchmark.ts
|   +-- latency-bench.ts
|   `-- README.md
+-- tests/                         # Vitest and Python coverage
|   +-- __shared__/
|   +-- handlers/
|   +-- scorer/
|   +-- schemas/
|   +-- python/
|   +-- parity/
|   `-- README.md
+-- scripts/                       # Python CLI and graph compiler
|   +-- skill_advisor.py
|   +-- skill_advisor_bench.py
|   +-- skill_advisor_regression.py
|   +-- skill_graph_compiler.py
|   +-- routing-accuracy/
|   `-- README.md
+-- plugin_bridges/                # Bridge packages
+-- README.md
+-- package.json
+-- tsconfig.json
`-- vitest.config.ts
```

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 5. KEY FILES

| File | Responsibility |
|---|---|
| `advisor-server.ts` (lines 1-262) | MCP transport entrypoint, tool registration, daemon startup, skill graph indexing via `indexSkillMetadata`. |
| `tools/index.ts` (lines 1-70) | Tool descriptor registry (`TOOL_DEFINITIONS` at lines 37-43) and dispatch router for 9 public tools. |
| `tools/skill-graph-tools.ts` (lines 1-143) | Skill graph tool definitions for scan, query, status, validate and propagate_enhances. |
| `handlers/index.ts` | Re-exports handler entrypoints for advisor and skill-graph operations. |
| `lib/skill-graph/skill-graph-db.ts` | SQLite schema initialization, metadata indexing, stats and row mapping. |
| `lib/skill-graph/skill-graph-queries.ts` | Prepared graph relationship queries (depends_on, dependents, enhances, hubs). |
| `lib/scorer/` | Native scoring implementation with lane-based attribution and calibration. |
| `lib/daemon/lifecycle.ts` | Advisor daemon startup, shutdown and lifecycle orchestration. |
| `database/skill-graph.sqlite` | Local SQLite database for skill metadata and relationships. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-flow -->
## 6. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Public API | MCP tools are exposed through `advisor-server.ts`, `tools/` and `handlers/`. |
| Transport → Tools | `advisor-server.ts` imports and dispatches through `tools/index.ts`. |
| Handler logic | Handlers may call `lib/`, schemas and database adapters. |
| Domain logic | `lib/` modules should not import handlers or MCP tool registration code. |
| Storage | SQLite access stays behind `lib/skill-graph/` adapters that own schema and migration rules. |
| Schemas | `schemas/` are contracts only. They do not orchestrate handlers. |
| Build output | `dist/` is generated output and is not a source dependency. |

Tool invocation flow:

```text
╭──────────────────────────────────────────╮
│ MCP client or runtime hook               │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ advisor-server.ts (transport layer)      │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ tools/index.ts (dispatch router)         │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ handlers/* (orchestration)               │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ lib/* (scorer, freshness, skill-graph)   │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ database/skill-graph.sqlite              │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ typed MCP response                       │
╰──────────────────────────────────────────╯
```

<!-- /ANCHOR:boundaries-flow -->

---

<!-- ANCHOR:entrypoints -->
## 7. ENTRYPOINTS

The server registers 9 public tools (4 advisor + 5 skill_graph) defined in `tools/index.ts:37-43` and `tools/skill-graph-tools.ts:22,35,55,61,67`. The MCP server identifier is `mk_skill_advisor`.

| Entrypoint | Type | Purpose |
|---|---|---|
| `advisor-server.ts` | MCP server | Main MCP server entrypoint, registers tools, manages daemon lifecycle. |
| `advisor_recommend` | Tool | Returns skill recommendations for a given prompt. |
| `advisor_rebuild` | Tool | Rebuilds the advisor index from skill metadata. |
| `advisor_status` | Tool | Reports advisor health, daemon state, freshness, generation and trust status. |
| `advisor_validate` | Tool | Validates advisor configuration and routing bundle. |
| `skill_graph_scan` | Tool | Indexes or re-indexes skill metadata into SQLite. |
| `skill_graph_query` | Tool | Queries skill graph relationships (dependencies, enhances, hubs). |
| `skill_graph_status` | Tool | Reports skill graph health and counts. |
| `skill_graph_validate` | Tool | Validates skill graph for schema drift, broken edges and cycles. |
| `skill_graph_propagate_enhances` | Tool | Detects and (opt-in) applies missing inbound enhance edges across skills. |
| `npm run build` | Command | Builds TypeScript into `dist/`. |
| `npm test` | Command | Runs Vitest and Python test coverage. |

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 8. VALIDATION

Run from `mcp_server/` unless noted.

```bash
npm run build
npm test -- --runInBand
```

Focused documentation checks from the repository root:

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-skill-advisor/mcp_server/README.md
python3 .opencode/skills/sk-doc/scripts/extract_structure.py .opencode/skills/system-skill-advisor/mcp_server/README.md
```

Expected result: build and tests exit 0, README validation reports no blocking issues and structure extraction returns a README document profile.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 9. RELATED

- [Skill README](../README.md)
- [Architecture](../ARCHITECTURE.md)
- [Tools](tools/README.md)
- [Handlers](handlers/README.md)
- [Library](lib/README.md)
- [Schemas](schemas/README.md)
- [Database](database/README.md)
- [Tests](tests/README.md)
- [Bench](bench/README.md)

<!-- /ANCHOR:related -->
