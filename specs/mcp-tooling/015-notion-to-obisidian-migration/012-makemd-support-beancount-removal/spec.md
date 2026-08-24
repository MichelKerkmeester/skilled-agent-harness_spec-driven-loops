---
title: "Feature Specification: Phase 012: makemd-support-beancount-removal"
description: "Skill-doc change to the mcp-obsidian skill: retire the beancount-finance plugin and add first-class Make.md (make-md) support mirroring notion-bases. Removes every beancount reference (files, SKILL.md router surface, index docs) and adds the make-md reference tree, feature-catalog entry, PLUGIN_MAKEMD router intent, and index rows, bumping SKILL.md to 0.22.0.0 with a matching changelog."
trigger_phrases:
  - "015 makemd support beancount removal"
  - "mcp-obsidian make-md plugin support"
  - "mcp-obsidian remove beancount finance"
  - "PLUGIN_MAKEMD router intent"
  - "phase 012 makemd beancount"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/012-makemd-support-beancount-removal"
    last_updated_at: "2026-08-23T19:40:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the Level 1 close-out docs for the make-md/beancount skill-doc change"
    next_safe_action: "Generate description.json + graph-metadata.json, then validate --strict"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-012-makemd-support-beancount-removal"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 012: makemd-support-beancount-removal

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-23 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 12 |
| **Predecessor** | `011-migration-playbook-refresh` |
| **Successor** | `None` |
| **Handoff Criteria** | Every beancount reference removed from the mcp-obsidian skill (grep clean outside `changelog/`), make-md documented as a supported plugin mirroring notion-bases (reference tree + feature-catalog entry + index rows), `PLUGIN_MAKEMD` wired through every SKILL.md router surface with `PLUGIN_FINANCE` gone, SKILL.md at 0.22.0.0 with a matching changelog, and all changed skill docs passing `validate_document.py`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase is a documentation change inside the **mcp-obsidian** skill, not a change to the personal Obsidian vault. It is the twelfth phase of the Notion-to-Obsidian migration packet.

**Scope Boundary**: All writes stay under `.opencode/skills/mcp-tooling/mcp-obsidian/` (the skill) plus this spec packet's own docs. The personal finance vault, already reverted to native Bases in a separate packet, is out of scope and untouched.

**Why now**: Beancount's double-entry paradigm was dropped from the vault's finance workflow, and the plugin is `isDesktopOnly` (no mobile support). Make.md is the Notion-closest database plugin in the installed set, so it earns the same file-layer coverage that notion-bases already has. Retiring the dead plugin and promoting the live one keeps the skill's plugin surface honest.

**Deliverables**:
- Beancount fully removed from the skill: reference tree, feature-catalog entry, examples, assets, manual-testing tie-in, every SKILL.md router surface, and index-doc mentions.
- Make.md added mirroring notion-bases: a four-file reference tree, a feature-catalog entry, a `PLUGIN_MAKEMD` router intent wired through all the same points, and rows in the shared index docs.
- SKILL.md version bumped 0.21.0.0 to 0.22.0.0 with a `v0.22.0.0.md` changelog entry.

**Changelog**:
- The skill's own changelog carries `v0.22.0.0.md`; beancount history in prior changelog entries is intentionally kept.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The mcp-obsidian skill still documented **Beancount Finance** as a supported plugin after its double-entry paradigm was dropped from the vault's finance workflow, and the plugin is `isDesktopOnly` so it cannot serve the mobile use case the skill targets. At the same time **Make.md**, the Notion-closest database plugin in the installed set, had no file-layer coverage even though notion-bases (a sibling database plugin) is fully documented. The skill's plugin surface advertised a dead plugin and omitted a live, Notion-adjacent one.

### Purpose
Retire Beancount from the skill entirely and document Make.md as a first-class supported plugin, mirroring exactly how notion-bases is covered, so the plugin surface reflects what the vault actually uses.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Remove Beancount** from the skill: the `references/plugins/beancount-finance/` tree, its feature-catalog entry, its example script, its assets, its manual-testing tie-in, its full `PLUGIN_FINANCE` router surface in SKILL.md, and every beancount mention across the shared index docs.
- **Add Make.md** mirroring notion-bases: a `references/plugins/make-md/` reference tree, a `feature-catalog/plugins/make-md.md` entry, a `PLUGIN_MAKEMD` router intent wired through the same SKILL.md points notion-bases uses, and make-md rows in the shared index docs.
- **Version + changelog**: SKILL.md bumped 0.21.0.0 to 0.22.0.0; a `changelog/v0.22.0.0.md` entry added.
- This phase folder's own Level 1 documentation.

