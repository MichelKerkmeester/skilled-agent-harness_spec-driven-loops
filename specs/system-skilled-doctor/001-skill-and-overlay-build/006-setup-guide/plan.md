---
title: "Implementation Plan: Setup guide for using Skilled in your own project"
description: "Run every link and copy step in throwaway folders, write SETUP.md from what they printed, then cut the root README setup sections to a pointer."
trigger_phrases:
  - "setup guide plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Setup guide for using Skilled in your own project

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown |
| **Framework** | None |
| **Storage** | None |
| **Testing** | The link and overlay engines run by hand in throwaway folders, plus the doc validators |

### Overview
Run every link and copy step in throwaway folders, write SETUP.md from what they printed, then cut the root README setup sections to a pointer.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] `validate_document.py SETUP.md` reports no blocking error and the reference check prints `fail=0`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single function change

### Key Components
- **`SETUP.md`**: the one setup guide

### Data Flow
The guide sends a reader through the link-or-copy choice to one of two step lists, then to the health table and the troubleshooting table.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup reproduces the defect, Implementation fixes it with a test, and Verification reruns the suites.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run the symlink engine plan, apply, check and unlink on an empty repo, and the overlay engine status, apply, capture, staged and live re-pin, rollback and the unowned-edit refusal on a real copy, then validate the docs.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the commit. The change is one function and its test.
<!-- /ANCHOR:rollback -->

---
