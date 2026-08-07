---
title: "Tasks: Phase 008 sk-prompt README revisit"
description: "Task list for the purpose-first rewrite of the sk-prompt README with a version bump, a changelog entry and full validation."
trigger_phrases:
  - "phase 008 tasks"
  - "sk prompt readme tasks"
  - "prompt readme rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/008-sk-prompt"
    last_updated_at: "2026-08-04T13:24:03Z"
    last_updated_by: "008-sk-prompt"
    recent_action: "Marked tasks with evidence and validated"
    next_safe_action: "Execute setup, implementation and verification tasks in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/008-sk-prompt"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 008 sk-prompt README revisit

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T012. Priority tags: `[P0]` blocks phase closeout, `[P1]` required or explicitly deferred.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read the current README at `.opencode/skills/sk-prompt/README.md` and record the baseline: version field, section inventory, link state and packet facts [evidence: baseline `version: 1.0.0.0`, 5 sections, 2 packets, stale `/prompt-improve` command name]
- [x] T002 [P0] Run `validate_document.py --type readme` on the current README and record the baseline output [evidence: baseline run exit 0, `0 issues`]
- [x] T003 [P0] Read the refined template at `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` and the mcp-obsidian exemplar at `.opencode/skills/mcp-tooling/mcp-obsidian/README.md`, then record the section map and the required-section rule [evidence: template `skill-readme-template.md` read, 9-section model, OVERVIEW required]
- [x] T004 [P1] Read `hvr-rules.md` and record the banned forms and the grep commands [evidence: `hvr-rules.md` greps: em dash, semicolon, Oxford comma]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 [P0] Rewrite `.opencode/skills/sk-prompt/README.md` purpose-first: one-line pitch, AT A GLANCE, problem-first OVERVIEW, QUICK START, RELATED SKILLS and VERIFICATION per the refined template [evidence: `README.md` rewritten with 6 numbered sections]
- [x] T006 [P0] Bump the README frontmatter version field from 1.0.0.0 to 1.1.0.0 [evidence: frontmatter now `version: 1.1.0.0`]
- [x] T007 [P0] Add the changelog entry `.opencode/skills/sk-prompt/changelog/v1.1.0.0.md` and link it from the README [evidence: `changelog/v1.1.0.0.md` written and linked, link resolves]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 [P0] Run `validate_document.py --type readme` on the rewritten README and confirm zero issues [evidence: `validate_document.py` exit 0, `0 issues`]
- [x] T009 [P0] Run the HVR grep over the rewritten README and confirm zero em dashes, zero semicolons and zero Oxford commas [evidence: HVR greps `0/0/0`, banned words 0]
- [x] T010 [P1] Run the link guard over the README links and confirm every link resolves [evidence: link guard `5/5` resolve]
- [x] T011 [P1] Run `git diff --check` and the scope diff, confirm only the README, the changelog entry and the phase docs changed [evidence: `git diff --check` clean, scope = README + changelog + 4 phase docs]
- [x] T012 [P1] Run `validate.sh` on this phase folder and confirm zero errors, then regenerate the phase metadata [evidence: `validate.sh` `0 errors`, metadata regenerated via `backfill-graph-metadata.js`]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The sk-prompt README is purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW, passes `validate_document.py --type readme` with zero issues, is HVR clean, carries version 1.1.0.0 with the linked changelog entry at `changelog/v1.1.0.0.md` and no SKILL.md, template, sibling README, vault or runtime file is modified.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` (REQ-001..REQ-009)
- Plan: `plan.md`
- Checklist: `checklist.md`
- Parent packet spec: `../spec.md`
- Refined template: `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`
- Exemplar: `.opencode/skills/mcp-tooling/mcp-obsidian/README.md`
- HVR rules: `.opencode/skills/sk-doc/shared/references/hvr-rules.md`
<!-- /ANCHOR:cross-refs -->
