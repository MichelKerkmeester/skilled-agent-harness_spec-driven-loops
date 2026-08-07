# Research Resource Map — obsidian42-BRAT

## Repository Source

| Resource | Coverage |
|---|---|
| `src/settings.ts` | Exact persisted schema, defaults, version/theme entry shapes, token-name fields |
| `src/features/BetaPlugins.ts` | Plugin release validation, asset writes, update/reload/remove, compatibility |
| `src/features/githubUtils.ts` | GitHub release/tag selection, assets, authentication, API failures |
| `src/features/themes.ts` | Root theme files, checksum updates, install and unregister semantics |
| `src/ui/PluginCommands.ts` | Command names and callbacks |
| `src/main.ts` | Protocol handler, startup scheduling, public API exposure |
| `src/ui/SettingsTab.ts` | Theme/settings removal action |

## Official Documentation

| Resource | Coverage |
|---|---|
| `tfthacker.com/brat-quick-guide` | Install, registration, removal expectations |
| `tfthacker.com/brat-plugins` | Frozen versions, update/check/restart behavior |
| `tfthacker.com/brat-developers` | Required GitHub release assets |
| `tfthacker.com/brat-themes` | Theme root files, checksum updates, unregister behavior |
| `tfthacker.com/brat-private-repo` | Experimental private-repo token model |
| `tfthacker.com/brat-protocol` | Plugin/theme URI entry points and protocol limits |

## Lineage Delta Sources

| Iteration | Delta | Focus |
|---:|---|---|
| 1 | `deltas/iter-001.jsonl` | Schema and install mechanics |
| 2 | `deltas/iter-002.jsonl` | Commands, file-layer workflows, failures |

## Coverage Gaps

- Modal field-by-field validation and version-picker UI internals were not fully inspected.
- Current `main` was authoritative; exact historical point-tag UI differences were not enumerated.
