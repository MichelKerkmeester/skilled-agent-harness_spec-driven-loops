---
title: "Tasks: Phase 2: skill-and-routing-rename"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "skill and routing rename tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: skill-and-routing-rename

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

- [x] T001 Capture the baseline of every gate (scratch/baseline/)
- [x] T002 Record the runtime-name count for `.opencode/` and `cli-opencode` (scratch/baseline/runtime-names.txt)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 `git mv` the packet folder, hermes mirror and playbook scenario files (.skilled/skills/sk-code/sk-code-skilled/)
- [x] T004 Re-point the changelog alias symlink (.skilled/changelog/sk-code/code-skilled)
- [x] T005 Rewrite every identity spelling outside this packet with the safe patterns
- [x] T006 Rename the surface id OPENCODE to SKILLED inside the hub and the advisor plugin (.opencode/plugins/system-skill-advisor.js)
- [x] T007 Regenerate the leaf manifest and re-mint the compiled-route manifest (.skilled/skills/sk-code/leaf-manifest.json)
- [x] T008 Rebuild the advisor DB, the hermes mirror and the trigger index
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Re-run every baseline gate into scratch/after/ and compare
- [x] T010 Replay a framework-code prompt through the advisor and the hub; compare with main
- [x] T011 Confirm the runtime-name count equals the baseline
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
