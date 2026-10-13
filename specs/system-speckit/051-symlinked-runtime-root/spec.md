---
title: "Feature Specification: Symlinked runtime: entry guard, project root and empty saves"
description: "A repository that links .skilled from the shared runtime cannot save context. Without the symlink flag the project root resolves to the runtime's own repository, and with the flag the entry guard turns every generator into a silent exit 0."
trigger_phrases:
  - "symlinked runtime root"
  - "symlinked runtime entry guard project root and empty"
  - "preserve-symlinks-main silent exit 0"
  - "project root resolves to code environment"
  - "divergent-duplicate save block linked skilled"
  - "empty exchanges save succeeds"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Symlinked runtime: entry guard, project root and empty saves

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-10-12 |
| **Branch** | `scaffold/051-symlinked-runtime-root` |
| **Related** | `system-speckit/033-system-speckit-v4/039-entry-point-symlink-resolution`, whose fix covers the case without the flag |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Consuming repositories reach the spec-kit runtime through a `.skilled` symlink into the shared runtime repository. Two defects meet there, and each one blocks the only way around the other.

The project root is derived from the script's own location. `.skilled/skills/system-spec-kit/runtime/cli/core/config.ts:15` takes the module directory and `:299` walks five levels up from it. Node resolves the module through the symlink, so from `AI Systems` the root comes out as `Code_Environment/Public`. Imported from `AI Systems` on 2026-10-12, `CONFIG.PROJECT_ROOT` printed `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`. The save then looks for the packet under the wrong root, finds it in neither spec root, and `.skilled/skills/system-spec-kit/runtime/cli/core/spec-root-collision-classifier.ts:168-169` classifies an absent packet as `divergent-duplicate`, which `.skilled/skills/system-spec-kit/runtime/cli/core/spec-root-write-guard.ts:30-38` refuses.

`node --preserve-symlinks-main` keeps the linked path and so the right root. Under that flag the entry guard fails instead. `isMainModule` at `.skilled/skills/system-spec-kit/runtime/cli/lib/esm-entry.ts:26-41` canonicalizes only the launch path, at `:32-38`, while its comment at `:12` says both sides are canonicalized. With the flag, `import.meta.url` keeps the linked path, the two sides differ, and the script does nothing. From `AI Systems` on 2026-10-12, `generate-description.js` with no arguments printed its usage and exited 1. The same call with the flag printed 0 bytes and exited 0. `generate-context.js --not-an-option` exited 1 with an error, and with the flag printed 0 bytes and exited 0.

A third defect hides the damage when a save does run. An input with no exchanges scores 0/100 on content quality, and `.skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts:1517-1520` only logs a warning. The save goes on and exits 0.

### Purpose
A save run from a repository that links `.skilled` resolves that repository as its root and does its work, and a save with nothing in it does not report success.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Canonicalize both sides in `isMainModule`, in all three copies the earlier packet created, so the guard holds with and without `--preserve-symlinks-main`
- Resolve the project root from the working directory's git top-level, or from an explicit `--project-root`, instead of the script's location
- Decide between refusing an empty-exchanges save and a loud warning with a non-zero exit, and implement the choice
- Tests that run each case through a real symlink, from a temp repository that links `.skilled`

### Out of Scope
- How consuming repositories link `.skilled`. The link stays as it is.
- The collision classifier's name for an absent packet. It is misleading, but fixing the root removes the case that reaches it here.
- Template and asset paths derived from the script location. Those belong to the runtime, so resolving them from the script is correct.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/lib/esm-entry.ts` | Modify | Canonicalize `import.meta.url` as well as the launch path |
| `.skilled/skills/system-spec-kit/runtime/lib/esm-entry.ts` | Modify | Same change in the runtime workspace copy |
| `.skilled/skills/system-spec-kit/runtime/cli/lib/esm-entry.mjs` | Modify | Same change in the plain-JavaScript copy |
| `.skilled/skills/system-spec-kit/runtime/cli/core/config.ts` | Modify | Derive `PROJECT_ROOT` from the caller's repository at `:299` |
| `.skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts` | Modify | Accept `--project-root` and pass it to `main` at `:1130-1139`, and act on the empty-exchanges decision |
| `.skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts` | Modify | Turn the 0/100 warning at `:1517-1520` into the chosen refusal or non-zero exit |
| `.skilled/skills/system-spec-kit/runtime/tests/esm-entry-symlink.vitest.ts` | Modify | Cases under `--preserve-symlinks-main` |
| A new test beside the existing generate-context tests | Create | A save from a temp repository that links `.skilled` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `isMainModule` returns true for the entrypoint and false for an import, launched through a symlink with or without `--preserve-symlinks-main` |
| REQ-002 | A save run from a repository that links `.skilled` resolves that repository as its project root and writes to its packet |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | An explicit `--project-root` overrides the derived root |
| REQ-004 | A save whose input holds no exchanges either refuses with a non-zero exit or writes and exits non-zero with a warning naming the empty input |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `generate-description.js` and `generate-context.js` launched with `--preserve-symlinks-main` through `.skilled` produce the same output and exit code as without the flag
- **SC-002**: The spec-kit suite passes from the final state, with the delta accounted for by the added cases
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `git` on the path for the top-level lookup | Root cannot be found outside a repository | Fall back to the current directory, then to the script-derived root, and name which one was used on stderr |
| Risk | A caller relies on the root being the runtime repository | High | Inventory every reader of `CONFIG.PROJECT_ROOT` and split the runtime-owned paths from the project-owned ones before changing it |
| Risk | Refusing empty saves breaks a hook that saves on every turn | Med | Measure how often hooks save with no exchanges before choosing refuse over warn |
| Risk | Canonicalizing `import.meta.url` throws on an odd URL | Low | Fall back to the unresolved comparison, as the launch side already does |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: One added `realpath` and at most one `git rev-parse` per process start

### Security
- **NFR-S01**: A `--project-root` outside the working directory's repository is refused rather than written to

### Reliability
- **NFR-R01**: The entry guard never raises. A resolution failure returns the conservative answer.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Working directory is a subfolder of the consuming repository: the git top-level, not the subfolder, is the root
- Working directory is a git worktree: the worktree's top-level is the root
- Input with exchanges but no other content: not empty, the existing quality gates apply

### Error Scenarios
- Working directory outside any repository: fall back as named in the risks, and say so on stderr
- `--project-root` pointing at a missing directory: refuse with a non-zero exit

### State Transitions
- Run from inside the runtime repository itself: the root stays `Code_Environment/Public`, so the existing behavior there is unchanged
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Three helper copies, config, the save entry and the workflow, plus tests |
| Risk | 15/25 | The project root feeds every spec-folder write |
| Research | 6/20 | All three defects are located, the reader inventory of the root remains |
| **Total** | **33/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Refuse an empty-exchanges save, or write it and exit non-zero with a warning? Refusing is simpler and loses nothing a reader needs. Warning keeps hooks that save every turn from failing loudly. Decide after counting empty saves in recent hook logs.
- Does any reader of `CONFIG.PROJECT_ROOT` mean the runtime repository rather than the project? The inventory in the plan answers this before the root changes.
<!-- /ANCHOR:questions -->
