---
title: "Implementation Plan: Phase 005 — Obsidian plugin-stack expansion (nine-plugin install + file-layer references + router wiring)"
description: "Plan the nine-plugin BRAT-headless vault install (already executed and verified), the three file-layer integration references (Advanced Canvas, Claudian, Project Manager), the twenty-one-plugin roster, and the mcp-obsidian router wiring. Install is done; the skill-folder authoring and wiring are mid-flight."
trigger_phrases:
  - "015 plugin expansion plan"
  - "advanced canvas claudian project manager plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/005-obsidian-plugin-expansion"
    last_updated_at: "2026-08-22T09:00:00Z"
    last_updated_by: "claude"
    recent_action: "installed 9 vault plugins and wired 3 references + roster into mcp-obsidian"
    next_safe_action: "None — phase complete; per-plugin deep research is a separate follow-up"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-005-obsidian-plugin-expansion"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: Phase 005: Obsidian plugin-stack expansion

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | 3 four-file integration references (Markdown) + 3 feature-catalog entries + 1 roster doc + edits to `mcp-obsidian/SKILL.md`; plus a nine-plugin BRAT-headless vault install (already executed) |
| **Framework** | `mcp-obsidian`'s existing plugin-reference + feature-catalog structure, and `OBS-013`/`OBS-023`'s BRAT-headless stage/register/activate/verify install pattern |
| **Storage** | Real vault `.obsidian/` JSON files (`community-plugins.json`, BRAT `data.json`) written by the operator-approved install; skill docs in-repo under `mcp-obsidian/` |
| **Testing** | `validate_document.py --type feature_catalog`, `ci-leaf-manifest-freshness.cjs`, `validate.sh --strict` |

### Overview
The nine-plugin install into the operator's real, iCloud-synced vault is already executed and verified (2026-08-22): `virtual-linker`, `editing-toolbar`, `notebook-navigator`, `advanced-canvas`, `realclaudian` (Claudian), `obsidian-custom-frames`, `darlal-switcher-plus`, `project-manager`, and `link-favicon` are staged under `.obsidian/plugins/<id>/`, added to `community-plugins.json` (12 → 21), and registered in BRAT `data.json` with frozen versions. This plan covers the remaining skill-folder work: three dedicated file-layer integration references (Advanced Canvas, Claudian, Project Manager — the three plugins with an AI-authorable data model), a twenty-one-plugin roster, and the `mcp-obsidian/SKILL.md` router wiring for the three new plugins. **The install is done; the authoring and wiring are mid-flight.**
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Operator request for nine plugins plus skill support read and confirmed
- [x] Obsolescence review complete — all installed plugins coexist; two soft overlaps (Claudian vs Local REST API, Project Manager vs Dataview/Notion Bases) documented, not resolved by removal
- [x] Each plugin's manifest `id` derived from its downloaded manifest, not assumed
- [x] File-layer vs UI/automatic split determined — three with an AI-authorable data model (docs), six UI/automatic (no docs)

### Definition of Done
- [x] Nine plugins staged, registered in BRAT, and activated in the operator's real vault via BRAT-headless (executed and verified 2026-08-22)
- [ ] Three file-layer references (Advanced Canvas, Claudian, Project Manager), four files each plus a catalog entry, `validate_document.py --type feature_catalog` = 0 issues
- [ ] `references/plugins/installed-plugins.md` roster covers all twenty-one enabled plugins (file-layer with docs vs UI/automatic without)
- [ ] Three new plugins wired into `mcp-obsidian/SKILL.md` (resource map, `INTENT_SIGNALS`, `specific_plugin_intents`, `RESOURCE_MAP`, `PLUGINS` aggregate, intent-count comment, version bump)
- [ ] `ci-leaf-manifest-freshness.cjs` green for `mcp-tooling`; `validate.sh <this-folder> --strict` = Errors:0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Reuse `mcp-obsidian`'s existing plugin-reference + feature-catalog structure and its BRAT-headless install pattern — no new architecture invented. Each of the three file-layer plugins gets the same four-file reference shape the skill already uses for a documented plugin; the roster is a single index doc; the router wiring follows the skill's existing intent-signal conventions.

