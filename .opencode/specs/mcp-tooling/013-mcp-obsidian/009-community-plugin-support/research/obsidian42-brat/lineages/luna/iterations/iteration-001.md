# Iteration 1: Plugin Source Schema and Command Registration

## Focus
This iteration investigated BRAT's persisted `.obsidian/plugins/obsidian42-brat/data.json` model and command registration surface, using the strategy's next focus. The narrow interpretation was source schema, list shapes, version-pin semantics, and registered command inventory. Install mechanics and edge-case behavior were only captured where they directly explain schema or command behavior.

## Actions Taken
1. Read the lineage config, state log, strategy, and findings registry before research.
2. Verified the packet-local write boundary: only this iteration narrative, the append-only state log, and this iteration delta are writable.
3. Consulted BRAT source files for settings, command registration, plugin update behavior, release asset lookup, and source-backed docs pages.
4. Cross-checked source behavior against official BRAT documentation pages for user-facing plugin/theme behavior.

## Findings
1. BRAT persists settings by merging `loadData()` over `DEFAULT_SETTINGS`, so omitted keys in `data.json` inherit defaults at runtime rather than needing to exist on disk. The v2.2+ source settings model includes `pluginList`, `pluginSubListFrozenVersion`, `themesList`, startup/update/install/logging/notification flags, token-name fields, latest-version default selection, and incompatible-plugin override. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/main.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts]
2. The exact default data model is: `pluginList: []`, `pluginSubListFrozenVersion: []`, `themesList: []`, `updateAtStartup: true`, `updateThemesAtStartup: true`, `enableAfterInstall: true`, `loggingEnabled: false`, `loggingPath: "BRAT-log"`, `loggingVerboseEnabled: false`, `debuggingMode: false`, `notificationsEnabled: true`, `globalTokenName: ""`, `personalAccessToken: ""`, `selectLatestPluginVersionByDefault: false`, and `allowIncompatiblePlugins: false`. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts]
3. `pluginList` is a string array of GitHub repository paths such as `TfTHacker/obsidian42-brat`; `pluginSubListFrozenVersion` is an array of objects shaped as `{repo, version, token?, tokenName?, isIncompatible?}`; `themesList` is an array of `{repo, lastUpdate}` where `lastUpdate` is a checksum of the theme file. Deprecated `token` is intentionally written as `undefined`; active private access is represented by `tokenName`, with token values stored in Obsidian SecretStorage rather than `data.json`. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts]
4. Version-pin semantics are source-defined: update sweeps build a map from `pluginSubListFrozenVersion`, skip entries whose `version` is truthy and not `"latest"`, and update entries with missing/empty version or `"latest"`. Therefore a frozen pin is any non-empty release tag other than `"latest"`; ordinary/latest-tracking installs can still have an entry in `pluginSubListFrozenVersion`. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts]
5. BRAT command registration is centralized in `PluginCommands`: the constructor loops through `bratCommands` and calls `this.plugin.addCommand({id, name, icon, callback})` for each. The registered command IDs found in source are `AddBetaPlugin`, `checkForUpdatesAndUpdate`, `checkForUpdatesAndDontUpdate`, `updateOnePlugin`, `reinstallOnePlugin`, `restartPlugin`, `disablePlugin`, `enablePlugin`, `openGitHubZRepository`, `openCommunityPagePlugin`, `openGitHubRepoTheme`, `opentPluginSettings`, `GrabBetaTheme`, `updateBetaThemes`, `removeGraduatedFromBrat`, `updateGraduatedToStableAndRemove`, and `allCommands`. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts]
6. Source and docs align that BRAT expects a GitHub repository path for plugin testing and takes over download/copy/update work. The official docs describe adding a repository path and state that BRAT downloads updates and reloads the plugin; source shows release asset installation writes `main.js`, `manifest.json`, and optional `styles.css` to `.obsidian/plugins/<manifest.id>/`. [SOURCE: https://tfthacker.com/BRAT] [SOURCE: https://tfthacker.com/brat-plugins] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts]
7. Source-backed release selection is release-centric, not root-file-centric: BRAT calls GitHub releases, can fetch a specific tag via `/releases/tags/<version>`, otherwise sorts releases by semver-coerced tag then date, and downloads release assets by exact names. This directly explains the data-model meaning of release-tag pins in `pluginSubListFrozenVersion.version`. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts]
8. Theme registration shares `data.json` but uses a separate list: `themesList` stores repository path plus checksum. Official theme docs state BRAT downloads `theme.css` and `manifest.json` into the vault themes folder, tries `theme-beta.css` before `theme.css`, and uses file checksum/change detection rather than theme manifest versioning. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts] [SOURCE: https://tfthacker.com/brat-themes]

## Questions Answered
- What exact persisted `data.json` keys, defaults, list shapes, and version-pin semantics does BRAT use?
- Which BRAT commands are registered in source, and which source callbacks back the add/update/restart/theme surfaces?

## Questions Remaining
- Full command behavior details still need deeper tracing through modals, delete/update helpers, and settings UI.
- Full vault-file install mechanics need dedicated tracing of release asset validation, manifest fallback, minAppVersion handling, `community-plugins.json` enablement, and reload order.
- Safe headless AI workflows still need synthesis from BRAT source plus Obsidian vault-file behavior.
- Error and edge-case catalog still needs a dedicated pass over `githubUtils`, modals, settings UI, private-repo token docs, and notification paths.

## Ruled Out
- Treating `pluginSubListFrozenVersion` as only frozen plugins was ruled out: source adds or updates an entry for every registered plugin and only treats truthy non-`"latest"` versions as update-skipped pins. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts]
- Treating repository-root `manifest.json` as the primary v2.2 install source was ruled out for the plugin install path: current source asks GitHub releases for `manifest.json` and assets, with fallback/compatibility behavior to trace further next iteration. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts]

