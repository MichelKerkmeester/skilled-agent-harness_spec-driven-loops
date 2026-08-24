---
title: "Implementation Plan: Phase 003 — Notion Bases plugin knowledge tie-in"
description: "Author the notion-bases plugin reference tree (index, data model, workflows + Dataview supplement, troubleshooting), a feature-catalog entry, a manual-testing scenario, and a SKILL.md router entry, mirroring the existing Dataview plugin pattern."
trigger_phrases:
  - "015 notion bases plugin plan"
  - "notion-bases reference plan"
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
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-003-notion-bases-plugin-tie-in"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: Phase 003: Notion Bases plugin knowledge tie-in

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown authoring (4-file plugin reference tree + feature-catalog entry + manual scenario) + 1 SKILL.md router edit + 2 edited index files — no runtime code |
| **Framework** | `mcp-obsidian`'s existing per-plugin reference pattern (`references/plugins/dataview/`, `feature-catalog/plugins/dataview.md`, `manual-testing-playbook/plugin-tie-ins/`) |
| **Storage** | None (docs + `leaf-manifest.json`) |
| **Testing** | `validate_document.py --type skill`, `ci-leaf-manifest-freshness.cjs`, `validate.sh --strict` |

### Overview
Plan a Notion Bases plugin knowledge tree that reaches the same depth `mcp-obsidian` already has for Dataview: a 4-file `references/plugins/notion-bases/` set (index, data model, workflows with a Dataview supplement, troubleshooting), a `feature-catalog/plugins/notion-bases.md` entry, a manual-testing scenario (`OBS-022`), and a `PLUGIN_NOTION_BASES` router intent mirroring `PLUGIN_DATAVIEW`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 001 research verdict §5/§7/§8 read and cited
- [x] `references/plugins/dataview/*` and `feature-catalog/plugins/dataview.md` read as the authoring shape
- [x] `manual-testing-playbook/plugin-tie-ins/brat-headless-install.md` (OBS-013) read as the scenario shape
- [x] Next scenario id confirmed as `OBS-022` (highest existing id is `OBS-021`)

### Definition of Done
- [ ] `notion-bases/` 4-file tree created with the content in spec.md §4
- [ ] `feature-catalog/plugins/notion-bases.md` and `OBS-022` scenario created
- [ ] `SKILL.md` router edited additively; `manual-testing-playbook.md` index updated
- [ ] `leaf-manifest.json` regenerated; `ci-leaf-manifest-freshness.cjs` reports `OK mcp-tooling`
- [ ] `validate_document.py --type skill` = 0 issues on all created/edited files
- [ ] `validate.sh <this-folder> --strict` = Errors:0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Mirror the existing 12-plugin pattern in `mcp-obsidian` exactly — one more plugin directory, one more feature-catalog entry, one more router intent. No new architecture.

### Key Components
- **`notion-bases/notion-bases.md`**: plugin identity, version pin, activation triggers.
- **`notion-bases/data-model.md`**: `_database.md` schema — Relation, Rollup (7 functions), Lookup, self-relation subtasks, 7 view types.
- **`notion-bases/workflows.md`**: file-layer recipes + a distinct "Dataview supplement" section for aggregations the plugin doesn't cover.
- **`notion-bases/troubleshooting.md`**: failure/recovery recipes.
- **Router**: `PLUGIN_NOTION_BASES` intent added to `INTENT_SIGNALS`/`RESOURCE_MAP`/`PLUGINS` aggregate, keyed on plugin-specific nouns to avoid `PLUGIN_DATAVIEW` collision.

