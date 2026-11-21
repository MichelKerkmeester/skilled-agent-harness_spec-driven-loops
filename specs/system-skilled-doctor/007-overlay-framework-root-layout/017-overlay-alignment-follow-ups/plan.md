---
title: "Implementation Plan: Phase 17: overlay alignment follow-ups"
description: "Copy Barter's README skip into the router-sync guard, add one Python cache predicate to the overlay engine's directory-entry readers, each with a test that fails first, then review phases 014 to 017 until the review approves."
trigger_phrases:
  - "overlay alignment follow ups plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 17: overlay alignment follow-ups

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS |
| **Framework** | None |
| **Storage** | `sync-state.json` in the overlay folder |
| **Testing** | `node --test` |

### Overview
Two scripts change: the router-sync guard's orphan walk and the overlay engine's directory-entry readers. Each change lands with a test that failed on the unchanged script. A final `@review` pass over the first-parent merge diff and this branch proves the packet's code is ready.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` and the router-sync suite exit 0 on merged main
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared filter predicate

### Key Components
- **`verify-router-sync.cjs` `walkMarkdown`**: collects the docs leg 1b checks. It now leaves out folder READMEs.
- **The engine's cache predicate**: one function that names a Python bytecode cache path. Every reader of a directory entry's source and live destination consults it, so apply, status, drift, capture, adopt and stage agree.

### Data Flow
A directory entry's source and destination are walked into path maps. The predicate drops cache paths from both maps before the plan compares them, so a cache is never written, deleted, recorded or reported.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup creates the worktree and this phase, and runs the gates on main. Implementation lands the guard fix and the engine fix, each red first. Verification runs `@review` until it approves, merges into main and reruns the gates there. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The router-sync suite must pass 56 tests and the engine suite 354 plus the new cache tests, each with exit 0. The guard 20, contract 9, lsa 76 and ldoc 10 suites keep their counts, and `route-validate.sh` reports 32 routes.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None beyond Node.js and git. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a gate on merged main drops below its baseline. Revert the phase's merge commit on local main with `git revert -m 1 <merge>`. Nothing is pushed, so no remote state changes.
<!-- /ANCHOR:rollback -->

---
