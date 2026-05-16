---
title: "Skill Graph Handlers: MCP Tool Responses"
description: "Handlers for skill graph scan, query, status and validation MCP tools."
trigger_phrases:
  - "skill graph handlers"
  - "skill graph MCP tools"
---

# Skill Graph Handlers: MCP Tool Responses

<!-- sk-doc-template: skill_readme -->

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. KEY FILES](#2--key-files)
- [3. USAGE NOTES](#3--usage-notes)
- [4. RELATED RESOURCES](#4--related-resources)

<!-- /ANCHOR:table-of-contents -->

<!-- ANCHOR:1-overview -->
## 1. OVERVIEW

`handlers/skill-graph/` owns the `mk_skill_advisor` MCP-facing handlers for the SQLite-backed skill graph. The handlers parse tool arguments, call skill graph libraries and return redacted JSON response envelopes.

Moved from `system-spec-kit/mcp_server/handlers/skill-graph/` in 013/009/008. Packet 013/009/011 moved the SQLite DB/query layer into this package so handlers and lifecycle share one owner.

Current state:

- Supports scanning skill metadata into the graph store.
- Supports relationship queries, graph status and validation checks.
- Redacts diagnostic paths before returning responses to callers.

<!-- /ANCHOR:1-overview -->

<!-- ANCHOR:2-key-files -->
## 2. KEY FILES

| File | Responsibility |
|---|---|
| `index.ts` | Re-exports the skill graph handler entrypoints. |
| `scan.ts` | Handles `skill_graph_scan` and publishes advisor freshness after indexing. |
| `query.ts` | Handles relationship traversal queries such as dependencies, subgraphs, hubs and orphans. |
| `status.ts` | Reports graph counts, schema versions, source staleness and validation summary. |
| `validate.ts` | Checks schema versions, broken edges, cycles, weight bands, symmetry and orphan skills. |
| `response-envelope.ts` | Formats success and error payloads and redacts local paths. |

<!-- /ANCHOR:2-key-files -->

<!-- ANCHOR:3-usage-notes -->
## 3. USAGE NOTES

- Keep MCP response formatting in `response-envelope.ts` so handlers return a consistent shape.
- Use the package-local `lib/skill-graph/` DB/query layer for database and traversal logic. Handlers should stay thin.
- Add new query types in both the handler type union and the switch implementation.

<!-- /ANCHOR:3-usage-notes -->

<!-- ANCHOR:4-related-resources -->
## 4. RELATED RESOURCES

- [`../../lib/skill-graph/`](../../lib/skill-graph/)
- [`../`](../)

<!-- /ANCHOR:4-related-resources -->
