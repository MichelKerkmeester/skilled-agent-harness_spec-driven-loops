---
title: "Tasks: Phase 010 mcp-figma README rewrite"
description: "Task list for rewriting the mcp-figma skill README against the refined template with a version bump and a changelog entry."
trigger_phrases:
  - "phase 10 tasks"
  - "mcp figma tasks"
  - "mode readme rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/010-mcp-figma"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 10 task list inside 026-skill-readme-refinement"
    next_safe_action: "Execute setup, implementation and verification tasks in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/010-mcp-figma"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 010 mcp-figma README rewrite

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T009. `[P]` marks parallelizable tasks.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read the current README (`.opencode/skills/mcp-tooling/mcp-figma/README.md`) and record the baseline: version field value, `validate_document.py` output and link state [evidence: `version: 1.0.0.2`, `EXIT=0`, `Total issues: 0`, baseline links `ALL RESOLVE`]
- [x] T002 [P0] Read the refined README template from phase 001 (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and record its section model and required-section rule [evidence: section model `9` numbered ALL-CAPS H2, `OVERVIEW` required, `AT A GLANCE` first]
- [x] T003 [P1] [P] Read the mcp-obsidian exemplar README (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) and record its pitch, overview and section order [evidence: pitch blockquote after H1, `AT A GLANCE` first, `9` sections in template order]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Rewrite the README per the refined template: one-line pitch, AT A GLANCE, problem-first OVERVIEW and the remaining sections in the exemplar order [evidence: H2 order `1..9` ascending, pitch line 21 blockquote, `The Figma Document Layer` table, token survival `84/84`]
- [x] T005 [P0] Bump the version field in the README frontmatter above `1.0.0.2` [evidence: `version: 1.1.0.0` in frontmatter, `1.0.0.2` -> `1.1.0.0`]
- [x] T006 [P0] Add the changelog entry at `changelog/<version>.md` noting the README rewrite [evidence: `changelog/v1.1.0.0.md` exists, HVR `0/0/0`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 [P0] [P] Run `validate_document.py --type readme` on the README, the HVR grep (zero em dashes, zero semicolons and zero Oxford commas), the link guard, `git diff --check` and the scope diff [evidence: `EXIT=0`, HVR `0/0/0`, links `ALL RESOLVE`, `git diff --check` `clean`]
- [x] T008 [P1] Run `validate.sh` on this phase folder and record the output [evidence: `Errors: 0` `RESULT: PASSED`]
- [x] T009 [P1] Record verification evidence in checklist.md [evidence: CHK items `13/13` marked with `[evidence: ...]`]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The README opens with a one-line pitch and a problem-first OVERVIEW per the refined template. It passes the readme validator with zero issues and the HVR grep with zero hits. It carries a bumped version field with a matching changelog entry. The scope diff shows only the README, the changelog entry and the phase docs. No SKILL.md, sibling README, template or vault file is modified.
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
<!-- /ANCHOR:cross-refs -->
