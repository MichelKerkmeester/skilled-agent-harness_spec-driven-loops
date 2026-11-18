---
title: "Feature Specification: README template conformance"
description: "Rewrites or writes the 184 READMEs and SYNC docs that the sk-create-readme templates cover, so each follows its template and the human voice rules, with every fact checked against the code."
trigger_phrases:
  - "readme template conformance"
  - "readme template conformance phase parent spec"
  - "rewrite every readme to its template"
  - "skill readme hook readme runtime readme rewrite"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/document-standards/006-readme-template-conformance"
    last_updated_at: "2026-11-16T15:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Phase parent and seven children created, phase 001 planned"
    next_safe_action: "Implement 001-skill-readmes with /speckit:implement"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-readme/assets/skill-readme-template.md"
      - ".skilled/skills/sk-doc/sk-create-readme/assets/hook-readme-template.md"
      - ".skilled/skills/sk-doc/sk-create-readme/assets/runtime-plugin-readme-template.md"
      - ".skilled/skills/sk-doc/sk-create-readme/assets/runtime-folder-template.md"
      - ".skilled/skills/sk-doc/sk-create-readme/assets/readme-code-template.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "337e2d66-377c-4a62-99f7-86910ae24591"
      parent_session_id: "471a5d1f-da2b-4389-a4e0-fca7b0f046c0"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The program is a new phase parent under sk-doc/document-standards, one child per template family"
      - "Hook code folders join as phase 007 and .vibe/README.md is created in phase 006"
      - "Phase 001 writes a new sk-design README, and phase 007 also rewrites the hooks library README"
      - "Each phase commits, merges origin/main and pushes under sk-git without asking"
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.3 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: README template conformance

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-16 |
| **Branch** | `main` |
| **Parent Spec** | None, this is a phase parent in the `sk-doc/document-standards` sub-track |
| **Parent Packet** | sk-doc/document-standards/006-readme-template-conformance |
| **Predecessor** | `system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite`, which rewrote the root README and the templates this program applies |
| **Successor** | None |
| **Handoff Criteria** | All seven children pass `validate.sh --strict`, every README they own validates and scans clean, and each phase is pushed to origin/main |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The root README and its five root guides now read in a plain human voice, and the `sk-create-readme` templates were rewritten to match. The READMEs below the root were written earlier, against older templates and by many hands. Their structure differs from the template that now owns them, and some fail the voice rules outright: a baseline of the 13 skill READMEs found 20 hard voice blockers across 6 files. One skill, `sk-design`, has no README at all. Their facts were also never re-checked after the code moved, so a reader can follow a path, a count or a runtime list that is no longer true.

### Purpose
Every README and SYNC doc that a current `sk-create-readme` template covers follows that template, passes the validator and the voice scan with zero hard blockers, and states only facts checked against the code.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite each README in the seven families below to its template's section model, in short sentences and real paragraphs, keeping exact commands, paths, flags and file names where the reader acts on them.
- Check every fact a README states against the code it describes, and correct or drop what does not hold.
- Remove emoji from headings and repair in-page and inbound links whose anchors change, so `#1--overview` style anchors become `#1-overview`.
- Write the two missing READMEs, `.skilled/skills/sk-design/README.md` and `.vibe/README.md`, from their templates.
- Keep `---` before each numbered H2, because every file here sits below the repository root and the validator's divider exemption covers only the root guides.
- Rebuild the generated files a README change moves: the README verdict baseline the CI parity test reads, and the trigger index when a README's `trigger_phrases` change.

### Out of Scope
- The repository root README and the five root guides. The predecessor packet owns them.
- `.skilled/skills/local-webflow/`. It is a symlink into a different project outside this repository, and git does not track it.
- Code-folder READMEs outside `.skilled/hooks/`, such as skill `scripts/`, `runtime/` and `shared/` folders. The operator scoped the program to the seven families named here.
- Hand edits to README versions and skill changelog entries. The pre-commit doc-version gate raises a changed skill README's frontmatter version itself. A rewrite changes no skill behavior, so it is not a skill release and gets no changelog entry.
- Changes to the templates, the validator or the voice scanner.

