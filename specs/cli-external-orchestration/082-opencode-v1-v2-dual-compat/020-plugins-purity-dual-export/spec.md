---
title: "Feature Specification: Phase 20: plugins-purity-dual-export"
description: "The CI Spec-Kit Check was red on main because its Runtime vitest project step, running for the first time in a while, reported the plugins purity test failing every dual-export plugin as a plain hook object. This phase teaches the test to recognise the dual OpenCode export instead of changing any plugin, and records the local proof of the repaired step."
trigger_phrases:
  - "plugins purity dual export"
  - "phase 20 plugins purity dual export"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 20: plugins-purity-dual-export

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-20 |
| **Branch** | `scaffold/020-plugins-purity-dual-export` |
| **Parent Spec** | ../spec.md |
| **Phase** | 20 of 20 |
| **Predecessor** | 019-plugins-compat-docs |
| **Successor** | None |
| **Handoff Criteria** | The purity test recognises the dual OpenCode export, and the Runtime vitest project passes locally |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 20** of the Let the plugins purity test load the dual OpenCode export specification — the last red Spec-Kit Check step.

**Scope Boundary**: The purity test `.skilled/skills/system-spec-kit/runtime/tests/opencode-plugins-folder-purity.vitest.ts`, this folder's records and the parent phase map row. No plugin file changes.

**Dependencies**:
- `scratch/facts.md` in this folder, the record that names a source for every fact this phase claims.
- The red main evidence: CI Spec-Kit Check at commit `22f563b032` (run `39373558502`), the mask chain through `47371b495f` and the dual-export commit `f7b54c52db`.

**Deliverables**:
- The purity test recognising the dual OpenCode export.
- This folder's spec, plan, tasks and implementation summary, and the parent phase map rows.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The CI Spec-Kit Check failed on main commit `22f563b032` (run `39373558502`) in its Runtime vitest project step: `runtime/tests/opencode-plugins-folder-purity.vitest.ts` reported `.skilled/plugins/classifier-injection-screen.js object default export has no recognized OpenCode hook keys`, with 1 failed, 108 passed and 3 skipped test files. The step surfaced only now: the job stops at its first failing step, and the earlier CLI vitest project step had failed on every main run since `47371b495f`, so the Runtime step did not run until `22f563b032` repaired the CLI step — and `f7b54c52db` is not an ancestor of `47371b495f`, so it reached main after the CLI step was already red. Under `f7b54c52db` the mechanical plugins default-export `dualPlugin(id, server)` from `.opencode/plugins/lib/v2-bridge.js`, an object `{ id, server, setup }` where `server` is the v1 factory the host calls; the purity test treats any object default export as a hook object, so every dual plugin fails it, and classifier-injection-screen.js is reported because it is the first file in sorted order.

### Purpose
The plugins purity test recognises the dual OpenCode export — requiring `setup` alongside `server`, calling `server({})` and requiring a recognised OpenCode hook key on the returned object, the same way commit `27763681f7` made the session-relaunch conformance suite call `default.server` — so the Runtime vitest project step that was red on main passes locally.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `.skilled/skills/system-spec-kit/runtime/tests/opencode-plugins-folder-purity.vitest.ts` (modified): a dual-export branch that requires `setup`, calls `server({})` and requires a recognised OpenCode hook key on the returned object.
- The local proof recorded under `scratch/`: the reproduced failure, the three mutation-probe runs, the passing purity test and the passing Runtime vitest project.
- This folder's spec, plan, tasks and implementation summary, and the parent phase map rows.

### Out of Scope
- Any change under `.opencode/plugins/` - the dual export is the shape the bridge ships, so the fix lives in the test that reads it, not in the plugins.
- A green Spec-Kit Check claim on main - only a local pass is proven so far; a CI run on main has not shown it green yet.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/tests/opencode-plugins-folder-purity.vitest.ts` | Modify | Recognise the dual export: require `setup`, call `server({})` and require a recognised hook key on the returned object, leaving the plain factory and plain hook-object branches unchanged |
| `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/020-plugins-purity-dual-export/spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Modify | This folder's records, filled from the scaffold |
| `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/spec.md` | Modify | The phase 20 row and the 019-to-020 handoff row in the phase map |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The purity test recognises the dual OpenCode export and keeps its existing branches. | When the default export has a `server` function, the test requires a `setup` function, calls `server({})` and requires the returned object to carry a recognised OpenCode hook key; the plain factory and plain hook-object branches are unchanged, and no plugin changed. |
| REQ-002 | The failure is reproduced before the fix and passes after it. | `scratch/before/plugins-purity-vitest.txt` shows 1 failed, exit 1, and `scratch/after/plugins-purity-vitest.txt` shows 1 of 1 passed, exit 0. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The test still rejects a dual plugin whose server factory returns no hook key, and still rejects hook-less object exports. | Three temporary `.opencode/plugins/zz-mutation-probe.js` files, each deleted after its run, made the fixed test fail with exit 1: a dual export whose `server` returns no hook keys failed with "dual plugin server factory returned no recognized OpenCode hook keys" (`scratch/after/mutation-dual-server-no-hooks.txt`); a dual-shaped object missing `server` (`scratch/after/mutation-dual-missing-server.txt`) and a plain object with no hook keys (`scratch/after/mutation-plain-object-no-hooks.txt`) both failed with "object default export has no recognized OpenCode hook keys". |
| REQ-004 | The whole Runtime vitest project passes locally. | 109 test files passed, 3 skipped; 1333 tests passed, 13 skipped; exit 0 (`scratch/after/runtime-project-summary.txt`). |
| REQ-005 | Every record states the main status honestly. | Spec-Kit Check was red on main at `22f563b032` and is proven only locally so far; no record claims a green CI run on main. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every requirement REQ-001 to REQ-005 is checked with recorded evidence in this folder.
- **SC-002**: The Runtime vitest project — the Spec-Kit Check step red on main — passes locally with the recorded counts.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `scratch/facts.md` and its recorded runs | The claims about main's red run and the masking chain would rest on memory | Every fact cites its evidence in `scratch/facts.md` |
| Risk | The dual-export branch could admit an object that calls through to no hook | Med | The mutation probes prove the branch rejects a server factory returning no recognised hook key, and that hook-less object exports still fail (`scratch/after/mutation-dual-server-no-hooks.txt`, `scratch/after/mutation-dual-missing-server.txt`, `scratch/after/mutation-plain-object-no-hooks.txt`) |
| Risk | A future reader takes the local pass for a green main run | Low | Every record says Spec-Kit Check was red on main and is proven only locally |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None left open. The dispatch fixed the scope, and `scratch/facts.md` answered what the test must accept and how the fix is proven.
<!-- /ANCHOR:questions -->

---

