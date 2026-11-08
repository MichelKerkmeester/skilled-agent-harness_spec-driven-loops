---
title: "Implementation Plan: Provision private local commands in the form the primary checkout holds them"
description: "Make `_wn_link_local_commands` recreate each private entry in the form the primary checkout holds it, and pin each form in the provisioning test."
trigger_phrases:
  - "provision private command links plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Provision private local commands in the form the primary checkout holds them

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `worktree-naming.test.sh` |

### Overview
Make `_wn_link_local_commands` recreate each private entry in the form the primary checkout holds it, and pin each form in the provisioning test.
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
- [x] `worktree-naming.test.sh` ends `PASS=174 FAIL=0`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single function change

### Key Components
- **`_wn_link_local_commands` in `worktree-naming.sh`**: provisions the private commands into a worktree

### Data Flow
For each `local-*` entry the ignore rules name, the function checks the primary entry: a link becomes the same link text, a folder an absolute link and a file a copy.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup reproduces the defect, Implementation fixes it with a test, and Verification reruns the suites.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run `bash .skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh`, then run it again against the old function to see the new assertions fail.
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
