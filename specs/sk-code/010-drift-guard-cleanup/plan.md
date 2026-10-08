---
title: "Implementation Plan: Narrow the alignment drift guard so it skips recorded evidence and experiment fixtures"
description: "Add one path predicate to the alignment-drift verifier's file walk that skips spec evidence folders and fixture trees, and prove it with one unit test."
trigger_phrases:
  - "drift guard cleanup plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Narrow the alignment drift guard so it skips recorded evidence and experiment fixtures

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3 |
| **Framework** | None, standard library only |
| **Storage** | None |
| **Testing** | unittest, run through pytest |

### Overview
The verifier already narrows its walk with `EXCLUDED_DIRS` and a git tracked-files filter. A new predicate, `is_unscanned_record_path`, joins those checks inside `iter_code_files`. It returns true when a directory segment is `fixture` or ends in `-fixture`, or when an `evidence` directory sits below a `specs` directory.
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
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-file command-line verifier.

### Key Components
- **`iter_code_files`**: walks each root and yields the files to check. The new skip runs here, so skipped files are never counted as scanned.
- **`is_unscanned_record_path`**: the new predicate. It reads directory segments only, never the file name.

### Data Flow
Roots go into the walk, the walk filters by excluded directories, record paths and git tracking, and each remaining file goes to `check_file`.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

One unit test builds a temporary tree with three shell scripts missing a shebang: one in a spec evidence folder, one in a `-fixture` tree, and one in a shipped `src/evidence` folder. It asserts the walk skips the first two, keeps the third, and that the command still fails on the third.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None beyond the verifier and its test file.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the two script files. The wrapper then fails again on the same 60 errors.
<!-- /ANCHOR:rollback -->

---
