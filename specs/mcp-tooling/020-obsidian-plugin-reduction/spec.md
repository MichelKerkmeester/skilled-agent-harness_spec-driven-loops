---
title: "Feature Specification: Reduce mcp-obsidian dedicated plugin support to Iconic and Health.md only"
description: "Remove the twelve non-retained dedicated plugin doc sets, assets, catalog entries and routing vocabulary from the mcp-obsidian mode, keeping Iconic and Health.md."
trigger_phrases:
  - "remove obsidian plugin support"
  - "mcp-obsidian plugin reduction"
  - "keep iconic and health-md only"
  - "obsidian dedicated plugin docs"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/020-obsidian-plugin-reduction"
    last_updated_at: "2026-09-11T00:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Packet complete: all three phases shipped, committed and pushed"
    next_safe_action: "None; the packet is closed"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md"
      - ".opencode/skills/mcp-tooling/leaf-manifest.json"
      - ".opencode/skills/mcp-tooling/hub-router.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "orchestrator-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Which plugins are retained? Iconic and Health.md, named by the operator."
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 3 -->

# Feature Specification: Reduce mcp-obsidian dedicated plugin support to Iconic and Health.md only

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-11 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | mcp-tooling/020-obsidian-plugin-reduction |
| **Predecessor** | mcp-tooling/019-official-obsidian-cli |
| **Successor** | None |
| **Handoff Criteria** | Each phase validates independently; the parent validates recursively with zero errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `mcp-obsidian` mode documents fourteen Obsidian plugins, and only two are wanted.
Each carries a four-file reference bundle of index, data model, workflows and troubleshooting,
plus matching asset examples, feature-catalog entries, playbook tie-ins and router vocabulary. The other twelve cost 8,892 reference lines and
twenty router intents that compete for the same requests, and every one of them is a surface a
reader must rule out before reaching the note and vault operations the mode exists for.

### Purpose

Reduce the mode to dedicated support for Iconic and Health.md alone. Every other plugin doc set,
example asset, catalog entry, playbook tie-in and routing signal is removed, and the surfaces
that referenced them are reconciled so no dangling path, orphaned intent or stale roster
survives. The note, vault, CLI, MCP and theme surfaces are untouched.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All
> detailed planning, task breakdowns, checklists, and decisions live in the child phase folders
> listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Delete the twelve non-retained dedicated plugin doc sets under `references/plugins/`.
- Delete their example assets under `assets/plugins/`, plus the BRAT root asset.
- Delete their `feature-catalog/plugins/` entries and `manual-testing-playbook/plugin-tie-ins/` scenarios.
- Reconcile the mode's own surfaces: `SKILL.md` router, `README.md`, the plugin roster, the
  operation-logic reference, the cross-plugin workflow asset, the migration reference, and both
  catalog and playbook indexes.
- Reconcile the parent hub's `leaf-manifest.json`, `mode-registry.json` and `hub-router.json`.
- Add a changelog entry for the version this ships under.

### Out of Scope

- **The vault itself.** No plugin is uninstalled or disabled in the operator's Obsidian vault.
  This packet removes documentation and routing, never installed software.
- **The theme system.** `references/themes/`, `feature-catalog/plugins/theme-system.md` and
  `manual-testing-playbook/plugin-tie-ins/theme-activation.md` are the theme surface, not
  dedicated plugin support, and stay.
- **The MCP and CLI surfaces.** `references/mcp-tools.md`, `references/cli-versus-mcp.md`,
  `references/obsidian-cli-commands.md`, `references/official-cli-agent-usage.md`,
  `references/troubleshooting.md`, `INSTALL-GUIDE.md`, `scripts/` and `examples/` keep their
  Local REST API prose, which is transport prerequisite knowledge rather than plugin support.
- **The advisor's `graph-metadata.json`** at the hub root, which carries only `iconic` from the
  affected vocabulary and therefore needs no change.
- Retitling, renumbering or restructuring the mode.

### Retained versus removed

| Plugin | Doc set | Decision |
|--------|---------|----------|
| Iconic | `references/plugins/iconic/` | **Retained** — named by the operator |
| Health.md | `references/plugins/health-md/` | **Retained** — named by the operator |
| Advanced Canvas | `references/plugins/advanced-canvas/` | Removed |
| Charts | `references/plugins/charts/` | Removed |
| Claudian | `references/plugins/claudian/` | Removed |
| Dataview | `references/plugins/dataview/` | Removed |
| Obsidian Git | `references/plugins/git/` | Removed |
| Make.md | `references/plugins/make-md/` | Removed |
| Meta Bind | `references/plugins/meta-bind/` | Removed |
| Notion Bases | `references/plugins/notion-bases/` | Removed |
| Local REST API | `references/plugins/obsidian-local-rest-api/` | Removed |
| Obsidian Tables | `references/plugins/obsidian-tables/` | Removed |
| Obsidian42 BRAT | `references/plugins/obsidian42-brat/` | Removed |
| Outliner | `references/plugins/outliner/` | Removed |

### Files to Change

Per-phase detail lives in each child's `plan.md`. Summary only:

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `references/plugins/<12 dirs>/` | Delete | 001 | Forty-eight reference files |
| `assets/plugins/<5 dirs>/`, `assets/brat-data-entry.example.json` | Delete | 001 | Nine example assets |
| `feature-catalog/plugins/<11 files>` | Delete | 001 | Catalog entries |
| `manual-testing-playbook/plugin-tie-ins/<11 files>` | Delete | 001 | Playbook scenarios |
| `SKILL.md` | Modify | 002 | Description, keywords, triggers, router intents and resource map |
| `README.md` | Modify | 002 | Plugin table and prose |
| `references/plugins/installed-plugins.md` | Modify | 002 | Roster of which plugins carry dedicated docs |
| `references/plugins/plugin-operation-logic.md` | Modify | 002 | Artifact data map |
| `assets/workflows.md` | Modify | 002 | Cross-plugin workflow examples |
| `references/notion-migration.md` | Modify | 002 | Links into removed doc sets |
| `feature-catalog/FEATURE-CATALOG.md` | Modify | 002 | Catalog index |
| `manual-testing-playbook/manual-testing-playbook.md` | Modify | 002 | Playbook index |
| `changelog/v0.24.0.0.md` | Create | 002 | Version entry |
| `../leaf-manifest.json` | Modify | 003 | Leaf paths for the mcp-obsidian mode |
| `../mode-registry.json` | Modify | 003 | Alias phrases |
| `../hub-router.json` | Modify | 003 | Stage-two vocabulary classes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec
> folder. All implementation details live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-plugin-doc-removal/` | Delete the seventy-nine files of the twelve removed plugins | complete |
| 2 | `002-skill-surface-reconciliation/` | Reconcile the mode's own docs, router and changelog | complete |
| 3 | `003-hub-routing-and-validation/` | Reconcile hub routing and run the authoritative gates | complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Run `validate.sh --recursive` on the parent to validate all phases as an integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | All seventy-nine target files are gone and the two retained doc sets are intact | `find` over `references/plugins/` returns only `iconic` and `health-md` |
| 002 | 003 | No surviving mode document references a removed path | repo-wide grep for the removed directory names returns only changelog history |
| 003 | done | Hub routing carries no removed vocabulary and every gate passes | per-hub gate plus recursive `validate.sh --strict` |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

None. The retained set was named by the operator: Iconic and Health.md.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: `001-plugin-doc-removal/`, `002-skill-surface-reconciliation/`, `003-hub-routing-and-validation/`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
