---
title: "Tasks: Phase 015 sk-code-opencode README revisit"
description: "Task list for rewriting the sk-code-opencode mode README against the refined README template and the mcp-obsidian exemplar."
trigger_phrases:
  - "phase 015 tasks"
  - "sk-code-opencode readme tasks"
  - "opencode surface readme tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/015-sk-code-opencode"
    last_updated_at: "2026-08-04T15:00:00Z"
    last_updated_by: "phase-executor"
    recent_action: "Rewrote sk-code-opencode README purpose-first at 1.0.0.5 with changelog entry; all tasks marked"
    next_safe_action: "Packet review can verify the README, the changelog and the phase docs"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/015-sk-code-opencode"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 015 sk-code-opencode README revisit

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T012. `[P0]` marks tasks that block completion. `[P1]` marks required tasks that may be explicitly deferred.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read the refined README template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and the mcp-obsidian exemplar (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) and record the section model and required-section rule (REQ-001) [evidence: `skill-readme-template.md` read; 9-section model; OVERVIEW the only required section]
- [x] T002 [P0] Read the current README at `.opencode/skills/sk-code/sk-code-opencode/README.md` and record the baseline version field value (`1.0.0.4`), validator output and link state (REQ-002) [evidence: baseline `version: 1.0.0.4`; validator exit 0; links 8/8 resolve]
- [x] T003 [P0] Run `validate_document.py --type readme` on the current README and record the pre-rewrite issue list (REQ-002) [evidence: `validate_document.py` pre-rewrite exit 0 with 0 issues]
- [x] T004 [P0] Run the HVR grep on the current README body and record the pre-rewrite em dash, semicolon and Oxford comma counts (REQ-004) [evidence: pre-rewrite HVR counts 0/0/2 (em dash, semicolon, Oxford patterns)]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 [P0] Rewrite `.opencode/skills/sk-code/sk-code-opencode/README.md` purpose-first per the refined template and the mcp-obsidian exemplar: one-line blockquote pitch, a problem-first OVERVIEW with Why This Skill Exists and then earned sections (REQ-003) [evidence: rewrite done; README opens with pitch blockquote then `## 1. AT A GLANCE` and problem-first `## 2. OVERVIEW` with `### Why This Skill Exists` before any feature list]
- [x] T006 [P0] Confirm every fact from the old README survives via a section-by-section diff and keep the draft HVR clean while writing (REQ-007, REQ-004) [evidence: 8/8 old README fact groups present in final README: kind, carries, reach, mutates, layout, webflow boundary, primary role, spec-kit hand-off]
- [x] T007 [P0] Bump the README frontmatter version field from `1.0.0.4` to `1.0.0.5` (REQ-005) [evidence: `rg -n '^version:'` shows `version: 1.0.0.5`]
- [x] T008 [P0] Add `.opencode/skills/sk-code/sk-code-opencode/changelog/v1.0.0.5.md` with a release note for the README rewrite (REQ-005) [evidence: `changelog/v1.0.0.5.md` exists with the titled rewrite entry]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 [P0] Run `validate_document.py --type readme` on the rewritten README and confirm zero issues (REQ-006) [evidence: `validate_document.py` post-rewrite exit 0 with 0 issues]
- [x] T010 [P0] Run the HVR grep on the rewritten README and confirm zero em dashes, zero semicolons and zero Oxford comma patterns (REQ-004) [evidence: post-rewrite HVR counts 0/0/0/0 (em dash, semicolon, Oxford, banned words)]
- [x] T011 [P0] Run the link guard on every README link, confirm `git diff --check` is clean and review the scope diff to confirm only the README, the changelog entry and phase docs changed (REQ-008) [evidence: link guard 8/8 resolve; `git diff --check` exit 0; scope diff 3/3 expected paths]
- [x] T012 [P1] Run `validate.sh` on this phase folder, confirm zero errors and record verification evidence in checklist.md (REQ-009) [evidence: `validate.sh --strict` exit 0 with Errors: 0 Warnings: 0 after metadata regeneration]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The sk-code-opencode README is purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW, passes the README validator with zero issues, passes the HVR grep and the link guard, carries the bumped version `1.0.0.5` with the changelog entry and preserves every fact of the old README. No SKILL.md, sibling README, template or vault file is modified.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` (REQ-001..REQ-009)
- Plan: `plan.md`
- Checklist: `checklist.md`
- Parent packet spec: `../spec.md`
- Refined README template: `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`
- Exemplar: `.opencode/skills/mcp-tooling/mcp-obsidian/README.md`
- Target README: `.opencode/skills/sk-code/sk-code-opencode/README.md`
<!-- /ANCHOR:cross-refs -->
