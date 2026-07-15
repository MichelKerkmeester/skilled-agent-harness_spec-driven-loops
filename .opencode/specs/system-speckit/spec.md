---
title: "Feature Specification: system-speckit Spec-Kit Subsystem Track"
description: "The canonical home for the system-speckit spec-kit subsystem: the graph/context and memory-search optimization work, phased-spec preference, the Rust-backend rewrite research, vitest invariance maintenance, the memory command surface, the spec-mutation gate, the /speckit:phase merge, spec-kit UX upgrades and adoptions, the coco-index integration research, the auto-mode non-interactive contract, sub-phase recatalog, base-file renumbering, and the speckit command-family rename."
trigger_phrases:
  - "system-speckit track"
  - "spec-kit subsystem history"
  - "speckit ux memory gate phase"
  - "system-speckit spec history"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Track root spec.md authored for the system-speckit track assembly"
    next_safe_action: "Resume any child phase folder independently"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-07-15-system-speckit-track"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT -->

# Feature Specification: system-speckit Spec-Kit Subsystem Track

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-07 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | none (track root) |
| **Parent Packet** | none (track root) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `system-speckit` spec-kit subsystem owns a long lineage of spec folders — the graph/context and memory-search optimization research, phased-spec preference, the Rust-backend rewrite research, vitest invariance maintenance, the memory command surface, the spec-mutation gate, the `/speckit:phase` merge, spec-kit UX upgrades and adoptions, the coco-index integration research, the auto-mode contract, sub-phase recatalog, base-file renumbering, and the speckit command-family rename — but many of them lived in the shared `skilled-agent-orchestration` top-level rather than under this subsystem track. A reader opening `system-speckit` saw only the most recent packets, not the subsystem's full history.

### Purpose
One track holds every system-speckit-scoped spec folder, numbered in true chronological order (by creation date), so the spec-kit subsystem reads as one coherent history. The parent routes to its child phase folders; each child owns its own plan, tasks, checklist, decisions, and continuity.

> **Phase-parent note:** This spec.md is the ONLY authored document at this parent level. All detailed planning lives in the child phase folders listed in the Phase Documentation Map below. The migration record lives in `context-index.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root-level routing for the child phase folders.
- Chronological phase-documentation map.

### Out of Scope
- Rewriting child folders beyond identity metadata and path references.
- Cross-track references left in other tracks or skills (see `context-index.md`).

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `spec.md` | Create | this | Root purpose and child map |
| `description.json`, `graph-metadata.json` | Refresh | this | Search metadata for the parent |
| `context-index.md` | Create | this | Migration bridge and renumber record |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each child below is an independently executable phase folder owning its own plan, tasks, checklist, decisions, and continuity. Numbered in true chronological order (earliest first).

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-cmd-memory-output/` | Memory command surface + dashboard visual design | Phase parent |
| 002 | `002-graph-and-context-optimization/` | Graph and context optimization research | Phase parent |
| 003 | `003-xce-research-based-refinement/` | XCE research-based refinement | Phase parent |
| 004 | `004-memory-search-intelligence/` | Memory-search intelligence | Phase parent |
| 005 | `005-rust-backend-rewrite-research/` | Rust-backend rewrite research | Phase parent |
| 006 | `006-spec-gate-enforce-readiness/` | Spec-mutation gate enforce-readiness fixes | Phase parent |
| 007 | `007-phased-spec-preference/` | Phased-spec preference | Phase parent |
| 008 | `008-vitest-invariance-maintenance/` | Vitest invariance maintenance | Phase parent |
| 009 | `009-cmd-merge-spec-kit-phase/` | `/speckit:phase` merge workflow | Phase parent |
| 010 | `010-cmd-spec-kit-ux-upgrade/` | Spec-kit UX upgrade | Phase parent |
| 011 | `011-spec-kit-ux-adoptions/` | Spec-kit UX adoptions (SPAR-Kit findings) | Phase parent |
| 012 | `012-spec-kit-coco-sk-code-research/` | Spec-kit + coco-index + sk-code integration research | Phase parent |
| 013 | `013-spec-kit-auto-mode-noninteractive-contract/` | Auto-mode non-interactive contract | Phase parent |
| 014 | `014-subphase-recatalog-and-archive/` | Sub-phase recatalog and archive | Phase parent |
| 015 | `015-base-files-renumbering-name-cleanup/` | Base-files renumbering and name cleanup | Phase parent |
| 016 | `016-cmd-speckit-family-rename/` | Speckit command-family rename | Phase parent |
| z_archive | `z_archive/` | Archived spec-kit history | Archive |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently.
- Run `validate.sh --recursive` on this folder to validate all phases as a unit.
- Use `/speckit:resume system-speckit/[NNN-phase]/` to resume a specific phase.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| `001-cmd-memory-output` | `016-cmd-speckit-family-rename` | Each phase ships and validates independently | Per-phase strict validation evidence |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None open. The track-assembly scope and chronological numbering are recorded in `context-index.md`; cross-track references to old paths are left stale per the scoped-repair rule pending a future reindex.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Migration record**: `context-index.md`
- **Graph metadata**: `graph-metadata.json`