### Out of Scope
- **Changelog history** - prior beancount mentions in the skill's `changelog/` are kept as historical record, not scrubbed.
- **The personal finance vault** - already reverted to native Bases in `specs/obsidian/001-notion-finance-migration`; the iCloud-synced vault is never read or written.
- **notion-bases content** - it is the structural template being mirrored, not edited.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/beancount-finance/` | Delete | The 4-file Beancount reference tree |
| `.opencode/skills/mcp-tooling/mcp-obsidian/feature-catalog/plugins/beancount-finance.md` | Delete | Beancount feature-catalog entry |
| `.opencode/skills/mcp-tooling/mcp-obsidian/examples/beancount-transaction.sh` | Delete | Beancount example script |
| `.opencode/skills/mcp-tooling/mcp-obsidian/assets/plugins/beancount-finance/` | Delete | The 2-file Beancount asset set |
| `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/plugin-tie-ins/beancount-transaction.md` | Delete | Beancount manual-testing tie-in |
| `.opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md` | Modify | Strip `PLUGIN_FINANCE` (intent, RESOURCE_MAP, PLUGINS aggregate, `specific_plugin_intents` tuple, headline list, keywords, triggers, §8 inventory); add `PLUGIN_MAKEMD` at every matching point; version 0.21.0.0 to 0.22.0.0 |
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/make-md/` | Create | The make-md reference tree (make-md, data-model, workflows, troubleshooting) |
| `.opencode/skills/mcp-tooling/mcp-obsidian/feature-catalog/plugins/make-md.md` | Create | Make.md feature-catalog entry |
| `.opencode/skills/mcp-tooling/mcp-obsidian/README.md`, `INSTALL-GUIDE.md`, `feature-catalog/FEATURE-CATALOG.md`, `installed-plugins.md`, `plugin-operation-logic.md`, `examples/README.md`, `assets/workflows.md`, `manual-testing-playbook.md` | Modify | Remove beancount mentions; add make-md rows/mentions where notion-bases appears |
| `.opencode/skills/mcp-tooling/mcp-obsidian/changelog/v0.22.0.0.md` | Create | Version entry for the swap |
| `012-makemd-support-beancount-removal/` | Add | This phase folder's spec/plan/tasks/implementation-summary + generated metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Beancount fully removed from the skill | `grep -rIi beancount <skill> --include='*.md' --include='*.sh'`, excluding `changelog/`, returns empty; the beancount reference tree, feature-catalog entry, example, assets, and manual-testing tie-in no longer exist |
| REQ-002 | `PLUGIN_FINANCE` removed from every SKILL.md router surface | SKILL.md has no `PLUGIN_FINANCE` in the intent list, RESOURCE_MAP, PLUGINS aggregate, `specific_plugin_intents` tuple, headline list, keyword comment, activation triggers, or §8 inventory |
| REQ-003 | Make.md documented as a supported plugin mirroring notion-bases | `references/plugins/make-md/` carries the four-file tree; `feature-catalog/plugins/make-md.md` exists; both mirror the notion-bases structure and frontmatter |
| REQ-004 | `PLUGIN_MAKEMD` wired through SKILL.md | `PLUGIN_MAKEMD` present in the intent list, RESOURCE_MAP (nine make-md paths), routing tuple, and the other wiring points notion-bases uses; SKILL.md version reads 0.22.0.0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Shared index docs updated | `installed-plugins.md` and `FEATURE-CATALOG.md` reference make-md and not beancount; make-md links resolve |
| REQ-006 | Changed skill docs pass the document validator | `validate_document.py` reports 0 issues on the 5 make-md docs and SKILL.md |
| REQ-007 | This phase folder passes strict validation | `validate.sh <this-folder> --strict` reports Errors:0 for the authored docs (generated metadata handled separately) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A beancount grep across the skill (excluding `changelog/`) returns empty, and SKILL.md carries no `PLUGIN_FINANCE` surface.
- **SC-002**: Make.md is documented exactly as notion-bases is - reference tree, feature-catalog entry, `PLUGIN_MAKEMD` router intent, and index rows - with all make-md links resolving and every changed doc passing `validate_document.py` with 0 issues.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A dangling `PLUGIN_FINANCE` reference left in one SKILL.md surface | Medium | Enumerate every notion-bases wiring point and mirror the removal/addition one-for-one; grep the surface after editing |
| Risk | Inventing Make.md `.space` behavior not grounded in source | Medium | Author only from the finance A/B research and the reverse-engineered `.space` format; anything undocumented is stated as such |
| Risk | Writing outside the skill (into the vault or a sibling packet) | High | Scope-locked to the skill dir and this phase folder; the vault and other packets are left as-is |
| Dependency | The finance A/B research (Make.md install/features/mobile + `.space` on-disk format) | Source of truth | Read before authoring the make-md reference set |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Resolved - changelog history:** prior beancount mentions in the skill's `changelog/` are kept as historical record rather than scrubbed, so the changelog "overview" convention flag (which v0.21 fails identically) is a pre-existing convention, not a regression from this phase.
- **Resolved - router surgery ownership:** the make-md reference set and the beancount strip of prose/index docs were delegated to markdown agents for token efficiency, while the delicate SKILL.md router surgery was done directly to avoid a dangling intent.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
