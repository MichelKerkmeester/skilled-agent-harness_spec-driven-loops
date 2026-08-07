---
title: "Tasks: Phase 012 mcp-mobbin README revisit"
description: "Task list for rewriting the mcp-mobbin mode skill README in the mcp-tooling hub against the refined README template with the mcp-obsidian exemplar as the model."
trigger_phrases:
  - "phase 012 tasks"
  - "mcp mobbin readme tasks"
  - "mobbin readme rewrite tasks"
  - "mobbin readme revisit tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/012-mcp-mobbin"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 012 task list inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute setup, implementation and verification tasks in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/012-mcp-mobbin"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 012 mcp-mobbin README revisit

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T010. `[P0]` marks blocking tasks, `[P1]` marks required tasks.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read the current README (`.opencode/skills/mcp-tooling/mcp-mobbin/README.md`) and record the baseline: version field value (observed `1.0.0.0`), validator output and link state (REQ-002) [evidence: baseline version `1.0.0.0`, validator exit `0` with `0` issues, HVR baseline hits on `61` lines, links `16/16` resolved]
- [x] T002 [P0] Read the refined README template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and the mcp-obsidian exemplar (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) and record their section models (REQ-001) [evidence: `skill-readme-template.md` and `mcp-obsidian/README.md` read, section model `9` numbered H2 sections]
- [x] T003 [P1] Inventory the changelog folder (`.opencode/skills/mcp-tooling/mcp-mobbin/changelog/`) to align the new entry with the existing convention (REQ-005) [evidence: `changelog/` holds `v1.0.0.0.md` only, entry shape NEW/CHANGED/NOT CHANGED per `changelog-template.md` and the `v1.5.0.0.md` exemplar]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Rewrite the README body per the refined template with a one-line pitch and a problem-first OVERVIEW, or record a verify-only verdict if the body already conforms (REQ-003) [evidence: README rewritten purpose-first with one-line pitch, problem-first `OVERVIEW`, `9` numbered sections, validator exit `0`; verify-only rejected: HVR baseline had `61` violation lines]
- [x] T005 [P0] Preserve every factual claim from the current README via a section-by-section comparison covering the wiring state, the three-tool surface, the auth model and the judgment boundary (REQ-007) [evidence: `4/4` fact anchors preserved: wiring state, three-tool surface, auth model, judgment boundary; links `16/16`]
- [x] T006 [P0] Bump the README frontmatter version field from the recorded baseline (REQ-005) [evidence: version `1.0.0.0` bumped to `1.1.0.0` at README line `10`]
- [x] T007 [P0] Add the changelog entry for the new version under `changelog/` per the per-skill convention (REQ-005) [evidence: `changelog/v1.1.0.0.md` added with NEW/CHANGED/NOT CHANGED sections, HVR clean]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 [P0] Run `validate_document.py --type readme` on the README and the HVR grep (zero em dashes, zero semicolons and zero Oxford commas) (REQ-004, REQ-006) [evidence: validator exit `0` with `0` issues, HVR greps: em dash `0`, Oxford comma `0`, banned words `0`, semicolons `4` all inside code fences (exempt per template)]
- [x] T009 [P1] Run the link guard on the README links and `git diff --check`, then confirm the scope diff touches only the README, the changelog entry and this phase's docs (REQ-008) [evidence: links `16/16` resolve, `git diff --check` exit `0`, scope diff touches `3` paths]
- [x] T010 [P1] Run `validate.sh` on this phase folder and record all verification evidence in checklist.md (REQ-009) [evidence: `validate.sh` errors `0` (warnings `1` COMPLEXITY_MATCH, a fleet-wide scaffolded condition present in `001`/`010`/`011` too), checklist `17/17`, metadata regenerated]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The mcp-mobbin README is purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW. It passes the readme validator with zero issues and the HVR grep, carries a bumped version field and has a changelog entry. No SKILL.md, other skill README, template or vault file is modified.
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
- Target README: `.opencode/skills/mcp-tooling/mcp-mobbin/README.md`
<!-- /ANCHOR:cross-refs -->
