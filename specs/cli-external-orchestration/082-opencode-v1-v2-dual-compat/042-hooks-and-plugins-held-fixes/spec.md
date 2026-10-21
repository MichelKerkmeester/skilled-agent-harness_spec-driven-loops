---
title: "Feature Specification: Phase 42: hooks-and-plugins-held-fixes"
description: "Phase 039 held sixteen hook and plugin findings because each fix changes behaviour, and the operator chose to fix all of them. They cover the relaunch killer, the post-edit secret scrubber, the task-dispatch loop guard, the git hook installer, the Cursor route-guard adapter, the shared stdin reader and five OpenCode plugins."
trigger_phrases:
  - "hooks and plugins held fixes"
  - "phase 42 hooks and plugins held fixes"
  - "039 held findings"
  - "bearer token redaction"
  - "stdin byte cap"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 42: hooks-and-plugins-held-fixes

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-10-21 |
| **Branch** | `worktrees/184-hooks-and-plugins-held-fixes` |
| **Parent Spec** | ../spec.md |
| **Phase** | 42 of 42 |
| **Predecessor** | 039-sk-code-opencode-alignment-audit |
| **Successor** | None |
| **Handoff Criteria** | Every finding below is fixed with a test that fails without its fix, and CI passes at the pushed commit |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 42** of the OpenCode v1 and v2 dual compatibility specification. It fixes the findings phase 039 held for the operator outside the dispatch lint and the goal files, which other phases own.

**Scope Boundary**: the files named in Files to Change and their tests. The dispatch-lint files (`.skilled/hooks/dispatch/**`) and the goal files (`opencode-goal.js`, `.skilled/hooks/goal/**`) are out of bounds here.

**Dependencies**:
- `../039-sk-code-opencode-alignment-audit/review.md` section 3, which holds the full text of each finding.

**Deliverables**:
- One fix per finding, each with a test that fails without the fix.
- A before and after measurement for each performance finding.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 039 confirmed seven P1 and nine P2 findings in the hook tree and the OpenCode plugins whose fixes change behaviour, so it held them. Among them: the relaunch killer can disarm a newer arm, the post-edit scrubber leaves `Bearer` tokens readable, the task-dispatch guard trusts a config anywhere on disk and loses counts under concurrency, the git hook installer aborts in a linked worktree, and the shared stdin reader keeps an unbounded payload in memory.

### Purpose
Each finding is fixed, and a test proves the fix by failing on the old code.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- P1: b05-relaunch-lib-N01, b10-hooks-quality-screen-task-012, -016 and -017, b11-hooks-shared-and-small-011, -016 and -N01.
- P2: b02-plugins-rest-007, -012, -N03, -N04 and -N05, b05-relaunch-lib-002, b10-hooks-quality-screen-task-009 and -010, b11-hooks-shared-and-small-018.

### Out of Scope
- The dispatch-lint and goal findings from the same table, which their own phases fix.
- Any change to a hook contract other than the one each finding names.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/lib/killer.cjs` | Modify | Unarm the hop-cap and stale records only when their arm time still matches |
| `.skilled/hooks/session-relaunch/lib/hop-history.cjs` | Modify | Treat `last` as a non-negative count |
| `.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs` | Modify | Redact `Bearer` tokens |
| `.skilled/hooks/post-edit-quality/codex/post-edit-quality.cjs`, `devin/post-edit-quality.cjs` | Modify | Pick the first string path field |
| `.skilled/hooks/task-dispatch/lib/dispatch-guard.cjs` | Modify | Keep the config inside the project and serialise the loop count |
| `.skilled/hooks/git/install-hooks.sh` | Modify | Resolve the hooks folder through git |
| `.skilled/hooks/mcp-route-guard/cursor/mcp-route-guard.mjs`, `lib/mcp-route-guard.cjs` | Modify | Resolve the child from the adapter's own folder; accept every truthy kill-switch value |
| `.skilled/hooks/shared/hook-adapter-shared.cjs` | Modify | Cap the bytes `readStdin` keeps |
| `.opencode/plugins/session-relaunch.js`, `system-spec-gate.js`, `system-skill-advisor.js`, `session-cleanup.js` | Modify | The four plugin findings |
| Tests beside each file | Modify or Create | One failing-first test per finding |
| `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/042-hooks-and-plugins-held-fixes/` | Create | This packet |
| `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/spec.md`, `graph-metadata.json` | Modify | Phase map, handoff row and child list for 042 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each of the seven P1 findings is fixed. | Each has a test that passes on the fix and fails when the fix is reverted. |
| REQ-002 | No suite regresses. | The plugin suite (481), hook node:test (836), hook vitest (217) and battery unit (51) suites pass at or above those counts. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Each of the nine P2 findings is fixed. | Each has a test that fails when the fix is reverted; the two performance findings also have a before and after measurement. |
| REQ-004 | The touched plugins still show their effect live. | The session-relaunch, session-cleanup, system-skill-advisor and system-spec-gate playbook scenarios pass on OpenCode 1.19.3 and 2.0.32. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every finding in scope has a fix commit and a test, listed in `implementation-summary.md`.
- **SC-002**: CI passes at the pushed main commit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A stdin cap smaller than a real payload drops a hook's input | High | Measure the largest real payloads and set the cap well above them; an over-cap read fails open |
| Risk | Running session-cleanup's guards in the background delays their warning past the first prompt | Med | The system transform waits for that session's guards, bounded by the guard timeout |
| Risk | A loop-count lock left by a killed process stalls later dispatches | Med | The lock has a short wait and a stale timeout, and the guard fails open without it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator approved every behaviour change in scope.
<!-- /ANCHOR:questions -->

---
