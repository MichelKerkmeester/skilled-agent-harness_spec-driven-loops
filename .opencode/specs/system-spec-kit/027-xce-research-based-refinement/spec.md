---
title: "XCE-Derived Spec Kit Refinement"
description: "Phase-parent packet for Spec Kit refinements: memory-system correctness, indexing, causal graph lifecycle, trigger matching, learning feedback reducers, and peck-derived documentation/process improvements."
trigger_phrases:
  - "027 xce memory refinement"
  - "memory semantic triggers"
  - "feedback P0 correctness"
  - "feedback reducers"
  - "memoization dependency dag"
  - "causal graph tombstones"
  - "frontmatter causal edge promoter"
  - "statediff reconciliation layer"
  - "incremental memory index"
  - "memory feedback reducers"
  - "peck teachings adoption"
  - "self-check templates"
  - "current-state discipline"
  - "constitutional rule review"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement"
    last_updated_at: "2026-06-14T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Grouped 30 phases under six themed tracks"
    next_safe_action: "Validate recursively and commit the regroup"
    blockers: []
    key_files:
      - "spec.md"
      - "000-release-cleanup/spec.md"
      - "001-research-and-doctrine/spec.md"
      - "002-memory-store-and-search/spec.md"
      - "003-advisor-and-codegraph/spec.md"
      - "004-shared-infrastructure/spec.md"
      - "005-verification-and-remediation/spec.md"
      - "context-index.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-04-027-peck-phase-adoption"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions:
      - "027 is the parent packet for the peck-derived planned work; the peck work lives under child phase 001."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: XCE-Derived Spec Kit Refinement (Phase Parent)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Phase Parent |
| **Created** | 2026-05-08 |
| **Updated** | 2026-06-14 |
| **Branch** | `main` |
| **Executor** | local spec authoring |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Spec Kit has coordinated refinement work across memory correctness, indexing, causal graph hygiene, trigger matching, learning feedback, and documentation/process quality. These topics share operational surfaces but have independent delivery risks, so they need a parent control document that points to child phase folders without duplicating implementation detail.

### Purpose
Coordinate the remaining child phases so each one can be resumed, implemented, and validated independently while the parent keeps the current phase map, high-level scope, and handoff order visible. This refinement builds on the now-completed 026 graph-and-context-optimization program (Status: Complete as of 2026-06-05; track 005 deferred in place).

> **Phase-parent note:** This spec.md is the only REQUIRED authored document at the parent level; optional cross-cutting docs (the `context-index.md` migration bridge and `resource-map.md`) may also live here. All detailed planning, task breakdowns, checklists, decisions, and continuity live inside the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Spec Kit Memory safety, indexing, causal-edge lifecycle, metadata edge promotion, statediff reconciliation, semantic trigger matching, and learning feedback reducers.
- Low-risk peck-derived documentation/process improvements: self-check template guidance, current-state discipline, and constitutional rule review.
- Dual-stack CLI surfaces over the mk-* MCP daemons as a completed workstream.
- Root-level child phase routing, dependency visibility, and resume wayfinding.

### Out of Scope
- Implementing the peck-derived T1 per-acceptance-criterion coverage gate.
- Detailed implementation plans at the parent level.
- Changing child phase implementation scope beyond the phase map.

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in child plans.

| File Path | Change Type | Track | Description |
|-----------|-------------|-------|-------------|
| `001-research-and-doctrine/**` | Modify | 001 | Peck and gem-team doctrine adoption |
| `002-memory-store-and-search/**` | Modify | 002 | Memory store, write-safety, index/causal lifecycle, triggers, reducers, search resilience |
| `003-advisor-and-codegraph/**` | Modify | 003 | Skill-advisor and code-graph subsystem hardening |
| `004-shared-infrastructure/**` | Modify | 004 | CLI front-doors, command presentation, adapter ports, dependency and lifecycle infrastructure |
| `005-verification-and-remediation/**` | Modify | 005 | Verify-first remediation and research program |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. The work is grouped under six themed tracks. Each track is a phase parent whose children own the implementation detail. The old-number to new-path bridge lives in `context-index.md`, and the historical changelogs are indexed in `changelog/README.md`.

| Track | Folder | Focus | Status |
|-------|--------|-------|--------|
| 000 | `000-release-cleanup/` | Outward and governance surface alignment for release: public README, skill docs, feature catalog, manual playbook, MCP/CLI stress, commands, agents, AGENTS.md | In Progress |
| 001 | `001-research-and-doctrine/` | Research-derived doctrine adoption: peck verification discipline and gem-team agent I/O contract (2 phases) | In Progress |
| 002 | `002-memory-store-and-search/` | Memory store and retrieval hardening: write-safety, index and causal lifecycle, semantic triggers, feedback reducers, memclaw hardening, observability, continuity, vector and BM25 search resilience (14 phases) | In Progress |
| 003 | `003-advisor-and-codegraph/` | Skill-advisor and code-graph subsystems: causal-traversal BFS, XCE feature adoption, advisor reconnect resilience (3 phases) | Complete |
| 004 | `004-shared-infrastructure/` | Cross-cutting layers: CLI front-doors, command presentation, storage adapter ports, CLI UX, dependency patching, code-mode lifecycle, IPC client cap (7 phases) | Complete |
| 005 | `005-verification-and-remediation/` | Verify-first program: finding remediation, tri-system deep research, deep-research remediation, residual design units (4 phases) | In Progress |

### Phase Transition Rules

- Each track and each child phase MUST pass `validate.sh` independently.
- The parent spec tracks aggregate progress via this map.
- Use `/speckit:resume [track]/[NNN-phase]/` to resume a specific phase.
- Run `validate.sh --recursive` on the parent to validate all tracks as an integrated unit.

### Old-to-New Bridge

The thirty prior top-level phases are grouped under the six themed tracks above. The full old-number to new-path mapping is recorded in `context-index.md`. Per-phase changelogs keep their original paths and are indexed in `changelog/README.md`.

<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None open at the parent level. The themed-track map is current and per-phase questions live in the child folders.

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md.
- **Peck adoption child**: See `001-peck-teachings-adoption/spec.md`.
- **Research provenance**: See `research/` and child-phase research folders.
- **Graph Metadata**: See `graph-metadata.json` for child phase pointers.