### Files to Change
Per-phase file lists and their baselines live in each child's `plan.md`.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/skills/*/README.md` (13) | Modify | 001 | Skill READMEs, from the skill README template |
| `.skilled/skills/sk-design/README.md` | Create | 001 | The one skill with no README |
| `.skilled/skills/<hub>/<mode>/README.md` (41) | Modify | 002 | Every registered mode packet README, from the skill README template |
| `.skilled/hooks/<name>/README.md` (26) | Modify | 003 | Hook folder READMEs, from the hook template's folder scaffold |
| `.skilled/hooks/<name>/<runtime>/README.md` (47) | Modify | 004 | Runtime adapter READMEs, from the hook template's runtime folder scaffold |
| Plugin, extension and hook mirror READMEs (8) | Modify | 005 | `.pi/extensions`, `.opencode/plugins`, `.dsh/plugins/repo-guards`, `.vibe/plugins` and the `.claude`, `.codex`, `.cursor` and `.devin` hooks folders |
| Runtime folder READMEs (7) and `SYNC.md` files (8) | Modify | 006 | From the runtime folder template |
| `.vibe/README.md` | Create | 006 | The one runtime folder with no README |
| Hook code folder READMEs (31) | Modify | 007 | `lib/`, `tests/`, `bin/`, `history/`, `session-readers/`, a tests fixtures folder and `.skilled/hooks/shared/`, from the code-folder template |
| `.skilled/hooks/README.md` | Modify | 007 | The hooks library README with its switch index and coverage matrix, rewritten last |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json` and `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` | Modify | Each | Generated files rebuilt when a phase's READMEs change their verdict or trigger phrases |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-skill-readmes/ | Rewrite the 13 skill READMEs to the skill README template and write one for `sk-design` | Complete |
| 2 | 002-mode-packet-readmes/ | Rewrite the 41 mode packet READMEs to the skill README template | Complete |
| 3 | 003-hook-folder-readmes/ | Rewrite the 26 hook folder READMEs around the runtime coverage table | Complete |
| 4 | 004-hook-runtime-readmes/ | Rewrite the 47 runtime adapter READMEs to the runtime folder scaffold | Complete |
| 5 | 005-runtime-plugin-readmes/ | Rewrite the 8 plugin, extension and hook mirror READMEs | Complete |
| 6 | 006-runtime-folder-readmes/ | Rewrite 7 runtime folder READMEs and 8 SYNC docs, and write `.vibe/README.md` | Complete |
| 7 | 007-hook-code-folder-readmes/ | Rewrite the 31 hook code folder READMEs and the hooks library README to the code-folder template | Complete |
| 8 | 008-readme-html-conventions/ | Write the README rule for GitHub alerts and folded tables, block a broken fold in the validator and pilot both on four files | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-skill-readmes | 002-mode-packet-readmes | All 14 skill READMEs, the new `sk-design` one included, validate with 0 hard voice blockers and 0 broken links, and the phase is pushed | `validate.sh --strict` on 001 prints `RESULT: PASSED` |
| 002-mode-packet-readmes | 003-hook-folder-readmes | All 41 mode packet READMEs meet the same checks, and the phase is pushed | `validate.sh --strict` on 002 prints `RESULT: PASSED` |
| 003-hook-folder-readmes | 004-hook-runtime-readmes | All 26 hook folder READMEs meet the checks, and each coverage table matches the adapters on disk | `validate.sh --strict` on 003 prints `RESULT: PASSED` |
| 004-hook-runtime-readmes | 005-runtime-plugin-readmes | All 47 runtime adapter READMEs meet the checks, and each names its real registration file | `validate.sh --strict` on 004 prints `RESULT: PASSED` |
| 005-runtime-plugin-readmes | 006-runtime-folder-readmes | All 8 plugin and mirror READMEs meet the checks | `validate.sh --strict` on 005 prints `RESULT: PASSED` |
| 006-runtime-folder-readmes | 007-hook-code-folder-readmes | All 16 runtime folder files meet the checks, including the new `.vibe/README.md` | `validate.sh --strict` on 006 prints `RESULT: PASSED` |
| 007-hook-code-folder-readmes | 008-readme-html-conventions | Every README in the program is on its template, so a rule on top of the templates has a stable base | `validate.sh --strict` on 007 prints `RESULT: PASSED` |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None. The operator added the `sk-design` README to phase 001 and the hooks library README to phase 007.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Templates**: `.skilled/skills/sk-doc/sk-create-readme/assets/`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
