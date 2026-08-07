# Iteration 1: Source-defined settings, persistence, and command surface

## Focus

Establish the source-defined BRAT settings model and distinguish the current command surface from older documentation labels.

## Findings

1. `data.json` is BRAT's persisted `Settings` object. `loadSettings()` shallow-merges `DEFAULT_SETTINGS` with `loadData()` and `saveSettings()` writes the whole settings object with `saveData()`. For a plugin whose manifest id is `obsidian42-brat`, the file-layer location is `.obsidian/plugins/obsidian42-brat/data.json`. Missing recognized keys receive defaults; this merge does not act as a strict unknown-key validator. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts] [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/manifest.json]

2. The exact supported settings keys in the current source are `pluginList`, `pluginSubListFrozenVersion`, `themesList`, `updateAtStartup`, `updateThemesAtStartup`, `enableAfterInstall`, `loggingEnabled`, `loggingPath`, `loggingVerboseEnabled`, `debuggingMode`, `notificationsEnabled`, optional/deprecated `personalAccessToken`, `globalTokenName`, `selectLatestPluginVersionByDefault`, and `allowIncompatiblePlugins`. Defaults are: lists empty; startup plugin/theme checks and enable-after-install true; logging/debug false; `loggingPath` `"BRAT-log"`; notifications true; token names/legacy token empty; latest-by-default and incompatible installs false. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts]

3. `pluginList` is the beta-repository list: an array of `OWNER/repo` strings. `pluginSubListFrozenVersion` is more than a frozen-only list despite its name: every call to `addBetaPluginToList()` ensures a record exists, using `{repo, version:"latest"}` for a moving install and the exact requested release-tag value for a pinned install. Optional record fields are deprecated `token`, `tokenName` (the SecretStorage key), and `isIncompatible`. A non-`latest` version causes bulk update code to skip that repository. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts] [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/BetaPlugins.ts]

4. `themesList` contains `{repo, lastUpdate}` objects. `lastUpdate` is a string checksum of the installed theme CSS, not a release version. The current implementation computes it as the sum of CSS character codes, so it is an update detector rather than a cryptographic integrity check. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts] [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/githubUtils.ts]

5. In current source the palette exposes one unified add command, `Plugins: Add a beta plugin for testing (with or without version)`, rather than necessarily two separate menu ids. It also exposes update-all, check-only, single-plugin update, reinstall, restart, and enable/disable commands. The public guide still describes a named frozen-version command; that is conceptually accurate, but an automation should map it to the current add flow with a specific release-tag value rather than depend on a historical command title. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts] [SOURCE: https://tfthacker.com/brat-plugins]

6. On startup BRAT waits for Obsidian's layout-ready event, then schedules plugin update checks after 60 seconds and theme checks after 120 seconds when their respective startup flags are true. These flags control later network activity; they do not replace a file-layer validation/restart after an AI changes vault files. [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/main.ts]

## Sources Consulted

- Repository settings source: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts
- Repository command source: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts
- Repository startup source: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/main.ts
- Repository manifest: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/manifest.json
- BRAT user guide: https://tfthacker.com/brat-plugins

## Assessment

- `newInfoRatio`: 1.00
- Novelty justification: this established the exact current data model, defaults, and the non-obvious `"latest"` sentinel semantics before examining install code.
- Confidence: high for schema/defaults because the claims come directly from current repository source; medium for the physical data-file location because it follows the manifest id plus Obsidian's plugin persistence convention.

## Reflection

- Worked: current source was substantially more precise than older prose around the add/freeze command naming.
- Ruled out: treating `pluginSubListFrozenVersion` as a list that only contains pinned plugins; source adds `"latest"` entries too.
- Ruled out: treating `token` in `data.json` as the supported secret store; it is marked deprecated, while `tokenName` references Obsidian SecretStorage.

## Recommended Next Focus

Trace release selection, exact asset retrieval, manifest/version compatibility logic, local writes, registration, and enablement to turn the source model into a safe file-layer workflow.
