---
title: BRAT data.json Data Model
description: "Complete file-layer contract for BRAT data.json, including defaults, repository policy records, theme records, SecretStorage token names, and release-pin semantics."
trigger_phrases:
  - "brat data json schema"
  - "brat plugin list settings"
  - "brat frozen version record"
  - "brat secret storage token"
  - "brat themes list checksum"
importance_tier: "normal"
contextType: "implementation"
version: 0.1.0.0
---

# BRAT data.json Data Model

BRAT (Beta Reviewers Auto-update Tool) persists its beta-plugin policy in the BRAT plugin directory. This reference describes the complete persisted shape used by the v2.2.0+ settings source and beta-plugin feature code.

---

## 1. OVERVIEW

BRAT's persisted file is `<vault>/.obsidian/plugins/obsidian42-brat/data.json`. The plugin loads that file over `DEFAULT_SETTINGS`; omitted keys therefore take the documented defaults. The implementation sources are [`src/settings.ts`](https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts) and [`src/features/BetaPlugins.ts`](https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts) in [`TfTHacker/obsidian42-brat`](https://github.com/TfTHacker/obsidian42-brat).

BRAT has two different kinds of persisted policy. `pluginList` is the membership list of GitHub repository paths. `pluginSubListFrozenVersion` is the optional per-repository release policy list; a truthy version other than `latest` is a frozen exact tag and is skipped by update sweeps.

---

## 2. TOP-LEVEL SETTINGS SCHEMA

The table is the complete top-level key set. Defaults apply when a key is omitted from persisted JSON.

| Key | Type | Default | Meaning and file-layer rule |
|---|---|---:|---|
| `schemaVersion` | integer | `1` | Serialized data-contract version. Preserve it when updating the file; it is not the GitHub release tag of BRAT or a managed plugin. |
| `pluginList` | string array | `[]` | GitHub repository paths registered as beta plugins, for example `TfTHacker/obsidian42-brat`. Keep each entry as the normalized `owner/repository` path. |
| `pluginSubListFrozenVersion` | object array | `[]` | Per-plugin release policy records. A record with a truthy `version` other than `latest` pins that repository to the exact release tag. |
| `themesList` | object array | `[]` | Theme repository records. Each record contains `repo` and the CSS checksum in `lastUpdate`. |
| `updateAtStartup` | boolean | `true` | Whether BRAT checks registered beta plugins during startup. |
| `updateThemesAtStartup` | boolean | `true` | Whether BRAT checks registered beta themes during startup. |
| `enableAfterInstall` | boolean | `true` | Whether a newly installed plugin is enabled after BRAT writes its files. File-layer automation must still update `community-plugins.json` explicitly when activation is required. |
| `loggingEnabled` | boolean | `false` | Enables BRAT logging. |
| `loggingPath` | string | `BRAT-log` | BRAT's logging path or filename setting. Preserve the configured value rather than inventing a new path. |
| `loggingVerboseEnabled` | boolean | `false` | Enables verbose BRAT logging. |
| `debuggingMode` | boolean | `false` | Enables BRAT debugging behavior. |
| `notificationsEnabled` | boolean | `true` | Enables BRAT notifications. |
| `globalTokenName` | string | `""` | Name of the GitHub token stored in Obsidian SecretStorage for global use. This is a secret name, not the token value. |
| `personalAccessToken` | string | `""` | Legacy compatibility field. In v2.0+, do not put a GitHub token value in `data.json`; use SecretStorage instead. |
| `selectLatestPluginVersionByDefault` | boolean | `false` | Controls the default release-selection choice in BRAT's add-plugin flow. |
| `allowIncompatiblePlugins` | boolean | `false` | Allows installation when BRAT's compatibility checks identify an incompatibility. |

The settings and defaults are defined by [`src/settings.ts`](https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts); repository selection, release fetching, installation, and frozen-policy handling are implemented in [`src/features/BetaPlugins.ts`](https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts).

---

## 3. REPOSITORY AND THEME RECORDS

### `pluginList`

`pluginList` is a string array, not an array of release objects. Each string identifies a GitHub repository using the `owner/repository` path. The repository path is the stable membership key used to find the beta plugin in BRAT's update policy.

### `pluginSubListFrozenVersion`

Records in `pluginSubListFrozenVersion` use the following persisted fields:

| Field | Type | Required | Meaning |
|---|---|---:|---|
| `repo` | string | yes | GitHub repository path, matching an entry in `pluginList`. |
| `version` | string | yes | `latest`, empty, or omitted means moving-release behavior. Any other truthy value is treated as an exact GitHub release tag and is skipped by update-all sweeps. |
| `tokenName` | string | no | SecretStorage name for a repository-specific GitHub token. It is a name only; the token value is not persisted in `data.json` in v2.0+. |
| `token` | string | no | Legacy field that may be encountered in older data. Do not write a v2.0+ token value here. |
| `isIncompatible` | boolean | no | Compatibility state recorded by BRAT when a plugin does not satisfy the current Obsidian/app gates. |

The release selector uses the exact `version` tag for a frozen record. A frozen record can remain in `pluginList` so the plugin is installed and registered while update sweeps deliberately skip it.

### GitHub token separation in v2.0+

BRAT v2.0+ keeps GitHub token values in Obsidian SecretStorage. `globalTokenName` and a record's `tokenName` identify SecretStorage entries; they are not credentials. The migration/source logic uses deterministic names, including the global `brat-gh-global` entry and repository-derived names, and accepts GitHub tokens with `ghp_` or `github_pat_` prefixes. A headless authoring workflow may require an existing SecretStorage entry for a private repository, but it must never place that secret in this JSON file. See [`src/settings.ts`](https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts) and [`src/features/BetaPlugins.ts`](https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts).

### `themesList`

Each theme record has this shape:

```json
{
  "repo": "owner/theme-repository",
  "lastUpdate": "css-content-checksum"
}
```

`repo` identifies the GitHub theme repository. `lastUpdate` is BRAT's remembered checksum for the installed theme CSS, allowing a later theme check to detect a changed file. Themes are not plugin records: they are written below `.obsidian/themes/<manifest.name>/` and are not activated through `.obsidian/community-plugins.json`.

---

## 4. ANNOTATED JSON SKELETON

The following is valid JSON. The moving plugin and frozen plugin demonstrate that membership and release policy are separate records; the values are illustrative and contain no credentials.

```json
{
  "schemaVersion": 1,
  "pluginList": [
    "owner/moving-plugin",
    "owner/frozen-plugin"
  ],
  "pluginSubListFrozenVersion": [
    {
      "repo": "owner/moving-plugin",
      "version": "latest"
    },
    {
      "repo": "owner/frozen-plugin",
      "version": "v2.2.0",
      "tokenName": "brat-gh-owner-frozen-plugin"
    }
  ],
  "themesList": [
    {
      "repo": "owner/theme-repository",
      "lastUpdate": "css-content-checksum"
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

For a populated example using the two sibling mode plugins, see [`../../../assets/plugins/obsidian42-brat/brat-data-entry.example.json`](../../../assets/plugins/obsidian42-brat/brat-data-entry.example.json).

---

## 5. FILE-LAYER MERGE INVARIANTS

When editing BRAT state without running Obsidian:

1. Read and parse the existing `data.json`; do not replace a user file with the skeleton above.
2. Merge missing top-level keys from the defaults in this document while preserving unknown keys for forward compatibility.
3. Add or remove the exact repository string in `pluginList` without changing unrelated entries.
4. Upsert the matching `{repo, version}` policy record in `pluginSubListFrozenVersion`; use `latest` for a moving policy and the exact release tag for a pin.
5. Preserve `tokenName` values, but never copy or synthesize token values. SecretStorage is a separate boundary.
6. Re-serialize valid JSON, re-parse it, and verify the three BRAT collections before touching plugin files.

The file is only BRAT's registration and update policy. It does not stage plugin assets and it does not activate a plugin; those are separate file-layer stages described in [`workflows.md`](workflows.md).

---

## 6. SOURCES AND RELATED RESOURCES

- [`TfTHacker/obsidian42-brat`](https://github.com/TfTHacker/obsidian42-brat)
- [`src/settings.ts`](https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts)
- [`src/features/BetaPlugins.ts`](https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts)
- [`BRAT workflows`](workflows.md)
- [`BRAT troubleshooting`](troubleshooting.md)
- [`brat-data-entry.example.json`](../../../assets/plugins/obsidian42-brat/brat-data-entry.example.json)
