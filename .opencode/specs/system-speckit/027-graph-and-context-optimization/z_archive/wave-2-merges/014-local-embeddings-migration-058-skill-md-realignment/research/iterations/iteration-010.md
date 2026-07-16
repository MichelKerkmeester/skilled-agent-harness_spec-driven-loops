---
title: "Iter 010 — Track 6: system-skill-advisor/mcp_server/README.md gap analysis"
iteration: 10
track: 6
focus: "system-skill-advisor/mcp_server/README.md gap analysis"
status: complete
newInfoRatio: 1.00
findings: 7
timestamp: 2026-05-15T17:26:31Z
---

## Iter 010 Findings

### Missing Section 1: TABLE OF CONTENTS
**Location**: Should be added after the title block (before OVERVIEW)
**Content**: Navigation links to all major sections. Based on the model README structure, should link to:
- 1. OVERVIEW
- 2. ARCHITECTURE  
- 3. PACKAGE TOPOLOGY
- 4. DIRECTORY TREE
- 5. KEY FILES
- 6. BOUNDARIES AND FLOW
- 7. ENTRYPOINTS
- 8. VALIDATION
- 9. RELATED

### Missing Section 2: ARCHITECTURE
**Location**: Should be added after OVERVIEW, before STRUCTURE
**Content**: ASCII diagram showing the advisor server architecture. Based on actual source:
- MCP transport layer via `advisor-server.ts` (lines 1-262)
- Tool dispatcher in `tools/index.ts` 
- Handler layer in `handlers/` (advisor-recommend.ts, advisor-rebuild.ts, advisor-status.ts, advisor-validate.ts, skill-graph/)
- Library layer in `lib/` with submodules: scorer/, daemon/, freshness/, lifecycle/, derived/, compat/, auth/, corpus/, cross-skill-edges/, context/, shadow/, utils/
- Database layer in `database/` (skill-graph.sqlite)
- Daemon lifecycle via `lib/daemon/lifecycle.ts` and `lib/daemon/watcher.ts`
- Startup scan via `indexSkillMetadata` from `lib/skill-graph/skill-graph-db.js`

### Missing Section 3: PACKAGE TOPOLOGY
**Location**: Should be added after ARCHITECTURE
**Content**: Dependency rules and module ownership. Based on actual structure:
- `advisor-server.ts` → `tools/` → `handlers/` → `lib/` → `database/`
- `lib/` modules → schemas and shared utilities
- Disallowed: lib modules → handlers or MCP tool registration
- Disallowed: database → runtime modules

### Missing Section 4: DIRECTORY TREE
**Location**: Should replace or augment the current STRUCTURE section
**Content**: Complete directory tree based on actual source layout:
- `advisor-server.ts` (main entrypoint, 262 lines)
- `handlers/` (advisor tools + skill-graph subhandlers)
- `lib/` (11+ subdirectories with scorer, daemon, freshness, lifecycle, derived, compat, auth, corpus, cross-skill-edges, context, shadow, utils)
- `tools/` (MCP tool descriptors)
- `schemas/` (Zod contracts)
- `scripts/` (Python compatibility runtime, graph compiler, routing-accuracy corpus tooling)
- `compat/` (TypeScript bridge surface)
- `tests/` (Vitest and Python coverage)
- `bench/` (calibration, latency, watcher, scorer, code-graph benchmarks)
- `database/` (skill-graph.sqlite)
- `data/` (package-local runtime data)
- `plugin_bridges/` (bridge packages)

### Missing Section 5: KEY FILES
**Location**: Should be added after DIRECTORY TREE
**Content**: Table of key files and their responsibilities based on actual source:
- `advisor-server.ts` (lines 1-262): MCP transport entrypoint, daemon startup, skill graph indexing
- `handlers/index.ts`: Handler export barrel
- `tools/index.ts`: Tool descriptor registry
- `lib/scorer/`: Native scoring implementation
- `lib/daemon/lifecycle.ts`: Daemon lifecycle management
- `lib/freshness/`: Freshness and cache state helpers
- `lib/skill-graph/skill-graph-db.js`: Skill graph database operations
- `database/skill-graph.sqlite`: Local SQLite database

### Missing Section 6: BOUNDARIES AND FLOW
**Location**: Should be added after KEY FILES
**Content**: Boundary rules and flow diagrams based on actual architecture:
- Public API: MCP tools through `advisor-server.ts`, `tools/`, `handlers/`
- Handler logic: May call `lib/`, schemas, database adapters
- Domain logic: `lib/` should not import handlers
- Storage: SQLite access behind package modules that own schema
- Main flow: MCP client → advisor-server.ts → schema validation → handler → lib/database → response

### Missing Section 7: VALIDATION
**Location**: Should be added after ENTRYPOINTS, before RELATED
**Content**: Build and test commands based on package structure:
- `npm run build` (TypeScript compilation)
- `npm test` (Vitest and Python test coverage)
- Documentation validation via sk-doc scripts
- Expected result: build and tests exit 0, README validation reports no blocking issues

ITER_010_COMPLETE: 7 findings, newInfoRatio=1.75
