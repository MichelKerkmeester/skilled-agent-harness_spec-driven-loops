---
title: "Tasks: Phase 018 sk-code-webflow README revisit"
description: "Task list for rewriting the sk-code-webflow README purpose-first per the refined template, with a version bump, a changelog entry and full validation."
trigger_phrases:
  - "phase 18 tasks"
  - "sk code webflow readme tasks"
  - "webflow readme rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/018-sk-code-webflow"
    last_updated_at: "2026-08-04T14:45:00Z"
    last_updated_by: "markdown-executor"
    recent_action: "Marked all phase 018 tasks complete"
    next_safe_action: "Await review gate on phase 018 evidence"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/018-sk-code-webflow"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 018 sk-code-webflow README revisit

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T009. `[P]` marks parallelizable tasks.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the refined README template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and record its section model and required-section rule [evidence: section model = 9 numbered ALL-CAPS H2 entries, `OVERVIEW` required, HVR banned forms + 4 scripted greps, versioning bump convention, checklist `9/9` pass criteria]
- [x] T002 [P] Read the mcp-obsidian exemplar README (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) and record its pitch, OVERVIEW and navigation pattern [evidence: pitch blockquote right after H1, `### Why This Skill Exists` problem-first H3, capability table `### The Plugin Knowledge Layer`, numbered H2 `1. AT A GLANCE` .. `9. RELATED DOCUMENTS`]
- [x] T003 [P] Read the current README (`.opencode/skills/sk-code/sk-code-webflow/README.md`) and record the baseline: version field value, `validate_document.py` output and link state [evidence: version `1.0.0.0`, validator exit `0` with `0` issues, link count `0`, HVR baseline em `0` semi `0` oxford `2`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Rewrite the README purpose-first per the refined template with a one-line pitch blockquote after the H1, a problem-first OVERVIEW and the numbered ALL-CAPS H2 section model (`.opencode/skills/sk-code/sk-code-webflow/README.md`) [evidence: rewritten with pitch at line `13`, `## 1. AT A GLANCE` .. `## 8. RELATED DOCUMENTS`, `8/8` sections, `10/10` capability rows in `### The Frontend Evidence Layer`]
- [x] T005 Bump the version field in the README frontmatter to the target decided on the baseline evidence [evidence: `version: 1.1.0.0` at README line `8`, bumped from baseline `1.0.0.0` per spec open-question decision]
- [x] T006 Add the changelog entry at `.opencode/skills/sk-code/sk-code-webflow/changelog/<version>.md` matching the bumped field [evidence: `changelog/v1.1.0.0.md` created with `## New` / `## Changed` / `## Not Changed` sections, version `1.1.0.0` in frontmatter]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 [P] Run `validate_document.py --type readme` on the README, the HVR grep (zero em dashes, zero semicolons and zero Oxford commas) and the link guard [evidence: validator exit `0` with `0` issues, HVR em `0` semi `0` oxford `0` banned-words `0`, links resolved `6/6`]
- [x] T008 Run the scope diff and `git diff --check` and confirm only the README, its changelog entry and this phase's docs changed [evidence: `git diff --check` exit `0`, porcelain shows `README.md` modified + `changelog/v1.1.0.0.md` added + phase docs only; `SKILL.md` untouched]
- [x] T009 Record verification evidence in checklist.md and run `validate.sh` on this phase folder [evidence: checklist marked `16/16` items, validate.sh run on phase folder]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The README is rewritten purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW, every fact from the current README survives the section-by-section diff, the version field is bumped with a matching changelog entry, the validator reports zero issues, the HVR grep is clean and this phase folder validates with zero errors. No SKILL.md, template or vault file is modified.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` (REQ-001..REQ-009)
- Plan: `plan.md`
- Checklist: `checklist.md`
- Parent packet spec: `../spec.md`
- Refined template: `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`
- Exemplar: `.opencode/skills/mcp-tooling/mcp-obsidian/README.md`
- Target README: `.opencode/skills/sk-code/sk-code-webflow/README.md`
<!-- /ANCHOR:cross-refs -->
