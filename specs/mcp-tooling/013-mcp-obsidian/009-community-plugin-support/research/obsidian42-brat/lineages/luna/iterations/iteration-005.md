# Iteration 5: Command and Install Gap Closure

## Focus
This final pass kept the reducer-supplied non-token error focus, but narrowed it to the two still-open gaps: every BRAT command's behavior and the exact release/root asset-fetch plus vault-file install mechanics. The selected interpretation was: close command/install knowledge needed by a file-layer AI, then record remaining negative knowledge explicitly.

## Actions Taken
1. Read packet config, state log, strategy, and findings registry before selecting focus.
2. Verified `iteration-005.md` and `iter-005.jsonl` did not already exist and that intended writes stay inside the lineage packet.
3. Re-read `PluginCommands.ts` around command registration and command callbacks.
4. Re-read `BetaPlugins.ts` around repository validation, release-file download/write, install/update/enable/reload behavior, and frozen-update skips.
5. Re-read `githubUtils.ts` and official BRAT documentation around release selection, exact asset lookup, and theme/community-list mechanics.

## Findings
1. The command catalog is source-complete in `PluginCommands.ts`: commands are array entries registered by the constructor through `plugin.addCommand`, with visible command IDs for adding beta plugins, update check/update, check-only, single-plugin update, reinstall, restart, disable, enable, open GitHub/plugin community pages, open settings, add/update themes, graduated-plugin removal/update, and an all-commands chooser. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts#L1124-L1242] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts#L1781-L1916]
2. "Add beta plugin" opens the add-new-plugin modal with the command path `displayAddNewPluginModal(false, true)`; install behavior then flows through `addPlugin`, which first tries release `manifest-beta.json`, then release `manifest.json`, rejects missing manifests or missing `version`, checks `minAppVersion`, checks mobile `isDesktopOnly`, and only proceeds to release asset download/write after validation. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts#L1124-L1139] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts#L2524-L2648] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts#L2730-L2815]
3. Plugin installation is release-asset based: BRAT selects a release by exact tag for a frozen version or by latest semver/date otherwise, fetches exact assets named `main.js`, `manifest.json`, and optional `styles.css`, then writes `main.js`, `manifest.json`, and optional `styles.css` into `.obsidian/plugins/<manifest.id>/`. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts#L2628-L2756] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts#L2410-L2459] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts#L2477-L2493]
4. The install side effects are ordered: after release-file write, BRAT adds or updates the repo in BRAT settings via `addBetaPluginToList`; if `enableAfterInstall` is true, it loads the manifest from Obsidian's plugin folder and calls `enablePluginAndSave`; then it reloads manifests. A file-layer AI should therefore treat `.obsidian/plugins/<id>/` files, BRAT `data.json`, and `.obsidian/community-plugins.json` enablement as related but distinct artifacts. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts#L2819-L2853] [INFERENCE: based on BRAT calling Obsidian `enablePluginAndSave` after release-file writes and prior iterations' schema findings for `pluginList` and `pluginSubListFrozenVersion`]
5. Update commands split cleanly: "check and update all" calls `checkForPluginUpdatesAndInstallUpdates(true, false)`, "check only" calls the same function with `onlyCheckDontUpdate=true`, and "update one" offers only non-frozen or latest-tracking repos before calling `updatePlugin`. The update sweep also skips entries whose stored version is truthy and not `latest`. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts#L1143-L1244] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts#L3150-L3187]
6. Reinstall and restart are not the same operation: reinstall offers a filtered list, calls `updatePlugin(..., forceReinstall=true)`, rewrites release files, reloads manifests, and reloads the plugin if enabled; restart lists installed manifests and calls `reloadPlugin`, which only disables then enables the selected plugin. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts#L1250-L1318] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts#L2852-L2869] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts#L3068-L3084]
7. Enable/disable commands are Obsidian plugin-state operations, not BRAT registry edits: they list manifests by enabled state and call `disablePluginAndSave` or `enablePluginAndSave`. The GitHub/community-page commands are navigation helpers that fetch Obsidian community plugin/theme lists and open GitHub or `obsidian.md/plugins` URLs. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts#L1325-L1524] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts#L2324-L2388]
8. Theme commands use a different path from plugins: "Grab beta theme" opens `AddNewTheme`, "Update beta themes" calls `themesCheckAndUpdates`, and the shared utility fetches repository-root `theme-beta.css` or `theme.css` plus root `manifest.json`, tracking CSS checksum instead of release `manifest.json.version`. Official BRAT docs also warn that theme handling follows a different process than plugins. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts#L1530-L1644] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts#L2392-L2488] [SOURCE: https://tfthacker.com/brat-developers]
9. Graduated-plugin commands are v2.2-era command coverage: one removes the repo from BRAT while keeping the plugin installed, and the other installs the community stable release using the matched stable version, force-reinstalls and enables it, then removes it from BRAT on success. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts#L1648-L1777] [SOURCE: https://www.obsidianstats.com/plugins/obsidian42-brat]

