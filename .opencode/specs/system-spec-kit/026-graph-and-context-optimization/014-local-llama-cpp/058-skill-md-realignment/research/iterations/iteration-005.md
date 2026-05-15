## Iter 005 Findings — system-code-graph/SKILL.md Drift

### Finding 1: Missing `code_graph_apply` tool in Smart Routing table
**Location:** SKILL.md line 51-57 (Smart Routing table)
**Issue:** The Smart Routing table is missing the `code_graph_apply` tool, which exists in both:
- tool-schemas.ts CODE_GRAPH_TOOL_SCHEMAS (line 156-179, exported at line 239)
- code-graph-tools.ts TOOL_NAMES (line 33)
**Suggested fix:** Add a row to the Smart Routing table:
|| Execute verification-gated apply-mode recovery operations | `mcp__mk_code_index__code_graph_apply` | `feature_catalog/08--doctor-code-graph/01-doctor-apply-mode.md` |
