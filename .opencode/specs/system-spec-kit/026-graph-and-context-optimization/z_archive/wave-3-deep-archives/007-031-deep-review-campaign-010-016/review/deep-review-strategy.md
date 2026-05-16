---
title: Deep Review Strategy - Campaign 010-016
description: Runtime strategy for deep-review of the 7-packet code-graph remediation campaign.
---

# Deep Review Strategy - Campaign 010-016

## 1. TOPIC
Deep-review of the 7-packet code-graph remediation campaign shipped 2026-05-14 (packets 010-016 under 013-system-code-graph-extraction). Primary focus: MCP tool rename from system_code_graph to mk-code-index, documentation alignment, and verification.

## 2. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness — MCP rename integrity, launcher wiring, mcp.json key, server name, tool namespace
- [x] D2 Security — Operational safety: live MCP children, database path, 040 reset draining
- [x] D3 Traceability — Documentation vs code alignment, spec/implementation fidelity, feature catalog accuracy
- [x] D4 Maintainability — Test coverage, build integrity, regression safety
<!-- MACHINE-OWNED: END -->

## 3. NON-GOALS
- Not reviewing the skill-advisor work tree (.opencode/skills/system-skill-advisor/**)
- Not modifying any production source code (review-only)
- Not reviewing packets 001-009 (prior campaign phases)
- Not killing live MCP processes or performing destructive database operations

## 4. STOP CONDITIONS
- All 4 dimensions covered with at least 1 iteration each
- Convergence achieved per composite score threshold
- Max 10 iterations reached

## 5. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | PASS (advisory) | 1, 2 | MCP rename complete. P1: SKILL.md name vs MCP namespace confusion. P2: Stale arch question, error message, compat alias. |
| D2 Security | PASS | 3, 9 | No P0/P1 findings. P2: env validation gap, key convention undocumented, lock staleness, DB_DIR override not documented. |
| D3 Traceability | PASS (advisory) | 4, 5, 6 | P2: Stale open question, legacy build path, feature/tool count gap, deep-loop boundary, playbook cross-ref gap, config discoverability. |
| D4 Maintainability | PASS | 7, 8, 10 | P2: Source map paths, test scenario coverage gaps for some parameters. No regressions found. |

<!-- MACHINE-OWNED: END -->

## 6. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 1 active (F002: SKILL.md name vs MCP namespace confusion)
- **P2 (Minor):** 19 active
- **Delta this iteration:** +0 P0, +0 P1, +0 P2
<!-- MACHINE-OWNED: END -->

## 7. WHAT WORKED
- Iteration-by-dimension approach ensured breadth before depth
- Starting with the rename integrity (D1) quickly established the baseline
- Cross-referencing tool registrations, schemas, and dispatch code verified the rename is complete
- Documentation-vs-code alignment checks surfaced stale open questions effectively

## 8. WHAT FAILED
- No convergence until iteration 10 (last iteration produced zero new findings)
- F002 (P1) remains open — it's a design decision about dual naming rather than a bug
- Several P2s are documentation clarity gaps that could be batch-resolved

## 9. EXHAUSTED APPROACHES (do not retry)
- Searching for residual `system_code_graph` strings in .ts source files: zero hits confirmed
- Checking tool-schemas.ts for schema/schema mismatches: all 10 schemas match dispatch names

## 10. RULED OUT DIRECTIONS
- Deep inspection of dist/ build artifacts (source map references are expected)
- Rewriting build fallback paths (legacy path is functional, not a defect)
- Changing the skill directory name (intentional design decision)

## 11. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
Review complete. Synthesize final report.
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT
Campaign 010-016 shipped 2026-05-14 under .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/013-system-code-graph-extraction/. Packets:
- 010: MCP server rename system_code_graph → mk-code-index (commit 7cfc16ed9)
- 011: Skill docs sk-doc alignment (commit 4e511bda3)
- 012: system-spec-kit code-graph residue audit (commit dfd0a0893)
- 013: READMEs update with sk-doc templates (commit 9ec71dd03)
- 014: New architecture.md (commit 1fcc5a1f5)
- 015: Public README update plan (commit 2c50fdb43)
- 016: Manual testing verification (commit 954b2d3eb + patches)

resource-map.md not present; skipping coverage gate.

## 13. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 2 | MCP server name matches mcp.json key; tool names correct; stale arch question remains |
| `checklist_evidence` | core | pending | - | - |
| `skill_agent` | overlay | notApplicable | - | Target type is files, not skill |
| `agent_cross_runtime` | overlay | notApplicable | - | Target type is files, not agent |
| `feature_catalog_code` | overlay | partial | 5 | 17 features vs 10 tools gap noted; deep-loop boundary documented |
| `playbook_capability` | overlay | partial | 6 | Scenario 011 lacks cross-ref; some tool params untested |
<!-- MACHINE-OWNED: END -->

## 14. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| .opencode/bin/mk-code-index-launcher.cjs | D1, D2, D4 | 9 | F007, F009, F012, F019 | reviewed |
| .opencode/skills/system-code-graph/mcp_server/index.ts | D1 | 1 | F002 | reviewed |
| .opencode/skills/system-code-graph/mcp_server/tool-schemas.ts | D1, D4 | 2 | F008 | reviewed |
| .opencode/skills/system-code-graph/mcp_server/tools/index.ts | D1 | 1 | - | reviewed |
| .opencode/skills/system-code-graph/SKILL.md | D1 | 1, 7 | F002, F003 | reviewed |
| .claude/mcp.json | D1, D2 | 1, 3 | F010, F016, F020 | reviewed |
| .opencode/skills/system-code-graph/architecture.md | D3 | 4 | F006=F011 | reviewed |
| .opencode/skills/system-code-graph/feature_catalog/** | D3 | 5 | F013, F014 | reviewed |
| .opencode/skills/system-code-graph/manual_testing_playbook/** | D3, D4 | 6, 8 | F015, F018 | reviewed |
| .opencode/skills/system-code-graph/references/** | D3 | 6 | - | reviewed |
| .opencode/skills/system-code-graph/README.md | D3 | 6 | F016 | reviewed |
| .opencode/skills/system-spec-kit/README.md | D1 | 1 | F004 | reviewed |
| .opencode/skills/system-spec-kit/SKILL.md | D1 | 1 | F005 | reviewed |
<!-- MACHINE-OWNED: END -->

## 15. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 10
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=rvw-2026-05-14T18-33-47Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: files
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[feature_catalog_code, playbook_capability]
- Started: 2026-05-14T18:33:47Z
- Completed: 2026-05-14 (iterations 1-10)
<!-- MACHINE-OWNED: END -->