---
title: "Feature Specification: Rename the sk-code-opencode surface to sk-code-skilled across the skill, advisor DB, routers and every markdown reference"
description: "Phased packet that gives the sk-code OpenCode surface the new name sk-code-skilled in the skill folder, the advisor DB, every router and every markdown reference."
trigger_phrases:
  - "sk code skilled rename phase parent spec"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/012-sk-code-skilled-rename"
    last_updated_at: "2026-04-11T00:00:00Z"
    last_updated_by: "template-author"
    recent_action: "Initialize phase-parent continuity block"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
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

# Feature Specification: Rename the sk-code-opencode surface to sk-code-skilled across the skill, advisor DB, routers and every markdown reference

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-18 |
| **Branch** | `worktrees/144-sk-code-skilled-rename` |
| **Parent Spec** | None (top-level packet) |
| **Parent Packet** | sk-code/012-sk-code-skilled-rename |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Every child validates `--strict`, and a repo-wide search finds no live `sk-code-opencode` reference outside the exclusions phase 001 records |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-code hub exposes a surface packet named `sk-code-opencode`. The surface covers the Skilled framework itself (skills, agents, commands, hooks and runtime scripts), not only OpenCode, so the name misleads readers and routing. The name is load-bearing: it appears in the skill folder, the hub registry and router, the system-skill-advisor DB and graph metadata, runtime mirrors such as `.hermes/skills/`, scripts and tests, and in about 1,300 markdown files (about 107 outside `specs/` and about 1,196 inside it).

### Purpose
Give the surface the name `sk-code-skilled` everywhere it is referenced, without breaking hub routing, the advisor recommendation path or any test. The work runs in three phases: measure the full blast radius first, then change the load-bearing skill and routing surfaces, then sweep every remaining markdown reference.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The `sk-code-opencode` surface folder under `.skilled/skills/sk-code/` and every runtime mirror of it
- The sk-code hub registry, router, `graph-metadata.json` and `SKILL.md` mode tables
- The system-skill-advisor DB, compiled routes, integration code and tests that name the surface
- Every markdown file in the repo that names `sk-code-opencode`, including spec docs
- Related spellings the research confirms belong to the same identity, such as a bare `code-opencode` mode id or changelog folder

### Out of Scope
- Any behavior change to the surface beyond its name
- References to the OpenCode runtime itself (`.opencode/`, `cli-opencode`), which keep their names
- Any spelling phase 001 records as a deliberate exclusion, such as immutable history the operator chooses to keep

### Files to Change
Summary of the surfaces each phase touches. Per-phase detail lives in each child's plan.md.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `specs/sk-code/012-sk-code-skilled-rename/001-rename-impact-research/research/` | Create | 001 | Blast-radius inventory and rename plan |
| `.skilled/skills/sk-code/sk-code-opencode/` and runtime mirrors | Rename | 002 | Surface folder and mirrors take the new name |
| sk-code hub registry, router, graph metadata, advisor DB and integration code | Modify | 002 | Routing and advisor surfaces name `sk-code-skilled` |
| Markdown files that name `sk-code-opencode` | Modify | 003 | Reference sweep across the repo |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-rename-impact-research/ | Deep research, 5 iterations, DeepSeek V4.1 Flash Max through cli-devin: inventory every reference and spelling, rank the load-bearing surfaces, propose the rename order and exclusions | Complete |
| 2 | 002-skill-and-routing-rename/ | Rename the surface folder and mirrors, rename the surface id OPENCODE to SKILLED, and update the hub registry, routers, advisor DB, integration code and tests | Complete |
| 3 | 003-markdown-reference-sweep/ | Replace every remaining markdown reference across the repo, history included, and rename the spec folders that carry the name | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-rename-impact-research | 002-skill-and-routing-rename | `research/research.md` names every load-bearing surface, the rename order and the exclusions, and the operator accepts the plan | Child 001 validates `--strict`; operator sign-off recorded |
| 002-skill-and-routing-rename | 003-markdown-reference-sweep | The advisor recommends `sk-code-skilled` for an sk-code framework prompt and the hub routes to it | Advisor and hub routing tests pass; advisor recommend probe shows the new id |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Should immutable history (changelogs, archived specs under `z_archive/`, research iteration logs) be rewritten, or kept and excluded? Phase 001 measures it; the operator decides before phase 003.
- Does the bare `code-opencode` spelling (mode ids, changelog folder) belong to the same identity and take the name `code-skilled`?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
