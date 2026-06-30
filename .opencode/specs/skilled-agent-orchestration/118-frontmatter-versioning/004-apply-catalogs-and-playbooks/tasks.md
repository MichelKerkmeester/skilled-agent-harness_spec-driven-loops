---
title: "Tasks: Phase 4: apply-catalogs-and-playbooks [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "scaffold/004-apply-catalogs-and-playbooks"
    last_updated_at: "2026-06-23T07:33:11Z"
    last_updated_by: "template-author"
    recent_action: "Initialize continuity block"
    next_safe_action: "Replace template defaults on first save"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-apply-catalogs-and-playbooks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: apply-catalogs-and-playbooks

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

- [x] T001 Reuse the precomputed manifest instead of re-running the heavy git compute — Evidence: the 9.5-minute compute happens once; apply over this slice then takes seconds.
- [x] T002 Scope the apply to the catalog and playbook classes, roots and leaves — Evidence: scope decision is full-corpus, with a per-feature leaf versioned as much as its root.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Apply the version across all feature-catalog docs (roots and per-feature leaves) — Evidence: 693 feature-catalog docs versioned, all fresh inserts.
- [x] T004 Apply the version across all testing-playbook docs (roots and per-feature leaves) — Evidence: 1,060 testing-playbook docs versioned, all fresh inserts.
- [x] T005 Rely on field-relative insertion for the light two-field frontmatter on leaves — Evidence: version goes last before the closing fence, never inside the trigger array.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Run verify over the catalog and playbook classes — Evidence: PASS, exit 0, ok=1753.
- [x] T007 Run gate over the catalog and playbook classes — Evidence: PASS, exit 0, ok=1753.
- [x] T008 Run a full-corpus gate across all classes — Evidence: PASS, exit 0, ok=2210, 12 skipped, 0.14s.
- [x] T009 Reconcile the applied count to the manifest — Evidence: 1,753 applied; combined with the core phase the whole in-scope corpus (2,210) carries a 4-part version.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (verify and gate exit 0; full-corpus gate clean; counts reconciled)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
