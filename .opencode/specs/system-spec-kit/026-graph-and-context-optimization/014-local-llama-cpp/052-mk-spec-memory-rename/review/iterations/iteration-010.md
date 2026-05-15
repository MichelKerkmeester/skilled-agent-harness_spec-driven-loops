---
iter: 010
dimensions: ["SYNTHESIS"]
timestamp: 2026-05-15T05:35:55.218Z
---
# Iteration 010 Synthesis

## SCOPE VIOLATIONS

None.

## Findings

| ID | Severity | Title | Location (file:line) | Category | Recommendation |
|----|----------|-------|----------------------|----------|----------------|
| 017-iter001-P1-001 | P1 | Doctor router frontmatter grants non-existent mk-spec-memory code-graph, ccc, and advisor tools | .opencode/commands/doctor.md:4 | integration/correctness | Change code_graph/detect_changes/ccc entries to `mcp__mk_code_index__*` and advisor entries to `mcp__mk_skill_advisor__*`, matching the extracted server ownership. |
| 017-iter002-P1-001 | P1 | Skill-advisor route manifest points advisor_* tools at mk-spec-memory instead of mk-skill-advisor | .opencode/commands/doctor/_routes.yaml:128 | integration | Replace `mcp__mk_spec_memory__advisor_*` with `mcp__mk_skill_advisor__advisor_*` and update the stale ownership comment at line 20. |
| 017-iter003-P1-001 | P1 | Memory manage command still documents ccc_* calls under mk-spec-memory | .opencode/commands/memory/manage.md:4 | regression-risk/integration | Move `ccc_status`, `ccc_reindex`, and `ccc_feedback` references in frontmatter and examples to `mcp__mk_code_index__*`. |
| 017-iter004-P2-001 | P2 | VS Code MCP config was renamed but still bypasses the launcher path used by other runtime configs | .vscode/mcp.json:14 | completeness/integration | Either document `.vscode/mcp.json` as intentionally direct-to-dist, or align it to `.opencode/bin/mk-spec-memory-launcher.cjs` like `.mcp.json` and the four documented runtimes. |
| 017-iter005-P1-001 | P1 | Plan document remains the scaffold template, not the shipped rename plan | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-llama-cpp/052-mk-spec-memory-rename/plan.md:43 | documentation | Replace the template placeholders and generic phases with the actual rename surfaces, verification plan, and rollback details. |
| 017-iter005-P1-002 | P1 | Spec metadata still says Draft, old 027 packet pointer, scaffold branch, and 10% completion after shipment | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-llama-cpp/052-mk-spec-memory-rename/spec.md:14 | documentation/regression-risk | Refresh frontmatter continuity, metadata status, branch, and completion fields to the 026/017 shipped packet state. |
| 017-iter006-P2-001 | P2 | Spec acceptance criteria names the new prefix as the string that should be absent | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-llama-cpp/052-mk-spec-memory-rename/spec.md:159 | documentation/correctness | Change REQ-004 and SC-001 to assert zero active `mcp__spec_kit_memory__` references, with documented exclusions for historical audit files. |
| 017-iter007-P1-001 | P1 | Graph metadata still marks the shipped packet as planned | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-llama-cpp/052-mk-spec-memory-rename/graph-metadata.json:16 | documentation/completeness | Regenerate or patch graph metadata so graph traversal and resume surfaces report the shipped/completed state and actual key files. |
| 017-iter007-P2-001 | P2 | Resource map omits committed `.mcp.json` and `.vscode/mcp.json` changes from runtime-config coverage | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-llama-cpp/052-mk-spec-memory-rename/resource-map.md:48 | documentation/completeness | Add the two committed MCP config surfaces or explicitly classify them as adjacent/non-gating surfaces. |
| 017-iter008-P2-001 | P2 | Implementation summary still reports strict validation as pending despite tasks and current validation showing pass | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-llama-cpp/052-mk-spec-memory-rename/implementation-summary.md:141 | documentation/regression-risk | Replace the pending row with the actual strict validation evidence, or make tasks and summary agree on the final verification state. |
| 017-iter009-P2-001 | P2 | Resource-map occurrence counts are internally inconsistent | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-llama-cpp/052-mk-spec-memory-rename/resource-map.md:63 | documentation/completeness | Reconcile the stated total of 86 files with the operational 61 plus historical 54+/90+ claims so the active-vs-historical split is auditable. |

## Deduplication Notes

- The command-frontmatter namespace issues were kept as three separate findings because they affect distinct command surfaces: /doctor, /doctor:update route manifest, and /memory:manage.
- Packet documentation drift was split between plan scaffold, stale metadata, graph metadata, validation evidence, and resource-map inventory because each has a separate owner and remediation path.

## Verdict

CONDITIONAL - no P0 findings, but active P1 findings remain.

findings_summary: { p0: 0, p1: 6, p2: 5, new_findings: 0 }
