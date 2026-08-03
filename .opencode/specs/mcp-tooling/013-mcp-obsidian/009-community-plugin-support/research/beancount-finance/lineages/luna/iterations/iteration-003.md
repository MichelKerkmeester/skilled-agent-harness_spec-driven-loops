# Iteration 3 — BQL, dashboard queries, and price execution

## Focus

Resolve the query-language contract between the plugin, `bean-query`, and the Beancount source adapter, then map the plugin's dashboard query families and price-fetch behavior to file-layer recipes.

## Findings

1. The plugin registers both a fenced `bql` code-block processor and an inline BQL processor during `main.ts` load. Named query directives are a separate path: `queryDirectives.ts` stores them in `queries.beancount`, while the inline `bql-q:<name>` form loads and executes the named query. The live block is therefore an execution surface, not a directive writer. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/main.ts] [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/queryDirectives.ts]

2. `queryRunner.ts` invokes the configured Beancount executable as `-q -f <format> <ledger-file> <query>`, with `format` defaulting to `csv`. It uses a temporary query path when needed, caps the child-process output at 50 MiB, treats stderr as a failure, removes an exact echoed query from the returned text, and resolves the parsed stdout. The setting is `beancountCommand`; there is no separate persisted `beanqueryCommand` key. Windows command normalization and WSL path conversion are handled in the execution helper. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/queryRunner.ts] [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/execSafe.ts]

