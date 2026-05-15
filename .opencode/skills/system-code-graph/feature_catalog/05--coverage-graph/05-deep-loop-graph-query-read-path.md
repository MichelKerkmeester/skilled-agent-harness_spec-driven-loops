---
title: "deep_loop_graph_query read path"
description: "Migrated coverage-graph query read-path reference for bounded namespace-scoped coverage lookups."
---

# deep_loop_graph_query read path

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`deep_loop_graph_query` reads the namespaced research/review coverage graph. It
supports uncovered-question, unverified-claim, contradiction, provenance-chain,
coverage-gap, and hot-node queries for loop synthesis and audit work.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

Current runtime behavior is documented in the source files below.
<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

| File | Role |
|------|------|
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Public MCP descriptor for the deep-loop coverage tools |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts` | Handler |
<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA
- Group: Coverage graph
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `05--coverage-graph/05-deep-loop-graph-query-read-path.md`

<!-- /ANCHOR:source-metadata -->
