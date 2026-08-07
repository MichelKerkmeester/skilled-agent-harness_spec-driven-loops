---
title: "Tasks: Phase 004 cli-devin mode README rewrite"
description: "Task list for rewriting the cli-devin mode skill README in cli-external-orchestration."
trigger_phrases:
  - "phase 004 tasks"
  - "cli devin readme tasks"
  - "devin mode readme tasks"
  - "cli-devin rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/004-cli-devin"
    last_updated_at: "2026-08-04T13:46:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 004 task list inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute setup, implementation and verification tasks in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-cli-devin"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 004 cli-devin mode README rewrite

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T010. `[P0]` marks blockers, `[P1]` marks required work, `[P]` marks parallelizable tasks.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read the refined README template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and the mcp-obsidian exemplar (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) and record the required section model and the one-line pitch pattern [evidence: `skill-readme-template.md` read, section model `1..9` recorded, exemplar pitch mirrored]
- [x] T002 [P0] Read the current README (`.opencode/skills/cli-external-orchestration/cli-devin/README.md`) and record the baseline: version field value, `validate_document.py --type readme` output and link state [evidence: baseline `version: 1.0.0.0` + validator exit `0` + links `10/10` resolve]
- [x] T003 [P1] [P] Inventory the cli-devin skill folder (`.opencode/skills/cli-external-orchestration/cli-devin/`) to confirm the changelog naming convention and the read-only surfaces (`SKILL.md`, `references/`, `assets/`) [evidence: `changelog/` shows `v1.0.0.0.md` + `v1.1.0.0.md`, `SKILL.md` read, `references/` `6` files, `assets/` `2` files]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Rewrite the README at `.opencode/skills/cli-external-orchestration/cli-devin/README.md` purpose-first per the refined template with a one-line pitch and a problem-first OVERVIEW [evidence: `rg -n '^## [0-9]+\. '` shows `9` numbered ALL-CAPS H2, pitch blockquote line `17`, OVERVIEW `## 2`]
- [x] T005 [P0] Bump the README version field per the changelog convention and add the matching entry at `changelog/<version>.md` [evidence: `version: 1.2.0.0` + `changelog/v1.2.0.0.md` added; decision: field jumped `1.0.0.0` to `1.2.0.0` so the rewrite release sits above the existing `v1.1.0.0` model-catalog entry]
- [x] T006 [P1] Run the section-by-section diff of the old and new README and confirm every still-applicable fact is preserved [evidence: `9/9` old sections mapped; stale model examples (`adaptive`/`opus`/`gpt`/SWE-1.6) replaced with the curated roster from `providers-and-models.md`, `0` facts lost]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 [P0] Run `validate_document.py --type readme` on the rewritten README and confirm zero issues [evidence: exit `0` + `Total issues: 0`]
- [x] T008 [P0] Run the HVR grep over the README body and confirm zero em dashes, zero semicolons and zero Oxford commas [evidence: `\x{2014}` exit `1`, `\x{3B}` exit `1`, `,\s+(and|or)\b` exit `1`, banned-words exit `1`]
- [x] T009 [P1] Run the link guard over the README links and the scope diff with `git diff --check` [evidence: links `10/10` resolve, `git diff --check` exit `0`, scope `2` paths + phase folder, `0` staged]
- [x] T010 [P1] Run `validate.sh` on this phase folder and record zero errors, then record all evidence in checklist.md and write the implementation summary [evidence: `validate.sh` exit `0`, `Errors: 0`; see `checklist.md` + `implementation-summary.md`]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The README at `.opencode/skills/cli-external-orchestration/cli-devin/README.md` is purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW, passes `validate_document.py --type readme` with zero issues, carries a bumped version field with a matching changelog entry and passes the HVR grep. No SKILL.md content, template or other skill README is modified.
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
- Target README: `.opencode/skills/cli-external-orchestration/cli-devin/README.md`
<!-- /ANCHOR:cross-refs -->
