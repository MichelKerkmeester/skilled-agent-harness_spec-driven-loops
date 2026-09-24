---
title: "Implementation Plan: Number create.sh packets at the specs root from the highest existing number"
description: "Replace the per-name, fetching branch count with a ref-only scan for the highest packet branch, and number a root packet after the highest folder and branch, proved by a test that ran red first."
trigger_phrases:
  - "create.sh root numbering"
  - "highest branch number"
  - "scaffold without fetch"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Number create.sh packets at the specs root from the highest existing number

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash 3.2, Node test harness |
| **Framework** | Vitest |
| **Storage** | None |
| **Testing** | A new vitest file that scaffolds in throwaway git repositories, the `cli` vitest project, `test:legacy` and `test:validation` |

### Overview
Two commits. The first replaces the numbering and adds its test, which ran red on every case before the fix. The second records the packet.
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
- [x] Tests passing
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A read-only scan of refs and folders. Nothing is fetched and nothing is written.

### Key Components
- **`highest_branch_number`** in `git-branch.sh`: lists `refs/heads` and `refs/remotes` with `git for-each-ref`, keeps names that start with three digits and a hyphen, and prints the highest number or 0
- **Root folder scan** in `create.sh`: the loop that already numbered tracks, now used for every root, with or without git
- **Branch count**: added only without `--track`, because a track numbers from its own folder

### Data Flow
`resolve_branch_name` scans the root's folders, adds the branch scan when there is no track, and takes the highest number plus one.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each case runs in its own throwaway git repository, which is what puts `create.sh` on the no-track path, and its fixture commit sets `core.hooksPath=/dev/null` so a global hook path cannot apply this repository's commit gates to it. The cases ran red before the fix. Removing only the branch count then turned the two branch cases red and left the folder cases green. The date-shaped branch case was added after the first fix matched `2026-` and numbered a packet 2027, and it ran red against that version.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None beyond git itself.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the fix commit, and its test goes with it.
<!-- /ANCHOR:rollback -->

---
