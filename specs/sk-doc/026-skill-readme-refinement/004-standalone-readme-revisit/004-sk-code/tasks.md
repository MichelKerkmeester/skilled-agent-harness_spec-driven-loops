---
title: "Tasks: Phase 004-sk-code standalone README rewrite"
description: "Task list for rewriting the sk-code skill README purpose-first with a version bump, a changelog entry and validation."
trigger_phrases:
  - "phase 004-sk-code tasks"
  - "sk-code readme tasks"
  - "standalone readme rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/004-sk-code"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 004-sk-code task list inside 004-standalone-readme-revisit"
    next_safe_action: "Execute setup, implementation and verification tasks in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-sk-code"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 004-sk-code standalone README rewrite

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T013. `[P]` marks parallelizable tasks.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read `.opencode/skills/sk-code/README.md` and record the baseline (current version field value and the section inventory) [evidence: baseline `version: 4.1.0.0`, 5 H2 sections inventoried] [evidence: old body HVR baseline `2` em dashes and `13` Oxford-comma hits] [evidence: 8 related-document links inventoried]
- [x] T002 [P0] Run `validate_document.py --type readme` on the current README and record the starting issue count [evidence: `validate_document.py` exit 0, `0 issues` on baseline]
- [x] T003 [P0] [P] Scan every internal link in the current README and record the link state [evidence: link scan `8/8` resolve]
- [x] T004 [P1] [P] Read the refined template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and the exemplar (`.opencode/skills/mcp-obsidian/README.md`) and record the target section model [evidence: template `skill-readme-template.md` + exemplar `mcp-obsidian/README.md` section model recorded]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 [P0] Rewrite the README body purpose-first with a one-line pitch blockquote and a problem-first OVERVIEW (`.opencode/skills/sk-code/README.md`) [evidence: rewritten `README.md` with pitch blockquote + problem-first OVERVIEW, `7` sections]
- [x] T006 [P0] Preserve every mode, surface, routing and related-document fact from the old README through the rewrite [evidence: fact-preservation grep `31/31` facts survive]
- [x] T007 [P0] Bump the version field in the README frontmatter from 4.1.0.0 to 4.2.0.0 [evidence: `rg -n "version:"` → `4.2.0.0`]
- [x] T008 [P0] Add `.opencode/skills/sk-code/changelog/v4.2.0.0.md` with the purpose-first rewrite noted [evidence: `changelog/v4.2.0.0.md` created]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 [P0] Run `validate_document.py --type readme` on the rewritten README and confirm zero issues [evidence: validator `0 issues` exit 0]
- [x] T010 [P0] Run the HVR grep and confirm zero em dashes, zero semicolons and zero Oxford commas in the body [evidence: HVR grep `0/0/0/0` on `README.md` and `changelog/v4.2.0.0.md`]
- [x] T011 [P1] [P] Run the link guard and confirm every internal link resolves [evidence: link guard `10/10` links resolve]
- [x] T012 [P1] Run `git diff --check` and the scope diff and confirm only the README and the changelog entry changed [evidence: `git diff --check` exit 0, scoped status shows only README + changelog + phase folder]
- [x] T013 [P1] Run `validate.sh` on this phase folder and confirm zero errors [evidence: `validate.sh` `0 errors`]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The README is rewritten purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW, every old fact survives, the version field is bumped, the changelog entry exists, the HVR grep returns zero hits, the validator reports zero issues and this phase folder validates with zero errors. No `SKILL.md`, template, other README or vault file is modified.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` (REQ-001..REQ-009)
- Plan: `plan.md`
- Checklist: `checklist.md`
- Parent packet spec: `../spec.md`
- Refined template: `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`
- Exemplar: `.opencode/skills/mcp-obsidian/README.md`
<!-- /ANCHOR:cross-refs -->
