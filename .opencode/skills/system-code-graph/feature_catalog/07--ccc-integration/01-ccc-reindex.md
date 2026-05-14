---
title: "ccc_reindex"
description: "Manual CocoIndex bridge tool that shells out to the ccc CLI for incremental or full reindexing."
trigger_phrases:
  - "ccc_reindex"
  - "system-code-graph feature catalog"
importance_tier: "important"
---

# ccc_reindex

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`ccc_reindex` is a direct bridge to the CocoIndex CLI. It does not refresh the structural code graph.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

### Trigger / Auto-Fire Path

Direct MCP call only. Session/bootstrap surfaces probe CocoIndex availability through helpers instead of invoking this tool.

### Class

manual. The tool runs only when an operator calls it explicitly.

### Caveats / Fallback

Requires the local `ccc` binary. Use `mcp__cocoindex_code__search` for actual semantic code search after indexing.
<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-code-graph/mcp_server/handlers/ccc-reindex.ts:27-54` | Handler | locates the `ccc` binary and runs `index` or `index --full` |
| `.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:86-90` | Tool surface | dispatches the requested tool |
| `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:190-200` | Schema | defines the public schema |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../../manual_testing_playbook/07--ccc-integration/` | Manual Playbook | Operator-facing manual scenarios for this feature category |

<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: CCC integration
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `07--ccc-integration/01-ccc-reindex.md`

Related references:

- [02-ccc-feedback.md](./02-ccc-feedback.md)
- [03-ccc-status.md](./03-ccc-status.md)
<!-- /ANCHOR:source-metadata -->
