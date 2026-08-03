# obsidian42-BRAT: File-Layer Operations Knowledge Base

## 1. Executive Summary

BRAT (`obsidian42-brat`) is an in-Obsidian manager for beta plugins and themes. Its current plugin path is GitHub-release-asset-first: it selects a release, validates a release `manifest.json`, downloads exact assets (`main.js`, `manifest.json`, optional `styles.css`), writes them beneath `.obsidian/plugins/<manifest.id>/`, registers the repository in BRAT settings, and optionally enables the plugin through Obsidian APIs. It does not fall back to repository-root plugin files when a usable release is absent. Themes use a different root-file path: `theme-beta.css` then `theme.css`, plus `manifest.json`. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/themes.ts] [SOURCE: https://tfthacker.com/brat-developers]

For a file-layer AI, three states must remain explicit and independently verified:

1. Plugin files are installed under `.obsidian/plugins/<id>/`.
2. The plugin id is enabled in Obsidian, normally persisted in `.obsidian/community-plugins.json`.
3. The GitHub repository is registered in BRAT `.obsidian/plugins/obsidian42-brat/data.json`.

BRAT can perform all three while running inside Obsidian, but editing one state at the file layer does not imply the other two. [INFERENCE: based on https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts]

## 2. Scope and Evidence

This report targets BRAT v2.2.0+ and current `main` behavior in `TfTHacker/obsidian42-brat`. It uses the repository source as behavioral authority and official `tfthacker.com/BRAT` pages for user-facing semantics. Findings are current-main unless explicitly labeled as compatibility or inference.

Primary source areas:

- `src/settings.ts`: persisted settings model and defaults.
- `src/features/BetaPlugins.ts`: plugin install, update, reload, removal, and compatibility behavior.
- `src/features/githubUtils.ts`: GitHub release selection, assets, authentication, and API failures.
- `src/features/themes.ts`: theme fetch, checksum, install, update, and unregister behavior.
- `src/ui/PluginCommands.ts`, `src/main.ts`, and `src/ui/SettingsTab.ts`: commands, protocol registration, scheduling, and settings actions.

## 3. Terminology and State Boundaries

| Term | Meaning |
|---|---|
| Repository | GitHub `Owner/repo` stored by BRAT. |
| Plugin id | `manifest.json.id`; names the `.obsidian/plugins/<id>/` directory and enablement entry. |
| Latest tracking | `pluginSubListFrozenVersion[].version` is `latest` (or legacy-empty); ordinary update checks may replace files. |
| Frozen/pinned tracking | The version record contains a specific GitHub release tag; ordinary all-plugin updates skip it. |
| Installed | Required release assets exist beneath the plugin id folder. |
| Enabled | Obsidian's plugin manager has persisted the plugin id as enabled. |
| BRAT-managed | The repo is present in `pluginList` with a matching version record. |
| Theme unregister | Remove the repo from `themesList`; it does not delete the installed theme folder. |

## 4. Verified `data.json` Model

The persisted file is `.obsidian/plugins/obsidian42-brat/data.json`. Current source defines these fields and defaults. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts]

| Key | Type | Default | Meaning |
|---|---|---|---|
| `pluginList` | `string[]` | `[]` | Repository membership list, e.g. `Owner/repo`. |
| `pluginSubListFrozenVersion` | `PluginVersion[]` | `[]` | Per-repository version and private-repo metadata. Despite its historical name, it also contains `latest` entries. |
| `themesList` | `ThemeInformation[]` | `[]` | Theme repository plus downloaded CSS checksum. |
| `updateAtStartup` | boolean | `true` | Schedule plugin update processing after startup. |
| `updateThemesAtStartup` | boolean | `true` | Schedule theme update processing after startup. |
| `enableAfterInstall` | boolean | `true` | Enable newly installed plugins through Obsidian. |
| `loggingEnabled` | boolean | `false` | Enable BRAT logging. |
| `loggingPath` | string | `BRAT-log` | Log location/name setting. |
| `loggingVerboseEnabled` | boolean | `false` | Enable verbose logging. |
| `debuggingMode` | boolean | `false` | Enable debug behavior. |
| `notificationsEnabled` | boolean | `true` | Show BRAT notices. |
| `globalTokenName` | string | empty | SecretStorage name used for GitHub authentication. |
| `personalAccessToken` | string | empty/deprecated | Compatibility field; do not place a new token here. |
| `selectLatestPluginVersionByDefault` | boolean | `false` | Default version choice in the add flow. |
| `allowIncompatiblePlugins` | boolean | `false` | Whether the UI may offer a forced incompatible install path. |

