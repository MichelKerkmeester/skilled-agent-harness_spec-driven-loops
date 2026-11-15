---
title: "Feature Specification: Let a second copy of the Pi fast-mode extension stand down, so cli-pi runs from a git worktree"
description: "Every Pi run started in a git worktree of this repo exits 1 before it reaches the model, because the fast-mode extension loads twice and both copies register the --fast flag. The first copy in a load now claims the package on the load's shared event bus, and any later copy registers nothing."
trigger_phrases:
  - "cli pi worktree extension clash"
  - "let the pi fast mode extension stand down"
  - "flag --fast conflicts with"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Let a second copy of the Pi fast-mode extension stand down, so cli-pi runs from a git worktree

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-19 |
| **Branch** | `worktrees/146-cli-pi-worktree-extension-clash` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A cli-pi dispatch started inside a git worktree of this repo exits 1 before it reaches the model: `Failed to load extension ".../.pi/agent/extensions/pi-fast-mode-w-subagent-support/src/index.ts": Flag "--fast" conflicts with <worktree>/.pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts`. The operator's user-scope extension directory links to the main checkout's copy, and the worktree auto-discovers its own copy. Pi drops duplicates only by canonical real path (`mergePaths` in its resource loader), so in the main checkout the two collapse to one, while in a worktree they are two extensions that both register `--fast`, and Pi treats that as a load error. Deep-loop children on the cli-pi executor, the cli-pi kit and an interactive Pi session in a worktree all fail the same way.

### Purpose
A Pi run from any checkout of this repo registers exactly one fast-mode copy once every copy it loads carries the fix, with no change to the operator's global Pi install or links.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A guard in the fast-mode extension: the first copy in a load claims the package on `pi.events`, the bus Pi gives every extension in that load, and a later copy that sees the claim registers no flag, command or handler.
- Unit tests for the guard, test fakes with a synchronous bus, and the test README count.
- A live proof through the real cli-pi argv builder from a worktree, and a control run from the main checkout.

### Out of Scope
- The cli-pi argv builder in `fanout-run.cjs`. Pi offers only `--no-extensions` (all or nothing) plus explicit `-e` paths, and no project setting can disable a user-scope auto-discovered extension, so a builder fix would have to re-implement Pi's loader. Left unchanged.
- The operator's `~/.pi/agent/extensions` link and global settings. Not ours to change.
- Choosing the winner by working directory. Pi resolves resources against the session's cwd, which `--session`, `--resume` and in-process session switches can move away from `process.cwd()`, and the extension API exposes neither at load time, so a cwd check could leave no copy registered (found in review).
- A copy without the guard. It never claims, so a worktree whose branch predates this change still fails once `main` has it, until that branch takes the change.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts` | Modify | `claimPackage` and the early return in the factory |
| `.pi/extensions/pi-fast-mode-w-subagent-support/tests/extension.test.ts` | Modify | A synchronous fake bus and three second-copy tests |
| `.pi/extensions/pi-fast-mode-w-subagent-support/tests/precedence.test.ts` | Modify | The same fake bus |
| `.pi/extensions/pi-fast-mode-w-subagent-support/tests/README.md` | Modify | Test count |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | When another copy of the package has already loaded in the same Pi load, a copy registers no flag, command or event handler. |
| REQ-002 | The first copy in a load, and a copy in a load of its own, registers exactly as before. A copy loading after Pi cleared a stale load's listeners registers. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | A cli-pi dispatch built by `fanout-run.cjs`, run from a worktree with two fixed copies installed, exits 0 with the expected reply, the same run with an unfixed second copy still exits 1, and the main checkout run still exits 0. |
| REQ-004 | The extension's tests and typecheck, `fanout-run.vitest.ts` and the deep-loop suite stay at or above their baselines. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The worktree reproduction that exits 1 today exits 0 with `PI-OK` once both copies carry the guard.
- **SC-002**: No suite drops below its baseline.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The operator's global link targets the main checkout's copy | The guard must run in that copy, so worktrees keep failing until this change reaches `main` | Stated in the implementation summary. The live proof uses a temporary `PI_CODING_AGENT_DIR` overlay holding a second fixed copy |
| Risk | The first copy is not the project's own (Pi's pre-trust pass loads user extensions first) | Low: the other checkout's copy of the same package serves the session | Pi's own conflict rule is load order; print mode loads the project copy first (`scratch/smoke-*.json`) |
| Risk | A copy without the guard loads beside a fixed one | Med: the load still fails, as today | Out of scope; the branch takes the change |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The check is one synchronous event emit at load, with no file or network access.
- **NFR-P02**: No work is added to per-request hooks.

### Security
- **NFR-S01**: The check reads no file and executes nothing.
- **NFR-S02**: No secret or environment value is read or logged.

### Reliability
- **NFR-R01**: With no other copy listening, the check passes and the copy registers as it does today.
- **NFR-R02**: The guard never throws during extension load.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- One copy only: no listener answers the probe, so it registers.
- Two copies in one load: the first registers, the second registers nothing.
- A probe payload that is not an object: the listener leaves it alone.

### Error Scenarios
- The user-scope link resolves to the project copy itself (the main checkout): Pi loads one path only, so the guard never sees a second copy.
- A copy without the guard: it registers whatever the other does, so the load fails as before.
- A copy that throws after claiming: Pi discards that copy's load-time listeners, so the claim goes with it.

### State Transitions
- `/reload`: Pi invalidates the old runtime, which drops its listeners, before loading again, so the first copy claims afresh.
- Session switch: the old runtime is torn down and the new one gets its own resource loader and bus.
- Pre-trust pass: user extensions load first in the same bus, so a user copy can be the one that serves the session.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | One source file and two test files, about 25 source lines |
| Risk | 8/25 | Runs at every Pi start in this repo; failure mode is a missing Fast Mode, not a crash |
| Research | 12/20 | Pi's loader dedup, conflict, event-bus and session-cwd rules, read from its installed source |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None open. The builder-side and cwd-based alternatives are ruled out in Out of Scope.
<!-- /ANCHOR:questions -->

---
