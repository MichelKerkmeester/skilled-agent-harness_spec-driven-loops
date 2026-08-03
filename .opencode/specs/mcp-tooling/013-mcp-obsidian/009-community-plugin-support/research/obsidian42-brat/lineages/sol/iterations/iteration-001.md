# Iteration 1: Source Schema and Install Mechanics

## Focus
This iteration investigated the first strategy focus: source archaeology for BRAT's persisted `.obsidian/plugins/obsidian42-brat/data.json` schema, collection entry shapes, defaults, and GitHub release/install pipeline. The narrow interpretation chosen was plugin and theme persistence plus plugin/theme download mechanics; command-by-command behavioral coverage is deferred except where it directly confirms install and update mechanics.

## Findings
1. BRAT persists settings through Obsidian plugin data with this current top-level model: `pluginList: string[]`, `pluginSubListFrozenVersion: PluginVersion[]`, `themesList: ThemeInforamtion[]`, booleans `updateAtStartup`, `updateThemesAtStartup`, `enableAfterInstall`, `loggingEnabled`, `loggingVerboseEnabled`, `debuggingMode`, `notificationsEnabled`, `selectLatestPluginVersionByDefault`, `allowIncompatiblePlugins`, strings `loggingPath` and `globalTokenName`, plus deprecated `personalAccessToken`. Defaults are empty arrays, startup plugin/theme updates enabled, enable-after-install enabled, logging/debugging off, notifications on, `loggingPath` set to `BRAT-log`, latest-version selection off, and incompatible installs disallowed. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts]
2. The beta-plugin list key is still `pluginList`, but version tracking is normalized into `pluginSubListFrozenVersion`. Each version record has `repo`, `version` as `"latest"` or a string tag/version, optional deprecated `token`, optional `tokenName`, and optional `isIncompatible`. Adding a plugin unshifts the repo into `pluginList` and creates or updates the matching `pluginSubListFrozenVersion` entry, even when the version is `"latest"`. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts]
3. Theme persistence uses `themesList` entries shaped as `{ repo, lastUpdate }`, where `lastUpdate` is a checksum of the downloaded theme CSS, not a manifest version. The source writes this checksum when adding or updating theme tracking, and official docs confirm themes are updated by theme-file checksum rather than `manifest.json`. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts] [SOURCE: https://tfthacker.com/brat-themes]
4. Current plugin install validation is release-first: BRAT calls GitHub releases for either a specific tag or all releases, selects a release, downloads `manifest.json` from release assets, requires `id` and `version`, and may rewrite a manifest version mismatch to the normalized release tag version. If no valid release or release manifest exists, install fails instead of falling back to repository root. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts] [SOURCE: https://tfthacker.com/brat-developers]
5. The GitHub release selector uses `https://api.github.com/repos/{repo}/releases/tags/{version}` for a pinned/frozen version and `https://api.github.com/repos/{repo}/releases` otherwise. It sorts releases by coerced semantic version when possible, falls back to publish date for non-version tags, and filters prereleases unless the caller asks to include them. BRAT's install path calls this with prereleases included while looking for `manifest-beta.json`/latest beta behavior, and frozen installs pass the requested tag. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts] [SOURCE: https://tfthacker.com/brat-developers]
6. The installed plugin files are written under `${vault.configDir}/plugins/${manifest.id}/` as `main.js`, `manifest.json`, and optional `styles.css`. After initial install, BRAT registers the repo in its settings, optionally loads the manifest and calls Obsidian `enablePluginAndSave(manifest.id)` when `enableAfterInstall` is true, and reloads manifests either way. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts] [SOURCE: https://tfthacker.com/brat-quick-guide]
7. Update mechanics skip pinned versions whose `pluginSubListFrozenVersion.version` is neither empty nor `"latest"`; latest-tracked repos are checked by comparing local manifest version to the selected release manifest version, then writing release files and reloading the plugin when the remote version is newer. The official docs' statement that frozen plugins install the specified version but do not update with other plugins matches the source. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts] [SOURCE: https://tfthacker.com/brat-plugins]
8. Theme install mechanics are deliberately different from plugins: official docs say BRAT downloads `theme-beta.css` if present, otherwise `theme.css`, saves it as `theme.css` with `manifest.json` in the vault themes folder, switches to that theme, and does not use theme `manifest.json` for update detection. [SOURCE: https://tfthacker.com/brat-themes] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/themes.ts]

## Ruled Out
- Repository-root plugin install as the current primary path: official developer docs and source both point to GitHub release assets as the source of truth for plugin `manifest.json`, `main.js`, and optional `styles.css`. [SOURCE: https://tfthacker.com/brat-developers] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts]
- A separate frozen-only persisted list replacing `pluginList`: source shows `pluginList` remains the repo membership list and `pluginSubListFrozenVersion` stores per-repo version metadata. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts]

## Dead Ends
- Direct shell `curl` to `raw.githubusercontent.com` failed in this environment with DNS resolution error, so source verification used GitHub HTML pages and official docs through the web tool instead. [SOURCE: command output: curl raw.githubusercontent.com failed with "Could not resolve host"]
- The old docs phrase "frozen version based on a release tag" is still conceptually accurate, but it no longer means a separate frozen collection. Reducer should keep the schema finding tied to current source, not historical screenshots/articles. [SOURCE: https://tfthacker.com/brat-plugins] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts]

## Edge Cases
- Ambiguous input: "release/root install pipeline" could mean BRAT's current release-asset path or older repository-root behavior. This iteration selected current v2.2.0+ release behavior and documented repository-root plugin install as ruled out for current source.
- Contradictory evidence: none found between current source and official docs on release-first plugin installs; docs still mention legacy `manifest-beta.json`, and source still attempts beta-manifest mode before standard manifest mode, so this is version-sensitive compatibility rather than a contradiction.
- Missing dependencies: memory context and resource map were unavailable per prompt; direct raw GitHub fetch via shell also failed. Fallback was GitHub source pages plus official `tfthacker.com/BRAT` documentation.
- Partial success: command-by-command behavior was only sampled where it intersected install/update semantics. Full command coverage remains for the next iteration.

## Sources Consulted
- https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts
- https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts
- https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts
- https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/themes.ts
- https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts
- https://tfthacker.com/brat-quick-guide
- https://tfthacker.com/brat-plugins
- https://tfthacker.com/brat-developers
- https://tfthacker.com/brat-themes

## Assessment
- New information ratio: 1.00
- Questions addressed: exact persisted schema, beta-plugin and version entry shapes, relevant defaults, GitHub release/install mechanics, theme install/update mechanics
- Questions answered: exact `.obsidian/plugins/obsidian42-brat/data.json` schema; current release-vs-root plugin install mechanics

## Reflection
- What worked and why: starting from `settings.ts` gave the durable persisted schema before following behavior, which prevented older docs from being mistaken for current storage shape.
- What did not work and why: raw GitHub shell fetch failed because the sandbox could not resolve `raw.githubusercontent.com`; browser-accessible GitHub pages gave enough source evidence but less convenient exact line extraction.
- What I would do differently: next iteration should focus on `PluginCommands.ts`, `AddNewPluginModal.ts`, `AddNewTheme.ts`, and failure-path branches to enumerate exact command behavior and deterministic file-layer recipes.

## Recommended Next Focus
Command behavior and file-layer recipes: map each command to source callbacks and state/file effects, then turn the schema findings into deterministic AI workflows for headless registration, release-tag pinning, enablement, and recovery from missing or stale assets.
