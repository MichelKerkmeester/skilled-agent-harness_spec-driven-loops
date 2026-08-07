---
title: "Tasks: Phase 026-sk-create-diff skill README rewrite"
description: "Task list for the purpose-first rewrite of the sk-create-diff mode skill README on the refined template."
trigger_phrases:
  - "phase 026 tasks"
  - "sk-create-diff readme tasks"
  - "readme rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/026-sk-create-diff"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 026-sk-create-diff task list inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute setup, implementation and verification tasks in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/026-sk-create-diff"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 026-sk-create-diff skill README rewrite

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T011. `[P]` marks parallelizable tasks. `[P0]` and `[P1]` mark the requirement priority from spec REQ-001..REQ-009.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read the refined README template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and record its section model and writing rules (template readiness gate, REQ-001) [evidence: `read` 9-section model, numbered ALL-CAPS H2, HVR greps from template Section 4] 
- [x] T002 [P0] [P] Read the mcp-obsidian exemplar README (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) and record its purpose-first patterns (REQ-001) [evidence: `read` pitch blockquote + problem-first OVERVIEW + capability layer pattern] 
- [x] T003 [P0] [P] Read the current README (`.opencode/skills/sk-doc/sk-create-diff/README.md`) and record the baseline: version field `1.0.0.0`, validator output and link state (REQ-002) [evidence: `version: 1.0.0.0`, `validate_document.py` 0 issues, links 9/9 resolve, HVR Oxford grep 7 hits] 
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Rewrite the README per the refined template: one-line pitch blockquote after the H1 and a problem-first OVERVIEW before any feature list (REQ-003) [evidence: `rg -n '^>'` line 12 pitch, OVERVIEW `## 2.` problem-first prose] 
- [x] T005 [P0] Rewrite the remaining sections on the template section model with numbered ALL-CAPS H2 headings and `---` dividers, carrying every command, exit code, boundary and file pointer from the old README (REQ-003, REQ-007) [evidence: `rg -n '^## [0-9]+'` 9/9 sequential, old tokens 37/37 preserved] 
- [x] T006 [P0] Bump the version field to `1.1.2.0` in the README frontmatter (REQ-005) [evidence: `version: 1.1.2.0`] 
- [x] T007 [P0] Add the changelog entry at `changelog/v1.1.2.0.md` with a release title (REQ-005) [evidence: `ls changelog/` shows `v1.1.2.0.md`, title `v1.1.2.0 - Purpose-first README rewrite`] 
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 [P0] [P] Run `validate_document.py --type readme` on the rewritten README and the HVR greps (zero em dashes, zero semicolons and zero Oxford commas) (REQ-004, REQ-006) [evidence: validator `0 issues` exit 0, HVR greps `0/0/0/0` matches] 
- [x] T009 [P0] [P] Run the link guard over every relative link in the README and `git diff --check` (REQ-008) [evidence: links 9/9 `OK`, `git diff --check` exit 0] 
- [x] T010 [P1] Run the section-by-section diff of old versus new README and record verification evidence in checklist.md (REQ-007) [evidence: old tokens 37/37 survive, exit codes `3`/`4` present in both] 
- [x] T011 [P1] Run `validate.sh` on this phase folder and regenerate the phase metadata (REQ-009) [evidence: `validate.sh` exit 0 errors 0, `generate-context.js` rerun] 
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The README is purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW, passes the HVR greps, validates with zero issues, carries the version field `1.1.2.0` and has a changelog entry at `changelog/v1.1.2.0.md`. Every fact from the old README survives. No `SKILL.md`, template, vault or sibling file changed.
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
- Target README: `.opencode/skills/sk-doc/sk-create-diff/README.md`
<!-- /ANCHOR:cross-refs -->
