---
title: Deep Review Strategy - 101/003 Deep AI Council Graph Support
description: YAML-owned review strategy for autonomous deep review of the Phase 003 council graph support packet.
---

# Deep Review Strategy - Session Tracking

## 1. OVERVIEW

Autonomous deep review for `.opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support` as both `review_target` and `spec_folder`. Target type is `spec-folder`; review dimensions are correctness, security, traceability, and maintainability. Executor is native.

---

## 2. TOPIC

Review completed Phase 003 implementation and docs for dedicated derived `deep-ai-council` graph support, including MCP council graph storage/query/handler surfaces, strict schemas, tests, and skill guidance.

---

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness - Logic errors, wrong invariants, query/convergence behavior, data model mismatch (iteration 1: 2 P1 findings)
- [x] D2 Security - Input validation, prompt-safe outputs, path/data exposure, namespace boundaries (iteration 2: 1 P1 finding)
- [x] D3 Traceability - Spec/code alignment, checklist evidence, decision record, verification claims (iteration 3: no new findings; confirmed carried-forward traceability failures and registration/skill alignment)
- [x] D4 Maintainability - Patterns, clarity, docs quality, rollback/replay ergonomics (iteration 4: 1 P2 advisory)
<!-- MACHINE-OWNED: END -->

---

## 4. NON-GOALS

- Do not modify files under review.
- Do not implement remediation during this review loop.
- Do not manually simulate iterations outside this packet-local `review/` state.

---

## 5. STOP CONDITIONS

- Stop at maxIterations=7.
- Stop earlier only if all configured dimensions are covered, legal-stop gates pass, and convergence threshold 0.10 is satisfied.
- Any active P0 yields FAIL; any active P1 yields CONDITIONAL; P2-only yields PASS with advisories.

---

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| Correctness | CONDITIONAL | 1 | Found two P1 correctness/evidence mismatches: empty upsert rejects the documented no-op contract, and convergence CONTINUE coverage is claimed but not tested. |
| Security | CONDITIONAL | 2 | Found one P1 prompt-safety issue: arbitrary node/edge metadata is accepted, stored, and returned by council query serializers without redaction or size bounds. |
| Traceability | CONDITIONAL | 3 | Added no new findings; confirmed active spec/code, checklist-evidence, and prompt-safe-output failures while verifying tool registration and deep-ai-council graph guidance alignment. |
| Maintainability | CONDITIONAL | 4 | Found one P2 recovery ergonomics advisory: rollback/replay guidance is documented but lacks a first-class cleanup/rebuild helper or replay command path. |
<!-- MACHINE-OWNED: END -->

---

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 3 active
- **P2 (Minor):** 1 active
- **Delta this iteration:** +0 P0, +0 P1, +1 P2
<!-- MACHINE-OWNED: END -->

---

## 8. WHAT WORKED

- Iteration 1: Correctness review over the council graph store, handlers, schemas, tests, and packet docs produced concrete file:line evidence for behavior/evidence mismatches.
- Iteration 2: Security review confirmed namespace and limit clamps while identifying one prompt-safety metadata exposure gap with concrete schema/serializer evidence.
- Iteration 3: Traceability review confirmed tool/schema/dispatcher registration and deep-ai-council skill/playbook graph-boundary alignment without opening duplicate findings.
- Iteration 4: Maintainability review confirmed the DB/query/handler split is readable and isolated while identifying a bounded recovery-ergonomics advisory.

---

## 9. WHAT FAILED

- Iteration 1: Empty-upsert and convergence-CONTINUE evidence gaps remain active P1s; do not treat checklist completion as sufficient until code/tests are reconciled.
- Iteration 2: Prompt-safe output evidence remains incomplete for arbitrary metadata; checklist input-validation claims do not prove response redaction or size bounds.
- Iteration 3: Reducer-owned findings registry still appears stale relative to JSONL/prompt history, so active finding carry-forward remains dependent on state-log evidence until reducer refresh.
- Iteration 4: Recovery docs describe stale-row deletion/replay, but reviewed council graph DB/handler surfaces do not provide a first-class cleanup or replay path.

