# Iteration 3: Themes, private repositories, and automation failure boundaries

## Focus

Resolve the non-plugin paths and turn source evidence into conservative recipes and an error catalogue for an AI operating only at the vault file layer.

## Findings

1. Themes use a different path from plugins. BRAT fetches `theme-beta.css` from the repository root first, then falls back to `theme.css`; it also requires a root `manifest.json`. It writes the chosen CSS as `.obsidian/themes/<manifest.name>/theme.css`, writes that manifest next to it, and records `{repo,lastUpdate}` in `themesList`, where `lastUpdate` is the CSS checksum. Theme updates compare the online CSS checksum against that stored value. [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/themes.ts] [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/githubUtils.ts] [SOURCE: https://tfthacker.com/brat-themes]

2. Theme removal is *unregistration*, not uninstall. `themeDelete()` filters the repository out of `themesList` and saves settings; it deliberately leaves the theme files on disk. The current palette exposes `Themes: Grab a beta theme for testing from a Github repository` and `Themes: Update beta themes`; removal belongs in BRAT settings. A file-layer AI must therefore distinguish “stop monitoring” (remove the `themesList` object only) from “delete the installed theme” (a separate destructive request). [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/themes.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts] [SOURCE: https://tfthacker.com/brat-themes]

3. Private-plugin support is not a pure `data.json` workflow. BRAT resolves a per-repo `tokenName` or `globalTokenName` through Obsidian SecretStorage; `token` in the list record is deprecated. With a private repository and a token, BRAT downloads release assets through the GitHub API URL with an authorization header. The documented feature is experimental and calls for a read-only repository PAT. A file-layer-only AI can retain a pre-existing `tokenName`, but it cannot safely create or recover the secret by editing `data.json`; it must fail closed or obtain a separately authorized secret-storage operation. [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/BetaPlugins.ts] [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/githubUtils.ts] [SOURCE: https://tfthacker.com/brat-private-repo]

4. The highest-value failure checks are concrete: no releases; missing release `manifest.json`; no `id` or `version` in the manifest; missing release `main.js`; exact asset-name mismatch; a release tag that does not exist; an incompatible `minAppVersion`; a mobile-only incompatibility; GitHub API rate limiting/auth errors; missing SecretStorage entry; and malformed/incorrectly located vault files. The source reports or returns failure for these conditions rather than manufacturing a fallback package. [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/BetaPlugins.ts] [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/githubUtils.ts]

5. Several edge cases require explicit operational handling: a non-`latest` frozen entry intentionally skips bulk and single updates; the plugin updater writes `styles.css` only if the incoming release supplies it, so an already-installed stale stylesheet may survive a release that omits it; a plugin folder must equal `manifest.id`; and a manifest change requires an Obsidian restart. BRAT's restart helper catches reload errors, so a "restart completed" UI path is not sufficient evidence that a plugin loaded successfully. [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/BetaPlugins.ts] [SOURCE: https://docs.obsidian.md/Plugins/Getting%20started/Build%20a%20plugin]

6. GitHub caching creates a false-negative update class. BRAT documentation warns that plugin releases can take 5–15 minutes to become fetchable and theme updates can take several minutes; retrying immediately can look like a BRAT failure. An AI should capture the observed release/tag or CSS checksum, apply bounded retry/backoff, then report the repository/cache state instead of re-registering duplicate settings entries. [SOURCE: https://tfthacker.com/brat-plugins] [SOURCE: https://tfthacker.com/brat-themes]

7. The minimum safe file-layer recipes are now well-defined. For a moving plugin: install release assets, upsert `pluginList` with one canonical `OWNER/repo`, upsert `{repo,version:"latest"}` in `pluginSubListFrozenVersion`, and enable by manifest id only if `enableAfterInstall` is true. For a frozen plugin: perform the same asset/install validation using the exact tag, then upsert `{repo,version:"<exact-release-tag>"}`; it will remain registered but skipped by BRAT's automatic updates. For a beta theme: prefer `theme-beta.css`, write it as `theme.css` under the manifest-name directory, and upsert `{repo,lastUpdate:"<source-compatible-checksum>"}`. Each recipe must write staged files before settings, preserve unrelated JSON entries, and validate after an app restart. [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/BetaPlugins.ts] [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/themes.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts]

## Sources Consulted

- Theme source: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/themes.ts
- GitHub/private/release helper source: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/githubUtils.ts
- Plugin install/update source: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/BetaPlugins.ts
- BRAT theme guide: https://tfthacker.com/brat-themes
- BRAT private-repository guide: https://tfthacker.com/brat-private-repo
- BRAT plugin guide: https://tfthacker.com/brat-plugins
- Official Obsidian plugin loading/reload guide: https://docs.obsidian.md/Plugins/Getting%20started/Build%20a%20plugin

## Assessment

- `newInfoRatio`: 0.85
- Novelty justification: this pass adds the distinct theme path, the SecretStorage limitation, release/cache failure modes, and safe recipes necessary to make the earlier plugin mechanics operational.
- Confidence: high for BRAT behavior described in source; medium for live file-layer enablement mechanics because writing `community-plugins.json` is a carefully documented equivalence rather than a direct BRAT file write.

## Reflection

- Worked: source and BRAT documentation agree that themes are root-file/checksum based, unlike release-asset plugins.
- Ruled out: deleting theme files when merely removing it from BRAT tracking.
- Ruled out: solving private access by placing a raw PAT in `data.json`.
- Forced-depth note: convergence signals are positive because each pass supplied new source-backed material, but `stopPolicy=max-iterations` now ends the loop at run 3.

## Recommended Next Focus

Synthesize the verified schema, command map, workflows, recipes, and edge-case catalogue; do not run a fourth research iteration.
