---
title: Operating the Plugin
description: Settings persistence and migration, the database-file storage model, live vault-change handling, and the manual screenshot-refresh operation that keeps captures current after a change.
trigger_phrases:
  - "obsidian plugin settings persistence"
  - "loaddata savedata migration"
  - "migratedatabasestofiles operation"
  - "keep screenshots current after a change"
  - "datasource change batch operation"
importance_tier: normal
contextType: implementation
version: 0.1.0.0
---

# Operating the Plugin

This plugin has no server process to operate — "operations" here means settings persistence and
migration, how a live vault edit reaches an open view, and the one manual step (screenshot
refresh) that keeps the packet's own evidence current after a source change.

---

## 1. OVERVIEW

### Purpose

Describe how the plugin persists and migrates its own state across loads, how it reacts to vault
changes while running, and the operational discipline that keeps the screenshot evidence trusted.

### When to Use

- Changing the shape of `PluginSettings` or `DatabaseConfig`
- Debugging why an external vault edit did not appear in an open database view
- After any change to `src/`, `tools/`, or `styles.css` that a screenshot depicts

### Core Principle

State lives in two places: Obsidian's own plugin-data store (`loadData()`/`saveData()`, settings
only) and the vault itself (each database and its records, as ordinary Markdown files). There is
no third persistence layer, no database file, and no background process.

---

## 2. SETTINGS PERSISTENCE AND MIGRATION

`onload()` calls `this.loadData()` and applies defensive, inline migrations before use
(`src/main.ts:92-135`) — for example, absorbing a legacy `typeFilter` field into the current
source-rule tree shape via `absorbTypeFilterIntoRules(...)`. `this.saveData(this.settings)`
(`main.ts:730`) persists the current shape back. There is no migration-version counter; every
load re-applies the same defensive transforms, which is safe because they are idempotent — a
settings object already in the current shape passes through unchanged. Any change to
`PluginSettings`'s shape (`src/settings.ts`) needs a matching defensive read in `onload()` if
older installs might still carry the previous shape.

---

## 3. DATABASE-FILE MIGRATION

`migrateDatabasesToFiles()` (`main.ts:2684`) is a separate, async, best-effort operation invoked
from `onload()` (`void this.migrateDatabasesToFiles()` — fire-and-forget, not awaited) that
converts older in-settings database definitions into standalone `db_view: true` Markdown files.
It logs per-database failures to the console rather than throwing, so one bad database definition
does not block the others or block plugin load. This is the operational entry point if a change
needs to add or adjust a migration step for an older database shape.

---

## 4. LIVE VAULT-CHANGE HANDLING

`DataSource` tracks vault changes as `DataChange { kind: "changed" | "created" | "deleted" |
"renamed"; path; oldPath?; origin: "plugin" | "external"; sourceInstanceId? }`, batched into
`DataChangeBatch` and emitted for `DatabaseView` to consume. The `origin` field and
`OwnedWriteCredit` mechanism (`DataSource.ts`) exist specifically to prevent the plugin's own
write from being misread as an external change and reprocessed — a write the plugin just made
carries a short-lived credit that suppresses the resulting vault-change event from being treated
as new data. See `data-layer.md` §2 for the full mechanism.

---

## 5. KEEPING SCREENSHOT EVIDENCE CURRENT — THE ONE MANUAL OPERATION

`npm run screenshots:verify` is a read-only check; it never regenerates anything. After any change
to a file a scenario's `sources` array names (a renderer, `styles.css`, or a fixture module
itself), run:

```bash
npm run screenshots         # regenerate every capture and rewrite manifest.json + the README index
npm run screenshots:verify  # confirm the regenerated manifest is now fresh
```

then open the changed PNGs — a capture succeeding proves freshness, not correctness. See
`screenshot-harness.md` §6. There is no CI job that runs this automatically; it is a manual
operation every relevant change carries.

---

## 6. ROUTINE VERIFICATION

```bash
npx tsc --noEmit
npx vitest run
npm run lint
```

Run after any settings-shape, migration, or data-pipeline change — see `../verification.md` for
the full gate and the recorded lint baseline.

---

## 7. RELATED REFERENCES

- `../data-layer.md` — the full `DataSource`/`RowPipeline` mechanics behind §3-4.
- `../screenshot-harness.md` — what a regenerated capture does and does not prove.
- `../verification.md` — the complete verification gate this operational discipline feeds into.
