---
title: "Tasks: Phase 24 sk-create-changelog README rewrite"
description: "Task list for rewriting the sk-create-changelog README against the refined template, with a version bump, a changelog entry and validation."
trigger_phrases:
  - "phase 24 tasks"
  - "sk create changelog readme tasks"
  - "changelog readme rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/024-sk-create-changelog"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 24 task list inside 026-skill-readme-refinement"
    next_safe_action: "Execute setup, implementation and verification tasks in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/024-sk-create-changelog"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 24 sk-create-changelog README rewrite

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T010. `[P]` marks parallelizable tasks.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the refined README template (`.opencode/skills/sk-doc/sk-create-readme/assets/readme-template.md`) and record its section model and required-section rule (REQ-001) [evidence: `skill-readme-template.md` §2, `OVERVIEW` required, `9` section model]
- [x] T002 [P] Read the mcp-obsidian exemplar README (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) and record the narrative structure to mirror [evidence: `mcp-obsidian/README.md` `1.6.0.0`, `9` sections, capability layer]
- [x] T003 [P] Read the current README (`.opencode/skills/sk-doc/sk-create-changelog/README.md`) and record the baseline: version field value, validator output, link state (REQ-002) [evidence: `version: 1.0.0.0`, `Total issues: 0`, `6/6` links resolve]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Draft the one-line pitch and the problem-first OVERVIEW for the rewritten README (REQ-003) [evidence: `README.md` §1 blockquote, §2 problem-first]
- [x] T005 Rewrite the capability sections preserving every factual surface: source resolution, global versus nested detection, four-part version rules, format selection, validation, troubleshooting (REQ-003, REQ-007) [evidence: `9` sections, `6/6` troubleshooting rows, `4/4` FAQ]
- [x] T006 Bump the version field in the README frontmatter per the skill version rules (REQ-005) [evidence: `rg '^version:'` → `1.0.1.2`]
- [x] T007 Add the matching changelog entry under `.opencode/skills/sk-doc/sk-create-changelog/changelog/` (REQ-005) [evidence: `changelog/v1.0.1.2.md` created]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 [P] Run `validate_document.py --type readme` on the rewritten README and record the output (REQ-006) [evidence: `Total issues: 0`, `EXIT=0`]
- [x] T009 [P] Run the HVR grep, the link guard, `git diff --check` and the scope diff, then record the results (REQ-004, REQ-008) [evidence: `0/0/0` HVR, `6/6` links, `git diff --check` `0`]
- [x] T010 Run `validate.sh` on this phase folder, record the evidence in checklist.md and regenerate the phase metadata (REQ-009) [evidence: `Errors: 0`, `1` warn scaffold-wide, `description.json` refreshed]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The README is purpose-first per the refined template with a one-line pitch and a problem-first OVERVIEW, passes `validate_document.py --type readme` with zero issues, passes the HVR grep, carries a bumped version field and a matching changelog entry, resolves every relative link and passes `git diff --check`. No file outside the README, the changelog entry and this phase folder is modified.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` (REQ-001..REQ-009)
- Plan: `plan.md`
- Checklist: `checklist.md`
- Parent phase spec: `../spec.md` (005-mode-child-readme-revisit)
- Refined template: `.opencode/skills/sk-doc/sk-create-readme/assets/readme-template.md`
- Pilot exemplar: `.opencode/skills/mcp-tooling/mcp-obsidian/README.md`
- Skill README: `.opencode/skills/sk-doc/sk-create-changelog/README.md`
<!-- /ANCHOR:cross-refs -->
