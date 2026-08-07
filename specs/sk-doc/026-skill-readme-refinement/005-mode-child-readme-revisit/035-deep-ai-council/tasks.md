---
title: "Tasks: Phase 035 deep-ai-council README revisit"
description: "Task list for rewriting the deep-ai-council skill README purpose-first per the refined template with a version bump and a changelog entry."
trigger_phrases:
  - "phase 035 tasks"
  - "deep ai council readme tasks"
  - "council readme rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/035-deep-ai-council"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 035 task list inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute setup, implementation and verification tasks in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/035-deep-ai-council"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 035 deep-ai-council README revisit

This task list sequences the setup, implementation and verification work for the deep-ai-council README rewrite. Every item records concrete command or path evidence when done.

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T012. `[P0]`/`[P1]` marks priority. `[P]` marks parallelizable tasks.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read the refined README template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and the mcp-obsidian exemplar (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) and record the section model and the required-section rule [evidence: read `skill-readme-template.md` section model 9/9 numbered ALL-CAPS H2 with `---` dividers, OVERVIEW required and `mcp-obsidian/README.md` pitch-first exemplar]
- [x] T002 [P0] Read the current README (`.opencode/skills/system-deep-loop/deep-ai-council/README.md`) and record the baseline: `version:` value, `validate_document.py` output and link state [evidence: baseline `version: 2.4.0.0`, `validate_document.py` 0/0 issues exit 0, links 138/138 failures 0]
- [x] T003 [P] Run the HVR grep on the current README and record the pre-rewrite counts for em dashes, semicolons and Oxford commas [evidence: pre-rewrite HVR 0 em dash, 2/2 semicolons, 9/9 Oxford patterns]
- [x] T004 [P] Inventory the changelog folder (`.opencode/skills/system-deep-loop/deep-ai-council/changelog/`) and confirm the `v<version>.md` naming convention and the latest version [evidence: `changelog/` holds `v1.0.0.0.md`..`v2.4.0.0.md`, latest `v2.4.0.0.md`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 [P0] Rewrite the README purpose-first per the refined template: one-line pitch, AT A GLANCE, problem-first OVERVIEW, then the earned sections in the template order, keeping every real fact from the current README (or verify the README already conforms and record that instead) [evidence: rewrite at `README.md` with pitch blockquote + problem-first OVERVIEW, all facts carried: round flow, 6/6 lenses, 3/3 critique roles, two-of-three rule, artifact tree, commands. Validator 0/0]
- [x] T006 [P0] Bump the `version:` field in the README frontmatter to 2.4.1.0 [evidence: `version: 2.4.1.0` in `README.md` frontmatter]
- [x] T007 [P0] Add the changelog entry at `.opencode/skills/system-deep-loop/deep-ai-council/changelog/v2.4.1.0.md` following the folder convention [evidence: `changelog/v2.4.1.0.md` added, folder `v<version>.md` naming]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 [P0] Run `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-deep-loop/deep-ai-council/README.md --type readme` and confirm zero issues [evidence: `validate_document.py` reports 0/0 issues, exit 0]
- [x] T009 [P0] Run the HVR grep on the rewritten README and confirm zero em dashes, zero semicolons and zero Oxford commas [evidence: HVR greps 0/0/0 on `README.md`]
- [x] T010 [P1] Run the link guard and confirm every link in the README resolves [evidence: `resolve_skill_markdown_links.py` 138/138 entries, 0/0 failures]
- [x] T011 [P1] Review `git diff` for scope and hygiene: only the README, its changelog entry and phase docs changed, `git diff --check` clean [evidence: `git diff --check` clean, scoped diff 38+/20- on `README.md`, untracked `changelog/v2.4.1.0.md`]
- [x] T012 [P1] Run `validate.sh` on this phase folder and record zero errors, then regenerate the phase metadata [evidence: `validate.sh` 0/0 errors exit 0, `generate-context.js` refreshed `graph-metadata.json`]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The README is purpose-first with a one-line pitch and a problem-first OVERVIEW, passes the validator with zero issues, passes the HVR grep with zero hits, carries a bumped version field and a matching changelog entry and passes the link guard. The scope diff shows only the README, its changelog entry and phase docs. No `SKILL.md`, sibling README, template or exemplar is modified.
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
- Skill root: `.opencode/skills/system-deep-loop/deep-ai-council/`
<!-- /ANCHOR:cross-refs -->
