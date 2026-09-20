---
title: "Phase 007: Excalidraw deprecation — remove the plugin's skill footprint"
description: "Deprecate Excalidraw: delete its reference tree, catalog entry, assets and manual-testing tie-in, and strip PLUGIN_EXCALIDRAW from the mcp-obsidian router (INTENT_SIGNALS, RESOURCE_MAP, PLUGINS aggregate, tuple, loading map, keyword/description, counts) plus README, FEATURE-CATALOG, plugin-operation-logic and the playbook. The plugin was uninstalled from the operator's vault."
trigger_phrases:
  - "015 excalidraw deprecation"
  - "remove excalidraw from obsidian skill"
  - "deprecate excalidraw plugin"
  - "excalidraw skill footprint removal"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/007-excalidraw-deprecation"
    last_updated_at: "2026-08-22T13:00:00Z"
    last_updated_by: "claude"
    recent_action: "removed the Excalidraw skill footprint (files + router wiring + narrative docs)"
    next_safe_action: "None — phase complete; the broader consolidation is 008"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-007-excalidraw-deprecation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Phase 007: Excalidraw deprecation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-22 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 7 |
| **Predecessor** | `006-plugin-docs-deep-research` |
| **Successor** | `009-apply-plugin-doc-recs` |
| **Handoff Criteria** | Every Excalidraw artifact removed from `mcp-obsidian` (reference tree, catalog entry, assets, manual-testing tie-in) and every wiring point stripped (`SKILL.md` router surfaces, README, FEATURE-CATALOG, plugin-operation-logic, the playbook); no residual `excalidraw` reference outside the historical changelogs and intentional deprecation notes; changed docs pass `validate_document.py`; `validate.sh --strict` Errors:0. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7**, a deprecation phase requested by the operator ("deprecate the Excalidraw plugin and its references in the obsidian skill — new phase"). Excalidraw was uninstalled from the operator's real vault in the same plugin-management session; this phase removes its footprint from the `mcp-obsidian` skill so the skill no longer documents or routes a plugin the vault no longer runs.

The parent packet is a phase parent; per lean-trio policy, all implementation detail lives here in the child. The broader Notion-Bases consolidation (Project Manager deprecation, Meta Bind reference, roster sync, calendar recipe) is the sibling phase `008-notion-bases-closeout`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `mcp-obsidian` skill carried a full Excalidraw integration (a four-file reference tree, a feature-catalog card, two assets, a manual-testing tie-in, and router wiring across `SKILL.md`, README, FEATURE-CATALOG, plugin-operation-logic and the playbook). The plugin was uninstalled from the vault, so the skill documents and routes a surface that no longer exists — a stale, misleading footprint.

### Purpose
Remove the entire Excalidraw footprint from the skill so its documentation and router reflect the real vault, leaving every count and cross-reference internally consistent.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Delete the Excalidraw reference tree (`references/plugins/excalidraw/`, 4 files), catalog entry (`feature-catalog/plugins/excalidraw.md`), assets (`assets/plugins/excalidraw/`, 2 files), and the manual-testing tie-in (`manual-testing-playbook/plugin-tie-ins/excalidraw-drawing-note.md`).
- Strip `PLUGIN_EXCALIDRAW` from `SKILL.md`: §2 resource-loading map, `INTENT_SIGNALS`, `RESOURCE_MAP`, the `specific_plugin_intents` tuple, the `PLUGINS` aggregate, the headline plugin list, the keyword comment, and the intent-count comment.
- Remove Excalidraw from `README.md`, `feature-catalog/FEATURE-CATALOG.md`, `references/plugins/plugin-operation-logic.md`, and `manual-testing-playbook/manual-testing-playbook.md` (scenario `OBS-018` and the summary row).

