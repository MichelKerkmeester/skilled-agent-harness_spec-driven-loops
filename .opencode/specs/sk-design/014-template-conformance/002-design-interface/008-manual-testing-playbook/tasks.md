---
title: "Tasks: design-interface manual-testing-playbook conformance"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "manual-testing-playbook tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/002-design-interface/008-manual-testing-playbook"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Planned tasks.md"
    next_safe_action: "Start T001"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: design-interface manual-testing-playbook conformance

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Search git log / spec folders for a `foundations` → `design-interface` consolidation trail
- [ ] T002 Read `foundations-direct-fallback-without-subagents.md` and `foundations-no-card-fallback.md` in full (only `foundations-card-selection-proof.md` read so far)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Confirm or refute the mode-consolidation hypothesis with evidence
- [ ] T004 [B] Get operator sign-off on `foundations-*` disposition (blocked on T003)
- [ ] T005 [B] Apply approved disposition (blocked on T004)
- [ ] T006 [P] Audit `abstention-and-routing/`, `brief-pinning-and-precedence/`, `brief-to-dials-intake/`
- [ ] T007 [P] Audit `color/`, `content-and-mock-data-gate/`, `data-viz/`
- [ ] T008 [P] Audit `design-references-routing/`, `direction-freedom-and-deviation/`, `layout/`
- [ ] T009 [P] Audit `mechanical-layout-gate/`, `mechanical-preflight-card/`, `quality-floor-gate/`
- [ ] T010 [P] Audit `real-ui-loop/`, `redesign-intake/`, `system-as-critique-against/`
- [ ] T011 [P] Audit `tokens/`, `type/`, `worked-examples/`
- [ ] T012 Confirm `licensing-and-provenance/` `ID-007` is noted but left untouched
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Confirm no scenario ID was renumbered across the whole folder
- [ ] T014 Spot-check the 9-column contract on a sample row from each of the 20 categories
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
