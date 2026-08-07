# Iteration 6: D3 Traceability — Playbook Capability Checks

## Focus
D3 Traceability — Verify the manual testing playbook aligns with the live code surface.

## Scorecard
- Dimensions covered: traceability
- Files reviewed: 3
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.67

## Findings

### P2 — Suggestion

- **F015**: Scenario 011 (tool-call-shape-validation) is the only scenario that validates the full MCP tool manifest, but it does not explicitly cross-reference expected tool names against the `CODE_GRAPH_TOOL_SCHEMAS` array. Adding this cross-reference would strengthen the evidence chain. — manual_testing_playbook/manual_testing_playbook.md:134

- **F016**: README.md §5 configuration table lists 6 env vars but omits `SPECKIT_CODE_GRAPH_DB_DIR` which is documented in `.claude/mcp.json:45`. This creates a discoverability gap for operators who want to relocate the database. — .claude/mcp.json:45, README.md:186-198

## Assessment
- Playbook is comprehensive with 9 groups covering all critical paths
- Post-rename group properly covers all rename touchpoints
- Playbook uses `mcp__mk_code_index__*` namespace consistently

## Recommended Next Focus
D4 Maintainability — test coverage for rename