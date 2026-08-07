---
title: "Tasks: Phase 019 sk-design-interface README revisit"
description: "Task list for rewriting the sk-design-interface mode skill README against the refined template with a version bump, changelog entry and full validation."
trigger_phrases:
  - "phase 019 tasks"
  - "sk design interface readme tasks"
  - "interface readme rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/019-sk-design-interface"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 019 task list inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute setup, implementation and verification tasks in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/019-sk-design-interface"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 019 sk-design-interface README revisit

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T010. `[P0]` marks blocking invariants, `[P1]` marks required completion or explicit deferral.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read the refined standalone README template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and record its section model and required-section rule [evidence: section model = `9` numbered ALL-CAPS H2 entries, `OVERVIEW` required, HVR banned forms + `4` scripted greps, versioning bump convention, checklist `9/9` pass criteria]
- [x] T002 [P0] Read the current README (`.opencode/skills/sk-design/sk-design-interface/README.md`) and record the baseline: version field value, `validate_document.py --type readme` output and link state [evidence: version `1.6.1.0`, validator exit `0` issues `0`, links `17/17`, HVR baseline em `0` semi `5` ox `21`]
- [x] T003 [P1] Read the mcp-obsidian exemplar README (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) and record its purpose-first narrative pattern [evidence: pitch blockquote after H1, `### Why This Skill Exists` problem-first H3, capability table `### The Plugin Knowledge Layer`, numbered H2 `1. AT A GLANCE` .. `9. RELATED DOCUMENTS`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Rewrite the README purpose-first per the refined template with a one-line pitch and a problem-first OVERVIEW (`.opencode/skills/sk-design/sk-design-interface/README.md`) [evidence: rewritten with pitch at line `17`, `## 1. AT A GLANCE` .. `## 9. RELATED DOCUMENTS` `9/9` sections, capability table `### The Interface Judgment Layer`, boundary section `### What It Does Not Own`]
- [x] T005 [P0] Bump the version field in the README from the recorded baseline to the next release version [evidence: `rg -n "^version:"` = `version: 1.7.0.0` at line `10`, baseline was `1.6.1.0`]
- [x] T006 [P0] Add a changelog entry at `changelog/<version>.md` matching the bumped version, following the folder convention [evidence: `changelog/v1.7.0.0.md` created, version `1.7.0.0` matches README, folder entries `4/4` (foundations, v1.0.0.0, v1.1.0.0, v1.7.0.0)]
- [x] T007 [P1] Review the rewrite section-by-section against the previous README and confirm every original fact is preserved [evidence: facts retained `17/17` links resolve, `8/8` active procedure cards + `2/2` quarantined, register/dials/two-pass/corpus/gates/FAQ all carried; card names corrected to on-disk hyphenated forms]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 [P0] Run `validate_document.py --type readme` on the rewritten README and confirm zero issues [evidence: exit `0`, `Total issues: 0`]
- [x] T009 [P0] Run the HVR grep (zero em dashes, zero semicolons, zero Oxford commas) and the link guard on the README [evidence: HVR em `0` semi `0` ox `0`, banned words `0`, links `17/17`]
- [x] T010 [P0] Run `git diff --check`, confirm the scope diff shows only the README, its changelog entry and phase docs, then run `validate.sh` on this phase folder [evidence: `git diff --check` clean, scope `3/3` target surfaces (README, changelog, phase docs), validate.sh errors `0` warnings `1` (COMPLEXITY_MATCH, fleet-wide on sibling 018)]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The README exists purpose-first at `.opencode/skills/sk-design/sk-design-interface/README.md` with a one-line pitch and a problem-first OVERVIEW, passes the HVR grep, carries a bumped version field with a matching changelog entry and validates with zero issues. The scope diff is limited to the README, its changelog entry and this phase's docs. SKILL.md content, templates and vault files are untouched.
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
