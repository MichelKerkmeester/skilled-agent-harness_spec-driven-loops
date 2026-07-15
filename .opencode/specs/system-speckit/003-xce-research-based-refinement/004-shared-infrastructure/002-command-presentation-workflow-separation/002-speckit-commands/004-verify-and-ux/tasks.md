---
title: "Tasks: Speckit Commands - Verify and UX"
description: "Planned task outline for speckit commands verify and ux."
trigger_phrases:
  - "speckit commands verify and ux tasks"
  - "command presentation tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/002-speckit-commands/004-verify-and-ux"
    last_updated_at: "2026-06-10T19:51:18Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Verified speckit router asset references and presentation ownership checks"
    next_safe_action: "Run reference and presentation-placement checks after future command presentation edits"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-10-002-speckit-commands-004-verify-and-ux-planned"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Operator approved Planned implementation-summary stubs for strict validation."
---
# Tasks: Speckit Commands - Verify and UX

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
## PHASE 1: SETUP

- [x] T001 Define cross-model render scenarios (.opencode/commands/speckit/*.md) - Evidence: presentation assets define startup, dashboard, and result-display contracts independent of router wording.
- [x] T002 Verify startup questions are asked consistently (.opencode/commands/speckit/*.md) - Evidence: startup questions now live under each command's presentation asset.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T003 [P] Verify dashboard layout is stable (.opencode/commands/speckit/*.md) - Evidence: grep check found dashboard templates only in presentation assets.
- [x] T004 [P] Verify results-display template is followed (.opencode/commands/speckit/*.md) - Evidence: success, failure, resume brief, and no-session templates are in presentation assets.
- [x] T005 [P] Apply family-specific UX polish plan (.opencode/commands/speckit/*.md) - Evidence: routers now present consistent asset tables, mode routing, and boundary sections.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T006 Record verification evidence for implementation handoff (.opencode/commands/speckit/*.md) - Evidence: implementation summary records reference, presentation-placement, and validation checks.
- [x] T007 Run strict validation for this leaf (.opencode/skills/system-spec-kit/scripts/spec/validate.sh) - Evidence: final strict validation result recorded after reconciliation.
- [x] T008 Confirm implementation-summary.md exists for strict validation (implementation-summary.md) - Evidence: implementation summary updated from planned stub to completion record.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All planned tasks are complete or explicitly deferred with approval
- [x] No blocked tasks remain
- [x] Strict validation passes for this leaf
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Family Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
