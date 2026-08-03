---
title: "Feature Specification: Phase 13 — Iconic plugin integration into mcp-obsidian"
description: "Integrate the Iconic icon-customization plugin (gfxholo/iconic, v1.1.10) and its auto-icon rulebook into the mcp-obsidian skill: per-plugin references, router updates, feature-catalog + playbook entries, asset, changelog."
trigger_phrases:
  - "mcp-obsidian iconic support"
  - "iconic plugin file layer"
  - "iconic rulebook integration"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/013-iconic-integration"
    last_updated_at: "2026-08-03T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 13 spec"
    next_safe_action: "Author the Iconic reference set and wire it into the mode"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/013-iconic-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Phase 13 — Iconic plugin integration into mcp-obsidian

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
| **Predecessor** | `012-skill-support-extension` |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The user's vaults run the **Iconic** plugin (repo `gfxholo/iconic`, v1.1.10 — icon/color customization for tabs, files, folders, bookmarks, tags, properties, ribbon) with a pre-built auto-icon rulebook (21 file rules by extension + 11 folder rules by name) already applied and enabled in all three vaults. The `mcp-obsidian` mode knows nothing about it: an agent asked to "give PDFs a red icon" or "why is the attachments folder blue" has no contract for Iconic's `data.json` rulebook. The mode's per-plugin pattern (beancount-finance, obsidian-tables, obsidian42-brat, health-md) proves the file-layer approach; Iconic fits the same mold — its entire configuration is one JSON file.

### Purpose
Integrate Iconic into the `mcp-obsidian` mode as the fifth plugin reference set: where it keeps its state, the exact rulebook schema, safe-merge discipline (the bundle's `merge_rules.py` pattern), and what must be left to the app. Ships as references, router updates, a feature-catalog + playbook entry, an asset, and a changelog entry.

**End goal:** `mcp-obsidian` at v1.3.0.0 answers icon/rulebook requests with correct `data.json` operations — with backup-before-merge discipline — mirroring the quality of the existing plugin references.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `references/plugins/iconic/`: index, data-model, workflows, troubleshooting (mirrors the obsidian-tables layout).
- `references/plugins/plugin-operation-logic.md`: extend the plugin data map from 4 to 5 rows.
- `SKILL.md`: activation triggers, on-demand resource list, version bump to 1.3.0.0.
- `feature-catalog/plugins/iconic.md`.
- `manual-testing-playbook/plugin-tie-ins/iconic-rules.md` (OBS-015) + playbook index update.
- `assets/plugins/iconic/` example rulebook excerpt.
- `changelog/v1.3.0.0.md`.

### Out of Scope
- Installing/enabling Iconic in vaults (already present in all 3 vaults at v1.1.10 with the rulebook applied — verified; no-op).
- The icon *rendering* itself (in-app; the mode edits `data.json`).
- The Iconic-Setup bundle's distribution mechanics beyond what the skill references document (install/merge pattern recorded in workflows).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/iconic/**` | Create | 4 files (index, data-model, workflows, troubleshooting) |
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/plugin-operation-logic.md` | Modify | Data map 4 → 5 plugins |
| `.opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md` | Modify | Triggers, resource list, version 1.3.0.0 |
| `.opencode/skills/mcp-tooling/mcp-obsidian/feature-catalog/plugins/iconic.md` | Create | Feature catalog card |
| `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/plugin-tie-ins/iconic-rules.md` | Create | Playbook scenario (OBS-015) |
| `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/manual-testing-playbook.md` | Modify | Index new scenario |
| `.opencode/skills/mcp-tooling/mcp-obsidian/assets/plugins/iconic/**` | Create | Example rulebook excerpt |
| `.opencode/skills/mcp-tooling/mcp-obsidian/changelog/v1.3.0.0.md` | Create | Changelog entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Iconic reference set authored | `references/plugins/iconic/` has index + data-model + workflows + troubleshooting; data-model documents `data.json` (visibility toggles, color pickers, per-item icon maps, `fileRules`/`folderRules` schema, backup settings) and the safe-merge rule (backup before write, preserve unrelated settings, never downgrade) |
| REQ-002 | Router + skill doc updated | SKILL.md lists the Iconic reference set on demand, adds activation trigger phrases, and bumps to v1.3.0.0; plugin-operation-logic data map covers all 5 plugins |
| REQ-003 | Catalog + playbook entries exist | feature-catalog card + playbook scenario (OBS-015), indexed in the playbook root doc |
| REQ-004 | Example + changelog shipped | `assets/plugins/iconic/` carries a valid example rulebook excerpt; `changelog/v1.3.0.0.md` written |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | No regression on existing docs | `validate.sh` passes on the phase and the mode package docs; existing plugin references untouched except the data-map table |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An agent loading the mode can add/edit/disable Iconic rules and toggles from the references alone, with a backup taken before every write.
- **SC-002**: SKILL.md routing mentions Iconic with correct load-on-demand pointers.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `data.json` corruption wipes the user's icon setup | Broken icons + lost rules | Mandatory backup before merge (documented in workflows); re-run discipline |
| Risk | Overwriting user-customized rules | User icon choices lost | Merge, never replace: only the requested rule/setting changes; preserve unrelated keys |
| Risk | Doc drift from the 010 validation findings | Conflicting guidance | Reuse the validated obsidian-tables layout; run validate.sh after authoring |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.

<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
