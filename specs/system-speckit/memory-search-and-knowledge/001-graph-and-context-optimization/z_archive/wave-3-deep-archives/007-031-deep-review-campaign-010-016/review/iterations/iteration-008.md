# Iteration 8: D4 Maintainability — Manual Testing Scenario Robustness

## Focus
D4 Maintainability — Evaluate manual testing playbook coverage breadth, achievable evidence criteria, and tool coverage.

## Scorecard
- Dimensions covered: maintainability
- Files reviewed: 2
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.50

## Findings

### P2 — Suggestion

- **F018**: The playbook has 21 scenarios but some tools lack dedicated manual testing for untested parameter combinations. `code_graph_query` blast-radius calls, `code_graph_apply` recovery sub-operations (rescan/repair-nodes/prune-excludes), and `detect_changes` with multi-file diffs have no targeted scenarios. Adding these would improve coverage. — manual_testing_playbook/manual_testing_playbook.md

## Assessment
- Playbook structure well-organized with clear preconditions and evidence requirements
- Post-rename group (09) thorough with 6 scenarios
- All scenarios use `mcp__mk_code_index__*` namespace consistently
- Coverage gaps are limited to untested parameter combinations, not missing tool categories

## Recommended Next Focus
D2 Security — database path, live MCP, 040 reset