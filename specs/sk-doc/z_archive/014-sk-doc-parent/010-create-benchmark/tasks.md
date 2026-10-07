---
title: "Tasks: Build-or-fold create-benchmark (PROVISIONAL)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-doc create benchmark packet tasks"
  - "sk-doc parent phase 010 tasks"
importance_tier: "normal"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: Build-or-fold create-benchmark (PROVISIONAL)

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

- [ ] T001 Confirm the phase 004 shared/ backbone and facades landed (`../004-shared-backbone/`)
- [ ] T002 Read the 001 build-or-fold ruling for create-benchmark (`../001-research-and-canon/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 KEEP branch: create create-benchmark/ SKILL.md + README.md + changelog/ (`.opencode/skills/sk-doc/create-benchmark/`)
- [ ] T004 KEEP branch: land benchmark_creation.md + benchmark_report_template + source_template with inward symlinks (`.opencode/skills/sk-doc/create-benchmark/`)
- [ ] T005 FOLD branch: move benchmark_creation.md + templates into the shared authoring guides (`.opencode/skills/sk-doc/shared/`)
- [ ] T006 Reconcile the check-markdown-links.cjs allowlist or preserve the assets/benchmark facade (`check-markdown-links.cjs`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Confirm the link checker resolves the benchmark template paths
- [ ] T008 Run `validate.sh` for this folder
- [ ] T009 Confirm the bound benchmark command still resolves on either branch
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
