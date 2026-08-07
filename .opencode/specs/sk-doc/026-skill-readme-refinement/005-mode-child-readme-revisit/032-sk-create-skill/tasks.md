---
title: "Tasks: Phase 032 sk-create-skill README revisit"
description: "Task list for rewriting the sk-create-skill README against the refined README template and the mcp-obsidian exemplar."
trigger_phrases:
  - "phase 032 tasks"
  - "create skill readme tasks"
  - "sk-create-skill readme rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/032-sk-create-skill"
    last_updated_at: "2026-08-04T14:45:32Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 032 task list inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute setup, implementation and verification tasks in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/032-sk-create-skill"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 032 sk-create-skill README revisit

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T010. `[P]` marks parallelizable tasks.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read the current README (`.opencode/skills/sk-doc/sk-create-skill/README.md`) and record the baseline: frontmatter `version` field value, the tabular AT A GLANCE style and the section list [evidence: baseline `version: 1.1.0.1`, tabular AT A GLANCE opened section 1, 9 sections (1..9) with numbered ALL-CAPS H2] [evidence: `version: 1.1.0.1`]
- [x] T002 [P0] Run `validate_document.py --type readme` on the current README and record the output as the baseline validator state [evidence: baseline `validate_document.py` exit `0`, `Total issues: 0`]
- [x] T003 [P0] Record the link state of the current README with a `rg -n` pass over markdown links [evidence: baseline `8` markdown links, `7` in RELATED DOCUMENTS plus `1` in FAQ, all relative paths resolving]
- [x] T004 [P] Read the refined template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and the mcp-obsidian exemplar (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) and record the target section model [evidence: template `skill-readme-template.md` section model: pitch blockquote, `1. AT A GLANCE`, `2. OVERVIEW`, `3. QUICK START`, `4. HOW IT WORKS`, `5. INTEGRATION & NAVIGATION`, `6. TROUBLESHOOTING`, `7. FAQ`, `8. VERIFICATION`, `9. RELATED DOCUMENTS`; exemplar `mcp-obsidian/README.md` mirrors that model]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 [P0] Rewrite the README body purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW (`.opencode/skills/sk-doc/sk-create-skill/README.md`) [evidence: rewrite written; pitch blockquote follows H1, OVERVIEW opens with `Why This Skill Exists` before any feature list, `9` numbered ALL-CAPS H2 with `---` dividers]
- [x] T006 [P0] Preserve every capability, command and navigation fact from the old README and confirm it with a section-by-section diff against the baseline [evidence: all `2` workflow modes, `validate_skill_package.py` gate, `package_skill.py`, `init_skill.py --kind parent`, `--compiled-routing legacy|ready`, `compiled-route-manifest.cjs mint`, `leaf-manifest.json`, `5` troubleshooting rows, `4` FAQ answers, `3` verification rows, `7` related docs preserved]
- [x] T007 [P0] Bump the frontmatter `version` field from `1.1.0.1` to `1.1.1.0` [evidence: `README.md` frontmatter now reads `version: 1.1.1.0`]
- [x] T008 [P0] Add `changelog/v1.1.1.0.md` with a summary of the README rewrite [evidence: `ls` shows `changelog/v1.1.1.0.md` present, `1560` bytes, titled `create-skill v1.1.1.0 - README rewrite`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 [P0] Run `validate_document.py --type readme`, the HVR grep (zero em dashes, zero semicolons and zero Oxford comma patterns), the link guard and `git diff --check` [evidence: validator exit `0` with `Total issues: 0`; HVR `rg` exit `1` on `\x{2014}`, `\x{3B}`, `,\s+(and|or)\b` and banned-word patterns (zero matches); link guard `8/8` resolve; `git diff --check` exit `0`]
- [x] T010 [P0] Run `git diff --name-only` to confirm the scope and `validate.sh` on this phase folder, then record the evidence in checklist.md [evidence: `git status --porcelain` shows `M` README, `??` changelog entry, `??` phase folder only; `validate.sh --strict` exit `0` with `Errors: 0`; staged files `0`]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The README is purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW, passes `validate_document.py --type readme` with zero issues and the HVR grep, carries the bumped `version` field `1.1.1.0`, has the `changelog/v1.1.1.0.md` entry present and the scope diff lists only the README, the changelog entry and this phase folder. This phase folder validates with zero errors.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` (REQ-001..REQ-009)
- Plan: `plan.md`
- Checklist: `checklist.md`
- Parent phase spec: `../spec.md` (005-mode-child-readme-revisit)
- Refined template: `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`
- Exemplar: `.opencode/skills/mcp-tooling/mcp-obsidian/README.md`
- HVR rules: `.opencode/skills/sk-doc/shared/references/hvr-rules.md`
<!-- /ANCHOR:cross-refs -->
