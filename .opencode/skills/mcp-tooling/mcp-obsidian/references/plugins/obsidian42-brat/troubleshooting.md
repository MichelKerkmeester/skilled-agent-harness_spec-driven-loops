---
title: "BRAT Troubleshooting"
description: "Cause, detection, and file-layer recovery for BRAT release, asset, tag, compatibility, update, rate-limit, SecretStorage, theme, and vault-state failures."
trigger_phrases:
  - "brat no release error"
  - "brat release asset mismatch"
  - "brat version tag mismatch"
  - "brat compatibility gate"
  - "brat github rate limit"
  - "brat frozen plugin skipped"
  - "brat private repository token"
  - "brat theme path confusion"
importance_tier: "normal"
contextType: "general"
version: 0.1.0.0
---

# BRAT Troubleshooting

BRAT failures usually occur at one of three boundaries: GitHub release discovery, release-asset and manifest validation, or vault-state registration and activation. Use the evidence files first, then repair only the failing stage described in [`src/features/BetaPlugins.ts`](https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts).

## 1. OVERVIEW

Triage in this order:

1. Identify whether the target is a plugin or a theme.
2. Check the exact repository path and release endpoint.
3. Inspect the release JSON and asset names.
4. Inspect `manifest.json` for `id`, `version`, `minAppVersion`, and `isDesktopOnly`.
5. Inspect BRAT's `data.json` membership and policy records.
6. Inspect `.obsidian/community-plugins.json` only for plugin activation.
7. Reload Obsidian after a successful file-layer repair.

| Evidence | Expected shape |
|---|---|
| GitHub release response | A published release with the intended `tag_name` and exact named assets. |
| Plugin manifest | JSON with `id`, `version`, and the compatibility metadata BRAT checks. |
| BRAT `data.json` | `pluginList` contains the repository; `pluginSubListFrozenVersion` contains the intended moving or frozen policy. |
| Plugin activation file | `.obsidian/community-plugins.json` contains the manifest ID, not the repository path. |
| Theme files | `.obsidian/themes/<manifest.name>/theme.css` and `manifest.json`; no community-plugin activation entry. |

BRAT's persisted defaults and token-name boundary are documented in [`data-model.md`](data-model.md). Its repository is [`TfTHacker/obsidian42-brat`](https://github.com/TfTHacker/obsidian42-brat); the source of release and compatibility behavior is [`src/features/BetaPlugins.ts`](https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts).

## 2. FAILURE CATALOG

