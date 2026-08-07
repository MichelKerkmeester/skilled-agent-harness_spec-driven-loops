---
title: "Tasks: Phase 007 mcp-aside-devtools mode skill README rewrite"
description: "Task list for the purpose-first rewrite of the mcp-aside-devtools mode skill README with version bump, changelog entry and validation."
trigger_phrases:
  - "phase 007 tasks"
  - "mcp aside devtools readme tasks"
  - "aside devtools rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/007-mcp-aside-devtools"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 007 task list inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute setup, implementation and verification tasks in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/007-mcp-aside-devtools"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 007 mcp-aside-devtools mode skill README rewrite

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T010. `[P0]` blocks phase close, `[P1]` is required or explicitly deferred, `[P]` marks parallelizable tasks.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read the refined README template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and record its section model and required-section rule [evidence: `skill-readme-template.md` read: `9`-section model, required section `OVERVIEW`, numbered ALL-CAPS H2 with `---` dividers]
- [x] T002 [P0] [P] Read the current skill README (`.opencode/skills/mcp-tooling/mcp-aside-devtools/README.md`) and record baseline: version field, validator output and link state [evidence: baseline version `1.0.0.0`, validator exit `0` issues `0`, links `14/14` resolved]
- [x] T003 [P1] [P] Read the mcp-obsidian exemplar README (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) and record its purpose-first structure as the rewrite model [evidence: `mcp-obsidian/README.md` model: pitch blockquote, `AT A GLANCE`, problem-first `OVERVIEW`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Rewrite the README purpose-first per the refined template with a one-line pitch and a problem-first OVERVIEW (`.opencode/skills/mcp-tooling/mcp-aside-devtools/README.md`) [evidence: `README.md` rewritten to `v1.1.0.0`, pitch blockquote + problem-first `OVERVIEW` present, H2 `9/9` numbered]
- [x] T005 [P0] [P] Run the HVR grep over the rewritten README and fix every em dash, semicolon and Oxford comma [evidence: `rg -n` em dash `0`, semicolon `0` prose hits (code-fence hits exempt), Oxford comma `0`]
- [x] T006 [P0] [P] Bump the frontmatter version field and add the changelog entry `changelog/v1.1.0.0.md` [evidence: frontmatter version `1.1.0.0`, `changelog/v1.1.0.0.md` created, validator exit `0` issues `0`]
- [x] T007 [P1] Diff the rewritten README against the current one section by section and confirm every fact survives [evidence: token diff `64/64` old facts present in new, sections `9/9` mapped]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 [P0] Run `validate_document.py --type readme` on the README and record zero issues [evidence: `validate_document.py` exit `0`, issues `0`]
- [x] T009 [P1] Run the link guard and `git diff --check`, then confirm the scope diff touches only the README and the changelog entry [evidence: links `16/16` resolve, `git diff --check` exit `0`, scope `2/2` writable files plus phase docs]
- [x] T010 [P1] Run `validate.sh` on this phase folder with zero errors and record evidence in checklist.md [evidence: `validate.sh` exit `0`, errors `0`, metadata `description.json` + `graph-metadata.json` regenerated]
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
- Target README: `.opencode/skills/mcp-tooling/mcp-aside-devtools/README.md`
<!-- /ANCHOR:cross-refs -->
