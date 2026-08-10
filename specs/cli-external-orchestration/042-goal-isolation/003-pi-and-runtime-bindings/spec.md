---
title: "Implementation Phase: Pi and Runtime Goal Bindings"
description: "Bind Pi and every retained goal-capable runtime to the session-scoped core using native session identity for injection and management."
status: "complete"
trigger_phrases:
  - "pi goal session binding"
  - "runtime goal adapter isolation"
  - "goal management session identity"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/042-goal-isolation/003-pi-and-runtime-bindings"
    last_updated_at: "2026-08-10T14:34:30Z"
    last_updated_by: "codex"
    recent_action: "Completed Pi native management and Pi/Cursor lifecycle identity binding"
    next_safe_action: "Complete legacy cutover diagnostics and runtime documentation in Phase 4"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Implementation Phase: Pi and Runtime Goal Bindings

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
| **Phase** | 3 of 5 |
| **Predecessor** | `002-session-scoped-core` |
| **Successor** | `004-legacy-cutover-and-docs` |
| **Handoff Criteria** | Pi and every retained sibling runtime use native identity end to end; unsupported runtime claims are removed; isolated adapter tests pass. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

**Scope Boundary**: runtime identity extraction, injection adapters, identity-aware management surfaces, registrations, and adapter tests. Shared state semantics are frozen by Phase 2; legacy cutover and broad docs belong to Phase 4.

**Dependencies**:
- Phase 2 scoped core and CLI contract are green.
- Phase 1 fixes the supported matrix: Pi full native binding, Cursor hook-only unless a safe management bridge appears, Devin decommissioned, OpenCode unchanged.

**Deliverables**:
- Pi injection and native registered-command management bound to `ctx.sessionManager.getSessionId()`.
- Cursor hook reads bound to verified payload identity; user-facing management is unsupported until it can supply the same id.
- Removal of stale Devin goal-support claims without restoring decommissioned adapters.
- Explicit non-support for runtimes without a complete current-session contract.
- Two-session adapter and user-facing command canaries.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Pi and Cursor now bind every supported lifecycle operation to native session identity. Pi management uses the same verified identity through its registered command, Cursor management fails closed because its prompt surface lacks that identity, and Devin remains decommissioned.

### Purpose

Keep every supported runtime bound to the same native current-session identity, with safe no-op or explicit unsupported behavior when identity cannot be obtained.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Bind Pi input, session-start, turn-end, verification, and management actions to native identity.
- Bind Cursor injection and management where current APIs support it.
- Keep Devin goal support decommissioned and remove stale current-support claims.
- Keep OpenCode's existing per-session plugin unchanged as a regression control.
- Validate missing identity, resume, fork/new session, and same-id/different-runtime behavior.

### Out of Scope

- Changing the goal objective text or verifier policy.
- Adding Claude/Codex support without a complete current-session management contract.
- Legacy migration, final documentation sweep, or broad release sign-off.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/hooks/goal/pi/goal-context.ts` | Modify | Pass native Pi session scope for all lifecycle calls. |
| `.opencode/hooks/goal/pi/goal-context.ts`, `.pi/prompts/goal-pi.md` | Modify | Register native current-session set/show/mutate actions and bind all lifecycle calls. |
| `.opencode/hooks/goal/cursor/goal-inject.mjs` | Modify | Extract and validate native Cursor identity. |
| `.cursor/commands/goal-cursor.md` or verified Cursor tool surface | Modify | Bind management only if native identity is available; otherwise state the unsupported limitation. |
| Goal docs/matrices mentioning Devin | Modify | Remove stale goal-support claims; keep registrations adapter-free. |
| Adapter test files | Modify/Create | Isolation, missing-id, resume/fork, and registration coverage. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Pi passes native session identity on every goal read and mutation. | Fake contexts A/B receive only their canary; turn-end or management in A leaves B unchanged. |
| REQ-002 | Pi management resolves the current session without user-entered ids. | User-facing set/show/mutate operations use the same scope key as injection and never fall back globally. |
| REQ-003 | Every retained sibling runtime has equivalent identity safety. | Adapter and command/tool tests prove current-session binding or the runtime is explicitly unsupported. |
| REQ-004 | Missing identity never selects a goal. | Injection no-ops and management fails with the stable Phase 2 error without writing. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Devin source, registration, tests, and docs agree. | No goal adapter is tracked or registered, and current docs state that support was decommissioned. |
| REQ-006 | Resume and fork behavior follows the accepted contract. | Same native id restores its record; new/forked id starts unbound unless an explicit clone operation exists. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Two Pi contexts can set, inject, and mutate distinct canaries without cross-read.
- **SC-002**: Same id strings in Pi and Cursor remain isolated by runtime namespace.
- **SC-003**: Registrations reference only tracked adapters and all registered adapter tests pass.
- **SC-004**: The Pi extension can be re-enabled only after the focused end-to-end matrix passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Injection identity differs from management identity | Goals appear missing or write into another scope. | Shared resolver plus set-then-inject end-to-end canary. |
| Risk | Re-enabling Pi too early | Known cross-session steering returns. | Keep exclusion in `.pi/settings.json` until Phase 5 acceptance. |
| Risk | Historical Devin claims drive dead code | Unsupported surface increases maintenance and false confidence. | Decide from current runtime capability and registration truth. |
| Dependency | Native command/tool APIs | Management may remain impossible on one runtime. | Mark that runtime unsupported instead of adding a process-global pointer. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None at the research boundary. Resolved decisions:

- Pi uses `ExtensionAPI.registerCommand`; the handler receives `CommandContext.sessionManager.getSessionId()`.
- Cursor hook reads use `session_id`. Its current shell-style management prompt remains unsupported unless implementation finds a native bridge that supplies the identical id without ambient process state.
- Devin goal hooks remain decommissioned and are not restored.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Core contract**: `../002-session-scoped-core/spec.md`
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
