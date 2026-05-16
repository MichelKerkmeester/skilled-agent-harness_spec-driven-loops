# Deep Research Strategy: Code-Graph Extraction

## Known Context
- Pre-research baseline: 244+ touchpoints inventoried in resource-map.md (exclusion set)
- Precedent: skill-advisor extraction packet (015/009/001-design-and-decision-record)
- Code-graph lives in `.opencode/skills/system-spec-kit/mcp_server/code_graph/`
- 12 MCP tools, 7 exclusive SQLite tables, 5 cross-subsystem handlers, 6 runtime hooks
- 108 files in code_tree, code-graph.sqlite DB, 63 category-22 docs

## Research Questions
Q1-Q8 as listed in spec. Q1 provides the factual baseline; Q2-Q6 are architectural decisions; Q7 is planning; Q8 is risk assessment.

## Iteration Plan
| Iter | Focus | Expected Outcome |
|------|-------|-----------------|
| 1 | Deep inventory: code_graph/ tree file-by-file | File count, purpose map |
| 2 | Consumer grep: all code_graph_/ccc_/detect_changes callers | Complete consumer list |
| 3 | Tool registrations, schemas, DB schema | Registration paths |
| 4 | Cross-subsystem handlers + hooks detail | Import graph |
| 5 | Plugin bridges, commands, agents, skill refs | Peripheral touchpoints |
| 6 | Category-22 docs enumeration | Doc disposition |
| 7 | Q2-Q4 architecture evaluation (DB, MCP topology, tool-id) | Scored alternatives |
| 8 | Q5-Q6 architecture evaluation (imports, plugin bridge) | Scored alternatives |
| 9 | Q7-Q8: phase decomposition + risk catalog | Locked phases + risk table |
| 10 | Synthesis: all artifacts | Final resource-map.md, decision-record.md, research.md |

## Exhausted Approaches
- (none yet)

## What Worked
- (none yet)

## What Failed
- (none yet)

## Next Focus
Iteration 1: Deep inventory of code_graph/ source tree
