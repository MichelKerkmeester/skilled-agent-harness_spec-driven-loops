---
title: "Tasks: Phase 031 sk-create-readme README rewrite"
description: "Task list for rewriting the sk-create-readme README against the refined template and the mcp-obsidian exemplar."
trigger_phrases:
  - "phase 031 tasks"
  - "sk create readme readme tasks"
  - "create readme rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/031-sk-create-readme"
    last_updated_at: "2026-08-04T14:55:00Z"
    last_updated_by: "spec-author"
    recent_action: "Phase 031 executed: README rewritten"
    next_safe_action: "Execute setup, implementation and verification tasks in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/031-sk-create-readme"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 031 sk-create-readme README rewrite

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T010. `[P0]` marks blockers, `[P1]` marks required items.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read the current README at `.opencode/skills/sk-doc/sk-create-readme/README.md` and record the baseline: version field value, `validate_document.py` output and link state [evidence: version `1.0.0.0`, validator exit `0` with `0` issues, links `6/6` resolve, recorded before edit]
- [x] T002 [P0] Read the refined template at `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` and confirm the readiness gate [evidence: template read, `skill-readme-template.md` exists, gate `1/1`]
- [x] T003 [P1] Read the mcp-obsidian exemplar at `.opencode/skills/mcp-tooling/mcp-obsidian/README.md` and record its structure for the rewrite [evidence: exemplar read, pitch + AT A GLANCE + numbered ALL-CAPS H2 shape confirmed]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Rewrite the README purpose-first per the refined template with a one-line pitch and a problem-first OVERVIEW [evidence: `README.md` rewritten, pitch + problem-first OVERVIEW + AT A GLANCE first + numbered ALL-CAPS H2 `1-9` + `---` dividers `11`]
- [x] T005 [P0] Bump the version field in the README frontmatter from `1.0.0.0` [evidence: `rg -n "^version"` -> `version: 1.1.0.0`]
- [x] T006 [P0] Add the changelog entry under `.opencode/skills/sk-doc/sk-create-readme/changelog/<version>.md` [evidence: `changelog/v1.1.0.0.md` created, NEW/CHANGED/NOT CHANGED shape]
- [x] T007 [P1] Diff the rewritten README section by section against the old README and confirm every confirmed fact survived [evidence: `git show HEAD` vs new, facts kept `27/27`, `0` facts lost]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 [P0] Run `validate_document.py` with `--type readme` on the rewritten README and confirm zero issues [evidence: exit `0`, `Total issues: 0`, `✅ VALID`]
- [x] T009 [P0] Run the HVR grep (zero em dashes, zero semicolons and zero Oxford commas) and the link guard [evidence: `rg` em dash `0`, semicolon `0`, Oxford comma `0`, banned words `0`, links `6/6`]
- [x] T010 [P1] Confirm the scope diff shows only the README, the changelog entry and this phase's docs, run `git diff --check`, then run `validate.sh` on this phase folder and record the evidence in checklist.md [evidence: `git diff --check` clean, `validate.sh` exit `0` errors `0`, scope files `3/3`]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The README is purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW, the version field is bumped, the changelog entry exists, the validator reports zero issues, the HVR grep and the link guard are clean, `git diff --check` reports clean, this phase folder validates with zero errors and no out-of-scope file changed.
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
- Target README: `.opencode/skills/sk-doc/sk-create-readme/README.md`
<!-- /ANCHOR:cross-refs -->
