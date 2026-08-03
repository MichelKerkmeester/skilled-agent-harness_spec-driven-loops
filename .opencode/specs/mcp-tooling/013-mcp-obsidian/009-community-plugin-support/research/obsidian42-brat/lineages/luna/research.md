---
title: "obsidian42-BRAT: verified file-layer data model, installation mechanics, and AI workflows"
description: "Five-iteration source-cited synthesis for TfTHacker/obsidian42-brat v2.2.0+ behavior."
---

# obsidian42-BRAT: verified file-layer knowledge base

This is the synthesis artifact for the detached `luna` lineage. It is written for an AI that reads and mutates an Obsidian vault at the file layer rather than driving the BRAT UI.

Evidence boundary: the BRAT `main` source tree and TfTHacker documentation were inspected during this run on 2026-08-02. Source behavior takes precedence over older forum advice and high-level documentation. Modal microcopy and a few modal-only branches were not fully retrievable; the core install, command, persisted-state, and troubleshooting behavior is source-backed.

## 1. Executive Summary

BRAT stores two different concepts in `.obsidian/plugins/obsidian42-brat/data.json`: a repository registration list (`pluginList`) and a per-repository metadata list (`pluginSubListFrozenVersion`). The latter is not only a list of frozen plugins. BRAT creates entries for tracked repositories and treats a non-empty `version` other than `latest` as a release-tag pin that the normal update sweep skips. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts]

