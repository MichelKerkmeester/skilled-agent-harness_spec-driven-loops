---
title: "Tasks: Phase 036 deep-alignment mode README revisit"
description: "Task list for rewriting the deep-alignment mode skill README on the refined template with the mcp-obsidian exemplar as the pattern."
trigger_phrases:
  - "phase 036 tasks"
  - "deep alignment readme tasks"
  - "mode readme rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/036-deep-alignment"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 036 task list inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute setup, rewrite and verification tasks in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/036-deep-alignment"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 036 deep-alignment mode README revisit

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T012. `[P0]` and `[P1]` mark priority per the spec requirements. `[P]` marks parallelizable tasks.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read the refined README template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and record its section model and writing rules [evidence: `skill-readme-template.md` read: numbered ALL-CAPS H2 model, `AT A GLANCE` first, `OVERVIEW` required, HVR greps, 4-part versioning, changelog convention]
- [x] T002 [P0] Read the mcp-obsidian exemplar README (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) and record its pitch and overview pattern [evidence: `mcp-obsidian/README.md` read: pitch blockquote after H1, `AT A GLANCE` first, problem-first `Why This Skill Exists`, capability table in OVERVIEW]
- [x] T003 [P0] Read the current README (`.opencode/skills/system-deep-loop/deep-alignment/README.md`) and record the baseline: version field value, `validate_document.py` output and link state [evidence: baseline recorded: version `1.0.0.1`, validator `0` issues exit `0`, links `22/22` resolve, HVR baseline `1` semicolon + `3` Oxford commas]
- [x] T004 [P1] [P] Inventory the changelog folder (`.opencode/skills/system-deep-loop/deep-alignment/changelog/`) and confirm the newest entry name [evidence: `changelog/` holds `v1.0.0.0.md` only, newest entry `v1.0.0.0`; `SKILL.md` version `1.0.0.2` sets the bump target]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 [P0] Rewrite the README purpose-first: blockquote pitch after the H1, AT A GLANCE first and a problem-first OVERVIEW with Why This Skill Exists [evidence: rewritten README: pitch blockquote follows H1, `## 1. AT A GLANCE` first, `Why This Skill Exists` opens with the problem before any feature list]
- [x] T006 [P0] Carry the factual core in prose: the adapter contract, the four invariants, the convergence model and the lane model, keeping the feature catalog and playbook counts intact [evidence: token scan `21/21` kept: `four invariants`, `AUTHORITY_ARTIFACT_CLASSES`, `batchSize`, `validateLane`, `21 features`, `31 deterministic scenarios`]
- [x] T007 [P1] Keep the numbered ALL-CAPS H2 section model with `---` dividers and stable links to `SKILL.md` and the references [evidence: `rg -n '^## [0-9]+' ` shows `9/9` numbered ALL-CAPS H2 with `---` dividers; link guard `22/22` resolve]
- [x] T008 [P0] Bump the frontmatter version field in the README from the recorded baseline [evidence: frontmatter `version: 1.0.0.2`, bumped from baseline `1.0.0.1` and aligned with `SKILL.md` `1.0.0.2`]
- [x] T009 [P0] Add the changelog entry at `changelog/<version>.md` following the per-release convention [evidence: `changelog/v1.0.0.2.md` created with summary, `## What Changed`, `## Files Changed`, `## Upgrade` per `v1.0.0.0.md` shape]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 [P0] Run `validate_document.py --type readme` on the rewritten README and record the output [evidence: `validate_document.py --type readme` reports `0` issues, exit `0`]
- [x] T011 [P0] Run the HVR grep (zero em dashes, zero semicolons and zero Oxford commas) and the link guard on the rewritten README [evidence: `rg` HVR scan `0` em dashes, `0` semicolons, `0` Oxford commas, `0` banned words; link guard `22/22` resolve]
- [x] T012 [P0] Review the scoped `git diff` for out-of-scope files, run `git diff --check` and `validate.sh` on this phase folder, then record evidence in checklist.md [evidence: `git diff --check` exit `0`; scope diff = `README.md` + `changelog/v1.0.0.2.md` + phase docs only; `validate.sh` errors `0` (1 pre-existing scaffold `COMPLEXITY_MATCH` warning)]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The README is purpose-first with a one-line pitch and a problem-first OVERVIEW, the facts survive a section-by-section diff, the version field is bumped, the changelog entry exists, the validator reports zero issues, the HVR grep and link guard are clean, `git diff --check` passes and this phase folder validates with zero errors. No SKILL.md, template, sibling README or hub asset is modified.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` (REQ-001..REQ-009)
- Plan: `plan.md`
- Checklist: `checklist.md`
- Parent spec: `../spec.md` (005-mode-child-readme-revisit)
- Grandparent spec: `../../spec.md` (026-skill-readme-refinement)
- Refined template: `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`
- Exemplar: `.opencode/skills/mcp-tooling/mcp-obsidian/README.md`
- Target: `.opencode/skills/system-deep-loop/deep-alignment/README.md`
<!-- /ANCHOR:cross-refs -->
