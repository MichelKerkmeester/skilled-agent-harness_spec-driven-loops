---
title: Deep Research Strategy - obsidian42-BRAT
description: Detached lineage strategy for source-backed BRAT vault-file research.
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - Session Tracking

## 2. TOPIC

Deep-dive research on obsidian42-BRAT for an AI operating an Obsidian vault at the file layer.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] What exact persisted data.json keys, defaults, list shapes, and version-pin semantics does BRAT use?
- [x] What does every BRAT command do, including beta plugins, frozen release tags, updates, restart, and themes?
- [x] What exact release/root asset-fetch and vault-file install/enabling mechanics does BRAT implement?
- [x] Which headless file-layer workflows are safe for plugin installation, enabling, registration, and frozen pinning?
- [x] Which errors and edge cases occur, and what source-backed AI recipes and troubleshooting checks address them?

<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS

- Do not modify the target vault or any plugin source.
- Do not infer undocumented UI behavior when the repository source or official BRAT documentation can answer it.
- Do not treat generic Obsidian plugin behavior as BRAT-specific without labeling the inference.

## 5. STOP CONDITIONS

- Run exactly five iterations even if convergence telemetry becomes positive; convergence is telemetry only under max-iterations.
- Stop only after the fifth iteration or an unrecoverable workflow error.
- Synthesis must preserve unresolved questions and distinguish source facts from inference.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- What exact persisted data.json keys, defaults, list shapes, and version-pin semantics does BRAT use?
- What does every BRAT command do, including beta plugins, frozen release tags, updates, restart, and themes?
- What exact release/root asset-fetch and vault-file install/enabling mechanics does BRAT implement?
- Which headless file-layer workflows are safe for plugin installation, enabling, registration, and frozen pinning?
- Which errors and edge cases occur, and what source-backed AI recipes and troubleshooting checks address them?

<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- GitHub source navigation gave precise schema and callback anchors, and the docs pages confirmed the user-facing interpretation without overriding source behavior. (iteration 1)
- Combining BRAT source with Obsidian docs made the safe workflow boundary clear: BRAT owns release validation and vault writes, while Obsidian owns enablement/reload behavior. (iteration 2)
- The settings, migration, validation, and install/update sources triangulate cleanly: settings define names, migration creates names, SettingsTab binds them to SecretComponent, and BetaPlugins resolves names to values at the moment of GitHub access. (iteration 3)
- Reading source branches around install/update failure points produced a practical troubleshooting model because BRAT's important failures are explicit returns, notices, and logs rather than hidden side effects. (iteration 4)
- Following callbacks from `PluginCommands.ts` into `BetaPlugins.ts` produced a compact behavioral map without depending on unavailable modal files. (iteration 5)

<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- Raw-source URL fetches were inconsistent through the web cache, so source retrieval needed GitHub HTML/tree fallback. (iteration 1)
- The focus could not close the full command catalog without exceeding scope; command behavior spans modals and settings UI beyond the headless-workflow path. (iteration 2)
- Direct shell source retrieval failed because DNS could not resolve `raw.githubusercontent.com`; web-cached source pages preserved enough primary evidence to proceed. (iteration 3)
- The theme source page did not open as a rich source view through GitHub HTML, so official theme docs plus GitHub utility functions carried the theme edge-case evidence. (iteration 4)
- Direct modal-file fetches cache-missed, which prevented source-backed claims about every UI branch inside add-plugin/add-theme modals. (iteration 5)

<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Direct raw fetches for some guessed source URLs initially failed through the web cache, so the successful path was GitHub tree navigation plus specific file opens. This is not a source dead end; it is a tooling access note. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Direct raw fetches for some guessed source URLs initially failed through the web cache, so the successful path was GitHub tree navigation plus specific file opens. This is not a source dead end; it is a tooling access note.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Direct raw fetches for some guessed source URLs initially failed through the web cache, so the successful path was GitHub tree navigation plus specific file opens. This is not a source dead end; it is a tooling access note.

