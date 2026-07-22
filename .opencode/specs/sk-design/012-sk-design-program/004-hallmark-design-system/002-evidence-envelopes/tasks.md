---
title: "Tasks: Shared Evidence Envelopes"
description: "Task breakdown for authoring and wiring the owned-asset manifest, motionCharacter handoff, and conditional measured Motion section; planned, not implemented."
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/004-hallmark-design-system/002-evidence-envelopes"
    last_updated_at: "2026-07-22T18:01:08Z"

    last_updated_by: "spec-author"
    recent_action: "Authored the Phase 2 task breakdown (planned)"
    next_safe_action: "Await Phase 1 (001-surgical-fixes) completion, then begin Phase 2 implementation per tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/SKILL.md"
      - ".opencode/skills/sk-design/references/design-md-format.md"
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

# Tasks: Shared Evidence Envelopes

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` = not started, `[x]` = complete. Format: `- [ ] T00N <description>. [SOURCE: <reference>]`. All tasks below are unstarted (planned packet).
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Verify the three cited sk-design wiring points (`schema-v3.ts:134`, `types.ts:258`, `design-md-format.md:200`) against current code before any edits. [SOURCE: spec.md Open Questions]
- [ ] T002 Confirm Phase 1 (`001-surgical-fixes`) is complete before starting Phase 2 implementation. [SOURCE: spec.md Metadata Predecessor]
- [ ] T003 Review both Hallmark adoption research syntheses for manifest and motion grounding. [SOURCE: ../../001-research/004-hallmark-design-skill-research/research/]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Author the provider-neutral owned-asset manifest schema (source, rights, dimensions, role, crop/aspect, checksum, fallback) with an explicit never-hotlink-Hallmark-binaries constraint. [SOURCE: spec.md REQ-001]
- [ ] T005 Document which manifest fields have Hallmark precedent (source, dimensions, role, fallback) versus net-new fields (rights, crop/aspect, checksum). [SOURCE: spec.md REQ-002]
- [ ] T006 Author the `motionCharacter` semantic enum (quiet / snappy / elastic / static-first) mapped onto sk-design's existing timing/easing bands, introducing no new duration-multiplier tokens. [SOURCE: spec.md REQ-003]
- [ ] T007 Specify interruption, reversal, and async proof requirements for the `motionCharacter` handoff. [SOURCE: spec.md REQ-004]
- [ ] T008 Add the conditional measured Motion section to the v3 schema (`schema-v3.ts`) and its types (`types.ts`). [SOURCE: spec.md REQ-005]
- [ ] T009 Wire the formatter/prompt to emit the Motion section only when `MotionSystem` detector evidence is present, and update the validator plus `design-md-format.md`. [SOURCE: spec.md REQ-005, REQ-006]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Add or extend tests covering the conditional Motion section (evidence-present and evidence-absent cases). [SOURCE: plan.md Testing Strategy]
- [ ] T011 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` on this spec folder and record the result in checklist.md. [SOURCE: plan.md Quality Gates]
- [ ] T012 Verify the licensing note: confirm clean-room authorship of the manifest/motion docs and add a Hallmark MIT notice only if text is substantially copied. [SOURCE: spec.md Risks & Dependencies]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All 12 tasks are marked `[x]` with cited evidence; `checklist.md` is fully verified; `validate.sh --strict` reports 0 errors on this spec folder.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Parent packet: `../spec.md` (`012-sk-design-program/004-hallmark-design-system`)
- Predecessor: `../001-surgical-fixes/`
- Successor: `../003-authored-cards/`
- Research grounding: `../../001-research/004-hallmark-design-skill-research/research/`
<!-- /ANCHOR:cross-refs -->
