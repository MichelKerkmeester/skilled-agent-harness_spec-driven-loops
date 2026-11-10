---
title: "Tasks: Bump brace-expansion in two Pi extension lockfiles to close four Dependabot alerts"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "pi extension brace expansion tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Bump brace-expansion in two Pi extension lockfiles to close four Dependabot alerts

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

- [x] T001 List the open alerts and the locked versions (`gh api .../dependabot/alerts`)
- [x] T002 Find what requires `brace-expansion` and its range
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Try `npm update` and `npm audit fix --package-lock-only` on scratch copies; neither moved 5.0.9
- [x] T004 Delete the nested entry and re-resolve with `npm install --package-lock-only --ignore-scripts` on scratch copies
- [x] T005 Copy both verified lockfiles into place (`.pi/extensions/*/package-lock.json`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 `npm audit --package-lock-only` in each extension, before and after
- [x] T007 Diff the locked versions before and after
- [x] T008 Update documentation
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



