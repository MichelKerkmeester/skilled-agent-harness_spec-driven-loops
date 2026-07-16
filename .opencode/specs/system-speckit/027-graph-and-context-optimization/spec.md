---
title: "Feature Specification: Graph and Context Optimization [system-spec-kit/026-graph-and-context-optimization/spec]"
description: "Root coordination packet for the graph, context, memory, and operator-tooling improvement program, decomposed into eight themed phase tracks."
trigger_phrases:
  - "026 graph and context optimization"
  - "026 root packet"
  - "graph context optimization program"
  - "026 phase map"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization"
    last_updated_at: "2026-06-05T13:12:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Reconciled program-context drift; marked 026 closed, 005 deferred"
    next_safe_action: "026 closed; reopen a track only to address deferred 005"
    blockers: []
    key_files:
      - "spec.md"
      - "context-index.md"
      - "timeline.md"
      - "graph-metadata.json"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Feature Specification: Graph and Context Optimization

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-08 |
| **Updated** | 2026-06-05 |
| **Branch** | `027-graph-and-context-optimization` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The spec-kit's graph, context, memory, and operator-tooling subsystems each needed a coordinated improvement program rather than scattered one-off fixes. This packet is the root coordination surface that decomposes that program into eight independently executable themed phase tracks.

### Purpose
Deliver graph indexing, context/memory continuity, embedding architecture, skill-advisor, spec-kit internals, and operator-tooling improvements as themed phase tracks, each owning its own planning, execution, and verification. The root packet owns navigation, the eight-track map, and aggregate status only.

> **Phase-parent note:** This spec.md is the ONLY authored planning document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. Phase history and old-path resolution live in `context-index.md`; chronological recency (newest→oldest spec folders) lives in `timeline.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Coordinate the eight themed phase tracks (`000`–`007`) and their aggregate status.
- Provide the navigation map from theme to child phase folder.
- Track which tracks are shipped, in progress, or deferred in place.

### Out of Scope
- Per-track implementation detail (lives in each child phase folder).
- Runtime code changes (performed within the relevant child phases).
- Phase history narration (lives in `context-index.md`).

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `00N-*/` | Modify | all | Per-track work lives in child phase folders |
| `spec.md`, `context-index.md`, `graph-metadata.json`, `description.json` | Modify | root | Root navigation + metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Eight themed phase tracks. Each is an independently executable child spec folder owning its own
> plan, tasks, checklist, decisions, and continuity. The Status column reports aggregate track state.
> Tracks are ordered by their topical number, NOT by recency — see `timeline.md` for newest→oldest.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 000 | `000-release-and-program-cleanup/` | Release readiness, audits, cross-cutting cleanup, stress tests, post-program follow-up | complete |
| 001 | `001-research-and-baseline/` | External research corpus, adoption decisions, and graph/context baselines | complete |
| 002 | `002-spec-kit-internals/` | Resource-map/deep-loop plumbing, skill-advisor system, template system, spec-folder naming, validate/orchestrator parity | complete |
| 003 | `003-memory-and-causal-runtime/` | Memory continuity substrate, causal-graph channel routing, embedding architecture + embedding-stack consolidation/hardening | complete |
| 004 | `system-code-graph/007-code-graph-buildout/` | Moved to the system-code-graph track; code-graph structural-indexing package, CocoIndex decoupling, startup fixes, code-graph sub-themes | moved |
| 005 | `005-graph-impact-and-affordance/` | External-project adoption uplift: phase runner, edge/impact explanation, affordance + causal-trust display | deferred |
| 006 | `006-operator-tooling/` | Runtime hook parity, doctor command surface, install-script/doctor realignment, session-lifecycle + worktree automation | complete |
| 007 | `007-mcp-daemon-reliability/` | MCP daemon lifecycle reliability: IPC socket canonicalization, WAL checkpoint-on-close, graceful shutdown + watchdog, provider dispose, at-rest durability + memory-DB/graph-churn healing + infra follow-up hardening | complete |
| 008 | `008-runtime-defect-fixes/` | Four live integration defects fixed in place (code-graph plugin bridge imports, Codex hook rewiring, DB-path note, Gemini catalog drift) + verified orphan-sweep no-op; surfaced by the 028 transition research | complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- The parent spec tracks aggregate progress via this map; per-track detail stays in the children.
- Deferred tracks (`005`, plus `002/004-literal-spec-folder-names` and `006/003-install-scripts-doctor-realignment`) remain in place with explicit `deferred` status; they are not removed.
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific track.
- Run `validate.sh --recursive` on the root to validate all tracks as an integrated unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| `001-research-and-baseline` | `003-memory-and-causal-runtime` | Research baselines available before memory/runtime work | Both validate; baselines present |
| `003-memory-and-causal-runtime` | `004-code-graph` | Memory + causal substrate stable; code-graph is a distinct structural surface that cross-links to memory, not a shared store | Memory tracks validate; code-graph cross-links recorded here |
| `004-code-graph` | `005-graph-impact-and-affordance` | Code-graph package + decoupling shipped before adoption-uplift display work | 004 sub-wrappers validate; 005 consumes graph surfaces in display mode |
| `002-spec-kit-internals` | `006-operator-tooling` | Advisor + template internals stable before operator-surface realignment | Advisor/template tracks validate; tooling tracks reference them |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None blocking. Deferred tracks are tracked in place; resume them via their child phase folders when prioritized.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Chronological timeline (newest→oldest spec folders)**: See `timeline.md` — the recency view, separate from folder numbers
- **Phase migration bridge / old-path resolution**: See `context-index.md`
- **Phase children**: See sub-folders `000-*` … `007-*` for per-phase spec.md, plan.md, tasks.md
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer (currently `000-release-and-program-cleanup`, the most recently active track)
