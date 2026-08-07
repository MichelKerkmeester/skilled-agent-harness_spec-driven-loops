---
title: "Tasks - Phase 001 - shared standalone skill README template refinement"
description: "Task list for refining the shared standalone skill README template with the mcp-obsidian pilot learnings."
trigger_phrases:
  - "phase 001 tasks"
  - "readme template refinement tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/001-readme-template-refinement"
    last_updated_at: "2026-08-04T12:40:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 001 tasks"
    next_safe_action: "Execute the template refinement per T001..T012"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-readme-template-refinement"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks - Phase 001 - shared standalone skill README template refinement

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = open. `[x]` = done and carries concrete evidence.
- Task IDs: T001-T012. P-tagged items are blockers.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P] Read the sources: handover §2-§4, the current `skill-readme-template.md`, `hvr-rules.md` and the pilot README at `.opencode/skills/mcp-tooling/mcp-obsidian/README.md` as the capability-section exemplar [evidence: handover sections 2-4, current template, `hvr-rules.md`, pilot `mcp-obsidian/README.md` all read]
- [x] T002 [P] Inventory the current template against each handover §2 directive and capture the gap list in a working note [evidence: gap inventory captured in working note: identity not purpose-first, no capability pattern, no HVR block, no versioning, old checklist]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Rewrite the identity guidance block so the delivered outcome opens before any tooling is named (REQ-001) [evidence: identity guidance rewritten: outcome opens before tool names (`git diff` on template)]
- [x] T004 [P] Add the capability section pattern modeled on the pilot's Plugin Knowledge Layer with example prose (REQ-002) [evidence: capability section pattern added modeled on Plugin Knowledge Layer with example prose]
- [x] T005 [P] Embed the HVR enforcement block with the banned forms and scripted grep commands, linking `hvr-rules.md` (REQ-003) [evidence: HVR block embedded: banned forms verbatim + grep commands + `hvr-rules.md` link]
- [x] T006 [P] Add versioning conventions: README version field and a per-skill changelog entry requirement with format pointer (REQ-004) [evidence: versioning conventions added: README version field + per-skill changelog entry requirement]
- [x] T007 [P] Replace the validation checklist with the stricter set: pitch, AT A GLANCE, numbered ALL-CAPS H2, OVERVIEW required, command output expectations, link verification, `validate_document.py --type readme`, each with a pass criterion (REQ-005) [evidence: validation checklist replaced with 9 stricter items incl. `validate_document.py --type readme`]
- [x] T008 [P] Confirm the section model survives: numbered ALL-CAPS H2 with `---` dividers, AT A GLANCE first with four one-line rows, QUICK START with expected outputs, OVERVIEW as the only required section (REQ-006) [evidence: section model confirmed: numbered ALL-CAPS H2 1-9, AT A GLANCE first, OVERVIEW only required]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 [P] Run the HVR grep on the template body: zero em dashes, semicolons, Oxford commas and banned words [evidence: HVR grep on template body: zero em dashes, semicolons, Oxford commas, banned words]
- [x] T010 [P] Build a throwaway sample README from the refined template in a temp directory, run `validate_document.py --type readme`, expect zero issues, then delete the sample [evidence: throwaway sample README validated `validate_document.py --type readme` exit 0, sample deleted]
- [x] T011 [P] Verify every acceptance criterion for REQ-001..REQ-008 and record evidence in `checklist.md` [evidence: REQ-001..REQ-008 acceptance evidence recorded in checklist]
- [x] T012 [P] Run phase validation and confirm scope: `validate.sh` errors zero and `git status` shows only the template plus the four phase docs [evidence: validate.sh errors 0; `git status` shows template + phase docs only]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The refined template carries every handover §2 directive, validates through a throwaway sample with zero issues, is HVR clean in its own body, keeps the section model stable and ships with phase docs where every REQ has recorded evidence.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` (REQ-001..REQ-008)
- Parent spec: `../spec.md`
- Handover: `../handover.md` (§2 directives, §4 method)
- Template target: `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`
- Human Voice Rules: `.opencode/skills/sk-doc/shared/references/hvr-rules.md`
- Pilot exemplar: `.opencode/skills/mcp-tooling/mcp-obsidian/README.md`
<!-- /ANCHOR:cross-refs -->
