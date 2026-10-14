---
title: Deep Review Strategy Template
description: Runtime template copied to review/ during initialization to track review progress, dimension coverage, findings, and outcomes across iterations.
trigger_phrases:
  - "deep review strategy template"
  - "review dimension tracking"
  - "exhausted review approaches"
  - "review session tracking"
importance_tier: normal
contextType: planning
version: 1.11.0.13
---

# Deep Review Strategy - Session Tracking Template

Runtime template copied into the resolved `{artifact_dir}/` during initialization. Tracks review progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep review session. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{artifact_dir}/deep-review-strategy.md` and populates Topic, Review Dimensions, Known Context, and Review Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, reviews the assigned dimension/files, updates findings, marks dimensions complete, and sets new Next Focus.
- **Mutability:** Mutable, updated by both orchestrator and agents throughout the session.
- **Protection:** None (shared mutable state). Orchestrator validates consistency on resume.
- **Ownership:** Machine-managed metrics and coverage blocks are wrapped in explicit ownership markers. Human commentary and operator overrides live outside those markers.

---

## 2. TOPIC
All shipped work of the sk-code Ponytail refinement epic (specs/sk-code/011-sk-code-poinytail-based-refinement, children 002-029) plus the v4.0.0.4 release changelog (.skilled/changelog/skilled/v4.0.0.4.md): the sk-code hub and its modes and surfaces, /doctor:sk-code setup, create-skill-parent surface ordering, drift guards, hooks, skill routing, sk-git Commit-Id hooks, Pi Fast Mode, unknown-option refusals and the changelog accuracy against the tree. Scope: the 478 files in review/scope-files.txt, changed by the epic focused commits and ranked by how many of them touched each file, plus the changelog.

Dimensions, risk-ordered: correctness, security, traceability, maintainability, then a fifth pass that rechecks the highest-risk surfaces and the changelog against the tree. Max iterations 5, convergence threshold 0.1, stop policy max-iterations. Each child phase spec.md, goal.md and implementation-summary.md under specs/sk-code/011-sk-code-poinytail-based-refinement/ states what it shipped and why.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Research-only children (001, 013, 014, 020, 023, 025, 028) and their recommendations that were never built.
- Files outside review/scope-files.txt that bulk commits only renamed or version-bumped.
- The generated trigger index and retrieval fixtures.

---

## 5. STOP CONDITIONS
- Stop policy max-iterations: run all 5 iterations; convergence is telemetry only.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 2
- P2 (Suggestions): 1
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
-
- Direct reads of the setup probe, tie-order check, and option parser exposed the decisive branches without relying on test descriptions. (iteration 1)

---

## 9. WHAT FAILED
-
- No review action failed; remaining broad surfaces are deferred and listed in iteration 1. (iteration 1)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `checklist_evidence`: partial. Read the setup task entry; the child acceptance checklist and remaining child checklists were not audited. [SOURCE: `specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/002-doctor-sk-code-setup/tasks.md:43`] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `checklist_evidence`: partial. Read the setup task entry; the child acceptance checklist and remaining child checklists were not audited. [SOURCE: `specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/002-doctor-sk-code-setup/tasks.md:43`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: partial. Read the setup task entry; the child acceptance checklist and remaining child checklists were not audited. [SOURCE: `specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/002-doctor-sk-code-setup/tasks.md:43`]

### `feature_catalog_code` and `playbook_capability`: partial. The setup probe was inspected, but full catalog and playbook coverage was not checked. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `feature_catalog_code` and `playbook_capability`: partial. The setup probe was inspected, but full catalog and playbook coverage was not checked.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code` and `playbook_capability`: partial. The setup probe was inspected, but full catalog and playbook coverage was not checked.

### `skill_agent` and `agent_cross_runtime`: partial. Loaded the active Codex agent contract; cross-runtime mirrors remain deferred. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `skill_agent` and `agent_cross_runtime`: partial. Loaded the active Codex agent contract; cross-runtime mirrors remain deferred.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent` and `agent_cross_runtime`: partial. Loaded the active Codex agent contract; cross-runtime mirrors remain deferred.

