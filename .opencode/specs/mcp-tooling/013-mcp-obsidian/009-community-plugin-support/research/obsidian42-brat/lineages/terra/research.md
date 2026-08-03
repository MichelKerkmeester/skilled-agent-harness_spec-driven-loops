# Obsidian42-BRAT File-Layer Research Knowledge Base

## 1. Executive Summary

BRAT v2.2.0+ stores its settings at .obsidian/plugins/obsidian42-brat/data.json. The effective settings are the source defaults overlaid with stored data, so a file-layer writer must preserve existing and unknown fields rather than replace the file wholesale.

BRAT has two plugin registries. pluginList is the ordered repository list. pluginSubListFrozenVersion is the repository policy list: it holds both moving installs with version "latest" and frozen installs with an exact GitHub release tag. It is not pin-only.

The current plugin installer is GitHub-release based. It requires release assets named main.js and manifest.json, accepts styles.css as optional, writes the files to a folder named by manifest.id, registers the repository, and can enable it through Obsidian. A file-only AI can reproduce the disk state but still needs Obsidian to reload before runtime visibility is proven.

Repository source is authoritative. BRAT and Obsidian documentation corroborate user-facing behavior.

## 2. Scope and Evidence Standard

Target: TfTHacker/obsidian42-brat, id obsidian42-brat, v2.2.0+.

- Source establishes persistent fields, defaults, command routing, asset handling, and local writes.
- BRAT documentation establishes current user terminology and cache guidance.
- Obsidian documentation establishes plugin layout and manifest-reload behavior.
- .obsidian is only the usual vault configuration directory. Source uses the vault configuration directory, so use the actual configured directory when it differs.

Primary sources:

- [SOURCE: settings.ts](https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts)
- [SOURCE: main.ts](https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/main.ts)
- [SOURCE: BetaPlugins.ts](https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/BetaPlugins.ts)
- [SOURCE: githubUtils.ts](https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/githubUtils.ts)
- [SOURCE: themes.ts](https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/themes.ts)
- [SOURCE: PluginCommands.ts](https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts)

## 3. Exact data.json Data Model

main.ts loads stored data and applies it over DEFAULT_SETTINGS. A real data.json can therefore omit default-valued keys. The object below is the complete effective schema, not a claim that every vault serializes every default.

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
      "personalAccessToken": "",
      "globalTokenName": "",
      "selectLatestPluginVersionByDefault": false,
      "allowIncompatiblePlugins": false
    }

| Key | Type | Default | Meaning |
|---|---|---|---|
| pluginList | string[] | [] | Registered owner/repository strings. |
| pluginSubListFrozenVersion | PluginVersion[] | [] | Per-repository moving or frozen policy. |
| themesList | ThemeInforamtion[] | [] | Registered beta themes. Source spells the type ThemeInforamtion. |
| updateAtStartup | boolean | true | Schedules plugin update checking after layout readiness. |
| updateThemesAtStartup | boolean | true | Schedules theme update checking after layout readiness. |
| enableAfterInstall | boolean | true | Enables a successfully installed plugin through Obsidian. |
| loggingEnabled | boolean | false | Enables logging. |
| loggingPath | string | BRAT-log | Log path/name setting. |
| loggingVerboseEnabled | boolean | false | Enables verbose logging. |
| debuggingMode | boolean | false | Enables debug behavior. |
| notificationsEnabled | boolean | true | Enables notifications. |
| personalAccessToken | deprecated string | empty string | Legacy setting. Do not store a token here. |
| globalTokenName | optional string | empty string | Name of an Obsidian SecretStorage entry. |
| selectLatestPluginVersionByDefault | boolean | false | UI version-selection default. |
| allowIncompatiblePlugins | boolean | false | Enables an explicit incompatible frozen-version override flow. |

PluginVersion shape:

    {
      "repo": "owner/repository",
      "version": "latest or exact GitHub release tag",
      "tokenName": "optional SecretStorage key name",
      "isIncompatible": "optional boolean",
      "token": "deprecated optional token field"
    }

ThemeInforamtion shape:

    {
      "repo": "owner/repository",
      "lastUpdate": "source-calculated CSS checksum string"
    }

Current themes.ts calculates lastUpdate as a character-code sum of CSS text, converted to a string. It is a change detector, not a cryptographic digest.

Sources: [SOURCE: settings.ts](https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts), [SOURCE: main.ts](https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/main.ts), [SOURCE: themes.ts](https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/themes.ts).

## 4. Registration Invariants

- Use one exact repository string in both pluginList and its matching PluginVersion record.
- Moving installs use version "latest".
- Frozen installs use the exact GitHub release tag. Do not substitute a normalized manifest version.
- BRAT looks up entries with exact repository-string equality. Do not silently rewrite capitalization or owner/repository spelling.
- BRAT adds new repositories to the front of pluginList and updates or creates the matching policy entry.
- tokenName only refers to a SecretStorage key. It is not the secret.
- isIncompatible belongs only to a deliberately approved compatibility override.

