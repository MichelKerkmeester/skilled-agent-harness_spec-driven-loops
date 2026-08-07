# Deep Review Strategy - B-rest-of-002

## 2. TOPIC
Review of `.opencode/skills/system-spec-kit/mcp_server/` memory store, index, and write-lifecycle code outside the search/retrieval pipeline.

---

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness, Logic errors, state transitions, and write-path invariants
- [x] D2 Security, Path handling and deletion/retention trust boundaries sampled
- [x] D3 Traceability, Scope document cross-checked against sampled code
- [x] D4 Maintainability, Lifecycle tests and failure paths sampled
<!-- MACHINE-OWNED: END -->

---

## 4. NON-GOALS
- Do not review the search/retrieval ranking pipeline covered by scope A.
- Do not implement fixes during this review lineage.
- Do not write outside the lineage artifact directory.

---

## 5. STOP CONDITIONS
- Stop after `config.maxIterations=1` per fan-out lineage parameters.
- Synthesize findings even without convergence when the iteration cap is reached.

---

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | CONDITIONAL | 1 | Found two P1 data-integrity/write-lifecycle defects. |
| D2 Security | PASS | 1 | No SQL injection or path traversal defect confirmed in sampled handlers. |
| D3 Traceability | CONDITIONAL | 1 | Findings align with the scope's write safety and lifecycle emphasis. |
| D4 Maintainability | CONDITIONAL | 1 | Existing tests miss two failure modes around post-commit promotion and chunk tombstones. |
<!-- MACHINE-OWNED: END -->

---

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 2 active
- **P2 (Minor):** 0 active
- **Delta this iteration:** +0 P0, +2 P1, +0 P2
<!-- MACHINE-OWNED: END -->

---

## 8. WHAT WORKED
- Following write ordering across `atomic-index-memory.ts` into `processPreparedMemory()` exposed a commit-before-promote window.
- Comparing chunk parent/child schema to soft-delete behavior exposed a tombstone propagation gap.

---

## 9. WHAT FAILED
- Treating retention's purgeable tombstone partition as a standalone defect was ruled out because tests explicitly assert that behavior.

---

## 10. EXHAUSTED APPROACHES (do not retry)
- None in this single-iteration lineage.

---

## 11. RULED OUT DIRECTIONS
- Retention tombstone partition alone: intended two-stage purge behavior, evidence in `memory-retention-sweep.vitest.ts:143-176`.
- Maintenance job table initialization: context-server initializes and crash-recovers the job store at boot.

---

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
Remediate F001 and F002, then rerun focused tests for atomic promote failure and soft-delete chunk propagation.
<!-- MACHINE-OWNED: END -->

---

## 13. KNOWN CONTEXT
- `resource-map.md not present. Skipping coverage gate`.
- Scope document: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/B-rest-of-002/spec.md`.
- Memory trigger lookup found no scope-specific trigger matches; the supplied lineage session id was not accepted by the memory server, so review artifacts retain it only as lineage metadata.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 1 | Scope lines 6-14 map to reviewed write/index/lifecycle files. |
| `checklist_evidence` | core | pass | 1 | No checklist in scope folder; marked skipped/not applicable for this fan-out scope. |
| `skill_agent` | overlay | notApplicable | 1 | Target type is spec-folder, not skill. |
| `agent_cross_runtime` | overlay | notApplicable | 1 | Target type is spec-folder, not agent. |
| `feature_catalog_code` | overlay | partial | 1 | Feature comments claim memory indexing and transaction wrappers; F001/F002 show lifecycle gaps. |
| `playbook_capability` | overlay | partial | 1 | Tests exist for adjacent behavior but miss the two confirmed failure modes. |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts` | D1, D3, D4 | 1 | 1 P1 | partial |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | D1, D3, D4 | 1 | 1 P1 | partial |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/create-record.ts` | D1, D3 | 1 | 1 P1 | partial |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts` | D1, D2, D3 | 1 | 1 P1 | partial |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts` | D1, D2 | 1 | 0 | sampled |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts` | D1, D3 | 1 | 1 P1 | partial |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` | D1, D3 | 1 | 1 P1 | partial |
| `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts` | D1, D2, D3 | 1 | 1 P1 | partial |
| `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-store.ts` | D1, D4 | 1 | 0 | sampled |
| `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts` | D1, D4 | 1 | 0 | sampled |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 1
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-gpt55r2-b-3-1781761339355-o7qylx, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: bounded single fan-out pass
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[feature_catalog_code, playbook_capability]
- Started: 2026-06-18T05:50:09.000Z
<!-- MACHINE-OWNED: END -->