### Direct source access to `AddNewPluginModal.ts`, `VersionSuggestModal.ts`, and `AddNewTheme.ts` returned cache misses through the web tool. The command/install mechanics were still source-backed through `PluginCommands.ts`, `BetaPlugins.ts`, `githubUtils.ts`, and official BRAT docs, so this is a source-access limitation rather than an unanswered behavior gap. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Direct source access to `AddNewPluginModal.ts`, `VersionSuggestModal.ts`, and `AddNewTheme.ts` returned cache misses through the web tool. The command/install mechanics were still source-backed through `PluginCommands.ts`, `BetaPlugins.ts`, `githubUtils.ts`, and official BRAT docs, so this is a source-access limitation rather than an unanswered behavior gap.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Direct source access to `AddNewPluginModal.ts`, `VersionSuggestModal.ts`, and `AddNewTheme.ts` returned cache misses through the web tool. The command/install mechanics were still source-backed through `PluginCommands.ts`, `BetaPlugins.ts`, `githubUtils.ts`, and official BRAT docs, so this is a source-access limitation rather than an unanswered behavior gap.

### No new dead-end source direction was found. The existing blocked note about local raw GitHub retrieval remains a retrieval limitation rather than content evidence. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: No new dead-end source direction was found. The existing blocked note about local raw GitHub retrieval remains a retrieval limitation rather than content evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new dead-end source direction was found. The existing blocked note about local raw GitHub retrieval remains a retrieval limitation rather than content evidence.

### No new dead-end source direction was found. The prior raw-source tooling note remains a retrieval limitation, not a content dead end. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: No new dead-end source direction was found. The prior raw-source tooling note remains a retrieval limitation, not a content dead end.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new dead-end source direction was found. The prior raw-source tooling note remains a retrieval limitation, not a content dead end.

### Purely editing BRAT `data.json` as a complete install was ruled out: BRAT also writes release assets, loads manifests, and enables via Obsidian APIs. [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/BetaPlugins.ts] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Purely editing BRAT `data.json` as a complete install was ruled out: BRAT also writes release assets, loads manifests, and enables via Obsidian APIs. [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/BetaPlugins.ts]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Purely editing BRAT `data.json` as a complete install was ruled out: BRAT also writes release assets, loads manifests, and enables via Obsidian APIs. [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/BetaPlugins.ts]

### Relying on raw GitHub retrieval via local shell was not usable in this environment because DNS resolution for `raw.githubusercontent.com` failed; the fallback evidence path was web-cached GitHub source pages. [SOURCE: command output: curl raw.githubusercontent.com returned "Could not resolve host: raw.githubusercontent.com"] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Relying on raw GitHub retrieval via local shell was not usable in this environment because DNS resolution for `raw.githubusercontent.com` failed; the fallback evidence path was web-cached GitHub source pages. [SOURCE: command output: curl raw.githubusercontent.com returned "Could not resolve host: raw.githubusercontent.com"]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Relying on raw GitHub retrieval via local shell was not usable in this environment because DNS resolution for `raw.githubusercontent.com` failed; the fallback evidence path was web-cached GitHub source pages. [SOURCE: command output: curl raw.githubusercontent.com returned "Could not resolve host: raw.githubusercontent.com"]

### Retrying local raw GitHub fetches remained out of scope because prior iterations recorded that path as blocked; this pass used GitHub HTML source and official docs instead. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Retrying local raw GitHub fetches remained out of scope because prior iterations recorded that path as blocked; this pass used GitHub HTML source and official docs instead.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Retrying local raw GitHub fetches remained out of scope because prior iterations recorded that path as blocked; this pass used GitHub HTML source and official docs instead.

### Retrying local raw GitHub fetches was avoided because the strategy lists local raw retrieval failure as blocked. GitHub HTML/source pages and official documentation remained usable. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Retrying local raw GitHub fetches was avoided because the strategy lists local raw retrieval failure as blocked. GitHub HTML/source pages and official documentation remained usable.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Retrying local raw GitHub fetches was avoided because the strategy lists local raw retrieval failure as blocked. GitHub HTML/source pages and official documentation remained usable.

