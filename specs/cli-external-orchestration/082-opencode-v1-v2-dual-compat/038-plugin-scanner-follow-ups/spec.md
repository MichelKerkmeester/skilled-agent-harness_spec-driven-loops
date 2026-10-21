---
title: "Feature Specification: Phase 38: plugin-scanner-follow-ups"
description: "The plugin event scanner rebuilt in phase 031 misses a helper's result stored in a variable and tested later, reads any parameter named type as the event type, and reaches its parser only through vitest's vite. Phase 024 also left two undated ordinals in the plugin tree. This phase closes them and re-checks the 024 limits the AST scanner may already close."
trigger_phrases:
  - "plugin scanner follow ups"
  - "phase 38 plugin scanner follow ups"
  - "event scanner data flow"
  - "type parameter false positive"
  - "rolldown direct dependency"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 38: plugin-scanner-follow-ups

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-21 |
| **Branch** | `worktrees/180-plugin-scanner-follow-ups` |
| **Parent Spec** | ../spec.md |
| **Phase** | 38 of 38 |
| **Predecessor** | 037-ci-pi-and-provisioning-follow-ups |
| **Successor** | None |
| **Handoff Criteria** | The plugin tests pass on CI at the pushed commit, and the scan of every bridged plugin is unchanged |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 38** of the OpenCode v1 and v2 dual compatibility specification. It closes the scanner follow-ups that phases 024 and 031 recorded and the open-work goal of 2026-10-20 assigned to one group.

**Scope Boundary**: `.opencode/plugins/tests/helpers/plugin-inventory.cjs`, `.opencode/plugins/tests/plugin-inventory.test.cjs`, `.opencode/plugins/ARCHITECTURE.md`, `.opencode/plugins/tests/README.md` where it states the limits, `.skilled/package.json` and `.skilled/package-lock.json` for the rolldown entry, and this packet. The plugins and the manifest stay as they are unless the scan of a plugin changes, which this phase must not do.

**Dependencies**:
- `../024-plugin-inventory-guards/`, which added the event guard and recorded its P2s and limits.
- `../031-plugin-scanner-ast/`, which rebuilt the scanner on the rolldown AST and recorded the data-flow, `type`-name and parser-source limits.
- `../032-plugin-tests-ci-and-stale-bundles/`, whose plugin-test workflow installs the `.skilled` tree the parser comes from.

**Deliverables**:
- A scan that reports a helper's result stored in a variable and later tested.
- A scan that does not read a `type` parameter as the event type when every call in the file passes a non-event value.
- rolldown declared in `.skilled/package.json` at the version already locked.
- Dated or derived ordinals in the plugin tree, and limits that match what the scanner does.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The event guard in `plugin-inventory.cjs` reports a helper that receives the event type only when the call sits in a branch test, so `const ok = isKnown(eventType); if (ok) {}` decides a branch the scan never reports. Any identifier named `type` or ending in `Type` counts as the event type, so a helper parameter `type` that only ever receives an unrelated value is still read as one. The parser is resolved from `.skilled/node_modules`, where rolldown is present only as vite's dependency, so an update to vitest or vite can remove it. `ARCHITECTURE.md` describes the plugin tree with "the 15 below" and "the 17th entry", which go stale when a plugin is added. Phase 024 also listed escaped names, check text in strings, case labels under unrelated switches and changed collections as limits; the AST scanner may already close them.

### Purpose
Each follow-up is fixed with a fixture that fails on the old helper, or shown to be closed already, or recorded with the reason it stays.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Follow a helper call's result through `const`, `let` and plain assignment into later tests, including one alias of that result, and report the call.
- Read a parameter named `type` or ending in `Type` as the event type unless every call of its function in the file passes a value that is not the event type.
- Declare rolldown in `.skilled/package.json` at the locked version, with a lockfile change limited to that entry.
- Re-check the 024 limits against fixtures and update the documented limits.
- Replace the two fixed ordinals in the plugin tree.

### Out of Scope
- Following values across files, through returns or through object properties.
- Changing any plugin or the manifest.
- Adding any package that is not already in the `.skilled` tree.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/tests/helpers/plugin-inventory.cjs` | Modify | Stored helper results and the `type` parameter rule |
| `.opencode/plugins/tests/plugin-inventory.test.cjs` | Modify | Fixtures for both rules |
| `.opencode/plugins/ARCHITECTURE.md` | Modify | Tree ordinals and the guard's limits |
| `.opencode/plugins/tests/README.md` | Modify | Only where it states the guard's limits |
| `.skilled/package.json`, `.skilled/package-lock.json` | Modify | rolldown as a direct dev dependency |
| `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/038-plugin-scanner-follow-ups/` | Create | This packet |
| `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/spec.md` | Modify | Phase map row and handoff row for 038 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A helper call that receives the event type and whose result is stored and later decides a branch is reported. | Fixtures for `const`, `let` with a later assignment and one alias are reported by the new helper and missed by the old one. |
| REQ-002 | The scan of every bridged plugin is unchanged. | `handledEventNames` and `unscannedEventChecks` give identical output before and after for every bridged plugin. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | A `type` parameter whose every in-file call passes a non-event value is not the event type; one with no call in the file, or any call passing the event type, still is. | Fixtures for all three cases; the first fails on the old helper. |
| REQ-004 | rolldown is a direct dev dependency at the locked version. | `.skilled/package.json` lists `rolldown` at 1.2.12 exactly; `npm ci` in `.skilled` installs it and the plugin suite passes. |
| REQ-005 | The documented limits match the scanner. | Each 024 limit has a fixture showing it closed, or stays listed; the tree uses no fixed ordinal. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The plugin tests pass on CI at the pushed commit.
- **SC-002**: Each new rule has a fixture that fails on the old helper.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A stored-result rule reports ordinary logging in a real plugin | Med | Compare every bridged plugin's scan before and after |
| Risk | `npm install` rewrites unrelated lockfile entries | Med | Check that the lock diff touches only the root entry and rolldown's dev or peer flags |
| Dependency | The plugin-test workflow installs the `.skilled` dev dependencies | Low | Confirm its provisioning step runs `npm ci` there |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