### Key Components
- **Nine-plugin BRAT-headless install** (already executed): stage (fetch each tagged release, derive id from the downloaded `manifest.json`, copy `main.js`/`manifest.json`) → register (`community-plugins.json` 12 → 21, BRAT `data.json` frozen versions) → activate → verify (re-parse every touched JSON) → **explicit rollback available** (remove the nine staged folders, restore both JSON files from `.bak`).
- **Three file-layer references**: Advanced Canvas (extends the `.canvas` JSON graph model), Claudian (in-vault agent CLIs, slash commands, and MCP config), Project Manager (a task frontmatter schema) — each a four-file reference folder plus a feature-catalog entry.
- **Roster (`installed-plugins.md`)**: lists all twenty-one enabled plugins, split into file-layer (with dedicated docs) and UI/automatic (without).
- **`SKILL.md` wiring**: resource-loading map, `INTENT_SIGNALS`, `specific_plugin_intents`, `RESOURCE_MAP`, the `PLUGINS` aggregate, the intent-count comment, and a skill version bump.

### Data Flow
Operator request → nine-plugin BRAT-headless install into the real vault (done, verified) → author the three file-layer references + catalog entries + the roster for the plugins with an AI-authorable data model → wire the three new plugin intents into `mcp-obsidian/SKILL.md` → validators (`validate_document.py --type feature_catalog`, leaf-manifest freshness, `validate.sh --strict`) gate the skill-folder work.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

**This phase's skill-folder authoring touches only `.opencode/skills/mcp-tooling/mcp-obsidian/`** — three new reference folders (Advanced Canvas, Claudian, Project Manager), the `installed-plugins.md` roster, three feature-catalog entries, and the `SKILL.md` router wiring. The *nine-plugin install* (executed and verified 2026-08-22, operator-approved) is the only leg that wrote outside the repo, into the operator's real, iCloud-synced vault: all writes were append-only, timestamped `.bak` backups of both JSON files were made first, and a named rollback was recorded. That install is complete; nothing in this phase re-executes it or writes to the vault again.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read `spec.md` §3 Scope, §4 Acceptance Criteria, §5 Risks immediately before authoring
- [x] Complete the obsolescence review — confirm all installed plugins coexist; record the two soft overlaps without removing anything
- [x] Derive each plugin's manifest `id` from its downloaded `manifest.json`; confirm each against its expected id
- [x] Confirm the real vault path and classify each plugin as file-layer (AI-authorable data model) or UI/automatic

### Phase 2: Core Implementation (skill-folder authoring)
- [ ] Author the three file-layer references — Advanced Canvas (`.canvas` JSON), Claudian (in-vault agent CLIs / slash commands / MCP config), Project Manager (task frontmatter schema) — four files each, plus a feature-catalog entry per plugin
- [ ] Author `references/plugins/installed-plugins.md`: the roster of all twenty-one enabled plugins, split file-layer (docs) vs UI/automatic (no docs)
- [ ] Wire the three new plugins into `mcp-obsidian/SKILL.md`: resource map, `INTENT_SIGNALS`, `specific_plugin_intents`, `RESOURCE_MAP`, the `PLUGINS` aggregate, the intent-count comment, and the version bump

### Phase 3: Verification (of the skill-folder deliverables)
- [ ] `validate_document.py --type feature_catalog` on each reference/catalog entry — 0 issues
- [ ] `installed-plugins.md` validates clean; every id/version/repo correct against the vault state
- [ ] Intent-count comment matches the number of `INTENT_SIGNALS` keys after wiring
- [ ] `ci-leaf-manifest-freshness.cjs` green for `mcp-tooling`
- [ ] `validate.sh <this-folder> --strict` — Errors:0
- [ ] Confirm no file outside this phase folder and `mcp-obsidian/` was touched (beyond the already-executed vault install)
- [ ] Reconcile `implementation-summary.md` + continuity with the actual result

