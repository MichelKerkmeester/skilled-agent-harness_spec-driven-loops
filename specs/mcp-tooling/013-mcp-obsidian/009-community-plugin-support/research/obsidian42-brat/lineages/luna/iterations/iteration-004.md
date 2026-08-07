# Iteration 4: Non-token BRAT errors, edge cases, and AI troubleshooting checks

## Focus
This iteration investigated the remaining non-token failure modes around BRAT plugin and theme installs: release lookup, asset naming, compatibility gates, frozen-update behavior, GitHub/API failures, missing local files, and file-layer troubleshooting recipes. The selected interpretation excludes private-token storage and validation because iteration 3 already covered that path.

## Actions Taken
- Read packet state, strategy, and registry before selecting the strategy-provided next focus.
- Verified the iteration and delta files did not already exist and that the write root is the bound `luna` research packet.
- Consulted BRAT source for plugin install/update error branches and GitHub release utility behavior.
- Consulted official BRAT documentation and Obsidian community/plugin metadata for user-facing workflows and current platform context.
- Wrote this iteration narrative, appended one canonical JSONL iteration record, and created the per-iteration delta file.

## Findings
1. BRAT's primary non-token install blocker is absence of a usable GitHub release: `grabReleaseFromRepository` returns `null` on a 404, and `getAllReleaseFiles` raises "No release found" before asset download begins. Troubleshooting check: inspect `https://github.com/<owner>/<repo>/releases`, verify the requested frozen tag exists when pinned, and remember that latest mode sorts release records rather than reading only repository-root files. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts#L2645-L2673] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts#L2437-L2459]
2. Release asset names are exact-match requirements. BRAT looks for release assets named `main.js`, `manifest.json`, and optional `styles.css`; missing `main.js` makes install/update abort with a "release is not complete" message, while missing release `manifest.json` can be filled from the already-selected primary manifest only for beta-manifest or manifest-fallback cases. Troubleshooting check: do not rely on files inside the repo tree or inside a generated source zip; the files must be uploaded as release assets with those exact names. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts#L2252-L2289] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts#L2706-L2813] [SOURCE: https://forum.obsidian.md/t/attempting-install-of-github-based-plugin-using-brat-results-in-main-js-is-missing-from-release/66149]
3. Version and release-tag mismatches are a concrete failure class. Current BRAT developer docs say v1.1+ primarily uses GitHub releases, choosing an exact release for frozen installs and the latest release/pre-release by semver otherwise; forum cases show "missing asset" symptoms can actually come from the manifest/version pointing BRAT or Obsidian checks at a different release than the one the developer inspected. Troubleshooting check: compare the BRAT-selected tag, the release asset list, and `manifest.json.version`; for frozen installs, treat `pluginSubListFrozenVersion[].version` as the tag BRAT requests. [SOURCE: https://tfthacker.com/brat-developers] [SOURCE: https://forum.obsidian.md/t/plugin-pr-not-working-your-latest-release-is-missing-the-file/76078] [SOURCE: https://forum.obsidian.md/t/cant-make-a-plugin-to-work-on-brat/84369]
4. Compatibility gates are file-layer relevant, not just UI warnings. BRAT blocks installs when `manifest.json.minAppVersion` exceeds the running Obsidian API version unless incompatible installs are allowed and confirmed; on mobile, a manifest with `isDesktopOnly: true` is blocked unless forced, in which case BRAT mutates the local manifest copy by recording original values under a `brat` object and lowering the incompatible field for local loading. Troubleshooting check: inspect installed `.obsidian/plugins/<id>/manifest.json` for `brat.isIncompatible`, `brat.minAppVersionOriginal`, and `brat.isDesktopOnlyOriginal` before assuming the upstream manifest was copied byte-for-byte. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts#L2640-L2694] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts#L2730-L2800]
5. Update checks intentionally skip frozen plugins and can self-heal missing local manifests. The update sweep builds maps from `pluginSubListFrozenVersion`, skips repos whose version is truthy and not `"latest"`, and for a missing local `manifest.json` catches platform file-not-found codes and reruns the install path. Troubleshooting check: if a registered plugin does not update, inspect BRAT `data.json` for a non-`latest` version pin; if the plugin folder is incomplete, a BRAT update can attempt reinstall, but an AI should still verify the release assets and final `.obsidian/plugins/<id>/manifest.json`. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts#L2894-L2926] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts#L3150-L3187]
6. GitHub API rate limiting is distinguished from ordinary asset failures. BRAT wraps GitHub requests with a User-Agent, parses rate-limit headers from GitHub response errors, throws a dedicated rate-limit error on status 403 with zero remaining requests, and otherwise lets install/update catch and log a user-facing "Error adding/updating plugin" message. Troubleshooting check: when multiple installs fail across repositories, check BRAT logs and developer console for rate-limit context rather than debugging each repository's release layout independently. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts#L2789-L2857] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts#L3022-L3047]
7. Theme troubleshooting is a different recipe from plugin troubleshooting. Official BRAT theme docs say theme installs read repository-root `theme-beta.css` first, then `theme.css`, save CSS plus `manifest.json` into the vault themes folder, and track changes by checksum rather than manifest version; if BRAT becomes confused after GitHub caching delay, the docs advise unregistering the theme and deleting the local file before retrying. [SOURCE: https://tfthacker.com/brat-themes] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts#L2392-L2488]
8. Source-backed file-layer AI recipe for a non-token install failure: normalize the repo path to `owner/repo`; list releases and select the same release BRAT would select, honoring frozen tag if present; verify exact release assets `main.js` and `manifest.json`; parse `manifest.json.id`, `version`, `minAppVersion`, and `isDesktopOnly`; verify the vault folder `.obsidian/plugins/<id>/` contains fresh `main.js` and `manifest.json`; verify BRAT `data.json` has both `pluginList` and `pluginSubListFrozenVersion` entries; verify `.obsidian/community-plugins.json` includes the plugin id only when Obsidian/BRAT has actually enabled it. [INFERENCE: based on source behavior in BetaPlugins.ts release selection, vault writes, enablement calls, and update skip logic plus prior iteration schema findings]

## Ruled Out
- Retrying local raw GitHub fetches was avoided because the strategy lists local raw retrieval failure as blocked. GitHub HTML/source pages and official documentation remained usable.
- Treating a missing plugin in Obsidian as purely a BRAT `data.json` issue was ruled out: BRAT may have registered the repo while install failed before writing or enabling the plugin files. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts#L2804-L2849]
- Treating plugin and theme diagnostics as interchangeable was ruled out: plugins are release-asset/version driven, while themes are root-file/checksum driven. [SOURCE: https://tfthacker.com/brat-themes] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts#L2392-L2488]

## Dead Ends
- No new dead-end source direction was found. The existing blocked note about local raw GitHub retrieval remains a retrieval limitation rather than content evidence.

## Edge Cases
- Ambiguous input: none; "non-token errors" was interpreted as release, asset, compatibility, update, theme, and vault-file edge cases excluding private-token storage.
- Contradictory evidence: historical forum advice mentions repository-root manifest/version coupling, while current BRAT developer docs and current source say v1.1+ primarily uses release assets. The current source and current TfTHacker docs are better evidence for v2.2.0+ behavior; historical forum threads remain useful as symptom examples. [SOURCE: https://tfthacker.com/brat-developers] [SOURCE: https://forum.obsidian.md/t/cant-make-a-plugin-to-work-on-brat/84369]
- Missing dependencies: direct local raw GitHub retrieval remained blocked by prior iteration evidence, so this iteration used web-cached GitHub source pages and official documentation.
- Partial success: progressive `research.md` synthesis was not written because this dispatch's allowed-write list excludes it; the narrative records the would-be write under scope violations.

## SCOPE VIOLATIONS
- scope_violation: Config has `progressiveSynthesis: true`, which would normally permit updating packet-local `research.md`, but this dispatch explicitly allowed writes only to the iteration narrative, state log, and delta file. I did not write `research.md`.

## Sources Consulted
- https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts#L2437-L2459
- https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts#L2640-L2813
- https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts#L2832-L3047
- https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts#L3150-L3187
- https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts#L2252-L2289
- https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts#L2392-L2488
- https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts#L2645-L2857
- https://tfthacker.com/brat-plugins
- https://tfthacker.com/brat-developers
- https://tfthacker.com/brat-themes
- https://community.obsidian.md/plugins/obsidian42-brat
- https://forum.obsidian.md/t/attempting-install-of-github-based-plugin-using-brat-results-in-main-js-is-missing-from-release/66149
- https://forum.obsidian.md/t/plugin-pr-not-working-your-latest-release-is-missing-the-file/76078
- https://forum.obsidian.md/t/cant-make-a-plugin-to-work-on-brat/84369

## Assessment
- New information ratio: 0.94
- Questions addressed:
  - Which errors and edge cases occur, and what source-backed AI recipes and troubleshooting checks address them?
  - What exact release/root asset-fetch and vault-file install/enabling mechanics does BRAT implement?
- Questions answered:
  - Which errors and edge cases occur, and what source-backed AI recipes and troubleshooting checks address them?

## Questions Answered
- Which errors and edge cases occur, and what source-backed AI recipes and troubleshooting checks address them?

## Questions Remaining
- What does every BRAT command do, including beta plugins, frozen release tags, updates, restart, and themes?
- What exact release/root asset-fetch and vault-file install/enabling mechanics does BRAT implement?

## Reflection
- What worked and why: Reading source branches around install/update failure points produced a practical troubleshooting model because BRAT's important failures are explicit returns, notices, and logs rather than hidden side effects.
- What did not work and why: The theme source page did not open as a rich source view through GitHub HTML, so official theme docs plus GitHub utility functions carried the theme edge-case evidence.
- What I would do differently: Use the final iteration to close the command catalog and connect every command to the exact helper path and expected vault-file side effects.

## Recommended Next Focus
Close the command catalog: map every command ID to its callback, modal/helper path, user-facing behavior, and file-layer side effects, while preserving the release/root mechanics already established here.
