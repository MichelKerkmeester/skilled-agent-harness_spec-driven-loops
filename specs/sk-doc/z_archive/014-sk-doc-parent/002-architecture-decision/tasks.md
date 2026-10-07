---
title: "Tasks: Architecture decision: registry, router, shared/symlink, advisor plan"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-doc architecture decision tasks"
  - "sk-doc parent phase 002 tasks"
importance_tier: "normal"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: Architecture decision: registry, router, shared/symlink, advisor plan

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [ ] T001 Confirm the phase 001 deep-research rulings and canon are available (`../001-research-and-canon/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Author the decision record with the final packet set, registry/router schema, extensions=[], routingClass rationale (`decision-record.md`)
- [ ] T003 Lock the shared/symlink plan (canonical-in-shared, symlink-inward; the 4 critical facades) (`decision-record.md`)
- [ ] T004 Lock the graph-metadata + description.json + advisor-booster rewrite spec (`decision-record.md`)
- [ ] T005 Lock the atomic command-repoint sequencing plan (`decision-record.md`)
- [ ] T006 Lock the backendKind + vocabularyClasses discriminator vocabulary (`decision-record.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Run `validate.sh` for this folder
- [ ] T008 Record operator review sign-off on the decision record before build phases begin
- [ ] T009 Confirm the registry and router schemas validate bidirectionally as specified
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
