---
title: "Tasks: Phase 009 mcp-click-up mode skill README rewrite"
description: "Task list for the purpose-first rewrite of the mcp-click-up mode skill README with version bump, changelog entry and validation."
trigger_phrases:
  - "phase 009 tasks"
  - "mcp click up readme tasks"
  - "click up rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/009-mcp-click-up"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 009 task list inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute setup, implementation and verification tasks in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/009-mcp-click-up"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 009 mcp-click-up mode skill README rewrite

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T010. `[P0]` blocks phase close, `[P1]` is required or explicitly deferred, `[P]` marks parallelizable tasks.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read the refined README template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and record its section model and required-section rule [evidence: section model = 9 numbered ALL-CAPS H2 with `---` dividers, `AT A GLANCE` first, `OVERVIEW` required; recorded in `spec.md` REQ-001 notes]
- [x] T002 [P0] [P] Read the current skill README (`.opencode/skills/mcp-tooling/mcp-click-up/README.md`) and record baseline: version field, validator output and link state [evidence: version `1.0.0.7`, validator 0 issues exit 0, links 6/7 resolve with `references/INSTALL-GUIDE.md` broken]
- [x] T003 [P1] [P] Read the mcp-obsidian exemplar README (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) and record its purpose-first structure as the rewrite model [evidence: purpose-first structure recorded: pitch blockquote, `AT A GLANCE` first, capability table in `OVERVIEW`, 9 numbered sections]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Rewrite the README purpose-first per the refined template with a one-line pitch and a problem-first OVERVIEW (`.opencode/skills/mcp-tooling/mcp-click-up/README.md`) [evidence: README rewritten with pitch blockquote, problem-first `OVERVIEW`, `The ClickUp Operation Layer` capability table]
- [x] T005 [P0] [P] Run the HVR grep over the rewritten README and fix every em dash, semicolon and Oxford comma [evidence: 0/0 em dashes, 0/0 semicolons, 0/0 Oxford commas, 0/0 banned words via `rg -n`]
- [x] T006 [P0] [P] Bump the frontmatter version field and add the changelog entry `changelog/v1.1.0.0.md` [evidence: `version: 1.1.0.0` in README frontmatter, entry present at `changelog/v1.1.0.0.md`]
- [x] T007 [P1] Diff the rewritten README against the current one section by section and confirm every fact survives [evidence: token sweep 31/31 facts kept including `cupt prefetch`, `CLICKUP_API_KEY`, `@krodak`, `task-queue-workflow`, `1h30m`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 [P0] Run `validate_document.py --type readme` on the README and record zero issues [evidence: `validate_document.py` exit 0, Total issues 0]
- [x] T009 [P1] Run the link guard and `git diff --check`, then confirm the scope diff touches only the README and the changelog entry [evidence: links 9/9 resolve, `git diff --check` clean, scope diff = `README.md` modified + `changelog/v1.1.0.0.md` added only]
- [x] T010 [P1] Run `validate.sh` on this phase folder with zero errors and record evidence in checklist.md [evidence: `validate.sh` Errors 0, Warnings 1 (scaffold `COMPLEXITY_MATCH`), exit 2 under `--strict`]
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
- Target README: `.opencode/skills/mcp-tooling/mcp-click-up/README.md`
<!-- /ANCHOR:cross-refs -->
