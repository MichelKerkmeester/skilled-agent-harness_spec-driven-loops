---
title: "BRAT File-Layer Workflows"
description: "Goal-driven file operations for staging, registering, activating, pinning, updating, removing, and troubleshooting BRAT-managed Obsidian plugins and themes."
trigger_phrases:
  - "brat headless plugin install"
  - "brat stage register activate"
  - "brat frozen release pin"
  - "brat update all frozen skip"
  - "brat beta theme install"
  - "install beancount tables with brat"
  - "brat registration removal"
importance_tier: "normal"
contextType: "implementation"
version: 0.1.0.0
---

# BRAT File-Layer Workflows

These recipes operate on a vault's files when Obsidian commands cannot be invoked. They mirror BRAT's release-asset installation and registration behavior while keeping staging, registration, and activation as separate, verifiable stages.

## 1. OVERVIEW

BRAT is the installer and updater for GitHub beta plugins and themes. Its source flow is in [`src/features/BetaPlugins.ts`](https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts) and its command surface is centralized in [`src/ui/PluginCommands.ts`](https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts).

| Stage | File operation | Result |
|---|---|---|
| Stage | Fetch one GitHub release and write exact release assets to `.obsidian/plugins/<manifest.id>/`. | Plugin files exist on disk. |
| Register | Add the repository path to BRAT's `data.json` `pluginList` and upsert its release policy in `pluginSubListFrozenVersion`. | BRAT's next update sweep knows the repository. |
| Activate | Add the manifest `id` to `.obsidian/community-plugins.json`. | Obsidian is instructed to enable the plugin after reload. |

The BRAT policy file is `<vault>/.obsidian/plugins/obsidian42-brat/data.json`. Plugin activation is `<vault>/.obsidian/community-plugins.json`, an array of plugin IDs. A file-layer agent should edit these files while Obsidian is closed, retain backups of each file, and reopen or reload Obsidian only after every stage verifies successfully.

Before any recipe, confirm the vault root, the BRAT policy path, the target repository, the intended release tag, and whether activation is requested. Roll back by restoring the two JSON backups and removing only the newly staged target folder if verification fails.

---

## 2. INSTALL A MOVING BETA PLUGIN

### Goal

Install the latest GitHub release of a beta plugin, register it as a moving BRAT entry, and activate it in Obsidian.

### Stage the release assets

Use the GitHub `latest` release endpoint and select assets by exact filename. BRAT expects `main.js` and `manifest.json`; `styles.css` is optional. Do not substitute repository-root files, similarly named bundles, or an asset from a different release.

```sh
VAULT="/path/to/vault"
REPO="owner/repository"
BRAT_DATA="$VAULT/.obsidian/plugins/obsidian42-brat/data.json"
COMMUNITY="$VAULT/.obsidian/community-plugins.json"
STAGE_DIR="$(mktemp -d)"
RELEASE_JSON="$STAGE_DIR/release.json"

curl -fsSL "https://api.github.com/repos/$REPO/releases/latest" -o "$RELEASE_JSON"
TAG="$(jq -r '.tag_name // empty' "$RELEASE_JSON")"
test -n "$TAG"

for ASSET in main.js manifest.json; do
  URL="$(jq -r --arg name "$ASSET" '.assets[] | select(.name == $name) | .browser_download_url' "$RELEASE_JSON")"
  test -n "$URL"
  curl -fsSL "$URL" -o "$STAGE_DIR/$ASSET"
done

STYLES_URL="$(jq -r '.assets[] | select(.name == "styles.css") | .browser_download_url' "$RELEASE_JSON")"
if [ -n "$STYLES_URL" ]; then curl -fsSL "$STYLES_URL" -o "$STAGE_DIR/styles.css"; fi

PLUGIN_ID="$(jq -r '.id // empty' "$STAGE_DIR/manifest.json")"
PLUGIN_VERSION="$(jq -r '.version // empty' "$STAGE_DIR/manifest.json")"
MIN_APP_VERSION="$(jq -r '.minAppVersion // empty' "$STAGE_DIR/manifest.json")"
test -n "$PLUGIN_ID"
test -n "$PLUGIN_VERSION"
test "$PLUGIN_ID" != "null"
test "$PLUGIN_VERSION" != "null"
# Reject any id that is not a plain folder name — a manifest-supplied `../` or `/`
# would let a hostile release escape .obsidian/plugins/ and write anywhere in the vault.
printf '%s' "$PLUGIN_ID" | grep -qE '^[A-Za-z0-9._-]+$' || { echo "unsafe plugin id: $PLUGIN_ID" >&2; exit 1; }
mkdir -p "$VAULT/.obsidian/plugins/$PLUGIN_ID"
cp "$STAGE_DIR/main.js" "$VAULT/.obsidian/plugins/$PLUGIN_ID/main.js"
cp "$STAGE_DIR/manifest.json" "$VAULT/.obsidian/plugins/$PLUGIN_ID/manifest.json"
if [ -f "$STAGE_DIR/styles.css" ]; then cp "$STAGE_DIR/styles.css" "$VAULT/.obsidian/plugins/$PLUGIN_ID/styles.css"; fi
```

