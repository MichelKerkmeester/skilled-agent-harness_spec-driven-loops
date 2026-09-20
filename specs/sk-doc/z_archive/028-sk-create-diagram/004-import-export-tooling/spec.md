---
title: "Feature Specification: sk-create-diagram import/export tooling"
description: "Port the draw.io and Mermaid extraction scripts and their reference guides, plus PNG/SVG export guidance, routed by natural language inside the one packet."
trigger_phrases:
  - "diagram import export tooling"
  - "drawio mermaid extraction port"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/004-import-export-tooling"
    last_updated_at: "2026-08-12T06:38:42.000Z"
    last_updated_by: "claude"
    recent_action: "Authored phase spec ahead of executor dispatch"
    next_safe_action: "Dispatch after phase 002 lands (independent of phase 003)"
    blockers:
      - "Depends on phase 002's SKILL.md and references/ folder existing"
    key_files:
      - "spec.md"
      - "../001-inventory-and-skill-contract/resource-map.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-create-diagram-fork"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: sk-create-diagram import/export tooling

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-12 |
| **Branch** | `sk-doc/0145-sk-create-diagram` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 4 of 6 |
| **Predecessor** | `../003-diagram-type-reference-library/spec.md` (numbering order; functionally this phase only depends on phase 002 — see PHASE CONTEXT) |
| **Successor** | `../005-command-and-hub-wiring/spec.md` |
| **Handoff Criteria** | Both extraction scripts run standalone, both import references and the export reference exist, and `SKILL.md` §11-12 route to them |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## PHASE CONTEXT

**Scope Boundary**: `scripts/drawio_extract.py`, `scripts/mermaid_extract.py`, `references/import-drawio.md`, `references/import-mermaid.md`, `references/export.md`, and the small `SKILL.md` §11-12 update wiring them in. Runs independently of phase 003 — both depend only on phase 002's scaffold, not on each other.

**Dependencies**: Phase 002's `SKILL.md` and `references/` folder.

**Deliverables**: See §3 Files to Change.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Generating diagrams from scratch is only half the source skill's value — redrawing an existing draw.io or Mermaid diagram at a chosen format/size/detail/audience is the other half, and neither the extraction tooling nor its routing exists yet in the ported packet.

### Purpose

Port both stdlib-only extraction scripts and their reference guides unchanged, and wire natural-language routing for "redraw this drawio/mermaid file" and "export this diagram" requests into `SKILL.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Copy `scripts/drawio_extract.py` and `scripts/mermaid_extract.py` unchanged (confirmed stdlib-only in phase 001).
- Port `references/import-drawio.md`, `references/import-mermaid.md`, `references/export.md` with full reference frontmatter.
- Update `SKILL.md` §11 (Importing) and §12 (Output/Export) to route by source extension to these references, per `decision-record.md` §3.

### Out of Scope

- The source's own verification scripts (`verify-drawio-import.py`, `verify-mermaid-import.py`) — those validate the source repo's CI, not this packet (phase 001 decision).
- Hub wiring / command registration (phase 005).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/sk-doc/sk-create-diagram/scripts/drawio_extract.py` | Create | Ported unchanged |
| `.opencode/skills/sk-doc/sk-create-diagram/scripts/mermaid_extract.py` | Create | Ported unchanged |
| `.opencode/skills/sk-doc/sk-create-diagram/references/import-drawio.md` | Create | Ported |
| `.opencode/skills/sk-doc/sk-create-diagram/references/import-mermaid.md` | Create | Ported |
| `.opencode/skills/sk-doc/sk-create-diagram/references/export.md` | Create | Ported |
| `.opencode/skills/sk-doc/sk-create-diagram/SKILL.md` | Modify | Import/export routing added |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Both scripts run standalone without error on `--help`. | `python3 scripts/drawio_extract.py --help` and `python3 scripts/mermaid_extract.py --help` both exit 0. |
| REQ-002 | Both scripts remain stdlib-only. | `grep -E '^import|^from'` shows no new third-party imports versus the phase 001 inventory. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | `SKILL.md` routes "redraw this .drawio file" and "redraw this Mermaid block" requests to the correct reference. | Manual trace through the SMART ROUTING / HOW IT WORKS sections. |
| REQ-004 | Export guidance states the format is manual-only, never automatic. | Ported `export.md` retains the source's "Export is manual" rule. |
| REQ-005 | No stale forward-reference to an unbuilt future phase survives in `SKILL.md` once this phase's files exist. | A repo-wide `grep` for "later phase" against `SKILL.md` returns zero matches after this phase. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both scripts execute their `--help` path successfully in the worktree.
- **SC-002**: `validate_skill_package.py --check` reports no hard failures for the added files.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Script ported with subtle transcription error breaks parsing. | Medium | REQ-001's `--help` smoke test catches import/syntax errors immediately. |
| Dependency | Phase 002 scaffold | High | Must land first. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- Plan: `plan.md`
- Tasks: `tasks.md`
- Checklist: `checklist.md`
- Source manifest: `../001-inventory-and-skill-contract/resource-map.md` §2
