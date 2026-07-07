---
title: "Feature Specification: Advisor and Codegraph Migrated Items"
description: "The advisor-only phases from the 027 advisor-and-codegraph adoption wave: cross-session reconnect, test-suite repair, spec-folder leak fix, and 5 shared-feature-adoption items."
trigger_phrases:
  - "advisor cross-session reconnect"
  - "advisor suite repair"
  - "advisor state spec folder leak"
  - "advisor observability provenance bm25"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/009-advisor-and-codegraph-migrated-items"
    last_updated_at: "2026-07-07T00:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Phase-parent scaffolded during system-skill-advisor extraction"
    next_safe_action: "Resume any child phase folder independently"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-07-07-skill-advisor-extraction"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT -->

# Feature Specification: Advisor and Codegraph Migrated Items

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-14 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-skill-advisor |
| **Predecessor** | system-skill-advisor/008-skill-advisor-cli |
| **Successor** | system-skill-advisor/010-skill-advisor-frontmatter-alignment |
| **Handoff Criteria** | Each child validates independently |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The advisor's cross-session reconnect hardening, test-suite repair, spec-folder-leak fix, and 5 shared-feature-adoption items (observability, provenance guard, packed BM25 lexical lane, BFS consolidation, feedback calibration) needed one home.

### Purpose
Group the 8 advisor-only phases from the 027 advisor-and-codegraph adoption wave under the skill-advisor track, alongside a shared BFS helper and 4 pure-code-graph siblings that stayed in `027/003-advisor-and-codegraph` since they are not advisor-scoped.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Advisor cross-session reconnect hardening
- Advisor test-suite repair
- Advisor state spec-folder-leak fix
- 5 shared-feature-adoption items: observability, provenance guard, packed BM25 lexical, BFS consolidation, feedback calibration

### Out of Scope
- The shared BFS helper and 4 pure-code-graph siblings, both stayed in `027/003-advisor-and-codegraph`

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `001-skill-advisor-cross-session-reconnect/` … `008-advisor-feedback-calibration/` | Modify | children | Per-child work lives in the child phase folders |
| `spec.md`, `graph-metadata.json`, `description.json` | Create | this | Phase-parent navigation and metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each child below is an independently executable phase folder owning its own plan, tasks, checklist, decisions, and continuity.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-skill-advisor-cross-session-reconnect/` | Cross-session reconnect hardening | complete |
| 002 | `002-skill-advisor-suite-repair/` | Test-suite repair (scorer/hook failures) | complete |
| 003 | `003-advisor-state-spec-folder-leak/` | Stops advisor state leaking into spec folders | complete |
| 004 | `004-advisor-observability/` | `why_recommended` + degraded-vector counters | complete |
| 005 | `005-advisor-provenance-guard/` | Source-provenance guard for auto-written skill-graph edges | complete |
| 006 | `006-advisor-packed-bm25-lexical/` | Packed BM25/BM25F lexical lane | complete |
| 007 | `007-advisor-bfs-consolidation/` | Shared BFS helper for advisor skill-graph queries | complete |
| 008 | `008-advisor-feedback-calibration/` | Shadow-only calibration from advisor_validate outcomes | complete |

### Phase Transition Rules

- Each child MUST pass `validate.sh` independently.
- Run `validate.sh --recursive` on this folder to validate all children as a unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| `001-skill-advisor-cross-session-reconnect` | `008-advisor-feedback-calibration` | All children independently complete | Each child validates independently |
<!-- /ANCHOR:phase-map -->
