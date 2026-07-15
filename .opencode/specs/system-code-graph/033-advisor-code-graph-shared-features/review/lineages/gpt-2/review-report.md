# Deep Review Report: gpt-2 Lineage

## Executive Summary

- Verdict: CONDITIONAL
- Stop reason: maxIterationsReached
- Iterations: 3
- Active P0: 0
- Active P1: 2
- Active P2: 1
- hasAdvisories: true
- Scope: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph` plus implemented advisor/code-graph files referenced by child phase evidence.

## Planning Trigger

Route to remediation planning because active P1 findings remain. F001 affects packet state/resume truth, and F002 affects Phase 009's advertised resolver capability. If either behavior is intentional, amend the spec/checklist instead of changing code.

## Active Finding Registry

| ID | Severity | Dimension | Title | Evidence | Status |
|----|----------|-----------|-------|----------|--------|
| F001 | P1 | traceability | Phase parent still advertises scaffold-only planned state after child phases report implementation and verification | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/spec.md:71` | active |
| F002 | P1 | correctness | BM25 symbol resolver does not cover ambiguous exact matches or context seed suggestions promised by phase scope | `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:448-484` | active |
| F003 | P2 | maintainability | Code comment retains ephemeral bug-tracking label in a durable source file | `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:959-966` | active |

## Remediation Workstreams

1. Packet-state reconciliation: update the parent phase map, scaffold-only wording, graph metadata status, and active-child pointer to reflect implemented child phases or explicitly delegate state to children.
2. Phase 009 scope reconciliation: either implement BM25 assistance for ambiguous exact matches and context seed suggestions, or amend Phase 009 spec/tasks/summary to state unresolved-subject fallback only.
3. Comment hygiene cleanup: remove `BUG-03:` from the query handler comment while preserving the durable why.

## Spec Seed

- Clarify whether phase-parent status should remain a control-file-only summary or aggregate child completion state.
- Clarify Phase 009 accepted scope: unresolved-subject query fallback only vs ambiguous exact matches plus `code_graph_context` seed suggestions.

## Plan Seed

- Add a targeted traceability task for parent metadata refresh.
- Add Phase 009 acceptance criteria for ambiguous exact matches and context seed suggestions, or remove those claims from scope.
- Add a comment-hygiene check case that flags `BUG-\d+` labels in durable source comments.

## Traceability Status

| Protocol | Status | Gate | Notes |
|----------|--------|------|-------|
| spec_code | partial | hard | F001 and F002 remain active. |
| checklist_evidence | partial | hard | Phase 009 completion claims do not cover broader scope wording. |
| feature_catalog_code | partial | advisory | Parent phase map remains planned despite child implementation evidence. |
| playbook_capability | skipped | advisory | No playbook artifact found in bounded pass. |

## Deferred Items

- F003 is advisory and can be batched with the next code-graph cleanup.
- Code Graph MCP structural queries were unavailable in this runtime; a future rerun can add graph-backed caller/impact evidence.
- Parent `resource-map.md` was absent at init, so resource-map coverage gate was skipped.

## Audit Appendix

| Iteration | Dimension | New Findings Ratio | Findings | Verdict |
|-----------|-----------|--------------------|----------|---------|
| 001 | correctness | 1.00 | F002 | CONDITIONAL |
| 002 | security | 0.00 | none | PASS |
| 003 | traceability, maintainability | 1.00 | F001, F003 | CONDITIONAL |

### Convergence Replay

- Max iterations reached: yes, 3 / 3.
- Dimension coverage: 4 / 4.
- Required traceability protocols: partial due F001 and F002.
- Active P0: 0.
- Active P1: 2.
- Final verdict: CONDITIONAL.

### Evidence Replay

- F001 cites parent spec and graph metadata plus child implementation summaries.
- F002 cites Phase 009 scope and implementation paths proving unresolved-only resolver integration.
- F003 cites the source comment and phase verification summary.

### Resource Map Coverage Gate

- Not applicable: parent `resource-map.md` was not present at init.
