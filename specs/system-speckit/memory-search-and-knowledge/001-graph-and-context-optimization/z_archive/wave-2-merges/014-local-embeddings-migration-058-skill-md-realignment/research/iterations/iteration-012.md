---
title: "Iter 012 — Track 6: system-skill-advisor/mcp_server/README.md draft outline"
iteration: 12
track: 6
focus: "system-skill-advisor/mcp_server/README.md draft outline"
status: complete
newInfoRatio: 1.00
findings: 9
timestamp: 2026-05-15T17:27:30Z
---

## Iter 012 Findings

### 1. TABLE OF CONTENTS
- Navigation links to all major sections following the model README pattern
- Links to OVERVIEW, ARCHITECTURE, PACKAGE TOPOLOGY, DIRECTORY TREE, KEY FILES, BOUNDARIES AND FLOW, ENTRYPOINTS, VALIDATION, and RELATED sections
- Anchor-based navigation for direct section jumping

### 2. OVERVIEW
- Purpose statement: system-skill-advisor MCP server provides native skill recommendation routing, freshness tracking, and skill graph relationship queries
- Current state description: advisor-server.ts as MCP transport entrypoint, tools/ for dispatch, handlers/ for orchestration, lib/ for business logic, database/ for SQLite storage
- Key capabilities: advisor_recommend, advisor_rebuild, advisor_status, advisor_validate tools plus skill graph operations (scan, query, status, validate, propagate_enhances)
- Local-first design: reads repository-local skill metadata, maintains skill-graph.sqlite database, provides daemon lifecycle management

### 3. ARCHITECTURE
- ASCII diagram showing layered architecture: MCP clients → advisor-server.ts → tools/ → handlers/ → lib/ → database/
- Transport layer via advisor-server.ts (lines 1-262) handling MCP tool registration and daemon startup
- Tool dispatcher in tools/index.ts routing 9 public tools to appropriate handlers
- Handler layer in handlers/ with advisor tools (recommend, rebuild, status, validate) and skill-graph subhandlers (scan, query, status, validate, propagate_enhances)
- Library layer in lib/ with 11+ submodules: scorer/, daemon/, freshness/, lifecycle/, derived/, compat/, auth/, corpus/, cross-skill-edges/, context/, shadow/, utils/
- Database layer with skill-graph.sqlite for persistent skill metadata and relationship storage

### 4. PACKAGE TOPOLOGY
- Dependency hierarchy: advisor-server.ts → tools/ → handlers/ → lib/ → database/
- Allowed directions: tools/ → handlers/ → lib/, handlers/ → schemas/, lib/ → database/, scripts/ → lib/, tests/ → lib/, handlers/, schemas/
- Disallowed directions: lib/ → tools/ (no MCP registration in lib), lib/ → handlers/ (domain logic separation), database/ → handlers/ (database is passive storage), schemas/ → handlers/ (schemas are contracts not orchestration)
- Module ownership rules: lib modules own business logic and may call schemas and shared utilities, handlers own orchestration and may call lib modules, tools own dispatch and may call handlers

### 5. DIRECTORY TREE
- Complete tree structure: advisor-server.ts (main entrypoint), tools/ (9 tool definitions), handlers/ (advisor + skill-graph subhandlers), lib/ (11+ subdirectories with scorer, daemon, freshness, lifecycle, derived, compat, auth, corpus, cross-skill-edges, context, shadow, utils)
- Support directories: schemas/ (Zod contracts), database/ (skill-graph.sqlite), data/ (shadow-deltas.jsonl), compat/ (TypeScript bridge surface), scripts/ (Python CLI and utilities), bench/ (benchmark suites), tests/ (Vitest and Python coverage)
- Infrastructure: plugin_bridges/ (bridge packages), dist/ (compiled output), node_modules/, package.json, tsconfig.json, vitest.config.ts

### 6. KEY FILES
- advisor-server.ts (lines 1-262): MCP transport entrypoint, tool registration, daemon startup, skill graph indexing via indexSkillMetadata
- tools/index.ts: Tool descriptor registry and dispatch router for 9 public tools
- tools/skill-graph-tools.ts (lines 1-143): Skill graph tool definitions (scan, query, status, validate, propagate_enhances)
- handlers/index.ts: Re-exports all handler entrypoints for advisor and skill-graph operations
- lib/skill-graph/skill-graph-db.ts: SQLite schema initialization, metadata indexing, stats and row mapping
- lib/skill-graph/skill-graph-queries.ts: Prepared graph relationship queries (depends_on, dependents, enhances, etc.)
- lib/scorer/: Native scoring implementation with lane-based attribution and calibration
- lib/daemon/lifecycle.ts: Advisor daemon startup, shutdown and lifecycle orchestration
- database/skill-graph.sqlite: Local SQLite database for skill metadata and relationships

### 7. BOUNDARIES AND FLOW
- Boundary rules: Transport → Tools via advisor-server.ts imports, Tools → Handlers via dispatch, Handlers → Lib for business logic, Lib → Database for storage, Lib → Schemas for contract validation
- Tool invocation flow: MCP tool request → advisor-server.ts (transport layer) → tools/index.ts (dispatch router) → handlers/* (orchestration layer) → lib/* (business logic) → database/skill-graph.sqlite (persistent storage) → schemas/* (contract validation) → response envelope
- Public API surface: MCP tools exposed through advisor-server.ts, tools/, and handlers/
- Storage boundary: SQLite access stays behind package modules that own schema and migration rules
- Domain logic separation: lib/ modules should not import handlers or MCP tool registration code

### 8. ENTRYPOINTS
- advisor-server.ts: MCP server entrypoint, registers tools, manages daemon lifecycle
- advisor_recommend: Tool returning skill recommendations for a given prompt (tools/advisor-recommend.ts)
- advisor_rebuild: Tool rebuilding advisor index from skill metadata (tools/advisor-rebuild.ts)
- advisor_status: Tool reporting advisor health, daemon state and freshness status (tools/advisor-status.ts)
- advisor_validate: Tool validating advisor configuration and metadata (tools/advisor-validate.ts)
- skill_graph_scan: Tool indexing or re-indexing skill metadata into SQLite (tools/skill-graph-tools.ts lines 21-32)
- skill_graph_query: Tool querying skill graph relationships (dependencies, enhances, hubs, etc.) (tools/skill-graph-tools.ts lines 34-52)
- skill_graph_status: Tool reporting skill graph health and statistics (tools/skill-graph-tools.ts lines 54-58)
- skill_graph_validate: Tool validating skill graph for schema drift, broken edges, cycles (tools/skill-graph-tools.ts lines 60-64)
- skill_graph_propagate_enhances: Tool detecting and applying missing inbound enhances edges (tools/skill-graph-tools.ts lines 66-83)

### 9. VALIDATION
- Build verification: npm run build for TypeScript compilation
- Test execution: npm test -- --runInBand for Vitest and Python test coverage
- Documentation validation: sk-doc validate for README files across lib/, handlers/, bench/, compat/, data/, tests/, scripts/, schemas/ subdirectories
- Expected results: build and tests exit 0, README validation reports no blocking issues, all subdirectory README.md files pass sk-doc quality checks
- Validation commands applied to each subdirectory README.md following the pattern from lib/skill-graph/README.md lines 57-58

ITER_012_COMPLETE: 9 findings, newInfoRatio=1.00