The plugin install path is release-centric. For plugins, BRAT selects a GitHub release, fetches exact release assets named `main.js`, `manifest.json`, and optionally `styles.css`, validates the selected manifest, and writes the files to `.obsidian/plugins/<manifest.id>/`. Repository-root files are not the normal v2.2+ plugin asset source. Themes are different: BRAT reads repository-root `theme-beta.css` or `theme.css` plus root `manifest.json`, writes them below `.obsidian/themes/<manifest.name>/`, and tracks a CSS checksum. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts] [SOURCE: https://tfthacker.com/brat-themes]

Installation, BRAT registration, and Obsidian enablement are separate state transitions:

- Stage: write validated plugin release files or theme files.
- Register: write BRAT's repository/list metadata to `data.json`.
- Activate: enable the plugin through Obsidian state, represented in the vault by `.obsidian/community-plugins.json`; apply a theme through Obsidian's theme state.

An AI should verify all three boundaries independently. A correct BRAT `data.json` entry does not prove the plugin files exist, and a correct plugin folder does not prove Obsidian has enabled or reloaded it. [INFERENCE: derived from BRAT's `addBetaPluginToList`, file writes, `enablePluginAndSave`, and manifest reload sequence in `BetaPlugins.ts`]

## 2. Scope, Evidence, and Confidence

The research covered the exact persisted schema, every registered BRAT command, GitHub release selection, plugin and theme asset paths, compatibility checks, Obsidian enablement, private-repository SecretStorage behavior, edge cases, and file-layer AI recipes.

Primary source files:

- `src/settings.ts` — defaults, persisted list shapes, secret-name fields.
- `src/main.ts` — load/save and migration wiring.
- `src/ui/PluginCommands.ts` — command IDs and callback routing.
- `src/features/BetaPlugins.ts` — plugin release selection, validation, writes, update/reinstall/enable/reload behavior.
- `src/features/githubUtils.ts` — GitHub release and root-file fetches, exact asset names, rate-limit handling.
- `src/features/themes.ts` — theme install/update state.
- `src/ui/SettingsTab.ts`, `src/utils/TokenValidator.ts`, and `src/migrations.ts` — private repository tokens.

Documentation cross-checks:

- [BRAT](https://tfthacker.com/BRAT)
- [BRAT plugins](https://tfthacker.com/brat-plugins)
- [BRAT themes](https://tfthacker.com/brat-themes)
- [BRAT developers](https://tfthacker.com/brat-developers)
- [BRAT private repositories](https://tfthacker.com/brat-private-repo)
- [Obsidian manifest reference](https://docs.obsidian.md/Reference/Manifest)
- [Obsidian plugin release assets](https://docs.obsidian.md/Plugins/Releasing/Submit%20your%20plugin)

Claims labelled `[SOURCE: ...]` are direct source or documentation findings. Claims labelled `[INFERENCE: ...]` are operational recommendations derived from those findings and should be validated against the target vault before mutation.

## 3. Exact `data.json` Data Model

BRAT loads `data.json` with defaults. Missing keys inherit `DEFAULT_SETTINGS` at runtime; the file does not need to contain every default key. The following is the complete v2.2+ settings shape identified in `settings.ts`, with the default values shown:

```json
{
  "pluginList": [],
  "pluginSubListFrozenVersion": [],
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

### 3.1 `pluginList`

`pluginList` is a string array of GitHub repository paths, normally `owner/repository`:

```json
"pluginList": [
  "TfTHacker/obsidian42-brat",
  "owner/experimental-plugin"
]
```

The repository string is BRAT's registration key. It is not the installed Obsidian plugin ID; the installed folder is derived from the downloaded manifest's `id`. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts]

### 3.2 `pluginSubListFrozenVersion`

Entries are objects, not strings. The stable fields are:

```json
"pluginSubListFrozenVersion": [
  {
    "repo": "owner/experimental-plugin",
    "version": "v2.2.0",
    "tokenName": "brat-gh-owner-experimental-plugin",
    "isIncompatible": false
  }
]
```

Observed shape and semantics:

| Field | Meaning |
|---|---|
| `repo` | Repository path matching `pluginList`. |
| `version` | Release tag to request when non-empty and not `latest`; empty/missing/`latest` tracks the update sweep. Store the exact GitHub tag, including a leading `v` when the release uses one. |
| `tokenName` | Optional Obsidian SecretStorage key for a private repository. The token value is not persisted here. |
| `isIncompatible` | Local metadata used when an incompatible install was explicitly allowed. |
| `token` | Legacy/deprecated field. Current settings helpers intentionally write it as `undefined`; do not put a plaintext token here. |

The misleading list name matters operationally: BRAT can add an entry for an ordinary latest-tracking plugin. “Frozen” means the `version` value is truthy and not equal to `latest`, not that the object exists. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts]

### 3.3 `themesList`

Theme registrations use a separate list:

```json
"themesList": [
  {
    "repo": "owner/theme-repository",
    "lastUpdate": "<checksum-of-downloaded-css>"
  }
]
```

`lastUpdate` is a checksum/change marker for the downloaded CSS, not a theme manifest version. Removing a BRAT theme registration does not necessarily delete the local theme files. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts] [SOURCE: https://tfthacker.com/brat-themes]

### 3.4 Startup, logging, compatibility, and token keys

- `updateAtStartup`: allow the plugin update sweep during startup.
- `updateThemesAtStartup`: allow the theme update sweep during startup.
- `enableAfterInstall`: after a successful install, ask Obsidian to load and enable the plugin.
- `loggingEnabled`: write BRAT logs.
- `loggingPath`: log basename/path setting; default `BRAT-log`.
- `loggingVerboseEnabled`: include verbose logging when logging is enabled.
- `debuggingMode`: enable additional diagnostic behavior.
- `notificationsEnabled`: show BRAT notices.
- `selectLatestPluginVersionByDefault`: default version-selection behavior in the add flow.
- `allowIncompatiblePlugins`: permit the explicit incompatible-install path; it does not make an incompatible plugin safe.
- `globalTokenName`: SecretStorage name for the global GitHub token.
- `personalAccessToken`: legacy field retained in the model, but current v2+ token flows use SecretStorage names and should not write plaintext values.

## 4. Command Surface

`PluginCommands` registers the command array through `plugin.addCommand`. The IDs below are the source inventory, including the source's spelling for the two `open`/`opent` IDs.

| Command ID | Behavior and file-layer consequence |
|---|---|
| `AddBetaPlugin` | Opens `displayAddNewPluginModal(false, true)`, then routes through `addPlugin`; it installs a selected release and registers the repo. |
| `checkForUpdatesAndUpdate` | Runs the all-plugin check/update path (`checkForPluginUpdatesAndInstallUpdates`) with updates enabled. |
| `checkForUpdatesAndDontUpdate` | Runs the same sweep in check-only mode; it reports candidates without writing updated release files. |
| `updateOnePlugin` | Presents eligible non-frozen/latest-tracking repositories, then calls `updatePlugin` for one repo. |
| `reinstallOnePlugin` | Presents an installed plugin and calls `updatePlugin` with `forceReinstall=true`; this rewrites release files and reloads an enabled plugin. |
| `restartPlugin` | Lists installed manifests and calls `reloadPlugin`; it disables and re-enables the selected installed plugin without fetching a release. |
| `disablePlugin` | Calls Obsidian `disablePluginAndSave`; it changes enablement state, not BRAT registration. |
| `enablePlugin` | Calls Obsidian `enablePluginAndSave`; it changes enablement state, not the BRAT repository lists. |
| `openGitHubZRepository` | Opens a selected repository URL. |
| `openCommunityPagePlugin` | Opens the Obsidian community plugin page for a selected plugin. |
| `openGitHubRepoTheme` | Opens a selected theme repository. |
| `opentPluginSettings` | Opens BRAT's plugin settings. The `opent` spelling is source behavior. |
| `GrabBetaTheme` | Opens the add-theme flow and registers/downloads a theme. |
| `updateBetaThemes` | Runs `themesCheckAndUpdates`; themes use root CSS plus checksum comparison. |
| `removeGraduatedFromBrat` | Removes a graduated plugin from BRAT tracking while keeping the installed plugin. |
| `updateGraduatedToStableAndRemove` | Installs the matched stable/community release, force-reinstalls/enables it, then removes successful tracking from BRAT. |
| `allCommands` | Opens the all-commands chooser. |

[SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts]

The important distinctions are that “restart” is not reinstall, “enable/disable” is not registration, and a check-only command must not be interpreted as proof that a release was written. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts]

## 5. Plugin Release Selection and Install Mechanics

### 5.1 Resolve repository and access token

Normalize the input to `owner/repository`. For public repositories, BRAT uses unauthenticated GitHub API/download paths. For private repositories, it resolves a per-repository SecretStorage name first and falls back to `globalTokenName`. A configured name with no corresponding secret is not usable access; BRAT warns and may continue with an empty token. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/SettingsTab.ts]

### 5.2 Choose a GitHub release

- If `pluginSubListFrozenVersion[].version` is a non-empty tag other than `latest`, request `/releases/tags/<version>`.
- Otherwise list releases and select according to BRAT's semver-coerced tag/date ordering.
- Do not assume the repository root is the plugin release. Current BRAT plugin installation is release-asset based; root-file fetching is the theme path and a compatibility/fallback concern, not the normal plugin path.

[SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts] [SOURCE: https://tfthacker.com/brat-developers]

### 5.3 Manifest validation

The add flow tries the beta manifest asset before the normal manifest asset where available, then validates the selected manifest. The release must provide a usable manifest with an `id` and `version`. BRAT checks:

- `minAppVersion` against the running Obsidian API via `requireApiVersion`.
- `isDesktopOnly` against the current platform.
- incompatible-install policy and explicit confirmation.

Obsidian's core plugin manifest fields are documented in its [manifest reference](https://docs.obsidian.md/Reference/Manifest). A forced incompatible install can mutate the local manifest copy with a `brat` object preserving original values such as `minAppVersionOriginal` and `isDesktopOnlyOriginal`; do not treat the local copy as byte-identical to upstream in that case. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts]

### 5.4 Exact release assets and vault path

For a plugin release, fetch exact asset names:

| Asset | Required | Destination |
|---|---:|---|
| `main.js` | yes | `.obsidian/plugins/<manifest.id>/main.js` |
| `manifest.json` | yes, with beta/fallback handling | `.obsidian/plugins/<manifest.id>/manifest.json` |
| `styles.css` | optional | `.obsidian/plugins/<manifest.id>/styles.css` |

The folder name is the manifest `id`, not the GitHub repository name. A release that has a source zip or a root `main.js` but lacks exact release assets is incomplete for BRAT. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts] [SOURCE: https://docs.obsidian.md/Plugins/Releasing/Submit%20your%20plugin]

### 5.5 Side-effect ordering

The source flow is approximately:

1. Select and validate the release manifest.
2. Download and write release files under `.obsidian/plugins/<manifest.id>/`.
3. Add/update the repository in `pluginList` and `pluginSubListFrozenVersion` through `addBetaPluginToList`.
4. If `enableAfterInstall` is true, load the manifest and call Obsidian `enablePluginAndSave`.
5. Reload Obsidian manifests so the new plugin becomes visible.

[SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts] [INFERENCE: the final `community-plugins.json` representation is Obsidian-owned output of `enablePluginAndSave`, not a BRAT registry field]

## 6. Theme Install Mechanics

Themes do not use plugin release assets or `main.js`.

1. Fetch repository-root `theme-beta.css`; fall back to root `theme.css`.
2. Fetch repository-root `manifest.json`.
3. Use the theme manifest's `name` to create the local theme directory.
4. Write:

```text
.obsidian/themes/<manifest.name>/theme.css
.obsidian/themes/<manifest.name>/manifest.json
```

5. On a new install, BRAT can set the theme through Obsidian's theme state.
6. Store `{repo,lastUpdate}` in `themesList`, where `lastUpdate` is a CSS checksum/change marker.

Theme updates are checksum-based. They do not use plugin release `version` pins, and removing the BRAT entry does not imply deletion of the local theme directory. If GitHub caching leaves a stale theme, the official troubleshooting path is to unregister the theme and remove the local theme file/directory before retrying. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts] [SOURCE: https://tfthacker.com/brat-themes]

## 7. Enablement, Reload, and Vault State Boundaries

The three relevant vault artifacts are:

```text
.obsidian/plugins/obsidian42-brat/data.json
.obsidian/plugins/<manifest.id>/{main.js,manifest.json,styles.css?}
.obsidian/community-plugins.json
```

`data.json` answers “which GitHub repositories BRAT tracks?” The plugin folder answers “which release files are installed?” `community-plugins.json` answers “which plugin IDs has Obsidian enabled?” These files must not be conflated.

For a file-layer-only enablement fallback, edit `community-plugins.json` only while Obsidian is closed, parse the existing JSON, preserve every existing ID, append the manifest `id` exactly once, write atomically, then reopen/reload Obsidian. The usual file representation is an array of plugin IDs:

```json
[
  "existing-plugin-id",
  "new-plugin-id"
]
```

[INFERENCE: the array representation and closed-application safety follow Obsidian's community-plugin state model; BRAT itself calls `enablePluginAndSave`, which is safer than hand-editing the file when an Obsidian API/CLI is available.]

`restartPlugin` only disables and enables an already installed plugin. It does not refetch a release, repair a missing manifest, or rebuild `community-plugins.json` from BRAT registration. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts]

## 8. Error and Edge-Case Catalog

| Symptom | Likely cause | Check and recovery |
|---|---|---|
| “No release found” | Repository has no GitHub releases, or a requested frozen tag does not exist. | Inspect `/releases`; verify the exact tag in `pluginSubListFrozenVersion`. BRAT does not treat a root source tree as a normal plugin release. |
| `main.js` missing / release incomplete | Asset was not uploaded to the release, has a different name, or exists only inside a source zip. | Inspect the selected release assets for exact `main.js`, `manifest.json`, and optional `styles.css`. Re-upload exact names. |
| Manifest missing or has no `version` | Release manifest is absent, wrong-named, or malformed. | Validate JSON, `id`, `version`, `minAppVersion`, and `isDesktopOnly` before writing. |
| Plugin folder has wrong name | AI used repository name instead of `manifest.id`. | Read the selected manifest first and use `.obsidian/plugins/<manifest.id>`. |
| Plugin rejected on current Obsidian | `minAppVersion` is newer than the running API. | Upgrade Obsidian, select another release, or use `allowIncompatiblePlugins` only with explicit risk acceptance; inspect local `brat` compatibility metadata. |
| Plugin rejected on mobile | `isDesktopOnly: true`. | Do not force unless the plugin is known mobile-safe; forced installs mutate local manifest compatibility fields. |
| Registered plugin does not update | Its `version` entry is a non-`latest` release-tag pin. | Inspect `pluginSubListFrozenVersion`; set `version` to `latest`/empty only when tracking is intended. |
| Registered plugin folder is incomplete | Local `manifest.json` is missing or file writes were interrupted. | BRAT may retry installation on missing-local-manifest errors; independently verify release assets and local files. |
| Plugin does not appear after reload | Invalid manifest JSON, wrong folder ID, missing enablement entry, stale Obsidian manifest cache, or incompatible platform/version. | Parse manifest; compare folder name to `manifest.id`; inspect `community-plugins.json`; close/reopen Obsidian; inspect developer console. |
| Private repository returns unauthorized/empty result | Missing SecretStorage value, invalid/expired token, insufficient scope, or wrong per-repo secret name. | Check `tokenName` and `globalTokenName`, then SecretStorage on this device. Fine-grained PATs need read access to the intended repository. |
| Multiple repositories fail at once | GitHub API rate limit or 403. | Check BRAT logs, rate-limit headers, and developer console before debugging each release. |
| Theme does not update | Root CSS file unchanged according to checksum, GitHub cache, or wrong root filename. | Check `theme-beta.css` then `theme.css`, compare `themesList.lastUpdate`, unregister/delete stale local theme files, retry. |
| Removing a theme “did not remove it” | BRAT registration was removed but local theme files remain. | Treat unregistration and local file deletion as separate explicit operations. |
| Frozen tag differs from manifest version | Release tag and `manifest.json.version` are different identifiers. | Pin the exact GitHub release tag, then record the installed manifest version separately during verification. |
| BRAT data looks correct but install failed | Registration can be updated after/around file operations without proving final activation. | Verify all three boundaries: release files, `data.json`, and Obsidian enablement. |

Sources: [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts] [SOURCE: https://tfthacker.com/brat-themes] [SOURCE: https://tfthacker.com/brat-developers]

## 9. File-Layer Verification Model

After any plugin operation, verify in this order:

1. **Release identity** — selected tag/release URL and asset names.
2. **Manifest identity** — `manifest.id`, `version`, compatibility fields.
3. **Plugin files** — `main.js` and `manifest.json` exist under the ID folder; `styles.css` is optional.
4. **BRAT registration** — exact repository exists once in `pluginList`; its metadata object exists once in `pluginSubListFrozenVersion`.
5. **Pin state** — `version` is the intended tag, `latest`, or empty.
6. **Obsidian enablement** — the exact manifest ID appears once in `community-plugins.json` when enabled.
7. **Runtime visibility** — reopen/reload Obsidian and inspect the plugin list/console.

Do not report success after checking only `data.json`. The minimum evidence tuple is `{release, manifest, plugin files, BRAT registration, enablement}`. [INFERENCE: operational verification model derived from the independent source-side transitions above]

## 10. File-Layer AI Workflows

### 10.1 Headless install and enable a beta plugin

```text
Inputs: repo = owner/repo, optional releaseTag, vault root

1. Snapshot the existing data.json and community-plugins.json.
2. Resolve the release: exact releaseTag when supplied; otherwise BRAT's latest selection rule.
3. Require exact release assets main.js and manifest.json; accept styles.css only when present.
4. Parse manifest.json and validate id, version, minAppVersion, and isDesktopOnly.
5. Write to a temporary directory, then atomically place files under .obsidian/plugins/<manifest.id>/.
6. Update BRAT data.json: pluginList += repo; upsert the matching pluginSubListFrozenVersion object.
7. Prefer Obsidian's enable API/CLI. If unavailable, close Obsidian and atomically upsert manifest.id in community-plugins.json.
8. Reopen/reload Obsidian, then verify the seven checks in Section 9.
```

[SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts] [INFERENCE: atomic staging, snapshots, and closed-application editing are AI safety recommendations]

### 10.2 Register an already installed beta plugin

Use this only when the plugin folder and manifest are already valid:

```json
{
  "pluginList": ["owner/repo"],
  "pluginSubListFrozenVersion": [
    { "repo": "owner/repo", "version": "latest" }
  ]
}
```

Then verify `.obsidian/plugins/<manifest.id>/manifest.json` and decide separately whether to enable the ID. Registration alone does not install or enable the plugin. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts] [INFERENCE: based on independent registration and file/enablement paths]

### 10.3 Register and pin a frozen release tag

```json
{
  "pluginList": ["owner/repo"],
  "pluginSubListFrozenVersion": [
    { "repo": "owner/repo", "version": "v2.2.0" }
  ]
}
```

Fetch `/releases/tags/v2.2.0` first, install its exact assets, and record the manifest's own `version` during verification. Do not assume the tag and manifest version are identical. The update sweep skips this entry until the version is changed to `latest` or cleared. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts]

### 10.4 Private repository registration

Create or select the SecretStorage entry in Obsidian first. Store only its name in `globalTokenName` or the matching `tokenName`; never write the PAT value into `data.json`. A per-repo `tokenName` overrides the global name. The same SecretStorage value must exist on each device because SecretStorage is not synced like vault files. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/SettingsTab.ts] [SOURCE: https://tfthacker.com/brat-private-repo]

### 10.5 Add or remove a theme

For add/update, fetch root `theme-beta.css` or `theme.css` and root `manifest.json`, write `.obsidian/themes/<manifest.name>/theme.css` and `manifest.json`, then upsert `{repo,lastUpdate}`. For removal, remove the `themesList` entry and delete local theme files only as a separate, explicit vault mutation. [SOURCE: https://tfthacker.com/brat-themes] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts]

## 11. Recommendations

- Treat BRAT registration, plugin files, and enablement as three separate transactions with independent verification.
- Pin release tags for reproducible automation; use `latest` only when update drift is intentional.
- Preserve the exact tag string and separately record `manifest.version`.
- Validate release assets before changing `data.json`; stage files before activation.
- Use Obsidian's enable API when possible. Hand-edit `community-plugins.json` only with Obsidian closed and after preserving existing IDs.
- Keep private tokens in SecretStorage; `data.json` should contain names, never token values.
- For themes, use checksum/change detection and do not reuse plugin-release diagnostics.
- Keep backups of `data.json`, `community-plugins.json`, and the target plugin/theme directory before bulk changes. [INFERENCE: safety recommendations derived from the source contracts]

## Eliminated Alternatives

| Approach | Reason eliminated | Evidence | Iterations |
|---|---|---|---:|
| Treat `pluginSubListFrozenVersion` as only frozen plugins | BRAT tracks latest plugins there too; only truthy non-`latest` versions are skipped. | [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts] | 1, 2 |
| Install a plugin from repository-root `main.js`/`manifest.json` alone | Current plugin path selects GitHub releases and exact release assets. | [SOURCE: https://tfthacker.com/brat-developers] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts] | 1, 4, 5 |
| Treat a source zip as a valid release asset | BRAT looks for exact `main.js` and `manifest.json` asset names. | [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts] | 4 |
| Treat `data.json` registration as a complete install | Registration does not prove plugin files or Obsidian enablement. | [INFERENCE: from `BetaPlugins.ts` install and enable sequence] | 2, 4, 5 |
| Treat restart as reinstall/update | Restart only disables/enables an installed plugin. | [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts] | 5 |
| Store PAT values in `data.json` | v2+ uses SecretStorage names and clears legacy plaintext values. | [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts] | 3 |
| Diagnose themes like plugins | Themes use root CSS files and checksum tracking, not plugin release assets. | [SOURCE: https://tfthacker.com/brat-themes] | 2, 4, 5 |
| Retry local raw GitHub shell fetches as the primary source path | DNS/cache failure blocked that retrieval path during research. | [SOURCE: command output: `raw.githubusercontent.com` DNS failure] | 1, 3, 4, 5 |

## Divergence Map

No formal divergent pivots were required. The research deliberately broadened from schema to workflows, private-token handling, non-token errors, and final command/install closure because the configured stop policy required all five iterations. The remaining frontier is modal-only UI microcopy and branches in modal source files that were cache-missed; no core file-layer contract depends on those details.

## 12. Open Questions

Core file-layer questions are answered. Residual questions are bounded:

- Exact field-level UI microcopy and every branch inside `AddNewPluginModal`, `VersionSuggestModal`, and `AddNewTheme` should be confirmed from a local clone or GitHub API archive if UI automation needs pixel/branch parity.
- Upstream changes after the 2026-08-02 source snapshot may add or rename settings or commands.
- Obsidian's exact enablement file behavior can vary by Obsidian release; prefer the Obsidian API over direct JSON editing.

## 13. Source Coverage Matrix

| Contract | Primary source | Secondary source |
|---|---|---|
| Defaults and persisted schema | `src/settings.ts` | `src/main.ts` |
| Commands | `src/ui/PluginCommands.ts` | `src/features/BetaPlugins.ts` |
| Release selection/assets | `src/features/githubUtils.ts` | `src/features/BetaPlugins.ts`, Obsidian release docs |
| Plugin validation/writes | `src/features/BetaPlugins.ts` | Obsidian manifest docs |
| Themes | `src/features/themes.ts`, `src/features/githubUtils.ts` | `tfthacker.com/brat-themes` |
| Private repositories | `src/utils/TokenValidator.ts`, `src/ui/SettingsTab.ts` | `src/migrations.ts`, BRAT private-repo docs |
| Enablement | `BetaPlugins.ts` Obsidian API calls | Obsidian community-plugin docs |
| Troubleshooting | BRAT source error branches | BRAT docs and cited Obsidian forum reports |

The companion `resource-map.md` records delta source inventories for all five iterations. The complete evidence trail remains under `iterations/` and `deltas/`.

## 14. Data Validation Checklist

Before claiming a headless install succeeded, check:

- [ ] Repo is normalized as `owner/repo`.
- [ ] Selected release/tag exists and is the intended one.
- [ ] `main.js` and `manifest.json` are exact release assets; `styles.css` is optional.
- [ ] Manifest JSON parses and has `id` and `version`.
- [ ] `minAppVersion` and `isDesktopOnly` are compatible or explicitly risk-accepted.
- [ ] Files live under `.obsidian/plugins/<manifest.id>/`.
- [ ] Repo appears once in `pluginList`.
- [ ] Matching metadata object appears once in `pluginSubListFrozenVersion`.
- [ ] Pin is exactly the intended release tag, `latest`, or empty.
- [ ] Private token name resolves to a SecretStorage value on this device.
- [ ] `community-plugins.json` contains the manifest ID only when enablement is intended.
- [ ] Obsidian has been reopened/reloaded and the plugin is visible.

## 15. Safety, Rollback, and Mutation Boundaries

Rollback is a file restore, not a BRAT command: before mutation, snapshot `data.json`, `community-plugins.json`, and the target `.obsidian/plugins/<id>/` or `.obsidian/themes/<name>/` directory. On failure, close Obsidian, restore the snapshots atomically, and reopen it. Do not restore only `data.json` while leaving a newer plugin folder or enablement ID behind.

For an update, stage new files in a temporary directory, validate them, and replace the target files as one bounded operation. Preserve an existing `styles.css` according to the release/update behavior rather than deleting it speculatively. Keep the repository registration change separate from activation so a failed activation can be diagnosed without losing the source repo record. [INFERENCE: rollback and atomic staging are operational safeguards, not BRAT-provided transactions]

## 16. Convergence Report

- Stop reason: `maxIterationsReached`
- Total iterations: 5
- Questions answered: 5 / 5
- Remaining core questions: 0
- `newInfoRatio`: `1.00 -> 0.88 -> 0.93 -> 0.94 -> 0.78`
- Stop policy: `max-iterations`; early convergence was telemetry only.
- Quality: source-diverse evidence from BRAT source, TfTHacker docs, Obsidian docs, and bounded troubleshooting references.
- Known limitation: nested `cli-codex` could not initialize inside the detached Codex process (`Operation not permitted`); the manager recorded that failure and completed the same one-iteration artifact contract through native deep-research leaf dispatch. Research content and all writes remained lineage-local.

## 17. References

- [BRAT repository](https://github.com/TfTHacker/obsidian42-brat)
- [BRAT `settings.ts`](https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts)
- [BRAT `PluginCommands.ts`](https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts)
- [BRAT `BetaPlugins.ts`](https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts)
- [BRAT `githubUtils.ts`](https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts)
- [BRAT `themes.ts`](https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/themes.ts)
- [BRAT `SettingsTab.ts`](https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/SettingsTab.ts)
- [BRAT `TokenValidator.ts`](https://github.com/TfTHacker/obsidian42-brat/blob/main/src/utils/TokenValidator.ts)
- [TfTHacker BRAT documentation](https://tfthacker.com/BRAT)
- [TfTHacker BRAT plugin workflow](https://tfthacker.com/brat-plugins)
- [TfTHacker BRAT theme workflow](https://tfthacker.com/brat-themes)
- [TfTHacker BRAT developer notes](https://tfthacker.com/brat-developers)
- [TfTHacker private repository notes](https://tfthacker.com/brat-private-repo)
- [Obsidian manifest reference](https://docs.obsidian.md/Reference/Manifest)
- [Obsidian plugin release assets](https://docs.obsidian.md/Plugins/Releasing/Submit%20your%20plugin)
- [Obsidian community plugins help](https://obsidian.md/help/community-plugins)
