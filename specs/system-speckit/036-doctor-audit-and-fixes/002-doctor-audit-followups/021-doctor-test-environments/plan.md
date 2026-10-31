---
title: "Implementation Plan: Phase 21: doctor-test-environments"
description: "Allocate two numbered worktrees, build the update fixture's committed customizations and local tag, then prove the unit statuses and the reset."
trigger_phrases:
  - "doctor test environments plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 21: doctor-test-environments

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | git worktrees, the release-update engine |
| **Framework** | `worktree-naming.sh` allocator |
| **Storage** | Local worktrees and one local tag |
| **Testing** | Scoped offline `check`, then align, decide, apply and rollback |

### Overview
The allocator creates both worktrees with numbered branches. The fixture gets its customizations as separate commits so each status traces to one commit, then record-base fixes the v4.0.0.0 base.
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
Committed fixture state on a local branch, verified by the engine it exists to test.

### Key Components
- **Update fixture**: v4.0.0.0 plus the current updater and four customizations
- **Fixture tag**: v4.0.0.2 without one packet, for the removed status
- **Current-code environment**: a clean checkout of main for the other suites

### Data Flow
Allocate worktree, commit fixtures, record base, cut tag, check, apply, roll back.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The scoped checks assert all four statuses. An align, decide, apply and rollback round trip on the Webflow unit proves the reset, compared by `git status --porcelain` and checksums.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Remove both worktrees with `git worktree remove`, delete their local branches and the `v4.0.0.3-fixture` tag, and remove the two symlinks. Nothing tracked in the repository changes.
<!-- /ANCHOR:rollback -->

---
