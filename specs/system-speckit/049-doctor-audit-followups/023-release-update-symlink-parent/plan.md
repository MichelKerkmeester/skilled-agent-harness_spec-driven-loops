---
title: "Implementation Plan: Phase 23: release-update-symlink-parent"
description: "Mark the symlinked-parent error, catch it in the read path, classify it as its own conflict kind, prove it with a regression test, then remove the fixture workaround."
trigger_phrases:
  - "release update symlink parent plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 23: release-update-symlink-parent

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS |
| **Framework** | node:test |
| **Storage** | Git object store and the worktree |
| **Testing** | `release-update.test.cjs` plus the fixture checks |

### Overview
The write guard stays as it is. Reads catch its error by code and return a marked entry that classification turns into a conflict with no adoptable release side.
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
Report, never follow: a path the engine cannot read safely becomes a visible conflict.

### Key Components
- **safeResolve**: tags the symlinked-parent error with a code
- **worktreeEntry**: returns a `symlinkParent` entry for that code
- **classifyFile and recommendation**: conflict kind and keep-local

### Data Flow
Release path, read guard, marked entry, conflict, keep-local decision, nothing written.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

A fixture pair where the operator's checkout links `refs` to `shared` and the release adds `refs/notes.md`. The test asserts check and align succeed, the file is a `symlink-parent` conflict, adopt-release is refused and `shared/notes.md` is unchanged. It failed on the old engine at the check step.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the engine, test and YAML changes. In the fixture, revert the revert of the workaround commit and the updater overlay commit.
<!-- /ANCHOR:rollback -->

---
