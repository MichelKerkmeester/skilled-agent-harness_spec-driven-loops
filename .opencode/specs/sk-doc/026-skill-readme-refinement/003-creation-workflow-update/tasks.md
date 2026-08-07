---
title: "Task List — Phase 003 — creation workflow README template wiring"
description: "Sequenced tasks for wiring both README templates into the create-skill workflow."
trigger_phrases:
  - "phase 003 tasks"
  - "creation workflow update tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/003-creation-workflow-update"
    last_updated_at: "2026-08-04T19:05:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 003 task list"
    next_safe_action: "Execute tasks T001 through T011"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-creation-workflow-update"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Task List — Phase 003 — creation workflow README template wiring

<!-- ANCHOR:notation -->
## Task Notation

Tasks use T### ids with a priority tag. P0 tasks block phase completion. P1 tasks must complete or receive a user-approved deferral. All tasks are unchecked at scaffold time and get checked with evidence during execution.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read `.opencode/skills/sk-doc/sk-create-skill/references/skill/creation-workflow.md` end to end and inventory every step where README emission belongs (authoring step, packaging step, frontmatter contract) [evidence: full workflow read, README emission belongs before `Step 5` packaging]
- [x] T002 [P0] Read the refined standalone template `assets/skill/skill-readme-template.md` (phase 001 output) and record its section model and required fields [evidence: `skill-readme-template.md` section model and version fields recorded]
- [x] T003 [P0] Read the new parent-skill template `assets/parent-skill/parent-skill-readme-template.md` (phase 002 output) and record its hub-level sections [evidence: `parent-skill-readme-template.md` six hub surfaces recorded]
- [x] T004 [P1] Scan `references/skill/examples-and-maintenance.md` for README authoring content and record the scan result [evidence: `rg -n` returned no README-authoring matches]
- [x] T005 [P1] Capture the pre-edit baseline: `git diff --stat`, the current README exemption note (frontmatter contract section) and the validator and link guard states [evidence: `git diff --stat`, README exemption at workflow frontmatter section and baseline validators recorded]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 [P0] Add the README emission step to the standalone skill path, naming `assets/skill/skill-readme-template.md` and its required fields [evidence: standalone template link and `title`/`description`/`version` guidance added]
- [x] T007 [P0] Add the README emission step to the parent hub path, naming `assets/parent-skill/parent-skill-readme-template.md` and its hub-level sections [evidence: parent template link and six hub surfaces added]
- [x] T008 [P0] Add the template choice rule as an explicit decision point covering standalone skills, parent hubs and child modes with their own READMEs [evidence: `Template choice rule` names all 3 skill roles]
- [x] T009 [P0] Add post-authoring validation steps in order: README validator, HVR grep, link resolution, version field check, before packaging [evidence: ordered gate list `1` through `4` appears before Step 5]
- [x] T010 [P1] Update `examples-and-maintenance.md` only if the scan in T004 found README authoring content, otherwise leave it untouched [evidence: `rg -n` found no README authoring content, file untouched]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 [P0] Run the style gate: grep for em dashes, semicolons, Oxford commas and decimal headings in the changed workflow file [evidence: `rg -n` style scan clean, decimal-heading scan clean]
- [x] T012 [P0] Verify every internal link in the updated workflow resolves, including links to both README template assets [evidence: `22/22` links resolve, broken `0`]
- [x] T013 [P0] Confirm the scope diff touches only the workflow file, the conditional doc if changed and this phase's docs [evidence: `git diff --stat` scope reviewed, template assets untouched]
- [x] T014 [P1] Run `validate.sh --strict` on this phase folder and record zero errors [evidence: `validate.sh --strict` errors `0`]
- [x] T015 [P1] Re-read the updated workflow end to end and record coherence notes, then fill checklist evidence with real command output [evidence: workflow re-read, `checklist.md` evidence filled]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- The workflow tells standalone authors which template to emit and how to validate it.
- The workflow tells parent hub authors which template to emit and how to validate it.
- The choice rule covers every skill type with no ambiguity.
- Style gate, link gate, scope gate and phase validation all pass.
- `completion_pct` stays 0 per the packet hard rule while the spec-memory daemon is down.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

| Reference | Path |
|-----------|------|
| Phase spec | `spec.md` in this folder |
| Phase plan | `plan.md` in this folder |
| Phase checklist | `checklist.md` in this folder |
| Parent spec | `../spec.md` (packet 026) |
<!-- /ANCHOR:cross-refs -->
| Workflow target | `.opencode/skills/sk-doc/sk-create-skill/references/skill/creation-workflow.md` |
| Standalone template | `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` |
| Parent template | `.opencode/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-readme-template.md` |
| Style rules | `.opencode/skills/sk-doc/shared/references/hvr-rules.md` |
