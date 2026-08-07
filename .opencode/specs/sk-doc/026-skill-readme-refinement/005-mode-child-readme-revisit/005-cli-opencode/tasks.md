---
title: "Tasks: Phase 005 cli-opencode mode README rewrite"
description: "Task list for rewriting the cli-opencode mode skill README in cli-external-orchestration."
trigger_phrases:
  - "phase 005 tasks"
  - "cli opencode readme tasks"
  - "opencode mode readme tasks"
  - "cli-opencode rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/005-cli-opencode"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 005 task list inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute setup, implementation and verification tasks in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-cli-opencode"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 005 cli-opencode mode README rewrite

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T010. `[P0]` marks blockers, `[P1]` marks required work, `[P]` marks parallelizable tasks.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read the refined README template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and the mcp-obsidian exemplar (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) and record the required section model and the one-line pitch pattern [evidence: template `Section 2` model read + `Section 6` scaffold; exemplar sections `1/9` AT A GLANCE .. `9/9` RELATED DOCUMENTS, pitch on line `13`]
- [x] T002 [P0] Read the current README (`.opencode/skills/cli-external-orchestration/cli-opencode/README.md`) and record the baseline: version field value, `validate_document.py --type readme` output and link state [evidence: baseline `version: 1.3.0.29`, validator exit `0` issues `0`, links `8/8` resolve]
- [x] T003 [P1] [P] Inventory the cli-opencode skill folder (`.opencode/skills/cli-external-orchestration/cli-opencode/`) to confirm the changelog naming convention and the read-only surfaces (`SKILL.md`, `references/`, `assets/`) [evidence: `changelog/` uses `v<version>.md`, latest entry `v1.4.0.0.md`; read-only `SKILL.md` version `1.4.0.0`, `references/` `9` files, `assets/` `5` files]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Rewrite the README at `.opencode/skills/cli-external-orchestration/cli-opencode/README.md` purpose-first per the refined template with a one-line pitch and a problem-first OVERVIEW [evidence: pitch blockquote line `16`, problem-first OVERVIEW `## 2.`, capability section `The Dispatch Surface` `5` rows, H2 `9/9` numbered]
- [x] T005 [P0] Bump the README version field per the changelog convention and add the matching entry at `changelog/<version>.md` [evidence: `version: 1.4.1.0` + `changelog/v1.4.1.0.md` added; decision: field jumped `1.3.0.29` to `1.4.1.0` so the rewrite release sits above the existing `v1.4.0.0` providers-catalog entry]
- [x] T006 [P1] Run the section-by-section diff of the old and new README and confirm every still-applicable fact is preserved [evidence: fact grep `34/34` tokens present incl. `deepseek-v4-pro`, `</dev/null`, `--agent general`, `OPENCODE_CONFIG_DIR`, `4096`, `opencode.db`, `RM-8`; provider roster corrected to the `4` current catalog providers per `v1.4.0.0`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 [P0] Run `validate_document.py --type readme` on the rewritten README and confirm zero issues [evidence: `validate_document.py --type readme` exit `0` issues `0`]
- [x] T008 [P0] Run the HVR grep over the README body and confirm zero em dashes, zero semicolons and zero Oxford commas [evidence: em dash `0`, semicolon `0`, Oxford comma `0`, banned words `0`]
- [x] T009 [P1] Run the link guard over the README links and the scope diff with `git diff --check` [evidence: links `10/10` resolve, `git diff --check` exit `0`]
- [x] T010 [P1] Run `validate.sh` on this phase folder and record zero errors, then record all evidence in checklist.md and write the implementation summary [evidence: `validate.sh --strict` errors `0` warnings `0`, checklist `P0 6/6` + `P1 10/10`, `implementation-summary.md` written]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The README at `.opencode/skills/cli-external-orchestration/cli-opencode/README.md` is purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW, passes `validate_document.py --type readme` with zero issues, carries a bumped version field with a matching changelog entry and passes the HVR grep. No SKILL.md content, template or other skill README is modified.
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
- Target README: `.opencode/skills/cli-external-orchestration/cli-opencode/README.md`
<!-- /ANCHOR:cross-refs -->
