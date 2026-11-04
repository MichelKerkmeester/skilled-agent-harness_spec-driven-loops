---
title: "Feature Specification: Manually check and refine every skill and mode for readability, layout and structure"
description: "Every Skilled skill and mode gets a file-by-file readability, layout and structure pass: Luna 6 xhigh reads and lists defects with file:line, DeepSeek V4.1 Flash high applies them, Luna re-reads the diff, and the render checks plus each skill's gates prove the result."
trigger_phrases:
  - "skill readability refinement phase parent spec"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/066-skill-readability-refinement"
    last_updated_at: "2026-11-04T09:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Scaffolded 13 skill phases and 49 nested phases"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ae286a84-7880-4ce7-a5fe-7d1335e09c78"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

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

# Feature Specification: Manually check and refine every skill and mode for readability, layout and structure

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-11-04 |
| **Branch** | `worktrees/315-frontend-reference-restructure` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | sk-doc/066-skill-readability-refinement |
| **Predecessor** | `specs/sk-code/018-frontend-upstream-proposals/010-reference-readability-research` |
| **Successor** | None |
| **Handoff Criteria** | Every leaf phase records its audit, fix, review and gates, and every skill is committed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The render checks added to `validate_document.py` catch the mechanical defects: joined labels, setext headings, bare URLs, empty overviews, repeated text, misnumbered or misplaced sections. They cannot judge whether a file reads well: whether its intro is a hook, whether a governing decision comes before the steps it governs, whether a wall of prose should be a list, whether items sit in the order a reader needs them. Across 13 skills and 42 modes about 620 docs have never been read for that, and 382 render warnings in other skills sit in a known-debt ledger.

### Purpose
Every skill and mode is read file by file and refined for readability, layout and structure, with no claim changed, and the known-debt ledger shrinks to what remains.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Per skill: `SKILL.md`, `ROUTER.md`, `README.md`, and every Markdown file under `references/`, `assets/` and `shared/`. A skill with modes gets a hub-and-shared phase for its root files and `shared/`, then one nested phase per mode.
- Per leaf: Luna 6 at xhigh on the fast tier (`cli-codex`, read-only sandbox) lists defects with `file:line` and the exact change. DeepSeek V4.1 Flash at high (`cli-pi`, `llmgateway/deepseek-v4.1-flash-1017`) applies them. Luna re-reads the diff and passes it or sends back a fix list.
- Review rubric, applied in this order: the sk-doc template for the file type; render checks at 0; an intro that is a hook and does not restate the Purpose; Purpose and When to Use first in the overview; a governing decision before the steps it governs; items in the order a reader uses them; paragraphs that pack several mechanisms become lists; indexes list every file they index; no status tokens or authoring history in the body; integer section numbers with related resources last.
- Shrinking `render-known-debt.json` for each skill the program clears.

### Out of Scope
- Changing what a rule, contract or instruction says. Text moves, splits and gets reformatted; every claim survives.
- Changelogs, manual testing playbooks, feature catalogs, benchmarks and tests, which record history or drive tests.
- Rule ids and headings other files link to, unless the leaf updates every inbound link.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/skills/<skill>/` in-scope docs | Modify | Each leaf | Readability, layout and structure |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/render-known-debt.json` | Modify | Each skill | Entries the skill no longer needs |
| `<skill>/changelog/`, `SKILL.md` version | Create, modify | Each skill | Release entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-cli-classifier/ | `cli-classifier`: hub and shared docs, then one nested phase per mode (1) | Pending |
| 2 | 002-cli-external-orchestration/ | `cli-external-orchestration`: hub and shared docs, then one nested phase per mode (7) | Pending |
| 3 | 003-cli-orca/ | `cli-orca`: every in-scope doc of the skill | Pending |
| 4 | 004-mcp-code-mode/ | `mcp-code-mode`: every in-scope doc of the skill | Pending |
| 5 | 005-mcp-tooling/ | `mcp-tooling`: hub and shared docs, then one nested phase per mode (8) | Pending |
| 6 | 006-sk-code/ | `sk-code`: hub and shared docs, then one nested phase per mode (5) | Pending |
| 7 | 007-sk-design/ | `sk-design`: hub and shared docs, then one nested phase per mode (4) | Pending |
| 8 | 008-sk-doc/ | `sk-doc`: hub and shared docs, then one nested phase per mode (14) | Pending |
| 9 | 009-sk-git/ | `sk-git`: every in-scope doc of the skill | Pending |
| 10 | 010-sk-prompt/ | `sk-prompt`: every in-scope doc of the skill | Pending |
| 11 | 011-system-deep-loop/ | `system-deep-loop`: hub and shared docs, then one nested phase per mode (3) | Pending |
| 12 | 012-system-skill-advisor/ | `system-skill-advisor`: every in-scope doc of the skill | Pending |
| 13 | 013-system-spec-kit/ | `system-spec-kit`: every in-scope doc of the skill | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-cli-classifier | 002-cli-external-orchestration | Every leaf of the skill passes its gates, and the skill is committed | The leaf `scratch/gates.txt` files and the skill commit |
| 002-cli-external-orchestration | 003-cli-orca | Every leaf of the skill passes its gates, and the skill is committed | The leaf `scratch/gates.txt` files and the skill commit |
| 003-cli-orca | 004-mcp-code-mode | Every leaf of the skill passes its gates, and the skill is committed | The leaf `scratch/gates.txt` files and the skill commit |
| 004-mcp-code-mode | 005-mcp-tooling | Every leaf of the skill passes its gates, and the skill is committed | The leaf `scratch/gates.txt` files and the skill commit |
| 005-mcp-tooling | 006-sk-code | Every leaf of the skill passes its gates, and the skill is committed | The leaf `scratch/gates.txt` files and the skill commit |
| 006-sk-code | 007-sk-design | Every leaf of the skill passes its gates, and the skill is committed | The leaf `scratch/gates.txt` files and the skill commit |
| 007-sk-design | 008-sk-doc | Every leaf of the skill passes its gates, and the skill is committed | The leaf `scratch/gates.txt` files and the skill commit |
| 008-sk-doc | 009-sk-git | Every leaf of the skill passes its gates, and the skill is committed | The leaf `scratch/gates.txt` files and the skill commit |
| 009-sk-git | 010-sk-prompt | Every leaf of the skill passes its gates, and the skill is committed | The leaf `scratch/gates.txt` files and the skill commit |
| 010-sk-prompt | 011-system-deep-loop | Every leaf of the skill passes its gates, and the skill is committed | The leaf `scratch/gates.txt` files and the skill commit |
| 011-system-deep-loop | 012-system-skill-advisor | Every leaf of the skill passes its gates, and the skill is committed | The leaf `scratch/gates.txt` files and the skill commit |
| 012-system-skill-advisor | 013-system-spec-kit | Every leaf of the skill passes its gates, and the skill is committed | The leaf `scratch/gates.txt` files and the skill commit |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None. The operator set the executors (Luna audits and reviews, DeepSeek fixes), the folder and the workspace on 2026-11-04.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
