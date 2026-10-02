---
title: "Tasks: Align SECURITY.md with sk-doc and expand it"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "security policy tasks"
  - "security.md verification"
  - "security threat model tasks"
  - "security policy checklist"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Align SECURITY.md with sk-doc and expand it

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

- [x] T001 Read commit `b0f89ee5f0` and its packet `system-speckit/047-plugin-scanner-readiness` and record the history (spec.md)
- [x] T002 Route through sk-doc, resolve the README rule set as the closest standard and read the Human Voice Rules (SECURITY.md)
- [x] T003 [P] Capture the baseline: validator exit 1, DQI 86, HVR ceiling 99 (SECURITY.md)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Read the hooks, runtime configs, dispatch skills, installers, git hooks, `.gitignore` and CI files the new sections describe (SECURITY.md)
- [x] T005 Restructure to OVERVIEW first and RELATED last, keeping the operator's policy wording word for word (SECURITY.md)
- [x] T006 Add the reporter checklist, the surface map and the threat model (SECURITY.md)
- [x] T007 Add the safe-running guidance and the safeguards table (SECURITY.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run `validate_document.py`, `extract_structure.py` and `hvr_scan.py` on the final file (SECURITY.md)
- [x] T009 Confirm with `git diff b0f89ee5f0 -- SECURITY.md` that only the renumbered headings and the first reporter bullet left the original (SECURITY.md)
- [x] T010 Check every linked path and README anchor resolves, and run the documented `git diff --stat` command once (SECURITY.md)
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
