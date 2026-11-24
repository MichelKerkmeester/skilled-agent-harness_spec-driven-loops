---
title: "Implementation Plan: Provision a nested npm package even when an ancestor installed a same-named dependency"
description: "Bound the npm dependency walk in worktree provisioning at the package's install root, the nearest folder holding a package-lock.json."
trigger_phrases:
  - "provision dev dependencies plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Provision a nested npm package even when an ancestor installed a same-named dependency

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `worktree-naming.test.sh` with a stubbed npm |

### Overview
`provision_worktree` passed the worktree root as the npm walk boundary. A new helper, `_wn_npm_install_root`, returns the nearest folder from the package upward that holds a `package-lock.json`, and that folder becomes the boundary.
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
- [x] `bash .skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh` prints `PASS=178 FAIL=0`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shell library function.

### Key Components
- **`_wn_npm_install_root`**: Prints the nearest lockfile folder between the package and the worktree root, or the worktree root when there is none.
- **`_wn_deps_satisfied`**: Unchanged. It walks from the package to the boundary it is given.

### Data Flow
`provision_worktree` reads each listed package, picks npm, asks `_wn_npm_install_root` for the boundary and passes it to `_wn_deps_satisfied`.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

A negative control: the new test case runs against the HEAD script and must fail, then against the fixed script and must pass. Then a real re-provision of worktree 536.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A. No new tool or package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

`git revert` the commit. Provisioning then skips nested lockfile packages again, as before.
<!-- /ANCHOR:rollback -->

---
