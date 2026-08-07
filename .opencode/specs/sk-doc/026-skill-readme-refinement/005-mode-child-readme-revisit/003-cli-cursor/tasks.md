---
title: "Tasks: Phase 003 cli-cursor README rewrite"
description: "Task list for rewriting the cli-cursor skill README on the refined README template with the mcp-obsidian exemplar, including the version bump, changelog entry and validation."
trigger_phrases:
  - "phase 003 tasks"
  - "cli cursor readme tasks"
  - "cli-cursor rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/003-cli-cursor"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 003 task list inside 005-mode-child-readme-revisit/003-cli-cursor"
    next_safe_action: "Execute setup, implementation and verification tasks in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-cli-cursor"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 003 cli-cursor README rewrite

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T010. `[P0]` marks blocking requirements, `[P1]` marks required work with user-approved deferral.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read the refined README template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and record its section model and required-section rule [evidence: section model `1. AT A GLANCE` through `9. RELATED DOCUMENTS`; required-section rule `OVERVIEW`; scaffold sections `9`; HVR banned forms em dash, semicolon, Oxford comma]
- [x] T002 [P0] Read the mcp-obsidian exemplar README (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) and record its pitch and OVERVIEW pattern [evidence: pitch blockquote after H1; `Why This Skill Exists` problem-first; capability table `The Plugin Knowledge Layer` inside OVERVIEW]
- [x] T003 [P0] Read the current README (`.opencode/skills/cli-external-orchestration/cli-cursor/README.md`) and record the baseline: the version field, the `validate_document.py` output and the link state [evidence: version `1.0.0.0` (changelog head `v1.1.0.0`, `SKILL.md` `1.1.0.0`); validator exit `0` issues `0`; HVR baseline em dash `10`, semicolon `7`, oxford `24`; links `12/12` resolve]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Rewrite the README purpose-first with a one-line pitch blockquote and a problem-first OVERVIEW section (`.opencode/skills/cli-external-orchestration/cli-cursor/README.md`) [evidence: pitch blockquote at line `2`; `## 2. OVERVIEW` problem-first; capability section `The Dispatch Guard Rails` rows `5`]
- [x] T005 [P0] Write the remaining README sections per the refined template and preserve every factual detail from the old README (paths, flags, pointers, dispatch details) [evidence: H2 sections `9/9` numbered ALL-CAPS; quick start steps `4`; traps `2`; FAQ items `5`; troubleshooting rows `8`; related docs `10`; deep-loop path `fanout-run.cjs`; memory handback `memory-handback.md`]
- [x] T006 [P0] Bump the version field in the README frontmatter and add `changelog/<version>.md` with the rewrite entry [evidence: `version: 1.2.0.0`; entry `.opencode/skills/cli-external-orchestration/cli-cursor/changelog/v1.2.0.0.md` matches the field; validator exit `0` issues `0` on the entry]
- [x] T007 [P1] Run a section-by-section diff of the old and new README and record the fact-preservation check [evidence: flags `9/9` (`--output-format`, `--auto-review`, `--sandbox`, `--mode plan`, `--mode ask`, `--force`, `--yolo`, `--trust`, `--reasoning-effort`); models `10/10` allowlist ids (`composer-2.5`, `composer-2.5-fast`, `cursor-grok-4.5-{low,medium,high}[-fast]`, `glm-5.2-high`, `glm-5.2-max`); auth `cursor-agent login` + `CURSOR_API_KEY`/`CURSOR_AUTH_TOKEN`; guard `CURSOR_AGENT=1`/`CURSOR_CONVERSATION_ID`; install `cursor.com/install`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 [P0] Run `validate_document.py --type readme` on the README and record zero issues [evidence: exit `0`, issues `0`]
- [x] T009 [P0] Run the HVR grep (zero em dashes, zero semicolons, zero Oxford commas), the link guard and `git diff --check` [evidence: em dash `0`, semicolon `0`, oxford `0`; links `12/12`; `git diff --check` exit `0`]
- [x] T010 [P1] Run `validate.sh` on this phase folder, regenerate the phase metadata and fill checklist.md with evidence [evidence: `validate.sh --strict` exit `0` errors `0` warnings `0`; `generate-description.js` + `backfill-graph-metadata.js` refreshed `description.json` and `graph-metadata.json`]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The cli-cursor README opens with a one-line pitch and a problem-first OVERVIEW, follows the refined template, preserves every old fact, passes the validator and the HVR grep, carries a bumped version field with a matching changelog entry and no SKILL.md or sibling file is modified.
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
- Target: `.opencode/skills/cli-external-orchestration/cli-cursor/README.md`
<!-- /ANCHOR:cross-refs -->
