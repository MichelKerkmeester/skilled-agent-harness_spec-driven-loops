---
title: "Tasks: Phase 028 sk-create-flowchart README rewrite"
description: "Task list for rewriting the sk-create-flowchart skill README purpose-first against the refined template from phase 001 and the mcp-obsidian exemplar."
trigger_phrases:
  - "phase 028 tasks"
  - "flowchart readme tasks"
  - "sk-create-flowchart rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/028-sk-create-flowchart"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 028 task list inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute setup, authoring and verification tasks in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/028-sk-create-flowchart"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 028 sk-create-flowchart README rewrite

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T011. `[P0]` marks blocking tasks, `[P1]` marks required tasks.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read the refined README template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and the mcp-obsidian exemplar (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) and record their section maps and required-section rules [evidence: template section model `9/9` sections, OVERVIEW the only required section; exemplar `9` numbered ALL-CAPS H2 sections with `---` dividers]
- [x] T002 [P0] Read the current README at `.opencode/skills/sk-doc/sk-create-flowchart/README.md` and record the baseline: frontmatter version field, `validate_document.py` output and link state [evidence: baseline version `1.0.0.0`, validator exit `0` with `0 issues`, links `7/7` resolve]
- [x] T003 [P1] Record the HVR baseline grep for the current README (em dashes, semicolons, Oxford commas) [evidence: baseline em dash `0`, semicolon `0`, Oxford comma `7` hits in old README body]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Rewrite the README purpose-first per the refined template: one-line pitch, problem-first OVERVIEW and narrative sections that replace the tabular reference-card sections [evidence: pitch `1/1` blockquote, OVERVIEW problem-first `1/1`, H2 `9/9` numbered ALL-CAPS, capability table `6/6` pattern assets]
- [x] T005 [P0] Bump the README frontmatter version field from the recorded baseline [evidence: version field `1.0.0.0` to `1.0.2.0` in README frontmatter]
- [x] T006 [P0] Add the changelog entry file `.opencode/skills/sk-doc/sk-create-flowchart/changelog/<version>.md` with a version matching the new field and a summary of the rewrite [evidence: entry added at `changelog/v1.0.2.0.md`, frontmatter version `1.0.2.0` matches the field]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 [P0] Run `validate_document.py --type readme` on the rewritten README and confirm zero issues [evidence: validator exit `0`, `0 issues`, document VALID on final README]
- [x] T008 [P0] Run the HVR grep and confirm zero em dashes, semicolons and Oxford commas [evidence: em dash `0`, semicolon `0`, Oxford comma `0` on final README]
- [x] T009 [P1] Run the link guard and confirm every relative link in the rewritten README resolves [evidence: links `7/7` resolve on final README]
- [x] T010 [P1] Check the scope diff and confirm only the README, its changelog entry and phase docs changed, with `git diff --check` clean [evidence: `git diff --check` clean, staged files `0`, this phase changed `2` skill files: README + changelog entry]
- [x] T011 [P1] Run `validate.sh` on this phase folder, confirm zero errors, write the implementation summary, regenerate phase metadata and record evidence in checklist.md [evidence: `validate.sh --strict` exit `0` zero errors, `implementation-summary.md` written, metadata regenerated via `generate-context.js`, checklist P0 `7/7` P1 `9/9`]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The README is purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW, passes the readme validator with zero issues and the HVR grep with zero violations, carries a bumped version field with a matching changelog entry and keeps every fact from the old README. No SKILL.md, template, asset, reference or vault file is modified.
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
- Skill README: `.opencode/skills/sk-doc/sk-create-flowchart/README.md`
<!-- /ANCHOR:cross-refs -->
