---
title: "Feature Specification: Phase 11 — Plugin installation (health-md) into all vaults"
description: "Install health-md (a true Obsidian community plugin) file-layer into all three vaults and enable it."
trigger_phrases:
  - "health-md install"
  - "obsidian plugin installation vaults"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/011-plugin-installation"
    last_updated_at: "2026-08-03T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 11 spec"
    next_safe_action: "Install health-md assets into all three vaults and enable it"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/011-plugin-installation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Phase 11 — Plugin installation (health-md) into all vaults

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-08-03 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` (013-mcp-obsidian) |
| **Parent Packet** | `mcp-tooling/013-mcp-obsidian` |
| **Predecessor** | `010-playbook-validation` |
| **Successor** | `012-skill-support-extension` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The user wants [health-md](https://community.obsidian.md/plugins/health-md) — an Apple Health visualization plugin — installed for Obsidian across all available vaults, with the `mcp-obsidian` mode supporting it afterwards. health-md is a genuine Obsidian community plugin, installable at the vault file layer.

### Purpose
Get health-md installed and enabled in every vault that can run it, ready for the file-layer knowledge Phase 12 ships in the mode.

**End goal:** every vault on this machine lists `health-md` among its enabled community plugins with release assets on disk; the phase record documents exactly what runs where and why.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Discover all Obsidian vaults on this machine (registry + on-disk check).
- Install `health-md` release assets (`main.js`, `manifest.json`, `styles.css` v2.1.0) into `.obsidian/plugins/health-md/` of every vault.
- Enable `health-md` in each vault's `.obsidian/community-plugins.json`, preserving existing entries.
- Verify installs: manifest version, asset sizes, JSON validity of the enablement list, Obsidian app version vs `minAppVersion`.
- Record per-vault inventory before/after in the implementation summary.

### Out of Scope
- Authoring `mcp-obsidian` skill references for health-md (Phase 12).
- Health data import into any vault (user's data, not tooling).
- Touching other plugins' install state.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `<vault>/.obsidian/plugins/health-md/{main.js,manifest.json,styles.css}` (×3 vaults) | Create | health-md v2.1.0 release assets |
| `<vault>/.obsidian/community-plugins.json` (×3 vaults) | Modify | Append `health-md` to the enabled list |
| `011-plugin-installation/{plan,tasks,implementation-summary}.md` | Create | Phase record |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | health-md release assets present in every vault's plugin dir | `manifest.json` says version 2.1.0, `main.js` + `styles.css` non-empty, in all 3 vaults |
| REQ-002 | `health-md` appended to the enabled-plugins list in every vault | `community-plugins.json` parses as JSON and contains `health-md`; prior entries unchanged |
| REQ-003 | App version compatibility confirmed | Obsidian app ≥ `minAppVersion` 1.12.0 (installed: 1.13.4) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Vault inventory captured | Before/after plugin lists recorded per vault in the implementation summary |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `ls <vault>/.obsidian/plugins/health-md/` shows the three release files in all 3 vaults.
- **SC-002**: Each `community-plugins.json` is valid JSON with `health-md` enabled and prior entries intact.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | GitHub release availability (CodyBontecou/health-md-visualizations) | Cannot fetch assets | Verify via GitHub API before downloading; pinned to tag 2.1.0 |
| Risk | iCloud vault sync races | Half-written plugin dir on the iCloud vault | Write all three files before enabling; verify after |
| Dependency | Obsidian app version | Plugin refuses to load below 1.12.0 | Confirmed 1.13.4 installed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should health-md's default `Health/` data folder be created per vault? (Default: no — the plugin creates data folders on first render; creating empty folders adds nothing.)

<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
