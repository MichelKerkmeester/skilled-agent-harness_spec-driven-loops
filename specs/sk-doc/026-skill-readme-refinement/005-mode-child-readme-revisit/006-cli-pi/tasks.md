---
title: "Tasks: Phase 6 cli-pi mode skill README revisit"
description: "Task list for rewriting the cli-pi skill README against the refined README template with the mcp-obsidian exemplar, including the version bump and changelog entry."
trigger_phrases:
  - "phase 6 tasks"
  - "cli pi readme tasks"
  - "mode readme rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/006-cli-pi"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 6 task list inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute setup, implementation and verification tasks in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/006-cli-pi"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 6 cli-pi mode skill README revisit

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T010. `[P0]` and `[P1]` mark the priority tier. `[P]` marks parallelizable tasks.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read the refined README template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and the mcp-obsidian exemplar README (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) and record the section model and required-section rule [evidence: `skill-readme-template.md` read; 9-section model with `OVERVIEW` required; exemplar pitch + capability-layer shape recorded]
- [x] T002 [P0] [P] Read the current cli-pi README (`.opencode/skills/cli-external-orchestration/cli-pi/README.md`) and record the baseline: version field, validator output and link state [evidence: `version: 1.2.0.0`; validator exit `0` with `0` issues; links `20/20` OK; HVR baseline `0/1/17`]
- [x] T003 [P1] [P] Inventory the cli-pi changelog folder (`.opencode/skills/cli-external-orchestration/cli-pi/changelog/`) and record the head version for the bump decision [evidence: changelog head `v1.3.0.0`; bump target `1.4.0.0`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Rewrite the cli-pi README purpose-first per the refined template with a one-line pitch and a problem-first OVERVIEW, preserving every verifiable fact [evidence: `README.md` rewritten; pitch blockquote + problem-first `Why This Skill Exists` + Output Contract Layer table; facts `53/53` survive case-insensitive diff]
- [x] T005 [P0] Bump the README version field from the changelog head and add the changelog entry at `changelog/<version>.md` [evidence: `version: 1.4.0.0`; `changelog/v1.4.0.0.md` added with Changed/Not Changed entry]
- [x] T006 [P1] Run the section-by-section diff against the pre-rewrite README and confirm no capability, path or pinned-contract fact is lost [evidence: fact tokens `53/53` present in new README; links `21/21` OK; pinned-contract link OK]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 [P0] [P] Run `validate_document.py --type readme` on the README and the HVR greps (em dashes, semicolons, Oxford commas) [evidence: validator exit `0` with `0` issues; HVR greps all `0` matches]
- [x] T008 [P1] [P] Run the link guard over the README body and `git diff --check` on the change set [evidence: links `21/21` OK; `git diff --check` clean]
- [x] T009 [P1] [P] Run `validate.sh` on this phase folder and confirm zero errors [evidence: `validate.sh --strict` exit `0`]
- [x] T010 [P1] Record verification evidence in checklist.md and reconcile the phase metadata [evidence: checklist `16/16` marked; `generate-context.js` attempted, memory-index refresh skipped by daemon single-writer policy (mk-spec-memory owns `context-index.sqlite`)]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The README is purpose-first with a one-line pitch and a problem-first OVERVIEW, passes the validator with zero issues, passes the HVR greps, carries a bumped version field with a changelog entry, preserves every verifiable fact and this phase folder validates with zero errors. No out-of-scope file is modified.
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
- Target README: `.opencode/skills/cli-external-orchestration/cli-pi/README.md`
<!-- /ANCHOR:cross-refs -->
