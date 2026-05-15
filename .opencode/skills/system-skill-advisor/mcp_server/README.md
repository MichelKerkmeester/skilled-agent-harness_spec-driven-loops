---
title: "System Skill Advisor MCP Server"
description: "Standalone package home for skill-advisor handlers, libraries, schemas, scripts, tests, benchmarks, and database ownership."
trigger_phrases:
  - "system skill advisor mcp server"
  - "advisor mcp server"
  - "advisor standalone package"
---

# System Skill Advisor MCP Server

<!-- sk-doc-template: skill_readme -->

This directory owns the standalone `mk_skill_advisor` MCP server implementation.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The server exposes advisor routing and skill graph tools from the advisor package. It is separate from `mk-spec-memory`, and packet 013/009/011 moved the skill graph DB/query library and startup lifecycle under this package.

<!-- /ANCHOR:overview -->

<!-- ANCHOR:structure -->
## 2. STRUCTURE

- `handlers/`: MCP handler implementations for `advisor_recommend`, `advisor_status`, `advisor_rebuild`, `advisor_validate`, `skill_graph_scan`, `skill_graph_query`, `skill_graph_status`, `skill_graph_validate`, and `skill_graph_propagate_enhances`.
- `lib/`: scorer, daemon, freshness, lifecycle, compatibility, corpus, derived-metadata, auth, shadow, cross-skill-edges (inbound enhance-edge propagation), and utility modules.
- `tools/`: advisor tool dispatch and package-local registration helpers.
- `schemas/`: Zod contracts and compatibility schemas for advisor inputs, outputs, and derived metadata.
- `scripts/`: Python compatibility runtime, graph compiler, routing-accuracy corpus tooling, fixtures, and generated script outputs.
- `compat/`: TypeScript bridge surface for compatibility consumers.
- `tests/`: Vitest and Python coverage for handlers, scorer behavior, schema contracts, compatibility, parity, cache, hook, and legacy regression cases.
- `bench/`: calibration, latency, watcher, scorer, and code-graph benchmark harnesses.
- `data/`: package-local runtime data such as shadow deltas.
- `database/`: package-local `skill-graph.sqlite` and its WAL/SHM companions.

<!-- /ANCHOR:structure -->

<!-- ANCHOR:entrypoints -->
## 3. ENTRYPOINTS

| Tool | Purpose |
|---|---|
| `advisor_recommend` | Prompt-to-skill routing |
| `advisor_rebuild` | Explicit advisor graph rebuild |
| `advisor_status` | Freshness, generation, trust, and daemon state |
| `advisor_validate` | Routing validation bundle |
| `skill_graph_scan` | Skill metadata indexing |
| `skill_graph_query` | Skill graph relationship traversal |
| `skill_graph_status` | Skill graph status and counts |
| `skill_graph_validate` | Skill graph integrity checks |
| `skill_graph_propagate_enhances` | Detect and (opt-in) apply missing inbound enhance edges across skills |

<!-- /ANCHOR:entrypoints -->

<!-- ANCHOR:related -->
## 4. RELATED

- [../README.md](../README.md)
- [../ARCHITECTURE.md](../ARCHITECTURE.md)
- [tools/README.md](tools/README.md)
- [handlers/README.md](handlers/README.md)
- [database/README.md](database/README.md)

<!-- /ANCHOR:related -->
