---
title: "Implementation Phase: Session-Scoped Goal Core"
description: "Replace the runtime-neutral singleton with a required composite session scope and isolated lifecycle operations."
status: "complete"
trigger_phrases:
  - "session scoped goal core"
  - "goal scope resolver"
  - "active goal storage isolation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/009-goal-isolation/002-session-scoped-core"
    last_updated_at: "2026-08-10T14:12:18Z"
    last_updated_by: "codex"
    recent_action: "Completed and verified the session-scoped core and explicit-binding CLI"
    next_safe_action: "Bind Pi and Cursor adapters to their native session identities in Phase 3"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Implementation Phase: Session-Scoped Goal Core

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-10 |
| **Branch** | Current working branch |
| **Parent Spec** | `../spec.md` |
| **Phase** | 2 of 5 |
| **Predecessor** | `001-goal-isolation-research` |
| **Successor** | `003-pi-and-runtime-bindings` |
| **Handoff Criteria** | Core and CLI operations require explicit scope, two sessions remain isolated through every lifecycle mutation, and no passive singleton fallback exists. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

**Scope Boundary**: shared runtime-neutral goal core, identity validation, state paths, CLI contract, and focused tests. Native Pi/Cursor/Devin bindings belong to Phase 3.

**Dependencies**:
- Corrected Phase 1 synthesis accepted as the architecture authority: native identity is required, no `"default"` scope, and no passive legacy fallback.
- Baseline goal-core and OpenCode plugin test counts recorded before changes: 29/29 and 118/119 respectively; the OpenCode failure was a stale moved-document assertion and is now repaired.

**Deliverables**:
- Required goal-scope resolver.
- Opaque per-session state and archive paths.
- Scoped lifecycle and diagnostics APIs.
- Failing-then-passing two-session test matrix.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The shared core hardcodes one `active-goal.json` and exposes operations that receive no session identity. It cannot represent concurrent goals, and any caller can mutate the last-written record.

### Purpose

Make workspace, runtime, and native session id mandatory inputs to every state operation so concurrent sessions have independent records and archives.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add scope validation and collision-resistant opaque key derivation.
- Thread scope through set, read, show, record, verify, pause, resume, complete, clear, history, health, and doctor operations.
- Preserve atomic writes and restrictive file/directory modes.
- Make management mutations fail closed with stable identity errors.
- Add legacy detection primitives without assigning ownership.

### Out of Scope

- Native runtime extraction and user-facing command binding.
- Live Pi/Cursor tests and documentation cutover.
- Multiple active goals within one session.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/hooks/goal/lib/goal-core.cjs` | Modify | Required scope, scoped paths, isolated operations, legacy detection. |
| `.opencode/hooks/goal/bin/goal.cjs` | Modify | Identity-aware CLI contract and stable errors. |
| `.opencode/hooks/goal/lib/goal-core.test.cjs` | Modify | Full two-session and collision matrix. |
| `.opencode/hooks/goal/bin/*.test.*` | Modify/Create | CLI identity and no-write failure coverage. |
| `.opencode/plugins/tests/mk-goal-tool-path.test.cjs` | Modify | Repair the moved operator-reference assertion so the OpenCode regression control is executable. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every core operation requires a validated composite scope. | Missing/blank identity returns no injection data; mutations return a stable error and write nothing. |
| REQ-002 | Concurrent sessions retain independent goals. | Session A and B remain readable and independently mutable through the full lifecycle matrix. |
| REQ-003 | Runtime/workspace namespaces cannot collide. | Same session id under different runtimes or workspaces resolves to distinct opaque paths. |
| REQ-004 | The legacy singleton is never a passive read fallback. | Legacy-only tests return no scoped goal and report quarantine status through diagnostics. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Paths and diagnostics protect raw identity. | Raw session ids never appear in path segments or default diagnostic output. |
| REQ-006 | Same-session races preserve the chosen serialization contract. | Focused concurrency tests pass without cross-session mutation or malformed JSON. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The two-session lifecycle matrix passes and non-owner files remain byte-equivalent.
- **SC-002**: Missing, malicious, cross-runtime, cross-workspace, resume, fork, malformed, and legacy-only rows pass.
- **SC-003**: Existing OpenCode goal plugin tests remain green.
- **SC-004**: No production core operation reaches `active-goal.json` as an active record.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Partial API conversion | One unscoped operation can reintroduce leakage. | Inventory and test every exported operation before adapter work. |
| Risk | Scope normalization drift | CLI and adapters may derive different keys. | One resolver owns validation and path derivation. |
| Risk | Same-session write races | Lost updates or corrupt JSON. | Retain atomic rename; add queue/lock/revision only if reproduced. |
| Dependency | Phase 1 management recommendation | CLI input contract may be wrong. | Resolved: low-level CLI requires explicit binding; native adapters own current-session acquisition. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. The two implementation questions were resolved:

- Atomic replacement is the same-scope serialization contract for this phase. Twelve concurrent writers left one valid record and no temporary files, so an additional lock was not justified.
- Aggregate diagnostics return counts only by default. They report the presence of legacy state without enumerating or exposing raw session identities.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research authority**: `../001-goal-isolation-research/research/research.md`
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