The `manifest.id` determines the target folder. The release tag determines the release selected; `manifest.version` and `minAppVersion` must be retained for the compatibility checks below. BRAT's asset and manifest handling is implemented in [`src/features/BetaPlugins.ts`](https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts).

### Register the moving policy

Preserve every unrelated setting and record. The following `jq` expressions assume `data.json` is already the BRAT file and use `latest` to keep this repository in the moving update set.

```sh
TMP_DATA="$(mktemp)"
jq --arg repo "$REPO" '
  .pluginList = ((.pluginList // []) + [$repo] | unique)
  | .pluginSubListFrozenVersion = (
      (.pluginSubListFrozenVersion // [])
      | if any(.[]; .repo == $repo)
        then map(if .repo == $repo then .version = "latest" else . end)
        else . + [{"repo": $repo, "version": "latest"}]
        end
    )
' "$BRAT_DATA" > "$TMP_DATA"
mv "$TMP_DATA" "$BRAT_DATA"
jq empty "$BRAT_DATA"
```

### Activate the manifest ID

Activation is separate from installation and registration. Add the manifest ID, not the repository path, to the community-plugin allow-list.

```sh
TMP_COMMUNITY="$(mktemp)"
jq --arg id "$PLUGIN_ID" 'if any(.[]; . == $id) then . else . + [$id] end' "$COMMUNITY" > "$TMP_COMMUNITY"
mv "$TMP_COMMUNITY" "$COMMUNITY"
jq empty "$COMMUNITY"
```

### Verify

```sh
test -s "$VAULT/.obsidian/plugins/$PLUGIN_ID/main.js"
test -s "$VAULT/.obsidian/plugins/$PLUGIN_ID/manifest.json"
jq -e --arg repo "$REPO" 'any(.pluginList[]; . == $repo)' "$BRAT_DATA" >/dev/null
jq -e --arg repo "$REPO" 'any(.pluginSubListFrozenVersion[]; .repo == $repo and (.version == "latest" or .version == ""))' "$BRAT_DATA" >/dev/null
jq -e --arg id "$PLUGIN_ID" 'any(.[]; . == $id)' "$COMMUNITY" >/dev/null
```

If the manifest is present but Obsidian does not show the plugin, reload Obsidian after the file-layer transaction. A reload does not replace registration: `data.json` and `community-plugins.json` still need the entries above.

---

## 3. INSTALL A FROZEN RELEASE TAG

### Goal

Install one exact GitHub release and retain it across BRAT update-all sweeps.

### Stage the exact tag

Replace the `latest` endpoint with the tag endpoint and require the API response to identify the requested tag. Then repeat the exact asset and manifest validation from the moving recipe.

```sh
VAULT="/path/to/vault"
REPO="owner/repository"
PINNED_TAG="v2.2.0"
STAGE_DIR="$(mktemp -d)"
RELEASE_JSON="$STAGE_DIR/release.json"

curl -fsSL "https://api.github.com/repos/$REPO/releases/tags/$PINNED_TAG" -o "$RELEASE_JSON"
test "$(jq -r '.tag_name // empty' "$RELEASE_JSON")" = "$PINNED_TAG"
```

Download `main.js`, `manifest.json`, and optional `styles.css` by exact names, verify the manifest's `id` and `version`, and write them to `.obsidian/plugins/<manifest.id>/` as in section 2. If the release is not published under the exact tag, stop; do not silently select the latest release.

### Register and activate

Upsert the matching policy record with the exact tag while preserving `tokenName` and unrelated fields:

```sh
TMP_DATA="$(mktemp)"
jq --arg repo "$REPO" --arg tag "$PINNED_TAG" '
  .pluginList = ((.pluginList // []) + [$repo] | unique)
  | .pluginSubListFrozenVersion = (
      (.pluginSubListFrozenVersion // [])
      | if any(.[]; .repo == $repo)
        then map(if .repo == $repo then .version = $tag else . end)
        else . + [{"repo": $repo, "version": $tag}]
        end
    )
' "$VAULT/.obsidian/plugins/obsidian42-brat/data.json" > "$TMP_DATA"
mv "$TMP_DATA" "$VAULT/.obsidian/plugins/obsidian42-brat/data.json"
jq empty "$VAULT/.obsidian/plugins/obsidian42-brat/data.json"
```

Activate the manifest ID in `.obsidian/community-plugins.json` only if the goal includes enabling it. Verify the policy record contains the exact tag and that the staged manifest version is the intended release. The frozen behavior is implemented by [`src/features/BetaPlugins.ts`](https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts).

---

## 4. UPDATE ALL AND HANDLE FROZEN SKIPS

### Goal

Reconcile moving entries with their current releases while leaving exact-tag entries unchanged.

For every `pluginList` repository, join its repository path with the matching policy record:

| Policy value | Update-all behavior |
|---|---|
| Missing record, empty version, or `latest` | Select the moving/latest release and replace the exact assets when the release is newer or the installed files are missing. |
| Truthy version other than `latest` | Treat the value as an exact tag and skip the entry during update-all. |
| Record without a matching `pluginList` entry | It is policy without membership; preserve it until an intentional cleanup removes it. |

A file-layer update-all recipe is:

1. Parse `data.json` and build the repository/policy map.
2. For each moving repository, fetch the latest release and require the exact asset names.
3. Compare the fetched manifest and release selection with the installed manifest before replacing files.
4. Stage the new assets in a temporary directory, then atomically replace the target files.
5. Leave frozen repositories untouched and report each skip with its exact configured tag.
6. Re-parse `data.json`, every changed manifest, and `community-plugins.json`; reload Obsidian when files changed.

Do not “unfreeze” a repository as part of update-all. To update a pinned plugin, run the frozen-install recipe with a new explicit tag, or change its policy record intentionally and record the new release before rerunning the moving flow. BRAT exposes both check-only and update commands through its [`PluginCommands`](https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts) surface; file-layer automation should keep checking, updating, reinstalling, and restarting as separate actions.

---

## 5. INSTALL A BETA THEME

### Goal

Install a BRAT-managed theme without treating it as a plugin.

Fetch the theme release or repository assets according to BRAT's theme flow. The theme path uses a root `theme-beta.css` when present, otherwise `theme.css`, plus the root `manifest.json`. Validate the manifest's `name`, write the files to `.obsidian/themes/<manifest.name>/`, and compute the CSS checksum that becomes `lastUpdate`.

```sh
VAULT="/path/to/vault"
REPO="owner/theme-repository"
THEME_DIR="$(mktemp -d)"
THEMES_DATA="$VAULT/.obsidian/plugins/obsidian42-brat/data.json"

curl -fsSL "https://api.github.com/repos/$REPO/releases/latest" -o "$THEME_DIR/release.json"
```

Stage the exact theme CSS and root manifest, then perform the file operations:

```sh
THEME_NAME="$(jq -r '.name // empty' "$THEME_DIR/manifest.json")"
test -n "$THEME_NAME"
mkdir -p "$VAULT/.obsidian/themes/$THEME_NAME"
if [ -f "$THEME_DIR/theme-beta.css" ]; then cp "$THEME_DIR/theme-beta.css" "$VAULT/.obsidian/themes/$THEME_NAME/theme.css"; else cp "$THEME_DIR/theme.css" "$VAULT/.obsidian/themes/$THEME_NAME/theme.css"; fi
cp "$THEME_DIR/manifest.json" "$VAULT/.obsidian/themes/$THEME_NAME/manifest.json"
CSS_HASH="$(shasum -a 256 "$VAULT/.obsidian/themes/$THEME_NAME/theme.css" | awk '{print $1}')"
```

Upsert `{repo: REPO, lastUpdate: CSS_HASH}` in `themesList`. Do not add the theme to `pluginList` or `.obsidian/community-plugins.json`; themes use their own path and update record. BRAT's theme handling is in [`src/features/themes.ts`](https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/themes.ts).

Verify both theme files exist, the CSS hash is recorded, `themesList` parses, and the theme appears under the manifest name. If the CSS file is written to a plugin directory or the theme manifest is given a plugin ID, the path contract is wrong; use section 6.

