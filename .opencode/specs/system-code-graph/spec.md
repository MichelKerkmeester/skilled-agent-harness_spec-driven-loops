---
title: "Feature Specification: system-code-graph Code-Graph Subsystem Track"
description: "The canonical home for the system-code-graph subsystem: code-graph core (determinism, edge lifecycle, seeded-PPR ranking, bitemporal defaults), the documentation audit and doc fixes, the buildout tree, the two scatter parents (packets migrated out of the 026 optimization and 027 refinement trees), the advisor/code-graph shared-feature adoption, and the Rust-backend rewrite research. Active packets are numbered 025-035 so the whole track reads as one continuous sequence after the archived 001-024."
trigger_phrases:
  - "system-code-graph track"
  - "code-graph subsystem history"
  - "code graph core scatter buildout advisor"
  - "system-code-graph spec history"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Track root spec.md authored; active packets renumbered 001-011 to 025-035"
    next_safe_action: "Resume any child phase folder independently"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-07-15-system-code-graph-track"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT -->

# Feature Specification: system-code-graph Code-Graph Subsystem Track

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-07-06 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | none (track root) |
| **Parent Packet** | none (track root) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `system-code-graph` subsystem owns the code-graph work: the core determinism / edge-lifecycle / seeded-PPR / bitemporal packets, the documentation audit and doc fixes, the buildout tree, two scatter parents that collect packets migrated out of the 026 optimization and 027 refinement trees, the advisor / code-graph shared-feature adoption, and the Rust-backend rewrite research. The archived history lives under `z_archive/` numbered `001-024`, but the active root-level packets ALSO started at `001` (`001-011`). Two sequences both beginning at `001` made the track read as two overlapping histories.

### Purpose
The active packets are renumbered `025-035` so they continue directly after the archive's `001-024`, giving one continuous `001-035` sequence for the subsystem. The archive is untouched. The parent routes to its child phase folders; each child owns its own plan, tasks, checklist, decisions, and continuity.

> **Phase-parent note:** This spec.md is the ONLY authored document at this parent level. All detailed planning lives in the child phase folders listed in the Phase Documentation Map below. The renumber record lives in `context-index.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root-level routing for the child phase folders.
- The `025-035` active-packet phase-documentation map.

### Out of Scope
- Rewriting child folders beyond identity metadata and path references.
- The archived `z_archive/001-024` packets (untouched).
- Cross-track references left in other tracks or skills (see `context-index.md`).

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `spec.md` | Create | this | Root purpose and child map |
| `description.json`, `graph-metadata.json` | Refresh | this | Search metadata for the parent |
| `context-index.md` | Create | this | Renumber record and old→new map |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each child below is an independently executable phase folder owning its own plan, tasks, checklist, decisions, and continuity. Active packets are numbered `025-035`, continuing after the archived `001-024`.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 025 | `025-code-graph-core/` | Code-graph core: determinism, edge lifecycle, seeded-PPR ranking, bitemporal | Phase parent |
| 026 | `026-code-graph-seeded-ppr/` | Seeded-PPR impact ranking benchmark | Phase parent |
| 027 | `027-code-graph-edge-lifecycle/` | Edge lifecycle dark-flag benchmark | Phase parent |
| 028 | `028-code-graph-defaults-bitemporal/` | Degree-cap default and bitemporal reindex wiring | Phase parent |
| 029 | `029-code-graph-doc-audit/` | Code-graph documentation audit | Phase parent |
| 030 | `030-fix-code-graph-docs/` | Code-graph doc fixes | Phase parent |
| 031 | `031-code-graph-buildout/` | Code-graph buildout | Phase parent |
| 032 | `032-code-graph-scatter/` | Scatter parent: packets migrated out of the 026 optimization tree | Phase parent |
| 033 | `033-advisor-code-graph-shared-features/` | Adopt spec-027 memory features into Skill Advisor and Code Graph | Phase parent |
| 034 | `034-code-graph-scatter-from-027/` | Scatter parent: packets migrated out of the 027 refinement tree | Phase parent |
| 035 | `035-rust-backend-rewrite-research/` | Rust code-graph backend rewrite research | Phase parent |
| z_archive | `z_archive/` | Archived code-graph history (`001-024`) | Archive |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently.
- Run `validate.sh --recursive` on this folder to validate all phases as a unit.
- Use `/speckit:resume system-code-graph/[NNN-phase]/` to resume a specific phase.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| `025-code-graph-core` | `035-rust-backend-rewrite-research` | Each phase ships and validates independently | Per-phase strict validation evidence |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None open. The active-renumber scope (`001-011` → `025-035`) and old→new map are recorded in `context-index.md`; cross-track references to old paths are left stale per the scoped-repair rule pending a future reindex.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Renumber record**: `context-index.md`
- **Graph metadata**: `graph-metadata.json`
