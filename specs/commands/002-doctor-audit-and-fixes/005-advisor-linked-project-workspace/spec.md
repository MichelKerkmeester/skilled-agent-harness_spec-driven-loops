---
title: "Feature Specification: Phase 5: advisor-linked-project-workspace"
description: "The advisor daemon runs from its source tree and builds its workspace allowlist from that tree, so it refuses every project linked to it by /doctor:symlink with exit 64. This phase also admits a workspace whose .skilled resolves to the source tree's own .skilled."
trigger_phrases:
  - "advisor linked project workspace"
  - "phase 5 advisor linked project workspace"
  - "advisor workspaceroot must resolve under"
  - "advisor exit 64 linked project"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 5: advisor-linked-project-workspace

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-01 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-symlink-relink-after-unlink |
| **Successor** | None |
| **Handoff Criteria** | The new schema tests are red before and green after, the advisor suite and `run-all.sh` pass, `advisor_status` from a linked project returns `status: ok`, and `validate.sh --strict` passes on this folder and the parent |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of *Doctor command audit and the fixes it recorded*: letting the skill advisor serve a project linked with `/doctor:symlink`.

**Scope Boundary**: `isAllowedWorkspaceRoot()` and a new `isWiredToSourceTree()` in `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts`, the schema test file, and the two doc lines that state the allowlist rule. The launcher's spawn `cwd`, the prefix allowlist and the env extras stay as they are.

**Dependencies**:
- Node's `realpathSync.native`, which resolves the `.skilled` link to the source tree's own `.skilled`.
- The advisor's own build (`npm run build` in the runtime folder), because the daemon runs from `dist/`.

**Deliverables**:
- A schema check that also admits a workspace, or a directory below one, whose `.skilled` or `.opencode` realpath equals this source tree's.
- Two schema tests: a linked project and its subdirectory are admitted; an unlinked directory, a link to another source and a copied tree are refused.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.skilled/bin/system-skill-advisor-launcher.cjs` spawns the daemon with `cwd: root`, the realpath source tree, and `advisor-tool-schemas.ts` builds `ALLOWED_WORKSPACE_PREFIXES` from `detectRepoRoot(process.cwd())` at module load. A project linked by `/doctor:symlink` holds `.skilled -> <source>/.skilled` but lives outside the source tree, so `advisor_status --workspace-root "$PWD"` from that project exits 64 and the per-prompt advisor brief fails there too.

### Purpose
A project wired to this source tree gets advisor answers, while a directory that is not wired to it stays refused.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
From the linked Barter project, recorded in the Barter verification note `T001-T009-orchestrator.md`, section T009:
```text
advisor exit 64: workspaceRoot must resolve under the repo root, os.tmpdir(), or an explicit SPECKIT_ADVISOR_WORKSPACE_ALLOWLIST entry
```
The new tests against the unmodified schema (full output in `scratch/red-before-change.md`):
```text
$ npx --no-install vitest run tests/schemas/advisor-tool-schemas.vitest.ts
TypeError: isWiredToSourceTree is not a function
      Tests  2 failed | 16 passed (18)
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `isWiredToSourceTree()`, which walks up from the input and compares each `.skilled` and `.opencode` realpath with the source tree's.
- Make `isAllowedWorkspaceRoot()` accept a wired workspace in addition to the existing prefixes, and name the new case in the schema's error message.
- Add the two schema tests and rebuild the advisor `dist/`.
- Update the `ENV-REFERENCE.md` row and the feature-catalog line that state the allowlist rule.

### Out of Scope
- Changing the launcher's spawn `cwd` - one daemon serves its source tree for every linked project, so the source tree is the right anchor.
- Widening the prefix allowlist or adding a config switch - either would admit directories that are not wired to this source.
- The Barter coder checkout - it picks the fix up when it next re-pins the framework.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts` | Modify | `isWiredToSourceTree()`; `isAllowedWorkspaceRoot()` calls it; error message names the case |
| `.skilled/skills/system-skill-advisor/runtime/tests/schemas/advisor-tool-schemas.vitest.ts` | Modify | Linked-project admit test and not-wired refuse test |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Modify | The allowlist row names linked projects |
| `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md` | Modify | The bounding sentence names linked projects |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A directory whose `.skilled` is a link to the source tree's `.skilled`, and any directory below it, is accepted by `isWiredToSourceTree()` and so by `isAllowedWorkspaceRoot()` |
| REQ-002 | A directory with no link, a `.skilled` linking to another source, or its own copied `.skilled` tree is refused by `isWiredToSourceTree()`, and `/etc` is still refused by `isAllowedWorkspaceRoot()` |
| REQ-003 | `advisor_status --workspace-root "$PWD" --format json` from a project that links only `.skilled` to this checkout exits 0 with `"status": "ok"` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The advisor suite (`npx --no-install vitest run`) and `bash .skilled/commands/doctor/scripts/tests/run-all.sh` exit 0 after the change |
| REQ-005 | Every doc line that states the allowlist rule names the linked-project case |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `npx --no-install vitest run tests/schemas/advisor-tool-schemas.vitest.ts` moves from `2 failed, 16 passed` before the change to `18 passed` after it.
- **SC-002**: The whole advisor suite moves from `2 failed, 1359 passed` to `1361 passed`, and `run-all.sh` prints `7 suite(s) passed, 0 failed` before and after.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The daemon reads the schema from `dist/` and caches the source root at module load | A stale `dist/` or a running daemon keeps refusing linked projects | Rebuild with the advisor's own build script; the live proof stopped this checkout's daemon so the call relaunched it |
| Risk | The new check admits more directories than before | Med | A directory is admitted only when its own `.skilled` or `.opencode`, or an ancestor's, resolves to the source tree's entry, which `/doctor:symlink` or the operator must have created; the refuse test pins a copy and a foreign link |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: A path the prefix allowlist admits costs no extra filesystem call; a refused path costs at most two `realpath` calls per ancestor, capped at 64 ancestors.

### Security
- **NFR-S01**: Only a workspace whose source-root entry resolves to this source tree's own entry is added; the prefix allowlist and the env extras are unchanged.

### Reliability
- **NFR-R01**: A missing or broken `.skilled` link makes `realpath` fail, which counts as not wired, so the call is refused rather than thrown.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: `isWiredToSourceTree('')` returns false, as `isAllowedWorkspaceRoot('')` already did.
- Maximum input: a path deeper than 64 directories stops the walk and is refused unless a prefix admits it.
- Failure path: a refused path still fails the schema with the `workspaceRoot must resolve under` message, and the CLI exits 64 as before.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 5/25 | One schema file, one test file, two doc lines |
| Risk | 9/25 | Widens a security bound on caller-supplied paths |
| Research | 4/20 | Caller inventory of the allowlist only |
| **Total** | **18/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