---

## 10. EXHAUSTED APPROACHES (do not retry)

- Iteration 1: P0 destructive data-loss concern was ruled out for this slice because graph rows are derived and source-of-truth remains packet-local artifacts.
- Iteration 1: Direct deep-loop graph semantic reuse was ruled out in reviewed council graph files.
- Iteration 2: SQL injection through graph identifiers was ruled out for reviewed database paths because prepared statements use bound parameters.
- Iteration 2: Cross-session reads through public handlers were ruled out for this iteration because handlers require `sessionId` and pass it into namespace-scoped queries.

---

## 11. RULED OUT DIRECTIONS

- None yet.

---

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
Iteration 5: cross-reference synthesis/adjudication after full dimension coverage, carrying forward active P1-001, P1-002, P1-003, and advisory P2-001.
<!-- MACHINE-OWNED: END -->

---

## 13. KNOWN CONTEXT

- `memory_context` returned no direct prior records for this exact packet under the budgeted focused retrieval.
- `resource-map.md` is not present in this spec folder; Resource Map Coverage Gate is skipped per workflow.
- Spec docs mark the phase complete and record prior verification commands.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | fail | 1 | Empty-upsert implementation returns an error despite the spec edge-case no-op contract. |
| `checklist_evidence` | core | fail | 1 | CHK-022 claims CONTINUE convergence coverage, but reviewed tests assert only STOP_BLOCKED and STOP_ALLOWED. |
| `prompt_safe_output` | core | fail | 2 | Arbitrary node/edge metadata is returned by prompt-safe serializers without redaction or size bounds. |
| `skill_agent` | overlay | pass | 3 | `SKILL.md` routes GRAPH_SUPPORT to `references/graph_support.md`, and both preserve derived graph/source-of-truth boundaries. |
| `agent_cross_runtime` | overlay | notApplicable | - | No agent definition changes are claimed by this packet. |
| `feature_catalog_code` | overlay | partial | 3 | Tool descriptors, input schemas, and dispatcher registration align for all four `council_graph_*` tools; metadata prompt-safety remains failed via P1-003. |
| `playbook_capability` | overlay | pass | 3 | DAC-011 boundary scenario requires derived/scoped graph support and fails source-of-truth replacement claims. |
| `maintainability_recovery` | overlay | advisory | 4 | Rollback/replay guidance is documented, but reviewed council graph DB/handler surfaces expose no first-class cleanup or replay helper. |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/spec.md` | - | - | 0 | pending |
| `.opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/plan.md` | - | - | 0 | pending |
| `.opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/tasks.md` | - | - | 0 | pending |
| `.opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/checklist.md` | - | - | 0 | pending |
| `.opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/decision-record.md` | - | - | 0 | pending |
| `.opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/implementation-summary.md` | - | - | 0 | pending |
| `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-db.ts` | - | - | 0 | pending |
| `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-query.ts` | - | - | 0 | pending |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/` | - | - | 0 | pending |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | - | - | 0 | pending |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | - | - | 0 | pending |
| `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts` | - | - | 0 | pending |
| `.opencode/skills/system-spec-kit/mcp_server/tests/council-graph.vitest.ts` | - | - | 0 | pending |
| `.opencode/skills/deep-ai-council/SKILL.md` | - | - | 0 | pending |
| `.opencode/skills/deep-ai-council/references/graph_support.md` | - | - | 0 | pending |
| `.opencode/skills/deep-ai-council/manual_testing_playbook/05--scope-boundaries/001-graph-support-explicitly-out-of-scope.md` | - | - | 0 | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 7
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-05-10T18:45:03.440Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-05-10T18:45:03.440Z
<!-- MACHINE-OWNED: END -->
