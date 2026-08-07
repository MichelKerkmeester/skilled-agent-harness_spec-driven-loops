---
title: "Verification Checklist: Phase 008 - README template descriptive-voice revision"
description: "Verification evidence for the descriptive-voice revision of the standalone and parent-hub README templates."
trigger_phrases:
  - "phase 008 checklist"
  - "readme template revision verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/008-readme-descriptive-voice-revision"
    last_updated_at: "2026-08-05T13:55:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 008 verification checklist"
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
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: Phase 008 - README template descriptive-voice revision

<!-- ANCHOR:protocol -->
## 1. Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Required message or structure invariant | Cannot close the phase |
| **[P1]** | Required documentation and metadata check | Must complete or be explicitly deferred |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## 2. Pre-Implementation

- [x] CHK-001 [P0] Sources read before writing: both templates, the root README and `hvr-rules.md` [evidence: read list recorded before any edit]
- [x] CHK-002 [P0] Six brevity limiters confirmed and S1 through S7 mapped to REQ-001..REQ-007 [evidence: limiter list and suggestion-to-REQ map in `spec.md`]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## 3. Code Quality

- [x] CHK-010 [P0] Skill template asks for a 3 to 6 sentence problem narrative with a worked example, the two-to-four-sentence cap is gone (REQ-001) [evidence: scaffold `Why This Skill Exists` rewritten with worked-example comment]
- [x] CHK-011 [P0] Capability section requires a prose lead-in before the table and permits one analogy (REQ-002) [evidence: `Capability Section Pattern` and scaffold capability block edited]
- [x] CHK-012 [P0] HOW IT WORKS carries an expected-for-multi-step ASCII diagram, not an optional only-if (REQ-003) [evidence: section-model `HOW IT WORKS` row and scaffold Section 4 diagram stub]
- [x] CHK-013 [P0] Parent template mirrors S1 through S5: narrative story, hub diagram, modes lead-in and value beat (REQ-007) [evidence: parent 4.1, 4.2 and scaffold `OVERVIEW` plus modes table edited]
- [x] CHK-014 [P0] Skill template 1.10.0.0, parent template 1.1.0.0, `changelog/v1.2.0.0.md` documents both (REQ-008) [evidence: `grep '^version:'` 1.10.0.0 and 1.1.0.0; changelog entry present]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## 4. Testing

- [x] CHK-020 [P0] HVR grep on both template bodies returns zero em dashes, semicolons and Oxford commas outside code fences (REQ-008) [evidence: `rg` on both templates: 0/0/0 outside the banned-word list]
- [x] CHK-021 [P0] Throwaway sample from the revised scaffold validates with zero issues and stays out of the repo (SC-001) [evidence: `validate_document.py --type readme` exit 0, sample in scratch outside repo]
- [x] CHK-022 [P1] AT A GLANCE stays the first numbered section after the narrative-hook addition (REQ-005) [evidence: scaffold hook sits between the blockquote and Section 1 `AT A GLANCE`]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## 5. Fix Completeness

- [x] CHK-030 [P1] Every suggestion S1 through S7 is traceable to a REQ and present in a template (SC-002) [evidence: `tasks.md` T003..T008 evidence rows map each suggestion to its edit site]
- [x] CHK-031 [P1] Optional Why It Matters value beat and the clarity-not-length rule are present (REQ-004, REQ-006) [evidence: OVERVIEW `Why It Matters` value beat and the descriptive-length Writing Rule added to both templates]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## 6. Security

- [x] CHK-032 [P1] No vault, plugin, runtime or SKILL.md files touched (REQ-008) [evidence: `git status` limited to the two templates, the changelog, the 007 row and this phase's docs]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## 7. Documentation

- [x] CHK-033 [P0] Every requirement REQ-001..REQ-008 has verified acceptance evidence recorded (SC-002) [evidence: each REQ traced through `tasks.md` and this checklist]
- [x] CHK-034 [P1] Phase validation errors zero on 008 and the parent packet (SC-004) [evidence: `validate.sh --strict` Errors 0 on 008 and parent 026]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## 8. File Organization

- [x] CHK-035 [P1] No files moved or renamed, `git diff --check` clean (SC-004) [evidence: `git status` shows only in-scope changes, `git diff --check` reports nothing]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## 9. Verification Summary

| Category | Total | Verified |
|----------|------:|---------:|
| P0 items | 8 | 0/8 |
| P1 items | 7 | 0/7 |

**Verification Date**: Pending
<!-- /ANCHOR:summary -->
