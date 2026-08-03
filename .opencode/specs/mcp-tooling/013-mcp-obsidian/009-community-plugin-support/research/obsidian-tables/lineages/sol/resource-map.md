# Resource Map — Obsidian Tables

## Canonical schema and persistence

| Primary source | Covered topics | Strength |
|---|---|---|
| [types.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts) | Root, policy, column/view/row shapes, types, constraints, filters, sorts | Primary contract |
| [MarkdownFileHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts) | YAML marker, fence, errors, preservation, `table-links` | Primary serializer |
| [JsonFileHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/JsonFileHandler.ts) | Bare JSON, empty/default repair, validation | Primary serializer |
| [Agentable](https://github.com/aztekgold/agentable) | Schema version and ID conventions | Primary upstream |

## Runtime semantics

| Primary source | Covered topics | Strength |
|---|---|---|
| [FormulaHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/FormulaHandler.ts) | ID references, evaluation, result-kind, persisted cells | Primary runtime |
| [FormulaRenderer.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/FormulaRenderer.ts) | Formula display/failure | Primary renderer |
| [FilterHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/FilterHandler.ts) | Operators, values, AND semantics | Primary runtime |
| [SortHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/SortHandler.ts) | Comparisons and first-sort-only behavior | Primary runtime |

## Migration, CSV, commands, settings, UX

| Primary source | Covered topics | Strength |
|---|---|---|
| [migrateUtils.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/migrateUtils.ts) | Legacy aliases/rows/options/display/filter/sort/IDs | Primary migration |
| [CsvFileHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/CsvFileHandler.ts) | Text-only import, IDs/widths, export | Primary I/O |
| [main.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/main.ts) | Settings, New table, conditional CSV surface | Primary entry |
| [README](https://github.com/aztekgold/obsidian-tables) | Types, editing, formulas, views, search, embeds, CSV, mobile | Primary docs |
| [README: embeds](https://github.com/aztekgold/obsidian-tables#embeds) | View selection/creation | Primary docs |
| [README: views](https://github.com/aztekgold/obsidian-tables#views-sorting--filtering) | Documented sorting/filter/search; runtime divergence | Docs + divergence |

## Topic coverage

| Topic | Sources |
|---|---|
| Wrapper/root | Markdown/JSON handlers, types |
| Column types/values | Types, migration, sort runtime, README |
| Formulas | Formula handler/renderer, README |
| Views/filters/sorts | Types, filter/sort handlers |
| Commands/settings/features | Main, README, CSV handler |
| AI recipes/troubleshooting | All serializers/runtime handlers; inferences labeled |
| Migration | Migration utilities, JSON handler |

## Lineage evidence and limits

- `iterations/iteration-001.md`: README contract, source map, failed transports.
- `iterations/iteration-002.md`: verified Agentable schema/runtime.
- `deltas/iter-001.jsonl`, `deltas/iter-002.jsonl`: machine evidence.
- `findings-registry.json`: consolidated reducer state.
- `research.md`: canonical 17-section synthesis.

Repository `main` is not a pinned release. Installed-release parity, exhaustive command IDs, and every UI notice remain open. Raw/blob/API/CDN source retrieval failed in iteration 1; the iteration-2 connector supplied cited bodies.

