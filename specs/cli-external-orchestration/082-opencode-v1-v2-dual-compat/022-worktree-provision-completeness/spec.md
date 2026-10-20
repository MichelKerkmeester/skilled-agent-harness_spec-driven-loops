---
title: "Feature Specification: Phase 22: worktree-provision-completeness"
description: "Five tracked package trees were missing from the worktree provision list, so a fresh worktree installed less than the repo needs, and nothing checked the list for gaps. Provisioning now lists fourteen trees, a test compares the list with every tracked package.json, and provisioning reports lockfile drift and a listed path with no manifest instead of failing bare or skipping it silently."
trigger_phrases:
  - "worktree provision completeness"
  - "worktree provisioning completeness list every package tree guard"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 22: worktree-provision-completeness

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
| **Branch** | `worktrees/163-worktree-provision-completeness` |
| **Parent Spec** | ../spec.md |
| **Phase** | 22 of 22 |
| **Predecessor** | 021-pi-fast-mode-trusted-flag |
| **Successor** | None |
| **Handoff Criteria** | The naming suite passes 109 tests (`scratch/mutation/new-code-run.txt`) and a fresh clone provisions 14 trees with 0 failed (`scratch/mutation/fresh-clone.txt`, from `scratch/mutation/fresh-clone.sh`) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 22** of the OpenCode v1 and v2 dual compatibility research specification.

**Scope Boundary**: Worktree provisioning under `.skilled/skills/sk-git/scripts/` — `provision_worktree` in `worktree-naming.sh`, the `worktree-provision-paths.txt` manifest, the `worktree-naming.test.sh` suite and `SECURITY.md` line 95 — this folder's records and the parent phase map rows. No CI workflow file changes and no global install.

**Dependencies**:
- Rows 2, 3, 18, 27 and 29 of `../014-post-merge-deep-research/research/research.md`, and findings F1, F2, F3, F4 and F7 of `../017-post-merge-research-provisioning/research/research.md`.
- The tracked package trees themselves, whose own suites prove that provisioning installed what they need: the cache optimizer, the fast-mode extension and the DESIGN.md generator backend.

**Deliverables**:
- A provision list that names every tracked package tree, with the two deliberate exclusions recorded beside it.
- A completeness guard that compares the list against every tracked `package.json`, plus drift, `bun.lockb` and missing-manifest reporting in `provision_worktree`.
- This folder's spec, plan, tasks and implementation summary, and the parent phase map rows.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Five tracked package trees were missing from the worktree provision list, so a fresh worktree installed a subset of what the repo needs. Their suites failed in ways that read as broken code: the cache optimizer's suite failed, the fast-mode suite had no vitest, and the DESIGN.md generator backend had 1 failed test. Nothing compared the list against the tracked packages, lockfile drift went untested, a package with a `bun.lockb` fell to npm, and a listed path with no `package.json` was skipped silently.

### Purpose
Every tracked package tree is either provisioned or excluded with a recorded reason, a test keeps the list honest, and provisioning reports lockfile drift and a missing manifest instead of failing bare or skipping in silence.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The five missing list entries: the two Pi extensions and the DESIGN.md generator backend, the last with its `dist/cli.js` build output named.
- The two recorded exclusions, the removed root `.` entry, and the `SECURITY.md` count and `bun.lockb` sentence.
- The `provision_list_gaps` guard and its two tests.
- Installer output logging, the four error lines, the lockfile-drift message, `bun.lockb` tool selection and the missing-manifest warning in `provision_worktree`.
- The local proof under `scratch/`, and this folder's records plus the parent phase map rows.

