---
title: "Plugin assets, catalog cards, and playbook scenarios for the six additions"
description: "Author example assets, six feature-catalog plugin cards, and manual-testing-playbook tie-in scenarios for charts, dataview, excalidraw, git, outliner, Minimal."
trigger_phrases:
  - "plugin assets catalog playbook"
  - "charts dataview excalidraw git outliner minimal catalog"
  - "plugin tie in scenarios"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/023-plugin-assets-catalog-playbook"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author phase documentation"
    next_safe_action: "Execute the phase work"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/023-plugin-assets-catalog-playbook"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Plugin assets, catalog cards, and playbook scenarios for the six additions

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-08-04 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` (013-mcp-obsidian) |
| **Parent Packet** | `mcp-tooling/013-mcp-obsidian` |
| **Predecessor** | `021-plugin-installation-batch` (or sibling ordering per phase map) |
| **Successor** | See phase map |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The mode now ships six more community artifacts (five plugins and the Minimal theme) whose file layers are not yet documented, cataloged, or routed.

### Purpose

Author copyable example assets under `assets/plugins/{charts,dataview,excalidraw,git,outliner,minimal}/` (charts block example, dataview query example, excalidraw `.excalidraw.md` skeleton, obsidian-git config example, outliner list example, Minimal snippet example), add six feature-catalog plugin cards under `feature-catalog/plugins/` with canonical taxonomy types, add manual-testing-playbook tie-in scenarios (OBS-016..OBS-021) under `manual-testing-playbook/plugin-tie-ins/`, update the root catalog counts and the README plugin knowledge layer, and write the changelog entry.

---

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

Author copyable example assets under `assets/plugins/{charts,dataview,excalidraw,git,outliner,minimal}/` (charts block example, dataview query example, excalidraw `.excalidraw.md` skeleton, obsidian-git config example, outliner list example, Minimal snippet example), add six feature-catalog plugin cards under `feature-catalog/plugins/` with canonical taxonomy types, add manual-testing-playbook tie-in scenarios (OBS-016..OBS-021) under `manual-testing-playbook/plugin-tie-ins/`, update the root catalog counts and the README plugin knowledge layer, and write the changelog entry.

### Out of Scope

- Changes to other skills or hub files outside the mcp-obsidian mode (except the mcp-tooling leaf manifest regeneration in the routing phase).
- Vault content beyond the installed plugin files.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Listed in the phase tasks and checklist; all changes stay inside the `mcp-obsidian` mode tree plus phase docs | Author/Modify | Per the phase focus above |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Six asset sets authored | Each plugin has at least one copyable example asset under `assets/plugins/<plugin>/` |
| REQ-002 | Six catalog cards added | `feature-catalog/plugins/` gains six cards with canonical validation types; root counts updated |
| REQ-003 | Playbook scenarios added | Six tie-in scenarios exist with catalog links resolving |
| REQ-004 | Catalog package validates | `validate_catalog_package.py --package mcp-tooling/mcp-obsidian` passes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Phase docs and metadata stay in sync | Tasks and checklist carry evidence; description.json and graph-metadata.json regenerated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The phase's artifacts land and pass their stated gates.
- **SC-002**: The six additions behave as documented in at least one live or fixture-backed check.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 021-023 complete before 024 | Router points at missing docs | Ordering enforced by the phase map and handoff criteria |
| Risk | Unverifiable plugin details | Invented claims | `VERIFY` markers instead of guesses |
| Risk | Real vaults mutated during validation | Data loss | Throwaway-vault discipline (`_pbtest-`) only |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->