`PluginVersion` is:

```ts
{
  repo: string;
  version: "latest" | string;
  token?: string;        // deprecated
  tokenName?: string;    // SecretStorage lookup name
  isIncompatible?: boolean;
}
```

`ThemeInformation` is:

```ts
{
  repo: string;
  lastUpdate: string; // checksum of downloaded theme CSS
}
```

A representative current settings document is:

```json
{
  "pluginList": ["Owner/example-plugin"],
  "pluginSubListFrozenVersion": [
    {
      "repo": "Owner/example-plugin",
      "version": "latest"
    }
  ],
  "themesList": [
    {
      "repo": "Owner/example-theme",
      "lastUpdate": "<css-checksum>"
    }
  ],
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

When editing an existing file, merge and upsert these collections; do not replace the document with the example or discard unknown future keys.

## 5. Complete Command and Action Map

| Requested action | Current command/action | Behavior |
|---|---|---|
| Add beta plugin | `AddBetaPlugin` / “Plugins: Add a beta plugin for testing (with or without version)” | Opens the add modal, installs selected release assets, registers the repo, and optionally enables. The `obsidian://brat?plugin=Owner/repo` protocol opens the same flow. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/main.ts] |
| Add frozen version | Same current add flow with a selected/prefilled `version` | Installs the requested release tag and stores it in `pluginSubListFrozenVersion`; ordinary updates skip the entry. Older docs may describe this as a separate frozen command. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/main.ts] [SOURCE: https://tfthacker.com/brat-plugins] |
| Check all and update | `checkForUpdatesAndUpdate` | Calls the all-plugin walker in write mode, skips pinned entries, updates newer latest-tracked releases, reloads updated plugins, and checks graduation. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts] |
| Check all without updating | `checkForUpdatesAndDontUpdate` | Detects and reports available updates but returns before file replacement. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts] [SOURCE: https://tfthacker.com/brat-plugins] |
| Update one plugin | `updateOnePlugin` | Offers latest-tracked repos only, then updates the selected repo if a newer release exists. Frozen repos are filtered out. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts] |
| Restart plugin | `restartPlugin` | Selects an installed manifest and calls BRAT reload: disable then enable in memory. It does not download files. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts] |
| Add beta theme | `GrabBetaTheme` or `obsidian://brat?theme=Owner/repo` | Fetches root theme CSS/manifest, writes the theme folder, registers its checksum, and selects it. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/themes.ts] [SOURCE: https://tfthacker.com/brat-themes] |
| Remove beta theme | Settings UI `themeDelete` | Removes only the `themesList` registration and warns that files remain. No command-palette removal entry was found in current source. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/SettingsTab.ts] [SOURCE: https://tfthacker.com/brat-themes] |

BRAT's protocol supports opening plugin/theme add flows, not direct enable/disable operations. Official docs route enable/disable automation to Advanced URI or eval instead. [SOURCE: https://tfthacker.com/brat-protocol]

## 6. Plugin Install and Update Mechanics

### 6.1 Release selection

- A specific version uses GitHub `repos/{repo}/releases/tags/{version}`.
- Latest tracking enumerates releases, prefers semantic-version ordering when tags coerce cleanly, and uses publication time for non-version tags.
- The install path can include prereleases for beta behavior.
- Current plugin installation requires a usable release; it does not use repository-root plugin files as a fallback. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts] [SOURCE: https://tfthacker.com/brat-developers]

### 6.2 Manifest validation and normalization

BRAT obtains the selected release manifest, requires `id` and `version`, and uses `id` as the install-directory name. Source may normalize a manifest/release-tag version mismatch before writing the local `manifest.json`; therefore the local version is BRAT's normalized selected-release version, not necessarily byte-identical to an inconsistent uploaded manifest. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts]

Compatibility checks cover:

- `manifest.minAppVersion` newer than the running Obsidian version;
- `manifest.isDesktopOnly` on mobile;
- the optional incompatible-install confirmation path when allowed;
- persisted `isIncompatible` metadata where applicable. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts]