### Storing a private GitHub token directly in BRAT `data.json` is ruled out for v2.0+ operation; current settings store secret names and intentionally remove token values from persisted settings. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts#L654-L690] [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/migrations.ts:L1-L2] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Storing a private GitHub token directly in BRAT `data.json` is ruled out for v2.0+ operation; current settings store secret names and intentionally remove token values from persisted settings. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts#L654-L690] [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/migrations.ts:L1-L2]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Storing a private GitHub token directly in BRAT `data.json` is ruled out for v2.0+ operation; current settings store secret names and intentionally remove token values from persisted settings. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts#L654-L690] [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/migrations.ts:L1-L2]

### Treating "restart plugin" as reinstall/update was ruled out: restart only disables/enables an installed plugin, while reinstall goes through `updatePlugin` with `forceReinstall=true`. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts#L1250-L1318] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts#L3068-L3084] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating "restart plugin" as reinstall/update was ruled out: restart only disables/enables an installed plugin, while reinstall goes through `updatePlugin` with `forceReinstall=true`. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts#L1250-L1318] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts#L3068-L3084]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating "restart plugin" as reinstall/update was ruled out: restart only disables/enables an installed plugin, while reinstall goes through `updatePlugin` with `forceReinstall=true`. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts#L1250-L1318] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts#L3068-L3084]

### Treating `pluginSubListFrozenVersion` as only frozen plugins was ruled out: source adds or updates an entry for every registered plugin and only treats truthy non-`"latest"` versions as update-skipped pins. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating `pluginSubListFrozenVersion` as only frozen plugins was ruled out: source adds or updates an entry for every registered plugin and only treats truthy non-`"latest"` versions as update-skipped pins. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `pluginSubListFrozenVersion` as only frozen plugins was ruled out: source adds or updates an entry for every registered plugin and only treats truthy non-`"latest"` versions as update-skipped pins. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts]

### Treating a configured `tokenName` as proof of usable private access is ruled out; SettingsTab and BetaPlugins both separately check whether the named secret exists, and install/update can still proceed without a token value after warning. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/SettingsTab.ts#L3101-L3236] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts#L2571-L2596] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating a configured `tokenName` as proof of usable private access is ruled out; SettingsTab and BetaPlugins both separately check whether the named secret exists, and install/update can still proceed without a token value after warning. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/SettingsTab.ts#L3101-L3236] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts#L2571-L2596]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating a configured `tokenName` as proof of usable private access is ruled out; SettingsTab and BetaPlugins both separately check whether the named secret exists, and install/update can still proceed without a token value after warning. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/SettingsTab.ts#L3101-L3236] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts#L2571-L2596]

### Treating a missing plugin in Obsidian as purely a BRAT `data.json` issue was ruled out: BRAT may have registered the repo while install failed before writing or enabling the plugin files. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts#L2804-L2849] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating a missing plugin in Obsidian as purely a BRAT `data.json` issue was ruled out: BRAT may have registered the repo while install failed before writing or enabling the plugin files. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts#L2804-L2849]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating a missing plugin in Obsidian as purely a BRAT `data.json` issue was ruled out: BRAT may have registered the repo while install failed before writing or enabling the plugin files. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts#L2804-L2849]

### Treating enable/disable as BRAT registration was ruled out: those commands save Obsidian plugin enablement state, while BRAT registry changes happen through `addBetaPluginToList` and `deletePlugin`. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts#L1325-L1398] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts#L3221-L3235] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating enable/disable as BRAT registration was ruled out: those commands save Obsidian plugin enablement state, while BRAT registry changes happen through `addBetaPluginToList` and `deletePlugin`. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts#L1325-L1398] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts#L3221-L3235]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating enable/disable as BRAT registration was ruled out: those commands save Obsidian plugin enablement state, while BRAT registry changes happen through `addBetaPluginToList` and `deletePlugin`. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts#L1325-L1398] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts#L3221-L3235]

