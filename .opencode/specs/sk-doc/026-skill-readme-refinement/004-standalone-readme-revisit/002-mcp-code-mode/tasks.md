---
title: "Tasks: Phase 002 mcp-code-mode README rewrite"
description: "Task list for the mcp-code-mode README rewrite: baseline, purpose-first rewrite per the refined template, version bump, changelog entry and verification."
trigger_phrases:
  - "phase 002 tasks"
  - "mcp code mode readme tasks"
  - "code mode readme rewrite tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/002-mcp-code-mode"
    last_updated_at: "2026-08-04T12:51:55Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 002 task list inside 004-standalone-readme-revisit"
    next_safe_action: "Execute setup, rewrite and verification tasks in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-mcp-code-mode"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 002 mcp-code-mode README rewrite

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` = pending, `[x]` = done. Completed items carry concrete evidence.
- Task IDs: T001-T010. `[P0]` and `[P1]` mark priority tiers. `[P]` marks parallelizable tasks.
- If the baseline README already conforms to the refined template, phase 2 tasks reduce to verification and evidence recording.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read the current README at `.opencode/skills/mcp-code-mode/README.md` and record the baseline: version field value, `validate_document.py` output and link state [evidence: baseline version `1.0.0.30`, validator exit `0` with 0 issues, links `8/8` resolve on disk]
- [x] T002 [P0] Read the refined template at `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` and the mcp-obsidian exemplar at `.opencode/skills/mcp-tooling/mcp-obsidian/README.md`, record the section model and the pitch pattern [evidence: section model `9` numbered H2s, pitch blockquote `>` after H1, AT A GLANCE first]
- [x] T003 [P1] [P] Inventory `.opencode/skills/mcp-code-mode/changelog/` for the version history and the entry convention [evidence: `8` entries `v1.0.0.0`..`v1.0.8.0`, compact format `## [**version**]` + Files Changed table]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Draft the one-line pitch and the AT A GLANCE rows for the rewrite [evidence: pitch line `> Reach every external MCP tool`, `4` AT A GLANCE rows `Use it for`/`Invoke with`/`Works on`/`Produces`]
- [x] T005 [P0] Draft the problem-first OVERVIEW with WHY THIS SKILL EXISTS and WHAT IT DOES [evidence: section `## 2. OVERVIEW` opens with reader situation `Native MCP loads every tool schema`, H3s `Why This Skill Exists` + `What It Does` + `The Tool Surface`]
- [x] T006 [P0] Rewrite the remaining sections per the refined template with HVR voice, preserving every load-bearing fact from the baseline [evidence: `9/9` sections on template model, facts kept `98%` smaller context, `1,600` tokens, `141,000` tokens, `{manual_name}.{manual_name}_{tool_name}` rule, `.env` prefix rule]
- [x] T007 [P0] Bump the version field in the README frontmatter and add `.opencode/skills/mcp-code-mode/changelog/<version>.md` [evidence: version `1.0.0.30` → `1.0.0.31`, entry added at `changelog/v1.0.0.31.md`]
- [x] T008 [P0] Assemble the final README at `.opencode/skills/mcp-code-mode/README.md` and confirm the pitch and the OVERVIEW order [evidence: pitch at line `12`, `## 1. AT A GLANCE` before `## 2. OVERVIEW`, HVR `0/0/0` em dashes/semicolons/Oxford commas]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 [P0] [P] Run `validate_document.py --type readme` on the rewrite, the HVR grep, the link guard, `git diff --check` and the scope diff [evidence: validator exit `0`, HVR `0/0/0`, links `8/8`, `git diff --check` clean, scope `3` files `README.md`+`changelog/v1.0.0.31.md`+phase docs]
- [x] T010 [P1] Record verification evidence in checklist.md, run `validate.sh` on this phase folder and regenerate phase metadata [evidence: checklist `16/16` marked, `validate.sh` exit `0`, `generate-description.js` + `backfill-graph-metadata.js` re-ran]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The README at `.opencode/skills/mcp-code-mode/README.md` is purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW. It preserves every load-bearing fact, passes `validate_document.py --type readme` with zero issues and clears the HVR grep and the link guard. It carries a bumped version field and a changelog entry. The scope diff touches only the README, the changelog entry and this phase folder.
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
- Target README: `.opencode/skills/mcp-code-mode/README.md`
<!-- /ANCHOR:cross-refs -->
