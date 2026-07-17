---
title: "Tasks: create-benchmark contract-drift remediation"
description: "Task Format: T### [P?] Description (surface)"
trigger_phrases:
  - "create-benchmark contract drift tasks"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-benchmark-authoring-centralization/004-create-benchmark-contract-drift-remediation"
    last_updated_at: "2026-07-14T15:45:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored task breakdown"
    next_safe_action: "Apply runtime changes"
    blockers: []
    key_files: []
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Tasks: create-benchmark contract-drift remediation

<!-- SPECKIT_LEVEL: 2 -->
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

**Task Format**: `T### [P?] Description (surface)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

*Runtime truth + tests — establishes the contract the docs then describe.*

- [x] T001 D5 structural gate exits non-zero (3) in `run-skill-benchmark.cjs` (deep-improvement)
- [x] T002 Add a skill-benchmark test asserting the D5 exit code in `skill-benchmark.vitest.ts` (deep-improvement)
- [x] T003 Define the `alignment` budget cap (1500000) in `framework.md` (+ code/test if enforced) (shared)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

*Doc reconciliation across the disjoint surfaces (parallel).*

- [x] T004 [P] Reconcile create-benchmark docs to the post-change runtime truth in `create-benchmark/SKILL.md` + templates (create-benchmark)
- [x] T005 [P] Reconcile the deep-alignment package's own stale pointers + lifecycle in `behavior_benchmark.md` + scenarios (deep-alignment)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Orchestrator re-verifies each finding fix against files via `git diff` review
- [x] T007 Run touched vitest suites, packager check, link resolution
- [x] T008 Run validate.sh --strict; refresh graph metadata; commit + integrate
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Gates green (packager PASS, vitest pass, 0 new broken links, validate Errors 0)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
