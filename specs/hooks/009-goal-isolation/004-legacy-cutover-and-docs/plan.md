---
title: "Implementation Plan: Legacy Cutover and Goal Documentation"
description: "Apply the explicit legacy policy and reconcile every user-facing and registered goal surface with shipped runtime behavior."
trigger_phrases:
  - "goal cutover plan"
  - "goal docs parity plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/009-goal-isolation/004-legacy-cutover-and-docs"
    last_updated_at: "2026-08-10T15:00:06Z"
    last_updated_by: "codex"
    recent_action: "Completed the legacy cutover plan and all documented quality gates"
    next_safe_action: "Run final verification and validation in phase 5"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Legacy Cutover and Goal Documentation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Legacy state** | `.opencode/skills/.goal-state/active-goal.json` |
| **New state** | Scoped layout from Phase 2 |
| **Surfaces** | CLI, prompts/tools, registrations, README, contract docs, playbooks |
| **Testing** | Legacy fixtures, registration inventory, doc scans, command probes |

### Overview

Implement the accepted explicit legacy policy first, then derive a final runtime truth table from current files and registrations. Use that evidence to update user-facing commands and documentation. No prose should claim support that lacks both an adapter and current-session management.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Phases 2 and 3 focused suites pass: integrated goal tests pass 82/82.
- [x] Final runtime support matrix is known and checked against tracked registrations.
- [x] Legacy migration semantics are implemented and covered by unit, CLI, and live-copy canaries.

### Definition of Done

- [x] Legacy-only injection is absent in Pi and Cursor adapter tests.
- [x] Explicit inspect/migrate/archive behavior passes tests and copied-state canaries.
- [x] Commands, registrations, docs, catalog, and playbooks agree with the runtime truth inventory.
- [x] Targeted stale singleton and unsupported-runtime scans return zero matches.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Fail-closed cutover with preserved legacy evidence and generated support truth.

### Key Components

- **Legacy classifier**: recognizes singleton data without selecting it.
- **Explicit action surface**: inspect, bind to validated current scope, or archive.
- **Diagnostics**: current-scope detail plus privacy-safe aggregate summary.
- **Truth inventory**: tracked adapters, registration paths, tests, commands, and docs.

### Data Flow

```text
legacy singleton -> quarantine/inspect -> explicit validated action -> scoped store
tracked source + config + tests -> runtime truth matrix -> commands and docs
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Legacy state path | Active singleton | Quarantine-only input | Legacy fixture matrix |
| Goal CLI diagnostics | Global current record | Scoped current view plus aggregate summary | CLI snapshot tests |
| Runtime commands | Invoke global CLI | Describe and call verified native bridge | User-flow probes |
| Registrations | Load adapters | Remove stale or add retained verified paths | JSON parse and existence checks |
| Docs/catalog/playbooks | State contract | Rewrite from truth inventory | Focused scans and validation |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Legacy Policy

- [x] Add quarantine classification and explicit actions.
- [x] Test legacy-only, malformed, already-migrated, and repeated-action behavior.

### Phase 2: Runtime Truth Reconciliation

- [x] Inventory tracked adapters, registrations, commands, and tests.
- [x] Correct unsupported or stale surfaces.

### Phase 3: Documentation and Playbooks

- [x] Update contract/state docs, commands, runtime matrix, catalog, and playbooks.
- [x] Run stale-term, path, link, and registration scans.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Legacy classifier and migration actions | `node --test` |
| CLI | Diagnostics, privacy, repeated actions | Spawn harness |
| Configuration | Registration JSON and tracked paths | JSON parse plus file inventory |
| Documentation | Stale claims, links, examples, rollback | `rg` and doc validation |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status | Impact if Blocked |
|------------|--------|-------------------|
| Scoped core/store | Required | No migration target exists. |
| Runtime support matrix | Required | Docs and commands cannot be finalized. |
| Existing legacy files | Optional fixtures | Tests must use isolated copies, never mutate operator data. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: migration binds the wrong scope, docs/config disagree, or legacy startup injects a goal.
- **Procedure**: disable goal injection, restore command/config/docs as one bundle, preserve both legacy and scoped files, and require explicit operator recovery before retrying migration.
<!-- /ANCHOR:rollback -->
