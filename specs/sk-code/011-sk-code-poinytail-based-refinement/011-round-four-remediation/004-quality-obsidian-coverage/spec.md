---
title: "Feature Specification: Phase 4: quality-obsidian-coverage"
description: "The sk-code quality mode maps checklists for Webflow and OpenCode targets only, so an Obsidian plugin change reaches the gate with nothing to load, and eight surface lists in its SKILL.md and README leave sk-code-obsidian out."
trigger_phrases:
  - "quality obsidian coverage"
  - "phase 4 quality obsidian coverage"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: quality-obsidian-coverage

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `scaffold/004-quality-obsidian-coverage` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 7 |
| **Predecessor** | 003-hub-surface-precedence |
| **Successor** | 005-doc-claims-hardening |
| **Handoff Criteria** | The quality target-path map has four Obsidian rows whose checklists exist, and no surface list in the quality packet omits `sk-code-obsidian` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Round four children specification.

**Scope Boundary**: Obsidian coverage in the `sk-code-quality` packet only: its `SKILL.md`, its `README.md` and one new changelog file.

**Dependencies**:
- Decision D2 and the handoff note in `../../010-round-three-remediation/003-quality-mode/plan.md` section 3, and Known Limitation 3 in that child's `implementation-summary.md`
- The OBSIDIAN surface markers in `.skilled/skills/sk-code/shared/references/stack-detection.md` section 2 and the `CODE_QUALITY` asset list in `.skilled/skills/sk-code/sk-code-obsidian/SKILL.md` section 2b (read only)

**Deliverables**:
- Four Obsidian rows in the quality Target-Path Checklist Map, plus the matching detection branch, loading row, workflow step, resource domain, success criterion and references
- `sk-code-obsidian` named in the eight surface lists
- Version 1.2.0.0 in `SKILL.md` and `README.md`, and `changelog/v1.2.0.0.md`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `sk-code` hub detects three surfaces, WEBFLOW, OPENCODE and OBSIDIAN, but the quality mode's Target-Path Checklist Map (`.skilled/skills/sk-code/sk-code-quality/SKILL.md` lines 116 to 124) has rows for OpenCode and Webflow targets only. An Obsidian plugin change reaches the gate with no checklist to load. Six `SKILL.md` lines (15, 36, 47, 182, 188, 280) and two README lines (58, 107) list `sk-code-webflow` and `sk-code-opencode` without `sk-code-obsidian`. Round three left those lists alone because naming Obsidian there would claim coverage the map did not define.

### Purpose
The quality mode routes every Obsidian plugin target to a checklist that exists, and then names `sk-code-obsidian` wherever it lists the surfaces it serves.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Four Obsidian rows in the Target-Path Checklist Map, sending plugin source, folders that cross the paired-docs threshold, `.db-*` class renames and screenshot fixtures to the four `CODE_QUALITY` checklists that `sk-code-obsidian` ships
- The same coverage in the detection tree, the loading-level table, the resource domains, workflow step 3, the evidence envelope's `resolved_surface` values, the success criteria and the references list of `SKILL.md`
- `sk-code-obsidian` added to the six `SKILL.md` and two README surface lists, and Obsidian rows or sentences in the README's Works-on row, checklist router, Quick Start, Target-Path Routing prose and Related Documents
- A minor version bump to 1.2.0.0 in `SKILL.md` and `README.md`, and a new compact changelog file

