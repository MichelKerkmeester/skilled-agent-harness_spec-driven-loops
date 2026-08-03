# Beancount Ledger 2.3.1 — File-Layer AI Knowledge Base

## 1. Executive summary

Beancount Ledger (`beancount-finance`) is a desktop-only Obsidian plugin that owns a structured Beancount ledger under a configurable vault folder, runs live BQL through `bean-query`, offers transaction/directive entry and financial dashboards, and runs `bean-price` to append market prices. Its persistent plugin state is a 21-key JSON object at `.obsidian/plugins/beancount-finance/data.json`; the financial source of truth remains plain `.beancount` files. [Plugin manifest](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/manifest.json) [Settings source](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/settings.ts)

For an AI working at the file layer, three rules dominate:

1. Preserve the plugin’s structured file routing and top-level includes.
2. Validate every staged write with `bean-check` or the plugin-equivalent BQL `.errors`; ordinary plugin BQL uses `-q`, so successful query output is not proof that the ledger is valid.
3. For foreign exchange and investments, balance by Beancount *weight*, not nominal units, and identify cost lots explicitly before reductions.

## 2. Identity, version, and source provenance

The Obsidian community registry maps plugin ID `beancount-finance` to `mkshp-dev/obsidian-finance-plugin`. Tag `2.3.1` declares name “Beancount Ledger,” version 2.3.1, minimum Obsidian 1.7.2, and `isDesktopOnly: true`, consistent with its Node subprocess usage. [Community registry](https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugins.json) [Manifest](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/manifest.json)

