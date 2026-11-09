---
title: "Implementation Plan: Align the root release, contributing and security docs with the current repository"
description: "Check each claim in three root Markdown files against its source file, rewrite or correct the file, then prove it with the sk-doc validator and voice scanner."
trigger_phrases:
  - "root release docs alignment plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Align the root release, contributing and security docs with the current repository

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown |
| **Framework** | sk-doc voice rules |
| **Storage** | None |
| **Testing** | `validate_document.py` and `hvr_scan.py` |

### Overview
Change three root Markdown files. Check every claim against the file that sets the behavior before writing it. Prove the result with the document validator and the voice scanner, compared with the numbers taken before the first edit.
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
- [x] `python3 .skilled/skills/sk-doc/scripts/validate_document.py PUBLIC-RELEASE.md` prints `VALID`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation correction

### Key Components
- **`PUBLIC-RELEASE.md`**: Repository layout and release process
- **`CONTRIBUTING.md`**: Contributor setup and enforced rules
- **`SECURITY.md`**: Reporting route, risks and safeguards

### Data Flow
Source files and hook rules are read. The three documents restate them. No code reads the documents.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup takes the baselines. Implementation changes the three files. Verification reruns the validator and the scanner.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run `validate_document.py` and `hvr_scan.py` on each file and compare with the baseline in `spec.md`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`python3`, `git` and `gh`. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a corrected statement proves wrong. Run `git checkout -- PUBLIC-RELEASE.md CONTRIBUTING.md SECURITY.md` before the commit, or revert the one commit after it.
<!-- /ANCHOR:rollback -->

---
