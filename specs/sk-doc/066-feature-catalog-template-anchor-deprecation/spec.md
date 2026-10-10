---
title: "Feature Specification: Feature catalog template-anchor deprecation"
description: "Retire the template-name HTML comment that the feature catalog mode stamped under every catalog heading, at its source and in every existing catalog."
trigger_phrases:
  - "feature catalog template anchor deprecation phase parent spec"
  - "sk-doc-template skill_asset_feature_catalog"
  - "feature catalog template marker removal"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/066-feature-catalog-template-anchor-deprecation"
    last_updated_at: "2026-10-10T19:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Closed both phases"
    next_safe_action: "None, the packet is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "t4-feature-catalog-anchor"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Feature catalog template-anchor deprecation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `worktrees/096-feature-catalog-anchor-deprecation` |
| **Parent Spec** | None |
| **Parent Packet** | sk-doc/066-feature-catalog-template-anchor-deprecation |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | No feature catalog file or catalog template in the repository carries the template-name comment |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Every feature catalog document opens with a template-name HTML comment under its H1, `<!-- sk-doc-template: skill_asset_feature_catalog -->`, and 19 older files carry a hyphenated spelling of it. The comment comes from the per-feature scaffold of the create-feature-catalog mode. No validator, router, script or test reads it, and no other create-* mode template emits such a marker, so it is dead weight copied into every new catalog file.

### Purpose
Remove the comment at its producer so new catalogs never get it, then remove every existing copy from the repository's feature catalogs, leaving every catalog validating exactly as before.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The create-feature-catalog scaffolds, checklist and worked examples.
- Every feature catalog file under `.skilled/` that carries either spelling of the comment.
- A version bump and changelog entry for each skill or mode whose shipped files change, plus the derived copies and indexes that follow.

### Out of Scope
- Other `sk-doc-template:` comments on non-catalog documents, which no template emits.
- Historical spec packets under `specs/`, which record past work.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/skills/sk-doc/sk-create-feature-catalog/` | Modify | 001-source-deprecation | Scaffolds, checklist, examples, version |
| `.skilled/skills/**/feature-catalog/**/*.md` | Modify | 002-retroactive-removal | Remove the comment from every catalog file |
| Owning skills' `SKILL.md` and `changelog/` | Modify, Create | 002-retroactive-removal | Version bumps and entries |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-source-deprecation/ | Stop the mode from emitting the comment | Complete |
| 2 | 002-retroactive-removal/ | Remove every existing copy and version the owning skills | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-source-deprecation | 002-retroactive-removal | The mode no longer contains the comment | `grep -rn 'sk-doc-template' <mode> --exclude-dir=changelog` prints nothing |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Goal**: See `goal.md` for the durable directive and binding table
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
