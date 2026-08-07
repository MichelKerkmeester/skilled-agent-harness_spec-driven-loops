---
title: "Implementation Plan — Phase 13 — Iconic plugin integration"
description: "Plan for integrating the Iconic plugin + rulebook into the mcp-obsidian mode as a file-layer reference set."
trigger_phrases:
  - "phase 13 plan"
  - "iconic integration plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/013-iconic-integration"
    last_updated_at: "2026-08-03T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 13 plan"
    next_safe_action: "Execute T001-T007"
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
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan — Phase 13 — Iconic plugin integration

<!-- ANCHOR:summary -->
## 1. SUMMARY

Extend the `mcp-obsidian` mode to v1.3.1.0 with file-layer knowledge for the Iconic plugin: a per-plugin reference set, direct in-mode and parent-hub routing, catalog + playbook entry, compact schema example, canonical complete 32-rule merge payload, and changelog. The vaults already run Iconic v1.1.10 with the rulebook applied, so this phase is documentation-only. Reversible: revert the asset, routing metadata, and documentation; no vault configuration changes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| Facts | Data-model claims verified against the ACTUAL vault `data.json` (3 vaults, v1.1.10) + the bundle rulebook | python3 json diff |
| Honesty | Install state recorded as already-applied (no reinstall claims) | — |
| Shape | New reference set mirrors the validated obsidian-tables layout (index/data-model/workflows/troubleshooting) | file listing |
| Full rule asset | Canonical payload contains exactly 21 `fileRules` + 11 `folderRules`, equals the normalized rule arrays from all three live vaults, and excludes settings/overrides | python3 JSON parity check |
| Direct routing | Bare Iconic phrases select mcp-obsidian and the in-mode router loads all four Iconic references | embedded router + hub vocabulary check |
| Versioning | SKILL.md 1.3.1.0 + changelog entry + `version:` in every changed frontmatter doc | frontmatter gate |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

No code changes — documentation and routing metadata only.

- `mcp-obsidian/references/plugins/iconic/` — 4 files (index, data-model, workflows, troubleshooting).
- `references/plugins/plugin-operation-logic.md` — data map 4 → 5 rows.
- `SKILL.md` — triggers, load-on-demand list, version.
- `feature-catalog/`, `manual-testing-playbook/` — 1 card + 1 scenario (OBS-015) + index updates.
- `assets/plugins/iconic/iconic-rules.example.json` — compact schema sample (not vendored code).
- `assets/plugins/iconic/iconic-rules.full.json` — canonical complete merge-only automation payload (21 file + 11 folder rules; no settings or overrides).
- `changelog/v1.3.0.0.md` + `changelog/v1.3.1.0.md`.
- `mcp-tooling/{hub-router.json,mode-registry.json,description.json,graph-metadata.json}` — direct Iconic routing and advisor discovery.

### Context

- Plugin: id `iconic`, repo `gfxholo/iconic`, v1.1.10, enabled in all 3 vaults.
- State: `<vault>/.obsidian/plugins/iconic/data.json` — the entire configuration surface.
- Rulebook already applied: 21 `fileRules` + 11 `folderRules`, byte-identical to the Iconic-Setup bundle in all vaults.
- Rule shape: `{id, name, icon (lucide-*), color (hex), match (any/all), conditions: [{source: extension|name, operator, value}], enabled}`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Work |
|-------|------|
| Setup | Capture the real rulebook schema from vault `data.json` + bundle |
| Implementation | Author 4 reference files; update operation-logic map; SKILL.md; catalog + playbook; asset; changelog |
| Verification | Example JSON parses; SKILL.md pointers resolve; validate.sh |

Sequenced in tasks.md (T001–T009).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

File-layer verification only: the compact example and full rule payload JSON-parse; the full asset equals all three live vault rule arrays; direct Iconic terms select mcp-obsidian and its in-mode router returns the exact four-reference set; all pointers resolve; and phase-level `validate.sh` runs clean. In-app icon rendering stays out of scope (mode posture).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Vault `data.json` drift (user edits icons in-app) | Data-model doc goes stale | References cite the schema shape, not specific rule values; workflows re-read `data.json` before every operation |
| Plugin version drift (1.1.10 → newer) | New keys undocumented | Changelog pins the documented version; troubleshooting covers unknown keys |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Delete the reference folder, the catalog card, the playbook scenario, the asset, and the changelog entry; revert SKILL.md (version + triggers + resource list) and `plugin-operation-logic.md` (data map). All changes are additive — nothing existing is deleted or rewritten except the data-map table and SKILL.md sections.
<!-- /ANCHOR:rollback -->
