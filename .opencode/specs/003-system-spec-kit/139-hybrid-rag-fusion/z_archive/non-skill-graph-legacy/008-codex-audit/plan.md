---
title: "Implementation Plan: Codex Audit Remediation Closure [008-codex-audit/plan]"
description: "This plan records what was delivered during codex audit remediation in 008-codex-audit. Work focused on turning memory-crud.ts into a stable facade backed by split operation mod..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "codex"
  - "audit"
  - "remediation"
  - "008"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Codex Audit Remediation Closure

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js) |
| **Framework** | MCP handler architecture + Vitest |
| **Storage** | SQLite-backed context index in MCP server runtime |
| **Testing** | Vitest (`npm test -- --silent`) |

### Overview
This plan records what was delivered during codex audit remediation in `008-codex-audit`. Work focused on turning `memory-crud.ts` into a stable facade backed by split operation modules, aligning related documentation, correcting module-header alignment in `sgqs-query.ts`, and stabilizing timing assertions that were producing flaky failures.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Facade plus focused operation modules.

### Key Components
- **`memory-crud.ts` facade**: Preserves entrypoint contract and delegates implementation.
- **Split CRUD modules**: Isolate delete, update, list, stats, health, state, types, and utility concerns.

### Data Flow
MCP tool requests enter the existing `memory-crud` surface, then route to operation-specific modules where logic executes with shared state/types/utilities. This keeps caller behavior stable while lowering local complexity per file.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Capture codex audit baseline and remediation targets
- [x] Confirm file-scope boundaries for handler, docs, and tests
- [x] Preserve runtime entrypoint compatibility expectations

### Phase 2: Core Implementation
- [x] Refactor `memory-crud.ts` into facade model
- [x] Add split modules (`delete`, `update`, `list`, `stats`, `health`, `state`, `types`, `utils`)
- [x] Align `sgqs-query.ts` module header and section structure

### Phase 3: Verification
- [x] Update `mcp_server/handlers/README.md` and `mcp_server/README.md`
- [x] Stabilize timing thresholds in `envelope.vitest.ts` and `integration-138-pipeline.vitest.ts`
- [x] Record full-suite validation outcome and residual out-of-scope debt
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Handler and utility behavior via existing MCP tests | Vitest |
| Integration | End-to-end `mcp_server` pipeline and envelope behavior | Vitest |
| Manual | Audit evidence reconciliation and doc-to-runtime consistency checks | Markdown review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing MCP handler exports | Internal | Green | Breaking exports would impact tool registration and calls |
| Existing Vitest suites in `mcp_server/tests` | Internal | Green | No confidence signal for refactor stability |
| Pre-existing module-header debt in tests directory | Internal | Yellow | May create unrelated alignment noise if conflated with this scope |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Regression appears in handler behavior, MCP registration, or core integration tests.
- **Procedure**: Revert split-module commit set, restore prior monolithic `memory-crud.ts`, and re-run `npm test -- --silent` in `mcp_server`.
<!-- /ANCHOR:rollback -->

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- Confirm scoped files match codex remediation boundaries.
- Confirm no edits are planned outside `008-codex-audit` for documentation capture.
- Confirm validation command and expected pass criteria are defined before completion claim.

### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SEQ | Apply updates in sequence: spec -> plan -> tasks -> checklist -> decision record -> implementation summary |
| TASK-SCOPE | Keep changes inside remediation scope and treat unrelated debt as deferred |
| TASK-EVIDENCE | Record command outputs and concrete outcomes with counts |

### Status Reporting Format
`STATUS: <done/in-progress/blocked> | FILE: <path> | NOTE: <single-line outcome>`

### Blocked Task Protocol
If any required evidence cannot be verified, mark status as `BLOCKED`, capture blocker details in checklist evidence, and stop completion claim until resolved or explicitly deferred.

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Audit Baseline) ──► Phase 2 (Handler Split) ──► Phase 3 (Docs + Test Stabilization)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Audit Baseline | None | Handler split and acceptance checks |
| Handler Split | Audit Baseline | Docs alignment and final verification |
| Docs + Test Stabilization | Handler Split | Completion evidence |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Baseline + Scope Control | Medium | 1-2 hours |
| Handler Modularization | High | 4-6 hours |
| Verification + Documentation | Medium | 2-3 hours |
| **Total** | | **7-11 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline captured from codex audit findings
- [x] Facade entrypoint compatibility preserved
- [x] Verification suite identified (`npm test -- --silent`)

### Rollback Procedure
1. Revert modularization commit range touching handler split files.
2. Restore previous single-file `memory-crud.ts` implementation.
3. Re-run critical test suites and full `mcp_server` run.
4. Confirm documentation rollback to match reverted code state.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Not applicable; code-level rollback only.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌────────────────────┐      ┌────────────────────────┐      ┌───────────────────────────┐
│  Audit Findings    │─────►│  Handler Refactor      │─────►│  Docs + Test Stabilize    │
│  (findings_1/_2)   │      │  (facade + modules)    │      │  (README + thresholds)    │
└────────────────────┘      └───────────┬────────────┘      └───────────────────────────┘
                                        │
                                        ▼
                              ┌──────────────────────┐
                              │ Final Full Test Pass │
                              └──────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Audit baseline | Existing findings docs | Scope map and verification targets | Refactor execution |
| Handler modularization | Audit baseline | Facade + split modules | Final docs and test closure |
| Test threshold stabilization | Handler modularization | Stable CI timing checks | Completion evidence |
| Documentation alignment | Handler modularization | Accurate runtime docs | Completion handoff |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Scope freeze from audit findings** - 1 hour - CRITICAL
2. **Facade plus split-module refactor** - 4 hours - CRITICAL
3. **Threshold stabilization and docs sync** - 2 hours - CRITICAL
4. **Full-suite verification and closure** - 1 hour - CRITICAL

**Total Critical Path**: ~8 hours

**Parallel Opportunities**:
- README alignment and `sgqs-query.ts` header cleanup can run in parallel after facade wiring settles.
- Checklist and implementation-summary drafting can run while final test results are being captured.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Refactor architecture complete | Facade plus split modules are present and wired | Achieved (2026-02-21) |
| M2 | Verification stabilization complete | Timing thresholds updated and suite remains semantically valid | Achieved (2026-02-21) |
| M3 | Documentation closure complete | Level 3 docs and validation report completed in `008-codex-audit` | Achieved (2026-02-21) |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Keep `memory-crud.ts` as the stable facade while moving implementation to focused modules

**Status**: Accepted

**Context**: Audit work required reducing handler complexity without breaking call sites.

**Decision**: Preserve facade entrypoint contract and move operation logic into dedicated module files.

**Consequences**:
- Positive: lower per-file complexity, clearer ownership boundaries, simpler targeted testing.
- Negative: more files to navigate; mitigated with updated handler README and naming conventions.

**Alternatives Rejected**:
- Incremental cleanup in monolithic file: rejected because complexity remained tightly coupled.