## Dead Ends
- Direct raw fetches for some guessed source URLs initially failed through the web cache, so the successful path was GitHub tree navigation plus specific file opens. This is not a source dead end; it is a tooling access note.

## Edge Cases
- Ambiguous input: The overall topic asks for every command and full workflows, but this iteration's focus was narrower. Deferred command mechanics, headless workflows, and troubleshooting catalog to later iterations.
- Contradictory evidence: None found in this iteration.
- Missing dependencies: `resource-map.md` was absent per config/state; no coverage map was available. Fallback was strategy plus direct source/doc discovery.
- Partial success: Progressive synthesis is enabled in config, but the dispatch allowed-write list excludes `research.md`; the synthesis update was not performed and is recorded under scope violations.

## SCOPE VIOLATIONS
- Would-be mutation skipped: `research/research.md` progressive synthesis update. Reason: `progressiveSynthesis` is `true`, but the dispatch explicitly allowed only the iteration narrative, state log append, and delta file writes. No out-of-scope write was attempted.

## Sources Consulted
- https://github.com/TfTHacker/obsidian42-brat/blob/main/src/main.ts
- https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts
- https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts
- https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts
- https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts
- https://tfthacker.com/BRAT
- https://tfthacker.com/brat-plugins
- https://tfthacker.com/brat-themes

## Assessment
- New information ratio: 1.00
- Questions addressed: data.json schema, defaults, list shapes, version-pin semantics, command registration
- Questions answered: exact persisted data.json keys/defaults/list shapes/version-pin semantics; command registration inventory

## Reflection
- What worked and why: GitHub source navigation gave precise schema and callback anchors, and the docs pages confirmed the user-facing interpretation without overriding source behavior.
- What did not work and why: Raw-source URL fetches were inconsistent through the web cache, so source retrieval needed GitHub HTML/tree fallback.
- What I would do differently: Trace `AddNewPluginModal`, settings UI deletion/edit flows, and `githubUtils` release helper paths next, because those explain user-visible command behavior and the edge-case catalog.

## Next Focus
Trace full command behavior through `AddNewPluginModal`, settings UI actions, plugin delete/update/reinstall helpers, and theme add/remove flows, with special attention to frozen-version editing and removal semantics.

## Recommended Next Focus
Full command behavior: add beta plugin, add with release-tag pin, check/update all, update single, reinstall, restart, enable/disable, graduated-plugin commands, and theme add/update/remove behavior.