### Treating plugin and theme diagnostics as interchangeable was ruled out: plugins are release-asset/version driven, while themes are root-file/checksum driven. [SOURCE: https://tfthacker.com/brat-themes] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts#L2392-L2488] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating plugin and theme diagnostics as interchangeable was ruled out: plugins are release-asset/version driven, while themes are root-file/checksum driven. [SOURCE: https://tfthacker.com/brat-themes] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts#L2392-L2488]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating plugin and theme diagnostics as interchangeable was ruled out: plugins are release-asset/version driven, while themes are root-file/checksum driven. [SOURCE: https://tfthacker.com/brat-themes] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts#L2392-L2488]

### Treating repository-root `manifest.json` as the primary v2.2 install source was ruled out for the plugin install path: current source asks GitHub releases for `manifest.json` and assets, with fallback/compatibility behavior to trace further next iteration. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating repository-root `manifest.json` as the primary v2.2 install source was ruled out for the plugin install path: current source asks GitHub releases for `manifest.json` and assets, with fallback/compatibility behavior to trace further next iteration. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating repository-root `manifest.json` as the primary v2.2 install source was ruled out for the plugin install path: current source asks GitHub releases for `manifest.json` and assets, with fallback/compatibility behavior to trace further next iteration. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts]