---

## 6. REMOVE REGISTRATION WITHOUT UNINSTALLING FILES

### Goal

Stop BRAT from tracking an entry while leaving staged files available for inspection or a later manual cleanup.

For a plugin, remove the exact repository string from `pluginList` and remove matching records from `pluginSubListFrozenVersion`. Leave `.obsidian/plugins/<manifest.id>/` and the activation entry unchanged unless disabling or uninstalling is also part of the request.

```sh
REPO="owner/repository"
BRAT_DATA="/path/to/vault/.obsidian/plugins/obsidian42-brat/data.json"
TMP_DATA="$(mktemp)"
jq --arg repo "$REPO" '
  .pluginList = [(.pluginList // [])[] | select(. != $repo)]
  | .pluginSubListFrozenVersion = [(.pluginSubListFrozenVersion // [])[] | select(.repo != $repo)]
' "$BRAT_DATA" > "$TMP_DATA"
mv "$TMP_DATA" "$BRAT_DATA"
jq empty "$BRAT_DATA"
```

For a theme, remove the matching object from `themesList` and leave `.obsidian/themes/<manifest.name>/` unchanged. This is registration removal, not uninstall. Deleting plugin or theme files is a separate destructive operation and requires an explicit target plus a backup.

---

## 7. INSTALL THE TWO SIBLING MODE PLUGINS THROUGH BRAT

BRAT is the installer for the other two community plugins represented in this mode. Apply the same release-asset flow to each repository, then register the repository and activate the manifest ID separately.

| Plugin | BRAT repository path | Manifest ID | Stage target |
|---|---|---|---|
| Beancount Finance | `mkshp-dev/obsidian-finance-plugin` | `beancount-finance` | `.obsidian/plugins/beancount-finance/` |
| Obsidian Tables | `aztekgold/obsidian-tables` | `tables` | `.obsidian/plugins/tables/` |

### Beancount Finance

Set `REPO=mkshp-dev/obsidian-finance-plugin`, select either `/releases/latest` or an exact `/releases/tags/<tag>` endpoint, and require `main.js`, `manifest.json`, and optional `styles.css`. Verify `manifest.id` is `beancount-finance`, stage the assets under `.obsidian/plugins/beancount-finance/`, upsert the repository in BRAT's two policy collections, and add `beancount-finance` to `.obsidian/community-plugins.json` when activation is requested. The mode-specific data contract is in [`beancount-finance/data-model.md`](../beancount-finance/data-model.md).

### Obsidian Tables

Set `REPO=aztekgold/obsidian-tables`, use the same release endpoint and exact asset checks, and verify `manifest.id` is `tables`. Stage under `.obsidian/plugins/tables/`, register the repository in BRAT's `pluginList` and policy list, and add `tables` to `.obsidian/community-plugins.json` when activation is requested. The sibling workflow reference is [`obsidian-tables/workflows.md`](../obsidian-tables/workflows.md).

### Combined verification

```sh
BRAT_DATA="/path/to/vault/.obsidian/plugins/obsidian42-brat/data.json"
COMMUNITY="/path/to/vault/.obsidian/community-plugins.json"
jq -e 'any(.pluginList[]; . == "mkshp-dev/obsidian-finance-plugin")' "$BRAT_DATA" >/dev/null
jq -e 'any(.pluginList[]; . == "aztekgold/obsidian-tables")' "$BRAT_DATA" >/dev/null
jq -e 'any(.[]; . == "beancount-finance") and any(.[]; . == "tables")' "$COMMUNITY" >/dev/null
test -s "/path/to/vault/.obsidian/plugins/beancount-finance/main.js"
test -s "/path/to/vault/.obsidian/plugins/tables/main.js"
```

This recipe is the file-layer bridge between BRAT's release installer and the two sibling plugin references. It does not modify their plugin files or their own references.

---

## 8. SOURCES AND RELATED RESOURCES

- [`TfTHacker/obsidian42-brat`](https://github.com/TfTHacker/obsidian42-brat)
- [`src/settings.ts`](https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts)
- [`src/features/BetaPlugins.ts`](https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts)
- [`src/features/themes.ts`](https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/themes.ts)
- [`BRAT data model`](data-model.md)
- [`BRAT troubleshooting`](troubleshooting.md)
- [`brat-data-entry.example.json`](../../../assets/brat-data-entry.example.json)
