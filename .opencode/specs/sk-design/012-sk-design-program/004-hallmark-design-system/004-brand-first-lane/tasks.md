---
title: "Tasks: Brand-First Authoring Lane"
description: "Task breakdown for building the brand-first authoring lane's distinct artifact, provenance schema, overwrite policy, and reviewed-conversion gate (planned; not implemented)."
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/004-hallmark-design-system/004-brand-first-lane"
    last_updated_at: "2026-07-22T18:01:08Z"

    last_updated_by: "spec-author"
    recent_action: "Authored the Phase 4 task breakdown (planned)"
    next_safe_action: "Await Phase 3 (003-authored-cards) completion, then begin Phase 4 implementation per tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/SKILL.md"
      - ".opencode/skills/sk-design/references/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Brand-First Authoring Lane

<!-- ANCHOR:notation -->
## Task Notation

Each task uses `- [ ] T00N <description>. [SOURCE: <planned reference>]`. All tasks are unchecked because this packet is Planned and nothing has been built yet; `[SOURCE: ...]` points at the spec/plan section that authorizes the task rather than at built evidence.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Scaffold the distinct authored artifact template (e.g. `AUTHORED-DESIGN.md` + authored tokens) with a name/schema that cannot collide with the measured `DESIGN.md`/`tokens.json`. [SOURCE: spec.md REQ-001, REQ-006]
- [ ] T002 Define the shared origin-label/provenance schema (authored/invented tag, source description, date, confidence note) reusable across authored artifacts. [SOURCE: spec.md REQ-003]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Implement the brand-first lane authoring step that generates palette/type/voice from a short product description and writes only into the distinct authored artifact. [SOURCE: spec.md REQ-001; plan.md Phase 2]
- [ ] T004 Implement the overwrite policy so re-running the lane refreshes only the authored artifact's own exports and never touches measured artifacts. [SOURCE: spec.md REQ-004; plan.md Phase 2]
- [ ] T005 Implement the reviewed-conversion gate as the sole explicit, human-reviewed path by which an authored value may be promoted into the measured corpus. [SOURCE: spec.md REQ-005; plan.md Phase 3]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Write adversarial tests proving no code path writes an authored/invented value into DESIGN.md, tokens.json, or the styles corpus outside the reviewed-conversion gate. [SOURCE: spec.md REQ-002; plan.md Section 5 Testing Strategy]
- [ ] T007 Write overwrite-policy tests confirming re-runs never mutate measured artifacts and only refresh the authored artifact's exports section. [SOURCE: spec.md REQ-004; plan.md Section 5 Testing Strategy]
- [ ] T008 Run `validate.sh --strict` on this spec folder and record the evidence in checklist.md. [SOURCE: plan.md Section 2 Definition of Done]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All tasks T001-T008 are complete and checked; adversarial boundary tests pass; `validate.sh --strict` reports 0 errors; `checklist.md` is fully evidenced.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` Section 4 Requirements (REQ-001..REQ-006).
- `plan.md` Section 3 Architecture, Section 4 Implementation Phases.
- `checklist.md` for verification evidence.
- Predecessor: `../003-authored-cards/`.
- Parent packet: `../spec.md`.
<!-- /ANCHOR:cross-refs -->
