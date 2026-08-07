# Iteration 2: Commands, File-Layer Workflows, and Failure Branches

## Focus
This iteration mapped BRAT v2.2.0+ command behavior and source-backed file effects, then derived file-layer recipes for an AI operating an Obsidian vault. The selected interpretation was current `main` source behavior plus official BRAT documentation; older separate "add frozen plugin" wording is treated as documentation continuity because current source exposes one add-plugin command whose modal supports versions.

## Command Matrix
| Requested action | Source entry point | Verified effect | File-layer state touched |
|---|---|---|---|
| Add beta plugin | Command `AddBetaPlugin` opens `displayAddNewPluginModal(false, true)`; protocol `obsidian://brat?plugin=...` opens `AddNewPluginModal` with optional `version`. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/main.ts] | Modal ultimately installs release files via `addPlugin`, writes plugin assets, registers repo, optionally enables. Official docs say users paste a GitHub repo and BRAT installs it. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts] [SOURCE: https://tfthacker.com/brat-quick-guide] | `.obsidian/plugins/{manifest.id}/main.js`, `manifest.json`, optional `styles.css`; BRAT `data.json`; possibly `.obsidian/community-plugins.json` via Obsidian enable API. [INFERENCE: based on BRAT write path and `enablePluginAndSave` source] |
| Add pinned/frozen release | Same add modal path supports version selection/prefill; protocol handler passes `params.version` to `AddNewPluginModal`. Source records version in `pluginSubListFrozenVersion` and update loops skip version values other than empty/`latest`. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/main.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts] | Installs the requested release tag and does not update it during normal all-plugin updates. Official docs describe frozen version based on a release tag. [SOURCE: https://tfthacker.com/brat-plugins] | Same plugin asset path; BRAT `data.json` contains `pluginSubListFrozenVersion[{repo,version}]`. |
| Check all and update | Command `checkForUpdatesAndUpdate` calls `checkForPluginUpdatesAndInstallUpdates(true, false)`. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts] | Skips frozen entries, calls `updatePlugin` for latest-tracked repos, writes newer release files, reloads updated plugins, then checks graduated plugins. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts] | Plugin folders for updated plugins; no BRAT registration change unless migration/metadata already exists. |
| Check all without update | Command `checkForUpdatesAndDontUpdate` calls the same update walker with `onlyCheckDontUpdate=true`. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts] | Source reports an available update and opens/logs release info but returns before writing files. Official docs describe this as checking only. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts] [SOURCE: https://tfthacker.com/brat-plugins] | No plugin files should change during a check-only hit. |
| Update one plugin | Command `updateOnePlugin` builds a suggester from `pluginList`, filters out non-latest frozen entries, then calls `updatePlugin(repo, false, true, false, tokenName)`. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts] | Updates only a selected latest-tracked repo; frozen pinned repos are not offered. Official docs expose "Choose a single plugin to update". [SOURCE: https://tfthacker.com/brat-plugins] | Selected plugin folder only if a newer release exists. |
| Restart plugin | Command `restartPlugin` lists installed manifests and calls `reloadPlugin(id)`; `reloadPlugin` disables then enables the plugin in memory. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts] | Reloads an already installed plugin without downloading. Official docs frame this as useful for mobile/developer reloads. [SOURCE: https://tfthacker.com/brat-plugins] | No file write is implied by restart itself. |
| Add theme | Command `GrabBetaTheme` opens `AddNewTheme`; protocol `obsidian://brat?theme=...` opens `AddNewTheme` with address. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/main.ts] | `themeSave` tries `theme-beta.css`, then `theme.css`, requires `manifest.json`, writes theme files, registers checksum, and sets current theme after install. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/themes.ts] [SOURCE: https://tfthacker.com/brat-themes] | `.obsidian/themes/{manifest.name}/theme.css`, `manifest.json`; BRAT `themesList`. |
| Remove theme | No command-palette entry found; settings UI calls `themeDelete`. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/SettingsTab.ts] | Removes the repo from `themesList` and warns that files remain in the vault. Official docs confirm deleting from BRAT settings does not delete theme files. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/themes.ts] [SOURCE: https://tfthacker.com/brat-themes] | BRAT `themesList` only; installed theme folder remains. |

## Findings
1. BRAT registers commands by iterating `bratCommands` in `PluginCommands` and calling `this.plugin.addCommand` for each entry; requested plugin actions are callbacks into modal, update, reinstall, reload, enable/disable, and repository-opening helpers. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts]
2. The current add-plugin command is named "Plugins: Add a beta plugin for testing (with or without version)", so frozen/pinned release-tag installs are part of the add flow rather than a separate command entry in the current source. Protocol handling also passes an optional `version` parameter to `AddNewPluginModal`. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/main.ts]
3. Startup behavior is source-backed: after layout readiness, BRAT registers the `brat` Obsidian protocol handler, checks incompatible plugins, schedules plugin updates after 60 seconds when `updateAtStartup` is true, schedules theme updates after 120 seconds when `updateThemesAtStartup` is true, and exposes `window.bratAPI`. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/main.ts]
4. File-layer state must be kept separate: installed files in `.obsidian/plugins/{id}` do not imply enablement, enablement does not imply BRAT registration, and BRAT registration does not imply files are present. BRAT's own install path can perform all three when run inside Obsidian, but a file-layer AI must explicitly manage each state and verify it. [INFERENCE: based on https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts and https://github.com/TfTHacker/obsidian42-brat/blob/main/src/main.ts]
5. Private repository support is token-based and limited: docs call it experimental, require a token with at least read-only content access, and source stores token names in settings while retrieving actual token values from Obsidian SecretStorage. A pure file-layer workflow can write token names but cannot safely create SecretStorage secrets without Obsidian/plugin API access. [SOURCE: https://tfthacker.com/brat-private-repo] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts]
6. Failure branches are explicit for no releases, missing release `manifest.json`, missing manifest `id` or `version`, missing `main.js`, incompatible `minAppVersion`, mobile install of `isDesktopOnly`, missing local plugin manifest during update, GitHub auth/rate-limit errors, missing theme CSS, and missing theme manifest. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/themes.ts]
7. Removing a BRAT-tracked plugin or theme is registration-only: `deletePlugin` filters the repo out of `pluginList` and `pluginSubListFrozenVersion`, while `themeDelete` filters `themesList`; official docs say the installed plugin/theme must be removed separately from Obsidian settings if desired. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/themes.ts] [SOURCE: https://tfthacker.com/brat-quick-guide] [SOURCE: https://tfthacker.com/brat-themes]
8. Official protocol docs support invoking BRAT from outside Obsidian with `obsidian://brat?plugin=<repository>` or `obsidian://brat?theme=<repository>`, but they do not provide direct BRAT enable/disable actions; the same docs point users to Advanced URI or eval for enabling/disabling. [SOURCE: https://tfthacker.com/brat-protocol]

## File-Layer Recipes
These recipes are recommendations for an AI editing vault files. They are not proof that BRAT itself can run headlessly; BRAT source executes installs, enablement, reloads, and SecretStorage through Obsidian APIs. [INFERENCE: based on command/source behavior above]

### A. Headless Install + Enable
1. Resolve the target GitHub release exactly as BRAT would: pinned tag via `/releases/tags/{tag}`, otherwise latest/pre-release by BRAT's release selection rules. Download `manifest.json`, `main.js`, and optional `styles.css` from release assets. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts]
2. Validate `manifest.json` has at least `id` and `version`; reject or pause on incompatible `minAppVersion` instead of silently forcing the source's UI confirmation branch. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts]
3. Write files under `.obsidian/plugins/{manifest.id}/`. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts]
4. Enable by editing `.obsidian/community-plugins.json` only after confirming the vault uses the standard array format; example: [INFERENCE: based on BRAT calling Obsidian `enablePluginAndSave` rather than directly documenting the file format]

```json
[
  "obsidian42-brat",
  "target-plugin-id"
]
```

5. On next Obsidian launch or plugin reload, verify `app.plugins.manifests[target-plugin-id]` appears; if not, check path, manifest id, and JSON syntax. [INFERENCE: based on BRAT's `loadManifest`, `enablePluginAndSave`, and `loadManifests` calls]

### B. Register an Already Installed Plugin in BRAT
Use this only when files already exist and the repo should be managed by BRAT. Registration alone does not install or enable the plugin.

```json
{
  "pluginList": ["Owner/repo"],
  "pluginSubListFrozenVersion": [
    {
      "repo": "Owner/repo",
      "version": "latest"
    }
  ],
  "themesList": [],
  "updateAtStartup": true,
  "updateThemesAtStartup": true,
  "enableAfterInstall": true,
  "loggingEnabled": false,
  "loggingPath": "BRAT-log",
  "loggingVerboseEnabled": false,
  "debuggingMode": false,
  "notificationsEnabled": true,
  "globalTokenName": "",
  "personalAccessToken": "",
  "selectLatestPluginVersionByDefault": false,
  "allowIncompatiblePlugins": false
}
```

[SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts]

### C. Pin a Frozen Version
To pin, keep the repo in `pluginList` and set the matching version record to the release tag. Normal update cycles skip non-`latest` versions.

```json
{
  "pluginList": ["Owner/repo"],
  "pluginSubListFrozenVersion": [
    {
      "repo": "Owner/repo",
      "version": "1.2.3"
    }
  ],
  "themesList": []
}
```

For private repositories, add only a `tokenName` that already exists in Obsidian SecretStorage; do not paste token values into `data.json`.

```json
{
  "repo": "Owner/private-repo",
  "version": "latest",
  "tokenName": "brat-token-owner-private-repo"
}
```

[SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts] [SOURCE: https://tfthacker.com/brat-private-repo]

## Troubleshooting Table
| Symptom | Likely cause | Source-backed recovery |
|---|---|---|
| "No releases" or install never starts | BRAT requires valid GitHub releases for current plugin installs. | Create/publish a GitHub release with assets, or choose a specific existing tag. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts] [SOURCE: https://tfthacker.com/brat-developers] |
| Release exists but install fails | `manifest.json` missing from release assets, malformed, or missing `id`/`version`. | Add valid `manifest.json` to the release; BRAT does not accept release manifests without required fields. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts] |
| Plugin folder created with empty/partial files | `main.js` missing or asset name mismatch; source requires exact `main.js` and writes `styles.css` only if found. | Publish release assets with exact names `main.js`, `manifest.json`, optional `styles.css`; reinstall. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts] |
| Plugin does not appear after file-layer install | Files installed but Obsidian manifest cache or enablement state not refreshed. | Restart Obsidian, run BRAT restart/reload if visible, or use Obsidian API/Advanced URI to enable; verify `.obsidian/community-plugins.json`. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts] [SOURCE: https://tfthacker.com/brat-protocol] |
| BRAT keeps tracking a plugin after uninstall | BRAT registration remains in `data.json`. | Remove repo through BRAT settings or delete it from both `pluginList` and `pluginSubListFrozenVersion`. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts] [SOURCE: https://tfthacker.com/brat-quick-guide] |
| Private repo fails | Missing/invalid token, insufficient content read permission, or SecretStorage token missing for `tokenName`. | Create a read-only token per docs, store it in BRAT/SecretStorage, then keep only `tokenName` in settings. [SOURCE: https://tfthacker.com/brat-private-repo] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts] |
| Incompatible plugin rejected | `manifest.minAppVersion` is higher than current Obsidian, or `isDesktopOnly` on mobile. | Upgrade Obsidian or avoid install; source only permits forced incompatible installs through user confirmation when allowed. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts] |
| Theme add/update fails | No `theme-beta.css`/`theme.css`, no `manifest.json`, or GitHub cache still stale. | Add required root files; wait for GitHub cache; unregister/delete local files if BRAT gets confused. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/themes.ts] [SOURCE: https://tfthacker.com/brat-themes] |
| Removing theme from BRAT does not delete files | `themeDelete` only removes registration. | Delete the theme from Obsidian Appearance settings if file removal is desired. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/themes.ts] [SOURCE: https://tfthacker.com/brat-themes] |

## Ruled Out
- BRAT as a fully headless installer: current source paths rely on Obsidian modals, vault adapter APIs, plugin manager APIs, protocol handler, and SecretStorage. File-layer recipes are derived workflows, not native headless BRAT commands. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/main.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts]
- Direct BRAT protocol enable/disable: official protocol docs point to Advanced URI/eval for enable/disable rather than BRAT protocol commands. [SOURCE: https://tfthacker.com/brat-protocol]
- Theme removal as file deletion: source and docs both say unregistering a theme leaves theme files in the vault. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/themes.ts] [SOURCE: https://tfthacker.com/brat-themes]

## Dead Ends
- Direct shell fetch to `raw.githubusercontent.com` was not retried because strategy marked it failed in iteration 1; browser-accessible GitHub source pages and cached raw views were used instead. [SOURCE: .opencode/specs/mcp-tooling/013-mcp-obsidian/009-community-plugin-support/research/obsidian42-brat/lineages/sol/deep-research-strategy.md]
- The exact internals of `AddNewPluginModal` and `AddNewTheme` were not fully available through the accessible source views in this pass, so modal UI details remain lower confidence. Command entry points and downstream file effects were still source-verified through `PluginCommands`, `main`, `BetaPlugins`, and `themes`. [INFERENCE: based on successful and failed source retrieval during this iteration]

## Edge Cases
- Ambiguous input: "remove theme" could mean unregister from BRAT or delete from disk. Source and docs support unregister-only for BRAT; disk deletion belongs to Obsidian Appearance/manual cleanup.
- Contradictory evidence: none that changed behavior. Older docs mention a separate "frozen version" command label, while current source exposes one add command "with or without version"; treated as UI evolution.
- Missing dependencies: cached memory and resource map unavailable per prompt; direct raw shell fetch avoided after iteration 1 failure.
- Partial success: modal internals were not fully inspected, but command callbacks, downstream source behavior, and official docs covered all required output categories.

## Sources Consulted
- https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts
- https://github.com/TfTHacker/obsidian42-brat/blob/main/src/main.ts
- https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts
- https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts
- https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/themes.ts
- https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts
- https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/SettingsTab.ts
- https://tfthacker.com/brat-quick-guide
- https://tfthacker.com/brat-plugins
- https://tfthacker.com/brat-themes
- https://tfthacker.com/brat-private-repo
- https://tfthacker.com/brat-protocol

## Assessment
- New information ratio: 0.90
- Questions addressed: command behavior; deterministic file-layer workflows; failure modes and recovery
- Questions answered: all three carried-forward questions at source-backed implementation level, with modal UI internals left as a residual uncertainty

## Reflection
- What worked and why: following command callbacks into downstream feature code kept UI labels, state writes, file writes, and docs aligned without rediscovering iteration 1 schema.
- What did not work and why: modal source access was incomplete, so the iteration relies on command construction plus downstream install/update/theme behavior instead of modal field-by-field proof.
- What I would do differently: if another pass were allowed, fetch a clean repository checkout outside the restricted DNS path or inspect packaged release source maps to confirm modal field validation and version-picker behavior.

## Recommended Next Focus
No further required iteration under the current two-iteration cap. If resumed later, inspect `AddNewPluginModal.ts`, `AddNewTheme.ts`, and `VersionSuggestModal.ts` directly to close the remaining modal UI uncertainty.
