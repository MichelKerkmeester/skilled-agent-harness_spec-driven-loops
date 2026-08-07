---
title: "Tasks: Phase 025 sk-create-command README revisit"
description: "Task list for rewriting the sk-create-command skill README against the refined template."
trigger_phrases:
  - "phase 25 tasks"
  - "sk create command readme tasks"
  - "command readme rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/025-sk-create-command"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 025 task list inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute setup, rewrite and verification tasks in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/025-sk-create-command"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 025 sk-create-command README revisit

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T012. `[P]` marks parallelizable tasks.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read the refined README template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and record its section model and required-section rule (REQ-001) [evidence: `skill-readme-template.md` read, section model `9` rows, `OVERVIEW` the only required section]
- [x] T002 [P0] Read the current README (`.opencode/skills/sk-doc/sk-create-command/README.md`) and record the baseline: the version field value, the `validate_document.py --type readme` output and the link state (REQ-002) [evidence: baseline `version: 1.0.0.0`, validator `Total issues: 0`, links `7/7`]
- [x] T003 [P1] [P] Read the mcp-obsidian exemplar README (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) and record its purpose-first patterns (REQ-003) [evidence: `mcp-obsidian/README.md` read, pitch blockquote + problem-first `OVERVIEW` + capability table pattern]
- [x] T004 [P1] [P] Confirm the parent sub-phase order from `../spec.md` and record the predecessor and successor pointers (REQ-008) [evidence: parent `spec.md` maps `025-sk-create-command`; predecessor `024`, successor `026`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 [P0] Rewrite the README purpose-first per the refined template with a one-line pitch and a problem-first OVERVIEW, following the numbered ALL-CAPS H2 section model with `---` dividers (REQ-003) [evidence: `README.md` rewritten, `9` numbered H2 sections `1..9`, pitch blockquote line `12`]
- [x] T006 [P0] Bump the version field in the README frontmatter to the evidence-based target (REQ-005) [evidence: `version: 1.0.2.0` set, changelog head `v1.0.1.1` + SKILL.md `1.0.1.1`]
- [x] T007 [P0] Add the entry at `changelog/<version>.md` matching the bumped version field (REQ-005) [evidence: `changelog/v1.0.2.0.md` created, folder entries `3` -> `4`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 [P0] Run `python3 .opencode/skills/sk-doc/scripts/validate_document.py <readme> --type readme` on the README and record zero issues (REQ-006) [evidence: `validate_document.py` exit `0`, `Total issues: 0`]
- [x] T009 [P0] Run the HVR grep and confirm zero em dashes, zero semicolons and zero Oxford commas in the README body (REQ-004) [evidence: em dash `0`, semicolon `0`, Oxford `0`, banned words `0`]
- [x] T010 [P1] Run the link guard and confirm every linked path in the README resolves (REQ-006) [evidence: links `7/7` resolve]
- [x] T011 [P1] Run the scope diff (`git diff --stat`, `git diff --check`, `git status`) and confirm no out-of-scope file changed (REQ-008) [evidence: `git diff --check` clean, changed files = README + `v1.0.2.0.md` + phase docs]
- [x] T012 [P1] Run `validate.sh` on this phase folder with `--strict`, confirm zero errors and regenerate the phase metadata (REQ-009) [evidence: `validate.sh --strict` errors `0`, metadata refreshed via `backfill-graph-metadata.js` + `generate-description.js`]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The README is rewritten purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW. The version field is bumped and the changelog entry is present. The validator reports zero issues. The HVR grep and the link guard are clean. The scope diff shows only the README, its changelog entry and this phase's docs. This phase folder validates with zero errors.
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
- Exemplar README: `.opencode/skills/mcp-tooling/mcp-obsidian/README.md`
- Target README: `.opencode/skills/sk-doc/sk-create-command/README.md`
- HVR rules: `.opencode/skills/sk-doc/shared/references/hvr-rules.md`
<!-- /ANCHOR:cross-refs -->
