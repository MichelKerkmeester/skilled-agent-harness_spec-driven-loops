---
title: Plugin Setup
description: Install dependencies, run the esbuild dev watcher or a production build, and install the plugin into an Obsidian vault for manual testing — manual copy or a symlinked dev loop.
trigger_phrases:
  - "obsidian plugin setup"
  - "npm run dev esbuild watch"
  - "install plugin into vault manually"
  - "obsidian plugins note-database folder"
  - "npm install obsidian plugin"
importance_tier: normal
contextType: implementation
version: 0.1.0.0
---

# Plugin Setup

Install dependencies, build the plugin, and load it into an Obsidian vault to see it run. This
reference covers both the build commands and the manual vault-install step neither `package.json`
nor a script automates.

---

## 1. OVERVIEW

### Purpose

Get from a clean checkout to a running plugin inside Obsidian, and to a working screenshot-
capture environment.

### Prerequisites

- Node.js and npm (the CI workflow pins Node 22 — `.github/workflows/release.yml`)
- A system Chrome, Chromium, or Edge install if you need `npm run screenshots` (no bundled
  browser download; see `../screenshot-harness.md` §2)
- An Obsidian vault to load the plugin into for manual verification

### Key Sources

- `package.json` `scripts` — `dev`, `build`, `test`, `lint`, `screenshots`, `screenshots:verify`
- `esbuild.config.mjs` — the bundler config (entry `src/main.ts`, output `main.js`)
- `README.md` — the end-user manual-installation instructions this section mirrors for
  development use

---

## 2. INSTALL AND BUILD

```bash
npm install
npm run build    # node esbuild.config.mjs production -> main.js
```

`npm run build` is the production build: minified, no inline source map. For active development:

```bash
npm run dev       # node esbuild.config.mjs (no "production" arg) -> watch mode, inline source map
```

`dev` starts an esbuild watch context (`context.watch()` in `esbuild.config.mjs`) that rebuilds
`main.js` on every source change; it does not restart Obsidian or reload the plugin for you.

---

## 3. LOAD THE PLUGIN INTO A VAULT

The repository ships no vault-symlink or install script. Two workflows both work:

**Manual copy (matches the end-user path in `README.md`).** After a build, copy the three
shipped artifacts into the target vault's plugin folder:

```bash
cp main.js manifest.json styles.css "<vault>/.obsidian/plugins/note-database/"
```

Then enable "Note Database" in Obsidian's Community plugins settings and reload if it was
already enabled (Obsidian does not hot-reload a manually replaced `main.js`).

**Symlinked dev loop.** Symlink the repository (or just the three artifacts) into the vault's
plugin folder instead of copying, so `npm run dev`'s rebuilt `main.js` is picked up without a
re-copy step on every change. You still need to disable/re-enable the plugin in Obsidian (or use
Obsidian's community "Hot Reload" plugin) to pick up a rebuilt `main.js` — this repository's own
build has no hot-reload integration.

---

## 4. VERIFY THE INSTALL

Confirm `manifest.json`'s `minAppVersion` (`1.7.2`, measured) is at or below the target vault's
Obsidian version, then open a note with `db_view: true` frontmatter, or use the plugin's own
"Add database" command, to confirm the view registers and renders. See
`../obsidian-plugin-api.md` §5 for the two registered view types this should activate.

---

## 5. RUNNING THE OTHER GATES LOCALLY

```bash
npx tsc --noEmit
npx vitest run           # or: npm test
npm run screenshots      # regenerate captures — needs a system Chrome
npm run screenshots:verify
npm run lint
```

See `../verification.md` for the full command set, measured baseline, and sequencing rules.

---

## 6. RELATED REFERENCES

- `../verification.md` — the full gate command set and measured baseline.
- `../screenshot-harness.md` — the Chrome-dependent capture pipeline `npm run screenshots` drives.
- `../release/release-verification.md` — how a tag push turns a build into a published release.