### Treating theme installs like plugin installs was ruled out: themes use root CSS/manifest files and checksum tracking, not release `main.js` assets or plugin enablement. [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/themes.ts] [SOURCE: https://tfthacker.com/brat-themes] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating theme installs like plugin installs was ruled out: themes use root CSS/manifest files and checksum tracking, not release `main.js` assets or plugin enablement. [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/themes.ts] [SOURCE: https://tfthacker.com/brat-themes]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating theme installs like plugin installs was ruled out: themes use root CSS/manifest files and checksum tracking, not release `main.js` assets or plugin enablement. [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/themes.ts] [SOURCE: https://tfthacker.com/brat-themes]

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Direct raw fetches for some guessed source URLs initially failed through the web cache, so the successful path was GitHub tree navigation plus specific file opens. This is not a source dead end; it is a tooling access note. (iteration 1)
- Treating `pluginSubListFrozenVersion` as only frozen plugins was ruled out: source adds or updates an entry for every registered plugin and only treats truthy non-`"latest"` versions as update-skipped pins. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts] (iteration 1)
- Treating repository-root `manifest.json` as the primary v2.2 install source was ruled out for the plugin install path: current source asks GitHub releases for `manifest.json` and assets, with fallback/compatibility behavior to trace further next iteration. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts] (iteration 1)
- No new dead-end source direction was found. The prior raw-source tooling note remains a retrieval limitation, not a content dead end. (iteration 2)
- Purely editing BRAT `data.json` as a complete install was ruled out: BRAT also writes release assets, loads manifests, and enables via Obsidian APIs. [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/BetaPlugins.ts] (iteration 2)
- Treating theme installs like plugin installs was ruled out: themes use root CSS/manifest files and checksum tracking, not release `main.js` assets or plugin enablement. [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/themes.ts] [SOURCE: https://tfthacker.com/brat-themes] (iteration 2)
- Relying on raw GitHub retrieval via local shell was not usable in this environment because DNS resolution for `raw.githubusercontent.com` failed; the fallback evidence path was web-cached GitHub source pages. [SOURCE: command output: curl raw.githubusercontent.com returned "Could not resolve host: raw.githubusercontent.com"] (iteration 3)
- Storing a private GitHub token directly in BRAT `data.json` is ruled out for v2.0+ operation; current settings store secret names and intentionally remove token values from persisted settings. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts#L654-L690] [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/migrations.ts:L1-L2] (iteration 3)
- Treating a configured `tokenName` as proof of usable private access is ruled out; SettingsTab and BetaPlugins both separately check whether the named secret exists, and install/update can still proceed without a token value after warning. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/SettingsTab.ts#L3101-L3236] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts#L2571-L2596] (iteration 3)
- No new dead-end source direction was found. The existing blocked note about local raw GitHub retrieval remains a retrieval limitation rather than content evidence. (iteration 4)
- Retrying local raw GitHub fetches was avoided because the strategy lists local raw retrieval failure as blocked. GitHub HTML/source pages and official documentation remained usable. (iteration 4)
- Treating a missing plugin in Obsidian as purely a BRAT `data.json` issue was ruled out: BRAT may have registered the repo while install failed before writing or enabling the plugin files. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts#L2804-L2849] (iteration 4)
- Treating plugin and theme diagnostics as interchangeable was ruled out: plugins are release-asset/version driven, while themes are root-file/checksum driven. [SOURCE: https://tfthacker.com/brat-themes] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts#L2392-L2488] (iteration 4)
- Direct source access to `AddNewPluginModal.ts`, `VersionSuggestModal.ts`, and `AddNewTheme.ts` returned cache misses through the web tool. The command/install mechanics were still source-backed through `PluginCommands.ts`, `BetaPlugins.ts`, `githubUtils.ts`, and official BRAT docs, so this is a source-access limitation rather than an unanswered behavior gap. (iteration 5)
- Retrying local raw GitHub fetches remained out of scope because prior iterations recorded that path as blocked; this pass used GitHub HTML source and official docs instead. (iteration 5)
- Treating "restart plugin" as reinstall/update was ruled out: restart only disables/enables an installed plugin, while reinstall goes through `updatePlugin` with `forceReinstall=true`. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts#L1250-L1318] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts#L3068-L3084] (iteration 5)
- Treating enable/disable as BRAT registration was ruled out: those commands save Obsidian plugin enablement state, while BRAT registry changes happen through `addBetaPluginToList` and `deletePlugin`. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts#L1325-L1398] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts#L3221-L3235] (iteration 5)

<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Full vault-file install mechanics need dedicated tracing of release asset validation, manifest fallback, minAppVersion handling, `community-plugins.json` enablement, and reload order. (iteration 1)
- Full command behavior details still need deeper tracing through modals, delete/update helpers, and settings UI. (iteration 1)
- Error and edge-case catalog still needs a dedicated pass over `githubUtils`, modals, settings UI, private-repo token docs, and notification paths. (iteration 1)
- Safe headless AI workflows still need synthesis from BRAT source plus Obsidian vault-file behavior. (iteration 1)
- Private repository token handling needs a dedicated pass over token validation, SecretStorage names, and settings UI. (iteration 2)
- What does every BRAT command do, including beta plugins, frozen release tags, updates, restart, and themes? (iteration 2)
- Which errors and edge cases occur, and what source-backed AI recipes and troubleshooting checks address them? (iteration 2)
- Which non-token errors and edge cases occur, and what source-backed AI recipes and troubleshooting checks address them? (iteration 3)
- What exact release/root asset-fetch and vault-file install/enabling mechanics does BRAT implement? (iteration 3)
- None for the core file-layer knowledge base. Residual uncertainty is limited to modal UI microcopy and branch details unavailable through the cached source fetch. (iteration 5)

<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

- Primary source target: `TfTHacker/obsidian42-brat` and its tagged v2.2.0+ source.
- Official documentation target: `https://tfthacker.com/BRAT`.
- Vault paths in scope: `.obsidian/plugins/obsidian42-brat/`, `.obsidian/plugins/<id>/`, `.obsidian/community-plugins.json`, and theme directories.
- No resource-map.md was present at initialization; source discovery must cite every external or local source used.

## 13. RESEARCH BOUNDARIES

- Max iterations: 5
- Convergence threshold: 0.05
- Stop policy: max-iterations; early convergence is telemetry only.
- Per-iteration budget: 12 tool calls, 10 minutes.
- Research output is workflow-owned and remains inside this detached lineage.
- Current generation: 1
- Session: `fanout-luna-1785675410437-3ctuwx`