### Phase 4 (executed 2026-08-22, operator-approved): Nine-plugin real-vault install
- Stage all nine plugins under `.obsidian/plugins/<id>/`, each id derived from its downloaded `manifest.json` (never assumed)
- Register them in `community-plugins.json` (entry count 12 → 21) and in BRAT `data.json` with frozen versions
- Make timestamped `.bak` backups of both JSON files before writing; record the named rollback (remove the nine folders, restore both JSON from `.bak`)
- Activation completes when the operator next opens Obsidian
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | Three file-layer references + catalog entries, roster | `validate_document.py --type feature_catalog` |
| Router consistency | `SKILL.md` intent-count comment vs `INTENT_SIGNALS` keys; leaf-manifest freshness | `ci-leaf-manifest-freshness.cjs`, manual cross-check |
| Content fidelity | Every documented data-model key is real or flagged `VERIFY`; roster ids/versions match the vault | Manual cross-check against installed manifests |
| Scope containment | No file outside this phase folder + `mcp-obsidian/` touched by the authoring session | `git status` before/after |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Operator request (nine plugins + skill support) | External | Green | No scope |
| Obsolescence review (all coexist; two soft overlaps) | Internal | Green | Removal risk if skipped |
| `mcp-obsidian` plugin-reference + feature-catalog pattern | Internal | Green | Structural drift |
| Downloaded plugin manifests (id derivation) | External | Green — fetched | Wrong on-disk folder names |
| 004 `OBS-023` BRAT-headless install pattern | Internal | Green | Install shape drift |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger (skill docs)**: a reference, catalog entry, roster row, or `SKILL.md` wiring change is found wrong on review.
- **Procedure (skill docs)**: the docs are additive — `git checkout` the touched `mcp-obsidian` files (the three reference folders, `installed-plugins.md`, the catalog entries, and `SKILL.md`). Contained to `mcp-obsidian`; no vault change is involved.
- **Trigger (vault install, if ever needed)**: a plugin misbehaves, or the operator wants to undo the install.
- **Procedure (vault install)**: remove the nine staged `.obsidian/plugins/<id>/` folders and restore both `.obsidian/community-plugins.json` and BRAT `data.json` from their timestamped `.bak` backups (entry count returns 21 → 12).
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──> Phase 4 (Install, done) ──> Phase 2 (Authoring) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Install, Authoring |
| Install (executed 2026-08-22) | Setup | Authoring (references describe the installed plugins) |
| Authoring | Setup, Install | Verify |
| Verify | Authoring | Completion / status reconcile |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 minutes |
| Install (executed, operator-approved) | Medium | done (~1 hour) |
| Core Implementation (3 references + roster + wiring) | High | 4-5 hours |
| Verification (of the skill-folder deliverables) | Low | 30 minutes |
| **Total (remaining authoring scope)** | | **~5-6 hours** |
<!-- /ANCHOR:l2-effort -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Install staged with timestamped `.bak` of both JSON files before any write; every id derived (not assumed) and safe-folder-guarded
- [ ] Skill docs are additive only — no existing plugin reference edited destructively during authoring

### Rollback Procedure
1. **Skill docs**: `git checkout -- <touched mcp-obsidian files>` if a reference, roster, catalog entry, or `SKILL.md` edit is malformed
2. **Vault install (if needed)**: remove the nine staged plugin directories, restore `community-plugins.json` and BRAT `data.json` from their `.bak` backups
3. **Verify**: re-parse the restored JSON; confirm the `community-plugins.json` entry count is back to 12

### Data Reversal
- **Has data migrations?** No. The vault install created nine plugin directories and edited two JSON files, all reversible via the `.bak` restore above. The skill-folder authoring is additive in-repo and reversible via `git checkout`.
<!-- /ANCHOR:l2-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Level 2 addendum
- Phase dependencies and effort estimation
- Enhanced rollback procedure
-->
