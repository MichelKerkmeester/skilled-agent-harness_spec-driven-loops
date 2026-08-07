---
title: "Spec: Deep-Review P1 Findings Remediation for Lifecycle and Sidecar Hardening"
description: "Scaffold for arc 009 phase 014: close or explicitly defer the 60 active deep-review findings, with the 40 P1 lifecycle, sidecar, executor, and traceability findings as the release gate."
trigger_phrases:
  - "deep-review-p1-findings lifecycle sidecar hardening"
  - "arc 009 phase 014"
  - "fix deep review p1 findings"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening"
    last_updated_at: "2026-05-22T19:00:00Z"
    last_updated_by: "codex"
    recent_action: "completed-phase-014-deep-review-p1-fixpack"
    next_safe_action: "sidecar-deep-research-investigation-arc-010"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
      - "scratch/batch-plan.md"
    session_dedup:
      fingerprint: "sha256:0140140140140140140140140140140140140140140140140140140140140140"
      session_id: "009-memory-leak-remediation-014"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Spec folder pre-approved by parent dispatch."
      - "Slug complies with ALWAYS rule 20: source=deep-review-p1-findings, target=lifecycle-and-sidecar-hardening."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Spec: Deep-Review P1 Findings Remediation for Lifecycle and Sidecar Hardening

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Arc 009's deep review returned a CONDITIONAL verdict with P0=0, P1=40, and P2=20. Phase 014 converts those findings into six bounded implementation batches so later dispatches can close correctness races, cleanup gaps, local-service security boundaries, audit/data integrity failures, traceability evidence gaps, and P2 maintainability drift without reopening the review packet itself.

**Key Decisions**: shared lease/ledger helper where duplicate protocols exist; env allowlists for subprocess boundaries; one checklist row per finding; P2 items may defer only with explicit evidence and rationale.

**Critical Dependencies**: `review/deep-review-findings-registry.json`, `review/resource-map.md`, arc 009 phase children 003-013, and affected `.opencode/skills/` implementation surfaces.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Completed |
| **Created** | 2026-05-22 |
| **Branch** | `main` |
| **Estimated LOC** | 1200+ |
| **Parent Spec** | ../spec.md |
| **Phase** | 14 of arc 009 |
| **Predecessor** | 013-owner-lease-heartbeat-staleness-detection |
| **Successor** | None assigned |
| **Completion Percent** | 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase is a post-review remediation packet for arc 009. The source of truth for findings is `../review/deep-review-findings-registry.json`; the resource map provides the owning phase and remediation surface for each finding.

**Naming compliance**: the folder name follows system-spec-kit ALWAYS rule 20: `014-fix-<source>-for-<target>`, with source `deep-review-p1-findings` and target `lifecycle-and-sidecar-hardening`.

**Scope Boundary**: scaffold and plan all active P1/P2 deep-review findings; implementation is performed by later batch dispatches.

**Dependencies**:
- `../review/review-report.md`
- `../review/resource-map.md`
- `../review/deep-review-findings-registry.json`
- `../003-cli-dispatch-containment-and-recursion-guards/`
- `../004-deep-loop-locks-state-and-recovery/`
- `../005-expected-daemon-classifier-and-process-sweep/`
- `../006-cocoindex-remove-cancel-and-index-lifecycle/`
- `../007-code-graph-launcher-and-db-lifecycle/`
- `../008-sidecar-local-model-and-adapter-lifecycle/`
- `../009-spec-memory-runtime-retention-cleanup/`
- `../010-final-regression-and-operator-runbook/`
- `../011-system-code-graph-suite-triage/`
- `../012-adapter-resident-memory-benchmark/`
- `../013-owner-lease-heartbeat-staleness-detection/`

**Deliverables**:
- Six implementation batches in `plan.md`, `tasks.md`, and `scratch/batch-plan.md`
- One verification checklist row for every active finding
- ADRs for shared lease, environment containment, fixture rewrite, and P2 deferral policy
- Metadata files for memory and graph traversal
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Arc 009 closed its implementation phases, but the deep review still found 40 P1 issues and 20 P2 advisories. The highest-risk themes are non-exclusive ownership primitives, cleanup paths that can report success before resources are actually closed, local-service and executor trust-boundary gaps, and tests/docs that prove narrower behavior than the phase specs require.

### Purpose
Provide the authoritative remediation scaffold for phase 014 so each later implementation dispatch has a bounded batch, source finding IDs, affected files, expected tests, and completion evidence contract.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Plan closure for all 40 P1 findings.
- Plan closure or documented deferral for all 20 P2 findings.
- Update this phase's spec-folder docs and metadata.
- Update the arc 009 parent phase map and graph child list.
- Produce `scratch/batch-plan.md` for sequential batch dispatch.

