---
title: "Implementation Plan: Let a second pi-cache-optimizer copy stand down so pi starts in git worktrees"
description: "Port the copy claim from pi-fast-mode-w-subagent-support into pi-cache-optimizer's entry point, test it with two copies on one fake event bus, and prove it with a Pi run from a worktree."
trigger_phrases:
  - "cache optimizer single copy guard plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Let a second pi-cache-optimizer copy stand down so pi starts in git worktrees

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, loaded by Pi through jiti |
| **Framework** | Pi extension API |
| **Storage** | None |
| **Testing** | `node:test` through `npm test`, `tsc --noEmit` |

### Overview
The entry point wraps the existing registration in a copy claim on Pi's event bus, the same pattern `pi-fast-mode-w-subagent-support` uses. Two new tests load two copies on one fake bus. A Pi run from the worktree with a throwaway agent folder proves the load succeeds when both copies carry the claim.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The worktree reproduces `Tool "edit_lines" conflicts with ...`
- [x] Baseline `npm test` prints `pass 118, fail 0` and `npm run typecheck` exits 0
- [x] The fast-mode claim pattern is read (`src/index.ts` `claimPackage`)

### Definition of Done
- [x] All acceptance criteria met
- [x] `npm test` prints `fail 0` and `npm run typecheck` exits 0
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Event-bus copy claim.

### Key Components
- **`claimPackage`**: asks the bus whether another copy claimed the package, and claims it when none did.
- **`createPiCacheOptimizerExtension`**: the entry point; registers everything only when its copy holds the claim.

### Data Flow
Each copy emits a probe on `pi-cache-optimizer:copy-claim`. A copy that already claimed fills in its real path. A later copy at another real path sees it and returns without registering.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`npm test` in the extension, then a Pi run from the worktree with `PI_CODING_AGENT_DIR` pointing at a throwaway agent folder whose link resolves to a second copy. With the old code that run prints the conflict; with the new code it does not.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the extension fails to register in the main checkout. Revert the one commit; worktree runs then need `-ne` again.
<!-- /ANCHOR:rollback -->

---
