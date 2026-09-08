---
title: "Tasks: screenshot library of well-designed charts from external sources"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: screenshot library of well-designed charts from external sources

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

- [x] T001 Candidate list from the survey. Evidence: `scratch/capture.sh`, 36 pages
- [x] T002 Round one captured and triaged on a contact sheet. Evidence: 57 files; keepers listed in `library/index.md`
- [x] T003 [P] Round two with corrected and added sources, triaged. Evidence: `scratch/capture-round2.sh`, 32 files
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Playwright pass through the installed Chrome: every source scrolled and captured, Tremor included. Evidence: `scratch/capture-playwright.cjs`, 61 files, contact sheet read
- [x] T005 Keepers built by `scratch/build-library.py` from `scratch/sources.json`: 1200 wide JPEG, dark kept only where the source honours the scheme. Evidence: `library/` 52 JPEGs, `index.md`, `index.json`, `gallery.html`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Chart crops at 2x: two crop passes (the second adds iframes and a lower size floor), five sheets read, 224 keepers built. Evidence: `scratch/capture-details.cjs`, `library/details/`
- [x] T008 Gallery page rendered and read
- [x] T009 Walled and erroring sources recorded with reasons
- [x] T010 Packet docs; validate strict RESULT: PASSED
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



