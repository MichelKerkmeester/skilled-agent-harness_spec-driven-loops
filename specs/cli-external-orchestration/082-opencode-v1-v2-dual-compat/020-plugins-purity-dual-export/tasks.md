---
title: "Tasks: Phase 20: plugins-purity-dual-export"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "plugins purity dual export tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 20: plugins-purity-dual-export

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

- [x] T001 Record the failure facts with their sources (`scratch/facts.md`) Done: the red main run `22f563b032` (run `39373558502`), the mask chain through `47371b495f`, the dual-export cause from `f7b54c52db` and the fix pattern from `27763681f7` each cite their evidence.
- [x] T002 Reproduce the purity failure locally before any edit (`scratch/before/plugins-purity-vitest.txt`) Done: 1 failed, exit 1, with `classifier-injection-screen.js` reported as the first dual plugin in sorted order.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Teach the purity test the dual export (`.skilled/skills/system-spec-kit/runtime/tests/opencode-plugins-folder-purity.vitest.ts`) Done: when the default export has a `server` function the test now requires a `setup` function, calls `server({})` and requires a recognised OpenCode hook key on the returned object; the plain factory and plain hook-object branches are unchanged and no plugin changed. Evidence: `scratch/after/plugins-purity-vitest.txt`.
- [x] T004 Probe the fixed test with deliberately bad plugin files (`scratch/after/mutation-dual-server-no-hooks.txt`, `scratch/after/mutation-dual-missing-server.txt`, `scratch/after/mutation-plain-object-no-hooks.txt`) Done: three temporary `.opencode/plugins/zz-mutation-probe.js` files, each deleted after its run, made the fixed test fail with exit 1 — a dual export whose `server` returns no hook keys failed with "dual plugin server factory returned no recognized OpenCode hook keys", and a dual-shaped object missing `server` as well as a plain object with no hook keys both failed with "object default export has no recognized OpenCode hook keys".
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Run the purity test after the fix (`scratch/after/plugins-purity-vitest.txt`) Done: 1 of 1 passed, exit 0.
- [x] T006 Run the whole Runtime vitest project (`scratch/after/runtime-project-summary.txt`) Done: 109 files passed, 3 skipped; 1333 tests passed, 13 skipped; exit 0. This is the Spec-Kit Check step that was red on main; a green CI run on main is not claimed anywhere in this folder.
- [x] T007 [P] Fill this folder's records and the parent phase rows (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `../spec.md`) Done: every placeholder replaced, and the phase 20 row names the purity test as the last red Spec-Kit Check step while the 019 handoff row carries 019's docs being on main and the local pass. Evidence: this folder's four documents and `../spec.md`.
- [x] T008 Run strict validation of this folder (`bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/020-plugins-purity-dual-export --strict`) Done: after the continuity save and a `repair-derived.cjs` refresh of the parent metadata, the recursive run over 082 gives 21 of 21 RESULT: PASSED, exit 0 (`scratch/after/validate-082-recursive.txt`).
- [x] T009 Map which purity-test branch each `.skilled/plugins` entry takes (`scratch/after/plugin-branch-map.txt`) Done: all 16 regular plugin files take the dual branch.
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
