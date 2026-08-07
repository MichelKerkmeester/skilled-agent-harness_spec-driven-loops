# Deep Review Report: 101/003 Deep AI Council Graph Support

## Executive Summary

- Overall verdict: CONDITIONAL
- hasAdvisories: true
- Stop reason: converged after 4 of 7 max iterations
- Active findings: P0=0, P1=3, P2=1
- Review scope: Phase 003 spec folder plus council graph MCP storage/query/handler/schema/tool/test surfaces and deep-ai-council graph guidance.

## Planning Trigger

`/speckit:plan` is required before PASS if the packet is intended to ship as complete, because active P1 findings remain.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "activeFindings": ["P1-001", "P1-002", "P1-003", "P2-001"],
  "remediationWorkstreams": [
    "Reconcile empty upsert schema/docs/runtime behavior and add a regression test.",
    "Add a council_graph_convergence CONTINUE branch test or remove the checklist claim.",
    "Redact or size-bound prompt-safe metadata output and test hostile metadata.",
    "Document or implement a bounded stale-row replay/cleanup path."
  ],
  "specSeed": "Update Phase 003 acceptance criteria for empty-upsert behavior, prompt-safe metadata boundaries, and convergence branch evidence.",
  "planSeed": "Add targeted handler/schema/test tasks for P1-001 through P1-003, plus advisory recovery ergonomics for P2-001.",
  "findingClasses": ["cross-consumer", "matrix/evidence"],
  "affectedSurfacesSeed": ["council_graph_upsert", "council_graph_convergence", "council_graph_query", "tool-input-schemas", "council-graph tests", "graph_support.md"],
  "fixCompletenessRequired": true
}
```

## Active Finding Registry

| ID | Severity | Title | Dimension | Evidence | Disposition |
|----|----------|-------|-----------|----------|-------------|
| P1-001 | P1 | Empty upsert violates the documented no-op contract | correctness | `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/upsert.ts:52`; `.opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/spec.md:208`; `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:720` | active |
| P1-002 | P1 | Verification claims convergence CONTINUE coverage that tests do not exercise | correctness | `.opencode/skills/system-spec-kit/mcp_server/tests/council-graph.vitest.ts:142`; `.opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/checklist.md:78`; `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/convergence.ts:77` | active |
| P1-003 | P1 | Arbitrary metadata is returned as prompt-safe output without redaction or size bounds | security | `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-query.ts:67`; `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:707`; `.opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/spec.md:196` | active |
| P2-001 | P2 | Replay recovery remains manual despite documented rollback workflow | maintainability | `.opencode/skills/deep-ai-council/references/graph_support.md:96`; `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-db.ts:495`; `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/status.ts:24` | advisory |

## Remediation Workstreams

- P1-001: Decide empty upsert contract and align schema, handler, spec, and tests.
- P1-002: Add missing `CONTINUE` convergence test coverage or correct checklist wording.
- P1-003: Sanitize prompt-safe metadata responses with allowlisting/size caps and regression tests.
- P2-001: Add or document a bounded replay/cleanup path for stale derived graph rows.

## Spec Seed

- Clarify whether empty council graph upserts are valid no-op calls or validation errors.
- Define the metadata fields allowed in prompt-safe council graph output.
- Require explicit convergence branch coverage for STOP_ALLOWED, CONTINUE, and STOP_BLOCKED.

## Plan Seed

- Patch `handleCouncilGraphUpsert` or `councilGraphUpsertSchema` for the selected empty-input contract.
- Extend `council-graph.vitest.ts` with a `CONTINUE` convergence fixture.
- Add hostile/oversized metadata fixtures proving bounded prompt-safe output.
- Add recovery/replay documentation or helper coverage for derived row rebuilds.

## Traceability Status

| Protocol | Status | Evidence |
|----------|--------|----------|
| spec_code | fail | P1-001 and P1-003 contradict spec edge-case/prompt-safe requirements. |
| checklist_evidence | fail | P1-002 contradicts CHK-022 evidence claim. |
| feature_catalog_code | partial | Tool registration exists, but upsert/query contracts have active P1s. |
| skill_agent | pass | Skill/reference guidance preserves derived graph and artifact authority boundaries. |
| playbook_capability | pass | Boundary playbook distinguishes graph support from source-of-truth replacement. |

## Deferred Items

- P2-001 can be handled after P1 remediation if release scope accepts manual derived-row cleanup for the first graph slice.

## Audit Appendix

- Iterations completed: 4
- Dimension coverage: correctness, security, traceability, maintainability
- Graph convergence: STOP_ALLOWED after evidence-density graph edges were populated
- No P0 findings were identified.
- Active P1 findings include typed claim adjudication in their source iteration narratives.
- Resource map coverage gate: skipped because packet-local `resource-map.md` was absent at init.
