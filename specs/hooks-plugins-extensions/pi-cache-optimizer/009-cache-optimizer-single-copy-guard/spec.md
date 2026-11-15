---
title: "Feature Specification: Let a second pi-cache-optimizer copy stand down so pi starts in git worktrees"
description: "Pi refuses to start in any git worktree, because a user-level pi-cache-optimizer link and the worktree's own copy both register the edit_lines tool. The first copy in a load now claims the package and a copy at another real path registers nothing."
trigger_phrases:
  - "cache optimizer single copy guard"
  - "let a second pi cache optimizer copy stand"
  - "edit_lines conflicts with"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Let a second pi-cache-optimizer copy stand down so pi starts in git worktrees

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-28 |
| **Branch** | `worktrees/217-weak-model-spec-authoring` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A user-level link `~/.pi/agent/extensions/pi-cache-optimizer`, added on 2026-10-28, loads the extension in every project and resolves to the main checkout's copy. In a git worktree, Pi also loads the worktree's own `.pi/extensions/pi-cache-optimizer`, so two copies at different real paths both register `edit_lines`, and Pi exits before it reaches the model. Every Pi run in a worktree, including cli-pi dispatches, needs `-ne` until this is fixed.

### Purpose
Pi starts in a git worktree with all extensions loaded, and the main checkout behaves as before.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ cd .worktrees/217-weak-model-spec-authoring && pi -p "Reply with the single word OK." --model llmgateway/deepseek-v4.1-flash-1017 --thinking low --mode text --offline </dev/null
Error: Failed to load extension "/Users/michelkerkmeester/.pi/agent/extensions/pi-cache-optimizer/index.ts": Tool "edit_lines" conflicts with /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/217-weak-model-spec-authoring/.pi/extensions/pi-cache-optimizer/index.ts
Hint: Start without extensions using "pi -ne".
$ cd <main checkout> && pi -p "Reply with the single word OK." ... </dev/null
OK
```
Pi's `detectExtensionConflicts` reports a tool when two extension paths register it, and treats copies at one real path as one owner. `pi-fast-mode-w-subagent-support` met the same failure for its `--fast` flag and fixed it on 2026-10-19 with a copy claim on Pi's event bus.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Claim the package on Pi's shared event bus in the extension's entry point, so a copy at another real path registers nothing.
- Expose `createPiCacheOptimizerExtension(packageRoot)` so a test can load two copies at chosen roots.
- Add a test for a copy standing down and for two copies at one real path both registering.
- Record the change in `CHANGES-FROM-UPSTREAM.md`.

### Out of Scope
- Removing the user-level link - it is the operator's deliberate setup, and it lets the extension load in every project.
- Changing any cache behavior - the registration body moves unchanged.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/extensions/pi-cache-optimizer/index.ts` | Modify | Copy claim and guarded entry point |
| `.pi/extensions/pi-cache-optimizer/tests/copy-claim.test.ts` | Create | Two-copy tests |
| `.pi/extensions/pi-cache-optimizer/CHANGES-FROM-UPSTREAM.md` | Modify | Fork change record |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | When two copies at different real paths load in one Pi process, only the first registers its tool, command and hooks. | `tests/copy-claim.test.ts` "a copy at another real path stands down" passes |
| REQ-002 | Two copies at one real path both register, so the main checkout keeps working. | The "two copies at one real path both register" test passes, and Pi in the main checkout prints `OK` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | No existing behavior changes. | `npm test` passes every earlier test and `npm run typecheck` exits 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A Pi run from a worktree, with a user-level link to a second guarded copy, loads without an extension conflict.
- **SC-002**: `npm test` in the extension prints `fail 0`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Both copies must carry the claim | Until the main checkout has this code, its copy registers regardless and the worktree conflict remains | Ship to `main`; the main checkout's next update completes the fix |
| Risk | The wrong copy wins in a worktree | Low | Both copies hold the same code once on `main`, and a branch that changes the extension still runs its own tests through `npm test` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