### `spec_code`: partial. Checked the selected tie-order and setup-probe contracts against their implementation. [SOURCE: `specs/sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning/spec.md:75`] [SOURCE: `specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/spec.md:94`] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `spec_code`: partial. Checked the selected tie-order and setup-probe contracts against their implementation. [SOURCE: `specs/sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning/spec.md:75`] [SOURCE: `specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/spec.md:94`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: partial. Checked the selected tie-order and setup-probe contracts against their implementation. [SOURCE: `specs/sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning/spec.md:75`] [SOURCE: `specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/spec.md:94`]

### agent_cross_runtime: partial. Runtime agent files were found, but their complete behavior contracts were not compared. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: agent_cross_runtime: partial. Runtime agent files were found, but their complete behavior contracts were not compared.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: agent_cross_runtime: partial. Runtime agent files were found, but their complete behavior contracts were not compared.

### checklist_evidence: partial. Selected child rows cite implementation-summary ledgers or goal criteria; completion evidence across all shipped children remains unaudited. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: checklist_evidence: partial. Selected child rows cite implementation-summary ledgers or goal criteria; completion evidence across all shipped children remains unaudited.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: checklist_evidence: partial. Selected child rows cite implementation-summary ledgers or goal criteria; completion evidence across all shipped children remains unaudited.

### Commit-Id hook caller coverage, Pi model-default coverage, compiled-route engine parity, and the full changelog claim audit remain deferred. The exact Pi source path did not appear in the 478-line scope manifest. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Commit-Id hook caller coverage, Pi model-default coverage, compiled-route engine parity, and the full changelog claim audit remain deferred. The exact Pi source path did not appear in the 478-line scope manifest.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Commit-Id hook caller coverage, Pi model-default coverage, compiled-route engine parity, and the full changelog claim audit remain deferred. The exact Pi source path did not appear in the 478-line scope manifest.

### Core `checklist_evidence`: partial. Checked completion evidence across the packet was not audited in this security pass. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Core `checklist_evidence`: partial. Checked completion evidence across the packet was not audited in this security pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core `checklist_evidence`: partial. Checked completion evidence across the packet was not audited in this security pass.

### Core `checklist_evidence`: partial. The test verifies `--goal` refusal and `--with-goal` success but does not cover the standalone dash. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Core `checklist_evidence`: partial. The test verifies `--goal` refusal and `--with-goal` success but does not cover the standalone dash.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core `checklist_evidence`: partial. The test verifies `--goal` refusal and `--with-goal` success but does not cover the standalone dash.

### Core `spec_code`: partial with a concrete REQ-001 mismatch, evidenced by the parser and phase spec. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Core `spec_code`: partial with a concrete REQ-001 mismatch, evidenced by the parser and phase spec.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core `spec_code`: partial with a concrete REQ-001 mismatch, evidenced by the parser and phase spec.

### Core `spec_code`: partial. The selected trust behavior was compared with the security claim, but the full normative claim set remains for the traceability dimension. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Core `spec_code`: partial. The selected trust behavior was compared with the security claim, but the full normative claim set remains for the traceability dimension.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core `spec_code`: partial. The selected trust behavior was compared with the security claim, but the full normative claim set remains for the traceability dimension.

### feature_catalog_code: partial. The setup material points to catalog assets; catalog entries were not exhaustively paired with source paths. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: feature_catalog_code: partial. The setup material points to catalog assets; catalog entries were not exhaustively paired with source paths.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: feature_catalog_code: partial. The setup material points to catalog assets; catalog entries were not exhaustively paired with source paths.

### Narrow route projection check: ruled out for the selected hub contract. The two workflow modes and three surface packets agree across the hub description, registry, and router signals. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Narrow route projection check: ruled out for the selected hub contract. The two workflow modes and three surface packets agree across the hub description, registry, and router signals.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Narrow route projection check: ruled out for the selected hub contract. The two workflow modes and three surface packets agree across the hub description, registry, and router signals.

