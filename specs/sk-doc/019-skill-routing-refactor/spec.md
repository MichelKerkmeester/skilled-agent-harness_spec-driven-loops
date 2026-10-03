---
title: "Feature Specification: Authored compiled-routing source home"
description: "This folder holds the authored copy of the compiled-routing runtime closure that compiled-route-layout.cjs pins by path and the pre-commit route re-mint writes into. The router program's packet history moved to z_archive/019-skill-routing-refactor; this record states what the folder is, who writes it and how to move it safely."
trigger_phrases:
  - "authored compiled-routing source"
  - "router program authored copy"
  - "compiled route layout pin"
  - "route re-mint authored manifest"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Authored compiled-routing source home

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-03 |
| **Branch** | `worktrees/079-doctor-command-audit` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`specs/sk-doc/019-skill-routing-refactor/` sits in the spec tree under a packet number but carries no spec documents. It holds `015-router-unification-program/`, the authored copy of the compiled-routing runtime closure: 127 tracked files across seven program stages, 48 of them the activation manifests under `013-live-activation/activation/`. The router program's own packet record moved to `specs/sk-doc/z_archive/019-skill-routing-refactor/`, but this folder could not move with it, because `.skilled/bin/lib/compiled-route-layout.cjs` names it as `AUTHORED_PROGRAM_DIR`. Without spec documents it fails strict validation as a Level 1 folder missing `spec.md`, `plan.md` and `tasks.md`, and the sk-doc track lists it as a child it cannot describe.

### Purpose

Record what the folder is, which tools read and write it, and where its history lives, so it validates as the custodian of a live path rather than as a broken packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Spec documents at the folder root that describe the authored routing source and its writers.
- Generated `description.json` and `graph-metadata.json` for the folder.

### Out of Scope

- Any change under `015-router-unification-program/`. It is live input to compiled routing.
- Moving the authored source out of the spec tree. That changes `compiled-route-layout.cjs`, the pre-commit re-mint, the import guard's sanctioned exception and their tests together.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/sk-doc/019-skill-routing-refactor/spec.md` | Create | This specification |
| `specs/sk-doc/019-skill-routing-refactor/plan.md` | Create | How the folder is maintained |
| `specs/sk-doc/019-skill-routing-refactor/tasks.md` | Create | The custodian record's tasks |
| `specs/sk-doc/019-skill-routing-refactor/implementation-summary.md` | Create | What this record establishes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | The record names the folder's readers and writers | `spec.md` and `plan.md` cite `compiled-route-layout.cjs`, the pre-commit route re-mint and `serving-closure.manifest.json` |
| REQ-002 | Nothing under `015-router-unification-program/` changes | `git status` shows no change below that folder |
| REQ-003 | The folder validates | `validate.sh specs/sk-doc/019-skill-routing-refactor --strict` prints `RESULT: PASSED` |
| REQ-004 | Compiled routing is unaffected | `node .skilled/bin/compiled-route-guard.cjs` reports all hubs fresh or excused |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Strict validation of the folder prints `RESULT: PASSED`.
- **SC-002**: The compiled-route guard and the no-spec-imports guard pass unchanged.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A later edit treats `015-router-unification-program/` as packet documents | High | Plan and summary state that it is live routing input and only the route re-mint writes it |
| Dependency | `compiled-route-layout.cjs` `AUTHORED_PROGRAM_DIR` | High | Moving this folder means updating that constant, the pre-commit hook and their tests together |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
