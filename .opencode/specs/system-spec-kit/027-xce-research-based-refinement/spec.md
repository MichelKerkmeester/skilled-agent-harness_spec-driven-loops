---
title: "Feature Specification: XCE-Derived Spec Kit Refinement [system-spec-kit/027-xce-research-based-refinement/spec]"
description: "Phase-parent packet coordinating the XCE-derived Spec Kit refinement program across six themed tracks: release cleanup, research/doctrine adoption, memory store & search, skill-advisor & code-graph, shared infrastructure, and verification & remediation."
trigger_phrases:
  - "027 xce research based refinement"
  - "027 root packet"
  - "027 phase map"
  - "xce refinement program"
  - "027 memory store and search"
  - "027 advisor and codegraph"
  - "027 shared infrastructure"
  - "027 verification and remediation"
  - "memory semantic triggers"
  - "feedback reducers"
  - "causal graph tombstones"
  - "peck teachings adoption"
  - "gem-team agent io contract"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement"
    last_updated_at: "2026-06-20T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Optimized 027 root for retrieval, lean root plus clean metadata and phase maps"
    next_safe_action: "Resume an in-flight track child via /speckit:resume"
    blockers: []
    key_files:
      - "spec.md"
      - "context-index.md"
      - "timeline.md"
      - "graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-04-027-peck-phase-adoption"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "027 is the parent packet for the peck-derived planned work; the peck work lives under child phase 001-research-and-doctrine/001-peck-teachings-adoption."
      - "No phase merges or renames are warranted; the six-track grouping is already optimal for retrieval — see context-index.md for the grouping rationale."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  CARVE-OUT (accepted at this parent only): the generated timeline.md recency index is a sanctioned rollup artifact cross-referenced from context-index.md; its newest→oldest ordering is intentional and is NOT the forbidden per-phase change history above.
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
| **Status** | Complete |
| **Created** | 2026-05-08 |
| **Updated** | 2026-06-20 |
| **Branch** | `main` |
| **Executor** | local spec authoring |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Spec Kit needed a coordinated refinement program spanning memory correctness, retrieval, causal-graph hygiene, trigger matching, learning feedback, skill-advisor and code-graph hardening, shared CLI/infrastructure layers, and verify-first remediation. These topics share operational surfaces but have independent delivery risks, so they need a parent control document that points to child phase folders without duplicating implementation detail.

### Purpose
Coordinate the six themed tracks so each child phase can be resumed, implemented, and validated independently while the parent keeps the current phase map, high-level scope, and handoff order visible. This refinement builds on the now-completed 026 graph-and-context-optimization program (Status: Complete as of 2026-06-05; track 005 deferred in place).

