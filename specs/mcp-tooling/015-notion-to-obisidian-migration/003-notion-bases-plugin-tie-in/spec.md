---
title: "Phase 003: Notion Bases plugin knowledge tie-in (mcp-obsidian)"
description: "Plan the mcp-obsidian plugin knowledge gap: a new references/plugins/notion-bases/ tree, feature-catalog entry, manual-testing-playbook scenario, and SKILL.md router entry for the Notion Bases community plugin (two-way relations, 7 rollup functions, 7 view types, subtasks, Lookup columns), plus a Dataview supplement for aggregations it doesn't cover."
trigger_phrases:
  - "015 notion bases plugin tie-in"
  - "notion bases plugin reference"
  - "obsidian-notion-bases-plugin"
  - "notion bases rollup relation"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/003-notion-bases-plugin-tie-in"
    last_updated_at: "2026-08-22T04:06:26Z"
    last_updated_by: "claude"
    recent_action: "Built notion-bases 4-file tree, catalog entry, OBS-022 scenario, router intent, manifest regen"
    next_safe_action: "Phase 004: real-vault install + verification script"
    blockers: []
    key_files:
      - "../001-deep-research/research/research.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-003-notion-bases-plugin-tie-in"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Phase 003: Notion Bases plugin knowledge tie-in

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-21 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 3 of 4 |
| **Predecessor** | `002-migration-playbook` |
| **Successor** | `004-plugin-install-and-verification` |
| **Handoff Criteria** | `mcp-obsidian/references/plugins/notion-bases/` (4 files), `feature-catalog/plugins/notion-bases.md`, and a new `manual-testing-playbook/plugin-tie-ins/` scenario all exist; `SKILL.md` routes to them; `leaf-manifest.json` regenerated; `validate_document.py --type skill` = 0 issues. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the 015 migration capability. Phase 002 planned the generic migration method; this phase builds the specific plugin knowledge `mcp-obsidian` was missing — the Notion Bases community plugin (`bgarciamoura/obsidian-notion-bases-plugin`, v1.5.0+), confirmed by research §8 as the P0-required plugin `mcp-obsidian` did not yet know. Research §5 confirms the plugin "handles over 90% of Notion's relational feature set" — two-way relations, 7 rollup functions, 7 view types, subtasks, and Lookup columns — with Dataview as the supplement for the remainder. This phase both plans and builds: the spec/plan/tasks/checklist package was authored first, then the same session executed `tasks.md` end to end and built the reference tree.

**Scope Boundary**: The Notion Bases plugin knowledge layer only, following `mcp-obsidian`'s existing per-plugin authoring pattern (index + data-model + workflows + troubleshooting, mirrored from `references/plugins/dataview/`). No plugin is installed and no live vault is touched — Phase 004.

**Dependencies**:
- 001 research verdict §5 (three-way recovery matrix), §7 (multi-view databases), §8 (required vs optional plugins).
- `mcp-obsidian`'s existing per-plugin reference pattern (`references/plugins/dataview/*.md`, `feature-catalog/plugins/dataview.md`) as the authoring shape.
- `mcp-obsidian`'s existing manual-testing scenario pattern (`manual-testing-playbook/plugin-tie-ins/brat-headless-install.md`, OBS-013) as the scenario shape.

