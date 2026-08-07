---
title: "Tasks: Phase 021 sk-design-md-generator README revisit (rewrite)"
description: "Task list for rewriting the sk-design-md-generator mode skill README purpose-first per the refined template and the mcp-obsidian exemplar, with a version bump, a changelog entry and validation."
trigger_phrases:
  - "phase 021 tasks"
  - "md generator readme tasks"
  - "sk design readme rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/021-sk-design-md-generator"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 021 task list inside 026-skill-readme-refinement"
    next_safe_action: "Execute setup, rewrite and verification tasks in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/021-sk-design-md-generator"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 021 sk-design-md-generator README revisit (rewrite)

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T010. `[P]` marks parallelizable tasks.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the current README (`.opencode/skills/sk-design/sk-design-md-generator/README.md`) and record the baseline: the version field, the `validate_document.py --type readme` output and the link state [evidence: baseline version `1.0.0.0`, validator `0 issues` exit `0`, links `11/11` resolve, HVR baseline `FAIL` (em dashes, semicolons and Oxford commas present)]
- [x] T002 [P] Read the refined README template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and record its section model and required-section rule [evidence: section model `9` sections, OVERVIEW the only required section, capability pattern recorded]
- [x] T003 [P] Read the mcp-obsidian exemplar README (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) and record its purpose-first structure [evidence: purpose-first order recorded: pitch, `AT A GLANCE`, `OVERVIEW`, capability layer, `RELATED DOCUMENTS` last]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Rewrite the README purpose-first per the refined template with a one-line pitch and a problem-first OVERVIEW (`.opencode/skills/sk-design/sk-design-md-generator/README.md`) [evidence: rewritten, H2 `9/9` numbered ALL-CAPS with `---` dividers, pitch `1/1`, OVERVIEW problem-first `1/1`, capability section `1`]
- [x] T005 Bump the version field in the README frontmatter [evidence: version `1.0.0.0` -> `1.1.0.0` in README frontmatter]
- [x] T006 Add the changelog entry at `changelog/<version>.md` matching the bumped version [evidence: entry added at `changelog/v1.1.0.0.md`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 [P] Run the readme validator and confirm zero issues on the rewritten README [evidence: `validate_document.py` exit `0`, `0 issues`, document VALID on final README]
- [x] T008 [P] Run the HVR grep and confirm zero em dashes, zero semicolons and zero Oxford commas [evidence: em dash `0`, semicolon `0`, Oxford comma `0`, banned words `0`]
- [x] T009 [P] Run the link guard and `git diff --check` and confirm both are clean [evidence: links `11/11` resolve, `git diff --check` clean, staged `0`]
- [x] T010 Review the scope diff against the prior README for preserved facts and out-of-scope files, run `validate.sh` on this phase folder and record the evidence in checklist.md [evidence: facts `74/74` single-line fact tokens preserved, out-of-scope `0` files, `validate.sh --strict` exit `0` zero errors]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The README reads purpose-first with a one-line pitch and a problem-first OVERVIEW, every fact from the prior README is preserved, the version field is bumped with a matching changelog entry, the validator reports zero issues, the HVR grep and the link guard are clean and no out-of-scope file is touched. `validate.sh` reports zero errors on this phase folder.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` (REQ-001..REQ-009)
- Plan: `plan.md`
- Checklist: `checklist.md`
- Parent spec: `../spec.md`
- Packet spec: `../../spec.md`
- Refined template: `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`
- Exemplar: `.opencode/skills/mcp-tooling/mcp-obsidian/README.md`
- Target README: `.opencode/skills/sk-design/sk-design-md-generator/README.md`
<!-- /ANCHOR:cross-refs -->