> **Phase-parent note:** This spec.md is the only REQUIRED authored document at the parent level. The sanctioned optional cross-cutting docs that also live at the root are `context-index.md` (migration bridge) and the generated `timeline.md` (chronological recency view); the epic before/after narrative lives at `changelog/before-vs-after.md`. All detailed planning, task breakdowns, checklists, decisions, and continuity live inside the child phase folders listed in the Phase Documentation Map below. Phase history and old-path resolution live in `context-index.md`; chronological recency (newest→oldest spec folders) lives in `timeline.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Spec Kit Memory safety, indexing, causal-edge lifecycle, metadata edge promotion, statediff reconciliation, semantic trigger matching, learning feedback reducers, and vector/BM25 retrieval resilience.
- Skill-advisor and code-graph subsystem hardening; research-derived doctrine adoption (peck, gem-team).
- Dual-stack CLI surfaces over the mk-* MCP daemons and cross-cutting shared infrastructure as completed workstreams.
- Verify-first remediation and release-alignment review.
- Root-level child phase routing, dependency visibility, and resume wayfinding.

### Out of Scope
- Per-track implementation detail (lives in each child phase folder).
- Detailed implementation plans at the parent level.
- Phase history narration (lives in `context-index.md`).
- Changing child phase implementation scope beyond the phase map.

### Files to Change

| File Path | Change Type | Track | Description |
|-----------|-------------|-------|-------------|
| `000-release-cleanup/**` | Modify | 000 | Outward + governance surface alignment for release |
| `001-research-and-doctrine/**` | Modify | 001 | Peck and gem-team doctrine adoption |
| `002-memory-store-and-search/**` | Modify | 002 | Memory store, write-safety, index/causal lifecycle, triggers, reducers, search resilience |
| `003-advisor-and-codegraph/**` | Modify | 003 | Skill-advisor and code-graph subsystem hardening |
| `004-shared-infrastructure/**` | Modify | 004 | CLI front-doors, command presentation, adapter ports, dependency and lifecycle infrastructure |
| `005-verification-and-remediation/**` | Modify | 005 | Verify-first remediation and research program |
| `spec.md`, `context-index.md`, `timeline.md`, `graph-metadata.json`, `description.json` | Modify | root | Root navigation + metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. The work is grouped under six themed tracks. Each track is a phase parent whose children own the implementation detail. Tracks are ordered by their topical number, NOT by recency — see `timeline.md` for newest→oldest. The old-number to new-path bridge lives in `context-index.md`, and the historical changelogs are indexed in `changelog/README.md`.

| Track | Folder | Focus | Status |
|-------|--------|-------|--------|
| 000 | `000-release-cleanup/` | Outward and governance surface alignment for release: public README, skill docs, feature catalog, manual playbook, MCP/CLI stress, commands, agents, AGENTS.md, skill frontmatter; hosts the spec-tree regroup task (10 phases) | Complete |
| 001 | `001-research-and-doctrine/` | Research-derived doctrine adoption: peck verification discipline and gem-team agent I/O contract (2 phases) | Complete |
| 002 | `002-memory-store-and-search/` | Memory store and retrieval hardening: write-safety, index and causal lifecycle, semantic triggers, feedback reducers, memclaw hardening, observability, continuity, vector and BM25 search resilience, maintenance-grace + reindex responsiveness (20 phases) | Complete · lanes deferred |
| 003 | `003-advisor-and-codegraph/` | Skill-advisor and code-graph subsystems: causal-traversal BFS, XCE feature adoption, advisor reconnect resilience, suite repair, advisor-state leak fix (5 phases) | Complete |
| 004 | `004-shared-infrastructure/` | Cross-cutting layers: CLI front-doors, command presentation, storage adapter ports, CLI UX, dependency patching, code-mode lifecycle, IPC client cap, MCP config alignment + daemon re-election, code-graph code-only indexing (9 phases) | Complete |
| 005 | `005-verification-and-remediation/` | Verify-first program: finding remediation, tri-system deep research, deep-research remediation, residual design units, fresh-regression remediation, deep-review 017-021 remediation, release-alignment review (7 phases) | Complete · lanes deferred |

> **Deferred lanes (in place, not removed):** a small number of child lanes under tracks `002` and `005` are deferred rather than shipped — for example vector-recall recovery under `002-memory-store-and-search/015-retrieval-gating-and-recall-recovery` and the still-planned sub-lanes under `005-verification-and-remediation/005-fresh-regression-remediation`. Each track's own spec.md phase map records the precise per-child disposition. This mirrors the 026 model (program Complete with deferred work tracked in place).

### Phase Transition Rules

- Each track and each child phase MUST pass `validate.sh` independently.
- The parent spec tracks aggregate progress via this map; per-track detail stays in the children.
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

- **Chronological timeline (newest→oldest spec folders)**: See `timeline.md` — the recency view, separate from folder numbers.
- **Phase migration bridge / old-path resolution**: See `context-index.md`.
- **Epic before/after narrative**: See `changelog/before-vs-after.md` — the program-level rollup of what changed by system.
- **Phase children**: See sub-folders `000-*` … `005-*` for per-phase spec.md, plan.md, tasks.md.
- **Research provenance**: See `research/` and child-phase research folders.
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` (currently `003-advisor-and-codegraph`, the most recently active track per `timeline.md`).
