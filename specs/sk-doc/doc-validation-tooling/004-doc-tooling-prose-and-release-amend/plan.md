---
title: "Implementation Plan: Doc tooling fixes found while writing the install guide and v4.0.2.0 notes"
description: "Fix four doc tools at their source: the README prose rule, a release body builder with an amend path, a merge-aware version bump and a proper-name exemption in the voice scan."
trigger_phrases:
  - "doc tooling prose and release amend plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Doc tooling fixes found while writing the install guide and v4.0.2.0 notes

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3 scripts, a Node.js ESM engine, Markdown and YAML |
| **Framework** | sk-doc modes and the pre-commit hook |
| **Storage** | None |
| **Testing** | pytest and script tests in the sk-doc suite, `pre-commit.test.sh` |

### Overview
Each fix lands where the problem starts. The README rule changes in the mode's own rules and checklist. The release body moves into one script both workflows call. The version engine learns to read `MERGE_HEAD`. The voice scan blanks listed names before it scans words.
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
- [x] Each changed script has a test that fails on the old code
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fix at the source, one test per behavior

### Key Components
- **`build_release_notes.py`**: turns an entry into a release body for a publish or an amend
- **`frontmatter-version.mjs`**: skips a doc whose staged blob equals a merged-in parent's
- **`hvr_scan.py`**: blanks the rules file's Proper names before the word scan

### Data Flow
A changelog entry goes through the builder to `gh release create` or `gh release edit`. A staged doc goes through the engine's merge filter before a raise.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow `tasks.md`. Setup records each measured failure, Implementation fixes it at the source, and Verification runs every touched suite.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each script change gets a test that fails on the old code and passes on the new one. The whole sk-doc suite and the pre-commit suite run before and after.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`python3`, `node`, `git` and, for an amend, an authenticated `gh`. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the commit. No data or published state depends on it.
<!-- /ANCHOR:rollback -->

---
