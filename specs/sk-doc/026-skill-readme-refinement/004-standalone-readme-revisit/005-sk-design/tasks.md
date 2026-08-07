---
title: "Tasks: Phase 005 sk-design README rewrite"
description: "Task list for the sk-design README rewrite in the 005-sk-design child phase under 004-standalone-readme-revisit."
trigger_phrases:
  - "phase 005 tasks"
  - "sk design readme tasks"
  - "sk design readme rewrite tasks"
  - "design readme verification tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/005-sk-design"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 005 task list inside 004-standalone-readme-revisit"
    next_safe_action: "Execute setup, rewrite and verification tasks in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-sk-design"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 005 sk-design README rewrite

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T014. `[P]` marks parallelizable tasks.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read `.opencode/skills/sk-design/README.md` in full and record the baseline: frontmatter version field, section list and table-heavy sections (REQ-002) [evidence: `version: 1.4.0.0` baseline, sections `1. AT A GLANCE`..`6. RELATED DOCUMENTS`, table-heavy `HOW IT WORKS`]
- [x] T002 [P] [P0] Run `validate_document.py --type readme` on the current README and record the output (REQ-002) [evidence: validator exit `0`, issues `0` on old README]
- [x] T003 [P] [P0] Run the link guard over the current README and record the link state (REQ-002) [evidence: links `10/10` resolve, missing `0`]
- [x] T004 [P1] Confirm the template readiness gate: `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` and `.opencode/skills/mcp-tooling/mcp-obsidian/README.md` are read and recorded (REQ-001) [evidence: `skill-readme-template.md` and `mcp-obsidian/README.md` read before rewrite]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 [P0] Rewrite `.opencode/skills/sk-design/README.md` purpose-first per the refined template with a one-line pitch and a problem-first OVERVIEW (REQ-003) [evidence: pitch blockquote after H1, problem-first OVERVIEW, H2 `1..7` ascending, diff `47/36` lines]
- [x] T006 [P0] Bump the frontmatter version field to `1.7.0.0` in the README (REQ-005) [evidence: frontmatter `version: 1.7.0.0`]
- [x] T007 [P0] Add `.opencode/skills/sk-design/changelog/v1.7.0.0.md` in the changelog voice documenting the README rewrite (REQ-005) [evidence: `changelog/v1.7.0.0.md` exists, Added/Changed/Preserved/Verification shape]
- [x] T008 [P1] Review the section-by-section `git diff` against the old README and confirm every shipped fact survives (REQ-007) [evidence: `git diff` review, facts lost `0`, playbook counts corrected to `35/9`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 [P0] Run `validate_document.py --type readme` on the rewritten README and confirm zero issues (REQ-006) [evidence: validator exit `0`, issues `0`]
- [x] T010 [P] [P0] Run the HVR grep `rg -n "—|;|, and|, or"` on the README and confirm zero matches (REQ-004) [evidence: HVR matches `0`, grep exit `1` = no hits]
- [x] T011 [P] [P0] Run the link guard and confirm every link resolves (REQ-006) [evidence: links `10/10` resolve, missing `0`]
- [x] T012 [P1] Run `git diff --check` and confirm the diff is clean (REQ-008) [evidence: `git diff --check` exit `0`, whitespace errors `0`]
- [x] T013 [P1] Confirm scope with `git status`: only the README, the changelog entry and this phase folder changed (REQ-008) [evidence: `git status` shows only `README.md` modified and `changelog/v1.7.0.0.md` added in sk-design]
- [x] T014 [P1] Run `validate.sh` on this phase folder, regenerate the phase metadata and record evidence in checklist.md (REQ-009) [evidence: `validate.sh --strict` exit `0`, errors `0`, warnings `0`, metadata regenerated via `generate-context.js`]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The README reads purpose-first with a one-line pitch and a problem-first OVERVIEW, keeps every shipped fact, passes the README validator with zero issues and the HVR grep with zero matches, carries version `1.7.0.0` with its changelog entry present and shows no change outside the README, the changelog entry and this phase folder.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` (REQ-001..REQ-009)
- Plan: `plan.md`
- Checklist: `checklist.md`
- Parent phase spec: `../spec.md`
- Refined template: `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`
- Exemplar: `.opencode/skills/mcp-tooling/mcp-obsidian/README.md`
- HVR rules: `.opencode/skills/sk-doc/shared/references/hvr-rules.md`
<!-- /ANCHOR:cross-refs -->
