---
title: "Tasks: Phase 007 sk-git standalone README revisit"
description: "Task list for rewriting the sk-git skill README against the refined README template and the mcp-obsidian exemplar."
trigger_phrases:
  - "phase 7 tasks"
  - "sk-git readme tasks"
  - "git readme rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/007-sk-git"
    last_updated_at: "2026-08-04T13:26:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 7 task list inside 004-standalone-readme-revisit"
    next_safe_action: "Execute setup, implementation and verification tasks in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/007-sk-git"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 007 sk-git standalone README revisit

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T010. `[P]` marks parallelizable tasks.
- Priority tags: `[P0]` blocks phase completion, `[P1]` required or explicitly deferred.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read the current README (`.opencode/skills/sk-git/README.md`) and record the baseline: version field value, `validate_document.py` output and link state [evidence: `version: 1.4.0.0` at frontmatter line 10, `validate_document.py` exit `0` with `Total issues: 0`, 13/13 relative link targets resolved, em dash at line `102`, semicolons `0`, Oxford-comma hits `13`]
- [x] T002 [P0] Read the refined standalone README template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and the mcp-obsidian exemplar (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) and record the section model and the required-section rule [evidence: template §2 section model `1..9` with AT A GLANCE first and OVERVIEW required, exemplar `mcp-obsidian/README.md` 9-section purpose-first shape]
- [x] T003 [P1] Inventory the changelog folder (`.opencode/skills/sk-git/changelog/`) and record the highest existing entry to set the next version [evidence: `ls` shows 16 entries, highest `v1.3.2.0.md`, next version set to `1.4.1.0`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Rewrite the README purpose-first per the refined template: one-line blockquote pitch, AT A GLANCE table first, problem-first OVERVIEW and the template section order [evidence: `README.md` H2 sequence `1. AT A GLANCE`..`9. RELATED DOCUMENTS`, pitch line `4`, problem-first `Why This Skill Exists`]
- [x] T005 [P0] Fold the FEATURES, STRUCTURE and REQUIREMENTS content into the template sections and remove the em dash at line 102 plus every other HVR violation [evidence: FEATURES -> `The Git Workspace Safety Layer` in OVERVIEW, STRUCTURE -> `Skill Layout` in §5, REQUIREMENTS -> §3, em dash `rg \x{2014}` `0`, semicolons `0`, Oxford commas `0`, banned words `0`]
- [x] T006 [P0] Bump the version field in the README frontmatter to the next version [evidence: `rg -n "^version:"` -> `version: 1.4.1.0`]
- [x] T007 [P0] Add the matching changelog entry at `.opencode/skills/sk-git/changelog/<version>.md` [evidence: file `changelog/v1.4.1.0.md` created, entry header `[**1.4.1.0**] - 2026-08-04`, HVR clean]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 [P0] Run `validate_document.py .opencode/skills/sk-git/README.md --type readme` and confirm zero issues [evidence: exit `0`, `Total issues: 0`]
- [x] T009 [P1] [P] Run the HVR grep (`rg -n` for em dashes, semicolons and Oxford commas), the link guard over every relative link and `git diff --check` on the README diff [evidence: em dash `0`, semicolon `0`, Oxford comma `0`, banned words `0`, 14/14 links resolve, `git diff --check` exit `0`]
- [x] T010 [P1] Run the section-by-section diff against the prior README, confirm the scope diff touches only the README, the changelog entry and this phase folder, run `validate.sh` on this phase folder and record evidence in checklist.md [evidence: 82/82 fact tokens preserved, scope = `README.md` + `changelog/v1.4.1.0.md` + phase folder, `validate.sh --strict` exit `0` with `Errors: 0 Warnings: 0`]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The README reads purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW, passes the readme validator with zero issues and the HVR grep with zero em dashes, zero semicolons and zero Oxford commas, carries a bumped version field with a matching changelog entry and this phase folder validates with zero errors. No SKILL.md content, sibling README, template or vault file is modified.
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
- Skill root: `.opencode/skills/sk-git/README.md`
<!-- /ANCHOR:cross-refs -->
