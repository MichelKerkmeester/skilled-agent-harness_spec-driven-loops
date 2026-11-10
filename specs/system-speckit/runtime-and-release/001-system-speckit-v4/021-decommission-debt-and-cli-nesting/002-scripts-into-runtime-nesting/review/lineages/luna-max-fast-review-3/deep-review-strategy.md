---
title: Deep Review Strategy
description: Lineage-local review strategy for the scripts-to-runtime nesting packet.
version: 1.11.0.13
---

# Deep Review Strategy - Session Tracking

## 1. OVERVIEW

This strategy tracks ten inline review passes over the current packet and its
bounded changed-file manifest. Convergence is telemetry only because the stop
policy is `max-iterations`.

## 2. TOPIC

Review `.opencode/specs/system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting`
against the current `runtime/cli` tree, packet evidence and directly referenced consumers.

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
- [x] correctness
- [ ] security
- [ ] traceability
- [ ] maintainability
<!-- /ANCHOR:review-dimensions -->

## 4. NON-GOALS

- Do not modify target packet documents, source files, generated repository artifacts, git state or external services.
- Do not run repository validation, build, install or test tooling that could write outside this lineage.
- Do not emit an initialization resource-map coverage gate because the target packet has no root `resource-map.md`.

## 5. STOP CONDITIONS

Run all ten iterations. Convergence before iteration ten is telemetry only. A
pause sentinel, malformed state, or failed write authorization is a blocker.

<!-- ANCHOR:completed-dimensions -->
## 6. COMPLETED DIMENSIONS

- correctness (iteration 1): packet scope, moved-tree documentation and recorded level-gate paths.
- security (iteration 3): CLI output-path containment and moved write sinks.
- traceability (iteration 4): review manifest coverage and execution-map package identity.
- maintainability (iteration 5): central script-registry dependency metadata.
- maintainability (iteration 6): test discovery and generated-dist ordering.
- maintainability (iteration 7): CLI source-dist alignment coverage.
- maintainability (iteration 8): wrapper and intentional symlink ownership.
- maintainability (iteration 9): external consumer resolution.
<!-- /ANCHOR:completed-dimensions -->

<!-- ANCHOR:running-findings -->
## 7. RUNNING FINDINGS

- P0 (Blockers): 0 active
- P1 (Required): 11 active (F001, F002, F003, F004, F007, F008, F011, F012, F013, F014, F015)
- P2 (Suggestions): 4 active (F005, F006, F009, F010)
- Resolved: 0
- Iterations completed: 9
<!-- /ANCHOR:running-findings -->

## 8. WHAT WORKED

- Direct source reads and exact path-existence checks provide evidence without mutating the repository.
- Prior lineage reports are hypotheses only. Each current finding must be rechecked against the current tree.

## 9. WHAT FAILED

- Coverage-graph writes are unavailable under the detached lineage write-surface restriction.

<!-- ANCHOR:exhausted-approaches -->
## 10. EXHAUSTED APPROACHES (do not retry)

No direction is exhausted. Correctness, security and traceability have distinct
completed pivots; maintainability remains in final adjudication.
<!-- /ANCHOR:exhausted-approaches -->

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
<!-- MACHINE-OWNED: START -->
- Completed pivots: 9
- Failed pivots: 0
- Audited overrides: 0
- Swept: packet-contract, moved-tree-documentation, level-gate-paths, build-test-discovery, output-path-containment, scope-manifest-and-execution-map, registry-dependency-metadata, test-discovery-and-build-order, cli-dist-alignment, wrapper-and-symlink-ownership
- Pivot lineage: correctness -> packet-contract -> moved-tree-documentation -> level-gate-paths -> build-test-discovery -> security/output-path-containment -> traceability/scope-manifest-and-execution-map -> maintainability/registry-dependency-metadata -> maintainability/test-discovery-and-build-order -> maintainability/cli-dist-alignment -> maintainability/wrapper-and-symlink-ownership
- Remaining frontier: synthesis
<!-- MACHINE-OWNED: END -->

## 11. RULED OUT DIRECTIONS

None yet.

<!-- ANCHOR:next-focus -->
## 12. NEXT FOCUS

Synthesis: compile the ten-pass evidence, active finding registry, and
required-gate failures into the final release-readiness report.
<!-- /ANCHOR:next-focus -->

## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `spec.md`, `plan.md`, `acceptance-criteria.md`, `implementation-summary.md`, `description.json`, `graph-metadata.json`, `scratch/execute-plan.md`, `scratch/review-scope.txt` and the implementation consumers listed there.
- Behavior claims: the CLI workspace is at `runtime/cli`, continuity is at `runtime/cli/continuity`, `runtime/scripts` remains separate build tooling and the packet claims completion.
- Reuse and conventions: the root workspace manifest, CLI package manifest, root and runtime Vitest configs, path-map inventory and packet-053 closeout evidence.
- Risks and gaps: generated `dist` state is environment-dependent, graph writes are unavailable and packet documentation may disagree with executable paths.
- Current findings: F001 packet scope/completion contradiction; F002 moved-tree README topology residue; F003 stale level-recommendation command; F004 invalid runbook config path; F005 resolver-contract comment drift; F006 stale stress exclusion; F007 changelog output-path escape; F008 stale review manifest; F009 retired package identity in path map; F010 stale registry dependency metadata; F011 test README cwd mismatch; F012 CLI Vitest-before-build boundary; F013 CLI source-dist alignment omission; F014 deployed Claude stop-hook drift; F015 retired create-path instructions in active workflow assets.
- Resource map: absent at initialization, so the initialization coverage gate is skipped.

## 14. CROSS-REFERENCE STATUS
<!-- ANCHOR:cross-reference -->
| Protocol | Level | Status | Iteration | Notes |
|---|---|---|---:|---|
| `spec_code` | core | partial | 10 | Packet, moved-tree paths, package/config sinks, security boundaries, execution maps, registry metadata, test boundaries, dist alignment, wrapper ownership and external consumers compared; packet claims remain inconsistent. |
| `checklist_evidence` | core | partial | 10 | Task and acceptance claims compared with ten static passes; retired-path evidence conflicts remain. |
| `feature_catalog_code` | overlay | pending | 0 | Inspect catalog references when they name moved surfaces. |
| `playbook_capability` | overlay | pending | 0 | Inspect executable playbook commands in scope. |
| `skill_agent` | overlay | notApplicable | 0 | Target is a spec folder, not a skill package. |
| `agent_cross_runtime` | overlay | notApplicable | 0 | Target is a spec folder, not an agent definition. |
<!-- /ANCHOR:cross-reference -->

## 15. FILES UNDER REVIEW
<!-- ANCHOR:file-coverage -->

The authoritative manifest is
`.opencode/specs/system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting/scratch/review-scope.txt`.
Each iteration records the bounded files it read. Core entrypoints and packet
documents are revisited only when the selected angle requires them.

Iteration 001 reviewed 10 manifest entries: five packet documents and five
package-local READMEs.
Iteration 002 reviewed 12 manifest entries: workspace/package manifests,
TypeScript/Vitest configs, the lockfile, the task-enrichment test and the CLI
alias-retirement runbook.
Iteration 003 reviewed 6 manifest entries: the changelog writer, continuity
save entrypoint, workflow sink, template helper, validator front-end and
configuration root detector.
Iteration 004 reviewed 7 packet and manifest entries: the review-scope
manifest, execution path map, inventory, execution plan, acceptance criteria,
implementation summary and live CLI package manifest.
Iteration 005 reviewed 7 registry, package, README and catalog entries to
compare dependency metadata with the live moved-tree topology.
Iteration 006 reviewed 7 test documentation, package/config and generated
output boundary entries.
Iteration 007 reviewed 7 CLI build, freshness, alignment-check and runtime
finalizer entries.
Iteration 008 reviewed 7 compatibility-marker, runtime-mirror, generated
output and package-boundary entries; no new issue survived adjudication.
Iteration 009 reviewed 7 live hook and command-workflow consumers and added
F014 and F015 for stale deployed hook output and retired create-path
instructions.
Iteration 010 re-adjudicated F001–F015 against the packet closeout claims;
no new finding was admitted and the max-iteration stop was recorded.

<!-- /ANCHOR:file-coverage -->

## 16. REVIEW BOUNDARIES
<!-- ANCHOR:boundaries -->

- Max iterations: 10
- Convergence threshold: 3
- Stop policy: max-iterations
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-luna-max-fast-review-3-1788621363532-a1faj6, parentSessionId=null, generation=1, lineageMode=new
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code, checklist_evidence; overlay=feature_catalog_code, playbook_capability
- Artifact root: `.opencode/specs/system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting/review/lineages/luna-max-fast-review-3`
<!-- /ANCHOR:boundaries -->
