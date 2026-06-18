# Deep Review Report: gpt-1 Lineage

## Executive Summary

- Verdict: CONDITIONAL
- Stop reason: maxIterationsReached
- Iterations: 3
- Active findings: P0=0, P1=3, P2=0
- hasAdvisories: false
- Scope: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph` plus selected advisor/code-graph files cited by child phases.
- Release readiness: in-progress

The reviewed work has no confirmed P0 blocker, but it is not release-ready. Three P1 issues remain: one advisor feature is helper-only rather than production-shadowed, one code-graph trace feature is handler-only rather than public-schema reachable, and the parent phase packet is stale relative to completed child phases.

## Planning Trigger

Route to remediation planning before any release-readiness claim. The active P1 findings require code/schema/doc reconciliation, not just documentation cleanup.

## Active Finding Registry

| ID | Severity | Dimension | Title | Evidence | Status |
|----|----------|-----------|-------|----------|--------|
| F001 | P1 | correctness | Advisor BM25 shadow lane is never consumed by production fusion | `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:191-194` | active |
| F002 | P1 | security/maintainability | `code_graph_query(includeTrace)` is implemented in handler but rejected by public schema | `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:45-60` | active |
| F003 | P1 | traceability | Parent packet still claims scaffold-only planned status while child phases are completed | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/spec.md:51` | active |

## Remediation Workstreams

1. F001: Decide whether phase 003 is library-only or production-shadow. If production-shadow, wire `scoreLexicalShadowLanes`/BM25 telemetry into scorer output without changing live weights, and add public/handler tests proving the flag produces shadow-only telemetry.
2. F002: Add `includeTrace` to the published `code_graph_query` schema and validation tests, or amend phase 008 to state that only `code_graph_context` exposes public trace until query schema work lands.
3. F003: Reconcile the parent phase packet: update status/phase map/graph metadata to reflect completed children and active review findings while preserving phase-parent lean-doc discipline.

## Spec Seed

- Add acceptance criteria for public-schema reachability when a handler adds new request fields.
- Add phase-parent completion reconciliation criteria once any child phase reaches completed status.
- Clarify whether default-off shadow helpers must be observable through production shadow telemetry or may be library-only.

## Plan Seed

- Add a targeted advisor scorer test that calls `scoreAdvisorPrompt` or `advisor_recommend` with `SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW=true` and asserts BM25 shadow evidence is present while live score/ranking is unchanged.
- Add a tool-schema validation test accepting `code_graph_query` with `includeTrace: true`.
- Run parent metadata refresh after updating parent spec text and child phase status map.

## Traceability Status

| Protocol | Status | Gate | Summary |
|----------|--------|------|---------|
| spec_code | partial | hard | Parent claims and child implementation state conflict; F003. |
| checklist_evidence | partial | hard | Child evidence exists, but parent integration is stale. |
| feature_catalog_code | partial | advisory | Handler/helper capabilities are not fully reachable through public production surfaces; F001/F002. |
| playbook_capability | not_applicable | advisory | No playbook surface was in this lineage scope. |

## Deferred Items

- Code graph MCP status was stale during review, so structural graph queries were not treated as authoritative. Direct Grep/Read evidence was used instead.
- Parent resource-map coverage was skipped because parent `resource-map.md` is absent.

## Audit Appendix

| Iteration | Focus | Verdict | New Findings |
|-----------|-------|---------|--------------|
| 001 | correctness | CONDITIONAL | F001 |
| 002 | security/maintainability | CONDITIONAL | F002 |
| 003 | traceability/maintainability | CONDITIONAL | F003 |

### Convergence Replay

- Dimension coverage: 4 / 4.
- Last ratios: 1.0000, 0.5000, 0.3333.
- Stop: maxIterationsReached.
- Legal PASS is blocked by active P1 findings.

### Evidence Gate

- Every active finding has file:line evidence.
- No P0 findings were recorded.
- P1 claim adjudication packets are embedded in iteration files and summarized in JSONL events.

### Artifact Integrity

- Config, state JSONL, registry, strategy, dashboard, resource map, iteration files, and this report were written under `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/review/lineages/gpt-1`.
