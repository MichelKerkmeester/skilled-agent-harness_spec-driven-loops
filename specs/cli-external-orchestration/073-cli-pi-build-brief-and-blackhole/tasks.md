---
title: "Tasks: Tell cli-pi dispatchers to scope build briefs to one change and to switch off pi-blackhole in children"
description: "Ordered tasks for the cli-pi build-brief and pi-blackhole amendment."
trigger_phrases:
  - "cli-pi build brief tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Tell cli-pi dispatchers to scope build briefs to one change and to switch off pi-blackhole in children

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

- [x] T001 Read the failed dispatch's pi transcript and pi-blackhole's config
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Add ALWAYS rule 12 (`cli-pi/SKILL.md`)
- [x] T003 Add the pi-blackhole gotcha (`cli-pi/SKILL.md`)
- [x] T004 Bump to 1.5.4.0 and add the changelog (`cli-pi/changelog/v1.5.4.0.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Validate both files
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



