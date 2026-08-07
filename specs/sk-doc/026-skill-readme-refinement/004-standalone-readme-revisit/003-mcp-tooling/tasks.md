---
title: "Tasks: Phase 3 mcp-tooling README rewrite"
description: "Task list for rewriting the mcp-tooling hub README against the refined standalone template with the mcp-obsidian exemplar shape."
trigger_phrases:
  - "phase 3 tasks"
  - "mcp tooling readme tasks"
  - "hub readme rewrite tasks"
  - "mcp tooling changelog tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/003-mcp-tooling"
    last_updated_at: "2026-08-04T12:52:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Executed phase 3: README rewritten purpose-first, version bumped to 1.5.0.0, gates green"
    next_safe_action: "Parent packet closeout: reconcile phase status and run fleet-wide validation"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-mcp-tooling"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 3 mcp-tooling README rewrite

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T011. `[P0]` marks blocking tasks, `[P1]` marks required tasks.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read the refined standalone README template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and the mcp-obsidian exemplar README (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) and record the section model and the required section rule [evidence: template read: 9-section model, numbered ALL-CAPS H2, OVERVIEW required, pitch blockquote after H1; exemplar shape confirmed]
- [x] T002 [P0] Read the current README `.opencode/skills/mcp-tooling/README.md` and record the baseline: version field, section inventory and factual claims [evidence: baseline `version: 1.0.0.0`, 5 sections (AT A GLANCE, OVERVIEW, QUICK START, RELATED SKILLS, VERIFICATION), 13 fact clusters inventoried]
- [x] T003 [P1] Run the baseline validator and the link guard on the current README and record the output [evidence: baseline `validate_document.py --type readme` exit 0 / 0 issues; link guard 8 pre-existing failures, 0 in hub README]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Rewrite `.opencode/skills/mcp-tooling/README.md` purpose-first per the refined template with a one-line pitch and a problem-first OVERVIEW, keeping the seven registered modes and their routing facts [evidence: rewrite landed: pitch blockquote + problem-first OVERVIEW + routing surface table with 7 mode links at `.opencode/skills/mcp-tooling/README.md`]
- [x] T005 [P0] Bump the frontmatter version field and add the matching changelog entry under `.opencode/skills/mcp-tooling/changelog/<version>.md` [evidence: `version: 1.5.0.0` in frontmatter + `changelog/v1.5.0.0.md` created]
- [x] T006 [P1] Diff the rewrite section by section against the current README and confirm every factual claim survived [evidence: fact-token grep 42/42 preserved against `git show HEAD:README.md`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 [P0] Run `validate_document.py --type readme` on the rewritten README and confirm zero issues [evidence: `validate_document.py --type readme` exit 0, Total issues 0]
- [x] T008 [P0] Run the HVR grep on the README body and confirm zero em dashes, zero semicolons and zero Oxford commas [evidence: `rg -n '\x{2014}'` 0, `rg -n '\x{3B}'` 0, `rg -n ',\s+(and|or)\b'` 0, banned-words grep 0]
- [x] T009 [P1] Run the link guard on the rewritten README and confirm zero unresolved links [evidence: `resolve_skill_markdown_links.py --scope .opencode/skills/mcp-tooling` 0 failures in hub README; 8 failures pre-existing in other packets]
- [x] T010 [P1] Confirm the scope diff shows only the README, the changelog entry and this phase's docs. Confirm `git diff --check` is clean [evidence: `git diff --check` clean; `git status` shows only README + `v1.5.0.0.md` + phase docs]
- [x] T011 [P1] Run `validate.sh` on this phase folder, record the evidence in checklist.md and regenerate the phase metadata [evidence: `validate.sh --strict` exit 0, Errors 0; `generate-context.js` regenerated `description.json` + `graph-metadata.json`]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The rewritten README opens with a one-line pitch and a problem-first OVERVIEW, passes `validate_document.py --type readme` with zero issues, passes the HVR grep, carries a bumped version field with a matching changelog entry and preserves every factual claim of the current document. No SKILL.md, template, other README, vault file, registry or manifest is modified.
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
- Target README: `.opencode/skills/mcp-tooling/README.md`
<!-- /ANCHOR:cross-refs -->