### Out of Scope
- Project Manager deprecation, Meta Bind reference authoring, roster sync, and the Notion Bases calendar recipe — all in `008-notion-bases-closeout`.
- Editing the historical changelogs (v0.10/v0.14/v0.20) that mention Excalidraw — they record what was true at those versions.
- The vault-side uninstall itself (executed in an earlier plugin-management session).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/excalidraw/*` (4) | Delete | Excalidraw reference tree |
| `.opencode/skills/mcp-tooling/mcp-obsidian/feature-catalog/plugins/excalidraw.md` | Delete | Catalog card |
| `.opencode/skills/mcp-tooling/mcp-obsidian/assets/plugins/excalidraw/*` (2) | Delete | Example assets |
| `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/plugin-tie-ins/excalidraw-drawing-note.md` | Delete | Manual-testing tie-in |
| `.opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md` | Edit | Strip all `PLUGIN_EXCALIDRAW` wiring; version bump handled in 008 |
| `.opencode/skills/mcp-tooling/mcp-obsidian/README.md` | Edit | Remove Excalidraw from lists and plugin-knowledge table |
| `.opencode/skills/mcp-tooling/mcp-obsidian/feature-catalog/FEATURE-CATALOG.md` | Edit | Remove the Excalidraw card |
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/plugin-operation-logic.md` | Edit | Remove the Excalidraw artifact row + list entry |
| `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/manual-testing-playbook.md` | Edit | Remove scenario `OBS-018`, its summary row, and the count |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every Excalidraw file deleted | The reference tree, catalog card, assets, and manual tie-in no longer exist on disk |
| REQ-002 | `SKILL.md` carries no `PLUGIN_EXCALIDRAW` wiring and stays internally consistent | No `excalidraw` token in `SKILL.md`; RESOURCE_MAP and INTENT_SIGNALS key counts match the count comment; `validate_document.py --type skill` = 0 issues |
| REQ-003 | No residual `excalidraw` reference outside the historical changelogs | `grep -ri excalidraw` returns only changelog files (and intentional deprecation notes authored in 008) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Changed narrative docs validate clean | `validate_document.py` = 0 issues on README, FEATURE-CATALOG, plugin-operation-logic, and the playbook |
| REQ-005 | `validate.sh <this-folder> --strict` = Errors:0 | Closeout run reports PASSED |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All Excalidraw files are deleted (reference tree, catalog card, 2 assets, manual tie-in). **Met 2026-08-22**: verified gone on disk.
- **SC-002**: `SKILL.md` has zero `excalidraw` tokens and validates clean; INTENT_SIGNALS/RESOURCE_MAP counts are consistent. **Met**: `validate_document.py --type skill` = 0 issues.
- **SC-003**: The changed narrative docs validate clean. **Met**: README/FEATURE-CATALOG/plugin-operation-logic/playbook all at `Total issues: 0`.
- **SC-004**: `validate.sh <this-folder> --strict` = Errors:0; no unrelated repo file touched.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Deleting a reference leaves a dangling router link | High | After deletion, grep `SKILL.md` for `excalidraw` and verify every RESOURCE_MAP path resolves |
| Risk | Decrementing a stale narrative count makes it more wrong | Med | Excalidraw removal is offset by the Meta Bind addition in 008, so FEATURE-CATALOG totals net to zero; only membership changes |
| Risk | Editing historical changelogs | Low | Explicitly out of scope — changelogs record past state |
| Dependency | Deletions are git-tracked | Green | Reversible via `git restore` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Consistency
- **NFR-C01**: After removal, every `SKILL.md` RESOURCE_MAP path resolves to an existing file and the INTENT_SIGNALS count comment matches the key count.
- **NFR-C02**: No file outside the `mcp-obsidian` skill and this spec folder is touched.

### Reversibility
- **NFR-R01**: All deletions are git-tracked and reversible via `git restore`; the named rollback is `git restore <deleted paths>` + `git checkout` of the edited files.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **§8 References did not list Excalidraw**: the skill's §8 already omitted the seven older plugin folders (charts/dataview/excalidraw/git/outliner/minimal/health-md), so no §8 edit was needed for Excalidraw.
- **Playbook scenario numbering gap**: removing `OBS-018` leaves a gap between `OBS-017` and `OBS-019`; scenario ids are identifiers, not a contiguous sequence, so the gap is acceptable rather than renumbering 20+ scenarios.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- **RESOLVED 2026-08-22**: Remove entirely vs archive — operator chose "remove entirely" and "also uninstall from vault"; the vault uninstall was executed in the plugin-management session.
- **RESOLVED 2026-08-22**: New phase vs fold into an existing packet — operator chose a new phase (007) under the 015 parent.
<!-- /ANCHOR:questions -->
