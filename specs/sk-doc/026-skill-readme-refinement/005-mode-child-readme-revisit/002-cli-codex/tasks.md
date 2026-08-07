---
title: "Tasks: Phase 002 cli-codex README revisit"
description: "Task list for rewriting the cli-codex skill README purpose-first on the refined template with a version bump and changelog entry."
trigger_phrases:
  - "phase 002 tasks"
  - "cli codex readme tasks"
  - "codex readme rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/002-cli-codex"
    last_updated_at: "2026-08-04T13:50:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 002 task list inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute setup, implementation and verification tasks in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-cli-codex"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 002 cli-codex README revisit

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T010. `[P0]` marks a blocking task. `[P1]` marks a required task that may be deferred only with approval.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read the refined README template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and the mcp-obsidian exemplar README (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) and record their section models [evidence: read `skill-readme-template.md` `9`-section model + capability pattern; read `mcp-obsidian/README.md` narrative order] [evidence: template `SECTION MODEL` + `capability-section-pattern` + exemplar `pitch-first` order recorded] [evidence: `9`/`9` sections mirrored]
- [x] T002 [P0] Read the current cli-codex README (`.opencode/skills/cli-external-orchestration/cli-codex/README.md`) and record the baseline: version field value, `validate_document.py --type readme` output and link state [evidence: baseline `version: 1.5.0.0`, validator `0` issues exit `0`, links `8/8`] [evidence: HVR baseline `0` em dashes, `7` semicolons, `0` Oxford commas]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P0] Rewrite the README purpose-first per the refined template with a one-line pitch and a problem-first OVERVIEW, or verify-only if the README already conforms [evidence: pitch blockquote after H1, `OVERVIEW` first, H2 `1..9` ascending, `---` dividers, `The Dispatch Capabilities` table `6` rows] [evidence: validator `0` issues on final body]
- [x] T004 [P0] Bump the version field in the README frontmatter to the next release value [evidence: `version: 1.9.0.0` matches changelog head `v1.8.0.0` + 1]
- [x] T005 [P0] Add the changelog entry at `changelog/v<version>.md` per the `vX.Y.Z.W.md` convention [evidence: `changelog/v1.9.0.0.md` created, `vX.Y.Z.W` naming matches `24/24` folder entries]
- [x] T006 [P1] Compare the old and new README section by section and confirm no capability, trap, boundary or integration fact dropped [evidence: diff shows `14` removed lines, `0` facts dropped, `1` version bump, `1` added doc link `references/providers-and-models.md`] [evidence: `9`/`9` sections carry equivalent facts]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 [P0] Run `validate_document.py --type readme` on the rewritten README and confirm zero issues [evidence: `validate_document.py` exit `0`, issues `0`]
- [x] T008 [P0] Run the HVR grep over the README body and confirm zero em dashes, zero semicolons and zero Oxford commas [evidence: `0` em dashes, `0` semicolons, `0` Oxford commas, `0` banned words]
- [x] T009 [P1] Run the link guard over the README and confirm all relative links resolve, then run `git diff --check` and confirm no whitespace errors [evidence: links `9/9` resolve, `git diff --check` exit `0`]
- [x] T010 [P1] Run `validate.sh` on this phase folder, confirm zero errors, confirm the scope diff shows only the README, the changelog entry and this phase folder, and record evidence in checklist.md [evidence: `validate.sh` errors `0` exit `0`, scope `3` paths, staged `0`]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The cli-codex README opens with a one-line pitch and a problem-first OVERVIEW per the refined template, passes the README validator with zero issues and the HVR grep with zero em dashes, semicolons and Oxford commas, carries a bumped version field and a matching changelog entry, and preserves every fact of the prior document. No SKILL.md, template, other skill README or vault file is modified.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` (REQ-001..REQ-009)
- Plan: `plan.md`
- Checklist: `checklist.md`
- Parent spec: `../spec.md`
- Refined template: `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`
- Exemplar README: `.opencode/skills/mcp-tooling/mcp-obsidian/README.md`
<!-- /ANCHOR:cross-refs -->
