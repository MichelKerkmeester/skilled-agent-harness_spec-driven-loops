# Iteration 2: Safe Headless AI Workflows For BRAT

## Focus
This iteration investigated safe file-layer workflows for an AI operating an Obsidian vault with BRAT installed. The selected interpretation was narrow: how to replicate or prepare BRAT plugin/theme state safely from source-backed vault file behavior, while preserving BRAT's own release validation, registration, frozen-version, and enablement assumptions. Deferred alternatives: full UI command inventory and full private-token UX flow, because those need a separate modal/settings pass.

## Actions Taken
1. Read the lineage config, state log, strategy, and findings registry before selecting the focus.
2. Checked exhausted approaches and avoided treating repository-root `manifest.json` as the primary current BRAT plugin install source.
3. Consulted BRAT source for plugin install/update flow, GitHub release asset fetching, settings registration, and theme installation.
4. Consulted official BRAT docs for user-facing plugin/theme update and frozen-version behavior.
5. Consulted Obsidian docs for plugin folder, manifest, release asset, enablement, and reload expectations.

## Findings
1. The safest headless workflow is not to invent a separate BRAT installer; it is to mirror BRAT's source path: resolve a GitHub repo path, fetch a release or release tag, require a valid `manifest.json` with `id` and `version`, fetch release assets named `main.js`, `manifest.json`, and optional `styles.css`, write them under `.obsidian/plugins/<manifest.id>/`, and then register the repository in BRAT settings. BRAT's docs describe that it removes the manual folder/download/copy work, while source shows the actual release-file and vault-write steps. [SOURCE: https://tfthacker.com/BRAT] [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/BetaPlugins.ts]
2. For plugin assets, headless AI should treat release assets as authoritative and exact-name-sensitive. BRAT uses GitHub release asset lookup by exact asset name; missing `manifest.json` causes validation failure, missing `main.js` makes the release incomplete, and `styles.css` is optional. Obsidian's release docs independently specify the same uploaded plugin assets: `main.js`, `manifest.json`, and optional `styles.css`. [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/githubUtils.ts] [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/BetaPlugins.ts] [SOURCE: https://docs.obsidian.md/Plugins/Releasing/Submit%20your%20plugin]
3. BRAT's compatibility checks are part of the safe workflow, not UI-only polish. Source checks `minAppVersion` with Obsidian's `requireApiVersion`, blocks incompatible latest installs unless incompatible installs are explicitly allowed and confirmed for a specified version, and blocks desktop-only plugins on mobile unless forced. Obsidian's manifest docs make `minAppVersion`, `version`, `id`, and `isDesktopOnly` core plugin manifest fields. [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/BetaPlugins.ts] [SOURCE: https://docs.obsidian.md/Reference/Manifest]
4. A safe file-layer registration for BRAT after a headless install requires both list shapes from `data.json`: add the repo string to `pluginList`, and add or update `{repo, version, tokenName?, isIncompatible?}` in `pluginSubListFrozenVersion`. A frozen pin is any non-empty version other than `"latest"`; `"latest"` or an empty/missing version tracks updates. Source `addBetaPluginToList` updates both structures and avoids persisting token values. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts] [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/BetaPlugins.ts]
5. Enabling is a separate vault/application state transition from file installation. BRAT's in-app path calls Obsidian's `loadManifest`, `enablePluginAndSave`, and then reloads manifests; Obsidian's user docs separately state that installed plugins must be enabled before use. Therefore a headless AI can safely stage files and BRAT registration, but it should either use an Obsidian API/CLI enable operation or edit `.obsidian/community-plugins.json` only while Obsidian is closed and after validating that the plugin folder name matches `manifest.id`. [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/BetaPlugins.ts] [SOURCE: https://obsidian.md/help/community-plugins] [SOURCE: https://docs.obsidian.md/Plugins/Getting%20started/Build%20a%20plugin] [INFERENCE: based on BRAT's `enablePluginAndSave` call plus Obsidian's installed-then-enable model]
6. The safe headless frozen-version recipe is: fetch the release tag explicitly, validate the release manifest, write files to the manifest id folder, register the repo in `pluginList`, add `{repo, version:"<tag>"}` to `pluginSubListFrozenVersion`, and do not expect BRAT's update sweep to advance it. Source skips update entries whose version is truthy and not `"latest"`; BRAT docs describe the frozen-version command as installing the specified release and excluding it from normal updates. [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/BetaPlugins.ts] [SOURCE: https://tfthacker.com/brat-plugins]
7. The safe headless theme workflow differs from plugin installation: BRAT reads root `theme-beta.css` first, falls back to root `theme.css`, requires root `manifest.json`, writes files to `.obsidian/themes/<manifest.name>/theme.css` and `manifest.json`, sets the theme in-app on new install, and records `{repo,lastUpdate}` using a checksum of the downloaded CSS. BRAT docs confirm that theme updates are checksum/change based rather than theme-manifest-version based and that deleting a BRAT theme entry does not delete the theme files. [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/themes.ts] [SOURCE: https://tfthacker.com/brat-themes]
8. The practical AI guardrail is to separate "stage", "register", and "activate". Stage means write plugin/theme files from verified assets. Register means update BRAT `data.json` using BRAT's list shapes. Activate means enable the plugin or apply the theme through Obsidian state. Activation is the riskiest file-layer step because Obsidian can cache manifests and because BRAT's own source performs manifest reloads after writes. [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/BetaPlugins.ts] [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/themes.ts] [SOURCE: https://docs.obsidian.md/Plugins/Getting%20started/Build%20a%20plugin] [INFERENCE: based on BRAT reload/load-manifest calls and Obsidian restart/reload guidance]

## Questions Answered
- Which headless file-layer workflows are safe for plugin installation, enabling, registration, and frozen pinning?
- What exact release/root asset-fetch and vault-file install/enabling mechanics does BRAT implement? Partially answered for workflow-safe plugin/theme mechanics; fuller edge-case catalog remains.

## Questions Remaining
- What does every BRAT command do, including beta plugins, frozen release tags, updates, restart, and themes?
- Which errors and edge cases occur, and what source-backed AI recipes and troubleshooting checks address them?
- Private repository token handling needs a dedicated pass over token validation, SecretStorage names, and settings UI.

## Ruled Out
- Purely editing BRAT `data.json` as a complete install was ruled out: BRAT also writes release assets, loads manifests, and enables via Obsidian APIs. [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/BetaPlugins.ts]
- Treating theme installs like plugin installs was ruled out: themes use root CSS/manifest files and checksum tracking, not release `main.js` assets or plugin enablement. [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/themes.ts] [SOURCE: https://tfthacker.com/brat-themes]

## Dead Ends
- No new dead-end source direction was found. The prior raw-source tooling note remains a retrieval limitation, not a content dead end.

## Edge Cases
- Ambiguous input: The phrase "safe headless AI workflows" could mean either complete UI-equivalent automation or file-layer preflight/staging. This iteration chose file-layer preflight/staging plus cautious activation, and deferred complete UI command behavior.
- Contradictory evidence: None found. Source and docs align that BRAT automates file download/copy/update/reload; the only distinction is that source reveals stricter release-asset mechanics than the user-facing docs.
- Missing dependencies: `research/research.md` progressive synthesis was not updated because the dispatch allowed-write list names only the narrative, state log, and delta file as writable. The iteration findings remain fully written in the required narrative and delta artifacts.
- Partial success: The workflow-safe model is answered, but full command behavior and private-repo troubleshooting remain for later iterations.

## Sources Consulted
- https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/BetaPlugins.ts
- https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/githubUtils.ts
- https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts
- https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/themes.ts
- https://tfthacker.com/BRAT
- https://tfthacker.com/brat-plugins
- https://tfthacker.com/brat-themes
- https://obsidian.md/help/community-plugins
- https://docs.obsidian.md/Plugins/Getting%20started/Build%20a%20plugin
- https://docs.obsidian.md/Plugins/Releasing/Submit%20your%20plugin
- https://docs.obsidian.md/Reference/Manifest

## Assessment
- New information ratio: 0.88
- Questions addressed: safe headless plugin installation; BRAT registration; frozen pinning; plugin enablement boundary; theme file-layer workflow.
- Questions answered: safe headless file-layer workflows for plugin installation, enabling boundary, registration, and frozen pinning.

## Reflection
- What worked and why: Combining BRAT source with Obsidian docs made the safe workflow boundary clear: BRAT owns release validation and vault writes, while Obsidian owns enablement/reload behavior.
- What did not work and why: The focus could not close the full command catalog without exceeding scope; command behavior spans modals and settings UI beyond the headless-workflow path.
- What I would do differently: Next iteration should trace `PluginCommands.ts`, command callbacks, modals, and settings helpers as a single command-inventory pass.

## Recommended Next Focus
Trace every BRAT command callback end to end, especially add beta plugin, add frozen version, check-only/update-all/update-one, reinstall, restart, enable/disable, graduated-plugin cleanup, add/remove theme, and update themes.

## Next Focus
Trace every BRAT command callback end to end, especially add beta plugin, add frozen version, check-only/update-all/update-one, reinstall, restart, enable/disable, graduated-plugin cleanup, add/remove theme, and update themes.
