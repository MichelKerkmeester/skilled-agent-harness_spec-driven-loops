---
title: "Tasks: Brand-First Authoring Lane"
description: "Completed task breakdown for the brand-first lane's distinct exports, provenance schema, overwrite policy, manual review gate, and adversarial verification."
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/004-hallmark-design-system/004-brand-first-lane"
    last_updated_at: "2026-07-22T19:01:14Z"

    last_updated_by: "spec-author"
    recent_action: "Completed all implementation and verification tasks"
    next_safe_action: "Use the lane through its shared reference procedure"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/SKILL.md"
      - ".opencode/skills/sk-design/shared/references/brand-first-lane.md"
      - ".opencode/skills/sk-design/shared/scripts/brand-first-boundary.test.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Brand-First Authoring Lane

<!-- ANCHOR:notation -->
## Task Notation

Each completed task cites the built file or fresh verification output that proves it.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scaffold the distinct `AUTHORED-DESIGN.md` and `authored-tokens.json` templates with the separate `sk-design/authored-brand/v1` schema. [EVIDENCE: `.opencode/skills/sk-design/shared/authored-brand/authored-design-template.md`]
- [x] T002 Define exact `origin: authored` and per-value source/date/confidence provenance. [EVIDENCE: `.opencode/skills/sk-design/shared/authored-brand/authored-provenance-schema.md`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Implement the product-description-to-palette/type/voice procedure and authored-only writer. [EVIDENCE: `shared/references/brand-first-lane.md`; `shared/authored-brand/authored-brand-boundary.mjs`]
- [x] T004 Implement measured-path refusal and authored-export-only refresh behavior. [EVIDENCE: `refreshAuthoredExports` and `assertAuthoredDestination`; boundary subtests 1-2 pass]
- [x] T005 Implement the reviewed-conversion gate as a documented manual checklist with a required signed companion record and no conversion command. [EVIDENCE: `shared/references/brand-first-lane.md` section 4; boundary subtest 4 passes]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Add adversarial measured-path, rendered and structured provenance, mismatched-signature, and unreviewed-conversion tests with positive controls. [EVIDENCE: `brand-first-boundary.test.mjs`: 7/7 pass]
- [x] T007 Confirm authored reruns update both authored exports while measured bytes remain unchanged, including a rejected direct overwrite attempt. [EVIDENCE: `node .opencode/skills/sk-design/shared/scripts/brand-first-boundary.test.mjs` subtest 2 passes]
- [x] T008 Run `validate.sh --strict` on this spec folder and record the evidence in checklist.md. [EVIDENCE: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/004-brand-first-lane --strict` final run reports Errors 0, Warnings 0, RESULT PASSED]
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