| Failure | Cause | Detection | File-layer fix |
|---|---|---|---|
| No GitHub release | The repository has no published release, or the requested tag does not exist. | `GET /repos/<repo>/releases/latest` or `GET /releases/tags/<tag>` returns an error or no usable `tag_name`. | Stop before writing the vault. Select a published release or ask the repository owner to publish one; do not fall back from an exact tag to `latest`. |
| Release asset name mismatch | The release uses a bundle name, nested path, or differently cased filename instead of BRAT's exact assets. | The release JSON has no asset named `main.js` or `manifest.json`; `styles.css` may be absent because it is optional. | Select only exact asset names. If `main.js` or `manifest.json` is unavailable, the release is not installable by this BRAT flow. |
| Manifest missing `id` or `version` | The downloaded manifest is invalid or is not an Obsidian plugin manifest. | `jq -e '.id and .version' manifest.json` fails, or parsing returns `null`. | Discard the staged files and choose a release containing a valid manifest. Never derive the target folder from the repository name. |
| Version/tag mismatch | The requested release tag, fetched release, installed manifest, and BRAT policy do not describe the same intended release. | Compare the requested tag with API `tag_name`, the manifest `version`, and `pluginSubListFrozenVersion[].version`. | For a frozen install, use `/releases/tags/<exact-tag>`, require an exact `tag_name`, write that tag to the policy record, and re-stage the matching assets. |
| Minimum app-version gate | `manifest.minAppVersion` is newer than the Obsidian version in the target vault. | Read `manifest.minAppVersion` and compare it with the target app version; BRAT flags the item incompatible. | Upgrade Obsidian, choose a compatible release, or deliberately enable the documented `allowIncompatiblePlugins` policy. Do not silently bypass the gate. |
| Desktop-only gate | `manifest.isDesktopOnly` is true but the target is a mobile vault. | Inspect `manifest.isDesktopOnly` before activation. | Install only on a supported desktop target, or leave the files staged but do not activate them on mobile. |
| Frozen plugin skipped | The policy record has a truthy `version` other than `latest`, so update-all honors the pin. | Inspect the matching `pluginSubListFrozenVersion` record; a value such as `v2.2.0` is a deliberate skip, not a failed request. | Keep the skip if the pin is intentional. To move it, run an explicit new-tag install or change the policy to `latest` as a separate operation, then verify the new release. |
| GitHub API rate limit | Unauthenticated or low-budget GitHub API calls have exhausted the available request quota. | API response is `403` or `429`; inspect `X-RateLimit-Remaining`, `X-RateLimit-Reset`, and response body. | Stop retries, wait until reset, or use an authorized GitHub token through Obsidian SecretStorage. Do not put the token in `data.json`. |
| Private-repository access boundary | The repository is private and no usable token is available to BRAT's SecretStorage lookup, or the token lacks repository access. | API returns `401`/`403`; `globalTokenName` or `tokenName` is empty or names a missing SecretStorage entry. | Provision the token through Obsidian SecretStorage, confirm its repository scope, preserve only the secret name in `data.json`, and retry after access is confirmed. |
| Plugin/theme path confusion | A theme was written as a plugin, or a plugin was written below `.obsidian/themes/`. | The target contains the wrong file set or the manifest cannot be found where Obsidian expects it. | Plugins use `.obsidian/plugins/<manifest.id>/` and `main.js`; themes use `.obsidian/themes/<manifest.name>/` and `theme.css`. Re-stage into the correct path. |
| Registration without plugin files | `data.json` contains the repository but the release assets were never staged or were staged under the wrong ID. | `pluginList` contains the repo, but `test -s .../main.js` or `manifest.json` fails. | Stage the exact release assets first, derive the folder from `manifest.id`, then leave registration in place only after files verify. |
| Files without registration | The plugin folder exists but BRAT does not know the repository. | Manifest and `main.js` exist, but no matching `pluginList` string or policy record exists. | Add the exact normalized repository path and upsert a moving or frozen policy record without replacing unrelated settings. |
| Files not enabled | The plugin is installed and registered but absent from Obsidian's activation list. | `community-plugins.json` does not contain the manifest ID. | Add the exact manifest ID to `.obsidian/community-plugins.json`, then reload Obsidian. The repository path is not a valid activation value. |
| Stale or missing stylesheet | `styles.css` was omitted from the staged folder, or an old stylesheet remains after an update. | Compare the release asset list with the target folder; inspect whether the release contains `styles.css`. | Copy `styles.css` when the release supplies it. If the new release omits it, preserve or remove the old file only according to the release's intended package contents. |
| Theme CSS missing | The theme release contains `theme-beta.css` or `theme.css` under an unexpected location, or the wrong file was copied. | `.obsidian/themes/<manifest.name>/theme.css` is absent or empty. | Prefer the exact root `theme-beta.css` when supplied, otherwise root `theme.css`, and copy it to the required `theme.css` target. |
| Theme manifest/path failure | Theme manifest `name` is absent or the directory uses a repository name instead of the manifest name. | The theme directory does not match `manifest.name`. | Read the root theme manifest, create `.obsidian/themes/<manifest.name>/`, and place `theme.css` plus `manifest.json` there. |
| Theme cache or stale render | Correct files are present but Obsidian still renders the old CSS. | CSS checksum and file mtime changed, but the UI is unchanged after the file operation. | Reload Obsidian and re-check the theme. Do not register a theme in `community-plugins.json` to force activation. |
| Corrupt or overwritten JSON | A partial write, invalid merge, or concurrent Obsidian write damaged `data.json` or `community-plugins.json`. | `jq empty` fails, the top-level type is wrong, or unrelated entries disappeared. | Stop, restore the most recent backup, close Obsidian, merge only the intended field, write through a temporary file, and re-parse before reopening. |

The asset, manifest, release, and compatibility behavior above follows [`src/features/BetaPlugins.ts`](https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts). The persisted key and SecretStorage boundary follow [`src/settings.ts`](https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts).

## 3. PLUGIN FAILURE RECIPES

### No release or wrong tag

Capture the exact request and response before changing the vault:

```sh
REPO="owner/repository"
TAG="v2.2.0"
curl -fsSL "https://api.github.com/repos/$REPO/releases/tags/$TAG" -o /tmp/brat-release.json
jq -e --arg tag "$TAG" '.tag_name == $tag' /tmp/brat-release.json >/dev/null
jq -r '.assets[].name' /tmp/brat-release.json
```

