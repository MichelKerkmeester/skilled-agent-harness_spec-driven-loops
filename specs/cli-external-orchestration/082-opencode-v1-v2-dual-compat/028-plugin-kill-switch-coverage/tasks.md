---
title: "Tasks: Phase 28: plugin-kill-switch-coverage"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "plugin kill switch coverage tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 28: plugin-kill-switch-coverage

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create and provision worktree 166 from `origin/main`; scaffold this child (item 5)
- [x] T002 Baseline: plugin suite 417/417, sk-vision suite 76/76 (`scratch/mutation/baseline.txt`) (item 5)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Route `system-speckit-completion.js` through `isHookEnabled('completion')` (`.opencode/plugins/system-speckit-completion.js`) (item 5a)
- [x] T004 Extend the speckit-completion test: master switch, `MK_HOOKS_DISABLED`, a truthy non-`1` value, v1 `server` and v2 `setup` (`.opencode/plugins/tests/system-speckit-completion.test.cjs`) (item 5a)
- [x] T005 Check `isHookEnabled('sk-vision')` in the v1 `server` and v2 `setup`, fail-open when the resolver is missing (`.skilled/skills/sk-vision/vision-runtime/src/plugin.ts`) (item 5b)
- [x] T006 Add master and concern switch cases for `server` and `setup` (`.skilled/skills/sk-vision/vision-runtime/tests/plugin.test.ts`) (item 5b)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Mutation runs: each new test against the old code, recorded under `scratch/mutation/` (item 5)
- [x] T008 Rebuild the sk-vision bundle locally and check the built `dist/plugin.js` honors the switch through the `.opencode/plugins/sk-vision.js` link (item 5b)
- [x] T009 Drop the two gaps from `.opencode/plugins/ARCHITECTURE.md` and any README line that repeats them (item 5)
- [x] T010 Luna review until PASS (item 5)
- [x] T011 Strict validation of this child and recursive validation of 082 print `RESULT: PASSED` (item 5)
- [x] T012 Push to main and confirm every CI run, the two-version battery included (item 5)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
