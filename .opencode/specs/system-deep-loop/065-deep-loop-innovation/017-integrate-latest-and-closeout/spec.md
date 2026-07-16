---
title: "Feature Specification: Integrate Latest & Closeout"
description: "Phase 017 lands the system-deep-loop recommendations program on the moving mainline: integrate the latest origin in a clean worktree, re-census touched contracts, reopen phases whose inputs drifted, rerun the whole-system gate on the exact final SHA, and reconcile the parent packet's open items, changelogs, and generated metadata."
trigger_phrases:
  - "integrate latest and closeout"
  - "deep-loop phase 017"
  - "final SHA whole-system gate"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/017-integrate-latest-and-closeout"
    last_updated_at: "2026-07-15T16:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Read the parent, manifest, sequencing strategy, and phase-016 outcome"
    next_safe_action: "Build the final-SHA integrate-and-recensus closeout contract"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Integrate Latest & Closeout

> Phase adjacency under the 006 parent (grouping order, not a runtime dependency): predecessor `016-whole-system-gate`; successor: none (last sibling).

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/017-integrate-latest-and-closeout |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | Phase 017 of the 065 recommendations implementation program; final integration and closeout contract |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The program's phases run while other lanes continue committing to the moving mainline. Phase 016 can therefore be green on its pre-integration SHA while the latest origin changes alter a touched contract, invalidate a phase receipt, change a protected behavior baseline, or introduce a write-set conflict. Closing without an integrate-and-recensus pass would make the final claim stale and could hide a phase that must be reopened.

This phase integrates the latest origin in a clean worktree, re-censuses every touched contract against the parent 065 scope and phase tree, reopens any earlier phase with relevant drift, reruns the complete phase-016 whole-system gate on the exact final SHA, and reconciles the parent packet's open items, changelogs, and deterministic metadata without rewriting research inputs.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Integrating the latest origin into a clean worktree with recorded pre-integration and final SHAs, merge resolution, and candidate scope.
- Re-censusing contracts touched by integration and classifying drift against each phase's declared inputs, outputs, protected baselines, persistence/schema boundaries, and write-set dependencies.
- Reopening every affected phase before verification when drift is relevant; recording a non-relevant disposition for reviewed drift that does not change a phase contract.
- Rerunning the full `016-whole-system-gate` contract on the final SHA, including exact-SHA behavior and mode baselines, mixed-version replay, crash injection, counterfactual and degeneration tests, parity against 000, blocking SOL review, and recursive strict validation.
- Reconciling 065 open items append-only, updating packet and phase changelogs, regenerating `description.json` and `graph-metadata.json` through deterministic tooling, and rolling the final state up to the 065 parent.

### Out of Scope
- Implementing or silently patching an earlier phase after drift; affected work returns to that phase's own contract.
- Rewriting 065/001 or 065/005 research artifacts, deleting open-item history, or inventing recommendations outside the frozen 178-row ledger.
- Changing the architecture, authority-cutover policy, or legacy-retirement policy established by earlier phases.
- Declaring completion from the pre-integration phase-016 result without a final-SHA rerun.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Integrate the latest origin in a clean, isolated worktree | The candidate records the origin target, pre-integration SHA, merge result, final SHA, and unexpected-mutation check; conflicts stop the closeout until resolved or the candidate is discarded |
| REQ-002 | Re-census contracts touched by integration | A drift ledger maps each changed contract to the owning phase, its input/output assumptions, protected baseline, receipt binding, and relevant/non-relevant disposition |
| REQ-003 | Reopen phases on relevant drift before final verification | Any changed input/output contract, persistence or schema boundary, protected behavior, dependency/write-set edge, or exact-commit evidence is routed back to the owning phase; no relevant drift is waived silently |
| REQ-004 | Rerun the complete phase-016 whole-system gate on the final SHA | The final SHA has exact-SHA behavior and mode baselines, mixed-version replay, crash-injection, counterfactual and degeneration coverage, parity against 000, a blocking SOL receipt, and recursive `validate.sh --strict` evidence |
| REQ-005 | Reconcile the program and generated packet state append-only | Every 065 open item has a disposition or explicit carried-forward owner, changelogs record the integration and gate result, and deterministic metadata is regenerated across the affected packet tree |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Preserve evidence lineage across reopen and rerun | Reopened phases retain prior evidence as historical context while new receipts bind to the final candidate SHA and no stale receipt is presented as final |
| REQ-007 | Reconcile parent and child statuses | The 065 phase map, child status fields, completion percentages, open-item ledger, changelog entries, and generated metadata agree on the final state |
| REQ-008 | Keep closeout scope and history auditable | The final report names the reviewed drift set, reopened phases, gate commands and exit codes, metadata generation result, and any approved deferral without rewriting prior records |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The latest-origin integration is clean, its final SHA is recorded, and every touched contract has a relevant or non-relevant drift disposition.
- **SC-002**: Every phase affected by relevant drift is reopened before the final gate, with no stale pre-integration evidence treated as final.
- **SC-003**: The full `016-whole-system-gate` verification is green on the exact final SHA, including SOL review and recursive strict validation.
- **SC-004**: All 065 open items, changelogs, parent rollup fields, and deterministic packet metadata are reconciled append-only and mutually consistent.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Latest origin and clean worktree | The candidate cannot establish a trustworthy final SHA | Use an isolated worktree, record the integration SHAs, and stop on unresolved conflicts or unexpected tracked mutation |
| Dependency | `016-whole-system-gate` contract and receipts | The final program claim cannot be reproduced | Treat the phase-016 outcome in the parent and manifest as the minimum gate contract; require the phase-016 artifact set before execution |
| Dependency | 000 baseline artifacts and phase receipts | Drift and regression cannot be compared by ID and semantics | Bind the recensus and final gate to the pinned baseline and preserve historical receipts |
| Risk | Relevant drift is mistaken for documentation-only change | A stale phase result survives into closeout | Classify input/output, schema, persistence, baseline, dependency, write-set, and evidence-binding changes explicitly |
| Risk | Reopening is applied too broadly | Unrelated completed work is destabilized | Reopen only the owning phase and downstream consumers whose declared inputs changed; record the rationale for non-relevant changes |
| Risk | Generated metadata or changelogs are hand-edited inconsistently | Resume, graph, and parent status disagree | Run deterministic metadata generation and validate the resulting tree; preserve changelog history append-only |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None block the planning contract. Execution must resolve the run-time facts below against the clean candidate worktree:
- Which origin ref is the latest integration target, and which exact SHA is accepted as final?
- Which phase contracts are touched by the merge, and which reopened phases must complete before phase 016 is rerun?
- Which 065 open items remain carried forward after the final gate, with an owner and next action?
<!-- /ANCHOR:questions -->