### Out of Scope
- Hub files (`.skilled/skills/sk-code/SKILL.md`, `ROUTER.md`, `hub-router.json`, `mode-registry.json`, `leaf-manifest.json`, `shared/`) - child 003 owns them, and the quality target-path map is prose in this packet, so no hub edit is needed
- The `sk-code-obsidian` packet itself - its checklists already exist and are only linked
- The Hermes copy, compiled-route re-mint and leaf-manifest refresh - orchestrator-owned steps
- `scripts/`, `assets/`, `manual-testing-playbook/` and `benchmark/` of the quality packet - no Obsidian claim needs to change there

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-quality/SKILL.md` | Modify | Version 1.2.0.0, four Obsidian map rows, Obsidian routing and loading lines, six surface lists |
| `.skilled/skills/sk-code/sk-code-quality/README.md` | Modify | Version 1.2.0.0, Obsidian router row and routing prose, two surface lists, Obsidian related-documents row |
| `.skilled/skills/sk-code/sk-code-quality/changelog/v1.2.0.0.md` | Create | Compact changelog entry for the release |
| `.skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md` | Modify | Scope amendment, handoff from child 005: three link labels name their targets |
| `.skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/verification-quick-reference-and-related.md` | Modify | Scope amendment, handoff from child 005: three link labels name their targets |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Obsidian rows in the target-path map | `SKILL.md` has exactly four map rows starting `\| Obsidian plugin `, every `../sk-code-obsidian/assets/*.md` path in `SKILL.md` and `README.md` exists, and the set equals the `CODE_QUALITY` asset list in `sk-code-obsidian/SKILL.md` |
| REQ-002 | Every surface list names Obsidian | All eight lines that name `sk-code-webflow` in `SKILL.md` and `README.md` also name `sk-code-obsidian` |
| REQ-003 | Version and changelog agree | `SKILL.md`, `README.md` and `changelog/v1.2.0.0.md` each carry `version: 1.2.0.0`, and the changelog validates with 0 issues and 0 hvr hard blockers |
| REQ-004 | Packet validators and routing guards stay green | `validate_document.py` passes `SKILL.md` and `README.md` with 0 issues, `package_skill.py --check --strict` prints `Result: PASS`, the `SKILL.md` hvr hard-blocker count stays 14, `verify_router_sync.cjs --checks 1a,1b,2,3,4` passes 5/5 and `verify_doc_claims.cjs` passes every check |
| REQ-005 | Only the planned files change | `git status --porcelain` over the quality packet and its Hermes copy shows only `SKILL.md`, `README.md` and the new changelog |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The rest of the mode loads Obsidian checklists | The detection tree, the loading-level table, workflow step 3, the envelope's `resolved_surface` and the success criteria each carry one Obsidian line |
| REQ-007 | Scripts unchanged and their tests pass | The three `*.test.sh` files print the same closing lines as before, and `git status --porcelain` over `scripts/` is empty |
| REQ-008 | Links resolve | `check-markdown-links.cjs` reports `0 broken` |
| REQ-009 | Hermes drift recorded, not repaired | `.hermes/skills/sk-code-quality` is untouched, and `sync-skills-hermes.cjs --check` names `sk-code-quality` as drift for the orchestrator |
| REQ-010 | Compiled and leaf manifests stay fresh | The four routing-manifest checks print the same results as the Phase 1 baseline, or a stale result is traced to a sibling's hub file |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An Obsidian plugin target reaches the quality gate with a checklist to load, and every checklist path the packet names resolves on disk
- **SC-002**: No list of surfaces in the quality packet omits `sk-code-obsidian`
- **SC-003**: No validator or routing gate result gets worse than its Phase 1 baseline because of this change
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Child 005 changes `verify_doc_claims.cjs` in parallel | Med | The check expects every check to pass, not a fixed count |
| Dependency | Child 003 edits hub files and `stack-detection.md` in parallel | Med | The new text cites section 2 by number only, and REQ-010 traces a stale manifest to a changed hub file before calling it a failure |
| Risk | The new surface lists claim Obsidian implements files, while all three surface packets are read-only evidence | Low | `mode-registry.json` gives Webflow, OpenCode and Obsidian the same `surface` kind, so the wording treats them alike |
| Risk | New prose adds an em dash or semicolon | Low | Every Replace block is quoted in `plan.md` and the hvr count is checked |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. The bump level, the four checklists and the envelope value are decided in `plan.md` decisions D1 to D4.
<!-- /ANCHOR:questions -->

---
