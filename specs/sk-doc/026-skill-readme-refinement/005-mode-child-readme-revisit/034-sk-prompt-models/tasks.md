---
title: "Tasks: Phase 034 sk-prompt-models README revisit"
description: "Task list for rewriting the sk-prompt-models skill README on the refined template with a version bump, a changelog entry and validation."
trigger_phrases:
  - "phase 034 tasks"
  - "sk prompt models tasks"
  - "prompt models readme tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/034-sk-prompt-models"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 034 task list inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute setup, rewrite and verification tasks in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/034-sk-prompt-models"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 034 sk-prompt-models README revisit

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T012. `[P0]` marks blockers, `[P1]` marks required work. `[P]` marks parallelizable tasks.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read the current README (`.opencode/skills/sk-prompt/sk-prompt-models/README.md`) and record the baseline: version field value, validator output and link state [evidence: version `0.8.0.14`, validator `0/0` issues, links `7/7` resolve, HVR baseline `3/4` violations (semicolons `3`, oxford `4`)]
- [x] T002 [P0] Read the refined template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and the mcp-obsidian exemplar README and record the section model [evidence: template `skill-readme-template.md`, exemplar `mcp-obsidian/README.md`, section model `9/9` numbered ALL-CAPS H2 with `---` dividers, pitch blockquote, AT A GLANCE first]
- [x] T003 [P1] Inventory the changelog folder (`.opencode/skills/sk-prompt/sk-prompt-models/changelog/`) and record the latest entry name and the version bump target [evidence: entries `v0.1.0.0`..`v0.9.0.0` (`12` files), head `v0.9.0.0.md`, bump target `0.9.0.1` matching `SKILL.md` version `0.9.0.1`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Rewrite the README purpose-first with a one-line pitch and a problem-first OVERVIEW per the refined template [evidence: pitch blockquote line `12`, OVERVIEW `Why This Skill Exists` problem-first, capability layer `Per-Model Prompt-Craft Layer` `4/4` rows, facts preserved `6/6` models, `5/5` framework rows, `4/4` nav steps, `4/4` quick-start steps]
- [x] T005 [P0] Bump the version field in the README frontmatter [evidence: frontmatter `version: 0.9.0.1` from `0.8.0.14`]
- [x] T006 [P0] Add the changelog entry at `changelog/<version>.md` [evidence: entry `changelog/v0.9.0.1.md`, shape `NEW`/`CHANGED`/`NOT CHANGED`, HVR `0/0/0`]
- [x] T007 [P1] Diff the rewrite section by section against the old README and confirm the model inventory, the navigation chain and the quick-start content survive [evidence: inventory `6/6` models + `2` optional-unverified, framework map `5/5` rows, nav chain `4/4` steps, quick start `4/4` steps, registry + four-owner facts `1/1` preserved]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 [P0] Run `validate_document.py --type readme` on the README and confirm zero issues [evidence: `validate_document.py` exit `0`, issues `0/0`]
- [x] T009 [P0] Run the HVR grep for em dashes, semicolons and Oxford commas and confirm zero hits [evidence: em dash `0`, semicolon `0`, oxford `0`, banned words `0`, exit `1/1/1/1` no-match]
- [x] T010 [P0] Run the link guard over the README body and confirm every link resolves [evidence: links `7/7` resolve (`SKILL.md`, `_index.md`, `models/`, `pattern-index.md`, `model-profiles.json`, `cli-prompt-quality-card.md`, `benchmarks/`)]
- [x] T011 [P1] Run `git diff --check` and a scope diff and confirm no out-of-scope file changed [evidence: `git diff --check` clean `0` errors, scope diff `2/2` files (`README.md`, `changelog/v0.9.0.1.md`)]
- [x] T012 [P1] Run `validate.sh` on this phase folder and confirm zero errors, then record the evidence in checklist.md [evidence: `validate.sh --strict` errors `0`, warnings `1` (`CONTINUITY_FRESHNESS` skipped, `implementation-summary.md` closeout-owned), metadata shape checks `3/3` passed]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The README reads purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW, passes the validator with zero issues, passes the HVR grep and the link guard, carries a bumped version field and has a changelog entry at `changelog/<version>.md`. The scope diff shows no out-of-scope change. No SKILL.md, reference, asset, benchmark, template or vault file is modified.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` (REQ-001..REQ-009)
- Plan: `plan.md`
- Checklist: `checklist.md`
- Parent phase spec: `../spec.md`
- Refined template: `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`
- Exemplar: `.opencode/skills/mcp-tooling/mcp-obsidian/README.md`
- HVR rules: `.opencode/skills/sk-doc/shared/references/hvr-rules.md`
- Skill folder: `.opencode/skills/sk-prompt/sk-prompt-models/`
<!-- /ANCHOR:cross-refs -->
