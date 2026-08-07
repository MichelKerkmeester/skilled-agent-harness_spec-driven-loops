---
title: "Tasks: Phase 038 deep-research mode skill README revisit"
description: "Task list for the purpose-first rewrite of the deep-research mode skill README in the system-deep-loop hub."
trigger_phrases:
  - "phase 038 tasks"
  - "deep research readme tasks"
  - "mode readme rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/038-deep-research"
    last_updated_at: "2026-08-04T18:47:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 038 task list inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute setup, rewrite and verification tasks in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/038-deep-research"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 038 deep-research mode skill README revisit

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T012. `[P0]` marks a blocker, `[P1]` marks a required item.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read the current README (`.opencode/skills/system-deep-loop/deep-research/README.md`) and record the baseline: version field value, validator output and link state [evidence: baseline `version: 1.14.0.46`, `validate_document.py` exit `0` with `0` issues, links `32/32` resolved before rewrite]
- [x] T002 [P0] Read the refined template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and the mcp-obsidian exemplar (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) and record the section model and the required-section rule [evidence: `skill-readme-template.md` read, `9`-section model, OVERVIEW-only required, `mcp-obsidian/README.md` exemplar read]
- [x] T003 [P1] Inventory the changelog folder (`.opencode/skills/system-deep-loop/deep-research/changelog/`) and confirm the next version number for the changelog entry [evidence: `ls changelog/` shows `19` entries, latest `v1.14.0.0.md`, next entry `v1.15.0.0` confirmed]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Rewrite the README purpose-first per the refined template with a one-line pitch and a problem-first OVERVIEW, or confirm verify-only conformance if the document already matches the standard [evidence: rewrite is a full re-shape, pitch blockquote after H1, problem-first `OVERVIEW`, `9/9` sequential ALL-CAPS H2 sections]
- [x] T005 [P0] Carry every fact from the current README into the rewrite, section by section [evidence: section-by-section diff keeps `32/32` links, `8/8` troubleshooting rows, `5/5` FAQ items, `7/7` maintainer checklist items]
- [x] T006 [P0] Bump the version field in the README frontmatter to `1.15.0.0` [evidence: grep `version:` in `README.md` returns `1.15.0.0`]
- [x] T007 [P0] Add the changelog entry at `.opencode/skills/system-deep-loop/deep-research/changelog/v1.15.0.0.md` [evidence: file exists at `changelog/v1.15.0.0.md`, `validate_document.py --type changelog` exit `0` with `0` issues]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 [P0] Run `validate_document.py --type readme` on the README and record the output [evidence: `validate_document.py` exit `0`, `0` issues reported on rewritten README]
- [x] T009 [P0] Run the HVR grep for zero em dashes, zero semicolons and zero Oxford commas in the README body [evidence: `rg` counts em dash `0`, semicolon `0`, Oxford comma `0`, banned words `0`]
- [x] T010 [P0] Run the link guard over every link in the rewritten README [evidence: link check reports `32` links, `0` missing]
- [x] T011 [P1] Confirm the scope diff touches only the README, the changelog entry and this phase folder [evidence: `git status` shows `README.md` modified, `changelog/v1.15.0.0.md` untracked, phase folder untracked, nothing else]
- [x] T012 [P1] Run `validate.sh` on this phase folder and record the exit status [evidence: `validate.sh --strict` exit `0`, errors `0` warnings `0` after plan phase-heading fix]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The README is purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW, every fact survives the rewrite, the version field is bumped, the changelog entry exists, the validator reports zero issues, the HVR grep is clean, all links resolve and this phase folder validates with zero errors. No out-of-scope file is modified.
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
- Target README: `.opencode/skills/system-deep-loop/deep-research/README.md`
<!-- /ANCHOR:cross-refs -->
