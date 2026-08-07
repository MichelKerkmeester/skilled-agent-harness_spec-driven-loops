---
title: "Lifecycle State-Machine Taxonomy and Transition Guards"
description: "Active loop statuses and terminal stop reasons are scattered as ad-hoc strings with no authoritative transition table, allowing callers to set illegal state transitions silently."
trigger_phrases:
  - "lifecycle-taxonomy-guards"
  - "loop-state-machine-taxonomy"
  - "lifecycle-transition-guards"
  - "loop-status-contract"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/002-deep-loop-runtime/005-lifecycle-taxonomy-guards"
    last_updated_at: "2026-06-28T14:01:55Z"
    last_updated_by: "spec-author"
    recent_action: "Authored spec.md from research.md §5.1"
    next_safe_action: "Create plan.md and tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-lifecycle-taxonomy-guards"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: Lifecycle State-Machine Taxonomy and Transition Guards

<!-- SPECKIT_LEVEL: 1 -->
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
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 18 |
| **Predecessor** | 004-abortable-chunked-sleep |
| **Successor** | 006-jsonl-lock-held-merge |
| **Handoff Criteria** | `lifecycle-taxonomy.cjs` exports active statuses, terminal stop reasons, legal transition map, and the one-shot paused-wait gate; backward-compatible exports are present; caller migration list is in tasks.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the deep-loop-runtime recs specification.

**Scope Boundary**: Encodes active loop statuses, terminal stop reasons, legal state transitions, and the one-shot `resumeResolve` paused-wait gate as a shared contract in `lifecycle-taxonomy.cjs`.

**Dependencies**:
- None (standalone contract file; no dependency on phases 1-4)

**Deliverables**:
- Updated `.opencode/skills/deep-loop-runtime/lib/deep-loop/lifecycle-taxonomy.cjs` with exported taxonomy, transition table, and paused-wait gate

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Active loop statuses (`running`, `waiting`, `paused`, `idle`, `stopped`) and terminal stop reasons are scattered as ad-hoc string literals across multiple files with no single authoritative source. There is no transition table encoding which state changes are legal, and no enforcement preventing callers from setting illegal transitions silently. The one-shot `resumeResolve` paused-wait gate is implemented inline without a shared contract, making it easy to misuse.

### Purpose

Encode the full lifecycle taxonomy — active statuses, terminal stop reasons, legal transitions, and the paused-wait gate — as a single shared contract module so all callers reference one source of truth and illegal transitions become auditable.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Promote and export `LoopActiveStatus` union (`running | waiting | paused | idle | stopped`) in `lifecycle-taxonomy.cjs`
- Export `LoopStopReason` enum/union for terminal stop reasons
- Encode a `LEGAL_TRANSITIONS` map: `Record<LoopActiveStatus, LoopActiveStatus[]>` listing allowed target states for each source state
- Encode and export the one-shot `resumeResolve` paused-wait gate contract (the mechanism by which a paused loop waits for a resume signal)
- Maintain backward-compatible exports so existing callers using old string literals continue to compile during transition

### Out of Scope

- Migrating existing callers to the new taxonomy constants in this ticket — maintained as a follow-on; old string literals remain valid during transition
- Runtime enforcement via middleware or proxy guards — deferred; this phase is the contract definition only

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/lifecycle-taxonomy.cjs` | Modify | Add `LoopActiveStatus`, `LoopStopReason`, `LEGAL_TRANSITIONS`, and paused-wait gate exports |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Export `LoopActiveStatus`, `LoopStopReason`, `LEGAL_TRANSITIONS`, and the `resumeResolve` paused-wait gate contract from `lifecycle-taxonomy.cjs` | All four exports are present and typed; `LEGAL_TRANSITIONS` covers all five active statuses; `resumeResolve` gate is documented as one-shot |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Maintain backward-compatible string-literal exports so existing callers continue to compile unchanged during transition | TypeScript compilation passes for existing callers without modification; tasks.md lists the migration plan |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `LEGAL_TRANSITIONS` covers all five active statuses and is unit-testable: an illegal transition (e.g., `stopped → running`) is absent from the map
- **SC-002**: Existing callers compile and pass their tests without modification; the new taxonomy exports are importable from `lifecycle-taxonomy.cjs`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Evidence | `external/loop-cli-main/src/types.ts:46,74`; `loop-controller.ts:102,113,220,248` (reference only — NOT our code) | Low | Read-only citation from research.md §5.1 |
| Risk | Partial migration leaves some callers using old string literals; inconsistent status strings may co-exist during transition | Med | Maintain backward-compatible re-exports; track all old string literal usages in tasks.md migration list |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None at this time.
<!-- /ANCHOR:questions -->

---

> **Provenance:** research.md §5.1, (iter 4)

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
