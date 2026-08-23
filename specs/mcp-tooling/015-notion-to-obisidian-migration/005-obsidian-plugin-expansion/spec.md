---
title: "Phase 005: Obsidian plugin-stack expansion — install nine plugins and document the vault roster"
description: "Install nine community plugins into the operator's real Obsidian vault via BRAT-headless, author dedicated file-layer integration references for the three with an AI-authorable data model (Advanced Canvas, Claudian, Project Manager), add a complete installed-plugins roster covering all twenty-one enabled plugins, and wire the three new plugins into the mcp-obsidian router."
trigger_phrases:
  - "015 obsidian plugin expansion"
  - "install nine obsidian plugins"
  - "advanced canvas claudian project manager skill folders"
  - "installed plugins roster"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/005-obsidian-plugin-expansion"
    last_updated_at: "2026-08-23T03:52:43Z"
    last_updated_by: "claude"
    recent_action: "installed 9 plugins in the vault; authored 3 references + roster + router wiring"
    next_safe_action: "None — phase complete; per-plugin deep research is a separate follow-up"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-005-obsidian-plugin-expansion"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Phase 005: Obsidian plugin-stack expansion

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
| **Phase** | 5 of 5 |
| **Predecessor** | `004-plugin-install-and-verification` |
| **Successor** | `006-plugin-docs-deep-research` |
| **Handoff Criteria** | Nine plugins staged, registered in BRAT, and activated in the operator's real vault via BRAT-headless (executed and verified 2026-08-22; activation completes when the operator next opens Obsidian). Three dedicated file-layer references (Advanced Canvas, Claudian, Project Manager) plus catalog entries authored and `validate_document.py --type feature_catalog` clean (15 files); `installed-plugins.md` roster covers all twenty-one enabled plugins; the three new plugins are wired into `mcp-obsidian/SKILL.md` (resource map, `INTENT_SIGNALS`, `RESOURCE_MAP`, `PLUGINS` aggregate, §8, intent-count comment, version bump to 0.20.0.0); leaf-manifest freshness green; `validate.sh --strict` clean. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5**, an extension phase. Phases 002-004 built and installed the two plugins the Notion→Obsidian migration needs (Notion Bases, Dataview). This phase extends the same `mcp-obsidian` skill beyond migration to the operator's broader plugin stack: the operator requested nine additional community plugins be installed into the vault and supported in the skill, plus a roster that lists every plugin in use — including the ones that intentionally receive no dedicated integration docs.

Unlike Phase 004 (which planned first and executed later), this phase's vault install executed within the same session under an explicit operator go-ahead ("install all nine now"), append-only, with timestamped backups and a named rollback recorded before any write.

The parent packet is a phase parent; per lean-trio policy, all implementation detail lives here in the child.