### Out of Scope
- The dual-version workflow's comment "Packages that ship a bun.lock" - CI files belong to another group, so this phase leaves them alone.
- Installing `.skilled/skills/mcp-code-mode/mcp-server` - it needs Node 24 for isolated-vm, and its `INSTALL-GUIDE.md` owns that install.
- Installing `.skilled/skills/mcp-tooling/mcp-obsidian/mcp-servers/obsidian-mcp` - it declares no dependencies and runs through npx.
- Repairing a drifted lockfile automatically - a repair would rewrite a committed lockfile without review.
- Editing any package's own test suite, or changing the number of CI jobs that run provisioning.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-git/scripts/worktree-naming.sh` | Modify | `provision_worktree` logs installer output, prints up to four error lines, names lockfile drift, selects bun for `bun.lockb`, and warns instead of skipping a listed path with no `package.json` |
| `.skilled/skills/sk-git/scripts/worktree-provision-paths.txt` | Modify | Adds the two Pi extensions and the DESIGN.md generator backend with `dist/cli.js`, records the two exclusions with reasons, and drops the root `.` entry |
| `.skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh` | Modify | Adds `provision_list_gaps` and two tests, plus fixtures for `bun.lockb`, drift and a missing manifest |
| `SECURITY.md` | Modify | Line 95 says fourteen listed trees and names `bun.lockb` beside `bun.lock` |
| `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/022-worktree-provision-completeness/spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Modify | This folder's records, filled from the scaffold |
| `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/spec.md` | Modify | The phase 22 row and the 021-to-022 handoff row in the phase map |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every tracked package tree is either provisioned or excluded with a recorded reason. | `worktree-provision-paths.txt` holds 14 entries, including `.pi/extensions/pi-cache-optimizer`, `.pi/extensions/pi-fast-mode-w-subagent-support` and `.skilled/skills/sk-design/sk-design-md-generator/backend  dist/cli.js`; the backend names `dist/cli.js` because the existing build-output guard requires the package's untracked `main`; the two `# excluded:` lines carry their reasons; the root `.` entry is gone because the root has had no `package.json` since commit e84663a8c5; `SECURITY.md` line 95 says "fourteen" and names `bun.lockb` (row 2). |
| REQ-002 | A guard compares the list with every tracked package tree. | `provision_list_gaps` reads the listed and excluded paths and compares them with `git ls-files` `package.json` files under `.skilled`, `.opencode` and `.pi`, printing `stale: <path>` or `unlisted: <path>`. The real list reports no gaps; a copy missing the cache optimizer plus a bogus `no/such/pkg` reports both (row 3). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Provisioning reports lockfile drift and the installer's own error lines. | `provision_worktree` logs installer output instead of discarding it and drops `--silent`, because npm's silent level hides the error lines; a failed install prints up to four error lines, and drift prints `lockfile drift: package.json and its lockfile disagree; run npm install in <pkg> and commit the lockfile`. It reports rather than repairs, because a repair would rewrite a committed lockfile without review. A stub npm that fails `npm ci` with the in-sync error proves it, and real npm 11.19.1 is recorded in `scratch/mutation/real-npm-drift.txt` (row 18). |
| REQ-004 | A `bun.lockb` package installs with bun. | A package with `bun.lockb` and no `package-lock.json` selects bun. The fixture installs with bun once and never reaches npm (row 27). |
| REQ-005 | A listed path with no `package.json` warns and provisioning still exits 0. | The run prints `WARNING: <pkg> is listed but has no package.json; skipped` on stderr and exits 0. The fixture is a tree whose listed directory lacks a `package.json` (row 29). |
| REQ-006 | A fresh clone provisions every listed tree and the added trees' suites pass. | With only Node 22.23.1 (CI's version) and bun 1.3.9 on `PATH`, `git clone --no-hardlinks` followed by `provision_worktree "$PWD"` reports 11 installed, 5 built, 3 already present, 0 failed, exit 0, in 43 s. The cache optimizer then passes 118 tests, the fast-mode extension 81 and the backend 176, all recorded in `scratch/mutation/fresh-clone.txt` by `scratch/mutation/fresh-clone.sh` (row 2). |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every requirement REQ-001 to REQ-006 is checked with recorded evidence in this folder.
- **SC-002**: The naming suite passes 109 tests, and a fresh clone provisions 14 trees with 0 failed, both recorded in `scratch/mutation/new-code-run.txt` and `scratch/mutation/fresh-clone.txt` (from `scratch/mutation/fresh-clone.sh`).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The tracked package trees and their own suites | A listed tree whose install or build is wrong still provisions "successfully" until its suite runs | The fresh-clone run in `scratch/mutation/fresh-clone.txt`, produced by `scratch/mutation/fresh-clone.sh`, finishes with the cache optimizer at 118 tests, the fast-mode extension at 81 and the backend at 176, and the same file holds the provision output |
| Dependency | npm 11.19.1 on Node 26.8.2, and bun 1.3.9 behaviour | The drift message keys on npm's "in sync" wording, and bun's flag order differs from npm's | A stub npm pins the fixture, and the real npm 11.19.1 on Node 26.8.2 run is recorded in `scratch/mutation/real-npm-drift.txt` |
| Risk | Drift is reported, not repaired | Med | The message names the package and the exact repair, `npm install` in `<pkg>` then commit the lockfile, so an operator reviews the rewrite |
| Risk | No CI job runs `worktree-naming.test.sh` | Med | The OpenCode Dual-Version Battery runs `provision_worktree`, so the three added trees install there and a failed install fails that job; the guard remains a local suite |
| Risk | The excluded Code Mode server needs Node 24 | Low | Its `INSTALL-GUIDE.md` owns the install and the exclusion is recorded on an `# excluded:` line, so the completeness test expects it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None left open. Rows 2, 3, 18, 27 and 29 of `../014-post-merge-deep-research/research/research.md` fixed the scope, findings F1, F2, F3, F4 and F7 of `../017-post-merge-research-provisioning/research/research.md` supplied the causes, and the runs in `scratch/mutation/`, ending with `fresh-clone.txt` from `fresh-clone.sh`, answered how the fix is proven.
<!-- /ANCHOR:questions -->

---
