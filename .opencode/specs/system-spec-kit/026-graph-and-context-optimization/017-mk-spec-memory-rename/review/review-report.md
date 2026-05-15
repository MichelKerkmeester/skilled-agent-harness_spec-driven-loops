# Deep Review Report: 017 mk-spec-memory Rename

## Scope Summary

Reviewed the just-shipped 017 packet and rename footprint for commit `f91da9f1a`. Review writes were confined to `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/017-mk-spec-memory-rename/review/`; target packet docs and runtime files were read-only. The core server rename is present in source and dist, and the four documented runtime configs use `mk-spec-memory`.

The release is not clean because active command-layer references still point extracted `code_graph_*`, `ccc_*`, and `advisor_*` tools at `mk-spec-memory`, while those tools now live under `mk-code-index` and `mk-skill-advisor`. Packet documentation also has stale scaffold and completion metadata.

## Iteration Summary

| Iter | Dimensions | Findings New | Findings Total | New Ratio |
|------|------------|--------------|----------------|-----------|
| 001 | correctness, completeness | 1 | 1 | 1.000 |
| 002 | integration, documentation | 1 | 2 | 0.500 |
| 003 | regression-risk, correctness | 1 | 3 | 0.333 |
| 004 | completeness, integration | 1 | 4 | 0.250 |
| 005 | documentation, regression-risk | 2 | 6 | 0.333 |
| 006 | correctness, integration | 1 | 7 | 0.143 |
| 007 | completeness, documentation | 2 | 9 | 0.222 |
| 008 | regression-risk, correctness | 1 | 10 | 0.100 |
| 009 | integration, completeness | 1 | 11 | 0.091 |
| 010 | SYNTHESIS | 0 | 11 | 0.000 |

## Final Findings

| ID | Severity | Title | Location (file:line) | Category | Recommendation |
|----|----------|-------|----------------------|----------|----------------|
| 017-iter001-P1-001 | P1 | Doctor router frontmatter grants non-existent mk-spec-memory code-graph, ccc, and advisor tools | .opencode/commands/doctor.md:4 | integration/correctness | Change code_graph/detect_changes/ccc entries to `mcp__mk_code_index__*` and advisor entries to `mcp__mk_skill_advisor__*`, matching the extracted server ownership. |
| 017-iter002-P1-001 | P1 | Skill-advisor route manifest points advisor_* tools at mk-spec-memory instead of mk-skill-advisor | .opencode/commands/doctor/_routes.yaml:128 | integration | Replace `mcp__mk_spec_memory__advisor_*` with `mcp__mk_skill_advisor__advisor_*` and update the stale ownership comment at line 20. |
| 017-iter003-P1-001 | P1 | Memory manage command still documents ccc_* calls under mk-spec-memory | .opencode/commands/memory/manage.md:4 | regression-risk/integration | Move `ccc_status`, `ccc_reindex`, and `ccc_feedback` references in frontmatter and examples to `mcp__mk_code_index__*`. |
| 017-iter004-P2-001 | P2 | VS Code MCP config was renamed but still bypasses the launcher path used by other runtime configs | .vscode/mcp.json:14 | completeness/integration | Either document `.vscode/mcp.json` as intentionally direct-to-dist, or align it to `.opencode/bin/mk-spec-memory-launcher.cjs` like `.mcp.json` and the four documented runtimes. |
| 017-iter005-P1-001 | P1 | Plan document remains the scaffold template, not the shipped rename plan | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/017-mk-spec-memory-rename/plan.md:43 | documentation | Replace the template placeholders and generic phases with the actual rename surfaces, verification plan, and rollback details. |
| 017-iter005-P1-002 | P1 | Spec metadata still says Draft, old 027 packet pointer, scaffold branch, and 10% completion after shipment | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/017-mk-spec-memory-rename/spec.md:14 | documentation/regression-risk | Refresh frontmatter continuity, metadata status, branch, and completion fields to the 026/017 shipped packet state. |
| 017-iter006-P2-001 | P2 | Spec acceptance criteria names the new prefix as the string that should be absent | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/017-mk-spec-memory-rename/spec.md:159 | documentation/correctness | Change REQ-004 and SC-001 to assert zero active `mcp__spec_kit_memory__` references, with documented exclusions for historical audit files. |
| 017-iter007-P1-001 | P1 | Graph metadata still marks the shipped packet as planned | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/017-mk-spec-memory-rename/graph-metadata.json:16 | documentation/completeness | Regenerate or patch graph metadata so graph traversal and resume surfaces report the shipped/completed state and actual key files. |
| 017-iter007-P2-001 | P2 | Resource map omits committed `.mcp.json` and `.vscode/mcp.json` changes from runtime-config coverage | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/017-mk-spec-memory-rename/resource-map.md:48 | documentation/completeness | Add the two committed MCP config surfaces or explicitly classify them as adjacent/non-gating surfaces. |
| 017-iter008-P2-001 | P2 | Implementation summary still reports strict validation as pending despite tasks and current validation showing pass | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/017-mk-spec-memory-rename/implementation-summary.md:141 | documentation/regression-risk | Replace the pending row with the actual strict validation evidence, or make tasks and summary agree on the final verification state. |
| 017-iter009-P2-001 | P2 | Resource-map occurrence counts are internally inconsistent | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/017-mk-spec-memory-rename/resource-map.md:63 | documentation/completeness | Reconcile the stated total of 86 files with the operational 61 plus historical 54+/90+ claims so the active-vs-historical split is auditable. |

## Recommendations

1. Fix command namespace ownership first: /doctor, /doctor:update, _routes.yaml, and /memory:manage should route extracted code-graph/CCC/advisor tools to their actual MCP servers.
2. Refresh packet docs as a single metadata cleanup: replace the plan scaffold, update spec/graph metadata status, correct old packet pointers, and reconcile validation evidence.
3. Decide whether .vscode/mcp.json is intentionally direct-to-dist. If not, align it with the launcher pattern used by the other committed MCP config surfaces.
4. Reconcile the resource-map inventory counts and include all committed config surfaces in the audit table.

## Verdict

CONDITIONAL - 0 P0, 6 P1, 5 P2. The shipped rename is mostly functional at the server/config level, but the command namespace regressions are must-fix before treating the packet as fully release-clean.

## Binding Notes

- SpawnAgent used: no.
- Nested CLI dispatch: no.
- Network calls: no.
- Scope violations found: 0.
- Scope violations attempted: 0.
