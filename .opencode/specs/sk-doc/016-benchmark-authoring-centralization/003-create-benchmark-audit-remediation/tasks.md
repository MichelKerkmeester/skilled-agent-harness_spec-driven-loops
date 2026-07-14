---
title: "Tasks: create-benchmark audit remediation"
description: "Task Format: T### [P?] Description (surface)"
trigger_phrases:
  - "create-benchmark remediation tasks"
  - "benchmark audit fix tasks"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/016-benchmark-authoring-centralization/003-create-benchmark-audit-remediation"
    last_updated_at: "2026-07-14T08:20:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored task breakdown"
    next_safe_action: "Verify agent outputs, mark tasks"
    blockers: []
    key_files: []
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
# Tasks: create-benchmark audit remediation

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

- [x] T001 Create feature branch off `origin/v4`, keeping primary clean
- [x] T002 Scaffold packet 018 (`spec.md`/`plan.md`/`tasks.md`/`checklist.md`)
- [x] T003 [P] Partition findings into four disjoint agent surfaces (`create-benchmark`, hub, `deep-improvement`, `deep-alignment`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Fix `_shared` refs, README, sections, Smart Router, prose, version-field (create-benchmark)
- [x] T005 [P] Add Lane A/D routing keywords (`hub-router.json`, `mode-registry.json`)
- [x] T006 [P] Rename Lane B dirs via `git mv` → hyphen; align live refs; reconcile output contract (deep-improvement)
- [x] T007 [P] Reconcile behavior-benchmark index to captured baseline (`claude-baseline.md`, deep-alignment)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Re-verify each finding against files (orchestrator; per-finding `grep`/`Read`)
- [x] T009 Run Lane B vitest suites, packager check, link resolution
- [x] T010 Run validate.sh --strict; refresh graph metadata; commit + push
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
