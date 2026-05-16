---
title: "System Code Graph"
description: "Structural code intelligence for AI agents. A tree-sitter AST graph, a false-safe readiness contract, and 11 MCP tools that answer 'what depends on this' without lying when the index is stale."
trigger_phrases:
  - "system code graph"
  - "mk-code-index"
  - "structural code indexing"
  - "blast radius"
  - "code graph readme"
  - "code-graph tools"
---

# System Code Graph

> Structural code intelligence for AI agents. Index your codebase as a graph, answer "what depends on this" without guessing, refuse to answer when the index is stale.

---

<!-- ANCHOR:table-of-contents -->

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. FEATURES](#3--features)
  - [3.1 STRUCTURAL INDEX](#31--structural-index)
  - [3.2 GRAPH-AWARE QUERIES](#32--graph-aware-queries)
  - [3.3 IMPACT ANALYSIS](#33--impact-analysis)
  - [3.4 RECOVERY OPERATIONS](#34--recovery-operations)
  - [3.5 COCOINDEX BRIDGE](#35--cocoindex-bridge)
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

### What System Code Graph Does

AI assistants can read individual files. They cannot reason about call graphs. When you ask "what calls this function?" or "what breaks if I rename this interface?", the assistant guesses from text similarity and gets it wrong on anything non-trivial. That is the gap System Code Graph fills.

This skill ships three layers on top of the base MCP server:

1. **Structural indexing** -- a tree-sitter parser converts your source files into a SQLite graph of files, symbols, calls, imports, and references. Like a structural map for the codebase, kept current and queryable.
2. **Graph-aware query tools** -- `code_graph_query` and `code_graph_context` answer relationship questions (callers, imports, outline, blast radius) and assemble compact LLM-ready neighborhoods around a seed file or symbol.
3. **A readiness contract that refuses to lie** -- every read path consults a freshness gate. Stale, empty, or scope-mismatched indexes return `status:"blocked"` with an explicit `requiredAction`. No silent empty arrays, no plausible-but-wrong answers.

### How This Compares

Manual grep matches exact strings only. It misses renames and aliases, and it cannot answer cross-file relationship questions. Semantic search surfaces conceptually similar code via embeddings but cannot tell you what is structurally connected. Both alternatives always return an answer, even when their index is stale.

System Code Graph resolves symbols exactly through tree-sitter AST parsing. Callers, imports, definitions, and references become first-class graph edges. Blast radius for a refactor is one tool call. The readiness contract refuses to answer on stale state and returns `status:"blocked"` with an explicit `requiredAction` instead of silent empty arrays. `code_graph_status` reports freshness as a first-class field.

### Cross-Skill Integration

System Code Graph owns the structural index. It deliberately leaves four surfaces to siblings:

- **Spec folders, memory, resume, hooks**. Owned by the spec-kit runtime. The `/spec_kit:resume` flow, `_memory.continuity` blocks, and lifecycle hooks live there.
- **Semantic code search**. Owned by a separate semantic-index runtime. `code_graph_context` can accept its seeds to mix semantic and structural lookups, exposed here as `ccc_*` bridge tools.
- **Skill routing**. Owned by a separate routing runtime that picks the right skill for a prompt.
- **Deep-loop research and review tools**. Owned by the spec-kit runtime where the iteration state machine lives, not by this skill.

The shared SQLite file is the coordination boundary between in-process imports from adjacent runtimes and external MCP callers. The single-writer invariant prevents corruption.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->

## 2. QUICK START

**Step 1: Check graph health.**

```text
mcp__mk_code_index__code_graph_status({})
```

Returns `readiness`, `canonicalReadiness`, `trustState`, `lastScanAt`, `schemaVersion`, and graph-quality metadata. If `readiness` is anything other than `fresh`, the read tools will block. Run a scan first.

**Step 2: Build or refresh the graph.**

```text
mcp__mk_code_index__code_graph_scan({ "incremental": true })
```

Walks the workspace, parses changed files through tree-sitter, persists file / symbol / edge rows in SQLite. Use `"incremental": false` after changing the scan scope (env flags or include globs).

**Step 3: Ask a relationship question.**

```text
mcp__mk_code_index__code_graph_query({
  "operation": "blast_radius",
  "subject": ".opencode/skills/system-code-graph/mcp_server/lib/readiness-contract.ts"
})
```

Returns the reverse impact set: every file that imports the subject, transitively, with readiness metadata so you know the answer is grounded.

**Step 4: Run local validation when you touch runtime code.**

```bash
.opencode/skills/system-code-graph/node_modules/.bin/tsc --noEmit -p .opencode/skills/system-code-graph/tsconfig.json
.opencode/skills/system-code-graph/node_modules/.bin/vitest --config .opencode/skills/system-code-graph/vitest.config.ts --run code-graph
```

TypeScript exits 0. The focused code-graph Vitest suite passes.

<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:features -->

## 3. FEATURES

The skill is strongest when structure matters. It answers "what imports this file?", "what calls this function?", "what symbols changed in this diff?", and "is the graph trustworthy enough to use?", all without treating code as plain text.

### 3.1 Structural Index

| Tool | Purpose | Primary files |
|---|---|---|
| `code_graph_scan` | Walk workspace, parse via tree-sitter, persist file / symbol / edge rows. | `mcp_server/handlers/scan.ts`, `mcp_server/lib/structural-indexer.ts` |
| `code_graph_status` | Report graph health, readiness state, trust state, parser quarantine. | `mcp_server/handlers/status.ts`, `mcp_server/lib/readiness-contract.ts` |

### 3.2 Graph-Aware Queries

| Tool | Purpose | Primary files |
|---|---|---|
| `code_graph_query` | Read outlines, calls (`calls_from`, `calls_to`), imports (`imports_from`, `imports_to`), and blast radius. Supports multi-subject union. | `mcp_server/handlers/query.ts`, `mcp_server/lib/code-graph-db.ts` |
| `code_graph_classify_query_intent` | Classify natural-language queries into structural, semantic, or hybrid intent before routing. | `mcp_server/handlers/classify-query-intent.ts`, `mcp_server/lib/query-intent-classifier.ts` |
| `code_graph_context` | Build compact LLM-ready graph neighborhoods around seeds. Accepts seeds from CocoIndex, manual input, or graph lookups. | `mcp_server/handlers/context.ts`, `mcp_server/lib/code-graph-context.ts` |

### 3.3 Impact Analysis

| Tool | Purpose | Primary files |
|---|---|---|
| `code_graph_verify` | Run the gold-query verification battery against the current index. Supports category filtering and baseline persistence. | `mcp_server/handlers/verify.ts`, `mcp_server/lib/gold-query-verifier.ts` |
| `detect_changes` | Map a unified diff to affected symbols and files via line-range overlap. Refuses when readiness is non-fresh. | `mcp_server/handlers/detect-changes.ts`, `mcp_server/lib/diff-parser.ts` |

### 3.4 Recovery Operations

| Tool | Purpose | Primary files |
|---|---|---|
| `code_graph_apply` | Verification-gated recovery: rescan, prune-excludes, repair-nodes, recover-sqlite-corruption, rollback-bad-apply. Every operation runs the gold-query battery before AND after. | `mcp_server/handlers/apply.ts`, `mcp_server/lib/apply-orchestrator.ts` |

### 3.5 CocoIndex Bridge

| Tool | Purpose | Primary files |
|---|---|---|
| `ccc_status` | Check CocoIndex availability and binary path. | `mcp_server/handlers/ccc-status.ts` |
| `ccc_reindex` | Trigger CocoIndex incremental or full reindex of the workspace. | `mcp_server/handlers/ccc-reindex.ts` |
| `ccc_feedback` | Submit search-quality feedback for future CocoIndex improvements. | `mcp_server/handlers/ccc-feedback.ts` |

<!-- /ANCHOR:features -->

---

<!-- ANCHOR:structure -->

## 4. STRUCTURE

```text
system-code-graph/
+-- SKILL.md                         # Runtime routing and invariants
+-- README.md                        # This file
+-- ARCHITECTURE.md                  # System architecture and boundaries
+-- INSTALL_GUIDE.md                 # Bootstrap and configuration guide
+-- package.json                     # Private runtime package metadata
+-- tsconfig.json                    # TypeScript build config
+-- vitest.config.ts                 # Focused test config
+-- feature_catalog/                 # Current feature inventory (17 entries, 8 groups)
+-- manual_testing_playbook/         # Operator validation scenarios (22 scenarios, 10 groups)
+-- references/                      # Ownership, readiness, database-path-policy primers
+-- mcp_server/
|   +-- index.ts                     # Standalone mk-code-index MCP entrypoint
|   +-- tool-schemas.ts              # Public MCP tool schemas (source of truth for the 11)
|   +-- handlers/                    # Tool request adapters
|   +-- lib/                         # Graph implementation, readiness logic, recovery
|   +-- tools/                       # Tool dispatch and export surface
|   +-- tests/                       # Vitest unit and integration coverage
|   +-- stress_test/code-graph/      # Pressure and degraded-mode coverage
|   +-- plugin_bridges/              # CLI bridge (currently non-functional, post-extraction)
|   +-- database/                    # Local SQLite graph files and launcher state
|   +-- core/                        # Core runtime helpers
`-- node_modules/                    # Local dependencies, not skill-authored docs
```

| Path | Purpose |
|---|---|
| [SKILL.md](./SKILL.md) | Runtime instruction surface for agents. |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Deeper design, dependency direction, subsystem boundaries. |
| [INSTALL_GUIDE.md](./INSTALL_GUIDE.md) | Native bootstrap, per-runtime config, verification. |
| [feature_catalog/feature_catalog.md](./feature_catalog/feature_catalog.md) | Current runtime feature inventory. |
| [manual_testing_playbook/manual_testing_playbook.md](./manual_testing_playbook/manual_testing_playbook.md) | Operator validation scenarios. |
| [mcp_server/handlers/README.md](./mcp_server/handlers/README.md) | Handler-layer code README. |
| [mcp_server/lib/README.md](./mcp_server/lib/README.md) | Library-layer code README. |
| [mcp_server/tools/README.md](./mcp_server/tools/README.md) | MCP dispatch code README. |

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
| `SPECKIT_CODE_GRAPH_DB_DIR` | `.opencode/.spec-kit/code-graph/database/` | Override database directory. Must stay inside the workspace for the launcher's standalone-storage guard to permit it. |
| `SPECKIT_CODE_GRAPH_MAINTAINER_MODE` | unset | Set to `true` in `.env.local` (gitignored) to force all 5 `INDEX_*` flags to `true` at launcher startup. |
| `SPECKIT_PARSER_SKIP_LIST_ENABLED` | enabled by runtime policy | Lets parser failures be quarantined and surfaced through status metadata. |

The 5 `INDEX_*` flags ship as `false` so end users get a quiet, low-disk index by default. Maintainer mode flips them all at once. Per-call `code_graph_scan` arguments override matching environment settings. Use environment variables for process-wide defaults and per-call options for one scan.

<!-- /ANCHOR:configuration -->

---

<!-- ANCHOR:usage-examples -->

## 6. USAGE EXAMPLES

**Blast-radius preflight before a refactor**

```text
User request: "What depends on mcp_server/lib/readiness-contract.ts?"
Tool path:    mcp__mk_code_index__code_graph_query
Arguments:    { "operation": "blast_radius", "subject": ".opencode/skills/system-code-graph/mcp_server/lib/readiness-contract.ts" }
Expected:     reverse import impact set with readiness metadata
```

**Diff impact check on an incoming patch**

```text
User request: "Which symbols does this patch touch?"
Tool path:    mcp__mk_code_index__detect_changes
Arguments:    { "diff": "<unified diff>" }
Expected:     affected symbols and files, or a blocked response when the graph is not fresh
```

**Semantic seed plus structural context**

```text
User request: "Find the scan readiness path and give me nearby code."
Workflow:     CocoIndex semantic search for candidate files, then pass selected seeds to code_graph_context
Tool chain:   mcp__cocoindex_code__search -> mcp__mk_code_index__code_graph_context
Expected:     compact graph neighborhood around the selected files or symbols
```

**Outline a file for cold reading**

```text
User request: "Give me a skeleton of mcp_server/lib/ensure-ready.ts"
Tool path:    mcp__mk_code_index__code_graph_query
Arguments:    { "operation": "outline", "subject": ".opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts" }
Expected:     ordered list of top-level symbols with line ranges
```

<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:troubleshooting -->

## 7. TROUBLESHOOTING

| Symptom | Cause | Fix |
|---|---|---|
| `status:"blocked"` with `requiredAction:"code_graph_scan"` | Graph is stale, missing, or scope-mismatched. | Run `code_graph_scan` with the intended scope. Use `incremental:false` for scope changes. |
| `parserHealth: "quarantined"` | One or more files failed parsing and landed in the skip-list. | Inspect `parserSkipList.sample` from `code_graph_status`, then repair the file or accept the quarantine. |
| Skill files do not appear in scan results | `.opencode/skills/**` is excluded by default. | Set `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true` or pass an explicit `sk-*` list. |
| Unknown MCP tool error mentions `mk-code-index` | The tool name is not registered in `mcp_server/tools/code-graph-tools.ts`. | Add the schema, handler export, and dispatch case in one change. |
| Local docs mention `system_code_graph` (old underscore name) | Outdated reference predating the standalone server rename. | Use `mk-code-index`, `mk_code_index`, and `mcp__mk_code_index__*` for current runtime docs. |
| Plugin bridge fails on startup with missing `dist/handlers/session-resume.js` | The bridge's imports point at modules that moved to `system-spec-kit` post-extraction. | See `mcp_server/plugin_bridges/README.md` §1 for the broken-import table. Bridge runtime fix is a follow-on packet. |

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:faq -->

## 8. FAQ

**Q: Why is the skill folder still named `system-code-graph` while the MCP server is `mk-code-index`?**

The skill package owns documentation and source layout. The MCP server identity stays stable across rename packets so external callers do not break. Both names are intentional. Filesystem paths use the skill slug, MCP-facing identifiers use the server name (ADR-002).

**Q: Does this replace `grep`?**

No. Use `grep` for exact text matching. Use code graph tools when relationships, symbols, freshness, or impact matter. The 11 tools answer different questions than text search ever can.

**Q: Why does the readiness contract refuse to answer on stale state?**

Returning empty arrays from a stale index trains agents to act on false information. The hard refuse is intentional. A `blocked` payload with a `requiredAction` is more useful than a plausible-but-wrong response, especially during refactors.

**Q: Where should shared memory or session resume behavior live?**

In `system-spec-kit`. This skill scopes itself to the structural index and its tools. Lifecycle, continuity, and resume flows are owned upstream.

**Q: Can I run the MCP server without `mk-spec-memory` installed?**

Yes. The standalone MCP server boots independently. Three-way isolation was finalized in v1.0.3.0 and verified via a delete-`system-spec-kit` smoke test. Cross-skill in-process imports exist for shared helpers, but the runtime starts without `system-spec-kit` running.

**Q: Should dependency READMEs under `node_modules/` follow this template?**

No. Those files belong to third-party packages. Keep sk-doc template alignment to authored system-code-graph docs.

<!-- /ANCHOR:faq -->

---

<!-- ANCHOR:related-documents -->

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [SKILL.md](./SKILL.md) | Runtime routing, tool choice, invariants. |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System design, dependency direction, subsystem boundaries. |
| [INSTALL_GUIDE.md](./INSTALL_GUIDE.md) | Native bootstrap and per-runtime configuration. |
| [feature_catalog/feature_catalog.md](./feature_catalog/feature_catalog.md) | Current feature inventory. |
| [manual_testing_playbook/manual_testing_playbook.md](./manual_testing_playbook/manual_testing_playbook.md) | Operator validation scenario index. |
| [references/code-graph-readiness-check.md](./references/code-graph-readiness-check.md) | Readiness contract primer. |
| [references/ownership-boundary.md](./references/ownership-boundary.md) | Why some graph-related code stayed in `system-spec-kit`. |
| [references/database-path-policy.md](./references/database-path-policy.md) | Workspace containment guarantees for the SQLite database. |
| [mcp_server/handlers/README.md](./mcp_server/handlers/README.md) | Handler-layer package topology. |
| [mcp_server/lib/README.md](./mcp_server/lib/README.md) | Core graph implementation topology. |
| [mcp_server/tools/README.md](./mcp_server/tools/README.md) | MCP dispatch surface. |
| [mcp_server/tests/README.md](./mcp_server/tests/README.md) | Automated test coverage map. |

<!-- /ANCHOR:related-documents -->
