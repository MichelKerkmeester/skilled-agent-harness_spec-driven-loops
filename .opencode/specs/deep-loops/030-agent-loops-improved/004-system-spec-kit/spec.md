---
title: "Subsystem: System Spec Kit — Autopilot Lifecycle"
description: "The speckit `:auto` mode lacks crash-safe unattended execution: there is no branch-first envelope, no machine-readable terminal reasons, and branch preservation on hard failure is absent, making unattended speckit runs fragile."
trigger_phrases:
  - "speckit autopilot"
  - "speckit unattended"
  - "system-spec-kit lifecycle"
  - "004 system spec kit"
  - "speckit complete autopilot"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-agent-loops-improved/004-system-spec-kit"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Authored subsystem parent spec for 004-system-spec-kit"
    next_safe_action: "Phase complete; all sub-phases shipped"
    blockers: []
    key_files:
      - ".opencode/commands/speckit/complete.md"
      - ".opencode/commands/speckit/plan.md"
      - ".opencode/commands/speckit/implement.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Subsystem: System Spec Kit — Autopilot Lifecycle

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 7 |
| **Predecessor** | 003-deep-loop-workflows |
| **Successor** | 005-skill-interconnection |
| **Handoff Criteria** | Child phase 001-speckit-autopilot-lifecycle passes `validate.sh --strict`; implementation summary present |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the deep-loops/030-agent-loops-improved subsystem groups.

**Scope Boundary**: Unattended/autopilot lifecycle for the speckit commands (`complete`, `plan`, `implement`). No changes to deep-loop-runtime or other subsystems.

**Dependencies**:
- No hard dependency on other implementation subsystems; can execute independently.

**Deliverables**:
- Filled `001-speckit-autopilot-lifecycle/spec.md` with plan + tasks + checklist authored and executed.

**Changelog**:
- When this phase closes, refresh the matching file in `../changelog/` using parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The speckit `:auto` flag reduces approval prompts but does not deliver a crash-safe unattended execution envelope. When a hard failure occurs mid-run, no branch is preserved, no machine-readable terminal reason is emitted, and the operator cannot distinguish `uncertainty_blocked` from `verification_failed` without reading prose. This makes `:auto` insufficient for fully unattended CI or scheduled pipelines.

### Purpose
Introduce a distinct `:autopilot` / `--unattended` lifecycle for speckit `complete`, `plan`, and `implement`: branch first, propose with machine-readable task metadata, implement with typed terminal reason codes, archive in place, and merge only on clean verification — preserving the branch on any hard failure.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- New `:autopilot` / `--unattended` envelope for `complete.md`, `plan.md`, `implement.md`
- Machine-readable terminal reasons (`no_eligible_tasks`, `retry_exhausted`, `verification_failed`, `uncertainty_blocked`)
- Branch-preserved clean-failure path (merge only on clean verification)
- Corresponding `speckit_*_auto.yaml` asset updates for unattended step sequencing

### Out of Scope
- Changes to deep-loop-runtime, deep-loop-workflows, or any other subsystem — not in scope for this phase
- Merging `:auto` and `:autopilot` into a single mode — distinct envelope required per research

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/speckit/complete.md` | Modify | Add `:autopilot` / `--unattended` envelope with branch + typed terminal reasons |
| `.opencode/commands/speckit/plan.md` | Modify | Add unattended-ready task metadata in plan output |
| `.opencode/commands/speckit/implement.md` | Modify | Add machine-readable terminal reason codes + branch-preserved failure path |
| `.opencode/commands/speckit/assets/speckit_complete_auto.yaml` | Modify | Unattended step sequencing: branch → propose → apply → archive → verify → merge-on-clean |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Detail lives in child phase `001-speckit-autopilot-lifecycle/spec.md` | Child spec passes `validate.sh --strict` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | All child deliverables listed in the Phase Documentation Map reach Status: Complete | `validate.sh --recursive` on this folder exits 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Child phase 001-speckit-autopilot-lifecycle passes `validate.sh --strict` with zero errors
- **SC-002**: Implementation summary is present and non-empty in the child phase folder
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Conflating `:auto` and `:autopilot` in implementation | Medium — two modes diverge at the failure-path boundary | Keep as distinct command flags; document in decision-record.md |
| Dependency | Speckit commands must be read before modification | Medium — scope is large across 3 command files | Read all three before editing; use scope-lock discipline |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `:autopilot` be a sub-command or a flag on the existing `:auto` mode? Resolution required before child phase authors its plan.
- What is the exact set of terminal reason codes — are `no_eligible_tasks` and `uncertainty_blocked` distinct or merged?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-speckit-autopilot-lifecycle/` | Unattended/autopilot speckit lifecycle: branch-first envelope, typed terminal reasons, branch-preserved failure | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| (single phase — no handoffs) | | | |
<!-- /ANCHOR:phase-map -->
