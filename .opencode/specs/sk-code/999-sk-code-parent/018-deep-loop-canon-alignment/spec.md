---
title: "Feature Specification: Phase 18 deep-loop canon alignment and benchmark"
description: "Forward-looking Level 2 plan for split deep-loop parent-hub canon alignment: safe-now additive hub artifacts and deferred registry/router/changelog work gated on the live refactor settling."
trigger_phrases:
  - "deep-loop canon alignment"
  - "deep-loop benchmark baseline"
  - "deep-loop parent hub conformance"
importance_tier: "high"
contextType: "planning"
parent: "skilled-agent-orchestration/124-sk-code-parent"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-code-parent/018-deep-loop-canon-alignment"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Phase executed; deep-loop STRICT 0/0, benchmark frozen"
    next_safe_action: "Phase 019: validator WARN->FAIL promotion + 124 rollup"
---
# Feature Specification: Phase 18 deep-loop canon alignment and benchmark

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-05 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep-loop parent hub fails the parent-hub canon with 8 P0 findings and 26 strict invariant failures. The audit confirms missing hub-level additive artifacts and registry/router/changelog defects, while also confirming that `mode-registry.json` is dirty because a live agent is mid-refactor.

### Purpose
Document and later execute a split phase: complete only collision-free deep-loop hub artifacts now, and preserve all registry, router, extension, and changelog fixes as gated tasks until the live refactor returns the registry to a git-clean state.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 018a SAFE-NOW: author `.opencode/skills/deep-loop-workflows/description.json` from the parent-hub description shape. Trace: master plan 018a; audit P0-4.
- 018a SAFE-NOW: scaffold `.opencode/skills/deep-loop-workflows/manual_testing_playbook/` as a hub-level playbook mirroring the sk-code shape. Trace: master plan 018a; audit P0-5.
- 018a SAFE-NOW: create `.opencode/skills/deep-loop-workflows/benchmark/` baseline package mirroring the sk-code shape. Trace: master plan 018a; audit P0-6.
- 018b DEFERRED/GATED: record the future registry, extension, hub-router, and changelog fixes without opening their target files until the gate clears. Trace: master plan 018b; audit P0-1, P0-2, P0-3, P0-7, P0-8.

### Out of Scope
- Editing `.opencode/skills/deep-loop-workflows/mode-registry.json` while it is dirty.
- Authoring `.opencode/skills/deep-loop-workflows/hub-router.json` before the seven-mode set is stable.
- Removing `.opencode/skills/deep-loop-workflows/changelog/deep-context` while the live agent owns the deprecation sweep.
- Updating shared validators or promoting benchmark gates; phase 019 owns promotion after all hubs pass.
- Generating spec metadata files for this phase folder; the orchestrator handles `description.json` and `graph-metadata.json` centrally.

### Files to Change

| File Path | Change Type | Description | Trace |
|-----------|-------------|-------------|-------|
| `.opencode/skills/deep-loop-workflows/description.json` | Create | Advisor-facing hub description, version, keywords, trigger examples | master plan 018a; audit P0-4 |
| `.opencode/skills/deep-loop-workflows/manual_testing_playbook/` | Create | Hub-level manual validation package | master plan 018a; audit P0-5 |
| `.opencode/skills/deep-loop-workflows/benchmark/` | Create | Hub-level benchmark baseline package | master plan 018a; audit P0-6 |
| `.opencode/skills/deep-loop-workflows/mode-registry.json` | Deferred update | Add per-mode canon fields and top-level extensions after git-clean gate | master plan 018b; audit P0-1, P0-2, P0-3 |
| `.opencode/skills/deep-loop-workflows/hub-router.json` | Deferred create | Create router after seven-mode registry set is settled | master plan 018b; audit P0-7 |
| `.opencode/skills/deep-loop-workflows/changelog/deep-context` | Deferred remove | Let live deprecation sweep remove dangling symlink | master plan 018b; audit P0-8 |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete before phase can close)