The Git tree at tag 2.3.1 does not track `main.js`; Obsidian distributes it as a GitHub Release asset. Direct release-page and release-asset retrieval returned cache misses, while GitHub Contents returned 404 for a tree file. This report therefore cites and cross-checks the exact tagged TypeScript inputs that compile the bundle. Bundle-level minification or accidental release-asset drift could not be independently verified. [Tagged source tree](https://github.com/mkshp-dev/obsidian-finance-plugin/tree/2.3.1)

## 3. Exact `.obsidian/plugins/beancount-finance/data.json` schema

`loadSettings()` shallow-merges persisted data over `DEFAULT_SETTINGS`; missing current keys receive defaults. `saveSettings()` persists the merged object. Legacy `reportingCurrency` or `defaultCurrency` migrates to `operatingCurrency`; an existing structured-folder user may be migrated to `onboardingCompleted: true`. Because the merge does not whitelist keys, unknown or legacy properties can survive and be serialized again. [Settings source](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/settings.ts) [Main source](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/main.ts)

| Key | Type / values | Default | Role |
|---|---|---:|---|
| `beancountCommand` | string | `""` | Executable used as `bean-query`; may be a WSL command. |
| `operatingCurrency` | string | `"USD"` | Default entry and dashboard-conversion currency. |
| `maxTransactionResults` | number | `2000` | Dashboard transaction cap; UI accepts 1–10000. |
| `maxJournalResults` | number | `1000` | Journal cap; UI accepts 1–5000. |
| `dashboardDefaultPeriod` | `this-month`, `last-month`, `this-year`, `last-year` | `"this-month"` | Initial summary period. |
| `bqlShowTools` | boolean | `true` | Show refresh/copy/download controls on fenced BQL. |
| `bqlShowQuery` | boolean | `false` | Show collapsible query text. |
| `debugMode` | boolean | `false` | Console debug logging. |
| `createBackups` | boolean | `true` | Back up files before plugin mutations. |
| `maxBackupFiles` | number | `10` | Backup retention; `0` means unlimited. |
| `structuredFolderName` | string | `"Finances"` | Vault-relative ledger root. |
| `fileOrganization` | `yearly`, `monthly` | `"yearly"` | Transaction partitioning. |
| `autoPriceFetch` | boolean | `false` | Enable scheduled beanprice runs. |
| `priceFetchIntervalHours` | number | `24` | Positive-integer interval. |
| `lastAutoPriceFetch` | number | `0` | Epoch milliseconds of the last scheduled fetch. |
| `beanPriceCommand` | string | `""` | `bean-price` executable/path. |
| `accountAutocomplete` | boolean | `true` | Editor completions for accounts and ledger tokens. |
| `enableUserSnippets` | boolean | `false` | Load/create `snippets.beancount`. |
| `formatOnSave` | boolean | `false` | Normalize indentation, alignment, and price spacing. |
| `lintMode` | `off`, `on-save`, `on-change` | `"on-save"` | `.errors` diagnostics; on-change uses a two-second debounce. |
| `onboardingCompleted` | boolean | `false` | Suppress first-run onboarding. |

A canonical default file is therefore:

```json
{
  "beancountCommand": "",
  "operatingCurrency": "USD",
  "maxTransactionResults": 2000,
  "maxJournalResults": 1000,
  "dashboardDefaultPeriod": "this-month",
  "bqlShowTools": true,
  "bqlShowQuery": false,
  "debugMode": false,
  "createBackups": true,
  "maxBackupFiles": 10,
  "structuredFolderName": "Finances",
  "fileOrganization": "yearly",
  "autoPriceFetch": false,
  "priceFetchIntervalHours": 24,
  "lastAutoPriceFetch": 0,
  "beanPriceCommand": "",
  "accountAutocomplete": true,
  "enableUserSnippets": false,
  "formatOnSave": false,
  "lintMode": "on-save",
  "onboardingCompleted": false
}
```

## 4. Structured vault data model

The main entry point is `<structuredFolderName>/ledger.beancount`. A generated ledger sets a title, sets `option "operating_currency"`, and includes these files in this logical order: commodities, accounts, prices, pads, balances, queries, notes, events, then transaction partitions newest-first. [Structured layout source](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/structuredLayout.ts)

```text
Finances/
├── ledger.beancount
├── commodities.beancount
├── accounts.beancount
├── prices.beancount
├── pads.beancount
├── balances.beancount
├── queries.beancount
├── notes.beancount
├── events.beancount
├── snippets.beancount          # created/used only when snippets are enabled
└── transactions/
    ├── 2025.beancount          # yearly mode
    └── 2026/
        └── 2026-08.beancount   # monthly mode
```

Routing is semantic, not optional: open/close directives belong in `accounts.beancount`; commodities in `commodities.beancount`; prices in `prices.beancount`; pads, balances, queries, notes, and events in their matching files; transactions in the year/month partition chosen by `fileOrganization`. An AI should retain this split because plugin edit lookup, migration, dashboard refresh, and backups assume it.

Relative `include` paths resolve from the including file’s directory. Beancount processes directives by date rather than textual declaration order, but include completeness and unique, non-cyclic file ownership remain operational requirements. [Beancount syntax: includes](https://beancount.github.io/docs/beancount_language_syntax/)

## 5. Beancount directives the plugin reads and writes

The plugin’s entry modal writes transaction, balance, open, close, note, and named-query directives. Structured migration recognizes commodity, open/close, price, pad, balance, note, event, query, and transaction entries through `PRINT FROM type='…'`. Price fetching writes price directives. [Structured layout source](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/structuredLayout.ts)

| Directive | Canonical form | File / behavior |
|---|---|---|
| Commodity | `2020-01-01 commodity AAPL` plus metadata | `commodities.beancount`; may carry beanprice `price:` metadata. |
| Open | `2025-01-01 open Assets:Bank:Checking USD` | `accounts.beancount`; date must be on/before first posting. Optional currencies and booking method. |
| Close | `2025-12-31 close Assets:OldBank` | `accounts.beancount`; does not assert a zero balance automatically. |
| Transaction | `date flag [payee] narration [#tags] [^links]` plus postings | Transaction partition. One posting may omit units for interpolation. |
| Balance | `date balance Account number CUR [~ tolerance]` | `balances.beancount`; one assertion per commodity. |
| Price | `date price BASE number QUOTE` | `prices.beancount`; market/exchange data point. |
| Pad | `date pad Account Equity:Opening-Balances` | `pads.beancount`; fills the next balance assertion. |
| Note | `date note Account "text" [#tags] [^links]` | `notes.beancount`; account-linked journal fact. |
| Event | `date event "type" "description"` | `events.beancount`; plugin dashboards also use events for indicators/targets. |
| Query | `date query "name" "BQL"` | `queries.beancount`; consumed by inline `bql-q:name`. |
| Include | `include "relative/file.beancount"` | Top-level organization; not dated. |

Account names use one of the five roots `Assets`, `Liabilities`, `Equity`, `Income`, or `Expenses` and colon-separated components. Commodity/currency symbols begin with an uppercase letter; dates use valid ISO `YYYY-MM-DD`; strings are quoted. [Getting started](https://beancount.github.io/docs/getting_started_with_beancount/) [Language syntax](https://beancount.github.io/docs/beancount_language_syntax/)

## 6. Transactions, multi-currency, and cost-basis lots

A plugin-serialized transaction can include transaction and posting metadata, posting flags, comments, tags, links, omitted units, per-unit or total costs, dates/labels in cost specifications, and per-unit or total prices. [Transaction writer](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/transactionDirectives.ts)

```beancount
2026-08-02 * "Grocer" "Weekly shop" #food ^bank-row-42
  source: "bank.csv:42"
  Assets:Bank:Checking  -63.20 EUR
  Expenses:Food          63.20 EUR
```

Beancount balances the *weight* of postings:

- `10 USD` weighs `10 USD`.
- `10 CAD @ 0.75 USD` weighs `7.50 USD`.
- `10 AAPL {150 USD}` weighs `1500 USD`.
- If a cost and price are both present, cost controls balancing; price updates market-price information.

For a currency conversion, `@` is a per-unit rate and `@@` is the total converted amount:

```beancount
2026-08-02 * "FX transfer"
  Assets:Bank:USD  -1000.00 USD @ 0.915 EUR
  Assets:Bank:EUR    915.00 EUR
```

For investments, braces create or select cost lots:

```beancount
2026-01-10 * "Broker" "Buy AAPL"
  Assets:Broker:AAPL   10 AAPL {190.00 USD, 2026-01-10, "lot-1"}
  Assets:Broker:Cash  -1900.00 USD

2026-08-02 * "Broker" "Sell AAPL"
  Assets:Broker:AAPL  -4 AAPL {190.00 USD, 2026-01-10, "lot-1"} @ 225.00 USD
  Assets:Broker:Cash   900.00 USD
  Income:Capital-Gains
```

`{number CUR}` is per-unit cost; plugin serialization also supports `{{total CUR}}`. Empty `{}`, a date, or a label can select inventory, but a partial reduction matching multiple lots is ambiguous under default `STRICT` booking. `FIFO` or `LIFO` may select lots automatically when declared on the account. Costed inventories normally cannot go negative. Query inventory first and use an exact selector for AI-authored sales. [Language syntax: costs and reducing positions](https://beancount.github.io/docs/beancount_language_syntax/)

## 7. Full command and feature surface

Tag 2.3.1 registers seven command-palette commands and two ribbon actions. [Main source](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/main.ts)

| Command ID | Display name | Effect |
|---|---|---|
| `add-beancount-transaction` | Add Beancount transaction | Opens the unified directive/transaction modal. |
| `open-beancount-unified-dashboard` | Open Beancount unified dashboard | Opens the tabbed dashboard. |
| `open-beancount-snapshot` | Open Beancount snapshot | Opens the compact snapshot in the right pane. |
| `run-beancount-onboarding` | Run setup/onboarding | Creates/migrates structured layout; reconfirms if already completed. |
| `format-beancount-document` | Format Beancount document | Formats the active `.beancount` editor. |
| `fetch-commodity-prices` | Fetch commodity prices | Invokes the dashboard controller or price service directly. |
| `open-beancount-snippets` | Open Beancount snippets file | Opens or creates `snippets.beancount`. |

The ribbon exposes “Add transaction” and “Open Beancount dashboard.” `.beancount` and `.bean` files use a dedicated plain-text editor with autocomplete, optional snippets, formatting, and `.errors` linting. The former “Insert BQL Query Block” command is explicitly removed; users insert BQL fences or inline code manually.

The unified dashboard covers summary/net worth, balance sheet, income/expense views, transactions/journal, commodities/prices, and event-backed financial indicators. Source queries support operating-currency conversion, cost and units views, period filters, account search, tags, historical month/week groups, and result caps. [Dashboard query source](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/queries/index.ts)

## 8. Live BQL forms and subprocess invocation

Three note-layer query forms exist:

````markdown
```bql
SELECT account, sum(position)
WHERE account ~ '^Assets'
GROUP BY account
```

`bql:SELECT number(only('USD', convert(sum(position), 'USD'))) WHERE account ~ '^(Assets|Liabilities)'`

`bql-q:net-worth`
````

Fenced `bql` renders CSV as a table or text/Beancount output and can show refresh, copy, and export controls. Direct inline `bql:` and named `bql-q:` display the first data cell. Named queries come from dated `query` directives and are cached for 30 seconds. Empty/header-only inline output renders `0 USD`; that is a UI fallback, not an accounting conclusion. [Fenced processor](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/ui/markdown/BQLCodeBlockProcessor.ts) [Inline processor](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/ui/markdown/InlineBQLProcessor.ts)

The exact BQL process contract is:

```text
<beancountCommand> -q -f <csv|text|beancount> <ledgerPath> <query>
```

The plugin uses an argument array, a 50 MiB output buffer, WSL path conversion when the command contains `wsl`, and `bean-query.exe` for an exact native-Windows `bean-query` command. Any nonempty stderr rejects the query. It removes blank output lines and exact echoed-query lines. [Query runner](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/queryRunner.ts)

In beanquery, `-q` means “do not report ledger validation errors on load.” The plugin linter compensates by running `.errors` in text mode and parsing `filename:line:message`. A file-writing AI must run `.errors` or `bean-check` separately. [Beanquery shell](https://github.com/beancount/beanquery/blob/master/beanquery/shell.py) [Plugin linter](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/lang/beancount-lint.ts)

## 9. BQL language and data surface

Beanquery’s parser supports:

- `SELECT [DISTINCT]` with `FROM`, `WHERE`, `GROUP BY ... HAVING`, `ORDER BY`, `PIVOT BY`, and `LIMIT`;
- arithmetic, Boolean expressions, `IN`, `NOT IN`, regex `~`/`!~`/`?~`, `BETWEEN`, and null tests;
- simple and aggregate functions, attributes, metadata subscripts, and subselects;
- accounting windows `OPEN ON`, `CLOSE [ON]`, and `CLEAR`;
- convenience statements `BALANCES`, `JOURNAL`, and `PRINT`;
- mutable in-session tables through `CREATE TABLE` and `INSERT INTO`.

[Beanquery grammar](https://github.com/beancount/beanquery/blob/master/beanquery/parser/bql.ebnf)

The default table is postings. Explicit virtual tables are `#postings`, `#entries`, `#transactions`, `#prices`, `#balances`, `#notes`, `#events`, `#documents`, `#accounts`, and `#commodities`. Posting columns include transaction identity/date/location, payee/narration, tags/links, posting account and other accounts, number/currency, cost number/currency/date/label, position, price, weight, and running balance. [Beanquery Beancount adapter](https://github.com/beancount/beanquery/blob/master/beanquery/sources/beancount.py)

## 10. Dashboard-equivalent BQL recipes

Replace `USD` with the configured `operatingCurrency` and use unquoted ISO date literals where shown.

**Net worth**

```sql
SELECT round(number(only('USD', convert(sum(position), 'USD'))), 2) AS net_worth
WHERE account ~ '^(Assets|Liabilities)'
```

**Open balance-sheet accounts in operating currency**

```sql
SELECT account,
       number(only('USD', convert(sum(position), 'USD'))) AS operating_currency
WHERE account ~ '^(Assets|Liabilities|Equity)' AND NOT close_date(account)
GROUP BY account
ORDER BY account
```

**Income/expenses for a period**

```sql
SELECT account,
       number(only('USD', convert(sum(position), 'USD'))) AS operating_currency
WHERE account ~ '^(Income|Expenses)'
  AND date >= 2026-08-01 AND date < 2026-09-01
GROUP BY account
ORDER BY account
```

**Recent journal**

```sql
SELECT date, payee, narration, account, position, balance, filename, lineno
ORDER BY date DESC, lineno DESC
LIMIT 2000
```

**Reconciliation slice**

```sql
SELECT date, payee, narration, position, balance, filename, lineno
WHERE account = 'Assets:Bank:Checking' AND date <= 2026-08-31
ORDER BY date, lineno
```

**Holdings by commodity**

```sql
SELECT currency, sum(position) AS units, cost(sum(position)) AS cost
WHERE account ~ '^Assets' AND currency != 'USD'
GROUP BY currency
ORDER BY currency
```

**Prices and source locations**

```sql
SELECT date, currency, amount, filename, lineno
FROM #prices
ORDER BY date DESC
```

These shapes come from the plugin’s query builders and beanquery tables; test a query against the installed beanquery version because function availability is runtime-version dependent. [Plugin query source](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/queries/index.ts)

## 11. File-layer workflow: add an account

1. Read `ledger.beancount`, `accounts.beancount`, and the target transaction partitions. Confirm the account does not already exist under a spelling variant.
2. Choose an open date on or before the earliest intended posting. Use a valid five-root name.
3. Declare allowed currencies only if restriction is intended. For costed investment accounts, choose `STRICT` unless the owner explicitly wants automatic `FIFO`/`LIFO` booking.
4. Stage the candidate `accounts.beancount` and validate the whole main ledger, not the fragment.
5. Re-read the live file and compare its content/hash with the pre-edit version. Abort and merge if Obsidian or the plugin changed it.
6. Back up and atomically replace `accounts.beancount`; re-run validation.

```beancount
2026-08-02 open Assets:Bank:Savings EUR
2026-08-02 open Assets:Broker:AAPL AAPL "STRICT"
```

## 12. File-layer workflow: append a balanced transaction

1. Select `transactions/YYYY.beancount` or `transactions/YYYY/YYYY-MM.beancount` from `fileOrganization` and the transaction date.
2. Deduplicate by stable source ID/link first, then date/payee/amount/account as a secondary check.
3. Verify every account is open and permits the commodity.
4. Build postings using Decimal values. For FX, add `@` or `@@`. For lot reductions, query and select the exact cost/date/label. Omit at most one posting amount.
5. Compute weights by currency; nominal units alone are insufficient.
6. Stage the full ledger with the appended transaction, run `bean-check` and `.errors`, then perform a compare-and-swap atomic replacement.

For uncertain categorization, use an explicit temporary account such as `Expenses:Uncategorized` that is already open. Do not invent an account, price, lot, or balancing amount merely to make validation green.

## 13. Bulk CSV import workflow

Beancount Ledger 2.3.1 has no CSV-import command or source path. Beangulp is the Beancount 3-compatible importer framework; its CSV importer maps date, transaction date/time, payee, multiple narration fields, amount or debit/credit, balance, tag, reference/link, card/account/category, and row currency. [Beangulp README](https://github.com/beancount/beangulp/blob/master/README.rst) [CSV importer](https://github.com/beancount/beangulp/blob/master/beangulp/importers/csv.py)

Use this controlled pipeline:

1. Preserve the original CSV read-only and record encoding, delimiter, timezone/date format, amount sign convention, and statement account.
2. Map columns explicitly; parse dates and Decimal values; normalize currency and payee text without discarding the source row.
3. Create a stable fingerprint from institution, account, date, amount, currency, and source reference. Store it as a Beancount link or metadata and deduplicate against existing entries.
4. Generate staged transactions with the statement account plus a reviewed category or open suspense/uncategorized account. If the CSV carries running balances, use the newest per-currency value to propose next-day balance assertions.
5. Review duplicates, reversals, pending entries, zero values, fees, and foreign-currency rows.
6. Run `bean-check` on the assembled main ledger; then partition entries into the plugin’s year/month files and atomically replace only changed partitions.
7. Re-query imported links, row count, total weight, and closing balance. Archive the source statement outside ledger partitions.

## 14. Reconciliation and price workflows

For reconciliation, run an ordered account query through the statement boundary, compare source IDs and amounts, add missing or corrected transactions, then append one `balance` assertion per currency. Balance assertions check units, not cost basis. A discrepancy is evidence to investigate; `pad` is appropriate for a deliberate opening balance or explicitly accepted unknown difference, not routine error suppression. Pads require a later balance, cannot pad cost-basis holdings, and duplicate pads for one account/commodity are unsupported. [Beancount balance/pad syntax](https://beancount.github.io/docs/beancount_language_syntax/)

Beanprice needs commodity metadata:

```beancount
2000-01-01 commodity AAPL
  price: "USD:yahoo/AAPL"
```

The standalone tool supports `bean-price ledger.beancount` and `bean-price --update ledger.beancount`. The plugin passes only the ledger path, with a 60-second timeout and 20 MiB buffer. It parses stdout lines shaped like `YYYY-MM-DD price SYMBOL AMOUNT CURRENCY`, deduplicates exact lines, and appends new lines to `prices.beancount`; stderr/nonzero status can coexist with usable stdout. Never synthesize a price when a provider fails. [Beanprice README](https://github.com/beancount/beanprice/blob/master/README.md) [Plugin price service](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/services/price.service.ts)

## 15. Troubleshooting and edge-case catalog

| Symptom | Cause | Recovery |
|---|---|---|
| Transaction does not balance | Wrong sign/leg, rounding, or missing FX price/cost | Recompute posting weights by currency; correct data or add valid `@`/`@@`. |
| Unknown or unopened account | Missing open, later open date, invalid/spelled-differently account | Add/correct the dated open; preserve canonical spelling. |
| Currency not allowed | Posting commodity conflicts with open directive’s list | Correct the row or intentionally expand allowed currencies. |
| Malformed date / parse error | Non-ISO or impossible date; broken quotes/token/indentation | Fix the exact `filename:line` emitted by validator. |
| Balance assertion failed | Missing, duplicate, wrong-sign, or wrong-date posting | Reconcile source entries; create separate assertions per currency. |
| Parent balance surprises | Assertion includes subaccounts | Query child accounts and confirm parent is open. |
| Ambiguous lot | Partial `{}` reduction matches multiple lots under `STRICT` | Specify exact cost/date/label or honor declared FIFO/LIFO. |
| Negative cost inventory | Sold more units than the matched lot/inventory | Query lots; correct units/selectors; split sale across exact lots. |
| Pad error | Unused pad, repeated pad, or cost-basis account | Remove/reposition it; use only one intentional cash-account pad before a balance. |
| BQL succeeds on invalid ledger | Plugin runs beanquery with `-q` | Run `.errors` or `bean-check`; do not accept query success as validation. |
| Inline BQL shows `0 USD` | Empty/header-only result fallback | Inspect fenced CSV/text output and the query itself. |
| BQL rejected on stderr | Plugin treats any stderr as fatal | Re-run exact argv; inspect query, command path, ledger errors, and versions. |
| BQL output truncated/slow | Caps, 50 MiB buffer, broad query, conversion work | Add WHERE/GROUP/LIMIT, use explicit table, or raise documented caps deliberately. |
| No price saved | Missing `price:` metadata, provider/network issue, timeout, duplicate line | Test beanprice directly; inspect output; fix metadata/provider; never invent values. |
| Price duplicated semantically | Plugin deduplicates exact lines only | Normalize and review same-day/base/quote data before appending. |
| Wrong transaction partition | File organization changed or date routed incorrectly | Move the complete directive to the correct year/month file and validate includes. |
| Lost concurrent edit | AI overwrote an Obsidian/plugin mutation | Re-read/hash before replacement; abort and three-way merge on mismatch. |
| Stale named query | Inline name cache lasts 30 seconds | Refresh/wait or use direct fenced BQL for immediate verification. |

`bean-check` is quiet on success and prints filename, line, and error description to stderr on failure. Fix all errors before trusting reports. [Validation guide](https://beancount.github.io/docs/getting_started_with_beancount/) [Command-line validation](https://beancount.github.io/docs/running_beancount_and_generating_reports/)

## 16. AI usage recipes and safety contract

**Answer “What is my net worth?”** Read `operatingCurrency`, run the dashboard-equivalent Assets/Liabilities conversion query, run `.errors`, and report the query’s as-of context and any missing prices. Do not repeat the inline `0 USD` fallback as fact.

**Record a purchase.** Resolve the account from existing opens, deduplicate the source reference, write an expense and funding leg in one currency, validate the staged main ledger, and atomically update the correct transaction partition.

**Record an FX transfer.** Preserve both currencies and the actual rate/total with `@`/`@@`; verify weights cancel in the quote currency. Do not force both postings into the operating currency.

**Record a security sale.** Query holdings/lots, match the owner’s booking method, write exact cost-lot selectors and sale price, leave a gains leg for interpolation only when Beancount can infer it unambiguously, and validate for negative or ambiguous inventory.

**Reconcile a statement.** Match stable IDs before fuzzy matching, add/correct transactions, then add per-currency balances. Treat a failed assertion as a diagnostic, not a prompt to pad.

**Refresh valuations.** Confirm commodity `price:` metadata and configured `beanPriceCommand`, run beanprice, inspect parsed output, append only verified price directives, then re-run net worth and disclose stale/missing symbols.

**Write discipline.** Read before edit; constrain changes to plugin-owned ledger/config paths; back up; stage the complete include graph; validate; compare the live file with the read version; atomically replace; validate again; retain source IDs and an audit diff. The plugin stores sensitive financial data and can execute configured local commands, so never place secrets in BQL, command strings, ledger metadata, or logs.

## Eliminated Alternatives

| Approach | Reason eliminated | Evidence | Iteration(s) |
|---|---|---|---:|
| Treat `obsidian-flat-financing` as the target | It is a different plugin with a different repository and contract. | Registry and manifest identity | 1 |
| Read a tracked tag-level `main.js` | The bundle is a Release asset and is absent from the 2.3.1 Git tree; direct asset retrieval was unavailable. | GitHub Contents 404 and release cache misses | 1–2 |
| Use plugin-native bulk CSV import | No registered command or service implements it. | Tag source command/service inspection | 1–2 |
| Treat successful ordinary BQL as validation | The plugin invokes beanquery with `-q`, suppressing load-error reporting. | `queryRunner.ts`, beanquery shell, plugin `.errors` linter | 2 |
| Use routine `pad` directives for reconciliation | Pads can conceal missing entries, require a later balance, and cannot pad cost-basis positions. | Beancount language manual | 2 |

## Divergence Map

| Question | Plugin source | Beancount/beanquery source | Resolution |
|---|---|---|---|
| Validation | UI says inline “bean-check” diagnostics | Implementation runs beanquery `.errors`; ordinary query uses `-q` | Treat `.errors`/`bean-check` as separate required gates. |
| `main.js` provenance | Release artifact expected by Obsidian | File absent from tagged Git tree | Cite exact tag TS; do not claim bundle line verification. |
| CSV import | No plugin command/service | Beangulp supports Beancount 3 and CSV extraction | External staged workflow only. |
| Prices | Plugin invokes ledger-only command and appends parsed lines | Beanprice also supports `--update` and provider metadata | Plugin fetch is latest/default behavior, not full historical update. |

## Open Questions

- Whether the published 2.3.1 release asset is byte-for-byte produced from tag 2.3.1 was not independently confirmed because the release asset could not be retrieved.
- Exact beanquery and beanprice runtime versions depend on the user’s Python environment; the plugin stores executable commands, not dependency versions.
- Institution-specific statement cutoff conventions and CSV sign/date formats must be established per import source.

## Convergence Report

- Stop reason: `max-iterations` at exactly 2 iterations, as configured. Early convergence was not used to synthesize.
- Total iterations: 2.
- Questions answered: 5/5 scoped research questions; three environment-specific questions remain explicitly bounded above.
- Remaining questions: release-bundle identity, installed Python package versions, and institution-specific statement conventions.
- New-information ratios: 0.86, 0.68; average 0.77.
- Convergence threshold: 0.05; the `max-iterations` policy took precedence.
- Last two summaries: iteration 1 resolved plugin-owned state/commands/files/subprocesses; iteration 2 resolved language semantics/workflows/failures.
- Divergence summary: two irrelevant/unsafe routes were saturated (unrelated plugin and BQL-as-validation); no pivot failed; no scoped research frontier remains.
- Source diversity: exact plugin tag source, Obsidian registry, Beancount manuals, beanquery grammar/implementation, beanprice, and beangulp.
- Quality guards: focus alignment passed; no resolved load-bearing claim relies solely on a weak secondary source; bundle provenance is labeled as unverified rather than inferred.
- Verification: both iteration narrative/delta pairs passed the deep-research iteration verifier.

## Primary References

- [Beancount Ledger 2.3.1 tagged source](https://github.com/mkshp-dev/obsidian-finance-plugin/tree/2.3.1)
- [Beancount language syntax](https://beancount.github.io/docs/beancount_language_syntax/)
- [Beancount validation guide](https://beancount.github.io/docs/getting_started_with_beancount/)
- [Beanquery grammar](https://github.com/beancount/beanquery/blob/master/beanquery/parser/bql.ebnf)
- [Beanquery Beancount adapter](https://github.com/beancount/beanquery/blob/master/beanquery/sources/beancount.py)
- [Beanprice README](https://github.com/beancount/beanprice/blob/master/README.md)
- [Beangulp README](https://github.com/beancount/beangulp/blob/master/README.rst)
