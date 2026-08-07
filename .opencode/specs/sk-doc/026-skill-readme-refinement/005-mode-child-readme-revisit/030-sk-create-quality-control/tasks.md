---
title: "Tasks: Phase 030 sk-create-quality-control README revisit"
description: "Task list for rewriting the sk-create-quality-control mode skill README purpose-first on the refined template with a version bump and a changelog entry."
trigger_phrases:
  - "phase 030 tasks"
  - "sk create quality control readme tasks"
  - "quality control readme rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/030-sk-create-quality-control"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 030 task list inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute setup, implementation and verification tasks in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/030-sk-create-quality-control"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 030 sk-create-quality-control README revisit

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T009. `[P0]` marks a blocker, `[P1]` marks a required task that may carry a user-approved deferral.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read the current README (`.opencode/skills/sk-doc/sk-create-quality-control/README.md`) and record the baseline: the version field value, the `validate_document.py --type readme` output and the link state [evidence: baseline `version: 1.0.0.0`, `VALIDATOR_EXIT=0` with `Total issues: 0`, links 7/7 resolved]
- [x] T002 [P0] Read the refined template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and the mcp-obsidian exemplar README and record their section model and required-section rule [evidence: template section model 1-9 with `OVERVIEW` required-only, pitch blockquote + AT A GLANCE first; exemplar `mcp-obsidian/README.md` read, links 12/12]
- [x] T003 [P1] Record the changelog head version and the SKILL.md version field to pick the bump target [evidence: head `changelog/v1.0.1.1.md`, `SKILL.md` `version: 1.0.1.1` → bump target `1.0.1.1`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Rewrite the README purpose-first per the refined template with a one-line pitch and a problem-first OVERVIEW, using the mcp-obsidian README as the exemplar (verify-only where the current body already conforms) [evidence: `README.md` rewritten 9641 bytes, 9 H2s `## 1. AT A GLANCE` through `## 9. RELATED DOCUMENTS`, pitch blockquote + problem-first OVERVIEW, facts 4/4 sections preserved]
- [x] T005 [P0] Bump the version field in the README frontmatter to the evidence-backed target [evidence: `version: 1.0.1.1` at README line 9]
- [x] T006 [P0] Add the changelog entry at `changelog/<version>.md` matching the bumped version field [evidence: `changelog/v1.0.1.1.md` extended with `What Changed` → `Documentation` entry]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 [P0] Run `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/sk-doc/sk-create-quality-control/README.md --type readme` and confirm zero issues [evidence: `Total issues: 0`, `VALIDATOR_EXIT=0`]
- [x] T008 [P0] Run the HVR grep (zero em dashes, zero semicolons and zero Oxford commas) and the link guard on the README [evidence: `rg` 0/0/0 em dash/semicolon/Oxford comma, banned words 0 hits, links 9/9]
- [x] T009 [P1] Run the scope diff and `git diff --check`, then run `validate.sh` on this phase folder [evidence: `git diff --check` exit 0, scope 2/2 files, staged 0 files, `validate.sh` Errors 0]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The README is rewritten purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW, reads clean under the HVR grep, carries a bumped version field with a matching changelog entry, passes the README validator with zero issues and resolves every linked path. `git diff --check` is clean, `validate.sh` on this phase folder reports zero errors and no out-of-scope file is modified.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` (REQ-001..REQ-009)
- Plan: `plan.md`
- Checklist: `checklist.md`
- Parent packet spec: `../spec.md` (005-mode-child-readme-revisit)
- Refined template: `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`
- Exemplar README: `.opencode/skills/mcp-tooling/mcp-obsidian/README.md`
- Target README: `.opencode/skills/sk-doc/sk-create-quality-control/README.md`
- Changelog folder: `.opencode/skills/sk-doc/sk-create-quality-control/changelog/`
<!-- /ANCHOR:cross-refs -->
