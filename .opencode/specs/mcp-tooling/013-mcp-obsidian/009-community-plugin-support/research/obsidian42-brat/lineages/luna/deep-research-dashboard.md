---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Deep-dive research on the Obsidian plugin obsidian42-BRAT (id obsidian42-brat, author TfTHacker, v2.2.0+, GitHub TfTHacker/obsidian42-brat), for an AI operating the vault at the FILE LAYER. Resolve the EXACT data.json schema under .obsidian/plugins/obsidian42-brat/ (confirmed flags: updateAtStartup, updateThemesAtStartup, enableAfterInstall, loggingEnabled, debuggingMode; plus the beta-plugin list key + frozen-version list — READ the plugin SOURCE in the TfTHacker/obsidian42-brat repo). Cover every command (add beta plugin, add with frozen version/release-tag pin, check for updates, update single, restart, add/remove theme); the FULL install mechanics (GitHub release asset fetch — main.js/manifest.json/styles.css, release vs root, manifest minAppVersion/version handling, writing to .obsidian/plugins/<id>/ and enabling via community-plugins.json); theme install path; file-layer AI workflows (headless install + enable a beta plugin, register in BRAT data.json, frozen-version pin); a full error/edge-case catalog (repo has no releases, asset naming mismatch, plugin not appearing after reload, private repo); AI-usage recipes. Cite sources (repo source + tfthacker.com/BRAT). Produce a verified data-model + workflows + troubleshooting knowledge base.
- Started: 2026-08-02T00:00:00.000Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Session ID: fanout-luna-1785675410437-3ctuwx
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Plugin source schema: persisted settings, beta-plugin list, frozen-version list, and command registration. | schema-and-commands | 1.00 | 8 | complete |
| 2 | Safe headless AI workflows from BRAT source plus Obsidian vault-file behavior. | headless-workflows | 0.88 | 8 | complete |
| 3 | Private repository token handling: token validation, SecretStorage names, and settings UI | private-repositories | 0.93 | 7 | complete |
| 4 | Which non-token errors and edge cases occur, and what source-backed AI recipes and troubleshooting checks address them? | errors-and-troubleshooting | 0.94 | 8 | complete |
| 5 | Command and install gap closure for BRAT non-token troubleshooting and file-layer AI workflows | command-and-install-closure | 0.78 | 9 | complete |

- iterationsCompleted: 5
- keyFindings: 40
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] What exact persisted data.json keys, defaults, list shapes, and version-pin semantics does BRAT use?
- [x] What does every BRAT command do, including beta plugins, frozen release tags, updates, restart, and themes?
- [x] What exact release/root asset-fetch and vault-file install/enabling mechanics does BRAT implement?
- [x] Which headless file-layer workflows are safe for plugin installation, enabling, registration, and frozen pinning?
- [x] Which errors and edge cases occur, and what source-backed AI recipes and troubleshooting checks address them?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▇▆▆▅▄▅▅▅▆▆▆▆▆▆▅▄▃▂▁
- score sparkline: █▇▆▆▅▄▅▅▅▆▆▆▆▆▆▅▄▃▂▁
- Last 3 ratios: 0.93 -> 0.94 -> 0.78
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.78
- coverageBySources: {"code":2,"community.obsidian.md":1,"docs.obsidian.md":3,"forum.obsidian.md":3,"github.com":14,"newreleases.io":1,"obsidian.md":1,"other":4,"raw.githubusercontent.com":5,"tfthacker.com":5,"www.obsidianstats.com":1}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Direct raw fetches for some guessed source URLs initially failed through the web cache, so the successful path was GitHub tree navigation plus specific file opens. This is not a source dead end; it is a tooling access note. (iteration 1)
- Treating `pluginSubListFrozenVersion` as only frozen plugins was ruled out: source adds or updates an entry for every registered plugin and only treats truthy non-`"latest"` versions as update-skipped pins. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts] (iteration 1)
- Treating repository-root `manifest.json` as the primary v2.2 install source was ruled out for the plugin install path: current source asks GitHub releases for `manifest.json` and assets, with fallback/compatibility behavior to trace further next iteration. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts] (iteration 1)
- No new dead-end source direction was found. The prior raw-source tooling note remains a retrieval limitation, not a content dead end. (iteration 2)
- Purely editing BRAT `data.json` as a complete install was ruled out: BRAT also writes release assets, loads manifests, and enables via Obsidian APIs. [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/BetaPlugins.ts] (iteration 2)
- Treating theme installs like plugin installs was ruled out: themes use root CSS/manifest files and checksum tracking, not release `main.js` assets or plugin enablement. [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/themes.ts] [SOURCE: https://tfthacker.com/brat-themes] (iteration 2)
- Relying on raw GitHub retrieval via local shell was not usable in this environment because DNS resolution for `raw.githubusercontent.com` failed; the fallback evidence path was web-cached GitHub source pages. [SOURCE: command output: curl raw.githubusercontent.com returned "Could not resolve host: raw.githubusercontent.com"] (iteration 3)
- Storing a private GitHub token directly in BRAT `data.json` is ruled out for v2.0+ operation; current settings store secret names and intentionally remove token values from persisted settings. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts#L654-L690] [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/migrations.ts:L1-L2] (iteration 3)
- Treating a configured `tokenName` as proof of usable private access is ruled out; SettingsTab and BetaPlugins both separately check whether the named secret exists, and install/update can still proceed without a token value after warning. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/SettingsTab.ts#L3101-L3236] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts#L2571-L2596] (iteration 3)
- No new dead-end source direction was found. The existing blocked note about local raw GitHub retrieval remains a retrieval limitation rather than content evidence. (iteration 4)
- Retrying local raw GitHub fetches was avoided because the strategy lists local raw retrieval failure as blocked. GitHub HTML/source pages and official documentation remained usable. (iteration 4)
- Treating a missing plugin in Obsidian as purely a BRAT `data.json` issue was ruled out: BRAT may have registered the repo while install failed before writing or enabling the plugin files. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts#L2804-L2849] (iteration 4)
- Treating plugin and theme diagnostics as interchangeable was ruled out: plugins are release-asset/version driven, while themes are root-file/checksum driven. [SOURCE: https://tfthacker.com/brat-themes] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts#L2392-L2488] (iteration 4)
- Direct source access to `AddNewPluginModal.ts`, `VersionSuggestModal.ts`, and `AddNewTheme.ts` returned cache misses through the web tool. The command/install mechanics were still source-backed through `PluginCommands.ts`, `BetaPlugins.ts`, `githubUtils.ts`, and official BRAT docs, so this is a source-access limitation rather than an unanswered behavior gap. (iteration 5)
- Retrying local raw GitHub fetches remained out of scope because prior iterations recorded that path as blocked; this pass used GitHub HTML source and official docs instead. (iteration 5)
- Treating "restart plugin" as reinstall/update was ruled out: restart only disables/enables an installed plugin, while reinstall goes through `updatePlugin` with `forceReinstall=true`. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts#L1250-L1318] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts#L3068-L3084] (iteration 5)
- Treating enable/disable as BRAT registration was ruled out: those commands save Obsidian plugin enablement state, while BRAT registry changes happen through `addBetaPluginToList` and `deletePlugin`. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts#L1325-L1398] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts#L3221-L3235] (iteration 5)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:divergent-pivots -->
## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergent-pivots -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
