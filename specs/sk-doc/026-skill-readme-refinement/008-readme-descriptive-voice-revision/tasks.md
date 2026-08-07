---
title: "Tasks - Phase 008 - README template descriptive-voice revision"
description: "Task list for the descriptive-voice revision of the standalone and parent-hub README templates."
trigger_phrases:
  - "phase 008 tasks"
  - "readme template revision tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/008-readme-descriptive-voice-revision"
    last_updated_at: "2026-08-05T13:55:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 008 tasks"
    next_safe_action: "Commit the phase so the work is durable"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-readme-descriptive-voice-revision"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks - Phase 008 - README template descriptive-voice revision

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = open. `[x]` = done and carries concrete evidence.
- Task IDs: T001-T012. P-tagged items are blockers.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P] Read both templates, the repo root `README.md` for voice and `hvr-rules.md` for the banned forms [evidence: `skill-readme-template.md`, `parent-skill-readme-template.md`, root `README.md` and `hvr-rules.md` all read before editing]
- [x] T002 [P] Confirm the six brevity limiters and map S1 through S7 to REQ-001..REQ-007 and the exact edit sites [evidence: limiters identified (prose caps, table-first, table-only capability, optional diagram, no value beat, HVR-as-terseness); suggestion-to-REQ map recorded in `spec.md`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Skill template S1: raise the OVERVIEW prose ceiling to a 3 to 6 sentence problem narrative with a worked example in a deletable comment (REQ-001) [evidence: Section Model, Writing Rules and scaffold `Why This Skill Exists` edited; worked example comment added]
- [x] T004 [P] Skill template S2: add a prose lead-in requirement and an analogy license to the capability section (REQ-002) [evidence: `Capability Section Pattern` and scaffold capability block edited]
- [x] T005 [P] Skill template S3: promote the connection diagram to expected-for-multi-step and add an ASCII stub (REQ-003) [evidence: HOW IT WORKS section-model row and scaffold Section 4 edited with a `text` diagram stub]
- [x] T006 [P] Skill template S4: add the optional Why It Matters value beat (REQ-004) [evidence: Section Model note and scaffold OVERVIEW `Why It Matters` block added]
- [x] T007 [P] Skill template S5 and S6: permit a narrative hook after the pitch and add the clarity-not-length writing rule (REQ-005, REQ-006) [evidence: two Writing Rules added; scaffold hook placeholder added; `AT A GLANCE` stays the first numbered section]
- [x] T008 [P] Parent template S7: mirror the narrative story, hub diagram, modes-table prose lead-in and value beat (REQ-007) [evidence: parent 4.1 guidance, 4.2 lead-in and scaffold `OVERVIEW` plus modes table edited]
- [x] T009 [P] Bump versions, add the changelog and update the phase chain: skill template 1.10.0.0, parent 1.1.0.0, `changelog/v1.2.0.0.md`, 007 Successor to 008 (REQ-008) [evidence: `grep '^version:'` shows 1.10.0.0 and 1.1.0.0; `changelog/v1.2.0.0.md` created; 007 spec Successor row updated]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 [P] HVR grep both template bodies: zero em dashes, semicolons and Oxford commas in prose [evidence: `rg` on both templates returned 0/0/0 for em dashes, semicolons and Oxford commas outside the intentional banned-word list]
- [x] T011 [P] Build a throwaway sample from the revised scaffold, validate, keep it out of the repo [evidence: `validate_document.py --type readme` exit 0, 0 issues on the scratch sample]
- [x] T012 [P] Regenerate metadata, run `validate.sh --strict` on 008 and the parent, confirm scope and `git diff --check` [evidence: description.json and graph-metadata.json regenerated; validate.sh --strict green; scope limited to in-scope files]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

Both templates carry every S1 through S7 change, are HVR clean in their own bodies, keep the section model and the AT A GLANCE first-section contract stable, and ship with version bumps, a changelog entry and phase docs where every REQ has recorded evidence. A throwaway sample from the revised scaffold validates with zero issues.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` (REQ-001..REQ-008)
- Parent spec: `../spec.md`
- Predecessor: `../007-fix-post-closeout-gates-for-readme-fleet/spec.md`
- Skill template: `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`
- Parent template: `.opencode/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-readme-template.md`
- Human Voice Rules: `.opencode/skills/sk-doc/shared/references/hvr-rules.md`
<!-- /ANCHOR:cross-refs -->
