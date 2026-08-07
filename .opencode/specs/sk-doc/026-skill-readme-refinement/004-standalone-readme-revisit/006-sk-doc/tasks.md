---
title: "Tasks: Phase 006 sk-doc standalone README rewrite"
description: "Task list for the purpose-first rewrite of the sk-doc skill README with a version bump and a changelog entry."
trigger_phrases:
  - "phase 006 tasks"
  - "sk doc readme tasks"
  - "standalone readme rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/006-sk-doc"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 006 task list inside 026-skill-readme-refinement"
    next_safe_action: "Execute the setup, implementation and verification tasks in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/006-sk-doc"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 006 sk-doc standalone README rewrite

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T010. Priority tags: `[P0]` blocks phase closeout, `[P1]` required or user-approved deferral.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read the current README at `.opencode/skills/sk-doc/README.md` and record the baseline: the version field value, the pre-rewrite validator output and the link state [evidence: baseline version `1.8.0.36` via `rg -n ^version:`; validator exit 0 with 0 issues; 24/24 links resolve; HVR baseline 3 Oxford-comma hits on lines 40/46/54]
- [x] T002 [P0] Read the refined README template at `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` and the mcp-obsidian exemplar at `.opencode/skills/mcp-tooling/mcp-obsidian/README.md` and record the section model and the one-line pitch pattern [evidence: 9-section model (AT A GLANCE first, OVERVIEW required, numbered ALL-CAPS H2 with `---` dividers, capability section after What It Does) from template Section 2; pitch blockquote + NEW/CHANGED/NOT CHANGED changelog shape from exemplar]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P0] Rewrite `.opencode/skills/sk-doc/README.md` purpose-first per the refined template with a one-line pitch and a problem-first OVERVIEW [evidence: pitch blockquote on line 21, `## 2. OVERVIEW` problem-first at line 36, capability table `### The Type-Aware Enforcement Layer`, 9 numbered ALL-CAPS H2 sections]
- [x] T004 [P0] Bump the version field in the README frontmatter and add the changelog entry at `.opencode/skills/sk-doc/changelog/<version>.md` [evidence: `version: 2.0.0.0` on line 16 (from 1.8.0.36); `.opencode/skills/sk-doc/changelog/v2.0.0.0.md` created with NEW/CHANGED/NOT CHANGED shape]
- [x] T005 [P1] Diff the old README against the new one section by section and confirm every command, path and mode name survives the rewrite [evidence: 43/43 facts survive, MISSING: none (scripted extraction of `/create:*`, `.py`/`.sh` names, paths, `@markdown`, skill names from `git show HEAD` version)]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 [P0] Run `validate_document.py --type readme` on the rewritten README and confirm zero issues [evidence: exit 0, "Total issues: 0"]
- [x] T007 [P0] Run the HVR grep on the rewritten README and confirm zero em dashes, zero semicolons and zero Oxford commas [evidence: `rg` em dash `0` matches, semicolon `0` matches, Oxford `0` matches; banned-word grep `0` hits]
- [x] T008 [P0] Run the link guard on the rewritten README and confirm every link resolves [evidence: 24/24 links resolve, MISSING_LINKS: none]
- [x] T009 [P0] Run `git diff --check` and `validate.sh` on this phase folder and confirm both pass with zero errors [evidence: `git diff --check` exit 0; `validate.sh --strict` -> Errors: 0, Warnings: 0, RESULT: PASSED]
- [x] T010 [P1] Run a scoped `git diff --stat` and confirm the change set is the README and the changelog entry only, then record the verification evidence in checklist.md and write the implementation summary [evidence: scoped diff = README 89+/58- plus new changelog entry and phase docs; no other file modified by this phase]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The README reads purpose-first per the refined template with a one-line pitch and a problem-first OVERVIEW. It passes the README validator with zero issues, the HVR grep and the link guard. The version field is bumped and a changelog entry exists. This phase folder validates with zero errors. No SKILL.md content and no other skill README is modified.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` (REQ-001..REQ-009)
- Plan: `plan.md`
- Checklist: `checklist.md`
- Parent phase spec: `../spec.md` (004-standalone-readme-revisit)
- Refined template: `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`
- Exemplar: `.opencode/skills/mcp-tooling/mcp-obsidian/README.md`
- Target: `.opencode/skills/sk-doc/README.md`
<!-- /ANCHOR:cross-refs -->
