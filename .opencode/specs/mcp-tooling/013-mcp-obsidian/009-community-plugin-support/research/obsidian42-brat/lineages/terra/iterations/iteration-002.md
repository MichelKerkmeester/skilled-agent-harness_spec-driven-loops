# Iteration 2: Plugin release mechanics and file-layer installation

## Focus

Trace the live code path from a BRAT repository string to GitHub release selection, files under `.obsidian/plugins/`, BRAT registration, and enablement.

## Findings

1. Current BRAT treats GitHub releases as the primary plugin package source. For a pin, `grabReleaseFromRepository()` requests `releases/tags/<specified value>`; the value must therefore be the exact GitHub release tag. For a moving install it lists releases, sorts using coerced semantic versions (falling back to `published_at` if comparison fails), and considers pre-releases in the beta-first path. BRAT documentation independently describes a frozen install as downloading that exact release and a normal install as selecting the highest semver release/pre-release. [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/githubUtils.ts] [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/BetaPlugins.ts] [SOURCE: https://tfthacker.com/brat-developers]

2. The current plugin path reads release *assets* by exact filename: `manifest.json`, `main.js`, and `styles.css`. A release without `manifest.json` fails validation; a release without `main.js` is explicitly rejected as incomplete. `styles.css` is optional and written only when present. This is release-based, not a root-branch artifact fetch; the developer guide says root `manifest-beta.json` is legacy compatibility, not the primary v1.1+ workflow. [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/BetaPlugins.ts] [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/githubUtils.ts] [SOURCE: https://tfthacker.com/brat-developers]

3. BRAT requires `id` and `version` in the selected release manifest. When release-tag and manifest versions differ but can be semver-coerced, BRAT warns and overwrites the in-memory manifest version with the coerced release-tag version before writing. It rejects an incompatible `minAppVersion` by default; a frozen/explicit-version install can only proceed through BRAT's interactive override when `allowIncompatiblePlugins` is enabled. The override rewrites the installed manifest's `minAppVersion` and records BRAT compatibility metadata, so a file-layer AI should not perform it automatically. [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/BetaPlugins.ts]

4. The destination is `${vault.configDir}/plugins/<manifest.id>/`, which is `.obsidian/plugins/<manifest.id>/` in a normal vault. BRAT creates that directory, writes `main.js` and `manifest.json`, and writes `styles.css` only if supplied. On an enabled install it calls the Obsidian plugin manager to load the manifest and enable-and-save the plugin. Obsidian's own developer documentation also requires the folder name to match `manifest.id`, and says a manifest change requires an app restart. [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/BetaPlugins.ts] [SOURCE: https://docs.obsidian.md/Plugins/Getting%20started/Build%20a%20plugin]

5. BRAT writes registration only after successful release-file installation: it adds the repository string to `pluginList` and adds/updates the corresponding `{repo, version, tokenName?, isIncompatible?}` item. The file-layer equivalent of BRAT's `enablePluginAndSave()` is to preserve `.obsidian/community-plugins.json` as a JSON array and add the *manifest id* (not the GitHub repo) when `enableAfterInstall` is true. That equivalence is an inference from BRAT's plugin-manager calls and the documented installed-plugin enablement flow; it is not a BRAT source line that directly edits the JSON file. [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/BetaPlugins.ts] [SOURCE: https://docs.obsidian.md/Plugins/Getting%20started/Build%20a%20plugin]

6. A safe file-layer recipe is: (a) operate with Obsidian closed or otherwise serialize writes; (b) resolve the requested release tag exactly for a pin, otherwise select the same latest policy; (c) verify assets and parse manifest before touching the vault; (d) reject missing `id`, `version`, `main.js`, and incompatible `minAppVersion`; (e) write assets atomically to `.obsidian/plugins/<manifest.id>/`; (f) merge the two BRAT lists in `data.json` without deleting unrelated settings; (g) conditionally add `<manifest.id>` to `community-plugins.json`; and (h) restart/reload and verify the manifest is discovered. A repo string must be normalized to one canonical `OWNER/repo` spelling because the source de-duplicates `pluginList` by exact string comparison. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts] [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/BetaPlugins.ts]

## Sources Consulted

- BRAT plugin install/update source: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/BetaPlugins.ts
- BRAT GitHub/release helper source: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/githubUtils.ts
- BRAT developer guide: https://tfthacker.com/brat-developers
- Official Obsidian plugin build/reload documentation: https://docs.obsidian.md/Plugins/Getting%20started/Build%20a%20plugin
- Official Obsidian release repository package description: https://github.com/obsidianmd/obsidian-releases

## Assessment

- `newInfoRatio`: 0.90
- Novelty justification: this pass resolved the exact release/asset/write path and exposed the critical distinction between a release tag and a manifest version.
- Confidence: high for BRAT mechanics; medium-high for direct editing of `community-plugins.json` because that is a file-layer equivalence inferred from BRAT's public plugin-manager operation.

## Reflection

- Worked: repository code and developer documentation agree on release assets and frozen-tag semantics.
- Ruled out: fetching `main.js` or `manifest.json` from a repository's default branch as the normal BRAT v2.2.0+ install route.
- Ruled out: silently downgrading or auto-bypassing `minAppVersion`; source makes the compatibility override explicit and interactive.

## Recommended Next Focus

Complete the theme path and a failure catalog, then turn all findings into AI recipes with explicit validation and rollback boundaries.
