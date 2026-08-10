---
title: "Implementation Phase: Legacy Cutover and Goal Documentation"
description: "Completed legacy quarantine, explicit migration and diagnostics, and aligned commands, registrations, docs, and playbooks with the scoped runtime contract."
status: "complete"
trigger_phrases:
  - "goal legacy cutover"
  - "active goal migration"
  - "goal hook documentation parity"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/042-goal-isolation/004-legacy-cutover-and-docs"
    last_updated_at: "2026-08-10T15:00:06Z"
    last_updated_by: "codex"
    recent_action: "Completed and verified legacy cutover, support-truth reconciliation, and operator documentation"
    next_safe_action: "Run final verification and validation in phase 5"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Implementation Phase: Legacy Cutover and Goal Documentation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-10 |
| **Branch** | Current working branch |
| **Parent Spec** | `../spec.md` |
| **Phase** | 4 of 5 |
| **Predecessor** | `003-pi-and-runtime-bindings` |
| **Successor** | `005-verification-and-validation` |
| **Handoff Criteria** | Legacy data cannot inject automatically; diagnostics and explicit migration are safe; all current docs, commands, registrations, and runtime matrices match tracked behavior. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

**Scope Boundary**: legacy state cutover, aggregate diagnostics, user-facing commands, registrations, goal documentation, feature catalog, and manual playbooks. New storage or adapter semantics belong to phases 2 and 3.

**Dependencies**:
- Scoped core and retained runtime bindings pass focused tests.
- Phase 1 fixes the supported runtime and migration decisions: no default identity, explicit legacy ownership, Devin decommissioned.

**Deliverables**:
- Explicit inspect/migrate/archive behavior for legacy `active-goal.json`.
- Privacy-safe current-session and aggregate diagnostics.
- Updated commands, README, contract docs, feature catalog, and playbooks.
- Clean source/config/documentation truth matrix.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The legacy singleton may contain a real objective but has no trustworthy owner. It is now diagnostic-only: it cannot inject automatically, and operators must explicitly migrate it to a validated session scope or archive it.

### Purpose

The cutover preserves legacy bytes without guessing ownership. Every operator-facing surface now describes the verified session-scoped behavior and current runtime support boundary.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Detect, quarantine, inspect, explicitly bind, or archive legacy singleton data.
- Ensure legacy-only startup and prompt injection select no goal.
- Distinguish current-session diagnostics from aggregate counts without exposing raw ids.
- Update commands, state docs, runtime matrix, feature catalog, manual playbooks, and registrations.
- Remove stale assertions about unsupported runtimes or automatic session resolution.

### Out of Scope

- Automatically selecting a legacy record owner.
- Changing accepted core or native binding semantics.
- Final live acceptance and broad workspace sign-off.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/hooks/goal/{README.md,goal-plugin.md}` | Modify | Scoped contract, state layout, commands, runtime matrix, rollback. |
| `.opencode/hooks/goal/bin/goal.cjs` | Modify if needed | Explicit legacy inspect/migrate/archive and diagnostics. |
| `.pi/prompts/goal-pi.md`, `.cursor/commands/goal-cursor.md` | Modify | Current-session behavior and unsupported limits. |
| Runtime registrations | Modify if needed | Match retained tracked adapters exactly. |
| Goal feature catalog/manual playbook | Modify/Create | Concurrent-session, migration, missing-id, and rollback scenarios. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Legacy state cannot passively steer any session. | Legacy-only injection returns no goal across all retained runtimes. |
| REQ-002 | Migration requires explicit target ownership. | Migrate validates the current scope, records the action, and never defaults to the first active session. |
| REQ-003 | User-facing commands describe actual identity behavior. | No command claims automatic session resolution unless its tested native bridge provides it. |
| REQ-004 | Runtime support claims match source and registration. | Tracked adapter inventory, config paths, tests, docs, and matrix have identical supported runtimes. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Diagnostics protect session privacy. | Default output shows current-scope status and aggregate counts without raw ids. |
| REQ-006 | Rollback and disabled-state procedures are documented and tested. | Playbook can disable injection, preserve both layouts, and prove a new session receives no goal block. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Legacy-only and explicit migration tests pass with no automatic binding.
- **SC-002**: Repository scans find no stale claim that the singleton is the active cross-runtime contract.
- **SC-003**: All goal command and registration paths exist and match the runtime matrix.
- **SC-004**: Manual playbooks cover two concurrent sessions, missing identity, migration, and rollback.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Legacy objective appears lost | Operator may bypass the safer store. | Preserve and expose explicit inspect/archive/migrate actions. |
| Risk | Docs get ahead of shipped adapters | False support claims hide unsafe behavior. | Generate the truth table from tracked files/config/tests before writing prose. |
| Risk | Aggregate diagnostics leak raw ids | Session identifiers become persistent disclosure. | Opaque keys or counts by default; explicit debug mode only if approved. |
| Dependency | Phase 3 support verdict | Docs cannot state final runtime coverage early. | Start only after retained runtime matrix is verified. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

No questions remain open. The implementation resolved the following decisions:

- A successful migration writes the validated scoped target first, then moves the legacy source into the legacy quarantine archive. A quarantine failure removes the new target when possible and reports failure.
- Default diagnostics expose the current-scope result, aggregate status counts, and legacy classification. They do not print raw session identifiers or scope hashes.
- Malformed legacy bytes are never migrated. The explicit archive action preserves them byte-for-byte under a content-derived filename.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Runtime bindings**: `../003-pi-and-runtime-bindings/spec.md`
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