Sources: [SOURCE: settings.ts](https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts), [SOURCE: BetaPlugins.ts](https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/BetaPlugins.ts), [SOURCE: githubUtils.ts](https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/githubUtils.ts).

## 5. Command Surface

Current source presents one add command that supports adding with or without a selected version. Older documentation can describe frozen-version selection separately; the source behavior is the contract.

| Requested operation | Current BRAT behavior | File-layer equivalent |
|---|---|---|
| Add beta plugin | Plugins: Add a beta plugin for testing (with or without version). | Install release assets and record version "latest". |
| Add frozen release-tag pin | Same add flow with a selected version. | Install that exact release and record its exact tag. |
| Check for updates | Plugins: Check for updates to all beta plugins. | Fetch and compare only; make no writes. |
| Check and update all | Plugins: Check for updates to all beta plugins and UPDATE. | Update records with version "latest"; skip pins. |
| Update single | Plugins: Choose a single plugin version to update. Source filters the chooser to non-latest records. | Choose a new tag, replace assets, and update that policy record. |
| Restart | Plugins: Restart a plugin that is already installed. | Cause an Obsidian reload/disable-enable after disk state is valid. |
| Add theme | Themes: Grab a beta theme for testing from a Github repository. | Fetch root beta CSS or fallback CSS plus root manifest, then register. |
| Remove theme | Settings calls themeDelete; no standalone palette command is defined in the current command file. | Remove the themesList record only. Keep files unless separately authorized. |

