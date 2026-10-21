---
title: "Tasks: Phase 44: skill-advisor-stress-ci"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "skill advisor stress ci tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 44: skill-advisor-stress-ci

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

- [x] T001 Record the stress, runtime vitest, plugin-suite and purity counts before any edit (`scratch/baseline/`)
- [x] T002 Confirm the dual-export contract at the export and in the purity test (`.opencode/plugins/system-skill-advisor.js`, `.skilled/skills/system-spec-kit/runtime/tests/opencode-plugins-folder-purity.vitest.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Import the default export as the dual-export object and call its factory (`.skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/opencode-plugin-bridge-stress.vitest.ts`)
- [x] T004 Add the test that pins `id`, `setup` and `server` on the default export (`.skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/opencode-plugin-bridge-stress.vitest.ts`)
- [x] T005 [P] Call `.server` at both call sites (`.skilled/skills/system-skill-advisor/runtime/tests/compiled-routing-consumption.vitest.ts`)
- [x] T006 [P] Call `.server` for the plugin hooks (`.skilled/skills/system-skill-advisor/runtime/tests/skill-graph-diagnostic-redaction.vitest.ts`)
- [x] T007 [P] Extract the factory as `default.server` (`.skilled/skills/system-skill-advisor/runtime/tests/system-skill-advisor-plugin.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Revert the harness call and show the four `default is not a function` failures return (`scratch/mutation/m1-call-default-directly.txt`)
- [x] T009 Rerun the stress suite, runtime vitest, plugin suite, purity test and typecheck (`scratch/after/`, `scratch/baseline/`)
- [x] T010 Rerun the dual-version battery on v1 and on v2 (`scratch/after/battery-v1.txt`, `scratch/after/battery-v2.txt`)
- [x] T011 Luna review of every change (`scratch/luna/`)
- [ ] T012 Record the CI run ids after the push to main (`implementation-summary.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` - T012 waits on the push to main
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
