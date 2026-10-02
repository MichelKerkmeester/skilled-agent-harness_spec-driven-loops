---
title: "Tasks: Deep-review state-log init through the gateway, and the child-dispatch retry rule"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "review run open tasks"
  - "dispatch retry tasks"
  - "run initialized census task"
  - "attribution collapse tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Deep-review state-log init through the gateway, and the child-dispatch retry rule

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

- [x] T001 Reproduce the attribution collapse on a workflow-opened run [EVIDENCE: sk-git/032 review, gateway exit 2 at ledger sequences 1-3]
- [x] T002 Confirm nothing reads the state log's config row [EVIDENCE: reducer reads deep-review-config.json; no type === config reader in runtime scripts]
- [x] T003 Create worktree 081 for the review fix, held until packet 038 lands
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Replace the direct state-log write with a gateway `run_initialized` call in both review workflows (deep-review-auto.yaml, deep-review-confirm.yaml) [EVIDENCE: worktree 081]
- [x] T005 Mark `deep_review.run_initialized` spoken in the census (deep-review-ledger-types.ts) [EVIDENCE: check-ledger-stem-producers.cjs exit 0]
- [x] T006 Add the retry line to the preamble block and explain it (child-dispatch-preamble.md) [EVIDENCE: worktree 080]
- [ ] T007 Rebase worktree 081 onto main after packet 038 lands and merge
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 End-to-end test of each shipped init step followed by a gateway append (deep-review-run-open.vitest.ts) [EVIDENCE: 3/3 pass]
- [x] T009 Control case: a directly written config row still fails projection [EVIDENCE: same test]
- [ ] T010 Full deep-loop suite after the rebase onto 038, compared with the main baseline
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