3. The beanquery shell accepts a ledger filename followed by a query and exposes `-q/--no-errors`, `-f/--format`, `-o/--output`, `-m/--numberify`, and version flags. The plugin's `-q` suppresses beanquery's normal error text, but the plugin runner still rejects a non-zero process or stderr; an AI should preserve the raw command result when diagnosing a failure instead of treating an empty CSV as a valid zero-result query. [SOURCE: https://github.com/beancount/beanquery/blob/master/beanquery/shell.py] [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/queryRunner.ts]

4. Current beanquery grammar supports `SELECT`, `BALANCES`, `JOURNAL`, `PRINT`, `CREATE TABLE`, and `INSERT`. `SELECT` can use `DISTINCT`, `FROM`, `WHERE`, `GROUP BY`, `HAVING`, `ORDER BY`, `PIVOT BY`, and `LIMIT`; source qualifiers include `OPEN ON`, `CLOSE ON`, and `CLEAR`. Expressions include arithmetic, aliases, subqueries, `IN`/`NOT IN`, `IS NULL`, `BETWEEN`, regular-expression match `~`, non-match `!~`, regex search `?~`, boolean operators, and placeholders. `#`-prefixed source names are valid grammar table names; bare `FROM` uses the default postings source. [SOURCE: https://github.com/beancount/beanquery/blob/master/beanquery/parser/bql.ebnf] [SOURCE: https://github.com/beancount/beanquery/blob/master/beanquery/query_execute_test.py]

5. The Beancount source adapter exposes typed tables for `transactions`, `prices`, `balances`, `notes`, `events`, `documents`, `accounts`, `commodities`, `entries`, and `postings`. Entry rows expose identity/location/date/type/flag/payee/narration/description/tags/links/metadata/accounts. Posting rows expose parent transaction fields plus account, units (`number`, `currency`), cost (`cost_number`, `cost_currency`, `cost_date`, `cost_label`), `position`, `price`, computed `weight`, cumulative `balance`, posting metadata, and `entry`. `#entries`, `#transactions`, and `#postings` are consequently useful explicit sources when a query must make its row grain obvious. [SOURCE: https://github.com/beancount/beanquery/blob/master/beanquery/sources/beancount.py] [SOURCE: https://github.com/beancount/beanquery/blob/master/beanquery/query_execute_test.py]

6. The query environment covers scalar conversion and date/account helpers (`int`, `decimal`, `str`, `date`, `round`, `abs`, `length`, `year`, `month`, `day`, `date_trunc`, `date_add`, `date_diff`, `parse_date`, `root`, `parent`, `leaf`, `grep`, `upper`, `lower`, `open_date`, `close_date`, `meta`, `entry_meta`, and `has_account`), inventory/valuation helpers (`units`, `cost`, `convert`, `value`, `getprice`, `number`, `currency`, `only`), and aggregate functions (`COUNT`, `SUM`, `FIRST`, `LAST`, `MIN`, `MAX`). `sum(position)` returns an inventory; `number(only('USD', convert(sum(position), 'USD')))` is the explicit scalar extraction pattern used by the plugin's dashboard queries. [SOURCE: https://github.com/beancount/beanquery/blob/master/beanquery/query_env.py] [SOURCE: https://beancount.github.io/docs/beancount_query_language.html]

7. The plugin's total-assets query sums posting positions under `Assets`, converts to the operating currency, selects the requested currency, extracts the number, and rounds it; total liabilities follows the same pattern under `Liabilities`, with total net worth combining both account roots. Period income, expenses, and savings use the same `sum(position)`/`convert`/`only`/`number` idiom with a date interval. These expressions are the correct starting recipes for an AI that wants dashboard-compatible values rather than an ad-hoc sum of displayed units. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/queries/index.ts]

8. The balance-sheet query groups asset, liability, and equity postings by account, excludes accounts with a close date, and emits both an operating-currency value and a value for other currencies. The plugin has parallel units- and cost-basis query builders. Use units for cash-like holdings, cost for securities held at cost, and a conversion/price query for market valuation; choosing the wrong aggregate changes the meaning without necessarily causing a query error. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/queries/index.ts] [SOURCE: https://beancount.github.io/docs/beancount_query_language.html]

9. Historical net-worth, income, and expense queries truncate transaction dates to month or week, aggregate positions, and use `last(balance)` for point-in-time series. The transaction view selects date, payee, narration, position, and cumulative balance with account/date filters and descending date/line ordering. The journal service independently queries balances, notes, and postings, then groups postings by transaction id; its result is a journal model, not the same row grain as a raw `SELECT` over postings. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/queries/index.ts] [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/journal.ts] [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/services/journal.service.ts]

10. Commodity dashboards use `#commodities` for declarations, `#prices` for price history, and posting positions for holdings. They combine units, converted value, `getprice`, and commodity metadata; an AI can reproduce the dashboard with a holdings query grouped by `currency`, then a separate price-history query. A missing price or conversion can leave a currency in the “other currencies” result rather than proving that the holding is zero. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/queries/index.ts] [SOURCE: https://github.com/beancount/beanquery/blob/master/beanquery/sources/beancount.py]

11. The plugin calls `bean-price <ledger-path>` with no `--update`, `--all`, `--clobber`, or source flags. `bean-price` itself derives jobs from active balances and `commodity` metadata such as `price: "USD:yahoo/AAPL"`, prints Beancount `price` directives, and does not mutate the source file in ordinary stdout mode. The plugin filters output to simple dated `price` lines, deduplicates exact existing lines, and appends new lines to the structured `prices.beancount` file through the Vault API. It enforces a 60-second timeout. [SOURCE: https://github.com/beancount/beanprice/blob/master/beanprice/price.py] [SOURCE: https://github.com/beancount/beanprice/blob/master/README.md] [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/services/price.service.ts]

12. `bean-price` normal mode is therefore narrower than its CLI surface: the tool supports update/history/source/worker controls, but this plugin path does not request them. The `beanPriceCommand` setting selects the executable, while `autoPriceFetch`, `priceFetchIntervalHours`, and `lastAutoPriceFetch` control scheduled invocation. A file-layer AI should write commodity source metadata first, run the same no-flag command, then inspect the generated `prices.beancount` include and query the resulting price rows. [SOURCE: https://github.com/beancount/beanprice/blob/master/beanprice/price.py] [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/settings.ts] [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/structuredLayout.ts]

13. A minimal dashboard-compatible query set is: net worth by combining asset and liability `sum(position)` values in the operating currency; account balances grouped by account with `number(only(...))`; period income/expense grouped by account over `[start, end)`; holdings grouped by currency with `units(sum(position))` and `convert(sum(position), operatingCurrency)`; cost basis with `sum(cost(position))`; and a transaction register with `SELECT date, account, position, balance FROM #postings ... ORDER BY date, lineno`. Add `LIMIT` during exploration and remove it only after the result shape is verified. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/queries/index.ts] [SOURCE: https://beancount.github.io/docs/beancount_query_language.html]

## Ruled Out

- The plugin does not use a private database or an undocumented BQL transport; it shells out to the configured Beancount executable and reads stdout.
- `bean-price` is not called with `--update` by this plugin version, so a successful price fetch does not mean historical prices were rewritten in place.
- A dashboard's converted scalar is not interchangeable with a raw inventory or units value; conversion and `only()` are semantic steps.
- A raw `SELECT` over postings is not a transaction list until rows are grouped by `id` or queried from `#entries`/`#transactions`.

## Dead Ends

- Searching the plugin source for a separate `beanquery` setting produced no key; `beancountCommand` is the executable boundary.
- The root `main.js` requested for release verification is not present at the inspected 2.3.1 source ref; source modules are the verified evidence, while the compiled artifact remains a reconstruction gap.
- The older BQL manual does not enumerate every current grammar feature. Current `bql.ebnf`, shell implementation, and execution tests were used for the newer clauses and operators.

## Edge Cases

- `-q` can hide useful beanquery diagnostics; retain the exact query, ledger path, exit code, stderr, and stdout when reproducing failures.
- A query that returns no rows may mean an empty filter, an un-included generated file, a missing posting grain, or a failed currency conversion—not necessarily a zero balance.
- `sum(position)` is an inventory. Applying `number()` before selecting a single currency is unsafe when multiple currencies remain.
- A price row may be present but stale; `getprice` and `last(date)` should be inspected together.
- A query with `ORDER BY date` alone can be nondeterministic for same-day entries; dashboard transaction queries add line ordering.
- `bean-price` can produce no line when commodity metadata has no supported source or when the requested market is unavailable; the plugin then has nothing to append.
- Large result sets can hit the plugin's 50 MiB child-process cap; narrow date/account/currency filters before increasing UI limits.

## Sources Consulted

- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/main.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/settings.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/queryRunner.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/execSafe.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/queries/index.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/journal.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/services/journal.service.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/services/price.service.ts]
- [SOURCE: https://github.com/beancount/beanquery/blob/master/beanquery/parser/bql.ebnf]
- [SOURCE: https://github.com/beancount/beanquery/blob/master/beanquery/shell.py]
- [SOURCE: https://github.com/beancount/beanquery/blob/master/beanquery/sources/beancount.py]
- [SOURCE: https://github.com/beancount/beanquery/blob/master/beanquery/query_env.py]
- [SOURCE: https://github.com/beancount/beanquery/blob/master/beanquery/query_execute_test.py]
- [SOURCE: https://beancount.github.io/docs/beancount_query_language.html]
- [SOURCE: https://github.com/beancount/beanprice/blob/master/beanprice/price.py]
- [SOURCE: https://github.com/beancount/beanprice/blob/master/README.md]

## Assessment

The plugin is a thin, inspectable query client: its durable accounting state remains in Beancount text, while BQL supplies typed inventories, metadata, and calculated balances. The safest AI workflow is to state the intended row grain and valuation basis in every query, then run a small CSV probe before using the result to write or reconcile files.

## Reflection

The query layer closes the gap between the plugin's UI and file-layer operation. The dashboard formulas are reusable recipes, but their correctness depends on selecting the right inventory transformation, source table, date interval, and included ledger root.

## Recommended Next Focus

Map the complete UI/dashboard feature surface to file writes, settings, structured files, and safe end-to-end vault workflows.
