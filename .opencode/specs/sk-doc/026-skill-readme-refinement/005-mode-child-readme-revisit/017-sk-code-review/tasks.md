---
title: "Tasks: Phase 017 sk-code-review mode README rewrite"
description: "Task list for rewriting the sk-code-review mode skill README against the refined README template with the mcp-obsidian exemplar as reference."
trigger_phrases:
  - "phase 017 tasks"
  - "sk-code review readme tasks"
  - "code review readme rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/017-sk-code-review"
    last_updated_at: "2026-08-04T14:52:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 017 task list inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute setup, implementation and verification tasks in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/017-sk-code-review"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 017 sk-code-review mode README rewrite

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T012. Each task carries a `[P0]` or `[P1]` priority tag.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read the refined README template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and record the readiness gate (template path and the OVERVIEW-only required section rule) [evidence: template read at `skill-readme-template.md`; OVERVIEW-only rule confirmed in Section 2 Section Model row 2] 
- [x] T002 [P0] Read the current README (`.opencode/skills/sk-code/sk-code-review/README.md`) and record the baseline: version field, `validate_document.py` output and link state [evidence: baseline `version: 1.0.0.0`; `validate_document.py` exit 0 (0 issues); 11/11 links resolved pre-rewrite] 
- [x] T003 [P1] Read the mcp-obsidian exemplar README (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) and record its purpose-first structure [evidence: exemplar `mcp-obsidian/README.md` 9-section order recorded: pitch, AT A GLANCE, OVERVIEW, QUICK START, HOW IT WORKS, INTEGRATION, TROUBLESHOOTING, FAQ, VERIFICATION, RELATED DOCUMENTS]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Rewrite the README purpose-first per the refined template with a one-line pitch and a problem-first OVERVIEW [evidence: README rewritten at `.opencode/skills/sk-code/sk-code-review/README.md`; pitch blockquote after H1, OVERVIEW opens with reader situation before any feature list] 
- [x] T005 [P0] Bump the version field in the README frontmatter [evidence: `version: 1.0.0.0` -> `version: 1.6.0.0` in frontmatter] 
- [x] T006 [P0] Add the changelog entry `changelog/<version>.md` recording the rewrite [evidence: added `changelog/v1.6.0.0.md` titled entry covering the README rewrite] 
- [x] T007 [P1] Run a section-by-section diff against the old README and confirm every fact survives [evidence: 17/17 fact tokens preserved, 3/3 `Review status:` canary strings present, 5/5 trigger phrases preserved, 11/11 links resolve]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 [P0] Run `validate_document.py --type readme` on the README and confirm zero issues [evidence: `validate_document.py` exit 0, total issues 0] 
- [x] T009 [P0] Run the HVR grep on the README body and confirm zero em dashes, zero semicolons and zero Oxford commas [evidence: `rg` em dash 0/0, semicolon 0/0, Oxford comma 0/0, banned words 0/0] 
- [x] T010 [P1] Run the link guard on the README links and confirm all resolve [evidence: 11/11 relative links resolve on disk] 
- [x] T011 [P1] Run `git diff --check` and confirm clean output, then review the scope diff for out-of-scope changes [evidence: `git diff --check` exit 0; scope diff = `README.md` + `changelog/v1.6.0.0.md` + phase docs only] 
- [x] T012 [P1] Run `validate.sh` on this phase folder and confirm zero errors, then record all evidence in checklist.md [evidence: `validate.sh` exit 0 on phase folder; checklist items CHK-001..CHK-035 marked]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The README opens with a one-line pitch and a problem-first OVERVIEW. The validator reports zero issues and the HVR grep is clean. The version field is bumped with a matching changelog entry and every fact from the old README survives. This phase folder validates with zero errors. No SKILL.md or other skill file is modified.
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
- Target README: `.opencode/skills/sk-code/sk-code-review/README.md`
<!-- /ANCHOR:cross-refs -->