| ID | Requirement | Acceptance Criteria | Trace |
|----|-------------|---------------------|-------|
| REQ-001 | SAFE-NOW description artifact exists | `deep-loop-workflows/description.json` exists and follows the parent-hub description fields: name, description, version, keywords, importance tier, trigger examples | master plan 018a; audit P0-4 |
| REQ-002 | SAFE-NOW manual playbook exists | `deep-loop-workflows/manual_testing_playbook/` exists with a hub-level playbook shape mirroring sk-code, independent of child packet playbooks | master plan 018a; audit P0-5 |
| REQ-003 | SAFE-NOW benchmark baseline exists | `deep-loop-workflows/benchmark/` exists with a baseline package mirroring sk-code | master plan 018a; audit P0-6 |
| REQ-004 | DEFERRED registry edits stay blocked until clean | Every per-mode `packetKind`, `grandfatheredFolderMismatch`, `toolSurface`, and extension edit is not opened until `mode-registry.json` is git-clean | master plan 018b; audit P0-1, P0-2, P0-3 |
| REQ-005 | DEFERRED router creation waits for stable modes | `hub-router.json` is not authored until the seven-mode registry set is settled for bidirectional check 5b | master plan 018b; audit P0-7 |
| REQ-006 | DEFERRED changelog symlink removal stays with live deprecation | Dangling `changelog/deep-context` is not removed by this phase until the live deprecation sweep owns it | master plan 018b; audit P0-8 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria | Trace |
|----|-------------|---------------------|-------|
| REQ-007 | Split remains explicit in execution records | `tasks.md`, `plan.md`, and `implementation-summary.md` preserve 018a SAFE-NOW and 018b DEFERRED/GATED groups | user brief; master plan 018 |
| REQ-008 | Verification distinguishes partial landing from full closure | Verification reports that 018a closes 3 of 8 P0 findings and 018b closes the remaining findings only after the gate clears | master plan 018 verify bullet |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001** — MET: The 018a additive artifacts landed without touching dirty registry, router, or changelog files (blast-radius gate confirmed dir-scoped diffs). Trace: master plan sequencing and audit P0-1.
- **SC-002** — MET: Parent-hub check failures for missing description, manual playbook, and benchmark cleared after 018a. Trace: audit P0-4, P0-5, P0-6.
- **SC-003** — MET: 018b work stayed blocked under the gate `mode-registry.json dirty — live agent mid-refactor; open only when git-clean` until the registry returned git-clean; only then did it open. Trace: user brief and audit P0-1.
- **SC-004** — MET: Once the gate cleared, 018b executed and deep-loop parent-hub STRICT conformance reached 0 failures (registry, extension, router, and changelog checks all pass). Trace: master plan 018 verify bullet.

### Acceptance Scenarios

- **Scenario 1**: Given the live registry remains dirty, when this phase begins execution, then only 018a additive artifacts are opened.
- **Scenario 2**: Given 018a artifacts are authored, when parent-skill-check runs, then missing description, manual playbook, and benchmark failures are expected to clear.
- **Scenario 3**: Given the registry returns git-clean, when 018b begins, then per-mode fields, extensions, hub-router, and changelog cleanup can proceed in the settled mode set.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `mode-registry.json` dirty state | Registry and extension edits can collide with the live refactor | Hard-block all 018b registry work until git-clean |
| Dependency | Settled seven-mode set | Router 5b bidirectional check can fail if modes move mid-authoring | Author `hub-router.json` only after registry stabilizes |
| Risk | Changelog deprecation collision | Removing the dangling symlink can conflict with live deprecation deletes | Leave symlink cleanup to the live deprecation sweep |
| Risk | Partial conformance expectations | 018a cannot close all deep-loop failures alone | Report 018a as 3 of 8 P0 closures and keep 018b blockers visible |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Safety
- **NFR-SAF-01**: No work may edit `mode-registry.json`, `hub-router.json`, or changelog paths while the 018b gate is active.

### Reliability
- **NFR-R01**: Verification must run parent-skill-check strict after 018a and again after 018b once unblocked.

### Maintainability
- **NFR-M01**: Safe-now artifacts should mirror sk-code hub shapes so future benchmark and playbook comparison is consistent across hubs.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Child packet playbooks and behavior benchmarks do not satisfy hub-level `manual_testing_playbook/` or `benchmark/` checks.
- A missing `hub-router.json` is absent on disk, but still gated because its 5b check depends on the moving registry mode set.

### Error Scenarios
- If parent-skill-check still reports missing 9a or 9b after 018a, compare the created shape to sk-code before touching gated files.
- If `mode-registry.json` becomes clean but the seven-mode set is not settled, keep 018b blocked until both are true.

### Concurrent Operations
- Live deep-context/runtime refactor work owns dirty registry and deprecation paths; this phase must not overlap those files.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Three safe-now additive artifacts plus five gated conformance fixes |
| Risk | 20/25 | Collision risk is high around dirty registry and live deprecation sweep |
| Research | 10/20 | Audit and master plan define clear scope and traceability |
| **Total** | **44/70** | **Level 2** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- RESOLVED: `mode-registry.json` returned git-clean after the live refactor settled; 018b opened and executed (`e1a266b07c`).
- RESOLVED: the settled registry confirmed the seven-mode set; bidirectional hub-router check 5b passes (router signals == registry modes).

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`

<!-- /ANCHOR:related-docs -->
