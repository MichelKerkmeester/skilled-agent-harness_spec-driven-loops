---
title: "Tasks: Phase 2 parent-skill (hub) README template"
description: "Task list for creating the parent-skill README template in the sk-create-skill parent-skill assets folder."
trigger_phrases:
  - "phase 2 tasks"
  - "parent skill readme tasks"
  - "hub readme template tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/002-parent-skill-readme-template"
    last_updated_at: "2026-08-04T12:40:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 2 task list inside 026-skill-readme-refinement"
    next_safe_action: "Execute setup, authoring, and verification tasks in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-parent-skill-readme-template"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 2 parent-skill (hub) README template

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T010. `[P]` marks parallelizable tasks.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the refined standalone README template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and record its section model and required-section rule [evidence: standalone template section model recorded: numbered ALL-CAPS H2, OVERVIEW only required]
- [x] T002 [P] Read the mcp-tooling hub README and the system-deep-loop hub README and record their structural patterns for the modes list, registry navigation, and changelog layout [evidence: mcp-tooling + system-deep-loop hub READMEs read; modes-list/registry/changelog patterns recorded]
- [x] T003 [P] Inventory the parent-skill assets folder (`.opencode/skills/sk-doc/sk-create-skill/assets/parent-skill/`) to align naming and markers with the sibling templates [evidence: parent-skill assets folder inventoried: sibling templates named]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Draft the hub pitch blockquote pattern and the WHY THIS HUB EXISTS guidance (`.opencode/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-readme-template.md`) [evidence: pitch blockquote + WHY THIS HUB EXISTS guidance drafted]
- [x] T005 Draft the MODES AND PACKETS section with per-mode pointer rows for every child packet or mode [evidence: MODES AND PACKETS section with per-mode pointer rows drafted]
- [x] T006 Draft the NAVIGATION section covering `mode-registry.json` and `leaf-manifest.json` with stable relative link guidance [evidence: NAVIGATION section with `mode-registry.json` + `leaf-manifest.json` stable-link guidance drafted]
- [x] T007 Draft the CHANGELOG conventions section and the SCRIPTS AND COMMANDS section with one-line usage per owned script [evidence: CHANGELOG + SCRIPTS AND COMMANDS sections drafted]
- [x] T008 Draft the VERIFICATION section, assemble the full template at the mandated path, and confirm the guidance names the mcp-tooling and system-deep-loop example hubs [evidence: VERIFICATION section drafted; template assembled at mandated path; both example hubs named]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 [P] Run `validate_document.py --type readme` on the template, the HVR grep (zero em dashes and semicolons), the structural section grep, and the example-name grep [evidence: `validate_document.py --type readme` exit 0; HVR grep zero; section grep 1-7; example-name grep both hubs]
- [x] T010 Record verification evidence in checklist.md and write the implementation summary [evidence: evidence recorded in checklist; implementation summary written]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The template file exists at the mandated parent-skill path, covers the six mandated hub surfaces, names both structural example hubs, follows the standalone template family section model, validates as a readme document, and passes the HVR grep. No fleet README or other asset is modified.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` (REQ-001..REQ-009)
- Plan: `plan.md`
- Checklist: `checklist.md`
- Parent packet spec: `../spec.md`
- Standalone template family: `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`
- Structural examples: `.opencode/skills/mcp-tooling/`, `.opencode/skills/system-deep-loop/`
<!-- /ANCHOR:cross-refs -->
