---
title: "Plugin installation batch — charts, dataview, excalidraw, git, outliner, Minimal"
description: "Install and enable six Obsidian community plugins plus the Minimal theme across all three vaults, with recorded versions."
trigger_phrases:
  - "plugin installation batch"
  - "charts dataview excalidraw git outliner minimal install"
  - "minimal theme install"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/021-plugin-installation-batch"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author phase documentation"
    next_safe_action: "Execute the phase work"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/021-plugin-installation-batch"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Plugin installation batch — charts, dataview, excalidraw, git, outliner, Minimal

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

Install the latest release of obsidian-charts (phibr0/obsidian-charts), dataview (blacksmithgu/obsidian-dataview), excalidraw (zsviczian/obsidian-excalidraw-plugin), obsidian-git (Vinzent03/obsidian-git), outliner (vslinko/obsidian-outliner) and the Minimal theme (kepano/obsidian-minimal) into all three vaults (main, iCloud Michel Kerkmeester, Barter): fetch release assets via the GitHub API, write plugin files under `<vault>/.obsidian/plugins/<id>/` and theme files under `<vault>/.obsidian/themes/Minimal/`, append plugin ids to `community-plugins.json`, set `cssTheme: Minimal` in `appearance.json`, and record every installed version as evidence for the reference phases.

---

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

Install the latest release of obsidian-charts (phibr0/obsidian-charts), dataview (blacksmithgu/obsidian-dataview), excalidraw (zsviczian/obsidian-excalidraw-plugin), obsidian-git (Vinzent03/obsidian-git), outliner (vslinko/obsidian-outliner) and the Minimal theme (kepano/obsidian-minimal) into all three vaults (main, iCloud Michel Kerkmeester, Barter): fetch release assets via the GitHub API, write plugin files under `<vault>/.obsidian/plugins/<id>/` and theme files under `<vault>/.obsidian/themes/Minimal/`, append plugin ids to `community-plugins.json`, set `cssTheme: Minimal` in `appearance.json`, and record every installed version as evidence for the reference phases.

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
| REQ-001 | All six artifacts install in all three vaults | `<vault>/.obsidian/plugins/<id>/main.js` and `manifest.json` exist for the five plugins; `<vault>/.obsidian/themes/Minimal/theme.css` exists |
| REQ-002 | Enablement is additive and reversible | `community-plugins.json` gains the five ids without losing existing entries; rollback removes only the new ids |
| REQ-003 | Theme activation preserves appearance.json | All pre-existing keys survive; only `cssTheme` is set |
| REQ-004 | Versions are recorded | Each installed `manifest.json` version is captured in phase evidence |

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