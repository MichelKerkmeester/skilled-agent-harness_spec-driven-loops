# Deep Review Strategy - gpt55r2-b-7

## 1. Topic
Fan-out lineage review of `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/B-rest-of-002`, targeting memory store/index/lifecycle code under `.opencode/skills/system-spec-kit/mcp_server/`.

## 2. Review Dimensions (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness, Logic errors, invariants, delete semantics, cancellation lifecycle
- [x] D2 Security, SQL/path/scope handling, governed ingest boundaries
- [x] D3 Traceability, Scope-to-code alignment and evidence checks
- [x] D4 Maintainability, lifecycle consistency and rollback symmetry
<!-- MACHINE-OWNED: END -->

## 3. Non-Goals
Search/retrieval ranking behavior and scope A retrieval pipeline internals were not reviewed except where needed to confirm store/delete lifecycle consequences.

## 4. Stop Conditions
Max iteration cap is 1. Stop after iteration 001 and synthesize even with active findings.

## 5. Completed Dimensions
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | CONDITIONAL | 1 | Soft-delete mode can report delete success without removing the row from active projection-backed readers. |
| D2 Security | CONDITIONAL | 1 | Governed scan/ingest can leave committed rows without scope/retention metadata if post-insert metadata fails. |
| D3 Traceability | CONDITIONAL | 1 | Scope matched the reviewed memory store/index lifecycle files; no checklist artifact was present. |
| D4 Maintainability | CONDITIONAL | 1 | Direct-save rollback and bulk scan/ingest rollback semantics diverge. |
<!-- MACHINE-OWNED: END -->

## 6. Running Findings
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 2 active
- **P2 (Minor):** 0 active
- **Delta this iteration:** +0 P0, +2 P1, +0 P2
<!-- MACHINE-OWNED: END -->

## 7. What Worked
- Comparing direct `memory_save` governance cleanup against scan/ingest `indexMemoryFile` reuse exposed rollback asymmetry.
- Following `SPECKIT_SOFT_DELETE_TOMBSTONES` from handlers into active projection consumers exposed delete visibility drift.

## 8. What Failed
- No `checklist.md` or `resource-map.md` exists in the scope packet, so checklist and resource-map coverage are limited to explicit N/A notes.

## 9. Exhausted Approaches (do not retry)
- Retention hard-delete orphaning: ruled out for the inspected path because `delete_memory_from_database` runs vector, ancillary, causal sweep, embedding cache, and source row deletion inside a transaction.
- Cancel-drains-all-batches: ruled out because `processBatches` honors `shouldAbort` at batch boundaries and skips inter-batch delay after cancellation.

## 10. Ruled Out Directions
- Retention sweep TOCTOU without revalidation: `getCurrentExpiredRow` is called inside the sweep transaction before delete.
- Background scan stale lease: scan lease heartbeat and final release are present.

## 11. Next Focus
<!-- MACHINE-OWNED: START -->
Remediate F001 and F002, then rerun a focused review on governed scan/ingest rollback and soft-delete active projection/search visibility.
<!-- MACHINE-OWNED: END -->

## 12. Known Context
No matching trigger memories were found for this exact fan-out scope. Constitutional context emphasized not hand-rolling deep workflow state and backing every finding with file:line evidence.

Resource-map note: `resource-map.md` not present in the target scope. Skipping coverage gate.

## 13. Cross-Reference Status
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 1 | Scope claims resolved to the memory store/index files; findings F001 and F002 are within scope. |
| `checklist_evidence` | core | partial | 1 | No checklist artifact exists in the scope packet. |
| `skill_agent` | overlay | notApplicable | 1 | Target type is spec-folder. |
| `agent_cross_runtime` | overlay | notApplicable | 1 | Target type is spec-folder. |
| `feature_catalog_code` | overlay | partial | 1 | Scan/ingest feature surfaces exist, but governed rollback semantics diverge. |
| `playbook_capability` | overlay | blocked | 1 | No playbook artifact was present in scope. |
<!-- MACHINE-OWNED: END -->

## 14. Files Under Review
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/B-rest-of-002/spec.md` | D3 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | D2, D3, D4 | 1 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | D2, D3 | 1 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | D2, D4 | 1 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts` | D1, D3 | 1 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts` | D1, D3 | 1 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts` | D1 | 1 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts` | D1 | 1 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` | D1 | 1 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts` | D1, D3 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts` | D1, D3 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-store.ts` | D1, D4 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts` | D1, D4 | 1 | 0 P0, 0 P1, 0 P2 | complete |
<!-- MACHINE-OWNED: END -->

## 15. Review Boundaries
<!-- MACHINE-OWNED: START -->
- Max iterations: 1
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-gpt55r2-b-7-1781761339355-o7qylx, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[feature_catalog_code, playbook_capability]
- Started: 2026-06-18T06:17:55Z
<!-- MACHINE-OWNED: END -->
