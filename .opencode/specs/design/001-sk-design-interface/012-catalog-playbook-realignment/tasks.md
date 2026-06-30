---
title: "Tasks: Phase 12: catalog-playbook-realignment [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-design-interface catalog realignment tasks"
  - "phase 012 tasks"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "design/001-sk-design-interface/012-catalog-playbook-realignment"
    last_updated_at: "2026-06-17T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded the realignment phase; content delegated to a scoped writer"
    next_safe_action: "Validate the catalog/playbook and the phase"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-interface/feature_catalog/feature_catalog.md"
      - ".opencode/skills/sk-design-interface/manual_testing_playbook/manual_testing_playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-148-012-catalog-playbook-realignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 12: catalog-playbook-realignment

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

> Audit the gap.

- [x] T001 Audit feature_catalog + playbook vs the phase-011 reality; confirm the Mobbin/Refero capability and routing are uncatalogued/untested
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> Add the missing coverage.

- [x] T002 Add `feature_catalog/03--design-grounding/design-references-grounding.md` (Mobbin/Refero + hybrid routing)
- [x] T003 Update `feature_catalog/feature_catalog.md` inventory + §4 narrative + counts
- [x] T004 Add design_references_mcp.md to the critique-against feature's implementation surfaces
- [x] T005 Add a manual_testing_playbook scenario for the initiative/ask routing + source pick + guardrails; update the index/cross-ref/counts
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

> Validate.

- [x] T006 sk-doc validators 0 issues on both indexes; grep confirms no Open Design regression
- [x] T007 Strict-validate this phase; reconcile parent map + children_ids
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
