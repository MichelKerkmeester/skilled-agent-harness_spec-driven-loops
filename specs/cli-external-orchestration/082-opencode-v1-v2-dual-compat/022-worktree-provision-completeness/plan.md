---
title: "Implementation Plan: Phase 22: worktree-provision-completeness"
description: "Compare the provision manifest with every tracked package tree, add the five missing trees or record why they stay out, then give the manifest a test that keeps it honest. Provisioning also reports the installer's own error lines, names lockfile drift instead of repairing it, selects bun for a binary lockfile, and warns when a listed path lost its manifest."
trigger_phrases:
  - "worktree provision completeness plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 22: worktree-provision-completeness

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash 3.2-compatible shell, run on macOS and Linux, with a plain-text manifest |
| **Framework** | The repository's own bash test harness in `worktree-naming.test.sh`, no external test runner |
| **Storage** | None; the manifest is the only state, and each package's lockfiles decide its installer |
| **Testing** | The naming suite (109 tests), a mutation run against the old script and list, a real npm drift run, and a fresh-clone provision (`scratch/mutation/fresh-clone.txt`, from `scratch/mutation/fresh-clone.sh`) |

### Overview
The provision list named fewer trees than the repo tracks, so a fresh worktree installed a subset and three added trees' suites failed before the change. The fix adds the missing trees or records their exclusion, removes the root `.` entry that has had no `package.json` since commit e84663a8c5, and gives the list a test that compares it with every tracked `package.json` under `.skilled`, `.opencode` and `.pi`. Provisioning now logs installer output, prints up to four error lines on failure, names lockfile drift for an operator to repair, selects bun for a `bun.lockb`, and warns instead of silently skipping a listed path with no manifest.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A shell provisioner driven by an ordered plain-text manifest, guarded by a bash test that reads the repository's tracked files. The phase changes one script, its manifest, its test file and one documentation line.

### Key Components
- **`provision_worktree [dir]` in `worktree-naming.sh`**: walks the manifest in order, skips trees already installed or built, selects npm or bun, logs each install, reports failures, and returns non-zero when any install or build failed.
- **`worktree-provision-paths.txt`**: one path per line, an optional second field naming a build output, and `# excluded:` lines with a reason for each tracked tree that stays out. Fourteen entries remain after the edit.
- **`provision_list_gaps <list>` in `worktree-naming.test.sh`**: reads listed and excluded paths, prints `stale: <path>` for a path with no `package.json`, then prints `unlisted: <path>` for a tracked tree in neither set.
- **The lockfile probe**: a `bun.lock` or `bun.lockb` with no `package-lock.json` selects bun and the package's own `node_modules`; otherwise npm runs from the worktree root.

### Data Flow
`provision_worktree` reads the manifest from the script directory, resolves the worktree, and tests each listed path for a `package.json` before anything else. A missing manifest produces a warning and no failure. For a valid path it picks the installer from the lockfiles, skips when dependencies are satisfied, otherwise runs the install with its output captured to a temporary log. Success counts as installed; failure prints the package, up to four matching error lines, and the drift message when npm's error says the files are not in sync. When the entry names a build output and the file is absent, the same tool builds the package and a missing output still fails the run.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The verification tasks in `tasks.md` carry the runs. The baseline before any edit is `worktree-naming tests: PASS=97 FAIL=0`, exit 0, on origin/main b0133e893a (`scratch/mutation/baseline.txt`). The new tests and the new list against the old script and old list give `PASS=101 FAIL=8`, exit 1 (`scratch/mutation/old-code-run.txt`); the completeness test lists `stale: .` and exactly the five unlisted trees. Against the new script and list the suite gives `PASS=109 FAIL=0`, exit 0 (`scratch/mutation/new-code-run.txt`). A stub npm pins the drift fixture, and a real npm 11.19.1 on Node 26.8.2 run adds the real wording (`scratch/mutation/real-npm-drift.txt`). The end-to-end proof is a `git clone --no-hardlinks` provisioned with only Node 22.23.1 and bun 1.3.9 on `PATH`: 11 installed, 5 built, 3 already present, 0 failed, exit 0, 43 s, after which the cache optimizer passes 118 tests, the fast-mode extension 81 and the backend 176 (`scratch/mutation/fresh-clone.txt`, from `scratch/mutation/fresh-clone.sh`). No CI job runs `worktree-naming.test.sh`; the OpenCode Dual-Version Battery runs `provision_worktree`, so the added trees install there too.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Rows 2, 3, 18, 27 and 29 of `../014-post-merge-deep-research/research/research.md`, and findings F1, F2, F3, F4 and F7 of `../017-post-merge-research-provisioning/research/research.md`, supply every claim this phase makes. The proof depends on the CI Node version 22.23.1 and bun 1.3.9 for the fresh clone, on real npm 11.19.1 on Node 26.8.2 for the drift wording, and on the tracked package trees' own suites for evidence that provisioning installed what each one needs.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert `worktree-naming.sh`, `worktree-provision-paths.txt`, `worktree-naming.test.sh` and `SECURITY.md` line 95. The manifest then misses the five tracked trees again, the completeness guard disappears with its test file, and provisioning goes back to discarding installer output, treating `bun.lockb` as npm, and skipping a listed path with no manifest in silence. The revert is a known regression rather than a neutral one. The records under `scratch/` stay as history.
<!-- /ANCHOR:rollback -->

---
