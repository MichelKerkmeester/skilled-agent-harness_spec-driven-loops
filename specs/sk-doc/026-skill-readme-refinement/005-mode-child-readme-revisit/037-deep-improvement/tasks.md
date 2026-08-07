---
title: "Tasks: Phase 037 deep-improvement README revisit"
description: "Task list for rewriting the deep-improvement README against the refined README template and the mcp-obsidian exemplar."
trigger_phrases:
  - "phase 037 tasks"
  - "deep improvement readme tasks"
  - "deep-improvement readme rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/037-deep-improvement"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 037 task list inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute setup, implementation and verification tasks in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/037-deep-improvement"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 037 deep-improvement README revisit

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T010. Priority tags `[P0]` and `[P1]` mark blocking and required work. `[P]` marks parallelizable tasks.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read the current README (`.opencode/skills/system-deep-loop/deep-improvement/README.md`) and record the baseline: frontmatter `version` field value, the tabular AT A GLANCE style and the section list [evidence: `version: 1.17.0.38`; `rg -n '^## [0-9]+\. '` -> `9` sections; AT A GLANCE table before OVERVIEW]
- [x] T002 [P0] Run `validate_document.py --type readme` on the current README and record the output as the baseline validator state [evidence: `validate_document.py` exit `0`, `Total issues: 0` on baseline]
- [x] T003 [P0] Record the link state of the current README with a `rg -n` pass over markdown links [evidence: `15/15` relative links resolved on baseline]
- [x] T004 [P0] [P] Read the refined template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and the mcp-obsidian exemplar (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) and record the target section model [evidence: template `skill-readme-template.md` version `1.9.0.0`; exemplar `mcp-obsidian/README.md` version `1.6.0.0`; section model `9` numbered ALL-CAPS H2]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 [P0] Rewrite the README body purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW (`.opencode/skills/system-deep-loop/deep-improvement/README.md`) [evidence: `rg -n '^## [0-9]+\. '` -> `1..9` ascending; blockquote pitch after H1; `## 2. OVERVIEW` opens with `Why This Skill Exists` before any feature list]
- [x] T006 [P0] Preserve every capability, command and navigation fact from the old README and confirm it with a section-by-section diff against the baseline [evidence: token scan `git show HEAD` vs rewrite -> `0` dropped of `45` fact tokens; links `15/15`]
- [x] T007 [P0] Bump the frontmatter `version` field from `1.17.0.38` to `1.17.1.0` [evidence: `rg -n '^version:'` -> `1.17.1.0`]
- [x] T008 [P0] Add `changelog/v1.17.1.0.md` with a summary of the README rewrite [evidence: `ls changelog/v1.17.1.0.md` exists; validator exit `0` on changelog type]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 [P0] Run `validate_document.py --type readme`, the HVR grep (zero em dashes, zero semicolons and zero Oxford comma patterns), the link guard and `git diff --check` [evidence: validator exit `0` with `Total issues: 0`; HVR `0/0/0` em dash/semicolon/Oxford; links `15/15`; `git diff --check` exit `0`]
- [x] T010 [P1] Run `git diff --name-only` to confirm the scope and `validate.sh` on this phase folder, then record the evidence in checklist.md [evidence: `git status --porcelain` lists only `README.md` (M), `changelog/v1.17.1.0.md` (new) and phase folder; `validate.sh --strict` -> `2` remaining scaffold errors (missing `implementation-summary.md`), metadata errors `0`]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The README is purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW, passes `validate_document.py --type readme` with zero issues and the HVR grep, carries the bumped `version` field `1.17.1.0`, has the `changelog/v1.17.1.0.md` entry present and the scope diff lists only the README, the changelog entry and this phase folder. This phase folder validates with zero errors.
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
