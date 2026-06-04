# Review Resource Map

The target spec folder did not contain `resource-map.md` at initialization, so the deep-review resource-map coverage gate was skipped.

## Reviewed Surfaces
| Surface | Status |
|---|---|
| MCP mutation hooks | reviewed |
| memory_save handler and save sub-handlers | reviewed |
| memory_update/delete/bulk-delete handlers | reviewed |
| memory_embedding_reconcile handler and library | reviewed |
| entity-density cache | reviewed |
| public schema/docs/catalog surfaces | reviewed for traceability |

## Novel Logic Gaps
| Finding | Gap |
|---|---|
| F001 | Update-path title/trigger phrase mutations do not invalidate entity-density cache. |
| F002 | Success-coverage dry-run predicate does not match apply predicate. |
| F003 | Operator docs advertise `dryRun:false` while live reconcile schema uses `mode:"apply"`. |
| F004 | `activeOnly` is accepted but has no implementation branch. |
