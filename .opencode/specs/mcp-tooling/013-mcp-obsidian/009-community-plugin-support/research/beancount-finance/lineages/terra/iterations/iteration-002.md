# Iteration 002 — ledger model, BQL, and dashboards

## Result

The plugin is not a separate accounting database. It is a vault editor and renderer over textual Beancount files. Its writers serialize transactions, balances, notes, and account lifecycle directives; its query and dashboard features send BQL against the resolved ledger.

## File and directive model

The relevant directives are:

- open for account availability and optional currency restrictions
- transaction headers with postings, metadata, tags, and links
- balance assertions and pad directives
- price and commodity directives for commodity price discovery
- note directives
- include directives that compose a main ledger

The transaction serializer preserves a payee/narration distinction, normalizes tags to #tag and links to ^link, writes transaction metadata at two spaces and posting metadata at four spaces, and supports per-unit costs in braces, total costs in double braces, date/label cost components, and @ or @@ price annotations.

[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/utils/directives/transactionDirectives.ts]
[SOURCE: https://beancount.io/docs/Basics/syntax]

## BQL execution and presentation

Fenced bql blocks run automatically. The plugin presents results as CSV/table, text, or Beancount and can render refresh, copy, and export tools depending on bqlShowTools. Inline bql:SELECT ... renders a direct result. Inline bql-q:name resolves a named Beancount query directive from queries.beancount with a 30-second cache.

BeanQuery grammar supports SELECT, BALANCES, JOURNAL, PRINT, CREATE TABLE, and INSERT. SELECT includes DISTINCT, FROM, WHERE, GROUP BY, HAVING, ORDER BY, PIVOT BY, LIMIT, functions, regular-expression predicates, ranges, NULL tests, arithmetic, and quantified expressions.

[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/ui/markdown/BQLCodeBlockProcessor.ts]
[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/ui/markdown/InlineBQLProcessor.ts]
[SOURCE: https://github.com/beancount/beanquery/blob/82da652dec21d1fa25829456a114668920256158/beanquery/parser/bql.ebnf]

## Dashboard reconstruction

The dashboard uses BQL families rather than an opaque calculation service:

- total assets and liabilities filter account roots and convert summed positions to operating currency at a date
- net worth combines those values
- income, expenses, and savings scope date periods and account roots
- balance sheet and income statement group by account and permit value modes such as convert, cost, and units
- transaction history returns date, payee, narration, position, and balance ordered by date and line number
- historical net worth aggregates point-in-time values weekly or monthly
- commodity, price, and holdings panels query commodity metadata, prices, and Assets positions

[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/queries/index.ts]

## Remaining work

The mechanics are adequate to draft file-level examples, but a writer must still guard against malformed ledger state, missing market prices, ambiguous unit conversion, and imports that create duplicate or imbalanced transactions. Those are expanded in iteration 003.