**Deliverables** (this phase): `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, plus the runtime build — the `notion-bases/` 4-file reference tree, the feature-catalog entry, the `OBS-022` manual scenario, the `SKILL.md` router intent, and the regenerated `leaf-manifest.json`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`mcp-obsidian` already knows Core Bases and Dataview in full, but research §8 confirms it has **no knowledge of the Notion Bases community plugin** — the single plugin the research verdict ranks P0-required because it recovers two-way relations, 7 rollup functions, 7 view types, self-relation subtasks, and Lookup columns that Core Bases alone cannot. Without this reference, an agent asked to reconstruct a Notion relation or rollup after import would either fall back to a Dataview workaround where a native plugin column exists, or fail to recognize the plugin's `_database.md` schema shape at all.

### Purpose
Plan the Notion Bases plugin reference tree — index, data model, workflows (including the Dataview supplement for the aggregations the plugin doesn't cover), troubleshooting, a feature-catalog entry, a manual-testing scenario, and the SKILL.md router entry — so `mcp-obsidian` reaches parity with its Dataview knowledge for this plugin.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `references/plugins/notion-bases/notion-bases.md`: plugin index (repo `bgarciamoura/obsidian-notion-bases-plugin`, version pin v1.5.0+, activation triggers), mirroring `dataview.md`'s OVERVIEW/HOW IT WORKS/SOURCE FILES/GUARDRAILS shape.
- `references/plugins/notion-bases/data-model.md`: the `_database.md` plugin schema shape — two-way Relation columns, the 7 Rollup functions, Lookup columns, self-relation subtasks (3-level), and the 7 view types (research §5, §7).
- `references/plugins/notion-bases/workflows.md`: file-layer recipes for writing/extending `_database.md` relation/rollup/lookup columns and configuring a view, plus a **Dataview supplement section** for the aggregations the plugin doesn't cover (research §5's "Dataview supplements for custom aggregations" finding).
- `references/plugins/notion-bases/troubleshooting.md`: failure/recovery recipes (schema mismatch, missing back-reference, unsupported view type).
- `feature-catalog/plugins/notion-bases.md`: feature-catalog index entry.
- One new `manual-testing-playbook/plugin-tie-ins/` scenario (next id `OBS-022`) validating a relation/rollup/view round-trip at the file layer, mirroring OBS-013's stage/verify shape.
- `mcp-obsidian/SKILL.md`: a `PLUGIN_NOTION_BASES` intent mirroring the existing `PLUGIN_DATAVIEW` pattern — §2 Resource Loading Levels, `INTENT_SIGNALS`, `RESOURCE_MAP`, the `PLUGINS` aggregate list, and §8 References.
- `manual-testing-playbook/manual-testing-playbook.md`: register `OBS-022` in the index tables and the community-plugin tie-in range.
- Regenerating `leaf-manifest.json` for the new leaves.

### Out of Scope
- The generic migration method (`notion-migration.md`, `migration-inventory.md`) — Phase 002.
- Installing the plugin into any vault, or any live-app verification — Phase 004.
- Modifying `references/plugins/dataview/*` — this phase only adds a supplement pointer from `notion-bases/workflows.md`, it does not edit the existing Dataview reference files.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/notion-bases/notion-bases.md` | Create | Plugin index |
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/notion-bases/data-model.md` | Create | `_database.md` schema: relations, rollups, lookups, subtasks, views |
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/notion-bases/workflows.md` | Create | File-layer recipes + Dataview supplement section |
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/notion-bases/troubleshooting.md` | Create | Failure/recovery recipes |
| `.opencode/skills/mcp-tooling/mcp-obsidian/feature-catalog/plugins/notion-bases.md` | Create | Feature-catalog index entry |
| `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/plugin-tie-ins/notion-bases-relation-rollup.md` | Create | `OBS-022` manual scenario |
| `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/manual-testing-playbook.md` | Edit | Register `OBS-022` in index tables |
| `.opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md` | Edit | Add `PLUGIN_NOTION_BASES` intent + §8 References |
| `.opencode/skills/mcp-tooling/leaf-manifest.json` | Edit (regenerate) | Add the new plugin leaves |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The 4-file `notion-bases/` reference tree exists and covers relations, rollups, lookups, subtasks, and views, cited to research §5/§7/§8 | All 4 files present; each cites the source research section |
| REQ-002 | `workflows.md` includes a Dataview supplement section for aggregations the plugin doesn't cover | Section present; cites research §5's supplement finding |
| REQ-003 | `SKILL.md` routes `PLUGIN_NOTION_BASES` the same way `PLUGIN_DATAVIEW` is routed | New intent present in `INTENT_SIGNALS`/`RESOURCE_MAP`/`PLUGINS` aggregate; existing plugin intents unmodified |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | `feature-catalog/plugins/notion-bases.md` and the `OBS-022` manual scenario exist | Both files present; `manual-testing-playbook.md` index updated |
| REQ-005 | `leaf-manifest.json` regenerated; validator clean | `ci-leaf-manifest-freshness.cjs` reports `OK mcp-tooling`; `validate_document.py --type skill` = 0 issues on all created/edited files |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An agent asked "how do I recover a two-way Notion relation in Obsidian" reaches `notion-bases/data-model.md` through the router.
- **SC-002**: An agent asked for a rollup aggregation the plugin doesn't support reaches the Dataview supplement in `workflows.md` instead of guessing DQL syntax.
- **SC-003**: `validate_document.py --type skill` = 0 issues; `ci-leaf-manifest-freshness.cjs` reports `OK mcp-tooling`; `validate.sh <this-folder> --strict` = Errors:0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Plugin version drifts past v1.5.0+ (rollups/subtasks/charts) between planning and build | Med | `notion-bases.md` states the version pin explicitly; implementation-time author re-checks the release page before drafting |
| Risk | New `PLUGIN_NOTION_BASES` intent's keywords overlap `PLUGIN_DATAVIEW`'s (e.g. "rollup", "relation") and cause router ambiguity | Med | Mirror the router's existing tie-break: the highest specific-plugin score wins; keyword sets should favor plugin-specific nouns ("notion bases", "lookup column", "two-way relation") over generic ones already owned by Dataview |
| Dependency | 001 research verdict §5/§7/§8 | No source content without it | Already complete |
| Dependency | `references/plugins/dataview/*` as the authoring shape | Structural drift if not mirrored | Read in full during Phase 002 planning; re-read at implementation time |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Consistency
- **NFR-C01**: Every claim traces to a cited research section (§5/§7/§8); no invented plugin behavior beyond what the research documents.
- **NFR-C02**: The `notion-bases/` tree structurally mirrors `dataview/` (index + data-model + workflows + troubleshooting) so both plugins read the same way to an agent.

### Maintainability
- **NFR-M01**: The manual-testing scenario follows the OBS-### numbering and scenario-contract shape already used by all other `plugin-tie-ins/` scenarios.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Content Boundaries
- **Aggregations outside both surfaces**: if a Notion rollup pattern has no equivalent in either Notion Bases or Dataview, `workflows.md` documents it as a static-value fallback (mirroring research §5's formula-recovery pattern), not a silent gap.
- **Router keyword collision with Dataview**: a request like "rollup query" could plausibly match both `PLUGIN_NOTION_BASES` and `PLUGIN_DATAVIEW`; this phase's router edit follows the existing house rule (highest specific score wins, tie disambiguates) rather than inventing new tie-break logic.

### Verification Boundaries
- **No plugin install in this phase**: REQ-005's validator run is structural only; no live Obsidian round-trip is claimed.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- None blocking. The exact wording of the `OBS-022` scenario's throwaway-vault fixture is an implementation-time detail; it follows the OBS-013 shape regardless.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Research source**: `../001-deep-research/research/research.md`

<!-- /ANCHOR:related-docs -->

---

<!--
LEVEL 2 SPEC (~120 lines)
- Core + Level 2 addendum
- NFRs and Edge Cases added
- Verification-focused documentation
-->
