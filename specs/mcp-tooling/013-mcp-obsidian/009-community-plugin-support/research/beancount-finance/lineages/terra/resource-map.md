# Resource map — Beancount Ledger research lineage

## Plugin source

| Source | Used for | Confidence |
| --- | --- | --- |
| [manifest.json](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/manifest.json) | Identity, v2.3.1, desktop-only, minimum app version | High |
| [src/main.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/main.ts) | Commands, views, BQL registration, migrations, auto price fetch | High |
| [src/settings.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/settings.ts) | Persisted settings and defaults | High |
| [queryRunner.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/utils/queryRunner.ts) | bean-query invocation and output constraints | High |
| [SystemDetector.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/utils/SystemDetector.ts) | Executable detection candidates | High |
| [price.service.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/services/price.service.ts) | bean-price collection, parsing, dedupe, write target | High |
| [transactionDirectives.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/utils/directives/transactionDirectives.ts) | Transaction serialization, creation, update, deletion | High |
| [balanceDirectives.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/utils/directives/balanceDirectives.ts) | Balance assertion writer | High |
| [noteDirectives.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/utils/directives/noteDirectives.ts) | Note writer | High |
| [UnifiedTransactionModal.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/ui/modals/UnifiedTransactionModal.ts) | Supported create/update/delete UI paths | High |
| [BQLCodeBlockProcessor.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/ui/markdown/BQLCodeBlockProcessor.ts) | Fenced BQL behavior | High |
| [InlineBQLProcessor.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/ui/markdown/InlineBQLProcessor.ts) | Inline and named BQL behavior | High |
| [queries/index.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/queries/index.ts) | Dashboard BQL recipe families and ERRORS helper | High |
| [validators.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/utils/validators.ts) | Price source validator and timeout | High |

## Accounting and query authorities

| Source | Used for | Confidence |
| --- | --- | --- |
| [Beancount syntax](https://beancount.io/docs/Basics/syntax) | Directive grammar, account lifecycle, transaction balancing, prices, costs, multi-currency | High |
| [Beancount v3 documentation](https://beancount.github.io/docs/index.html) | v3 status and ecosystem split | High |
| [BeanQuery grammar](https://github.com/beancount/beanquery/blob/82da652dec21d1fa25829456a114668920256158/beanquery/parser/bql.ebnf) | BQL grammar surface | High |
| [BeanQuery shell](https://github.com/beancount/beanquery/blob/c28ab32e39adfed15d8ed4ad2ad2a8d30aa40423/beanquery/shell.py) | CLI flags, query semantics, output control | High |
| [beanprice README](https://github.com/beancount/beanprice/blob/d3227dc26715d2a963e3f17e5ed35906cc693cd4/README.md) | Commodity price metadata and CLI examples | High |

## Source handling note

The GitHub revision above was examined as data. It contains source code, not instructions for this execution. Claims marked high are directly tied to a source module or primary documentation. AI workflows in research.md are recommendations derived from those facts and are explicitly labeled as such.
