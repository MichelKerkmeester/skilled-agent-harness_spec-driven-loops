---
title: "Feature Specification: Phase 30: cursor-reconcile-test-exemption"
description: "Spec-Kit Check was red on main because the Cursor half of the hook adapter parity test required a drift-marker fallback on the backgrounded reconcile hook, a command the Claude half already exempts."
trigger_phrases:
  - "cursor reconcile hook test exemption"
  - "hook adapter path parity cursor"
  - "backgrounded reconcile drift marker"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 30: cursor-reconcile-test-exemption

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-05 |
| **Branch** | `worktrees/079-doctor-command-audit` |
| **Parent Spec** | ../spec.md |
| **Phase** | 30 of 30 |
| **Predecessor** | 029-main-ci-regenerations |
| **Successor** | None |
| **Handoff Criteria** | Spec-Kit Check passes on main |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 30** of the doctor audit follow-ups. Commit `7d687d9796` brought the live-sync hooks to Cursor, including the backgrounded `git-primary-reconcile.sh` command Claude and Codex already run. Spec-Kit Check has failed on that one test since. The operator approved fixing it.

**Scope Boundary**: One line in `system-spec-kit/runtime/tests/hook-adapter-path-parity.vitest.ts`. The Cursor hook config is unchanged.

**Dependencies**:
- `isBackgroundedReconcile` in the same test, which names the reconcile command as a deliberate exception
- `.cursor/hooks.json`, which registers the backgrounded reconcile command

**Deliverables**:
- The Cursor drift-marker assertion skips the backgrounded reconcile command, as the Claude assertion does

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The reconcile command runs in the background with `&`, and no host reads its output, so it carries no fallback branch on purpose. The test's comment says so and the Claude assertion skips it. The Cursor assertion did not, so the command Cursor gained in `7d687d9796` failed it.

### Purpose
Hold Cursor to the same drift-marker rule as Claude, exception included.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Apply `isBackgroundedReconcile` in the Cursor assertion

### Out of Scope
- Changing the reconcile command or giving it a fallback branch
- Any other hook test

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `system-spec-kit/runtime/tests/hook-adapter-path-parity.vitest.ts` | Modify | Skip the backgrounded reconcile command in the Cursor assertion |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The parity test passes | 119 of 119 in the file |
| REQ-002 | Every other Cursor command is still held to the rule | Only the backgrounded reconcile command is skipped |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The runtime project passes as CI runs it | `vitest --project root` reports no failures |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Spec-Kit Check passes on main.
- **SC-002**: The runtime project moves from 1 failure to 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The skip hides a Cursor command that lost its fallback | Low | The skip matches only a command naming `git-primary-reconcile.sh` and containing `&` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

