---
title: "Implementation Plan: 116/006 - Candidate Saturation and Graphless Gates"
description: "Level 3 plan for wiring candidateCoverageGate and graphlessFallbackGate into deep-review legal-stop YAML mirrors."
trigger_phrases:
  - "candidate coverage gate plan"
  - "graphless fallback gate plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/002-deep-review/006-complexity-candidate-saturation-gates"
    last_updated_at: "2026-05-22T12:09:15Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Populated Level 3 implementation plan for Phase F."
    next_safe_action: "Run targeted vitest and strict spec validation."
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - ".opencode/commands/deep/assets/deep_start-review-loop_auto.yaml"
      - ".opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml"
---

# Implementation Plan: 116/006 - Candidate Saturation and Graphless Gates

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | OpenCode command workflow assets |
| **Files** | `deep_start-review-loop_auto.yaml`, `deep_start-review-loop_confirm.yaml` |
| **Runtime State** | Reducer registry `candidateCoverage`, `searchDebt`, `searchCoverage`, and iteration `searchLedger` |
| **Tests** | Vitest deep-loop fixtures plus strict spec validation |

### Overview

Patch the legal-stop decision tree in both deep-review workflow mirrors. The implementation adds two binary gates after the existing review STOP gates, extends failed-gate assembly, and appends gate-specific evidence to the existing `blocked_stop` event without changing its schema shape.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Phase 005 reducer registry fields exist.
- [x] Graph-empty handler behavior is confirmed as `CONTINUE` and out of scope.
- [x] Auto and confirm YAML mirrors are identified as active modification surfaces.
- [x] Level 3 requirement confirmed because STOP-gate semantics need ADR traceability.

### Definition of Done

- [ ] Auto and confirm YAML both include `candidateCoverageGate`.
- [ ] Auto and confirm YAML both include `graphlessFallbackGate`.
- [ ] Blocked-stop output carries both gate names and evidence fields.
- [ ] Phase B and coverage-graph tests run with documented results.
- [ ] Strict spec validation passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Workflow-level policy gate. The coverage-graph handler remains responsible for graph-backed convergence. The YAML legal-stop decision tree owns fallback proof when graph coverage mode is text/ledger based.

### Gate Inputs

| Gate | Inputs | Pass Condition |
|------|--------|----------------|
| `candidateCoverageGate` | latest `reviewDepthSchemaVersion`, `reviewDepthApplicability`, reducer `searchDebt`, `candidateCoverage.covered`, `searchCoverage.requiredBugClasses` | v1 skip, trivial+skip with evidence, or no search debt and all required bug classes covered |
| `graphlessFallbackGate` | latest `reviewDepthSchemaVersion`, `searchCoverage.graphCoverageMode`, `searchLedger.searchActions[].method`, `evidenceRefs` | v1 skip, graph mode skip, or graphless fallback rows cite accepted methods for each required class |

### Data Flow

```text
iteration record v2
  -> reducer registry search state
  -> step_check_convergence legal-stop gates
  -> blocked_by_json / blocked_by_csv
  -> blocked_stop.gateResults
  -> reducer/dashboard/report blocked-stop surfacing
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Context and Contract

- [x] Read Phase 001 research synthesis recommendations R6/R7.
- [x] Read Phase 005 implementation summary for reducer-owned fields.
- [x] Read existing auto/confirm legal-stop decision tree.
- [x] Read graph convergence handler empty-graph behavior.

### Phase 2: YAML Gate Wiring

- [ ] Add `candidateCoverageGate` to auto YAML.
- [ ] Add `graphlessFallbackGate` to auto YAML.
- [ ] Extend auto blocked-stop outputs and event payload.
- [ ] Mirror the same changes into confirm YAML.

### Phase 3: Level 3 Documentation

- [ ] Populate `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md`.
- [ ] Add `checklist.md`.
- [ ] Add `decision-record.md` with ADR-001.
- [ ] Refresh metadata through `generate-context.js`.

### Phase 4: Verification

- [ ] Run requested Phase B convergence fixture.
- [ ] Run requested validator/reducer/graph fixtures.
- [ ] Run requested coverage-graph test set.
- [ ] Run strict spec validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Command |
|-----------|-------|---------|
| Fixture | Phase B convergence behavior | `pnpm vitest run --no-coverage review-depth-convergence` |
| Fixture | Validator/reducer/graph expected state | `pnpm vitest run --no-coverage review-depth-validator review-depth-reducer review-depth-graph` |
| Regression | Existing coverage graph tests | `pnpm vitest run --no-coverage coverage-graph` |
| Documentation | Level 3 packet contract | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ... --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 003 schema contract | Spec/prompt | Shipped | Gate names would lack v2 field contract. |
| Phase 004 validator warnings | Runtime validation | Shipped | Bad v2 rows could reach reducer unchecked. |
| Phase 005 reducer registry | Runtime reducer | Shipped | Candidate gate would lack durable inputs. |
| Graph convergence handler | MCP handler | Existing, unchanged | Graph-backed path remains outside fallback gate. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert only the Phase F YAML and spec folder changes. Because this phase does not alter schemas, database state, handlers, reducers, or validators, rollback restores the previous legal-stop gate set without data migration.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 003 schema contract
  -> Phase 004 validator
  -> Phase 005 reducer registry
  -> Phase 006 legal-stop gates
  -> Phase 007 graph vocabulary
  -> Phase 008 defaults/runner integration
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase F YAML gates | Phases C, D, E | Phase G/H can reason about STOP blockers. |
| Level 3 docs | Existing scaffold | Commit handoff and validation. |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATE

| Area | Estimate | Notes |
|------|----------|-------|
| Context reads | 35m | Prior phase docs, YAML, handler, fixture. |
| YAML implementation | 80m | Auto and confirm mirrors plus blocked-stop payload fields. |
| Level 3 docs | 80m | Spec, plan, tasks, checklist, ADR, summary, metadata. |
| Verification | 35m | Requested vitest and strict spec validation commands. |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

Rollback removes only the Phase F YAML gate text, blocked-stop gate result additions, and the 006 spec folder updates. No database, reducer, validator, graph handler, or graph vocabulary migration is involved.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Phase 003 v2 schema
  -> Phase 004 validator warnings
  -> Phase 005 reducer search state
  -> Phase 006 YAML legal-stop gates
  -> Phase 007 graph vocabulary
  -> Phase 008 runner/default integration
```
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Preserve graph handler behavior and define fallback at YAML level.
2. Add gate pass/fail semantics to auto workflow.
3. Mirror semantics to confirm workflow.
4. Include gate names and evidence in `blocked_stop`.
5. Validate tests and spec folder.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Evidence |
|-----------|----------|
| M1 Context | Prior phase docs and handler behavior read. |
| M2 YAML gates | Auto and confirm contain both new gate names. |
| M3 Docs | Level 3 docs and ADR are populated. |
| M4 Verification | Requested vitest and strict validation tails are recorded. |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:monitoring -->
## L3: MONITORING AND OBSERVABILITY

The observable artifact is the `blocked_stop` event. Operators should see `blockedBy` include `candidateCoverageGate` or `graphlessFallbackGate`, with `gateResults` carrying missing classes, search debt, graphless mode, and unavailability reason.
<!-- /ANCHOR:monitoring -->
