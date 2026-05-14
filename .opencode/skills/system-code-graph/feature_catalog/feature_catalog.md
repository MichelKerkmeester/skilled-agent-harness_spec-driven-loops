---
title: "Code Graph: Feature Catalog"
description: "Current feature inventory for the system-code-graph skill and mk-code-index MCP server, with source anchors for graph readiness, structural queries, CCC bridge tools, coverage graph references and doctor-code-graph policy."
trigger_phrases:
  - "system-code-graph feature catalog"
  - "mk-code-index feature catalog"
  - "code graph inventory"
  - "code graph runtime catalog"
importance_tier: "important"
---
# Code Graph: Feature Catalog

This catalog is the current feature inventory for `.opencode/skills/system-code-graph/mcp_server/`. Live MCP callers use the standalone `mk-code-index` namespace, exposed as `mcp__mk_code_index__*`. The stable tool IDs remain `code_graph_*`, `detect_changes` and `ccc_*`.

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. READ-PATH FRESHNESS](#2--read-path-freshness)
- [3. MANUAL SCAN / VERIFY / STATUS](#3--manual-scan-verify-status)
- [4. DETECT-CHANGES PREFLIGHT](#4--detect-changes-preflight)
- [5. CONTEXT RETRIEVAL](#5--context-retrieval)
- [6. COVERAGE GRAPH](#6--coverage-graph)
- [7. MCP TOOL SURFACE](#7--mcp-tool-surface)
- [8. CCC INTEGRATION](#8--ccc-integration)
- [9. DOCTOR CODE GRAPH](#9--doctor-code-graph)

---

## 1. OVERVIEW

The catalog covers 17 runtime features across 8 groups. Per-feature files carry the implementation surface, trigger path, current automation class, fallback and cross-references.

**Feature-to-tool granularity (F013/F014).** The 17 features map to **10 MCP tools** in the `mk-code-index` server because individual features often compose multiple operations on the same tool (e.g. `code_graph_query` provides multiple query operations — `outline`, `calls_from`, `calls_to`, `imports_from`, `imports_to`, `blast_radius` — each catalogued as its own feature). Additionally, the **coverage-graph deep-loop tools** (`deep_loop_graph_*`) live in the **spec-kit-memory** MCP server (`mcp__spec_kit_memory__deep_loop_graph_*`), not in `mk-code-index`. They appear in this catalog for cross-skill discoverability since they share the structural-graph workflow surface.

| Group | Count | Scope |
| --- | ---: | --- |
| [01--read-path-freshness](./01--read-path-freshness/) | 2 | Read-path freshness |
| [02--manual-scan-verify-status](./02--manual-scan-verify-status/) | 3 | Manual scan / verify / status |
| [03--detect-changes](./03--detect-changes/) | 1 | Detect-changes preflight |
| [04--context-retrieval](./04--context-retrieval/) | 2 | Context retrieval |
| [05--coverage-graph](./05--coverage-graph/) | 4 | Coverage graph |
| [06--mcp-tool-surface](./06--mcp-tool-surface/) | 1 | MCP tool surface |
| [07--ccc-integration](./07--ccc-integration/) | 3 | CCC integration |
| [08--doctor-code-graph](./08--doctor-code-graph/) | 1 | Doctor code graph |

Reality classification source: read-path freshness is half-auto because requested reads can run bounded repair, full scan/verify/status are manual, CCC tools are manual, deep-loop convergence runs automatically inside command YAML, deep-loop upsert is conditional and deep-loop query/status are manual.


---

## 2. READ-PATH FRESHNESS

| Feature | File |
| --- | --- |
| Ensure code graph ready | [01--read-path-freshness/01-ensure-code-graph-ready.md](./01--read-path-freshness/01-ensure-code-graph-ready.md) |
| Query self-heal | [01--read-path-freshness/02-query-self-heal.md](./01--read-path-freshness/02-query-self-heal.md) |

---

## 3. MANUAL SCAN / VERIFY / STATUS

| Feature | File |
| --- | --- |
| code_graph_scan | [02--manual-scan-verify-status/01-code-graph-scan.md](./02--manual-scan-verify-status/01-code-graph-scan.md) |
| code_graph_verify | [02--manual-scan-verify-status/02-code-graph-verify.md](./02--manual-scan-verify-status/02-code-graph-verify.md) |
| code_graph_status | [02--manual-scan-verify-status/03-code-graph-status.md](./02--manual-scan-verify-status/03-code-graph-status.md) |

---

## 4. DETECT-CHANGES PREFLIGHT

| Feature | File |
| --- | --- |
| detect_changes preflight | [03--detect-changes/01-detect-changes-preflight.md](./03--detect-changes/01-detect-changes-preflight.md) |

---

## 5. CONTEXT RETRIEVAL

| Feature | File |
| --- | --- |
| code_graph_context | [04--context-retrieval/01-code-graph-context.md](./04--context-retrieval/01-code-graph-context.md) |
| Context handler | [04--context-retrieval/02-context-handler.md](./04--context-retrieval/02-context-handler.md) |

---

## 6. COVERAGE GRAPH

| Feature | File |
| --- | --- |
| deep_loop_graph_query | [05--coverage-graph/01-deep-loop-graph-query.md](./05--coverage-graph/01-deep-loop-graph-query.md) |
| deep_loop_graph_status | [05--coverage-graph/02-deep-loop-graph-status.md](./05--coverage-graph/02-deep-loop-graph-status.md) |
| deep_loop_graph_upsert | [05--coverage-graph/03-deep-loop-graph-upsert.md](./05--coverage-graph/03-deep-loop-graph-upsert.md) |
| deep_loop_graph_convergence | [05--coverage-graph/04-deep-loop-graph-convergence.md](./05--coverage-graph/04-deep-loop-graph-convergence.md) |

---

## 7. MCP TOOL SURFACE

| Feature | File |
| --- | --- |
| Tool registrations | [06--mcp-tool-surface/01-tool-registrations.md](./06--mcp-tool-surface/01-tool-registrations.md) |

---

## 8. CCC INTEGRATION

| Feature | File |
| --- | --- |
| ccc_reindex | [07--ccc-integration/01-ccc-reindex.md](./07--ccc-integration/01-ccc-reindex.md) |
| ccc_feedback | [07--ccc-integration/02-ccc-feedback.md](./07--ccc-integration/02-ccc-feedback.md) |
| ccc_status | [07--ccc-integration/03-ccc-status.md](./07--ccc-integration/03-ccc-status.md) |

---

## 9. DOCTOR CODE GRAPH

| Feature | File |
| --- | --- |
| Doctor apply mode | [08--doctor-code-graph/01-doctor-apply-mode.md](./08--doctor-code-graph/01-doctor-apply-mode.md) |
