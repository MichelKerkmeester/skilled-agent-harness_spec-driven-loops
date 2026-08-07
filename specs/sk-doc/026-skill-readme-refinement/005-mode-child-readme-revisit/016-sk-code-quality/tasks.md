---
title: "Tasks: Phase 016 sk-code-quality README revisit (rewrite)"
description: "Task list for rewriting the sk-code-quality mode skill README purpose-first against the refined template with a version bump and a changelog entry."
trigger_phrases:
  - "phase 16 tasks"
  - "sk code quality readme tasks"
  - "quality mode rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/016-sk-code-quality"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 016 task list inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute setup, implementation and verification tasks in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/016-sk-code-quality"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 016 sk-code-quality README revisit (rewrite)

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T011. `[P]` marks parallelizable tasks.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read the refined README template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and record its section model and required-section rule (REQ-001) [evidence: `skill-readme-template.md` read; section model `9` numbered ALL-CAPS H2 slots with `---` dividers, `OVERVIEW` required, pitch blockquote after H1, AT A GLANCE first `4` rows, earned-section dropping, HVR + validator checklist `9/9` recorded]
- [x] T002 [P0] Read the current README (`.opencode/skills/sk-code/sk-code-quality/README.md`) and record the baseline: the version field value, the `validate_document.py --type readme` output and the link state (REQ-002) [evidence: baseline `version: 1.0.0.1`; validator exit `0` with `Total issues: 0`; links `8/8` resolve; HVR baseline `0/1/11` (em dash/semicolon/Oxford)]
- [x] T003 [P1] [P] Read the mcp-obsidian exemplar README (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) and confirm the parent sub-phase order from `../spec.md` (REQ-008) [evidence: exemplar read, purpose-first shape confirmed; `../spec.md` sub-phase table row `016-sk-code-quality` points at `.opencode/skills/sk-code/sk-code-quality/README.md`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Rewrite the README purpose-first per the refined template with a one-line pitch and a problem-first OVERVIEW, using the mcp-obsidian exemplar as the narrative shape (REQ-003) [evidence: rewritten; pitch blockquote line `9`; `rg -n '^## '` shows `7/7` numbered ALL-CAPS H2; OVERVIEW opens problem-first; Checklist Router capability table `5` rows; facts preserved `23/23`]
- [x] T005 [P0] Bump the version field in the README frontmatter (REQ-005) [evidence: `rg -n 'version:'` shows `version: 1.0.0.2`; baseline was `1.0.0.1`]
- [x] T006 [P0] Add the entry at `changelog/<version>.md` matching the bumped version (REQ-005) [evidence: `changelog/v1.0.0.2.md` added; `ls changelog/` shows `v1.0.0.0.md` + `v1.0.0.2.md`; entry HVR clean `0/0/0`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 [P0] Run `python3 .opencode/skills/sk-doc/scripts/validate_document.py <readme> --type readme` on the README and record zero issues (REQ-006) [evidence: exit `0`, `Total issues: 0`, `VALID`]
- [x] T008 [P0] Run the HVR grep and confirm zero em dashes, zero semicolons and zero Oxford commas in the README body (REQ-004) [evidence: HVR greps `0/0/0`; banned-word grep `0` hits]
- [x] T009 [P1] Run the link guard and confirm every linked path in the README resolves (REQ-006) [evidence: link guard `10/10` resolve]
- [x] T010 [P1] Run the scope diff (`git diff --stat`, `git diff --check`, `git status`) and confirm no out-of-scope file changed (REQ-008) [evidence: `git diff --check` exit `0`; `git status` scoped shows only `README.md` (M), `changelog/v1.0.0.2.md` (new) and this phase folder (new); pre-existing sibling-phase worktree edits untouched]
- [x] T011 [P1] Run `validate.sh` on this phase folder with `--strict`, confirm zero errors and regenerate the phase metadata (REQ-009) [evidence: `validate.sh --strict` exit `0` `PASSED` with `0/0` errors/warnings; metadata refreshed via `backfill-graph-metadata.js` + `generate-description.js --level 2`]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The README is rewritten purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW. The version field is bumped and the changelog entry exists. The validator reports zero issues, the HVR grep is clean, the link guard is clean and the scope diff shows no out-of-scope file. This phase folder validates with zero errors.
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
- Target README: `.opencode/skills/sk-code/sk-code-quality/README.md`
- HVR rules: `.opencode/skills/sk-doc/shared/references/hvr-rules.md`
<!-- /ANCHOR:cross-refs -->