**Deliverables** (this phase): `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, the three plugin reference trees, the roster, three catalog entries, the `SKILL.md` wiring, and the `v0.20.0.0` changelog.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `mcp-obsidian` skill documented thirteen plugins (twelve community plugins plus the Minimal theme), but the operator's vault stack was growing. Nine more plugins were requested for install and skill support. Three of them expose an AI-authorable file-layer data model and need dedicated references; the other six are UI-only or automatic and need none. Nothing in the skill told a reader the full set of plugins actually enabled in the vault, or which ones carry integration docs.

### Purpose
Install the nine plugins into the real vault, author dedicated four-file references (plus catalog entries) for the three file-layer plugins, add an all-plugins roster so the skill has a single source of truth for what is enabled and where its docs live, and wire the three new plugins into the router so a plugin-specific request resolves to the right reference tree.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Install nine community plugins into the operator's real vault via BRAT-headless: `virtual-linker`, `editing-toolbar`, `notebook-navigator`, `advanced-canvas`, `realclaudian` (Claudian), `obsidian-custom-frames`, `darlal-switcher-plus`, `project-manager`, `link-favicon`. Each `manifest.id` is derived from the downloaded manifest, never assumed.
- Author dedicated four-file integration references plus catalog entries for the three file-layer plugins with an AI-authorable data model: Advanced Canvas (extends `.canvas` JSON), Claudian (in-vault agent CLIs, slash commands, MCP config), Project Manager (task frontmatter schema).
- Author `references/plugins/installed-plugins.md` — the roster of all twenty-one enabled plugins, split into file-layer (with dedicated docs) and UI/automatic (without).
- Wire the three new plugins into `mcp-obsidian/SKILL.md`: resource-loading map, `INTENT_SIGNALS`, `specific_plugin_intents`, `RESOURCE_MAP`, the `PLUGINS` aggregate, §8 References, the intent-count comment, and the skill version.

### Out of Scope
- Dedicated integration docs for the six UI/automatic plugins (no AI-authorable data model).
- Removing or replacing any existing plugin. The obsolescence review concluded all installed plugins coexist; two soft overlaps (Claudian vs Local REST API, Project Manager vs Dataview/Notion Bases) are documented, not resolved by removal.
- Per-plugin deep research to further optimize the references — a separate follow-up program.
- Running an actual Notion→Obsidian migration.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/installed-plugins.md` | Create | Roster of all 21 enabled vault plugins |
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/advanced-canvas/{advanced-canvas,data-model,workflows,troubleshooting}.md` | Create | Advanced Canvas file-layer reference tree |
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/claudian/{claudian,data-model,workflows,troubleshooting}.md` | Create | Claudian file-layer reference tree |
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/project-manager/{project-manager,data-model,workflows,troubleshooting}.md` | Create | Project Manager file-layer reference tree |
| `.opencode/skills/mcp-tooling/mcp-obsidian/feature-catalog/plugins/{advanced-canvas,claudian,project-manager}.md` | Create | Catalog entries for the three new plugins |
| `.opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md` | Edit | Router wiring for the three new plugins + roster; version 0.19.0.0 → 0.20.0.0 |
| `.opencode/skills/mcp-tooling/mcp-obsidian/changelog/v0.20.0.0.md` | Create | Release note for this expansion |
| `.opencode/skills/mcp-tooling/leaf-manifest.json` | Edit | Regenerated to register the new reference files |
| (out-of-repo, real vault) `.obsidian/plugins/<id>/{main.js,manifest.json,styles.css}` ×9 | Create — operator-approved, executed | Nine staged plugin folders |
| (out-of-repo, real vault) `.obsidian/community-plugins.json` | Edit — operator-approved, executed | Nine ids enabled (12 → 21); `.bak` backup first |
| (out-of-repo, real vault) `.obsidian/plugins/obsidian42-brat/data.json` | Edit — operator-approved, executed | Nine repos registered with frozen versions; `.bak` backup first |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Nine plugins staged, listed in `community-plugins.json`, and registered in BRAT `data.json`, each with a manifest-derived id | Every touched JSON re-parses; 21 ids listed; 10 BRAT frozen-version entries; ids match downloaded manifests |
| REQ-002 | The three file-layer references (four files each) plus catalog entries validate clean | `validate_document.py --type feature_catalog` = 0 issues on all 15 files |
| REQ-003 | `installed-plugins.md` lists all twenty-one enabled plugins with correct id/version/repo and validates clean | Roster present; 15 file-layer + 6 UI rows; validator 0 issues |
| REQ-004 | `SKILL.md` routes the three new plugin intents; intent-count comment matches the `INTENT_SIGNALS` key count | Three new intents present in every router surface; comment reads "twenty-two"; validator 0 issues |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Leaf-manifest freshness green for `mcp-tooling` after regeneration | `ci-leaf-manifest-freshness.cjs` OK |
| REQ-006 | Every vault write backed up first and reversible via a named rollback | Timestamped `.bak` of both JSON files exists; rollback recorded before the write |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All nine plugins are installed in the vault (21 folders, 21 activated ids, well-formed JSON) and load under Obsidian 1.13.4. **Met 2026-08-22**: verified — 21 plugin folders, `community-plugins.json` 21 ids, BRAT 10 frozen entries; app version 1.13.4 clears every `minAppVersion` floor.
- **SC-002**: The three references, roster, and catalog entries validate clean. **Met**: 16 files at `Total issues: 0`.
- **SC-003**: `SKILL.md` wiring validates clean and routes the new intents. **Met**: `validate_document.py --type skill` = 0 issues; 22 `INTENT_SIGNALS` keys, comment matches.
- **SC-004**: `validate.sh <this-folder> --strict` = Errors:0; leaf-manifest freshness OK; no unrelated repo file touched.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The target vault is iCloud-synced personal data — a write can propagate to other devices before review | High | All writes append-only; timestamped `.bak` of both JSON files before writing; named rollback recorded (remove the nine staged folders, restore both JSON from `.bak`) |
| Risk | Assuming a plugin's manifest id instead of deriving it | Med | Installer reads `manifest.json.id` from each downloaded manifest and rejects any id failing the safe-folder guard |
| Risk | A plugin's release omits `manifest.json`/`main.js` as an asset | Med | Installer falls back to `raw.githubusercontent.com/<repo>/<tag>/<file>`; a missing required asset aborts that plugin |
| Risk | Inferred plugin data-model keys presented as fact | Med | Authors read each installed plugin's `main.js` for byte-accurate keys; genuinely unconfirmed keys flagged `VERIFY`; guardrails forbid inventing key names |
| Risk | Concurrent edits to the shared `SKILL.md` by folder authors | Low | Folder authors scoped to their own files only; `SKILL.md` wiring done by a single hand after they land |
| Dependency | The `mcp-obsidian` BRAT-headless install shape (`OBS-013`/`OBS-023`) | Structural drift if not mirrored | Reused as the stage/register/activate/verify sequence |
| Dependency | The `notion-bases` reference tree as the four-file template | Inconsistent references without it | Mirrored exactly by each new folder |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Safety
- **NFR-S01**: Every vault write path is preceded by a stated backup step and followed by a named, reversible rollback.
- **NFR-S02**: No plugin id is hardcoded — each is derived from a fetched `manifest.json` and passed the safe-folder guard.

### Consistency
- **NFR-C01**: Each new reference tree mirrors the `notion-bases` four-file shape and validates under the same `--type feature_catalog` contract.
- **NFR-C02**: Every unconfirmed data-model key is flagged `VERIFY`; confirmed keys are read from the installed `main.js`.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Install Boundaries
- **Release has no `styles.css`**: optional asset, copied only when present.
- **Manifest id differs from the folder slug**: Claudian ships id `realclaudian` under display name "Claudian"; the reference folder is `claudian/` but the on-disk plugin folder is `realclaudian/`. Documented in the reference index.
- **`minAppVersion` floor**: three plugins need 1.13.0; the operator's app is 1.13.4, which clears all floors.

### Roster Boundaries
- **Minimal theme**: documented under `references/plugins/minimal/` but is a theme, not a community plugin, so it is not a roster row.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- **RESOLVED 2026-08-22**: Skill-folder split — three folders (Advanced Canvas, Claudian, Project Manager), not five; Virtual Linker and Switcher++ have no AI-authorable data model, confirmed by the plugin research.
- **RESOLVED 2026-08-22**: Obsolescence — no plugin removed; two soft overlaps documented as coexisting.
<!-- /ANCHOR:questions -->
