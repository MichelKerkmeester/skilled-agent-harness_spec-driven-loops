# Resource Map: obsidian42-BRAT File-Layer Research

## Evidence Sources

| Resource | Role | Established |
|---|---|---|
| [settings.ts](https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts) | Primary | Settings schema/defaults, PluginVersion and ThemeInforamtion shapes, registration semantics. |
| [main.ts](https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/main.ts) | Primary | Stored-data/default merge and startup scheduling. |
| [BetaPlugins.ts](https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/BetaPlugins.ts) | Primary | Release validation, writes, compatibility, add/update/delete/reload, enablement. |
| [githubUtils.ts](https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/githubUtils.ts) | Primary | Release/tag resolution, exact asset matching, private API downloads, theme fetch helpers. |
| [themes.ts](https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/themes.ts) | Primary | Theme paths, checksum tracking, updates, removal. |
| [PluginCommands.ts](https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/PluginCommands.ts) | Primary | Current command surface. |
| [manifest.json](https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/manifest.json) | Primary | BRAT identity/version/minimum-app baseline. |
| [BRAT user guide](https://tfthacker.com/brat-plugins) | Corroboration | User terminology, frozen versions, cache delay. |
| [BRAT developer guide](https://tfthacker.com/brat-developers) | Corroboration | Release-based distribution context. |
| [BRAT themes guide](https://tfthacker.com/brat-themes) | Corroboration | Theme convention/removal behavior. |
| [BRAT private repositories guide](https://tfthacker.com/brat-private-repo) | Corroboration | Private access intent. |
| [Obsidian plugin layout guide](https://docs.obsidian.md/Plugins/Getting%20started/Build%20a%20plugin) | Platform | Directory/id relation and reload requirement. |

## Question Coverage

| Question | Primary evidence | Synthesis section |
|---|---|---|
| Exact data.json schema/defaults | settings.ts, main.ts | 3 and 4 |
| Commands | PluginCommands.ts, BetaPlugins.ts, themes.ts | 5 |
| Release assets, validation, local install, enablement | BetaPlugins.ts, githubUtils.ts | 6 and 7 |
| Moving/frozen file-layer workflows | settings.ts, BetaPlugins.ts, Obsidian docs | 9 and 10 |
| Themes, private access, edge cases | themes.ts, githubUtils.ts, BetaPlugins.ts | 8, 11, 13 |

## Local Lineage Artifacts

| Artifact | Role |
|---|---|
| deep-research-config.json | Detached-lineage configuration. |
| deep-research-state.jsonl | Append-only loop lifecycle. |
| deep-research-strategy.md | Question ledger. |
| findings-registry.json | Reducer projection. |
| prompts/ | Iteration instructions. |
| iterations/ | Write-once narratives. |
| deltas/ | Append-only evidence deltas. |
| research.md | Final knowledge base. |

## Source Precedence

Current repository source wins where documentation differs. The material example is themesList.lastUpdate: themes.ts calculates a CSS-character-sum checksum while older guide wording refers to commit dates.
