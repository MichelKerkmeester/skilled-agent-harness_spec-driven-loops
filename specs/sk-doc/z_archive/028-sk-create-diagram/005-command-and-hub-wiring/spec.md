---
title: "Feature Specification: sk-create-diagram command and hub wiring"
description: "Register the /create:diagram command and wire sk-create-diagram into the sk-doc hub's mode-registry.json, hub-router.json, and command-metadata.json."
trigger_phrases:
  - "create:diagram command"
  - "sk-create-diagram hub registration"
  - "mode-registry hub-router wiring"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/005-command-and-hub-wiring"
    last_updated_at: "2026-08-12T06:52:26.000Z"
    last_updated_by: "claude"
    recent_action: "Authored phase spec ahead of orchestrator-direct authoring"
    next_safe_action: "Author this phase once phases 002-004 land, orchestrator-direct (not dispatched)"
    blockers:
      - "Depends on phases 002-004 producing a complete, working packet"
    key_files:
      - "spec.md"
      - "../001-inventory-and-skill-contract/decision-record.md"
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

# Feature Specification: sk-create-diagram command and hub wiring

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-12 |
| **Branch** | `sk-doc/0145-sk-create-diagram` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 5 of 6 |
| **Predecessor** | `../003-diagram-type-reference-library/spec.md`, `../004-import-export-tooling/spec.md` |
| **Successor** | `../006-validation-and-quality-gate/spec.md` |
| **Handoff Criteria** | `/create:diagram` resolves through the router, `mode-registry.json`/`hub-router.json`/`command-metadata.json` all reference `sk-create-diagram` consistently, and `sk-doc`'s own `leaf-manifest.json` is regenerated |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## PHASE CONTEXT

**Scope Boundary**: Shared `sk-doc` hub files (`mode-registry.json`, `hub-router.json`, `command-metadata.json`) plus the new `/create:diagram` command files under `.opencode/commands/create/`, plus `sk-create-diagram`'s own `README.md`/`changelog/v1.0.0.0.md` full content. Orchestrator-authored directly — these are shared hub files with wider blast radius than a single packet, matching the `sk-code`/`sk-design`/`sk-doc` risk profile called out in `cli-opencode`'s destructive-scope-violation history.

**Dependencies**: Phases 002-004 produce a complete, self-consistent packet.

**Deliverables**: See §3 Files to Change.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The packet exists on disk but is invisible to the advisor and unreachable by any command — `sk-doc` doesn't know it exists.

### Purpose

Register `sk-create-diagram` as a mode in the `sk-doc` hub, wire `/create:diagram` through the router+presentation+auto/confirm-YAML pattern every sibling command uses, and finish the packet's own `README.md`/changelog now that its full content exists.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add one `modes[]` entry to `.opencode/skills/sk-doc/mode-registry.json` (`workflowMode: sk-create-diagram`, `packetKind: workflow`, `backendKind: template-scaffold`, matching `toolSurface` to every sibling, `command: /create:diagram`).
- Add `routerSignals["sk-create-diagram"]` and a `create-diagram-aliases` `vocabularyClasses` entry to `.opencode/skills/sk-doc/hub-router.json`, and add `sk-create-diagram` to `routerPolicy.tieBreak`.
- Add one entry to `.opencode/skills/sk-doc/command-metadata.json` for `/create:diagram` (choreography pointing at `sk-doc/SKILL.md` then `sk-create-diagram/SKILL.md`).
- Create `.opencode/commands/create/diagram.md` (thin router) plus `.opencode/commands/create/assets/create-diagram-presentation.txt`, `create-diagram-auto.yaml`, `create-diagram-confirm.yaml`, mirroring `.opencode/commands/create/diff.md`'s pattern.
- Author `sk-create-diagram/README.md` from `skill-readme-template.md` and `sk-create-diagram/changelog/v1.0.0.0.md`.
- Regenerate `sk-doc`'s own `leaf-manifest.json` so the hub's addressable resources include the new packet.
- One optional line added to `sk-create-flowchart/SKILL.md`'s "When NOT to Use" pointing at `sk-create-diagram` (resolves the phase-parent's third open question).

### Out of Scope

- Any change to the new packet's own content (frozen from phases 002-004).
- Any change to a sibling packet beyond the one optional cross-reference line.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/sk-doc/mode-registry.json` | Modify | Add `sk-create-diagram` mode entry |
| `.opencode/skills/sk-doc/hub-router.json` | Modify | Add router signal + vocabulary class + tieBreak entry |
| `.opencode/skills/sk-doc/command-metadata.json` | Modify | Add `/create:diagram` entry |
| `.opencode/commands/create/diagram.md` | Create | Thin router |
| `.opencode/commands/create/assets/create-diagram-presentation.txt` | Create | Presentation contract |
| `.opencode/commands/create/assets/create-diagram-auto.yaml` | Create | Auto workflow |
| `.opencode/commands/create/assets/create-diagram-confirm.yaml` | Create | Confirm workflow |
| `.opencode/skills/sk-doc/sk-create-diagram/README.md` | Modify | Full README content replacing the phase 002 stub |
| `.opencode/skills/sk-doc/sk-create-diagram/changelog/v1.0.0.0.md` | Modify | Full changelog entry replacing the phase 002 stub |
| `.opencode/skills/sk-doc/leaf-manifest.json` | Regenerate | Includes the new packet's resources |
| `.opencode/skills/sk-doc/sk-create-flowchart/SKILL.md` | Modify | One line pointing SVG/HTML requests at `sk-create-diagram` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `mode-registry.json` entry is schema-consistent with every sibling mode. | `folder == packetSkillName`, `grandfatheredFolderMismatch: false`, `toolSurface` matches the fleet-wide shape. |
| REQ-002 | `hub-router.json`'s `routerSignals` key matches the registry's `workflowMode` exactly, and `tieBreak` lists it once. | Cross-checked against `parent-hub-router-schema.md`. |
| REQ-003 | `/create:diagram` resolves through the router to the correct presentation/auto/confirm assets. | Manual trace of `diagram.md`'s EXECUTION TARGETS table. |
| REQ-004 | `command-metadata.json` entry's `ownerMode` exists in the registry and its choreography resources resolve on disk. | Verified against `command-metadata-schema.cjs`'s core schema. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Advisor smoke test recommends `sk-create-diagram` for a diagram-generation phrase. | `skill_graph_scan --trusted` then `advisor_recommend` returns the packet. |
| REQ-006 | `sk-create-flowchart`'s cross-reference addition is exactly one line, no restructuring. | Diff is minimal. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` reports `sk-doc` still class H clean after the addition.
- **SC-002**: `/create:diagram` is reachable and its router resolves without a missing-asset error.
- **SC-003**: Advisor discovery smoke test surfaces `sk-create-diagram` for a representative trigger phrase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Editing shared hub JSON files by hand introduces a schema drift that breaks every sibling mode's routing. | High | Orchestrator-direct authoring (not dispatched), diff reviewed against the existing 12-mode pattern before saving, `ci-skill-root-metadata.cjs` rerun after. |
| Risk | `leaf-manifest.json` regeneration silently drops an existing entry. | Medium | Diff the regenerated file against its pre-change version; investigate any removed (not just added) entry. |
| Dependency | Phases 002-004 complete packet | High | Verified before this phase starts. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None — resolves the phase-parent's remaining open question directly (§3).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- Plan: `plan.md`
- Tasks: `tasks.md`
- Checklist: `checklist.md`
- Pattern reference: `.opencode/commands/create/diff.md`, `.opencode/skills/sk-doc/mode-registry.json`
