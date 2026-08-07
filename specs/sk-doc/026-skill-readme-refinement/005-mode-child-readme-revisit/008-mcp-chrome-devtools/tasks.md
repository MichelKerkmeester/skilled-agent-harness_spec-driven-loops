---
title: "Tasks: Phase 008 mcp-chrome-devtools README rewrite"
description: "Task list for rewriting the mcp-chrome-devtools skill README against the refined template with a version bump and a changelog entry."
trigger_phrases:
  - "phase 8 tasks"
  - "mcp chrome devtools tasks"
  - "mode readme rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/008-mcp-chrome-devtools"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 8 task list inside 026-skill-readme-refinement"
    next_safe_action: "Execute setup, implementation and verification tasks in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/008-mcp-chrome-devtools"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 008 mcp-chrome-devtools README rewrite

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T009. `[P]` marks parallelizable tasks.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read the current README (`.opencode/skills/mcp-tooling/mcp-chrome-devtools/README.md`) and record the baseline: version field value, `validate_document.py` output and link state [evidence: version `1.0.0.22`, validator `exit 0` / `Total issues: 0`, links `7/7` resolve]
- [x] T002 [P0] Read the refined README template from phase 001 (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and record its section model and required-section rule [evidence: `OVERVIEW` required, numbered ALL-CAPS H2 with `---` dividers, AT A GLANCE first, HVR greps in Section 4]
- [x] T003 [P1] [P] Read the mcp-obsidian exemplar README (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) and record its pitch, overview and section order [evidence: pitch blockquote after H1, problem-first OVERVIEW, sections `1/9` to `9/9` in exemplar order]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Rewrite the README per the refined template: one-line pitch, AT A GLANCE, problem-first OVERVIEW and the remaining sections in the exemplar order [evidence: `rg -n '^## [0-9]+\. '` shows `9/9` numbered ALL-CAPS H2, pitch blockquote at line `18`, OVERVIEW problem-first]
- [x] T005 [P0] Bump the version field in the README frontmatter above `1.0.0.22` [evidence: `rg -n '^version:'` returns `1.0.11.0`]
- [x] T006 [P0] Add the changelog entry at `changelog/<version>.md` noting the README rewrite [evidence: `ls changelog/v1.0.11.0.md` exists, entry titled `## [**1.0.11.0**] - 2026-08-04`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 [P0] [P] Run `validate_document.py --type readme` on the README, the HVR grep (zero em dashes, zero semicolons and zero Oxford commas), the link guard, `git diff --check` and the scope diff [evidence: validator `exit 0` / `Total issues: 0`, HVR greps `3/3` zero hits, links `13/13` resolve, `git diff --check` clean]
- [x] T008 [P1] Run `validate.sh` on this phase folder and record the output [evidence: `exit 0`, `Errors: 0` `Warnings: 0`, `RESULT: PASSED`]
- [x] T009 [P1] Record verification evidence in checklist.md [evidence: checklist CHK items `16/16` marked with evidence, summary `7/7` P0 and `9/9` P1]
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
