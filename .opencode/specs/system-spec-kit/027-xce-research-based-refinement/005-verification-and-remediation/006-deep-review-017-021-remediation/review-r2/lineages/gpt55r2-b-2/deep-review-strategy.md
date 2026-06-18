# Deep Review Strategy - B-rest-of-002

## 1. Topic
Review of memory store/index/lifecycle code for `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/B-rest-of-002`.

## 2. Review Dimensions (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness, Logic errors, wrong state transitions, broken invariants
- [x] D2 Security, deletion visibility, data exposure, path/write boundaries
- [ ] D3 Traceability, Spec/code alignment, checklist evidence, cross-reference integrity
- [ ] D4 Maintainability, Patterns, clarity, safe follow-on change cost
<!-- MACHINE-OWNED: END -->

## 3. Non-Goals
- Do not modify code under review.
- Do not review the search/retrieval pipeline beyond direct active-row leakage evidence needed for store/lifecycle findings.
- Do not write outside the fan-out lineage artifact directory.

## 4. Stop Conditions
- Stop after `config.maxIterations=1` or convergence, whichever comes first.
- Stop immediately on confirmed P0 with file/line evidence.

## 5. Completed Dimensions
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|---|---|---:|---|
| Correctness | CONDITIONAL | 1 | Soft-delete lifecycle leaves tombstoned rows active to read/dedup surfaces. |
| Security | CONDITIONAL | 1 | Delete success can leave logically deleted records visible/addressable while tombstones await purge. |
<!-- MACHINE-OWNED: END -->

## 6. Running Findings
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 1 active
- **P2 (Minor):** 0 active
- **Delta this iteration:** +0 P0, +1 P1, +0 P2
<!-- MACHINE-OWNED: END -->

## 7. What Worked
- Read the delete implementation first, then followed active read/dedup consumers that would decide whether tombstones remain externally visible.
- Cross-checked job cancellation and transaction recovery surfaces for comparable lifecycle hazards.

## 8. What Failed
- Full broad-scope exhaustion was not possible with `maxIterations=1`.

## 9. Exhausted Approaches
- None.

## 10. Ruled Out Directions
- Retention sweep causal-edge orphaning was not filed because hard-delete helpers invoke ancillary causal cleanup.

## 11. Next Focus
<!-- MACHINE-OWNED: START -->
If another iteration runs, review `memory-index.ts` cancellation during post-processing and causal graph lifecycle writes.
<!-- MACHINE-OWNED: END -->

## 12. Known Context
- Scope file says this is an independent audit of the memory store, index, and write-lifecycle code outside search/retrieval and outside 017-021 fixes. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/B-rest-of-002/spec.md:3-14]
- `resource-map.md` not present; skipping coverage gate.

## 13. Cross-Reference Status
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|---|---|---|---:|---|
| `spec_code` | core | partial | 1 | Scope/code alignment checked for the active finding and several lifecycle surfaces; full broad scope not exhausted. |
| `checklist_evidence` | core | partial | 1 | No checklist exists in the scoped folder. |
| `feature_catalog_code` | overlay | partial | 1 | Feature catalog comments aligned with reviewed files, but broad catalog not exhausted. |
| `playbook_capability` | overlay | notApplicable | 1 | No playbook artifact in scope. |
<!-- MACHINE-OWNED: END -->

## 14. Files Under Review
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|---|---|---:|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts` | D1, D2 | 1 | 1 P1 | partial |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts` | D1, D2 | 1 | 0 | partial |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-list.ts` | D1, D2 | 1 | 1 P1 evidence | partial |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/dedup.ts` | D1, D2 | 1 | 1 P1 evidence | partial |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/create-record.ts` | D1 | 1 | 0 | partial |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts` | D1, D2 | 1 | 1 P1 evidence | partial |
| `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts` | D1 | 1 | 0 | partial |
| `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-store.ts` | D1 | 1 | 0 | partial |
| `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts` | D1 | 1 | 0 | partial |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts` | D1 | 1 | 0 | partial |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts` | D1 | 1 | 0 | partial |
<!-- MACHINE-OWNED: END -->

## 15. Review Boundaries
<!-- MACHINE-OWNED: START -->
- Max iterations: 1
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-gpt55r2-b-2-1781761339355-o7qylx, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[feature_catalog_code, playbook_capability]
- Started: 2026-06-18T05:50:43Z
<!-- MACHINE-OWNED: END -->
