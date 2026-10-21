---
title: "Tasks: Phase 48: skilled-loop-shared-nudge-formatter"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "skilled loop shared nudge formatter tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 48: skilled-loop-shared-nudge-formatter

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

- [x] T001 Scaffold the phase packet and record the before suffix compare: 4 same and 4 DIFF, all four one of the invalid inputs (`84cdaeb09a`, `scratch/before/suffix-compare.txt`)
- [x] T002 Trace the duplicate suffix text to `spec_folder_suffix()` in the wrapper and `specFolderSuffix` in the core (`.skilled/bin/skilled-loop`, `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Replace the wrapper's hand-written branches with one node call that prints the core's `specFolderSuffix(folder)` (`70c81b37c3`, `.skilled/bin/skilled-loop`)
- [x] T004 Add the ownership test and confirm the old function fails it (`scratch/mutation/old-function.tap`, `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs`)
- [x] T005 Print a warning on stderr and relaunch with a bare seed when the node call fails (`1159acb5c5`, `.skilled/bin/skilled-loop`)
- [x] T006 Replace the copied-source regex edit with a shim over the real core, and add the throwing-formatter test (`1159acb5c5`, `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs`, `scratch/mutation/no-warning.tap`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Rerun the suffix compare: 8 same and 0 DIFF (`scratch/after/suffix-compare.txt`)
- [x] T008 Run the wrapper suite: 111 of 111, against a 109 baseline (`scratch/after/skilled-loop.tap`)
- [x] T009 Run Hook Node before and after: 870 of 870, then 872 of 872 over 29 files (`scratch/before/hook-node.tap`, `scratch/after/hook-node.tap`)
- [x] T010 Run the live session-relaunch playbook on OpenCode 1 and 2 with `llmgateway`: both runner exit 0, marker present, a tool call completed (`scratch/after/live-session-relaunch.txt`)
- [x] T011 Confirm the shared v2 service was not touched (`scratch/after/pid46220-before.txt`)
- [x] T012 DeepSeek v4.1 flash max read-only review r01: VERDICT PASS with two P2s, both fixed in `1159acb5c5`
- [x] T013 Run strict validation on the phase packet: `RESULT: PASSED` (`bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/048-skilled-loop-shared-nudge-formatter --strict`)
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
