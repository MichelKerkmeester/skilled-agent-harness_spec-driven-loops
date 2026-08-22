---
title: "Implementation Summary: Phase 005 — Obsidian plugin-stack expansion"
description: "Nine community plugins installed into the operator's real vault via BRAT-headless (executed and verified 2026-08-22), three dedicated file-layer references plus catalog entries authored and validated, a twenty-one-plugin roster added, and the three new plugins wired into the mcp-obsidian router. Activation completes on the operator's next Obsidian open."
trigger_phrases:
  - "015 plugin expansion summary"
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
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-005-obsidian-plugin-expansion"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-obsidian-plugin-expansion |
| **Completed** | 2026-08-22 — nine-plugin real-vault install executed and verified; three references + roster + router wiring authored and validated; activation completes on the operator's next Obsidian open |
| **Level** | 2 |
| **Actual Effort** | ~0.5 hour install + ~2 hours reference authoring (three parallel authors) + ~1 hour roster/wiring/closeout |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase extended `mcp-obsidian` beyond the two migration plugins to the operator's broader stack. Nine community plugins were installed into the real vault; three of them — the ones with an AI-authorable file-layer data model — got dedicated four-file reference trees and catalog entries; a roster of all twenty-one enabled plugins was added; and the three new plugins were wired into the router.

