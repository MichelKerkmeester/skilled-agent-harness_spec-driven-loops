---
title: "Tasks: Phase 010 system-skill-advisor README revisit"
description: "Task list for the system-skill-advisor README rewrite: baseline setup, purpose-first rewrite, version bump, changelog entry and verification."
trigger_phrases:
  - "phase 010 tasks"
  - "system skill advisor readme tasks"
  - "advisor readme rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/010-system-skill-advisor"
    last_updated_at: "2026-08-04T12:52:05Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 010 task list inside 004-standalone-readme-revisit"
    next_safe_action: "Execute setup, implementation and verification tasks in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/010-system-skill-advisor"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 010 system-skill-advisor README revisit

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T010. `[P0]` marks a blocker, `[P1]` marks a required item. `[P]` marks parallelizable tasks.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read the refined standalone README template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and the mcp-obsidian exemplar README and record the section model and the required-section rule [evidence: section model `numbered ALL-CAPS H2` + `---` dividers, `OVERVIEW` required, pitch blockquote after H1, AT A GLANCE first]
- [x] T002 [P0] Read the current README (`.opencode/skills/system-skill-advisor/README.md`) and record the baseline: version field value, `validate_document.py --type readme` output and link state [evidence: baseline `version: 0.8.0.34`, validator `0 issues` exit 0, `20/20` relative links resolve]
- [x] T003 [P1] [P] Inventory the skill root and the changelog folder to confirm the next version number and the entry naming convention [evidence: changelog `v0.10.0.md` latest, next `v0.11.0.0.md`, NEW/CHANGED/NOT CHANGED shape per sibling `v2.1.0.0.md`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Rewrite `.opencode/skills/system-skill-advisor/README.md` against the refined template (or verify it already complies): one-line pitch blockquote, problem-first OVERVIEW, numbered ALL-CAPS H2 sections and HVR clean prose [evidence: pitch blockquote after H1, OVERVIEW opens problem-first, `9` numbered ALL-CAPS H2, HVR greps `0` hits]
- [x] T005 [P0] Preserve every factual claim with a section-by-section diff against the pre-rewrite README [evidence: `17/17` reference links kept, lane weights `5/5`, tools `9/9`, trust states `4/4`, exit codes `5/5`]
- [x] T006 [P0] Bump the version field in the README frontmatter to the next version [evidence: `version: 0.8.0.34` to `version: 0.11.0.0`]
- [x] T007 [P0] Add the changelog entry at `.opencode/skills/system-skill-advisor/changelog/<version>.md` [evidence: created `changelog/v0.11.0.0.md` with NEW/CHANGED/NOT CHANGED]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 [P0] [P] Run `validate_document.py --type readme`, the HVR grep (zero em dashes, semicolons and Oxford commas), the link guard and `git diff --check` on the README [evidence: validator `0 issues` exit 0, HVR `0` hits, links `20/20` resolve, `git diff --check` clean]
- [x] T009 [P1] [P] Run `validate.sh` on this phase folder with zero errors and confirm the scope diff shows only the README, the changelog entry and the phase docs. Regenerate the phase metadata [evidence: `validate.sh` exit `0` errors `0`, diff `3` writable files, metadata regenerated]
- [x] T010 [P1] Record the verification evidence in checklist.md and complete the Verification Summary table [evidence: checklist marked `16/16` CHK items, summary `8/8` P0 + `8/8` P1]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The rewritten README reads purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW, passes the validator, the HVR grep and the link guard and carries a bumped version field with a matching changelog entry. This phase folder validates with zero errors. No SKILL.md, template, vault file or runtime artifact is modified.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` (REQ-001..REQ-009)
- Plan: `plan.md`
- Checklist: `checklist.md`
- Parent phase spec: `../spec.md` (004-standalone-readme-revisit)
- Packet spec: `../../spec.md` (026-skill-readme-refinement)
- Refined template: `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`
- Exemplar: `.opencode/skills/mcp-tooling/mcp-obsidian/README.md`
- Skill root: `.opencode/skills/system-skill-advisor/`
<!-- /ANCHOR:cross-refs -->
