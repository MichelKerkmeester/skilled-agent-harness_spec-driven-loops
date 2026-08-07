---
title: "Tasks: Phase 022 sk-create-agent README revisit (rewrite per refined template)"
description: "Task list for rewriting or aligning the sk-create-agent mode skill README against the refined README template and the mcp-obsidian exemplar."
trigger_phrases:
  - "phase 022 tasks"
  - "sk create agent readme tasks"
  - "create agent readme rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/022-sk-create-agent"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 022 task list inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute setup, implementation and verification tasks in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/022-sk-create-agent"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 022 sk-create-agent README revisit (rewrite per refined template)

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T011. `[P]` marks parallelizable tasks.
- Tags: `[P0]` = blocking gate, `[P1]` = required or explicitly deferred.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the refined README template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and record its section model and required-section rule [P0] [evidence: `skill-readme-template.md` §2, `OVERVIEW` required, `9` section model]
- [x] T002 [P] Read the current README (`.opencode/skills/sk-doc/sk-create-agent/README.md`) and record the baseline: version field value, `validate_document.py --type readme` output and link state [P0] [evidence: `version: 1.0.0.0` baseline, `Total issues: 0`, `6/6` links resolve]
- [x] T003 [P] Read the mcp-obsidian exemplar README (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) and record its section order and voice [P1] [evidence: `mcp-obsidian/README.md` `1.6.0.0`, `9` sections, capability layer]
- [x] T004 [P] Inventory the changelog folder (`.opencode/skills/sk-doc/sk-create-agent/changelog/`) and record the changelog head [P1] [evidence: changelog head `v1.0.1.1`, `3` entries in `changelog/`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Verify the README against the refined template gate by gate and rewrite it purpose-first on any failing gate: one-line pitch, problem-first OVERVIEW and the template section order (`.opencode/skills/sk-doc/sk-create-agent/README.md`) [P0] [evidence: `README.md` `9` sections, pitch §1, problem-first §2, HVR `0/0/0`]
- [x] T006 Bump the version field in the README frontmatter and record the new value [P0] [evidence: `rg '^version:'` → `1.0.1.2`]
- [x] T007 Add the changelog entry at `.opencode/skills/sk-doc/sk-create-agent/changelog/<version>.md` matching the bumped version field [P0] [evidence: `changelog/v1.0.1.2.md` created, validator `Total issues: 0`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 [P] Run `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/sk-doc/sk-create-agent/README.md --type readme` and record the issue count [P0] [evidence: `Total issues: 0`, `EXIT=0`]
- [x] T009 [P] Run the HVR grep (zero em dashes, zero semicolons and zero Oxford commas) and the link guard on the README [P0] [evidence: HVR `0/0/0`, banned words `0`, links `6/6`, `git diff --check` `0`]
- [x] T010 Review the scoped diff: `git diff --check` clean, section-by-section fact comparison against the prior README and no out-of-scope file changed [P1] [evidence: `22/22` fact tokens, `git status` `3` paths, `0` staged]
- [x] T011 Run `validate.sh` on this phase folder, record zero errors, write the implementation summary and regenerate the phase metadata [P1] [evidence: `Errors: 0`, `1` warn scaffold-wide, `implementation-summary.md` written, metadata refreshed]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The README conforms on every gate: `validate_document.py --type readme` zero issues, HVR clean, links resolving, version field present, matching changelog entry at `changelog/<version>.md` and `git diff --check` clean. No SKILL.md content and no other packet file is modified.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` (REQ-001..REQ-009)
- Plan: `plan.md`
- Checklist: `checklist.md`
- Parent phase spec: `../spec.md` (005-mode-child-readme-revisit)
- Parent packet spec: `../../spec.md` (026-skill-readme-refinement)
- Refined template: `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`
- Exemplar: `.opencode/skills/mcp-tooling/mcp-obsidian/README.md`
<!-- /ANCHOR:cross-refs -->