Sources: [SOURCE: PluginCommands.ts](https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts), [SOURCE: BetaPlugins.ts](https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/BetaPlugins.ts), [SOURCE: themes.ts](https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/themes.ts), [SOURCE: BRAT user guide](https://tfthacker.com/brat-plugins).

## 6. Plugin Release Resolution and Package Contract

BRAT's normal plugin route is release based:

1. A frozen version requests that exact GitHub release tag.
2. Latest reads releases, sorts semantic-version-compatible choices when possible, and applies prerelease behavior according to the invoking path.
3. BRAT looks for assets by exact name: main.js, manifest.json, and optionally styles.css.
4. manifest.json must provide id and version. Source reconciles a comparable semantic mismatch between tag and manifest version.
5. main.js is mandatory; styles.css is optional.
6. minAppVersion is checked. BRAT's incompatible-plugin route is explicit and interactive, so a file-layer AI should fail closed rather than bypass it.

Do not substitute repository-root plugin files. Root theme artifacts are a separate path. Current plugin installation source expects release assets; historical root manifest-beta documentation does not supersede that source behavior.

Sources: [SOURCE: BetaPlugins.ts](https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/BetaPlugins.ts), [SOURCE: githubUtils.ts](https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/githubUtils.ts), [SOURCE: BRAT developer guide](https://tfthacker.com/brat-developers).

## 7. Plugin Installation and Enablement Mechanics

BRAT writes:

    <vault-config-dir>/plugins/<manifest.id>/
      main.js
      manifest.json
      styles.css                  optional

The target folder is manifest.id, not the repository name. BRAT writes styles.css only when it received an asset. An absent newer styles.css therefore does not remove an older local stylesheet.

After a successful add, BRAT registers the repository in its data file. If enableAfterInstall is true, it asks Obsidian's internal plugin manager to load the manifest and enable/save the plugin.

The file-layer enablement equivalent is the JSON array at:

    <vault-config-dir>/community-plugins.json

Add manifest.id exactly once while preserving all other entries and valid JSON. This is an equivalence to BRAT's enable-and-save call, not proof that an already running app loaded the files. Reload or restart Obsidian after manifest or enabled-list changes; Obsidian's own documentation requires a restart after manifest changes.

Sources: [SOURCE: BetaPlugins.ts](https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/BetaPlugins.ts), [SOURCE: Obsidian plugin layout guide](https://docs.obsidian.md/Plugins/Getting%20started/Build%20a%20plugin).

## 8. Theme Installation, Update, and Removal

Themes use a distinct root-file path:

1. Fetch root theme-beta.css.
2. If absent, fetch root theme.css.
3. Fetch root manifest.json.
4. Write theme.css and manifest.json to:

       <vault-config-dir>/themes/<manifest.name>/

5. Store the repo plus CSS checksum in themesList.

Updates compare CSS/checksum state. themeDelete removes the tracking record and saves settings, but source leaves installed theme files on disk. Deleting that directory is a separate destructive operation.

Sources: [SOURCE: themes.ts](https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/themes.ts), [SOURCE: githubUtils.ts](https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/githubUtils.ts), [SOURCE: BRAT themes guide](https://tfthacker.com/brat-themes).

## 9. AI Workflow: Headless Moving Beta Install

1. Confirm the vault configuration directory.
2. Snapshot data.json, community-plugins.json, and the target plugin directory, or use recoverable atomic replacement.
3. Resolve an eligible GitHub release. Do not fetch root build files as a substitute.
4. Retrieve exact-named manifest.json and main.js assets; retrieve styles.css only when present.
5. Validate JSON, manifest.id, manifest.version, release/tag relationship, and minAppVersion. Stop on a failure.
6. Stage the files, then populate <config-dir>/plugins/<manifest.id>. Staging is a recommended AI safeguard; BRAT itself writes directly.
7. Read-modify-write data.json, preserving unrelated fields:

       add repo to pluginList if absent
       add or replace:
       { "repo": "owner/repository", "version": "latest" }

8. If enableAfterInstall is effectively true, add manifest.id to community-plugins.json exactly once.
9. Reload Obsidian, then verify directory, manifest, enabled-list entry, and plugin-manager visibility.

File-layer state cannot prove that an already running Obsidian instance accepted it. The reload check is required.

## 10. AI Workflow: Frozen Release-Tag Pin

1. Obtain the exact tag from GitHub Releases, including any prerelease suffix.
2. Fetch that tag through the release-by-tag route and validate the same package contract.
3. Install under manifest.id.
4. Preserve or add the repository in pluginList.
5. Store:

       {
         "repo": "owner/repository",
         "version": "exact-GitHub-release-tag"
       }

6. Retain tokenName only when it is needed and already provisioned in SecretStorage.
7. Enable through community-plugins.json if requested, reload Obsidian, and verify the runtime version.

BRAT skips automatic updates for non-latest records. To move a pin, choose a new exact tag, replace the package, and update only that version field.

## 11. Error and Edge-Case Catalog

| Condition | Cause | Safe handling |
|---|---|---|
| No GitHub releases | Current plugin route requires a release. | Fail closed; do not substitute root files. |
| Asset naming mismatch | BRAT matches main.js, manifest.json, and styles.css by exact name. | Stop and report the missing/misnamed asset. |
| Missing main.js | It is mandatory. | Do not create an enabled record. |
| Missing manifest, id, or version | BRAT cannot establish identity/version. | Stop and retain the prior installation. |
| Tag and manifest version mismatch | Release metadata can disagree. | Apply source-compatible semantic reconciliation only when comparable; otherwise flag it. |
| minAppVersion mismatch | Target app is too old. | Fail closed. Do not automate BRAT's interactive override. |
| Frozen entry does not update | Non-latest records are intentionally skipped. | Use an explicit new-tag update. |
| Plugin invisible after reload | Wrong folder, malformed manifest, missing enabled id, or unreloaded manifests. | Verify folder equals manifest.id, manifest validity, community list, and actual app restart. |
| Stale styles.css survives | BRAT does not delete styles.css when a later release omits it. | Preserve for BRAT fidelity or remove only under approved cleanup scope. |
| Private repository fails | A file-only actor lacks the required SecretStorage secret. | Require an existing tokenName and read-only GitHub authorization, otherwise stop. |
| API/rate-limit failure | Private-status/API calls may fail. | Treat as unknown access state and back off; do not assume public access. |
| Fresh release/theme looks stale | GitHub caching can lag. | Wait and validate again; BRAT guide cites roughly 5–15 minutes. |
| Duplicate/mismatched repo string | BRAT uses exact string equality. | Canonicalize before first entry and preserve the stored key later. |
| Invalid edited JSON | Partial writes can make BRAT/Obsidian unable to load. | Parse-validate-write with backup and atomic replacement. |
| Theme removal leaves files | That is source behavior. | Do not call it uninstall unless deletion was separately authorized and performed. |

Sources: [SOURCE: BetaPlugins.ts](https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/BetaPlugins.ts), [SOURCE: githubUtils.ts](https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/githubUtils.ts), [SOURCE: themes.ts](https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/themes.ts), [SOURCE: BRAT user guide](https://tfthacker.com/brat-plugins).

## Eliminated Alternatives

| Approach | Why eliminated | Evidence | Iteration |
|---|---|---|---|
| Treat pluginSubListFrozenVersion as pin-only | Moving installs receive version "latest". | settings.ts | 1 |
| Put a PAT in data.json | Current source uses tokenName plus SecretStorage; token is deprecated. | settings.ts and BetaPlugins.ts | 1 and 3 |
| Fetch plugin artifacts from repository root | Current plugin source resolves GitHub release assets. | BetaPlugins.ts and githubUtils.ts | 2 |
| Force incompatible minAppVersion unattended | BRAT requires deliberate interactive consent. | BetaPlugins.ts | 2 |
| Treat theme unregistration as deletion | themeDelete leaves files. | themes.ts | 3 |
| Stop before run 3 due to convergence | Stop policy is max-iterations. | local workflow config/state | 1 through 3 |

## Divergence Map

No research fork was required. The mandated iterations covered distinct angles:

1. Schema and command surface.
2. Release/package/install mechanics and file-layer equivalence.
3. Themes, private access, and operational failures.

The source/documentation discrepancy about theme update metadata was resolved in favor of current source: themes.ts calculates a CSS checksum, while older guide wording refers to commit dates.

## 12. Open Questions

None block a safe file-layer implementation.

Two runtime-dependent limits remain:

- A vault can use a custom configuration directory rather than .obsidian.
- A file-only actor cannot prove a live Obsidian process accepted edits; reload and visible-plugin confirmation remain a runtime check.

## 13. Private Repositories and Credential Boundary

Private access is not data.json-only automation. BRAT resolves a per-plugin or global token name, then reads the secret from Obsidian SecretStorage. Do not use the legacy token or personalAccessToken fields as a current credential path.

- Never place a GitHub token in data.json, logs, or research artifacts.
- Require a separately provisioned least-privilege read-only secret and use only its tokenName reference.
- If the secret is absent or authorization fails, stop before changing package or enabled-list state.
- Treat API failure as unknown access status, not permission to fall back.

Sources: [SOURCE: BetaPlugins.ts](https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/BetaPlugins.ts), [SOURCE: githubUtils.ts](https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/githubUtils.ts), [SOURCE: BRAT private repositories guide](https://tfthacker.com/brat-private-repo).

## 14. Operational Safety and Rollback

Before changing a vault, snapshot data.json, community-plugins.json, and the target plugin folder; validate assets before mutation; parse JSON after each edit; and reload only after package and registration state agree.

Rollback restores those snapshots and reloads Obsidian. Theme deletion is not part of plugin rollback.

## 15. AI Usage Recipes

### Register a preinstalled beta plugin as moving

Validate the existing package first, then add its repository to pluginList, add a matching version "latest" record, add manifest.id to community-plugins.json if enablement is intended, and reload.

### Install a public beta plugin

Use the moving-install workflow. Reject repositories without a compatible release package. Register only after package validation and local installation succeed.

### Pin a reproducible beta release

Use the frozen workflow. Store the exact GitHub tag, never a display label or manifest-version guess. Verify that update-all skips the record.

### Diagnose installed but invisible

Check directory equals manifest.id, valid/compatible manifest, main.js, enabled-list membership, and actual manifest reload. BRAT registration alone is not sufficient for runtime discovery.

### Update eligible beta plugins

Filter for version "latest", validate each newest release before replacement, skip frozen entries, preserve styles.css behavior intentionally, then reload once after the batch.

### Add or remove a beta theme

Add with root theme-beta.css then theme.css fallback plus root manifest. Remove only the themesList record unless a separate destructive cleanup is approved.

## 16. Validation Checklist

- [ ] Vault configuration directory confirmed.
- [ ] Release has exact-named manifest.json and main.js assets.
- [ ] manifest.id, manifest.version, tag, and minAppVersion validated.
- [ ] Plugin directory named from manifest.id.
- [ ] BRAT settings preserve unrelated fields and have one matching policy record.
- [ ] Moving uses version "latest"; frozen uses exact tag.
- [ ] Private access refers to SecretStorage, never plaintext settings.
- [ ] community-plugins.json is valid JSON and contains manifest.id no more than once when enabled.
- [ ] Obsidian reload/restart and runtime visibility check completed.
- [ ] Theme removal is not reported as file deletion unless separately performed.

## 17. References and Convergence Report

Repository source:

- [SOURCE: settings.ts](https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts)
- [SOURCE: main.ts](https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/main.ts)
- [SOURCE: BetaPlugins.ts](https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/BetaPlugins.ts)
- [SOURCE: githubUtils.ts](https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/githubUtils.ts)
- [SOURCE: themes.ts](https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/themes.ts)
- [SOURCE: PluginCommands.ts](https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts)
- [SOURCE: manifest.json](https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/manifest.json)

Corroborating documentation:

- [SOURCE: BRAT user guide](https://tfthacker.com/brat-plugins)
- [SOURCE: BRAT developer guide](https://tfthacker.com/brat-developers)
- [SOURCE: BRAT themes guide](https://tfthacker.com/brat-themes)
- [SOURCE: BRAT private repositories guide](https://tfthacker.com/brat-private-repo)
- [SOURCE: Obsidian plugin layout guide](https://docs.obsidian.md/Plugins/Getting%20started/Build%20a%20plugin)

All three required iterations ran. Novelty ratios were 1.00, 0.90, and 0.85, averaging 0.9167. The configured max-iterations policy, rather than convergence, ended the loop after run 3. All five research questions are resolved.
