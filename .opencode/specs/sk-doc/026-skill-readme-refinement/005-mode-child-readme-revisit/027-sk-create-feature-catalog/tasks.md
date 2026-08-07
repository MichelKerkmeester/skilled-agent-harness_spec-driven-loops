---
title: "Tasks: Phase 027 sk-create-feature-catalog README revisit"
description: "Task list for the create-feature-catalog README rewrite: setup, implementation and verification phases."
trigger_phrases:
  - "phase 027 tasks"
  - "feature catalog readme tasks"
  - "create-feature-catalog readme rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/027-sk-create-feature-catalog"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 027 task list inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute setup, implementation and verification tasks in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/027-sk-create-feature-catalog"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 027 sk-create-feature-catalog README revisit

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T010. `[P0]` marks blocking requirements, `[P1]` marks required work.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read the refined README template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and the mcp-obsidian exemplar (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) and record the section model and the required-section rule [evidence: template `skill-readme-template.md` sections `9/9` matched by new README; OVERVIEW required rule verified at template §2; exemplar pitch blockquote + capability table pattern applied]
- [x] T002 [P0] Read the current README (`.opencode/skills/sk-doc/sk-create-feature-catalog/README.md`) and record the baseline: version field value, `validate_document.py --type readme` output and link state [evidence: baseline `version: 1.0.0.0`; validator `0` issues exit `0`; links `6/6` resolve]
- [x] T003 [P1] Read the latest entry in `.opencode/skills/sk-doc/sk-create-feature-catalog/changelog/` and record the entry format and the next release version [evidence: head `changelog/v1.0.1.1.md`; next release `1.0.1.2`; entry shape `Changed/Not Changed`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Rewrite the README purpose-first per the refined template with a one-line pitch and a problem-first OVERVIEW at `.opencode/skills/sk-doc/sk-create-feature-catalog/README.md` [evidence: pitch blockquote line `3`; numbered H2 `9/9` ALL-CAPS with `---` dividers; `## 2. OVERVIEW` problem-first; capability section `The Catalog Package` table `3/3` rows; validator `0` issues]
- [x] T005 [P0] Run the HVR grep on the rewritten README and fix every em dash, semicolon and Oxford comma [evidence: `rg` em dash `0` hits; semicolon `0` hits; Oxford comma `0` hits; banned words `0` hits]
- [x] T006 [P0] Bump the `version:` field in the README frontmatter to the next release version [evidence: `rg -n '^version:'` -> `1.0.1.2`]
- [x] T007 [P0] Add the changelog entry at `.opencode/skills/sk-doc/sk-create-feature-catalog/changelog/<version>.md` per the recorded entry format [evidence: `changelog/v1.0.1.2.md` created with `Changed` `2` items and `Not Changed` `3` items]
- [x] T008 [P1] Diff the old and new README section by section and confirm every fact, link and capability is preserved [evidence: token inventory `19/19` surfaces preserved; links `6/6`; capabilities `create-readme`/`create-manual-testing-playbook`/`create-quality-control` boundaries kept]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 [P0] Run `validate_document.py --type readme`, the HVR grep, the link guard (`check-markdown-links.cjs`) and `git diff --check` on the rewritten README [evidence: validator `0` issues exit `0`; HVR `0/0/0`; links `6/6` resolve (repo-wide guard pre-existing failures in other files only); `git diff --check` exit `0`]
- [x] T010 [P1] Run `validate.sh --strict` on this phase folder, confirm the scope diff shows only README.md, the changelog entry and phase docs and record the evidence in checklist.md [evidence: `validate.sh --strict` Errors `0` Warnings `0` RESULT PASSED; scope `git status` shows only `README.md`, `changelog/v1.0.1.2.md` and phase docs]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The README is purpose-first per the refined template with a one-line pitch and a problem-first OVERVIEW, passes `validate_document.py --type readme` with zero issues, is HVR clean, carries a bumped version field with a matching changelog entry, preserves every fact from the old version and this phase folder validates with zero errors. No SKILL.md, template or vault file is modified.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` (REQ-001..REQ-009)
- Plan: `plan.md`
- Checklist: `checklist.md`
- Parent phase spec: `../spec.md` (005-mode-child-readme-revisit)
- Refined template: `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`
- Exemplar: `.opencode/skills/mcp-tooling/mcp-obsidian/README.md`
- Target README: `.opencode/skills/sk-doc/sk-create-feature-catalog/README.md`
<!-- /ANCHOR:cross-refs -->