### 6.3 Required assets and file writes

The selected GitHub release must contain exact assets:

- `manifest.json`
- `main.js`
- `styles.css` (optional)

BRAT writes them as:

```text
.obsidian/plugins/<manifest.id>/
├── main.js
├── manifest.json
└── styles.css        # only when supplied
```

After an initial install, BRAT upserts the repo/version metadata, saves settings, reloads manifests, and—when `enableAfterInstall` is true—calls Obsidian `enablePluginAndSave(manifest.id)`. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts]

### 6.4 Update behavior

- Entries with a specific version other than empty/`latest` are skipped.
- Latest-tracked repos compare the installed manifest version with the selected release manifest.
- A newer version replaces release files and reloads the plugin.
- “Check only” reports the update and returns before writing.
- “Update one” filters pinned repos out of its candidate list. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts]

## 7. Theme Install and Update Mechanics

Themes do not use the plugin release-asset pipeline. BRAT fetches repository-root theme files, preferring `theme-beta.css` and falling back to `theme.css`, and also requires root `manifest.json`. It writes:

```text
.obsidian/themes/<manifest.name>/
├── theme.css
└── manifest.json
```

The saved `themesList[].lastUpdate` is a checksum of the downloaded CSS. Update detection compares theme content, not manifest version. Initial install registers the checksum and switches to the theme. Unregistering removes only the BRAT entry; it does not delete this directory. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/themes.ts] [SOURCE: https://tfthacker.com/brat-themes]

## 8. File-Layer State Model

Treat these as a small state machine:

```text
release assets downloaded
        |
        v
files installed under plugin id ----> manifest visible after Obsidian rescan
        |                                        |
        |                                        v
        +---- BRAT repo registered          plugin id enabled
```

None of the three terminal facts proves either of the others. Registration can be stale after manual uninstall. Files can exist while the plugin is disabled. A plugin can be enabled but not BRAT-managed. [INFERENCE: based on BRAT settings persistence and Obsidian plugin-manager calls]

For deterministic file-layer work:

- Prefer stopping Obsidian before editing JSON/settings or replacing plugin files, because a running application may cache and later rewrite those files. [INFERENCE: operational safeguard based on the reload/cache behavior]
- Back up `data.json` and `community-plugins.json`.
- Stage downloads, parse/validate JSON, then replace the target plugin directory atomically where the host permits.
- Preserve unrelated JSON members and deduplicate arrays.
- Reopen Obsidian and verify manifest visibility and actual enablement.

## 9. File-Layer Workflows

### 9.1 Headless install and enable a beta plugin

1. Resolve `Owner/repo` and optional release tag.
2. Fetch either `/releases/tags/<tag>` or the releases list using BRAT-compatible selection rules.
3. Resolve exact release assets `manifest.json`, `main.js`, and optional `styles.css`.
4. Validate JSON; require `manifest.id` and `manifest.version`. Check `minAppVersion` and `isDesktopOnly` before writing.
5. Write to `.obsidian/plugins/<manifest.id>/`.
6. Parse `.obsidian/community-plugins.json` as an array, append `manifest.id` if absent, and write valid JSON. Do not confuse repo name with plugin id.
7. Restart Obsidian or trigger a supported reload, then verify the manifest appears and the plugin is actually enabled.

Example enablement document:

```json
[
  "obsidian42-brat",
  "target-plugin-id"
]
```

The `community-plugins.json` edit is a file-layer recommendation; BRAT itself calls `enablePluginAndSave` instead of documenting that file format. [INFERENCE: based on https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts]

### 9.2 Register an already installed plugin in BRAT

Registration does not install or enable. With Obsidian stopped, parse the existing BRAT `data.json`, then:

1. Add `Owner/repo` to `pluginList` exactly once.
2. Upsert one `pluginSubListFrozenVersion` record with the same `repo`.
3. Use `version: "latest"` for normal update tracking.
4. Preserve all other settings and collection entries.

Minimal merge fragment:

```json
{
  "pluginList": ["Owner/repo"],
  "pluginSubListFrozenVersion": [
    {
      "repo": "Owner/repo",
      "version": "latest"
    }
  ]
}
```

[SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts]

### 9.3 Pin a frozen release tag

Pinning BRAT metadata alone prevents future ordinary updates; it does not roll the installed files backward. A deterministic pin therefore has two parts:

1. Install the assets from the desired GitHub release tag.
2. Set the matching record to that exact tag.

```json
{
  "pluginList": ["Owner/repo"],
  "pluginSubListFrozenVersion": [
    {
      "repo": "Owner/repo",
      "version": "1.2.3"
    }
  ]
}
```

BRAT pinning is release-tag-based; no source evidence supports a commit-SHA pin in this settings field. [SOURCE: https://tfthacker.com/brat-plugins] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts]

### 9.4 Untrack without uninstalling

For a plugin, remove the repo from both `pluginList` and `pluginSubListFrozenVersion`. For a theme, remove the matching `themesList` entry. In both cases installed files remain until separately deleted through Obsidian or manual cleanup. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/themes.ts]

## 10. AI Usage Recipes

### Audit BRAT state without changing it

1. Parse `data.json`.
2. Assert every `pluginList` repo has exactly one matching version record.
3. For each repo, locate the installed manifest id and check `.obsidian/plugins/<id>/manifest.json` plus `main.js`.
4. Compare installed ids with `community-plugins.json`.
5. Report four statuses separately: tracked, installed, enabled, pinned/latest.

### Install and hand management to BRAT

Run workflow 9.1, then workflow 9.2 with `latest`. Verify the repo is tracked only after the installed manifest id is known. Never derive the plugin directory from `Owner/repo`.

### Freeze a known-good build

Download and validate the chosen tag, replace files, update the version record, reopen Obsidian, and confirm both the local manifest version and BRAT record. If only the record changed, label the operation “future updates pinned,” not “installed version rolled back.”

### Prepare a private-repo entry

Store only a `tokenName` in the version entry, and only when that name already resolves through Obsidian SecretStorage:

```json
{
  "repo": "Owner/private-repo",
  "version": "latest",
  "tokenName": "brat-token-owner-private-repo"
}
```

A file-only AI cannot safely create the corresponding SecretStorage secret through `data.json`. [SOURCE: https://tfthacker.com/brat-private-repo] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts]

## 11. Troubleshooting Catalog

| Symptom | Cause | Recovery |
|---|---|---|
| Repository has no releases | Current plugin install requires a selected GitHub release; root plugin files are not the fallback. | Publish/select a release carrying required assets. [SOURCE: https://tfthacker.com/brat-developers] |
| Release exists, install fails before folder creation | Release `manifest.json` is absent, invalid JSON, or lacks `id`/`version`. | Upload a valid exact-name asset and retry. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts] |
| Partial/empty plugin folder | `main.js` is absent or an asset uses a different name/case. | Publish exact names: `main.js`, `manifest.json`, optional `styles.css`; reinstall from a clean staging directory. |
| Wrong installed version | Frozen metadata was changed without replacing files, or release tag/manifest version was inconsistent. | Install assets from the intended tag, then set the version record; verify local manifest afterward. |
| Plugin not shown after reload | Directory is not `.obsidian/plugins/<manifest.id>`, manifest is invalid, manifests were not rescanned, or Obsidian is still using cached state. | Check directory/id/JSON, restart Obsidian, then use BRAT restart/reload if the manifest becomes visible. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts] |
| Plugin shown but disabled | Files and manifests exist, but id is not enabled. | Enable through Obsidian API/UI or carefully merge the id into `community-plugins.json` while Obsidian is stopped. [INFERENCE: based on `enablePluginAndSave`] |
| Enabled but BRAT does not update it | Repo is absent from `pluginList`, its version record is missing, or it is pinned. | Upsert membership and matching version metadata; use `latest` only if updates are desired. |
| BRAT tracks an uninstalled plugin | Files were manually removed, but registration remained. | Remove the repo from both BRAT plugin collections or reinstall it. |
| Private repo returns 401/404 | Missing/expired token, inadequate read permissions, bad `tokenName`, or SecretStorage entry absent. | Create a read-capable token, store it via supported BRAT/Obsidian secret handling, and reference only its name. [SOURCE: https://tfthacker.com/brat-private-repo] |
| GitHub API failures/rate limits | Unauthenticated quota, bad auth, network failure, or API error. | Retry after quota recovery or configure the supported token path; inspect BRAT logs/notices. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts] |
| Incompatible plugin rejected | `minAppVersion` exceeds installed Obsidian or `isDesktopOnly` conflicts with mobile. | Upgrade Obsidian/use desktop, or make an explicit user-approved incompatible install when supported; do not silently force from a file-only agent. |
| Update one does not list a plugin | Its version record is pinned rather than `latest`. | Unpin intentionally, or install/update the pinned tag manually. |
| Check-only reports but files do not change | Expected behavior; check-only returns before update writes. | Run the update command if replacement is intended. |
| Theme install/update fails | Root lacks `theme-beta.css`/`theme.css` or `manifest.json`, or fetched content is stale. | Add exact root files; allow cache propagation; retry. [SOURCE: https://tfthacker.com/brat-themes] |
| Removing a theme leaves files | BRAT removal is registration-only. | Delete through Obsidian Appearance/manual cleanup if desired. |

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---:|
| Repository-root plugin install as current primary path | Current source and developer docs use release assets and fail without a usable release manifest. | `BetaPlugins.ts`; BRAT developer docs | 1 |
| Frozen list replaces `pluginList` | `pluginList` remains membership; `pluginSubListFrozenVersion` supplements it with per-repo metadata. | `settings.ts` | 1 |
| BRAT is a fully headless installer | Install, enablement, modals, reloads, vault adapter, and SecretStorage rely on a running Obsidian API environment. | `main.ts`; `BetaPlugins.ts` | 2 |
| BRAT protocol directly enables/disables plugins | Official protocol docs expose plugin/theme add flows and route enable/disable elsewhere. | BRAT protocol docs | 2 |
| Removing a BRAT theme deletes its files | Source and docs say removal only unregisters tracking. | `themes.ts`; theme docs | 2 |
| Retry raw GitHub shell fetching in this run | DNS failed in iteration 1; browser-accessible source and docs provided the evidence path. | Iteration 1 dead end | 1–2 |

## Divergence Map

- Saturated directions: persisted schema; release-first plugin install; command callbacks; file-layer state separation; core failure branches.
- Pivots taken: none; `convergenceMode=default` and the hard two-iteration cap applied.
- Remaining frontier: modal field-by-field validation and version-picker UI internals.
- Council artifacts: none.
- Audited overrides: convergence telemetry did not stop early because `stopPolicy=max-iterations`.

## 12. Open Questions

1. The exact field validation and default-selection behavior inside `AddNewPluginModal.ts`, `AddNewTheme.ts`, and `VersionSuggestModal.ts` was not fully source-readable in this run. Downstream install and persistence behavior is verified, but modal-only UI details remain lower confidence.
2. Historical v2.2.0 point releases may differ from current `main` in labels or token migration details. For a version-locked deployment, inspect the matching tag rather than assuming current-main UI parity.

Neither gap blocks the requested file-layer workflows.

## 13. Private Repository and Security Model

Official docs call private-repository support experimental. The token needs repository-content read access. Current source stores token references (`tokenName`) and retrieves values from Obsidian SecretStorage; the deprecated `personalAccessToken`/per-entry `token` fields should not be used for new plaintext secrets. [SOURCE: https://tfthacker.com/brat-private-repo] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts]

Operational rules:

- Never place a live token in research artifacts, `data.json`, logs, or prompts.
- A file-layer AI may preserve or set a token name, but must not claim the secret exists.
- Validate that private release assets are fetched with authorization and never persist response headers.
- Treat downloaded JavaScript as untrusted code; checksum or inspect before installation when operating unattended.

## 14. Compatibility and Version Semantics

- Frozen values identify GitHub release tags, not arbitrary commits.
- Local `manifest.version` may be normalized against the selected release tag when uploaded metadata disagrees.
- `minAppVersion` is an install compatibility gate; updating Obsidian is safer than forcing.
- `isDesktopOnly` blocks mobile use.
- `allowIncompatiblePlugins` exposes an intentional user-confirmation path; it is not blanket permission for an unattended file-layer AI.
- Theme updates use CSS checksum rather than `manifest.version`.

[SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/themes.ts]

## 15. Operational Checklist

Before mutation:

- [ ] Obsidian is stopped or the operator accepts cache/overwrite risk.
- [ ] `data.json` and `community-plugins.json` are backed up and parse successfully.
- [ ] Repository, desired release tag, and manifest id are distinguished.
- [ ] Required assets exist with exact names.
- [ ] Manifest compatibility is checked.
- [ ] Private credentials, if any, use supported secret storage.

After mutation:

- [ ] Plugin directory equals `.obsidian/plugins/<manifest.id>`.
- [ ] `main.js` and valid `manifest.json` exist; `styles.css` is present only when supplied.
- [ ] `community-plugins.json` contains the id exactly once if enablement was requested.
- [ ] `pluginList` contains the repo exactly once if BRAT management was requested.
- [ ] Exactly one matching version record exists and uses `latest` or the intended tag.
- [ ] Obsidian discovers the manifest and loads the plugin without errors.
- [ ] The claimed installed version matches the local manifest and downloaded release.

## 16. Recommendations

1. Model install, enablement, and BRAT registration as separate idempotent operations with separate verification.
2. Resolve folders from `manifest.id`, never from the GitHub repository name.
3. For pins, install the pinned assets before writing the tag; metadata-only pinning does not change current files.
4. Preserve BRAT settings by merge/upsert, not wholesale replacement.
5. Fail closed on missing releases, malformed manifests, incompatible builds, or absent secrets.
6. Keep private tokens out of files; a `tokenName` without a SecretStorage entry is not working authentication.
7. When Obsidian is running, prefer its APIs for enable/reload; file edits require a restart/rescan and are more vulnerable to cached-state overwrite.

## 17. References

Repository source:

- [SOURCE: https://github.com/TfTHacker/obsidian42-brat]
- [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts]
- [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts]
- [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts]
- [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/themes.ts]
- [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts]
- [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/SettingsTab.ts]
- [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/main.ts]

Official BRAT documentation:

- [SOURCE: https://tfthacker.com/brat-quick-guide]
- [SOURCE: https://tfthacker.com/brat-plugins]
- [SOURCE: https://tfthacker.com/brat-developers]
- [SOURCE: https://tfthacker.com/brat-themes]
- [SOURCE: https://tfthacker.com/brat-private-repo]
- [SOURCE: https://tfthacker.com/brat-protocol]

## Convergence Report

- Stop reason: `maxIterationsReached`
- Total iterations: 2
- Questions answered: 5 / 5 at the requested behavioral/file-layer level
- Residual uncertainty: modal-only field validation and point-release UI differences
- New-information trend: 1.00 → 0.90
- Average new-information ratio: 0.95
- Convergence threshold: 0.05
- Stop-policy note: convergence before iteration 2 was telemetry only; the workflow continued to the configured cap.
- Source-quality result: repository source plus official BRAT documentation; no core conclusion rests on a single weak source.
