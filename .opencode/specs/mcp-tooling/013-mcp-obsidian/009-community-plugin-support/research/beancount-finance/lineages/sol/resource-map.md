# Resource Map — Beancount Ledger 2.3.1

## Plugin identity and state

| Resource | Use | Strength |
|---|---|---|
| [Obsidian community registry](https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugins.json) | Plugin ID → repository mapping | Primary registry |
| [Tag 2.3.1 manifest](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/manifest.json) | Version, minimum Obsidian, desktop-only | Primary tag source |
| [settings.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/settings.ts) | Exact 21-key settings interface/defaults and UI constraints | Primary tag source |
| [main.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/main.ts) | Commands, views, ribbons, scheduling, settings lifecycle | Primary tag source |

## Files and directive writers

| Resource | Use | Strength |
|---|---|---|
| [structuredLayout.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/structuredLayout.ts) | Includes, file routing, migration recognition | Primary tag source |
| [transactionDirectives.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/transactionDirectives.ts) | Transaction/posting/cost/price serialization | Primary tag source |
| [accountDirectives.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/accountDirectives.ts) | Open/close serialization | Primary tag source |
| [balanceDirectives.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/balanceDirectives.ts) | Balance/tolerance serialization | Primary tag source |
| [noteDirectives.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/noteDirectives.ts) | Note serialization | Primary tag source |
| [queryDirectives.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/queryDirectives.ts) | Named-query serialization/parsing | Primary tag source |

## BQL, dashboards, and prices

| Resource | Use | Strength |
|---|---|---|
| [queryRunner.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/queryRunner.ts) | Exact bean-query argv, formats, buffers, stderr behavior | Primary tag source |
| [beancount-lint.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/lang/beancount-lint.ts) | `.errors` validation path | Primary tag source |
| [BQLCodeBlockProcessor.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/ui/markdown/BQLCodeBlockProcessor.ts) | Fenced BQL behavior | Primary tag source |
| [InlineBQLProcessor.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/ui/markdown/InlineBQLProcessor.ts) | Direct/named inline BQL, cache/fallback | Primary tag source |
| [queries/index.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/queries/index.ts) | Dashboard-equivalent queries | Primary tag source |
| [price.service.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/services/price.service.ts) | beanprice argv, timeout, parsing, append behavior | Primary tag source |

## Accounting/query/import semantics

| Resource | Use | Strength |
|---|---|---|
| [Beancount language syntax](https://beancount.github.io/docs/beancount_language_syntax/) | Directive grammar, weights, lots, balances, pads, prices, includes | Primary project docs |
| [Getting started](https://beancount.github.io/docs/getting_started_with_beancount/) | Syntax constraints and bean-check behavior | Primary project docs |
| [Running Beancount](https://beancount.github.io/docs/running_beancount_and_generating_reports/) | Validation diagnostics; v2 caveat noted | Primary project docs with version caveat |
| [Beanquery grammar](https://github.com/beancount/beanquery/blob/master/beanquery/parser/bql.ebnf) | Exact BQL statement/expression grammar | Primary implementation |
| [Beanquery shell](https://github.com/beancount/beanquery/blob/master/beanquery/shell.py) | CLI flags and SELECT semantics | Primary implementation |
| [Beanquery Beancount adapter](https://github.com/beancount/beanquery/blob/master/beanquery/sources/beancount.py) | Tables and columns | Primary implementation |
| [Beanprice README](https://github.com/beancount/beanprice/blob/master/README.md) | Commodity price metadata and CLI | Primary project docs |
| [Beangulp README](https://github.com/beancount/beangulp/blob/master/README.rst) | Beancount 3 importer framework | Primary project docs |
| [Beangulp CSV importer](https://github.com/beancount/beangulp/blob/master/beangulp/importers/csv.py) | CSV fields, parsing, balance output | Primary implementation |

## Lineage artifacts

- `iterations/iteration-001.md`: plugin-owned contract.
- `iterations/iteration-002.md`: language semantics, workflows, failures.
- `deltas/iter-001.jsonl`, `deltas/iter-002.jsonl`: route-proof iteration deltas.
- `findings-registry.json`: 13 consolidated findings and ruled-out directions.
- `research.md`: canonical final synthesis.

## Known unavailable resource

`main.js` for GitHub Release 2.3.1 was not retrievable through the available web/GitHub transports and is absent from the tag tree. Claims are pinned to the exact tag’s TypeScript sources; bundle identity remains an explicit open provenance question.
