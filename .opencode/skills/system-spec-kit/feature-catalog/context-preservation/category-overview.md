---
title: "Context preservation and code graph"
description: "Category covering Claude Code hooks (PreCompact, SessionStart, Stop), structural code graph (indexer, SQLite, MCP tools), Code Graph bridge, and compaction working-set integration."
trigger_phrases:
  - "context preservation and code graph"
  - "precompact sessionstart stop hooks"
  - "context preservation category overview"
  - "compaction working-set integration"
  - "hook-based context injection"
version: 3.6.0.17
---

# Context preservation and code graph

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Category covering runtime hook automation, structural code graph (indexer, SQLite, MCP tools), Code Graph bridge, and compaction working-set integration.

This category documents the hybrid context injection system that preserves critical knowledge across context compaction events. It combines three complementary systems: hook-based lifecycle automation, structural code analysis (code graph), and semantic search (Code Graph) — all merging under a 4000-token budget for compaction injection.

---

## 2. HOW IT WORKS

The shipped surface now includes hook scripts, code graph modules, MCP tools, budget allocator, tree-sitter parser with regex fallback, query-intent routing, auto-trigger, session health/resume/bootstrap tools, the structural ready/stale/missing contract, and startup-brief follow-ons. Recovery treats `/speckit:resume` as the canonical surface and follows `handover.md -> _memory.continuity -> spec docs` before widening to broader memory artifacts.

For runtime-package code-graph details, see `.opencode/skills/system-code-graph/feature-catalog/feature-catalog.md`.

Phase 005 split code-graph-owned category-22 docs into the sibling skill. For the code-graph feature pages that moved, see `.opencode/skills/system-code-graph/feature-catalog/context-preservation/`; for code-graph manual scenarios, see `.opencode/skills/system-code-graph/manual-testing-playbook/context-preservation/`. Shared hook, runtime, budget, routing, skill-graph, and coverage-graph pages remain here.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp-server/hooks/claude/` | Hook | 6 Claude Code lifecycle hook scripts |
| `.opencode/skills/system-code-graph/mcp-server/lib/` | Lib | 12 code graph library modules |
| `.opencode/skills/system-code-graph/mcp-server/handlers/` | Handler | 4 MCP tool handlers |
| `.opencode/skills/system-code-graph/mcp-server/tools/code-graph-tools.ts` | Dispatch | Tool dispatch for code graph tools |
| `.opencode/skills/system-code-graph/mcp-server/lib/tree-sitter-parser.ts` | Lib | WASM-based AST parser (replaces regex) |
| `.opencode/skills/system-code-graph/mcp-server/lib/query-intent-classifier.ts` | Lib | Structural/semantic/hybrid query routing |
| `.opencode/skills/system-code-graph/mcp-server/lib/ensure-ready.ts` | Lib | Auto-trigger with git HEAD staleness detection |
| `mcp-server/handlers/session-health.ts` | Handler | Session readiness and quality score |
| `mcp-server/handlers/session-resume.ts` | Handler | Composite resume (memory + graph + Code Graph) |
| `mcp-server/handlers/session-bootstrap.ts` | Handler | Canonical first-call bootstrap (resume + health + structural contract) |
| `mcp-server/lib/session/session-snapshot.ts` | Lib | Shared ready/stale/missing structural context contract |
| `mcp-server/lib/session/context-metrics.ts` | Lib | Session quality scoring and event tracking |

---

## 4. SOURCE METADATA
- Group: Context Preservation And Code Graph
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `context-preservation/category-overview.md`
Related references:
- [precompact-hook.md](../../feature-catalog/context-preservation/precompact-hook.md) — PreCompact hook context caching