### Overall coverage remains partial. This iteration did not complete the full spec-to-code, agent, feature-catalog, playbook, or changelog audit. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Overall coverage remains partial. This iteration did not complete the full spec-to-code, agent, feature-catalog, playbook, or changelog audit.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overall coverage remains partial. This iteration did not complete the full spec-to-code, agent, feature-catalog, playbook, or changelog audit.

### Overlay `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, and `playbook_capability`: not reassessed in this correctness pass. Earlier coverage remains partial. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Overlay `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, and `playbook_capability`: not reassessed in this correctness pass. Earlier coverage remains partial.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, and `playbook_capability`: not reassessed in this correctness pass. Earlier coverage remains partial.

### Overlay `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, and `playbook_capability`: partial. Only the selected executable boundaries were inspected; full cross-surface reconciliation remains for traceability. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Overlay `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, and `playbook_capability`: partial. Only the selected executable boundaries were inspected; full cross-surface reconciliation remains for traceability.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, and `playbook_capability`: partial. Only the selected executable boundaries were inspected; full cross-surface reconciliation remains for traceability.

### playbook_capability: partial. The live-playbook contract and doctor package checks were located; scenario expected resources were not fully reconciled to router output. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: playbook_capability: partial. The live-playbook contract and doctor package checks were located; scenario expected resources were not fully reconciled to router output.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: playbook_capability: partial. The live-playbook contract and doctor package checks were located; scenario expected resources were not fully reconciled to router output.

### Scope boundary: the Pi Fast Mode implementation and Commit-Id policy helper remain blocked by the supplied manifest boundary recorded in prior state. The source paths were not reviewed here. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Scope boundary: the Pi Fast Mode implementation and Commit-Id policy helper remain blocked by the supplied manifest boundary recorded in prior state. The source paths were not reviewed here.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Scope boundary: the Pi Fast Mode implementation and Commit-Id policy helper remain blocked by the supplied manifest boundary recorded in prior state. The source paths were not reviewed here.

### skill_agent: partial. The hub-to-packet registry projection was checked, but all skill-to-agent bindings were not compared. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: skill_agent: partial. The hub-to-packet registry projection was checked, but all skill-to-agent bindings were not compared.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: skill_agent: partial. The hub-to-packet registry projection was checked, but all skill-to-agent bindings were not compared.

### spec_code: partial. The selected router-version, tie-order, and setup claims point to current hub and doctor surfaces; the rest of the child claim set remains unaudited. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: spec_code: partial. The selected router-version, tie-order, and setup claims point to current hub and doctor surfaces; the rest of the child claim set remains unaudited.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: spec_code: partial. The selected router-version, tie-order, and setup claims point to current hub and doctor surfaces; the rest of the child claim set remains unaudited.

### The existing `--goal` failure path and `--with-goal` happy path are represented by the scoped test. The checks were read, not executed. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: The existing `--goal` failure path and `--with-goal` happy path are represented by the scoped test. The checks were read, not executed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The existing `--goal` failure path and `--with-goal` happy path are represented by the scoped test. The checks were read, not executed.

### The selected create.sh changelog paragraph was compared with the phase requirement and parser. The full changelog claim-to-tree audit remains deferred. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: The selected create.sh changelog paragraph was compared with the phase requirement and parser. The full changelog claim-to-tree audit remains deferred.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The selected create.sh changelog paragraph was compared with the phase requirement and parser. The full changelog claim-to-tree audit remains deferred.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
[Review angles that were investigated and definitively eliminated -- consolidated from iteration dead-end data]
- [Approach]: [Why ruled out] (iteration N, evidence: [source])

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
[Populated during initialization from the continuity ladder and ripgrep recipes, if any prior work exists]

### Bounded Context Snapshot

Populate during initialization before the first review dimension runs. Keep this pointer-based and scoped to the declared review target:

