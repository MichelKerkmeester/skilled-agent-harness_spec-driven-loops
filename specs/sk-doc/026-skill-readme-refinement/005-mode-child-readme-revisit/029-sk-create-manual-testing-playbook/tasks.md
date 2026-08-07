---
title: "Tasks: Phase 029 sk-create-manual-testing-playbook README revisit"
description: "Task list for rewriting the create-manual-testing-playbook skill README on the refined template standard."
trigger_phrases:
  - "phase 029 tasks"
  - "sk-create-manual-testing-playbook readme tasks"
  - "playbook readme rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/029-sk-create-manual-testing-playbook"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 029 task list inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute setup, implementation and verification tasks in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/029-sk-create-manual-testing-playbook"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 029 sk-create-manual-testing-playbook README revisit

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T012, tagged `[P0]` (blocking) or `[P1]` (required).
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

[x] T001 [P0] Confirm the readiness gate: `skill-readme-template.md` exists at `.opencode/skills/sk-doc/sk-create-skill/assets/skill/` and phase 001 is closed, then record the template section model, the required-section rule and the writing rules [evidence: gate `skill-readme-template.md` v1.9.0.0 read, 9-section model + OVERVIEW required rule recorded; sibling phases 001-028 closed]
[x] T002 [P0] Read the current README (`.opencode/skills/sk-doc/sk-create-manual-testing-playbook/README.md`) and record the baseline: version field, validator output and link state [evidence: `version: 1.0.0.0`, validator exit `0` with `0` issues, HVR baseline `8` Oxford hits, link guard `0` README hits]
[x] T003 [P1] Read the mcp-obsidian exemplar README (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) and record its pitch, AT A GLANCE and OVERVIEW patterns [evidence: exemplar `mcp-obsidian/README.md` v1.6.0.0 read, pitch + `AT A GLANCE` first + capability layer patterns recorded]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

[x] T004 [P0] Rewrite the README purpose-first per the refined template: one-line pitch blockquote, AT A GLANCE table first, problem-first OVERVIEW, then only the sections the skill earns [evidence: `README.md` rewritten with pitch blockquote, `## 1. AT A GLANCE` first, problem-first `## 2. OVERVIEW`, earned sections `9/9` numbered ALL-CAPS H2]
[x] T005 [P0] Preserve every fact that still holds (paths, commands, validator invocations, related documents) and keep the section-by-section diff against the pre-rewrite README [evidence: `26/26` fact tokens present in new README (`SKILL.md`, `validate_document.py`, `--type reference`, `{PREFIX}-{NNN}`, `UNAUTOMATABLE`, `changelog` paths, `7/7` related-doc links)]
[x] T006 [P0] Bump the README version field above 1.0.0.0 and add the matching per-release entry in `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/changelog/` with a filename following the vX.Y.Z.W convention [evidence: `version: 1.0.1.2` in README frontmatter, `changelog/v1.0.1.2.md` created, folder entries `3` -> `4`]
[x] T007 [P1] Confirm the README names the canonical entry point (`/create:manual-testing-playbook`) and that every link resolves to a real file under `references/`, `assets/` or `scripts/` [evidence: `/create:manual-testing-playbook` present `4` times, `7/7` RELATED DOCUMENTS links resolve, link guard `0` README hits]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

[x] T008 [P0] Run `validate_document.py --type readme` on the rewritten README and record the issue count, which must be zero [evidence: `validate_document.py` exit `0`, `Total issues: 0`, `VALID`]
[x] T009 [P0] Run the HVR grep (`rg -n` for em dashes, semicolons and Oxford commas) on the README body and confirm zero hits [evidence: em dash `0`, semicolon `0`, Oxford `0`, banned words `0`]
[x] T010 [P0] Run `check-markdown-links.cjs` on the skill folder and confirm zero broken links [evidence: link guard `0` hits for `sk-create-manual-testing-playbook/README.md` in `11272` links checked; `2` pre-existing broken links in out-of-scope `assets/manual-testing-playbook-template.md` verified untouched via `git diff`]
[x] T011 [P1] Run `git diff --check` and confirm the diff is clean, then confirm no out-of-scope file changed via `git status` [evidence: `git diff --check` exit `0`, packet diff `1` file (`README.md`), `changelog/v1.0.1.2.md` untracked-new]
[x] T012 [P1] Run `validate.sh --strict` on this phase folder, confirm zero errors, regenerate the phase metadata and record all verification evidence in `checklist.md` [evidence: `validate.sh --strict` `Errors: 0` `Warnings: 0` `RESULT: PASSED`, `generate-context.js` exit `0` refreshed `graph-metadata.json`]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The README is purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW, every fact from the old README that still holds is preserved, the HVR grep is clean, the version field is bumped with a matching changelog entry, the validator and the link guard report zero issues and this phase folder validates with zero errors. No SKILL.md, template, reference, script or vault file is modified.
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
- Validator: `.opencode/skills/sk-doc/scripts/validate_document.py`
- Link guard: `.opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs`
<!-- /ANCHOR:cross-refs -->
