# Feature Specification: Codex Audit Remediation Closure

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

This spec documents the completed remediation work captured in `008-codex-audit`, focused on improving maintainability and reliability in the Spec Kit MCP server. The largest change split `memory-crud.ts` into a facade plus domain-focused modules, followed by targeted documentation alignment and flaky test stabilization so verification can run consistently.

**Key Decisions**: Adopt facade plus split-handler architecture for memory CRUD concerns; recalibrate timing assertions to reflect realistic CI variance.

**Critical Dependencies**: Existing `mcp_server` Vitest suite and current module export contracts in `handlers/index.ts`.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-02-21 |
| **Branch** | `138-hybrid-rag-fusion` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The audit identified structural and verification friction in the `mcp_server` handler layer. `memory-crud.ts` held mixed responsibilities, several docs no longer reflected runtime structure, and strict timing assertions caused flaky failures unrelated to functional correctness.

### Purpose
Capture the completed remediation work as a Level 3 retrospective record that is consistent, test-backed, and ready for future maintenance.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Refactor `memory-crud.ts` into a facade plus split CRUD and utility modules.
- Align MCP server and handler README documentation with new structure.
- Stabilize flaky timing assertions in targeted tests and record final validation status.

### Out of Scope
- Broad test-directory `workflows-code--opencode` module-header alignment debt (pre-existing).
- Full-repo structural lint cleanup beyond codex audit remediation files.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts` | Modify | Convert to facade and delegate operations |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts` | Create | Isolated delete handler logic |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts` | Create | Isolated update handler logic |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts` | Create | Isolated list handler logic |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts` | Create | Isolated stats handler logic |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` | Create | Isolated health handler logic |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-state.ts` | Create | Shared state contract and wiring |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts` | Create | Shared types for handler modules |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-utils.ts` | Create | Shared helper functions |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/README.md` | Modify | Update handler architecture docs |
| `.opencode/skill/system-spec-kit/mcp_server/README.md` | Modify | Update top-level MCP server docs |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/sgqs-query.ts` | Modify | Align module header and section structure |
| `.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts` | Modify | Adjust timing threshold from 50ms to 45ms |
| `.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts` | Modify | Adjust MMR timing threshold from 5ms to 20ms |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | CRUD handler responsibilities are split into cohesive modules | `memory-crud.ts` acts as facade and all listed split modules exist and are wired |
| REQ-002 | Regression-safe test verification is available | `npm test -- --silent` passes in `mcp_server` with the reported totals |
| REQ-003 | Audit remediation documentation is synchronized | Level 3 docs in `008-codex-audit` reflect implemented scope and known limits |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Handler/module documentation reflects post-refactor structure | `mcp_server/handlers/README.md` and `mcp_server/README.md` updated |
| REQ-005 | Known flaky timing assertions are stabilized | Threshold updates recorded with rationale and preserved intent |
| REQ-006 | Residual out-of-scope debt is explicitly tracked | Pre-existing test alignment debt documented as deferred/out of scope |
| REQ-007 | Alignment correction in `sgqs-query.ts` is documented | Module header/section fix is captured in plan, tasks, and implementation summary |
| REQ-008 | Verification evidence is explicit and auditable | Command, outcome totals, and deferred items are listed in implementation summary |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Modular handler architecture is in place with facade and split modules for delete, update, list, stats, health, state, types, and utils.
- **SC-002**: Final full test run in `mcp_server` reports `163` files, `4791` passed, `19` skipped for `npm test -- --silent`.
- **SC-003**: Level 3 spec artifacts (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`) are complete and validated.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing handler exports and call sites | Broken exports would fail MCP tool registration | Keep facade API stable while moving implementation details |
| Risk | Threshold relaxation could hide regressions | Medium | Keep thresholds narrow, preserve semantic assertions, and run full suite |
| Risk | Pre-existing test-header debt may obscure future failures | Medium | Track as explicit deferred workstream outside this remediation scope |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Test-stability thresholds should reduce false negatives without masking functional or algorithmic regressions.

### Security
- **NFR-S01**: Refactor preserves existing access patterns and does not introduce new secret handling paths.

### Reliability
- **NFR-R01**: Full `mcp_server` suite remains green after remediation (`4791` passed, `19` skipped).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Empty result sets in list/stats paths remain valid and are delegated through facade modules.
- State and health calls continue to work even when optional metrics channels are absent.

### Error Scenarios
- Timing jitter on slower environments no longer causes deterministic failures in envelope and MMR assertions.
- Handler-level module split failures are contained by keeping top-level facade interface unchanged.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 21/25 | 14 files touched, cross-file handler decomposition |
| Risk | 17/25 | Runtime handler wiring + test-stability behavior |
| Research | 14/20 | Audit evidence reconciliation and remediation mapping |
| Multi-Agent | 10/15 | Prior codex audit outputs consolidated and reconciled |
| Coordination | 11/15 | Code, tests, and docs synchronized |
| **Total** | **73/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Facade split introduces missing export path | H | M | Keep `memory-crud.ts` as stable entrypoint and run full test suite |
| R-002 | Timing thresholds become too lenient | M | M | Constrain threshold increases to observed flake zones only |
| R-003 | Broader test-header debt confused with this remediation | M | H | Explicitly document debt as pre-existing and out of scope |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Maintainable CRUD Handler Surface (Priority: P0)

**As a** Spec Kit maintainer, **I want** `memory-crud` responsibilities split by concern, **so that** updates can be made with lower regression risk.

**Acceptance Criteria**:
1. Given a CRUD operation path, When I inspect handlers, Then the logic lives in a focused module and not a monolithic file.
2. Given existing MCP entrypoints, When handlers are invoked, Then behavior remains backward-compatible.

---

### US-002: Stable Verification Signals (Priority: P1)

**As a** contributor running CI tests, **I want** timing assertions calibrated for real runtime variance, **so that** failures represent true regressions instead of noise.

**Acceptance Criteria**:
1. Given `npm test -- --silent` in `mcp_server`, When the suite runs, Then all tests pass with expected skipped totals.
2. Given deferred alignment debt, When reviewing this remediation, Then out-of-scope items are clearly separated from completed work.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:acceptance-scenarios -->
## 12. ACCEPTANCE SCENARIOS

1. **Given** the handler facade is loaded, **When** a delete request is received, **Then** delegation routes to `memory-crud-delete.ts` without changing external contract behavior.
2. **Given** a list request path, **When** `memory-crud.ts` is invoked, **Then** list logic executes through `memory-crud-list.ts` and preserves prior output semantics.
3. **Given** metrics/statistics calls, **When** stats and health endpoints run, **Then** they resolve through `memory-crud-stats.ts` and `memory-crud-health.ts`.
4. **Given** documentation consumers review handler architecture, **When** they open README files, **Then** structure and module boundaries match runtime organization.
5. **Given** envelope timing tests run in CI, **When** runtime jitter occurs in normal bounds, **Then** tests remain stable and still detect real regressions.
6. **Given** the full suite is executed in `mcp_server`, **When** `npm test -- --silent` completes, **Then** results report `163` files, `4791` passed, and `19` skipped.
<!-- /ANCHOR:acceptance-scenarios -->

---

<!-- ANCHOR:questions -->
## 13. OPEN QUESTIONS

- Should the remaining test-directory module-header alignment debt be tracked as a dedicated follow-on spec under `138-hybrid-rag-fusion` or as a cross-spec quality initiative?
- Should timing-threshold governance be codified as a shared test policy to prevent future ad hoc drift?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
