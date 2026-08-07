---
title: "Tasks: Phase 9 system-deep-loop README rewrite"
description: "Task list for rewriting the system-deep-loop skill README against the refined template from phase 001 and the mcp-obsidian exemplar."
trigger_phrases:
  - "phase 9 tasks"
  - "system deep loop readme tasks"
  - "deep loop readme rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/009-system-deep-loop"
    last_updated_at: "2026-08-04T13:37:24Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 9 task list inside 004-standalone-readme-revisit"
    next_safe_action: "Execute setup, rewrite and verification tasks in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/009-system-deep-loop"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 9 system-deep-loop README rewrite

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T014. `[P]` marks parallelizable tasks, `[P0]` and `[P1]` mark the priority tier.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Confirm the refined template from phase 001 is committed at `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` and record its section model (REQ-001) [evidence: `skill-readme-template.md` present with `version: 1.9.0.0`, 9-section numbered ALL-CAPS model, HVR scripted checks, capability pattern, validation checklist 9/9 read]
- [x] T002 [P0] Read `.opencode/skills/system-deep-loop/README.md` and record the baseline: the version field, the `validate_document.py --type readme` output and the link state (REQ-002) [evidence: baseline `version: 2.0.0.0`; validator exit 0 with `Total issues: 0`; baseline links 4/4 resolved (`SKILL.md`, `mode-registry.json`, `deep-ai-council/SKILL.md`, `deep-alignment/SKILL.md`)]
- [x] T003 [P1] [P] Read the mcp-obsidian exemplar at `.opencode/skills/mcp-tooling/mcp-obsidian/README.md` and record its shape for the pitch, the overview and the close (REQ-003) [evidence: exemplar shape recorded: one-line pitch blockquote after H1, `AT A GLANCE` first with 4 rows, problem-first `OVERVIEW`, capability table (Plugin Knowledge Layer), `VERIFICATION` close, `RELATED DOCUMENTS` last]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Rewrite `.opencode/skills/system-deep-loop/README.md` purpose-first: one-line pitch blockquote, problem-first OVERVIEW, then quick start, how it works and navigation per the refined template (REQ-003) [evidence: README rewritten with pitch blockquote after H1; `rg -n '^## [0-9]+\. '` shows H2 sequence 1..8 (AT A GLANCE, OVERVIEW, QUICK START, HOW IT WORKS, INTEGRATION & NAVIGATION, FAQ, VERIFICATION, RELATED DOCUMENTS); `---` dividers between sections]
- [x] T005 [P0] Keep the HVR clean: zero em dashes, zero semicolons and zero Oxford commas in the README body (REQ-004) [evidence: HVR greps 0/0/0 (`rg '\x{2014}'` 0, `rg '\x{3B}'` 0, `rg ',\s+(and|or)\b'` 0) and banned-word grep 0]
- [x] T006 [P0] Bump the README version field from 2.0.0.0 to 2.1.0.0 (REQ-005) [evidence: `version: 2.1.0.0` in README frontmatter; changelog entry frontmatter `version: 2.1.0.0`]
- [x] T007 [P0] Add `.opencode/skills/system-deep-loop/changelog/v2.1.0.0.md` with the hub changelog frontmatter shape and a description of the rewrite (REQ-005) [evidence: `changelog/v2.1.0.0.md` exists with frontmatter (`title`, `description`, `version: 2.1.0.0`) and `NEW`/`CHANGED`/`NOT CHANGED` sections covering the rewrite]
- [x] T008 [P1] Preserve every durable fact: run a section-by-section diff of the old and the new README and confirm invoke routes, mode names, artifact locations and the version all survived (REQ-007) [evidence: fact battery 25/25 present in new README (invoke routes `Skill(system-deep-loop)`, `/deep:*`, `@context`; modes `deep-research|deep-review|deep-ai-council|deep-improvement|deep-alignment`; artifacts `research.md`/`review-report.md`; `workflowMode`/`runtimeLoopType`/`backendKind`; `mode-registry.json`/`hub-router.json`/`graph-metadata.json`; `runtime/` roles; add-a-mode surfaces; `version: 2.1.0.0`)]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 [P0] Run `validate_document.py --type readme` on the README and confirm zero issues (REQ-006) [evidence: validator exit 0, `Total issues: 0`, `✅ VALID`]
- [x] T010 [P0] Run the HVR grep on the README body and confirm zero em dashes, zero semicolons and zero Oxford commas (REQ-004) [evidence: HVR greps 0/0/0; one initial `,\s+or` hit fixed by sentence restructure, re-run clean]
- [x] T011 [P1] [P] Run the link guard and confirm every link in the README resolves [evidence: link guard 6/6 resolve (`./SKILL.md`, `./mode-registry.json`, `./hub-router.json`, `./deep-ai-council/SKILL.md`, `./deep-alignment/SKILL.md`, `./manual-testing-playbook/manual-testing-playbook.md`)]
- [x] T012 [P1] Run the scope diff and confirm only the README, the changelog entry and this phase folder changed (REQ-008) [evidence: `git status --porcelain` shows exactly 3 paths: `M README.md`, `?? changelog/v2.1.0.0.md`, `?? phase folder 009-system-deep-loop/`]
- [x] T013 [P1] Run `git diff --check` and confirm zero whitespace errors [evidence: `git diff --check -- .opencode/skills/system-deep-loop/README.md` exit 0]
- [x] T014 [P1] Run `validate.sh` on this phase folder and confirm zero errors, then regenerate the phase metadata (REQ-009) [evidence: `validate.sh --strict` exit 0 `RESULT: PASSED` with `Errors: 0  Warnings: 0`; metadata regenerated with `generate-description.js` and `backfill-graph-metadata.js`]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The README reads purpose-first with a one-line pitch and a problem-first OVERVIEW, passes `validate_document.py --type readme` with zero issues, carries version 2.1.0.0, has a changelog entry and preserves every durable fact. The phase folder validates with zero errors. No SKILL.md, no other skill README, no hub registry, no template and no vault file is modified.
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
- Target README: `.opencode/skills/system-deep-loop/README.md`
<!-- /ANCHOR:cross-refs -->
