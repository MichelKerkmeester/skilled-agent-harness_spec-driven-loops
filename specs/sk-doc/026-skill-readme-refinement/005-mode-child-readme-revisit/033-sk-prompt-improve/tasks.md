---
title: "Tasks: Phase 033 sk-prompt-improve README revisit"
description: "Task list for rewriting the sk-prompt-improve mode README against the refined template, bumping the version, adding a changelog entry and validating."
trigger_phrases:
  - "phase 033 tasks"
  - "sk-prompt-improve readme tasks"
  - "prompt improve readme rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/033-sk-prompt-improve"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 033 task list inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute setup, rewrite and verification tasks in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/033-sk-prompt-improve"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 033 sk-prompt-improve README revisit

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T009. `[P]` marks parallelizable tasks.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the current README at `.opencode/skills/sk-prompt/sk-prompt-improve/README.md` and record the baseline: version field (2.3.0.21), validator output and link state [evidence: baseline `version: 2.3.0.21`, validator exit `0` `Total issues: 0`, links `9/9` resolve]
- [x] T002 Read the refined README template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and the mcp-obsidian exemplar (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) and record the target structure [evidence: `skill-readme-template.md` v`1.9.0.0` and `mcp-obsidian/README.md` v`1.6.0.0` read; section model `9` sections, OVERVIEW the only required section]
- [x] T003 [P] Run the baseline `validate_document.py --type readme` and the HVR `rg -n` on the current README and record the output [evidence: baseline validator exit `0`; HVR baseline em dash `0`, semicolons `0`, Oxford `5` prose hits, banned words `0`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Rewrite the README purpose-first per the refined template with a one-line pitch and a problem-first OVERVIEW, or confirm verify-only status if it already conforms [evidence: rewrite written; pitch `1/1` blockquote, OVERVIEW problem-first `1/1`, H2 `9/9` numbered ALL-CAPS with `---` dividers, capability layer `7/7` framework rows]
- [x] T005 Bump the version field in the README frontmatter and correct the validator path from the legacy `prompt:improve` name to `sk-prompt-improve` [evidence: frontmatter `version: 2.3.1.0`; validator path corrected to `.opencode/skills/sk-prompt/sk-prompt-improve/README.md`]
- [x] T006 Add the changelog entry at `changelog/<version>.md` per the packet changelog convention [evidence: `changelog/v2.3.1.0.md` present, `1723` bytes, frontmatter `version: 2.3.1.0`, What Changed `5` bullets]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 [P] Run `validate_document.py --type readme`, the HVR `rg -n`, the link guard and `git diff --check` on the rewrite [evidence: validator exit `0` `Total issues: 0`; HVR em dash `0`, semicolons `0`, Oxford `0`, banned words `0`; links `9/9`; `git diff --check` exit `0`]
- [x] T008 Confirm the scope diff touches only the README, the changelog entry and this phase folder [evidence: `git status --porcelain` lists only README `M`, changelog `??`, phase folder `??`; staged files `0`]
- [x] T009 Run `validate.sh` on this phase folder and record all evidence in checklist.md [evidence: `validate.sh --strict` exit `0` `Errors: 0` `Warnings: 0`; metadata regenerated via `generate-description.js` and `backfill-graph-metadata.js`]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The README is purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW, every fact from the old document is preserved, the version field is bumped, the changelog entry is in place, the validator reports zero issues, the HVR grep is clean and this phase folder validates with zero errors. No SKILL.md, template, exemplar, vault file or sibling README is modified.
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
- Target README: `.opencode/skills/sk-prompt/sk-prompt-improve/README.md`
<!-- /ANCHOR:cross-refs -->
