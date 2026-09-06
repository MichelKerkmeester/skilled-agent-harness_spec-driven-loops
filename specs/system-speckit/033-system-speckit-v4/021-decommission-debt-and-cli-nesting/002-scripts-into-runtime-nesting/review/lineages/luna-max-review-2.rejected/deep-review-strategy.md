---
title: Deep Review Strategy
description: Lineage-local review strategy for the scripts-to-runtime nesting packet.
version: 1.11.0.13
---

# Deep Review Strategy - Session Tracking

## 1. OVERVIEW
This lineage performs ten inline review passes over the packet and its bounded 453-path manifest. Convergence is telemetry only because `stopPolicy` is `max-iterations`.

## 2. TOPIC
Review `.opencode/specs/system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting` against the current `runtime/cli` tree, packet evidence and directly referenced consumers.

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
- [ ] correctness
- [ ] security
- [ ] traceability
- [ ] maintainability
<!-- /ANCHOR:review-dimensions -->

## 4. NON-GOALS
- Do not modify the target packet, source tree, generated repository artifacts, git state or external services.
- Do not run repository validation, build or test tooling that could write outside this lineage.
- Do not emit an initialization resource-map coverage gate because no resource map existed at init.

## 5. STOP CONDITIONS
Run all ten iterations. Convergence before iteration ten is telemetry only. A pause sentinel, malformed state, or failed write authorization would block completion.

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
None yet.
<!-- /ANCHOR:completed-dimensions -->

<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0 active
- P1 (Required): 0 active
- P2 (Suggestions): 0 active
- Resolved: 0
- Iterations completed: 0
<!-- /ANCHOR:running-findings -->

## 8. WHAT WORKED
- Direct source reads plus exact path-existence checks provide evidence without mutating the repository.
- The prior lineage report supplies hypotheses only; every current finding is rechecked against the current tree.

## 9. WHAT FAILED
- Coverage-graph writes are unavailable under the detached lineage write-surface restriction.

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
None yet.
<!-- /ANCHOR:exhausted-approaches -->

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
<!-- MACHINE-OWNED: START -->
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: correctness, security, traceability, maintainability
<!-- MACHINE-OWNED: END -->

## 11. RULED OUT DIRECTIONS
None yet.

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Correctness: package workspace scripts, Vitest project roots and moved executable entrypoints.
<!-- /ANCHOR:next-focus -->

## 13. KNOWN CONTEXT
### Bounded Context Snapshot
- Target pointers: `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md`, `description.json`, `graph-metadata.json`, `scratch/inventory.md`, `scratch/path-map.json`, `scratch/execute-plan.md`, `scratch/review-scope.txt` and listed implementation consumers.
- Behavior claims: the CLI workspace is at `runtime/cli`, continuity is at `runtime/cli/continuity`, `runtime/scripts` remains build tooling, and the packet claims the move is complete.
- Reuse and conventions: root workspace manifest, CLI package manifest, root and runtime Vitest configs, path-map inventory and packet-053 closeout evidence.
- Risks and gaps: current generated dist may be absent in a source checkout, graph writes are unavailable, and packet documents may disagree with shipped paths.
- Resource map: `resource-map.md` was absent at init, so the initialization coverage gate is skipped.

## 14. CROSS-REFERENCE STATUS
<!-- ANCHOR:cross-reference -->
| Protocol | Level | Status | Iteration | Notes |
|---|---|---|---:|---|
| `spec_code` | core | pending | 0 | Compare claims with current implementation paths. |
| `checklist_evidence` | core | pending | 0 | Reconcile checked tasks and acceptance evidence. |
| `feature_catalog_code` | overlay | pending | 0 | Inspect catalog references when they name moved surfaces. |
| `playbook_capability` | overlay | pending | 0 | Inspect executable playbook commands in scope. |
| `skill_agent` | overlay | notApplicable | 0 | Target is a spec folder. |
| `agent_cross_runtime` | overlay | notApplicable | 0 | Target is a spec folder. |
<!-- /ANCHOR:cross-reference -->

## 15. FILES UNDER REVIEW
<!-- ANCHOR:file-coverage -->
The authoritative manifest is `.opencode/specs/system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting/scratch/review-scope.txt` with 453 entries. Iteration files record the bounded partitions read in each pass.
<!-- /ANCHOR:file-coverage -->

## 16. REVIEW BOUNDARIES
<!-- ANCHOR:boundaries -->
- Max iterations: 10
- Convergence threshold: 3
- Stop policy: max-iterations
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-luna-max-review-2-1788619675959-m55pwa, parentSessionId=null, generation=1, lineageMode=new
- Artifact root: `.opencode/specs/system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting/review/lineages/luna-max-review-2`
- Executor: cli-opencode model=llmgateway/gpt-5.6-luna, inline iteration execution, no nested dispatch
- Severity threshold: P2
<!-- /ANCHOR:boundaries -->