## Ruled Out
- Retrying local raw GitHub fetches remained out of scope because prior iterations recorded that path as blocked; this pass used GitHub HTML source and official docs instead.
- Treating "restart plugin" as reinstall/update was ruled out: restart only disables/enables an installed plugin, while reinstall goes through `updatePlugin` with `forceReinstall=true`. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts#L1250-L1318] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts#L3068-L3084]
- Treating enable/disable as BRAT registration was ruled out: those commands save Obsidian plugin enablement state, while BRAT registry changes happen through `addBetaPluginToList` and `deletePlugin`. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts#L1325-L1398] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts#L3221-L3235]

## Dead Ends
- Direct source access to `AddNewPluginModal.ts`, `VersionSuggestModal.ts`, and `AddNewTheme.ts` returned cache misses through the web tool. The command/install mechanics were still source-backed through `PluginCommands.ts`, `BetaPlugins.ts`, `githubUtils.ts`, and official BRAT docs, so this is a source-access limitation rather than an unanswered behavior gap.

## Edge Cases
- Ambiguous input: The strategy next focus repeated the already-answered error catalog while two open questions remained. I chose the narrowest evidence-backed interpretation: use the error focus to close command and install gaps.
- Contradictory evidence: None. Source and official docs agree that plugin installs are release-centric while themes are root-file/checksum-centric.
- Missing dependencies: Direct page fetches for modal files cache-missed; fallback was command callback plus install/update source.
- Partial success: The command and install questions are now answered from primary source, but modal microcopy and every modal branch were not exhaustively traced.

## Sources Consulted
- https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts
- https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts
- https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts
- https://tfthacker.com/BRAT
- https://tfthacker.com/brat-plugins
- https://tfthacker.com/brat-developers
- https://tfthacker.com/brat-themes
- https://www.obsidianstats.com/plugins/obsidian42-brat

## Assessment
- New information ratio: 0.78
- Questions addressed:
  - What does every BRAT command do, including beta plugins, frozen release tags, updates, restart, and themes?
  - What exact release/root asset-fetch and vault-file install/enabling mechanics does BRAT implement?
  - Which non-token errors and edge cases occur, and what source-backed AI recipes and troubleshooting checks address them?
- Questions answered:
  - What does every BRAT command do, including beta plugins, frozen release tags, updates, restart, and themes?
  - What exact release/root asset-fetch and vault-file install/enabling mechanics does BRAT implement?

## Reflection
- What worked and why: Following callbacks from `PluginCommands.ts` into `BetaPlugins.ts` produced a compact behavioral map without depending on unavailable modal files.
- What did not work and why: Direct modal-file fetches cache-missed, which prevented source-backed claims about every UI branch inside add-plugin/add-theme modals.
- What I would do differently: If another pass existed, use a local clone or GitHub API archive to inspect modal files directly, then compare modal branch behavior against the callback/install model here.

## Questions Answered
- What does every BRAT command do, including beta plugins, frozen release tags, updates, restart, and themes?
- What exact release/root asset-fetch and vault-file install/enabling mechanics does BRAT implement?

## Questions Remaining
- None for the core file-layer knowledge base. Residual uncertainty is limited to modal UI microcopy and branch details unavailable through the cached source fetch.

## Recommended Next Focus
Synthesis should merge all five iterations into a final knowledge base that separates source facts from file-layer AI recipes, especially the distinction between BRAT registry state, plugin release files, Obsidian enablement state, and theme root-file installs.

## Next Focus
Synthesis should merge all five iterations into a final knowledge base that separates source facts from file-layer AI recipes, especially the distinction between BRAT registry state, plugin release files, Obsidian enablement state, and theme root-file installs.