- Target pointers: files, specs, symbols, or resource-map entries under review.
- Behavior claims: acceptance criteria, public contracts, or docs to verify.
- Reuse and conventions: existing patterns that define expected implementation shape.
- Review risks and gaps: stale graph or memory caveats, missing files, and out-of-scope areas.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use this snapshot only to seed review dimensions and final traceability.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| spec_code | core | partial | 3 | Selected child claims align to current hub/doctor surfaces; full child set remains. |
| checklist_evidence | core | partial | 3 | Selected rows cite evidence; packet-wide completion evidence remains unaudited. |
| skill_agent | overlay | partial | 3 | Hub registry projection checked; all skill-to-agent links remain. |
| agent_cross_runtime | overlay | partial | 3 | Runtime files located; behavior parity not fully compared. |
| feature_catalog_code | overlay | partial | 3 | Catalog-to-code entry audit remains. |
| playbook_capability | overlay | partial | 3 | Scenario expected-resource reconciliation remains. |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| [path/to/file] | [D1, D3] | [N] | [0 P0, 1 P1, 2 P2] | [partial/complete] |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: [from config]
- Convergence threshold: [from config]
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=[from config.sessionId], parentSessionId=[from config.parentSessionId], generation=[from config.generation], lineageMode=[from config.lineageMode]
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: [from config.maxToolCallsPerIteration] tool calls, [from config.maxMinutesPerIteration] minutes
- Severity threshold: [from config.severityThreshold]
- Review target type: [from config.reviewTargetType]
- Cross-reference checks: core=[from config.crossReference.core], overlay=[from config.crossReference.overlay]
- Started: [timestamp]
<!-- MACHINE-OWNED: END -->

---

## 17. EXAMPLE (POPULATED)

Reference snippet showing a partially populated strategy file mid-review. Use this as a visual anchor when opening a live strategy doc.

```markdown
## 1. REVIEW CHARTER
- Target: .skilled/skills/system-deep-loop/deep-research (skill, v1.4.0)
- Dimensions: correctness, test-coverage, cross-runtime-parity, observability
- Stop conditions: rolling newInfoRatio < 0.08 for 2 iterations OR all dimensions converged OR max=7 reached
- Success criteria: zero P0 in correctness; test-coverage P0 resolved or deferred with rationale

## 4. NEXT FOCUS
- Dimension: test-coverage
- Files: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs, .skilled/skills/system-spec-kit/runtime/cli/tests/deep-research-contract-parity.vitest.ts
- Why: Iteration 2 surfaced a P0 (convergence-path coverage gap); needs a focused follow-up before correctness can terminate PASS.

## 9. COVERAGE MATRIX
| Dimension            | Status     | Iterations touched |
|----------------------|------------|--------------------|
| correctness          | converged  | 1                  |
| test-coverage        | converging | 2, 4               |
| cross-runtime-parity | converging | 3                  |
| observability        | converging | 4                  |
```


## Iteration 2 Security Update

- Completed dimension: security.
- Finding: R2-P1-001, shared Git common-directory trust admits branch-controlled hook code.
- Counts: P0=0, P1=1, P2=0.
- Deferred: Commit-Id policy helper and Pi Fast Mode implementation are outside the declared review scope.
- Next focus: traceability.


## Iteration 3 Traceability Update

- Completed dimension: traceability.
- Finding: No new findings.
- Counts this iteration: P0=0, P1=0, P2=0.
- The selected hub, mode registry, and router projection agree. Core and overlay checks remain partial where child, runtime, catalog, playbook, or changelog coverage was not exhaustive.
- Next focus: maintainability.

## Iteration 5 Correctness Update

- Completed dimension: correctness.
- New finding: R5-P1-001, a standalone dash misses create.sh's unknown-option branch and enters positional-title handling.
- Counts this iteration: P0=0, P1=1, P2=0. Active registry after this iteration: P0=0, P1=2, P2=1.
- The earlier unknown-option pass covered --goal; the lone-dash case is a concrete one-character counterexample to that ruled-out result.
- Confirmed: the existing --goal refusal and --with-goal success assertions are present. They were read, not run.
- Deferred: full changelog claim accuracy, Commit-Id policy validation, and Pi Fast Mode model defaults. The latter two source paths remain outside the supplied manifest.
- Next focus: none; max iterations reached.
