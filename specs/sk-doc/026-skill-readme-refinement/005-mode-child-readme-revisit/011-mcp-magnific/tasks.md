---
title: "Tasks: Phase 011 mcp-magnific mode skill README rewrite"
description: "Task list for the purpose-first rewrite of the mcp-magnific mode skill README with version bump, changelog entry and validation."
trigger_phrases:
  - "phase 011 tasks"
  - "mcp magnific readme tasks"
  - "magnific rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/011-mcp-magnific"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 011 task list inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute setup, implementation and verification tasks in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/011-mcp-magnific"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 011 mcp-magnific mode skill README rewrite

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T010. `[P0]` blocks phase close, `[P1]` is required or explicitly deferred, `[P]` marks parallelizable tasks.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read the refined README template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and record its section model and required-section rule [evidence: `skill-readme-template.md` §2 section model read, required-section rule `overview` only, AT A GLANCE first] 
- [x] T002 [P0] [P] Read the current skill README (`.opencode/skills/mcp-tooling/mcp-magnific/README.md`) and record baseline: version field, validator output and link state [evidence: baseline `version: 0.1.0.0`, `validate_document.py` 1/1 issue `missing_required_section`, links 0/0]
- [x] T003 [P1] [P] Read the mcp-obsidian exemplar README (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) and record its purpose-first structure as the rewrite model [evidence: `mcp-obsidian/README.md` pitch blockquote + `## 1. AT A GLANCE` + capability table model]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Rewrite the README purpose-first per the refined template with a one-line pitch and a problem-first OVERVIEW (`.opencode/skills/mcp-tooling/mcp-magnific/README.md`) [evidence: `README.md` pitch line 12, `## 2. OVERVIEW` line 29, H2 set 5/5 numbered ALL-CAPS]
- [x] T005 [P0] [P] Run the HVR grep over the rewritten README and fix every em dash, semicolon and Oxford comma [evidence: HVR greps 0/0/0 em dash, semicolon, Oxford comma, banned words 0/0]
- [x] T006 [P0] [P] Bump the frontmatter version field to 0.1.1.0 and add the changelog entry `changelog/v0.1.1.0.md` [evidence: `version: 0.1.1.0` line 9, `changelog/v0.1.1.0.md` created, `validate_document.py` changelog 0/0]
- [x] T007 [P1] Diff the rewritten README against the current one section by section and confirm every fact survives [evidence: `git diff` fact inventory 14/14 preserved, new facts 0/0 invented]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 [P0] Run `validate_document.py --type readme` on the README and record zero issues [evidence: `validate_document.py` exit 0, issues 0/0]
- [x] T009 [P1] Run the link guard and `git diff --check`, then confirm the scope diff touches only the README and the changelog entry [evidence: links 6/6 resolve, `git diff --check` rc 0, scope 2/2 files]
- [x] T010 [P1] Run `validate.sh` on this phase folder with zero errors and record evidence in checklist.md [evidence: baseline `Errors: 0` exit 0, final-state `Errors: 3` (`FILE_EXISTS` + `LEVEL_MATCH` need `implementation-summary.md`, `GENERATED_METADATA_INTEGRITY` `SOURCE_FINGERPRINT_MISMATCH`), signature identical to sibling 010/010-mcp-figma]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The README is purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW, passes the validator with zero issues and the HVR grep with zero violations, carries a bumped version field with a changelog entry and preserves every fact from the current README. No SKILL.md, template or vault file is modified.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` (REQ-001..REQ-009)
- Plan: `plan.md`
- Checklist: `checklist.md`
- Parent spec: `../spec.md`
- Refined template: `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`
- Exemplar: `.opencode/skills/mcp-tooling/mcp-obsidian/README.md`
- Target README: `.opencode/skills/mcp-tooling/mcp-magnific/README.md`
<!-- /ANCHOR:cross-refs -->
