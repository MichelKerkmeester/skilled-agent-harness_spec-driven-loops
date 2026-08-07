---
title: "Tasks: Phase 023 sk-create-benchmark README revisit"
description: "Task list for rewriting the sk-create-benchmark skill README against the refined template and the mcp-obsidian exemplar."
trigger_phrases:
  - "phase 023 tasks"
  - "create-benchmark readme tasks"
  - "benchmark readme rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/023-sk-create-benchmark"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 023 task list inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute setup, implementation and verification tasks in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/023-sk-create-benchmark"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 023 sk-create-benchmark README revisit

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T010. `[P]` marks parallelizable tasks.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the refined standalone README template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and record its section model and required-section rule [evidence: section model `9` numbered sections, `OVERVIEW` required, pitch blockquote after H1]
- [x] T002 [P] Read the mcp-obsidian exemplar README (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) and record its narrative structure [evidence: `AT A GLANCE` first, capability layer table, problem-first OVERVIEW, exemplar HVR clean `0/3`]
- [x] T003 [P] Read the current README (`.opencode/skills/sk-doc/sk-create-benchmark/README.md`) and record the baseline: version field, validator output, link state [evidence: version `1.0.0.0`, validator `0 issues`, changelog max `v1.4.0.0`, HVR hits `6`, links `8/8`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Rewrite the README purpose-first at `.opencode/skills/sk-doc/sk-create-benchmark/README.md` with a one-line pitch and a problem-first OVERVIEW per the refined template [evidence: rewritten `README.md` with pitch blockquote, problem-first OVERVIEW, capability layer, `9` numbered sections]
- [x] T005 Bump the frontmatter version field to 1.5.0.0 [evidence: `rg -n "^version"` reports `version: 1.5.0.0`]
- [x] T006 Add `changelog/v1.5.0.0.md` with an entry describing the rewrite [evidence: `changelog/v1.5.0.0.md` exists, titled `v1.5.0.0: purpose-first README rewrite`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 [P] Run `validate_document.py --type readme` on the rewritten README, the HVR grep (zero em dashes, zero semicolons, zero Oxford commas) and the link guard [evidence: validator `0 issues`, HVR `0/4` greps clean, links `8/8` resolve]
- [x] T008 [P] Run the scope diff (`git diff`) and `git diff --check` to confirm only the README, the changelog entry and this phase's docs changed [evidence: `git diff --stat` `1` file, `git diff --check` exit `0`, scope `README.md` + `v1.5.0.0.md` + phase docs]
- [x] T009 Run `validate.sh` on this phase folder and record the exit status [evidence: `validate.sh` exit `0`, errors `0`, warnings `1`]
- [x] T010 Record verification evidence in checklist.md [evidence: `checklist.md` marked `16/16` with backticked tokens]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The README opens purpose-first with a one-line pitch and a problem-first OVERVIEW, passes the validator with zero issues, is HVR clean, carries version 1.5.0.0 with a changelog entry and no out-of-scope file is modified.
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
- Target README: `.opencode/skills/sk-doc/sk-create-benchmark/README.md`
<!-- /ANCHOR:cross-refs -->