### Out of Scope
- Runtime implementation changes.
- Test implementation changes.
- Edits to `review/review-report.md`, `review/resource-map.md`, or `review/deep-review-findings-registry.json`.
- Commits, branches, or CLI self-dispatch.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening/spec.md` | Create | Phase specification |
| `014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening/plan.md` | Create | Batch architecture and execution plan |
| `014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening/tasks.md` | Create | Numbered batch tasks |
| `014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening/checklist.md` | Create | One row per P1/P2 finding |
| `014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening/decision-record.md` | Create | ADRs for shared decisions |
| `014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening/implementation-summary.md` | Create | Empty Level 3 summary scaffold |
| `014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening/description.json` | Create | Search metadata |
| `014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening/graph-metadata.json` | Create | Graph metadata |
| `014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening/scratch/batch-plan.md` | Create | Batch dispatch plan |
| `../spec.md` | Modify | Add phase 014 planned row |
| `../graph-metadata.json` | Modify | Append phase 014 child ID |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Close the 40 P1 deep-review findings or record explicit parent-approved deferral | `checklist.md` shows each P1 as `closed` with commit/test evidence or `deferred` with rationale and approval link. |
| REQ-002 | Keep remediation source of truth stable | Review report, resource map, registry, iteration files, source code, tests, and prior child phases are not modified by scaffold-only work. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Address all 20 P2 findings or explicitly defer them | Every P2 row has status `closed` or `deferred`, with evidence or rationale. |
| REQ-004 | Preserve six batch handoff plan | `scratch/batch-plan.md` lists B1-B6 with finding IDs, files, prompt skeletons, and tests. |
| REQ-005 | Validate phase and parent docs strictly | Phase 014 and arc 009 parent `validate.sh --strict` exit 0 before completion is claimed. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All P1 findings are closed or explicitly deferred with rationale and parent approval.
- **SC-002**: P2 findings are closed where practical or carried as documented deferrals.
- **SC-003**: Affected module suites pass for the batch that touched them: targeted Vitest, pytest, shell checks, and strict spec validation.
- **SC-004**: Phase 014 and parent arc 009 pass strict spec validation.
- **SC-005**: The final implementation summary records commit hashes, command evidence, and residual risk.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Lease fixes diverge between TS and CJS | One launcher path remains racy. | Prefer shared helper or generated parity tests across both implementations. |
| Risk | Security hardening breaks local developer workflows | Sidecars or executors may fail to start. | Use explicit env allowlists and targeted startup tests per surface. |
| Risk | Traceability-only findings mutate old phase docs too broadly | Historical evidence becomes noisy. | Limit prior-phase doc edits to finding closure evidence when later implementation dispatches require it. |
| Dependency | Python and Node test environments | Batch validation may block on local dependencies. | Record exact failed command and environment gap in batch handoff. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Security
- **NFR-S01**: Subprocess envs carry only documented allowlisted variables.
- **NFR-S02**: Local sidecar ownership proofs use non-predictable tokens and authenticated health/warmup paths.
- **NFR-S03**: Operator and inventory outputs redact owner tokens.

### Reliability
- **NFR-R01**: Cleanup paths wait for close/exit or record degraded status before dropping ownership.
- **NFR-R02**: Audit and ledger writes are append/rotation safe under corrupt-tail and same-millisecond cases.
- **NFR-R03**: Cancellation identity matching cannot cancel unrelated work.

### Maintainability
- **NFR-M01**: Cross-runtime protocols have one shared source or parity tests.
- **NFR-M02**: P2 deferrals stay visible in checklist and implementation summary.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- Concurrent startup of two owners for the same lock or sidecar ledger.
- Signal cleanup that completes asynchronously while the process remains alive.
- Corrupt JSONL tail before the next pre-dispatch audit read.
- Port reuse by an unrelated localhost service.
- Project dotenv values that attempt to inject runtime flags.
- MacOS timeout-kill fixtures where PID liveness differs from child cleanup semantics.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Signal | Assessment |
|--------|------------|
| Estimated LOC | 1200+ across follow-on batches |
| Risk | High, because ownership, cleanup, and security boundaries cross multiple runtimes |
| Documentation Level | Level 3, because this is architecture-touching and cross-surface |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Non-exclusive lease primitive remains in one runtime | H | M | B1 shared helper/parity tests |
| R-002 | Env containment drops required runtime variable | M | M | B3 allowlist with startup regression tests |
| R-003 | Fixture rewrite proves helper behavior but not public transport | H | M | B5 requires public API/client coverage |
| R-004 | P2 drift hides a future P1 regression | M | M | B6 explicit closure/deferral ledger |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

- **Given** a parent agent dispatches B1, **When** the implementation agent reads this packet, **Then** it can identify every lease/ledger race finding, file, and test gate without reopening the whole review report.
- **Given** a batch closes a finding, **When** the agent updates `checklist.md`, **Then** the row records status, commit hash, and test evidence.
- **Given** a P2 item is deferred, **When** the phase closes, **Then** the deferral has rationale, owner, and reopen trigger in `implementation-summary.md`.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None at scaffold time. Batch agents must add questions here only when a finding cannot be closed or deferred under the current scope.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:cross-refs -->
## RELATED DOCUMENTS

- Parent arc: `../spec.md`
- Review report: `../review/review-report.md`
- Resource map: `../review/resource-map.md`
- Findings registry: `../review/deep-review-findings-registry.json`
- Batch dispatch plan: `scratch/batch-plan.md`
<!-- /ANCHOR:cross-refs -->
