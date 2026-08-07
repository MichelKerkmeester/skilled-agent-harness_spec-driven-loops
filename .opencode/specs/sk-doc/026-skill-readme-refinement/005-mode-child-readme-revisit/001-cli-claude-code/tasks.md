---
title: "Tasks: Phase 1 cli-claude-code README rewrite"
description: "Task list for rewriting the cli-claude-code mode skill README against the refined template with a version bump, a changelog entry and validation."
trigger_phrases:
  - "phase 1 tasks"
  - "cli claude code readme tasks"
  - "mode readme revisit tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/001-cli-claude-code"
    last_updated_at: "2026-08-04T13:50:00Z"
    last_updated_by: "phase-executor-001"
    recent_action: "README rewrite executed, version 1.5.0.0, changelog added, gates green"
    next_safe_action: "Hand phase off to 002-cli-codex"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/001-cli-claude-code"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 1 cli-claude-code README rewrite

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T012. `[P0]` marks blocking tasks, `[P1]` marks required tasks.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read the current README at `.opencode/skills/cli-external-orchestration/cli-claude-code/README.md` and record the baseline: version field value, section inventory and link state [evidence: `version: 1.1.0.20` + `9` H2 sections + `8/8` relative links resolve]
- [x] T002 [P0] Run the README validator on the current README and record the baseline issue count [evidence: `validate_document.py` exit `0` with `0` issues]
- [x] T003 [P0] Confirm the template readiness gate: `.opencode/skills/sk-doc/sk-create-readme/assets/readme-template.md` exists and the mcp-obsidian exemplar at `.opencode/skills/mcp-tooling/mcp-obsidian/README.md` is reviewed [evidence: template body read (`readme-template.md` `1.8.0.30`) + exemplar pitch/OVERVIEW pattern reviewed]
- [x] T004 [P1] Record the skill changelog convention (naming `v<version>.md` and the current top version) [evidence: `ls` shows `v1.4.0.0.md` as top + predecessor pattern `v1.3.0.0.md` -> target `v1.5.0.0.md`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 [P0] Rewrite the README purpose-first per the refined template with a one-line pitch and a problem-first OVERVIEW [evidence: pitch blockquote line `21` + `## 2. OVERVIEW` `Why This Skill Exists` section + `9` numbered ALL-CAPS H2 sections]
- [x] T006 [P0] Bump the version field in the README frontmatter to the new version [evidence: `rg -n '^version:'` -> `1.5.0.0`]
- [x] T007 [P0] Add the changelog entry at `.opencode/skills/cli-external-orchestration/cli-claude-code/changelog/v<version>.md` describing the rewrite [evidence: `changelog/v1.5.0.0.md` exists + `validate_document.py --type changelog` exit `0`]
- [x] T008 [P1] Diff the rewrite section by section against the old README and confirm no factual content was lost [evidence: `9/9` sections mapped + dispatch lifecycle, self-invocation guard (`3` layers), `13/13` agent roster, auth pre-flight and memory handback preserved + sibling table corrected `6/6` cli-X siblings]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 [P0] Run `validate_document.py --type readme` on the rewritten README and confirm zero issues [evidence: validator exit `0` with `0` issues]
- [x] T010 [P0] Run the HVR grep over the README body and confirm zero em dashes, zero semicolons and zero Oxford commas [evidence: em dash `0`, semicolon `0`, Oxford comma `0`, banned words `0` matches (all greps exit `1`)]
- [x] T011 [P1] Run the link guard over the README relative links and confirm every link resolves [evidence: `9/9` relative links resolve incl. `references/providers-and-models.md` and `../../system-spec-kit/references/cli/memory-handback.md`]
- [x] T012 [P1] Run `git diff --check` and the scope diff, run `validate.sh` on this phase folder, write the implementation summary and regenerate the phase metadata [evidence: `git diff --check` exit `0` + scope diff `2` skill files + `validate.sh --strict` exit `0` + `implementation-summary.md` written + metadata regenerated]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The README is purpose-first with a one-line pitch and a problem-first OVERVIEW, passes `validate_document.py --type readme` with zero issues and the HVR grep, carries a bumped version field with a matching changelog entry, and preserves every factual surface of the old README. No SKILL.md content and no file outside the README, the changelog entry and this phase folder is modified.
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
- Target README: `.opencode/skills/cli-external-orchestration/cli-claude-code/README.md`
<!-- /ANCHOR:cross-refs -->
