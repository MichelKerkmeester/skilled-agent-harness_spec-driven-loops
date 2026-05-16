---
title: "System Code Graph: Structural Code Intelligence Skill"
description: "Human-facing guide for the standalone system-code-graph skill, its mk-code-index MCP server, runtime docs, validation commands and operator workflows."
trigger_phrases:
  - "system code graph readme"
  - "code graph skill"
  - "mk-code-index"
  - "code_graph tools"
  - "structural code graph"
---

# System Code Graph

> Structural code indexing, SQLite-backed graph storage and MCP-facing code intelligence for impact analysis, neighborhood retrieval, readiness checks and change detection.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. FEATURES](#3--features)
- [4. STRUCTURE](#4--structure)
- [5. CONFIGURATION](#5--configuration)
- [6. USAGE EXAMPLES](#6--usage-examples)
- [7. TROUBLESHOOTING](#7--troubleshooting)
- [8. FAQ](#8--faq)
- [9. RELATED DOCUMENTS](#9--related-documents)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

`system-code-graph` is the standalone skill package for structural code intelligence. It scans source files into a local SQLite graph, answers relationship queries, prepares compact LLM context and exposes recovery-safe MCP tools through the `mk-code-index` server.

Use this README when you need a human map of the skill. Use [SKILL.md](./SKILL.md) for runtime routing instructions and [ARCHITECTURE.md](./ARCHITECTURE.md) for system-level design.

### Key Statistics

| Metric | Value |
|---|---|
| Skill version | `1.0.3.1` |
| Runtime package | `@spec-kit/system-code-graph` |
| MCP server name | `mk-code-index` (config key `mk_code_index`. MCP converts hyphens to underscores for namespace prefixes) |
| Client namespace | `mcp__mk_code_index__*` |
| Active MCP tools | 11 |
| Storage | SQLite files under `mcp_server/database/` |
| Database path override | `SPECKIT_CODE_GRAPH_DB_DIR` env var (default: `.opencode/.spec-kit/code-graph/database/`). Override only to point at an alternate canonical directory. The path must stay inside the workspace for the launcher's standalone-storage guard to permit it. |
| Primary docs | `feature_catalog/`, `manual_testing_playbook/`, `mcp_server/**/README.md`, `ARCHITECTURE.md` |

### How This Compares

| Need | Use This Skill | Use Another Surface |
|---|---|---|
| Find callers, imports, outlines or blast radius | `code_graph_query` | Use Grep only for exact text. |
| Build graph neighborhoods around known files or symbols | `code_graph_context` | Use CocoIndex first when the seed is only semantic intent. |
| Check stale or missing graph state | `code_graph_status`, `code_graph_verify` | Use system-spec-kit memory docs for session continuity. |
| Maintain shared spec, memory or hook lifecycle | Not owned here | Use `system-spec-kit`. |
| Search code by concept with embeddings | Bridge through `ccc_*` when needed | Use `mcp-coco-index` as the primary semantic search surface. |

### Key Features

| Feature | What It Does |
|---|---|
| Structural scan | Parses supported source files and persists file, symbol and edge rows. |
| Readiness contract | Blocks graph reads when the index is stale, empty or scope-mismatched. |
| Relationship queries | Returns outlines, call edges, import edges and blast radius results. |
| Context assembly | Builds compact graph neighborhoods for LLM context windows. |
| Change detection | Maps unified diffs to affected symbols when graph readiness is fresh. |
| Verification battery | Runs gold-query checks against the current graph. |
| Apply-mode recovery | Runs gated recovery operations with pre and post verification. |
| CocoIndex bridge | Exposes `ccc_status`, `ccc_reindex` and `ccc_feedback` for semantic index coordination. |

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->
## 2. QUICK START

**Step 1: Check graph health.**

Call the standalone MCP server through the normalized namespace:

```text
mcp__mk_code_index__code_graph_status({})
```

Expected result: a status payload with `readiness`, `canonicalReadiness`, `trustState`, `lastScanAt`, `schemaVersion` and graph-quality metadata.

**Step 2: Refresh the graph when readiness is blocked or stale.**

```text
mcp__mk_code_index__code_graph_scan({ "incremental": true })
```

Expected result: scan metadata with updated file, node and edge counts. Use a full scan when the stored scope fingerprint differs from the requested scope.

**Step 3: Run local validation before changing runtime behavior.**

```bash
.opencode/skills/system-code-graph/node_modules/.bin/tsc --noEmit -p .opencode/skills/system-code-graph/tsconfig.json
.opencode/skills/system-code-graph/node_modules/.bin/vitest --config .opencode/skills/system-code-graph/vitest.config.ts --run code-graph
```

Expected result: TypeScript exits `0`, and the focused code-graph Vitest suites pass.

<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:features -->
## 3. FEATURES

### 3.1 FEATURE HIGHLIGHTS

The skill is strongest when structure matters. It can answer "what imports this file?", "what calls this function?", "what symbols changed in this diff?" and "is the graph trustworthy enough to use?" without treating code as plain text.

Graph reads are deliberately false-safe. When the database is stale, missing or outside the active scan scope, handlers return blocked payloads with a required next action instead of plausible empty answers.

### 3.2 TOOL REFERENCE

| Tool | Purpose | Primary Files |
|---|---|---|
| `code_graph_scan` | Build or refresh graph state. | `mcp_server/handlers/scan.ts`, `mcp_server/lib/structural-indexer.ts` |
| `code_graph_query` | Read outlines, calls, imports and blast radius. | `mcp_server/handlers/query.ts`, `mcp_server/lib/code-graph-db.ts` |
| `code_graph_classify_query_intent` | Classify natural-language queries into structural/semantic/hybrid intent before routing. | `mcp_server/handlers/classify-query-intent.ts`, `mcp_server/lib/query-intent-classifier.ts` |
| `code_graph_status` | Report graph health and readiness. | `mcp_server/handlers/status.ts`, `mcp_server/lib/readiness-contract.ts` |
| `code_graph_context` | Build compact graph neighborhoods. | `mcp_server/handlers/context.ts`, `mcp_server/lib/code-graph-context.ts` |
| `code_graph_verify` | Run the gold-query verification battery. | `mcp_server/handlers/verify.ts`, `mcp_server/lib/gold-query-verifier.ts` |
| `code_graph_apply` | Run verification-gated recovery operations. | `mcp_server/handlers/apply.ts`, `mcp_server/lib/apply-orchestrator.ts` |
| `detect_changes` | Map unified diffs to affected graph symbols. | `mcp_server/handlers/detect-changes.ts`, `mcp_server/lib/diff-parser.ts` |
| `ccc_status` | Check CocoIndex bridge availability. | `mcp_server/handlers/ccc-status.ts` |
| `ccc_reindex` | Trigger CocoIndex reindexing. | `mcp_server/handlers/ccc-reindex.ts` |
| `ccc_feedback` | Record CocoIndex result feedback. | `mcp_server/handlers/ccc-feedback.ts` |

<!-- /ANCHOR:features -->

---

<!-- ANCHOR:structure -->
## 4. STRUCTURE

```text
system-code-graph/
+-- SKILL.md                         # Runtime routing and invariants
+-- README.md                        # Human-facing skill overview
+-- ARCHITECTURE.md                  # System architecture and boundaries
+-- package.json                     # Private runtime package metadata
+-- tsconfig.json                    # TypeScript build config
+-- vitest.config.ts                 # Focused test config
+-- feature_catalog/                 # Current feature inventory
+-- manual_testing_playbook/         # Operator validation scenarios
+-- mcp_server/
|   +-- index.ts                     # Standalone mk-code-index MCP entrypoint
|   +-- tool-schemas.ts              # Public MCP tool schemas
|   +-- handlers/                    # Tool request adapters
|   +-- lib/                         # Graph implementation and readiness logic
|   +-- tools/                       # Tool dispatch and export surface
|   +-- tests/                       # Vitest unit and integration coverage
|   +-- stress_test/code-graph/      # Pressure and degraded-mode coverage
|   `-- database/                    # Local SQLite graph files and launcher state
`-- node_modules/                    # Local dependencies, not skill-authored docs
```

| Path | Purpose |
|---|---|
| [SKILL.md](./SKILL.md) | Runtime instruction surface for agents. |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Deeper design, dependency direction and subsystem boundaries. |
| [feature_catalog/feature_catalog.md](./feature_catalog/feature_catalog.md) | Inventory of current runtime features. |
| [manual_testing_playbook/manual_testing_playbook.md](./manual_testing_playbook/manual_testing_playbook.md) | Manual scenario index and evidence protocol. |
| [mcp_server/handlers/README.md](./mcp_server/handlers/README.md) | Handler-layer code README. |
| [mcp_server/lib/README.md](./mcp_server/lib/README.md) | Library-layer code README. |
| [mcp_server/tools/README.md](./mcp_server/tools/README.md) | MCP dispatch code README. |
| [mcp_server/database/README.md](./mcp_server/database/README.md) | Database artifact README. |

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:configuration -->
## 5. CONFIGURATION

| Setting | Default | Purpose |
|---|---|---|
| `SPECKIT_CODE_GRAPH_INDEX_SKILLS` | `false` | Include `.opencode/skills/**` during scans. Also accepts comma-separated `sk-*` names. |
| `SPECKIT_CODE_GRAPH_INDEX_AGENTS` | `false` | Include `.opencode/agents/**`. |
| `SPECKIT_CODE_GRAPH_INDEX_COMMANDS` | `false` | Include `.opencode/commands/**`. |
| `SPECKIT_CODE_GRAPH_INDEX_SPECS` | `false` | Include `.opencode/specs/**`. |
| `SPECKIT_CODE_GRAPH_INDEX_PLUGINS` | `false` | Include `.opencode/plugins/**`. |
| `SPECKIT_PARSER_SKIP_LIST_ENABLED` | enabled by runtime policy | Lets parser failures be quarantined and surfaced through status metadata. |

Per-call scan arguments override matching environment settings. Use environment variables for process-wide defaults and per-call options for one scan.

<!-- /ANCHOR:configuration -->

---

<!-- ANCHOR:usage-examples -->
## 6. USAGE EXAMPLES

**Blast-radius preflight**

```text
User request: "What depends on mcp_server/lib/readiness-contract.ts?"
Tool path: mcp__mk_code_index__code_graph_query
Arguments: { "operation": "blast_radius", "subject": ".opencode/skills/system-code-graph/mcp_server/lib/readiness-contract.ts" }
Expected output: reverse import impact with readiness metadata.
```

**Diff impact check**

```text
User request: "Which symbols does this patch touch?"
Tool path: mcp__mk_code_index__detect_changes
Arguments: { "diff": "<unified diff>" }
Expected output: affected symbols, or a blocked response when the graph is not fresh.
```

**Semantic seed then structural context**

```text
User request: "Find the scan readiness path and give me nearby code."
Workflow: use CocoIndex semantic search for candidate files, then pass selected seeds to code_graph_context.
Expected output: compact graph neighborhood around the selected files or symbols.
```

<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:troubleshooting -->
## 7. TROUBLESHOOTING

| What You See | Cause | Fix |
|---|---|---|
| `requiredAction: "code_graph_scan"` | The graph is stale, missing or scope-mismatched. | Run `code_graph_scan` with the intended scope. Use `incremental: false` for scope changes. |
| Skill files do not appear in scan results | `.opencode/skills/**` is excluded by default. | Set `includeSkills: true` or pass an explicit `sk-*` list. |
| `parserHealth: "quarantined"` | One or more parser failures were added to the skip-list. | Inspect `parserSkipList.sample` from `code_graph_status`, then repair or accept the quarantine. |
| Unknown MCP tool error mentions `mk-code-index` | The tool name is not registered in `mcp_server/tools/code-graph-tools.ts`. | Add the schema, handler export and dispatch case in one change. |
| Local docs mention `system_code_graph` | The old MCP server name was replaced by packet 010. | Use `mk-code-index`, `mk_code_index` and `mcp__mk_code_index__*` for current runtime docs. |

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:faq -->
## 8. FAQ

**Q: Why is the skill folder still named `system-code-graph` while the MCP server is `mk-code-index`?**

A: The skill package owns documentation and source layout. `mk-code-index` is the standalone MCP server identity introduced by packet 010.

**Q: Does this replace Grep?**

A: No. Use Grep for exact text and file content checks. Use code graph tools when relationships, symbols, freshness or impact matter.

**Q: Should dependency READMEs under `node_modules/` follow this template?**

A: No. Those files belong to third-party packages. Keep sk-doc template alignment to authored system-code-graph docs.

**Q: Where should shared memory or resume behavior be documented?**

A: Keep shared lifecycle, memory and resume behavior in `system-spec-kit`. This skill documents code-graph-owned runtime behavior and operator validation.

<!-- /ANCHOR:faq -->

---

<!-- ANCHOR:related-documents -->
## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [SKILL.md](./SKILL.md) | Runtime routing, tool choice and invariants. |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System design and integration boundaries. |
| [mcp_server/handlers/README.md](./mcp_server/handlers/README.md) | Handler-layer package topology. |
| [mcp_server/lib/README.md](./mcp_server/lib/README.md) | Core graph implementation topology. |
| [mcp_server/tools/README.md](./mcp_server/tools/README.md) | MCP dispatch surface. |
| [mcp_server/tests/README.md](./mcp_server/tests/README.md) | Automated test coverage map. |
| [feature_catalog/feature_catalog.md](./feature_catalog/feature_catalog.md) | Current feature inventory. |
| [manual_testing_playbook/manual_testing_playbook.md](./manual_testing_playbook/manual_testing_playbook.md) | Manual validation scenario index. |

<!-- /ANCHOR:related-documents -->