**The nine-plugin install executed and was verified (2026-08-22).** Under an explicit operator go-ahead ("install all nine now"), a BRAT-headless installer staged each plugin's `main.js`/`manifest.json`/optional `styles.css` into `.obsidian/plugins/<id>/`, deriving every `manifest.id` from the downloaded manifest (never assumed). `community-plugins.json` went 12 → 21 ids and BRAT `data.json` gained nine frozen-version entries — both backed up to timestamped `.bak` first. Obsidian was closed during the write, so activation completes when the operator next opens it. The app is 1.13.4, which clears every plugin's `minAppVersion` floor.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/installed-plugins.md` | Created | Roster of all 21 enabled plugins: 15 file-layer (with docs) vs 6 UI/automatic (without) |
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/advanced-canvas/*` (4) | Created | Advanced Canvas reference tree — extended `.canvas` JSON schema |
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/claudian/*` (4) | Created | Claudian reference tree — in-vault agent CLIs, slash commands, MCP config |
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/project-manager/*` (4) | Created | Project Manager reference tree — `pm-task` frontmatter schema |
| `.opencode/skills/mcp-tooling/mcp-obsidian/feature-catalog/plugins/{advanced-canvas,claudian,project-manager}.md` | Created | Catalog entries for the three new plugins |
| `.opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md` | Edited | Router wiring for the three new plugins + roster; version 0.19.0.0 → 0.20.0.0; intent-count nineteen → twenty-two |
| `.opencode/skills/mcp-tooling/mcp-obsidian/changelog/v0.20.0.0.md` | Created | Release note |
| `.opencode/skills/mcp-tooling/leaf-manifest.json` | Edited | Regenerated to register the new reference files |
| (out-of-repo, real vault) nine `.obsidian/plugins/<id>/`, `community-plugins.json`, BRAT `data.json` | Created/Edited | The operator-approved, backed-up, reversible install |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The install ran through a single auditable Python installer that fetched each plugin's latest GitHub release, downloaded the assets (falling back to `raw.githubusercontent.com` at the release tag when a release omitted an asset), read the id/version straight from each downloaded `manifest.json`, validated the id against a safe-folder regex, staged the files, and upserted both JSON files — all after writing timestamped `.bak` backups. The three reference trees were authored by three parallel agents, each mirroring the `notion-bases` four-file template and grounding its data model in the installed plugin's own compiled `main.js` (Advanced Canvas node/edge keys, Claudian's `.claude/` config paths, Project Manager's `pm-task` frontmatter field set) rather than in prose — with genuinely unconfirmed keys flagged `VERIFY`. The roster and all shared `SKILL.md` router wiring were done by one hand after the folders landed, to keep the shared file internally consistent.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Three dedicated folders, not five | Advanced Canvas, Claudian, and Project Manager expose a file-layer data model an AI authors against; Virtual Linker and Switcher++ (the operator's original guess) turned out to be automatic/UI-only with no such model, confirmed by the plugin research |
| Six plugins get no dedicated docs — but are on the roster | Virtual Linker, Editing Toolbar, Notebook Navigator, Custom Frames, Switcher++, Link Favicons are UI/automatic; the roster lists them for completeness so the skill has a full picture without inventing docs there is nothing to author |
| Never hardcode a plugin id | Every id was read from the downloaded `manifest.json` and checked against a safe-folder regex; the folder slug is never assumed to equal the manifest id (Claudian ships id `realclaudian`) |
| Ground data models in `main.js`, not README prose | READMEs list features but not verbatim keys; the authors read each installed build's compiled source for byte-accurate node/edge/frontmatter keys, flagging only genuinely unresolved shapes `VERIFY` |
| No plugin removed despite two soft overlaps | Claudian (in-app agent) and Local REST API (external transport — the MCP backbone) serve different use cases; Project Manager overlaps Dataview/Notion Bases only for task tracking but is purpose-built for PM. Removing Local REST API would break the skill's MCP path |
| Reuse packet 015 as a phase parent | Operator chose to extend 015; this is child phase 5, added under the existing phase parent per lean-trio policy |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Nine plugins staged | Executed 2026-08-22: all nine written to `.obsidian/plugins/<id>/` (`main.js` + `manifest.json`, `styles.css` where present); every `manifest.id` derived from the fetched manifest and passed the safe-folder guard |
| Registration | `community-plugins.json` 12 → 21 ids (re-parses OK); BRAT `data.json` 10 frozen-version entries (re-parses OK); timestamped `.bak` of both written first |
| App compatibility | Obsidian 1.13.4 ≥ every plugin's `minAppVersion` (highest is 1.13.1); on-disk manifests confirm `project-manager` floor is 1.7.2, not the 1.13.0 the store listing implied |
| Three reference trees + catalog entries | `validate_document.py --type feature_catalog` = `Total issues: 0` on all 15 files (independently re-run per file, not only self-reported) |
| Roster | `validate_document.py` = `Total issues: 0` (valid as both `feature_catalog` and `reference`) |
| `SKILL.md` wiring | `validate_document.py --type skill` = `Total issues: 0`; 22 `INTENT_SIGNALS` keys, count comment reads "twenty-two"; three new intents present in resource map, `INTENT_SIGNALS`, `specific_plugin_intents`, `RESOURCE_MAP`, `PLUGINS` aggregate, and §8 |
| Leaf-manifest freshness | `ci-leaf-manifest-freshness.cjs` → `checked=13 fresh=13 failed=0` after `generate-leaf-manifest.cjs --write` |
| `validate.sh <this-folder> --strict` | `RESULT: PASSED`, `Errors: 0` |
| Activation | Obsidian was closed during the write; activation completes on the operator's next Obsidian open — not independently confirmed active by this session |
| Rollback | Documented and available (remove the nine staged folders; restore `community-plugins.json` and BRAT `data.json` from their `.bak-<ts>`); not needed — install succeeded |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Activation is pending the operator's next Obsidian open.** The nine plugins were staged and registered while Obsidian was closed; this session confirmed the file-layer install and registration, not that each plugin loads and runs.
2. **Some data-model keys are `VERIFY`, not confirmed.** The authors read each plugin's `main.js` for byte-accurate keys, but a few genuinely unresolved shapes remain flagged `VERIFY`: Advanced Canvas cross-portal ("interdimensional") edge serialization; Claudian's exact `.claude/*.json` config schemas; Project Manager's non-scalar `customFields` value encoding, project-side custom-field definition object, and `recurrence` fields beyond the three confirmed.
3. **Six plugins have no dedicated docs by design.** Virtual Linker, Editing Toolbar, Notebook Navigator, Custom Frames, Switcher++, and Link Favicons are UI/automatic with no AI-authorable data model; they appear on the roster only.
4. **§8 References lists the new plugins but not the seven pre-existing undocumented ones.** §8 already omitted charts/dataview/excalidraw/git/outliner/minimal/health-md before this phase; this phase added its own three plus the roster and left the pre-existing gap untouched (scope lock).
5. **Per-plugin deep research is a separate follow-up.** Optimizing each dedicated reference with a multi-iteration research pass was requested as a distinct program and is not part of this phase.
<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY (~100 lines)
- Core + Level 2 addendum
- Honest framing: install executed + verified; activation pending operator's next Obsidian open
-->