If the exact-tag request fails, do not install the latest release under the frozen tag. If the latest request returns no release, do not write a registration record that implies a staged plugin.

### Exact asset set

The minimum plugin asset set is:

```sh
jq -e '[.assets[].name] | index("main.js") and index("manifest.json")' /tmp/brat-release.json >/dev/null
```

Download by the API-provided `browser_download_url` only after selecting the exact name. Then validate both downloaded JSON and the manifest identity:

```sh
jq empty /tmp/brat-stage/manifest.json
jq -e '.id and .version' /tmp/brat-stage/manifest.json >/dev/null
```

A successful JSON parse does not prove that the file is a compatible Obsidian plugin; the `id`, `version`, and compatibility fields still need checking.

### Version and compatibility metadata

Record three independent values in the diagnostic output: requested release tag, API `tag_name`, and manifest `version`. Then record the target Obsidian version and `minAppVersion`, plus `isDesktopOnly` when present. Repair the release selection or target environment before changing `allowIncompatiblePlugins`.

## 4. UPDATE AND REGISTRATION DIAGNOSTICS

### Frozen-skip surprise

Find the exact policy record:

```sh
REPO="owner/repository"
jq --arg repo "$REPO" '.pluginSubListFrozenVersion[] | select(.repo == $repo)' /path/to/vault/.obsidian/plugins/obsidian42-brat/data.json
```

`version: "v2.2.0"` means update-all is behaving correctly when it skips the entry. A record with `latest`, an empty value, or no record is moving policy. Do not diagnose a frozen skip as an API failure until this record is checked.

### Check, update, reinstall, and restart are different

- Check-only reads release and compatibility state without replacing staged files.
- Update replaces files for moving entries that have a usable newer release.
- Reinstall deliberately stages the selected release again, useful after a damaged local folder.
- Restart or reload makes newly written plugin files visible to Obsidian; it does not select a release or repair BRAT registration.

After any operation, check all three stages: plugin files, BRAT registration, and activation. A green result at one stage does not prove the other two.

### Registration removal

If the goal is to stop future BRAT updates, remove the repository from `pluginList` and matching policy records. If the goal is to disable the plugin, separately remove its manifest ID from `community-plugins.json`. If the goal is to uninstall, separately identify and remove the plugin folder after a backup. Keep these operations distinct so a registration repair does not delete working files.

## 5. PRIVATE-REPOSITORY DIAGNOSTICS

BRAT v2.0+ separates GitHub token values from `data.json`. Check only these persisted names:

```sh
jq '{globalTokenName, pluginSubListFrozenVersion: [.pluginSubListFrozenVersion[] | {repo, tokenName}]}' /path/to/vault/.obsidian/plugins/obsidian42-brat/data.json
```

Then confirm through Obsidian's SecretStorage boundary that the named entry exists and the token can read the target repository. A `ghp_` or `github_pat_` prefix is accepted by BRAT's token handling, but the secret itself must not be copied into shell logs, source files, or `data.json`. If the repository is private and the token is missing or under-scoped, no amount of JSON registration repair can make the release API request succeed.

## 6. THEME VERSUS PLUGIN PATH

| Item | Release/file contract | Registration/activation |
|---|---|---|
| Plugin | `main.js`, `manifest.json`, optional `styles.css` → `.obsidian/plugins/<manifest.id>/` | Repository in BRAT `pluginList` and policy record; manifest ID in `community-plugins.json` for activation. |
| Theme | `theme-beta.css` or `theme.css`, plus root `manifest.json` → `.obsidian/themes/<manifest.name>/theme.css` and `manifest.json` | Repository and CSS checksum in `themesList`; never add the theme to `community-plugins.json`. |

If a troubleshooting report says “installed but not visible,” resolve the item type before changing either JSON file. The theme-specific source is [`src/features/themes.ts`](https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/themes.ts); the plugin-specific source is [`src/features/BetaPlugins.ts`](https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts).

## 7. SOURCES AND RELATED RESOURCES

- [`TfTHacker/obsidian42-brat`](https://github.com/TfTHacker/obsidian42-brat)
- [`src/settings.ts`](https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts)
- [`src/features/BetaPlugins.ts`](https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts)
- [`src/features/themes.ts`](https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/themes.ts)
- [`BRAT data model`](data-model.md)
- [`BRAT workflows`](workflows.md)
- [`brat-data-entry.example.json`](../../../assets/brat-data-entry.example.json)
