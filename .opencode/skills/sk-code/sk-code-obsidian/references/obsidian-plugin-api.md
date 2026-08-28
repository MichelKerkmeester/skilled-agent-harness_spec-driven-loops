---
title: Obsidian Plugin API Boundary
description: The Obsidian API surface src/main.ts consumes, manifest.json's minAppVersion/isDesktopOnly contract, the onload/onunload lifecycle, and the two registered view types.
trigger_phrases:
  - "obsidian plugin api boundary"
  - "manifest.json minappversion"
  - "onload onunload lifecycle"
  - "registerview workspaceleaf"
  - "plugin entry point src main ts"
  - "isdesktoponly false"
importance_tier: normal
contextType: implementation
version: 0.1.0.0
---

# Obsidian Plugin API Boundary

The plugin's entire contract with its host is the `obsidian` module import at the top of
`src/main.ts` and the two `WorkspaceLeaf` view types it registers. This reference is that
boundary, measured from the live source, not the Obsidian API in general.

---

## 1. OVERVIEW

### Core Principle

Everything the plugin can do with the host app is reachable through one import line in
`src/main.ts` plus the per-file imports each view and modal make from `obsidian` directly.
There is no wrapper layer between this plugin and the Obsidian API — a renderer that needs
`TFile` or `Notice` imports it from `"obsidian"` itself.

### When to Use

- Adding a call into the host app (vault read/write, workspace leaf, modal, notice)
- Registering a new view type or extending an existing one
- Checking whether a change needs `isDesktopOnly` to change from `false`
- Tracing what `onload` sets up and what `onunload` must tear down

### Key Sources

- `src/main.ts` — the single `Plugin` subclass, `NoteDatabasePlugin`, 2,934 lines
- `manifest.json` — the plugin id, version, and app-compatibility contract
- `src/views/database-view.ts`, `src/views/database-file-view.ts` — the two registered views

---

## 2. THE ENTRY POINT

`src/main.ts` is the one `Plugin` subclass in the tree (`export default class NoteDatabasePlugin
extends Plugin`). Its import line names the entire top-level API surface the plugin uses directly
in that file:

```ts
import { App, Component, FuzzySuggestModal, loadMathJax, MarkdownRenderer, MarkdownView,
  Modal, Plugin, WorkspaceLeaf, Notice, TFile, normalizePath, parseYaml, stringifyYaml
} from "obsidian";
```

The root `main.js` and `main.ts` some tooling expects at repo root do not exist here — `main.js`
is the esbuild output artifact (`esbuild.config.mjs`'s `entryPoints: ["src/main.ts"]`,
`outfile: "main.js"`), and the source entry is `src/main.ts`. Do not confuse the two when citing
"the plugin entry point."

Other files import their own slice of the API directly rather than through `main.ts` re-exports:
`src/views/database-view.ts` imports `App, FileView, Menu, Scope, WorkspaceLeaf, Notice, Platform,
TFile, normalizePath, stringifyYaml, setIcon`; `src/data/data-source.ts` imports `TFile, Vault,
MetadataCache, App, normalizePath, parseYaml, stringifyYaml, EventRef, getAllTags`. There is no
central "obsidian API facade" module — grep the file you are editing for its own import line.

---

## 3. `manifest.json` CONTRACT

```json
{
  "id": "note-database",
  "name": "Note Database",
  "version": "1.2.8",
  "minAppVersion": "1.7.2",
  "isDesktopOnly": false
}
```

`isDesktopOnly: false` is load-bearing: nothing in `src/` may assume a desktop-only API
(`Platform.isDesktopOnly`, Node built-ins, Electron APIs) without gating it. `src/data/
TouchEnvironment.ts` reads `Platform.isMobile` and `Platform.isTablet` for exactly this reason —
see `mobile-and-touch.md`. `minAppVersion` (`1.7.2`) is the floor `versions.json` maps every
shipped plugin version against; bump it only when a change genuinely needs a newer host API, and
add the corresponding `versions.json` row in the same change (see `release/release-verification.md`
§3).

---

## 4. `onload` / `onunload`

`onload()` (async, `src/main.ts:84`) is where the plugin: loads and migrates settings via
`this.loadData()`, registers `DATABASE_VIEW_TYPE` and `DATABASE_FILE_VIEW_TYPE` with
`this.registerView(...)` (`main.ts:271`, `main.ts:285`), wires ribbon icons and commands, and
kicks off `this.migrateDatabasesToFiles()` (`main.ts:266`). `onunload()` (`main.ts:2741`) is the
symmetric teardown. Every listener, interval, or DOM mutation observer registered in `onload`
that Obsidian does not clean up automatically (registered views and commands are) must be
released in `onunload` or reversed via `this.register*` helpers so a plugin disable/reload does
not leak state into the next load.

---

## 5. THE TWO REGISTERED VIEWS

- `DatabaseView` (`src/views/database-view.ts`) — `export class DatabaseView extends FileView`,
  registered under `DATABASE_VIEW_TYPE`. This is the base render surface for every one of the
  seven views (table, board, gallery, list, chart, calendar, timeline).
- `DatabaseFileDashboardView` (`src/views/database-file-view.ts`) — `export class
  DatabaseFileDashboardView extends DatabaseView`, registered under `DATABASE_FILE_VIEW_TYPE`
  (`export const DATABASE_FILE_VIEW_TYPE = "note-database-file-view"`). It is not a sibling
  view; it is `DatabaseView` specialized for the per-file dashboard case (`allowNoFile = false`,
  `navigation = true`, `hideDatabaseActions` returns `true`).

Both extend `FileView`, not the bare `ItemView` — the view is always backed by a vault `TFile`
(a Markdown file carrying `db_view: true` frontmatter), never a detached, file-less panel.

---

## 6. RELATED REFERENCES

- `view-renderer-architecture.md` — the renderer family `DatabaseView` dispatches to per view
  type, and the `src/data/` pipeline it reads from.
- `data-layer.md` — `DataSource`, `RowPipeline`, and the vault-backed read/write model.
- `mobile-and-touch.md` — the `Platform.isMobile`/`isTablet` reads that keep `isDesktopOnly:
  false` honest.
