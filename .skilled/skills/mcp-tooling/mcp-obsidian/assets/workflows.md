---
title: "mcp-obsidian Shared File-Layer Workflows"
description: "Shared cross-plugin workflow index for editing the plain files that Obsidian plugins render, pointing at the retained Iconic and Health.md plugin workflows and the theme-system reference."
trigger_phrases:
  - "obsidian file-layer workflow"
  - "plugin data over ui"
importance_tier: "normal"
contextType: "implementation"
version: 0.1.0.0
---

# mcp-obsidian Shared File-Layer Workflows

This asset gives plugin-specific data edits a shared operating sequence. Each retained reference points at its canonical deep file and keeps UI actions outside the file-layer contract.

---

## 1. OVERVIEW

The mode operates vault files through its CLI and MCP surfaces. A plugin's UI renders or transforms data already stored in the vault, so an agent should identify the plugin's source file, preserve its schema, make the smallest reversible mutation, validate the data, and tell the operator when a reload is needed for rendering. ([plugin operation logic](../references/plugins/plugin-operation-logic.md))

### Shared sequence

1. Identify the exact vault and source-of-truth file.
2. Read the current file and any plugin settings or include/index references.
3. Snapshot before a destructive or bulk mutation.
4. Apply one schema-valid file-layer edit.
5. Run the plugin/domain validator and a focused readback.
6. Reopen or reload the Obsidian view only after the file-layer checks pass.

---

## 2. RETAINED PLUGIN AND THEME WORKFLOWS

Only Iconic and Health.md still carry dedicated plugin references, and the theme system keeps its own reference set. Each file below is the canonical deep reference for its surface.

- [`iconic/workflows.md`](../references/plugins/iconic/workflows.md). Safe file-layer recipes for Iconic: add/edit/disable rules, flip visibility toggles, change colors, and merge rulebooks with backup discipline. These recipes edit `.obsidian/plugins/iconic/data.json`, and every write is a merge rather than a replace.
- [`health-md/workflows.md`](../references/plugins/health-md/workflows.md). Safe file-layer recipes for Health.md: resolve the configured data folder, add authentic export files, place `health-viz` chart blocks, adjust folder structure, verify real data (mock-fallback escape), and discover entry notes. These recipes change the data files Health.md renders, and no app reload is needed for the cache to refresh.
- [`themes/themes.md`](../references/themes/themes.md). General reference for the Obsidian theme system: install, activate and manage themes, the theme package layout, the theme-vs-snippet-vs-plugin distinction, and the `mcp-obsidian` file-layer stance.

---

## 3. RELATED RESOURCES

- [`plugin-operation-logic.md`](../references/plugins/plugin-operation-logic.md). The shared data-over-UI operating model behind every reference on this page.
- [`installed-plugins.md`](../references/plugins/installed-plugins.md). The vault roster that marks which plugins still carry a dedicated reference tree and which lost theirs.
- [`iconic/iconic.md`](../references/plugins/iconic/iconic.md) and [`health-md/health-md.md`](../references/plugins/health-md/health-md.md). The two retained plugin indexes, with their data-model and troubleshooting companions.
