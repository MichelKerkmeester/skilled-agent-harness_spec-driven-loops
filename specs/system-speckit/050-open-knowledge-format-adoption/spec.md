---
title: "Feature Specification: Open Knowledge Format adoption for system-spec-kit: research, design, implementation"
description: "Phased program that studies Google's Open Knowledge Format and decides which of its ideas to adopt in system-spec-kit: frontmatter, indexing, search, provenance and portability."
trigger_phrases:
  - "open knowledge format"
  - "okf adoption"
  - "spec-kit frontmatter improvements"
  - "spec-kit search improvements"
  - "okf deep research"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/050-open-knowledge-format-adoption"
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

# Feature Specification: Open Knowledge Format adoption for system-spec-kit: research, design, implementation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-04 |
| **Branch** | `worktrees/086-okf-adoption-research` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | scaffold/050-open-knowledge-format-adoption |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Phase 001 closes with a ranked adopt, adapt or reject verdict per idea; phase 002 designs only the accepted ones |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Google Cloud published the Open Knowledge Format (OKF) in June 2026 as an open, vendor-neutral way to package agent-readable knowledge as a directory of markdown files with YAML frontmatter. The upstream spec has already moved to v0.2 and adds provenance, trust, freshness and lifecycle fields. system-spec-kit solves an overlapping problem with its own spec docs, frontmatter, `description.json`, `graph-metadata.json`, trigger index and ripgrep retrieval recipes, but nobody has compared the two systems field by field, so useful ideas may be sitting unused and the two formats cannot exchange knowledge.

### Purpose
Establish, from evidence in this repository and on the open web, which OKF ideas are worth taking, which should be adapted, and which should be rejected. Then design and build only the accepted ones, without breaking the existing packets, validators or search paths.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A deep-research pass over how system-spec-kit works today: spec docs per level, frontmatter and metadata files, validators, search and retrieval.
- A deep-research pass over OKF v0.1 and v0.2 and the surrounding ecosystem and online resources.
- A crosswalk between the two, with a ranked adopt, adapt or reject verdict per idea.
- Implementation of three ideas, each across spec-kit and sk-doc: R5 (one `contextType` list), R1 reshaped (a check on existing `[SOURCE:]` tags) and R9 (citation drift detection).
- Hardening of those three with measurement fixed before the data: what each one catches, how often it is right and what it costs to run.

### Out of Scope
- Replacing the current spec-kit templates or levels wholesale; OKF informs the existing system, it does not substitute for it.
- Any change to spec-kit code, templates or validators during phase 001, which is research only.
- Publishing anything outside this repository.
- The deferred ideas R2 (OKF export), R3 (stale-after date) and R4 (actor labels), which wait for a named consumer, and the rejected R6, R7 and R8.

### Files to Change
Audit trail only; per-phase detail lives in each child's `plan.md`.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `001-okf-deep-research/research/` | Create | okf-deep-research | Iteration files, findings registry and the synthesized `research.md` |
| `002-baseline-and-decisions/` | Create | baseline-and-decisions | Baseline report and decision record |
| `.skilled/skills/system-spec-kit/` and `.skilled/skills/sk-doc/` | Modify | phases 003 to 010 | Per-phase file lists live in each child spec |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-okf-deep-research/ | Ten-iteration deep research on current spec-kit versus OKF, with online source discovery | Complete |
| 2 | 002-baseline-and-decisions/ | Freeze numbers, close the sk-doc research gap, record decisions D1 to D4 | Complete |
| 3 | 003-context-type-unification/ | R5: one `contextType` list across spec-kit and sk-doc, outliers mapped | Complete |
| 4 | 004-citation-drift-detection/ | R9: extend the citation scanner to spec and research docs, report only | Complete |
| 5 | 005-source-resolver/ | R1 reshaped: warn-only check on `[SOURCE:]` tags in new research and review docs | Complete |
| 7 | 007-docs-and-closeout/ | Contracts, catalogs, changelogs in both skills and final verification | Complete |
| 8 | 008-context-type-hardening/ | Measure the shared list forward: off-list rates in generated and model-written docs, what the warning catches and its false alarms | Complete |
| 9 | 009-census-hardening/ | Fix paths with spaces, measure accuracy per class on random samples, batch the git reads, add a rename-table rebuild | Complete |
| 10 | 010-source-tag-hardening/ | Read whole tag paths, treat ignored folders the same everywhere, measure accuracy and what planted bad tags it catches | Complete |
| 11 | 011-frontmatter-values-to-sk-doc/ | Move the document values and tiers into `sk-create-frontmatter`, keep the session list in spec-kit, repoint the four readers | Complete |

Order: 002 first. Then 003 and 004 can run in parallel. 005 needs the 004 resolver. 007 closes the adoption. 008 and 009 can run in parallel, and 010 follows 009 because both use the scanner's citation parser. 011 follows 008, whose corpus sweep it reruns after the move.

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-okf-deep-research | 002-baseline-and-decisions | Ten iterations complete, `research/research.md` holds a ranked verdict list with its review appendix | `validate.sh --strict` on phase 001 and its `implementation-summary.md` |
| 002-baseline-and-decisions | 003-context-type-unification | `baseline.md` reproduces and decisions D1 and D4 are approved | `validate.sh --strict` on phase 002 and an operator go-ahead |
| 002-baseline-and-decisions | 004-citation-drift-detection | Decisions D3 and D4 approved and the labeled sample enlarged or its shortfall recorded | `validate.sh --strict` on phase 002 and an operator go-ahead |
| 004-citation-drift-detection | 005-source-resolver | The scanner resolver and its redirect table work on spec and research docs | Scanner tests pass and the census reproduces |
| 003, 004 and 005 | 007-docs-and-closeout | Each phase is built | `validate.sh --strict` on each phase |
| 007-docs-and-closeout | 008-context-type-hardening | The shared list, its warning and their docs ship | `check-frontmatter-values.vitest.ts` passes |
| 007-docs-and-closeout | 009-census-hardening | The census reproduces at its pinned commit | `census.txt` sha256 matches a rerun |
| 009-census-hardening | 010-source-tag-hardening | The shared citation parser keeps paths that contain spaces | Scanner tests pass with that case |
| 008-context-type-hardening | 011-frontmatter-values-to-sk-doc | The shared list and both checkers have a measured corpus result | `008/scratch/corpus-result.json` |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Which OKF ideas survive contact with the 4,544 existing `spec.md` files under `specs/`: is any change additive, or does each need a migration?
- Should spec-kit export an OKF bundle view of its packets, import one, or only borrow the conventions?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
