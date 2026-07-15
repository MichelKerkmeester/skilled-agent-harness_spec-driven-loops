---
title: "Feature Specification: sk-doc Documentation-Authoring Track"
description: "The canonical home for the sk-doc documentation-authoring skill family: create-* command/skill/readme/changelog/feature-catalog/manual-testing-playbook authoring, description trims, README/anchor standardization, hub-doc conformance, benchmark-authoring centralization, router alignment, the hyphen-naming convention, and the create-diff preview."
trigger_phrases:
  - "sk-doc track"
  - "documentation authoring skill family"
  - "create-skill create-readme create-command"
  - "sk-doc spec history"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Track root spec.md authored for the sk-doc track assembly"
    next_safe_action: "Resume any child phase folder independently"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-07-15-sk-doc-track"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT -->

# Feature Specification: sk-doc Documentation-Authoring Track

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-02-17 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | none (track root) |
| **Parent Packet** | none (track root) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `sk-doc` documentation-authoring skill owns a long lineage of spec folders — the `create-*` authoring generators, the command/skill description trims, the README/anchor standardization passes, hub-doc conformance, benchmark-authoring centralization, router alignment, and the hyphen-naming convention — but most of them lived in the shared `skilled-agent-orchestration` top-level rather than under a single skill-scoped track. A reader opening `sk-doc` saw only the four most recent packets, not the subsystem's full history.

### Purpose
One track holds every sk-doc-scoped spec folder, numbered in true chronological order (by creation date), so the documentation-authoring subsystem reads as one coherent history. The parent routes to its child phase folders; each child owns its own plan, tasks, checklist, decisions, and continuity.

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
| 001 | `001-cmd-create-emoji-enforcement/` | Emoji-enforcement pass for the create-command authoring flow | Phase parent |
| 002 | `002-cmd-create-codex-compatibility/` | Codex compatibility for the create-command flow | Phase parent |
| 003 | `003-cmd-create-changelog/` | create-changelog authoring command | Phase parent |
| 004 | `004-cmd-create-skill-merger/` | create-skill merger workflow | Phase parent |
| 005 | `005-cmd-create-readme-install-merger/` | create-readme + install-guide merger | Phase parent |
| 006 | `006-cmd-create-feature-catalog/` | create-feature-catalog authoring package | Phase parent |
| 007 | `007-cmd-create-manual-testing-playbook/` | create-manual-testing-playbook authoring package | Phase parent |
| 008 | `008-skill-command-readme-rewrite/` | Skill + command README rewrite | Phase parent |
| 009 | `009-cmd-create-changelog-and-releases/` | create-changelog + releases authoring | Phase parent |
| 010 | `010-command-description-trim/` | Command-description budget trim | Phase parent |
| 011 | `011-skill-anchor-toc-removal/` | Skill anchor + table-of-contents removal | Phase parent |
| 012 | `012-feature-catalog-template-improvements/` | Feature-catalog template improvements | Phase parent |
| 013 | `013-catalog-playbook-snippet-denumbering/` | Catalog + playbook snippet denumbering | Phase parent |
| 014 | `014-skill-readme-standardization/` | Skill README standardization | Phase parent |
| 015 | `015-sk-doc-parent/` | sk-doc parent-hub build | Phase parent |
| 016 | `016-hub-doc-conformance-fixes/` | Hub-doc conformance fixes | Phase parent |
| 017 | `017-benchmark-authoring-centralization/` | Benchmark-authoring centralization | Phase parent |
| 018 | `018-sk-doc-router-alignment/` | sk-doc router alignment | Phase parent |
| 019 | `019-hyphen-naming-convention/` | Hyphen-naming convention program | Phase parent |
| 999 | `999-create-diff-mode/` | create-diff mode preview (engine pending) | Phase parent |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently.
- Run `validate.sh --recursive` on this folder to validate all phases as a unit.
- Use `/speckit:resume sk-doc/[NNN-phase]/` to resume a specific phase.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| `001-cmd-create-emoji-enforcement` | `019-hyphen-naming-convention` | Each phase ships and validates independently | Per-phase strict validation evidence |
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
