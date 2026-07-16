---
title: "Iter 005 — Track 2: system-code-graph/SKILL.md content"
iteration: 5
track: 2
focus: "system-code-graph/SKILL.md content + structure"
status: complete
newInfoRatio: 0.18
findings: 2
timestamp: 2026-05-15T17:21:54Z
---

```markdown
## Iter 005 Findings — system-code-graph/SKILL.md Drift

### Finding 1: Missing `code_graph_apply` tool in Smart Routing table
**Location:** SKILL.md line 51-57 (Smart Routing table)
**Issue:** The Smart Routing table is missing the `code_graph_apply` tool, which exists in both:
- tool-schemas.ts CODE_GRAPH_TOOL_SCHEMAS (line 156-179, exported at line 239)
- code-graph-tools.ts TOOL_NAMES (line 33)
**Suggested fix:** Add a row to the Smart Routing table:
```markdown
|| Execute verification-gated apply-mode recovery operations | `mcp__mk_code_index__code_graph_apply` | `feature_catalog/08--doctor-code-graph/01-doctor-apply-mode.md` |
```

### Finding 2: Missing `code_graph_classify_query_intent` tool in Smart Routing table  
**Location:** SKILL.md line 51-57 (Smart Routing table)
**Issue:** The Smart Routing table is missing the `code_graph_classify_query_intent` tool, which exists in both:
- tool-schemas.ts CODE_GRAPH_TOOL_SCHEMAS (line 120-130, exported at line 237)
- code-graph-tools.ts TOOL_NAMES (line 31)
**Suggested fix:** Add a row to the Smart Routing table:
```markdown
|| Classify natural-language queries into structural/semantic/hybrid intent | `mcp__mk_code_index__code_graph_classify_query_intent` | [Add appropriate reference if documentation exists] |
```

### Verification Items (No Drift Found)

✓ **MCP server name:** SKILL.md correctly states `mk-code-index` (lines 60, 79, 92) — matches index.ts line 10
✓ **Tool namespace format:** SKILL.md correctly uses `mcp__mk_code_index__*` format (lines 51-57, 80) — matches MCP convention of hyphen-to-underscore conversion
✓ **Integration points:** SKILL.md correctly describes deep-loop tools staying in system-spec-kit (line 71) and direct in-process import path (line 118)
✓ **Tool names:** All other tool names in Smart Routing table match CODE_GRAPH_TOOL_SCHEMAS and TOOL_NAMES exactly

ITER_005_COMPLETE: 2 findings, newInfoRatio=0.18
```
