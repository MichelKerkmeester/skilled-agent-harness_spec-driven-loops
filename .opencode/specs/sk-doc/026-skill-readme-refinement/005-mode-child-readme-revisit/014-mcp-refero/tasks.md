---
title: "Tasks: Phase 014 mcp-refero README rewrite"
description: "Task list for rewriting the mcp-refero mode skill README on the refined standalone README template."
trigger_phrases:
  - "phase 14 tasks"
  - "refero readme tasks"
  - "mcp refero readme tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/014-mcp-refero"
    last_updated_at: "2026-08-04T14:09:00Z"
    last_updated_by: "spec-author"
    recent_action: "Rewrote mcp-refero README purpose-first at 1.1.0.0 with changelog entry; all tasks marked"
    next_safe_action: "Packet review can verify the README, changelog and phase docs"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/014-mcp-refero"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 014 mcp-refero README rewrite

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T010. `[P0]` marks blocking tasks, `[P1]` marks required tasks with approved deferral allowed.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read the current README (`.opencode/skills/mcp-tooling/mcp-refero/README.md`) and record the baseline: version field, validator output and link state [evidence: baseline `version: 1.0.0.0`; `validate_document.py` exit 0; links 11/11 resolve]
- [x] T002 [P0] Read the refined standalone README template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and record its section model and required-section rule [evidence: `skill-readme-template.md` read; 9-section model; OVERVIEW is the only required section]
- [x] T003 [P1] Read the mcp-obsidian exemplar README (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) and record its pilot structure [evidence: `mcp-obsidian/README.md` read; pilot shape = pitch blockquote + AT A GLANCE first + capability table]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Rewrite the README purpose-first on the refined template: one-line pitch and problem-first OVERVIEW before any reference material. If the README already conforms, record the verify-only decision and skip the rewrite [evidence: rewrite done; README opens with pitch blockquote then `## 1. AT A GLANCE` and problem-first `## 2. OVERVIEW` before reference tables]
- [x] T005 [P0] Rewrite the remaining sections on the refined template with every fact preserved (eight-tool surface, doubled-prefix callable, plan gating, auth posture) [evidence: 8/8 tools, `refero.refero_refero_<tool>` callable, `8,000` quota, `~/.mcp-auth` posture all present in final README]
- [x] T006 [P0] Bump the README version field to 1.1.0.0 [evidence: `head -8` shows `version: 1.1.0.0`]
- [x] T007 [P0] Add the changelog entry at `.opencode/skills/mcp-tooling/mcp-refero/changelog/v1.1.0.0.md` [evidence: `changelog/v1.1.0.0.md` exists with NEW/CHANGED/NOT CHANGED entry]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 [P0] Run `validate_document.py --type readme` on the README and the HVR grep (zero em dashes, zero semicolons and zero Oxford commas) [evidence: `validate_document.py` exit 0 with 0 issues; HVR grep 0/0/0 matches]
- [x] T009 [P0] Run the link guard, the scope diff (`git diff --check`) and `validate.sh` on this phase folder [evidence: link guard 10/10; `git diff --check` exit 0; `validate.sh` zero errors]
- [x] T010 [P1] Record verification evidence in checklist.md and write the implementation summary [evidence: checklist.md 16/16 marked; `backfill-graph-metadata.ts` regenerated `graph-metadata.json` and `generate-description.js` regenerated `description.json`; `validate.sh --strict` exit 0; implementation-summary.md written]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The README opens purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW, passes the validator with zero issues, passes the HVR grep, carries version 1.1.0.0 with a changelog entry at `changelog/v1.1.0.0.md` and leaves no out-of-scope file modified.
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
- Target README: `.opencode/skills/mcp-tooling/mcp-refero/README.md`
<!-- /ANCHOR:cross-refs -->
