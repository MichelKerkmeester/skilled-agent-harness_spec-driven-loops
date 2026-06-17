---
title: "Tasks: Phase 12: catalog-playbook-realignment [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "mcp-open-design catalog realignment tasks"
  - "phase 012 tasks"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/145-mcp-open-design/012-catalog-playbook-realignment"
    last_updated_at: "2026-06-17T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded the realignment phase; content delegated to a scoped writer"
    next_safe_action: "Validate the catalog/playbook and the phase"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-open-design/feature_catalog/03--grounding/design-system-grounding.md"
      - ".opencode/skills/mcp-open-design/manual_testing_playbook/manual_testing_playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-150-012-catalog-playbook-realignment"
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

- [x] T001 Audit catalog/playbook vs the phase-011 reality; confirm the grounding feature said "optional" and no gate scenario existed
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> Reconcile to the mandatory reality.

- [x] T002 Rewrite `feature_catalog/03--grounding/design-system-grounding.md` to MANDATORY / hard-precondition framing (keep the split-doc references)
- [x] T003 Add a manual_testing_playbook gate-enforcement scenario (negative + positive + exemption controls)
- [x] T004 Update the playbook index, cross-reference, waves, counts
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

> Validate.

- [x] T005 sk-doc validators 0 issues; grep confirms no "optional and on-demand"/claude_design_parity residue
- [x] T006 Strict-validate this phase; reconcile parent map + children_ids
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
