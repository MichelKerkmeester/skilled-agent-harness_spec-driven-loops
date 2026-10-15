---
title: "Tasks: Restore the round-trip of the shipped commit template rules block through the /doctor:git standards serializer"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "standards template round trip tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Restore the round-trip of the shipped commit template rules block through the /doctor:git standards serializer

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

- [x] T001 Record the parsed JSON of the commit rules block and the two failing tests as the baseline (scratch only) [EVIDENCE: parsed contract saved, the two tests failing on HEAD]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Split the `commitId` line into the serializer layout (`.skilled/skills/sk-git/assets/commit-message-template.md`) [EVIDENCE: diff shows one line replaced by six]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T003 Compare the parsed JSON before and after, and run `validate-message.mjs` on a message with a valid and a `0000000` Commit-Id [EVIDENCE: parsed JSON identical (cmp), Commit-Id 1234567 exit 0, 0000000 exit 1, --check-template exit 0]
- [x] T004 Run `git-standards.test.cjs` and `run-all.sh` [EVIDENCE: git-standards.test.cjs 10 of 10, run-all.sh exit 0 with 7 of 7 suites]
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



