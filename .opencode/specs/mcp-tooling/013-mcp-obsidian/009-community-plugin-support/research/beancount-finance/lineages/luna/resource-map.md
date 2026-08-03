# Resource map — Beancount Ledger 2.3.1 lineage `luna`

## Canonical outputs

| Artifact | Role | Coverage |
|---|---|---|
| `research.md` | Final synthesized knowledge base | Full data model, settings, commands, BQL, pricing, dashboards, workflows, errors, CSV, reconciliation, AI recipes |
| `synthesis-v1.md` | Synthesis receipt | Inputs, method, evidence boundary, unresolved gap |
| `convergence-report.md` | Loop telemetry and completion gate | Five max-iteration records, convergence telemetry, no early synthesis |
| `deep-research-state.jsonl` | Canonical state stream | Config + iterations 1–5 + synthesis |
| `findings-registry.json` | Reducer registry | Questions, findings, coverage, reconstruction gap |
| `deep-research-dashboard.md` | Human-readable progress | Iteration status and synthesis status |
| `deep-research-config.json` | Run configuration/status | Session, executor, stop policy, direct artifact binding |

## Iteration artifacts

| Iteration | Focus | Primary artifacts | Source families |
|---:|---|---|---|
| 1 | Plugin-owned schema and process boundary | `iterations/iteration-001.md`, `deltas/iteration-001.jsonl`, `prompts/iteration-001.md` | plugin source, settings, structured layout, query/price services |
| 2 | Beancount directives and cost-basis lots | `iterations/iteration-002.md`, `deltas/iteration-002.jsonl`, `prompts/iteration-002.md` | official language, inventory, trading docs |
| 3 | BQL grammar, dashboard queries, bean-price | `iterations/iteration-003.md`, `deltas/iteration-003.jsonl`, `prompts/iteration-003.md` | plugin query builders, beanquery grammar/source/env/tests, beanprice |
| 4 | UI surface and file workflows | `iterations/iteration-004.md`, `deltas/iteration-004.jsonl`, `prompts/iteration-004.md` | dashboard view, modal, editor, settings, structured routing, docs |
| 5 | Errors, CSV, reconciliation, AI recipes | `iterations/iteration-005.md`, `deltas/iteration-005.jsonl`, `prompts/iteration-005.md` | Beancount v3 packaging/docs, plugin linter/parsers/writers, beanquery/beanprice |

## Source coverage

### Plugin

- Repository: [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin]
- Tagged source tree: [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/tree/2.3.1]
- Main lifecycle/commands: [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/main.ts]
- Settings schema: [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/settings.ts]
- File graph: [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/structuredLayout.ts]
- Query runner/process: [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/queryRunner.ts], [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/execSafe.ts]
- Dashboard formulas: [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/queries/index.ts]
- Writers: [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/tree/2.3.1/src/utils/directives]
- Dashboard/modal/editor: [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/ui/views/dashboard/unified-dashboard-view.ts], [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/ui/modals/UnifiedTransactionModal.ts], [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/ui/views/beancount-file-view.ts]
- Lint/CSV/price: [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/lang/beancount-lint.ts], [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/csvParsers.ts], [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/services/price.service.ts]
- Project docs: [SOURCE: https://mkshp-dev.github.io/obsidian-finance-plugin/]

### Beancount

- Syntax/directives: [SOURCE: https://beancount.github.io/docs/beancount_language_syntax/]
- Inventory/lots: [SOURCE: https://beancount.github.io/docs/how_inventories_work/], [SOURCE: https://beancount.github.io/docs/trading_with_beancount/]
- Setup/validation: [SOURCE: https://beancount.github.io/docs/getting_started_with_beancount/], [SOURCE: https://beancount.github.io/docs/running_beancount_and_generating_reports/]
- Current v3 console scripts: [SOURCE: https://github.com/beancount/beancount/blob/master/pyproject.toml]

### beanquery

- BQL grammar: [SOURCE: https://github.com/beancount/beanquery/blob/master/beanquery/parser/bql.ebnf]
- CLI shell: [SOURCE: https://github.com/beancount/beanquery/blob/master/beanquery/shell.py]
- Beancount tables/columns: [SOURCE: https://github.com/beancount/beanquery/blob/master/beanquery/sources/beancount.py]
- Functions/types: [SOURCE: https://github.com/beancount/beanquery/blob/master/beanquery/query_env.py]
- Grammar/execution coverage: [SOURCE: https://github.com/beancount/beanquery/blob/master/beanquery/query_execute_test.py]
- Older explanatory manual: [SOURCE: https://beancount.github.io/docs/beancount_query_language.html]

### beanprice

- CLI and job generation: [SOURCE: https://github.com/beancount/beanprice/blob/master/beanprice/price.py]
- Usage/metadata: [SOURCE: https://github.com/beancount/beanprice/blob/master/README.md]

## Evidence gap

The compiled repository-root `main.js` requested by the brief was not available at the inspected `2.3.1` source ref or connector-supported release-download URL. No claim in `research.md` depends on undocumented compiled-only behavior; the gap is tracked in `findings-registry.json` as one reconstruction gap.
