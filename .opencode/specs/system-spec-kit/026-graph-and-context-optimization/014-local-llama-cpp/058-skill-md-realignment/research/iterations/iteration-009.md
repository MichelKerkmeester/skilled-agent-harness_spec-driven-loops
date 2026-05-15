---
title: "Iter 009 — Track 5: system-code-graph/mcp_server/README.md drift"
iteration: 9
track: 5
focus: "system-code-graph/mcp_server/README.md drift"
status: complete
newInfoRatio: 0.00
findings: 0
timestamp: 2026-05-15T17:24:11Z
---

## Iter 009 Findings

No factual drift found between README.md and tool-schemas.ts implementation.

**Verified claims:**
- Line 41: "tool-schemas.ts defines all code graph tool schemas" - CORRECT (11 tools in CODE_GRAPH_TOOL_SCHEMAS array: lines 232-244)
- Line 41: "re-exports validation utilities from system-spec-kit" - CORRECT (lines 6-10 export getSchema, getToolSchema, validateToolArgs)
- Line 40: "index.ts registers two handlers: a ListTools handler backed by tool-schemas.ts, and a CallTool handler backed by tools/index.js" - CORRECT (index.ts lines 14-16, 18-21)
- Line 42: "Tool calls go through tools/index.js which forwards to handler modules in handlers/" - CORRECT (tools/index.ts dispatches to code-graph-tools.ts, which imports from handlers/index.js)
- Line 172: "CODE_GRAPH_TOOL_SCHEMAS and TOOL_DEFINITIONS from tool-schemas.ts are the public schema surface" - CORRECT (lines 232, 247)
- Lines 221-226: Entrypoints table - CORRECT (all listed exports exist in tool-schemas.ts)
- Line 226: "mk-code-index" server name - CORRECT (index.ts line 10 confirms `{ name: 'mk-code-index', version: '1.0.0' }`)
- Directory tree (lines 134-147) - CORRECT (all directories and files exist as listed)
- Boundaries and dependency direction (lines 108-124) - CORRECT (imports follow stated rules)

**Note on RQ assumption:** The RQ stated "the README has both `mk_code_index` and `mk-code-index` mentions." This is incorrect - grep found only `mk-code-index` (4 instances: lines 3, 6, 35, 226), all using the canonical hyphenated form matching index.ts. No instances of underscored `mk_code_index` exist in the README.

ITER_009_COMPLETE: 0 findings, newInfoRatio=0.00