### Data Flow
Agent relation/rollup/view request → router scores `PLUGIN_NOTION_BASES` vs `PLUGIN_DATAVIEW` on specificity → loads the matched plugin's 4-file set → agent follows the cited recipe against the vault file layer in Phase 004.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Once implemented, this phase touches only `mcp-obsidian` (new plugin reference tree, feature-catalog entry, manual-testing scenario, SKILL.md router edit) and `leaf-manifest.json`. It does not touch `mcp-notion`, `.utcp_config.json`, `.env.example`, `opencode.json`, `mode-registry.json`, or `hub-router.json`. This spec-authoring session touches nothing outside `specs/mcp-tooling/015-notion-to-obisidian-migration/003-notion-bases-plugin-tie-in/`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Re-read `research.md` §5, §7, §8 immediately before drafting
- [ ] Re-read `references/plugins/dataview/*.md` and `feature-catalog/plugins/dataview.md` as the shape reference
- [ ] Re-read `manual-testing-playbook/plugin-tie-ins/brat-headless-install.md` (OBS-013) as the scenario shape
- [ ] Re-confirm the next free OBS-### id against the current `manual-testing-playbook.md`

### Phase 2: Core Implementation
- [ ] Author the 4-file `notion-bases/` reference tree
- [ ] Author `feature-catalog/plugins/notion-bases.md`
- [ ] Author the `OBS-022` manual scenario and register it in `manual-testing-playbook.md`
- [ ] Edit `mcp-obsidian/SKILL.md`: `PLUGIN_NOTION_BASES` intent + §8 References
- [ ] Run `generate-leaf-manifest.cjs --write .opencode/skills/mcp-tooling`

### Phase 3: Verification
- [ ] `validate_document.py --type skill` on all created/edited files — 0 issues
- [ ] `ci-leaf-manifest-freshness.cjs` — confirm `OK mcp-tooling`
- [ ] `validate.sh <this-folder> --strict` — Errors:0
- [ ] Refresh `implementation-summary.md` + continuity with the actual result
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | 4-file plugin tree, feature-catalog entry, manual scenario, SKILL.md | `validate_document.py --type skill` |
| Router logic | `PLUGIN_NOTION_BASES` scores correctly against `PLUGIN_DATAVIEW` without shadowing it | Manual read + `rg` on `INTENT_SIGNALS` |
| Manifest freshness | `leaf-manifest.json` matches the on-disk reference set | `ci-leaf-manifest-freshness.cjs` |
| Content fidelity | Every claim traces to research §5/§7/§8 | Manual cross-check against `research.md` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001 research verdict | Internal | Green | No source content |
| `references/plugins/dataview/*` shape | Internal | Green | Structural drift |
| Phase 002's router edit landing first | Internal | Planned | Two migration-flavored router edits in the same file should land in the same session to avoid a stale merge base |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: router edit collides with `PLUGIN_DATAVIEW` scoring, or the fleet audit fails after regeneration.
- **Procedure**: delete the `notion-bases/` tree, the feature-catalog entry, and the `OBS-022` scenario; revert the `SKILL.md` and `manual-testing-playbook.md` edits; regenerate `leaf-manifest.json` from the reverted tree. Contained to `mcp-obsidian`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──> Phase 2 (Core) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | Phase 004 (real-vault install needs the plugin knowledge this phase documents) |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 20 minutes |
| Core Implementation | Medium-High | 3-4 hours |
| Verification | Low | 30 minutes |
| **Total** | | **~3.5-4.5 hours** |
<!-- /ANCHOR:l2-effort -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] `SKILL.md` and `manual-testing-playbook.md` diffs reviewed before commit — additive only
- [ ] `leaf-manifest.json` diff reviewed — only the new `notion-bases/` leaves added

### Rollback Procedure
1. **Immediate**: `git checkout -- <touched files>` if the router edit is malformed
2. **Manifest**: re-run `generate-leaf-manifest.cjs --write` after reverting content files
3. **Verify**: `ci-leaf-manifest-freshness.cjs` reports `OK mcp-tooling` on the reverted tree

### Data Reversal
- **Has data migrations?** No — documentation and one generated JSON manifest only.
<!-- /ANCHOR:l2-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Level 2 addendum
- Phase dependencies and effort estimation
- Enhanced rollback procedure
-->
