# Beancount Ledger 2.3.1 — verified file-layer knowledge base

## Research status

This is the canonical synthesis for lineage `luna`, produced after five research iterations with `stopPolicy: max-iterations`. The target is the Obsidian community plugin `beancount-finance`, published as **Beancount Ledger**, author `mkshp`, version `2.3.1`, repository `mkshp-dev/obsidian-finance-plugin`.

The accounting source of truth is the vault's included Beancount text. The plugin supplies Obsidian views, text writers, BQL execution, and price-fetch plumbing around that source. `.obsidian/plugins/beancount-finance/data.json` is configuration/state for the plugin; it is not the ledger database.

### Verification boundary

- Plugin behavior was checked against the tagged `2.3.1` TypeScript source tree, especially `main.ts`, `settings.ts`, `structuredLayout.ts`, directive writers, query/price services, controllers, and the editor linter.
- The request called for the compiled `main.js`. A repository-root `main.js` and the tested release-download URL were not available at the inspected `2.3.1` ref. The exact source modules are therefore the verified evidence for the contract; the compiled artifact is a reconstruction gap, not an assumption.
- Beancount syntax/inventory behavior was checked against the official language, inventory, trading, getting-started, and command-line documentation. Current v3 packaging was checked in `pyproject.toml`.
- Current BQL grammar/source behavior was checked against beanquery's parser grammar, shell, source adapter, environment, and execution tests. Some prose in the older BQL manual describes an earlier tool generation; current grammar claims below use the current source where they differ.
- Practical AI workflows are marked `[INFERENCE: ...]` when they combine verified plugin routing with an operational step not implemented as a dedicated plugin feature.

## 1. Operating model

The reliable architecture is:

```text
vault Beancount files
        │
        ├── bean-check  → parser + lifecycle + balancing + inventory validation
        ├── bean-query  → BQL tables, inventories, errors, CSV/text output
        └── bean-price  → price directives on stdout
                │
        Obsidian plugin
        ├── dashboard/controllers
        ├── transaction/directive writers
        ├── live BQL markdown processors
        ├── editor lint/autocomplete/formatting
        └── price filtering + append to prices.beancount
```

The plugin does not maintain a second accounting database. A write can succeed at the Vault API layer while the resulting included ledger is invalid, invisible, or semantically wrong. Every mutation should therefore end with both `bean-check` and a small BQL readback.

[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/README.md]  
[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/main.ts]  
[SOURCE: https://github.com/beancount/beancount/blob/master/pyproject.toml]

## 2. Plugin settings and persisted state

`main.ts` loads `data.json`, merges it over `DEFAULT_SETTINGS`, migrates legacy currency keys where present, and saves the settings object back through Obsidian's plugin data API. The exact tagged source schema is:

| Key | Default | Meaning at the file layer |
|---|---:|---|
| `beancountCommand` | `""` | Executable used for `bean-query`/Beancount operations; the plugin probes it with `--version` and `--help`. |
| `operatingCurrency` | `"USD"` | Reporting/conversion currency; saving it also updates Beancount's `option operating_currency`. |
| `maxTransactionResults` | `2000` | Transaction view result cap; settings validation allows `1..10000`. |
| `maxJournalResults` | `1000` | Journal result cap; settings validation allows `1..5000`. |
| `dashboardDefaultPeriod` | `"this-month"` | Initial dashboard period selection. |
| `bqlShowTools` | `true` | Show BQL block tools. |
| `bqlShowQuery` | `false` | Show the generated/displayed query in BQL UI. |
| `debugMode` | `false` | Enable diagnostic logging. |
| `createBackups` | `true` | Create backups before plugin-managed writes. |
| `maxBackupFiles` | `10` | Retained backup cap; settings validation allows `0..1000`. |
| `structuredFolderName` | `"Finances"` | Root folder for generated ledger files. |
| `fileOrganization` | `"yearly"` | Transaction routing: yearly file or monthly subdirectory/file. |
| `autoPriceFetch` | `false` | Enable scheduled price fetch. |
| `priceFetchIntervalHours` | `24` | Automatic price interval; must be positive. |
| `lastAutoPriceFetch` | `0` | Timestamp/state used to throttle automatic price fetch. |
| `beanPriceCommand` | `""` | Executable used for `bean-price`. |
| `accountAutocomplete` | `true` | Enable account completion in the Beancount editor. |
| `enableUserSnippets` | `false` | Enable vault user snippets in completion. |
| `formatOnSave` | `false` | Run the Beancount formatter when the editor saves. |
| `lintMode` | `"on-save"` | `"off"`, `"on-save"`, or `"on-change"` editor lint mode. |
| `onboardingCompleted` | `false` | Onboarding completion flag. |

The settings UI enforces positive result/interval values and caps large limits. `operatingCurrency` is a reporting choice; it does not change posting weights, lot matching, or ledger semantics. `lastAutoPriceFetch` is plugin state, unlike balances/prices/postings, which are text-ledger state.

Legacy `reportingCurrency` and `defaultCurrency` values are migrated into the current operating-currency setting when encountered. Treat unknown keys as forward-compatibility state, not as accounting directives.

[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/settings.ts]  
[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/main.ts]

### Registered commands

| Command id | User-facing purpose |
|---|---|
| `add-beancount-transaction` | Open the unified transaction entry modal. |
| `open-beancount-unified-dashboard` | Open the dashboard view. |
| `open-beancount-snapshot` | Open a snapshot/report view. |
| `run-beancount-onboarding` | Run onboarding/setup. |
| `format-beancount-document` | Format the active Beancount document. |
| `fetch-commodity-prices` | Run the configured price-fetch path. |
| `open-beancount-snippets` | Open/create snippet workflows. |

The plugin also registers `.beancount` and `.bean` file views and a fenced `bql` plus inline BQL Markdown processor.

[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/main.ts]

## 3. Structured vault file graph

With the default root `Finances`, the structured layout contains:

| Canonical path | Primary directives/data |
|---|---|
| `Finances/ledger.beancount` | Root file and include graph. |
| `Finances/accounts.beancount` | `open`, `close`. |
| `Finances/commodities.beancount` | `commodity` declarations and metadata. |
| `Finances/prices.beancount` | `price` directives; bean-price output is appended here. |
| `Finances/pads.beancount` | `pad` directives. |
| `Finances/balances.beancount` | `balance` assertions. |
| `Finances/queries.beancount` | Named `query` directives. |
| `Finances/notes.beancount` | `note` directives. |
| `Finances/events.beancount` | `event`/indicator directives. |
| `Finances/transactions/YYYY.beancount` | Transactions when `fileOrganization = yearly`. |
| `Finances/transactions/YYYY/YYYY-MM.beancount` | Transactions when `fileOrganization = monthly`. |
| `Finances/snippets.beancount` | Reusable snippets; inert unless included or explicitly loaded by a snippet workflow. |

The generated root includes the target files in an organizational order beginning with commodities/accounts/prices/pads/balances/queries/notes/events/transactions. Beancount still parses directives chronologically, so include order is reachability/organization, not a way to bypass dates.

`getTargetFile()` routes by directive kind. The AI should use the same mapping, create missing target files, and verify the root include graph after changing layout settings. Changing `structuredFolderName` or yearly/monthly mode does not itself migrate existing files.

[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/structuredLayout.ts]  
[SOURCE: https://beancount.github.io/docs/beancount_language_syntax/]

## 4. Exact Beancount data model

### Common rules

Directives begin with `YYYY-MM-DD <type>`. Beancount parses and sorts them chronologically; non-transaction directives apply at the beginning of their date. Account names are colon-separated and rooted in `Assets`, `Liabilities`, `Equity`, `Income`, or `Expenses`. Currencies are uppercase identifiers; dates are ISO `YYYY-MM-DD`.

[SOURCE: https://beancount.github.io/docs/beancount_language_syntax/]  
[SOURCE: https://beancount.github.io/docs/getting_started_with_beancount/]

### `open` and `close`

```beancount
2000-01-01 open Assets:Bank:Checking USD
2000-01-01 open Income:Salary
2000-01-01 open Assets:Brokerage "FIFO"
2026-12-31 close Assets:Bank:Checking
```

The grammar is `date open Account [ConstraintCurrency,...] ["BookingMethod"]`. Currency constraints reject postings in other currencies. Booking methods such as `STRICT`, `FIFO`, and `LIFO` affect cost-lot reductions. The open date must precede every posting to the account. A close date rejects later postings but does not assert zero balance. Parent accounts used in assertions and queries must themselves be opened.

The plugin's account writer appends open/close text to `accounts.beancount`; it does not rewrite an existing declaration or validate all historical postings.

[SOURCE: https://beancount.github.io/docs/beancount_language_syntax/]  
[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/accountDirectives.ts]

### Transactions and postings

```beancount
2026-08-02 * "Grocery Store" "Weekly food" #groceries ^bank-20260802
  Expenses:Food:Groceries       85.42 USD
  Assets:Bank:Checking          -85.42 USD
```

The header supports a flag, optional payee/narration, tags, links, and metadata. Postings use:

```text
Account Amount [Cost] [@ Price]
```

At most one posting amount may be elided for interpolation. A transaction balances by **posting weight**, not by displayed units alone. Amount-only postings contribute their amount/currency. `units @ per-unit-price` contributes units multiplied by the price currency; `@@` expresses a total price. Cost annotations contribute the cost weight, and when cost and price are both present the cost controls balancing while the price is informational/valuation data.

The plugin renderer supports flags, payee/narration, tags/links, transaction metadata, posting comments/metadata, cost `{}`/`{{}}` forms with date/label, and `@`/`@@` prices. The renderer and writer do not run bean-check.

[SOURCE: https://beancount.github.io/docs/beancount_language_syntax/]  
[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/transactionDirectives.ts]

### Multi-currency and cost-basis lots

Multi-currency postings require a common balancing weight. A raw `-400 USD` and `436 CAD` pair does not balance; a conversion such as `-400 USD @ 1.09 CAD` supplies a CAD weight. Use explicit conversions when the source data provides them.

Cost lots use a per-unit cost such as `{790.83 USD}` and can carry a lot date and quoted label. The plugin's model distinguishes per-unit and total cost forms. Acquisitions create lots; reductions match existing commodity/cost/date/label attributes. Under strict booking, a reduction that matches multiple lots ambiguously fails unless it selects the exact intended quantity. FIFO/LIFO can resolve selection where the account is configured that way.

A cost-basis reduction requires sufficient matching units. Negative simple-currency cash is legal; negative cost-basis inventory is normally invalid. Query lot details before selling/transferring a costed commodity.

[SOURCE: https://beancount.github.io/docs/beancount_language_syntax/]  
[SOURCE: https://beancount.github.io/docs/how_inventories_work/]  
[SOURCE: https://beancount.github.io/docs/trading_with_beancount/]

### `balance`

```beancount
2026-08-02 balance Assets:Bank:Checking 1256.35 USD ~ 0.01 USD
```

The assertion checks one commodity at the beginning of the date, in units rather than total cost. Multiple currencies require multiple assertions. Parent-account assertions aggregate descendants, but the parent must be opened. The tolerance is optional and must be appropriate for the commodity/precision.

The plugin writer routes balance assertions to `balances.beancount`; the journal model exposes amount, tolerance, and discrepancy. A discrepancy is evidence to investigate, not an automatic instruction to pad.

[SOURCE: https://beancount.github.io/docs/beancount_language_syntax/]  
[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/balanceDirectives.ts]

### `pad`

```beancount
2026-08-01 pad Assets:Bank:Checking Equity:Opening-Balances
2026-08-02 balance Assets:Bank:Checking 1256.35 USD
```

`pad` has no commodity argument. It inserts a synthetic `P` transaction before a subsequent matching balance assertion. It is unused/error-prone without a later assertion, multiple pads for the same account/commodity are invalid, and padding is not suitable for cost-basis inventory because it cannot infer a lot.

The plugin has a structured `pads.beancount` target but no supported pad creation in the unified transaction modal. Direct file workflow is required.

[SOURCE: https://beancount.github.io/docs/beancount_language_syntax/]  
[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/structuredLayout.ts]  
[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/ui/modals/UnifiedTransactionModal.ts]

### `price` and `commodity`

```beancount
2026-01-01 commodity AAPL
  name: "Apple Inc."
  price: "USD:yahoo/AAPL"

2026-08-02 price AAPL 207.15 USD
```

`commodity` declares a symbol and optional metadata. Duplicate declarations are errors. `price` is a dated base-to-quote rate for conversion/valuation; same-day duplicate resolution follows Beancount's parsed order behavior, so deduplicate deliberately.

The plugin commodity writer validates the symbol, while the price service accepts bean-price output matching its dated-price regex, deduplicates exact existing lines, and appends to `prices.beancount`.

[SOURCE: https://beancount.github.io/docs/beancount_language_syntax/]  
[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/commodityDirectives.ts]  
[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/services/price.service.ts]

### `note`, `include`, and `query`

```beancount
2026-08-02 note Assets:Bank:Checking "Statement reconciled through 2026-08-02"
include "accounts.beancount"
2026-01-01 query "monthly-expenses" "SELECT account, sum(position) WHERE account ~ '^Expenses' GROUP BY account"
```

`note` attaches a dated account description. `include` paths are relative to the including file and make generated targets reachable. `query` is an experimental named-query directive in the language reference; the plugin writes named queries to `queries.beancount`, escaping double quotes, and exposes them through `bql-q:<name>` inline execution.

[SOURCE: https://beancount.github.io/docs/beancount_language_syntax/]  
[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/noteDirectives.ts]  
[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/queryDirectives.ts]

## 5. Process boundaries: bean-query, bean-check, and bean-price

### bean-query / BQL invocation

The plugin's `runQuery(plugin, query, filepath?, format = 'csv')` uses the configured `beancountCommand` and invokes:

```text
<beancountCommand> -q -f <format> <ledger-file> <query>
```

The runner uses shell-free spawned arguments, handles Windows `.exe`/`.cmd`/`.bat` details and WSL path conversion, caps output at 50 MiB, rejects stderr/non-zero exit, and removes an exact echoed query before returning output. `-q` means no normal errors, so it is useful for UI queries but not sufficient for diagnosis. The exact command, root path, exit code, stderr, and stdout should be retained when troubleshooting.

The upstream shell accepts `bean-query filename query...` and supports `-q/--no-errors`, `-f/--format`, `-o/--output`, `-m/--numberify`, and version options. The plugin README separately requires installing `beanquery`; there is no separate persisted `beanqueryCommand` setting.

[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/queryRunner.ts]  
[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/execSafe.ts]  
[SOURCE: https://github.com/beancount/beanquery/blob/master/beanquery/shell.py]  
[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/README.md]

### bean-check

Beancount v3's `pyproject.toml` exposes `bean-check = beancount.scripts.check:main`. The official command loads the file, runs configured plugins/validation, prints errors with filename/line/message, and exits nonzero when errors exist. The plugin README lists `bean-check` among its local tools, but the inspected editor implementation uses bean-query `.errors`; no separate v2.3.1 plugin service wrapper was confirmed.

Use direct `bean-check <root-ledger>` after every mutation. Use `.errors` or `SELECT` probes for fast editor feedback, never as the only semantic gate.

[SOURCE: https://github.com/beancount/beancount/blob/master/pyproject.toml]  
[SOURCE: https://beancount.github.io/docs/running_beancount_and_generating_reports/]  
[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/lang/beancount-lint.ts]

### bean-price

The plugin calls:

```text
<beanPriceCommand-or-detected-command> <ledger-path>
```

It does not pass `--update`, `--all`, `--clobber`, source, or worker flags. Upstream `bean-price` derives jobs from active balances and commodity metadata such as `price: "USD:yahoo/AAPL"`, prints Beancount price directives, and normally does not mutate the input file. The plugin applies a dated-price regex, exact-line deduplication, appends accepted lines to `prices.beancount`, and times out after 60 seconds.

`autoPriceFetch`, `priceFetchIntervalHours`, and `lastAutoPriceFetch` control scheduled execution. A successful process with no accepted lines can mean no source metadata, no active commodity, unavailable market data, or output that the plugin's narrow regex ignored.

[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/services/price.service.ts]  
[SOURCE: https://github.com/beancount/beanprice/blob/master/beanprice/price.py]  
[SOURCE: https://github.com/beancount/beanprice/blob/master/README.md]

## 6. BQL surface and dashboard-compatible recipes

### Grammar

Current beanquery grammar supports:

- statements: `SELECT`, `BALANCES`, `JOURNAL`, `PRINT`, `CREATE TABLE`, `INSERT`;
- `SELECT` clauses: `DISTINCT`, `FROM`, `WHERE`, `GROUP BY`, `HAVING`, `ORDER BY`, `PIVOT BY`, `LIMIT`;
- period qualifiers: `OPEN ON`, `CLOSE ON`, `CLEAR`;
- operators: arithmetic, comparisons, `AND`, `OR`, `NOT`, `IN`, `NOT IN`, `IS NULL`, `BETWEEN`, regex `~`, `!~`, `?~`;
- subqueries, aliases, placeholders, date literals, `NULL`, booleans, decimals, strings, and typed inventories;
- `#`-prefixed source names such as `#entries`, `#transactions`, and `#postings`.

The raw source adapter exposes `transactions`, `prices`, `balances`, `notes`, `events`, `documents`, `accounts`, `commodities`, `entries`, and `postings`. Posting columns include date, account, number, currency, cost fields, position, price, weight, cumulative balance, filename, lineno, metadata, and parent `entry`. Entry columns include date/type/id/filename/lineno/flag/payee/narration/description/tags/links/meta/accounts.

Useful environment functions include `units`, `cost`, `convert`, `value`, `getprice`, `number`, `currency`, `only`, `round`, `year`, `month`, `day`, `date_trunc`, `date_add`, `date_diff`, `parse_date`, `root`, `parent`, `leaf`, `grep`, `meta`, `entry_meta`, `open_date`, `close_date`, `has_account`, and aggregates `COUNT`, `SUM`, `FIRST`, `LAST`, `MIN`, `MAX`.

`sum(position)` returns an inventory. The safe scalar pattern is `number(only('USD', convert(sum(position), 'USD')))`, after filtering to a context where the desired conversion is meaningful. Do not call `number()` on an unresolved multi-currency inventory.

[SOURCE: https://github.com/beancount/beanquery/blob/master/beanquery/parser/bql.ebnf]  
[SOURCE: https://github.com/beancount/beanquery/blob/master/beanquery/sources/beancount.py]  
[SOURCE: https://github.com/beancount/beanquery/blob/master/beanquery/query_env.py]  
[SOURCE: https://beancount.github.io/docs/beancount_query_language.html]

### Recipes matching plugin dashboards

The plugin's actual query builders add date/account/operating-currency substitutions. These reduced recipes preserve their semantics; bind dates and currencies as validated literals.

**Net worth in USD**

```sql
SELECT round(number(only('USD', convert(sum(position), 'USD'))), 2) AS net_worth
WHERE account ~ '^(Assets|Liabilities)'
```

Assets and liabilities are combined with their natural signs; do not negate a liability twice. The plugin has separate total-assets, total-liabilities, and total-worth builders.

**Balance sheet by account**

```sql
SELECT
  account,
  number(only('USD', convert(sum(position), 'USD'))) AS operating_value
FROM #postings
WHERE account ~ '^(Assets|Liabilities|Equity)'
  AND NOT close_date(account)
GROUP BY account
ORDER BY account
```

For securities/currencies that cannot convert, add raw units/other-currency columns rather than interpreting a missing operating value as zero.

**Period expenses or income**

```sql
SELECT account, sum(position) AS total
FROM #postings
WHERE account ~ '^Expenses'
  AND date >= 2026-08-01
  AND date < 2026-09-01
GROUP BY account
ORDER BY account
```

Replace `Expenses` with `Income`; the plugin's savings builder combines the period results.

**Holdings by commodity**

```sql
SELECT
  currency,
  units(sum(position)) AS units_held,
  convert(sum(position), 'USD') AS value_usd,
  round(getprice(currency, 'USD'), 2) AS latest_price
FROM #postings
WHERE account ~ '^Assets'
GROUP BY currency
ORDER BY currency
```

Inspect the raw inventory when `getprice()` or `convert()` has no usable price path.

**Cost basis**

```sql
SELECT account, currency, sum(cost(position)) AS cost_basis
FROM #postings
WHERE account ~ '^Assets:Brokerage'
  AND currency != 'USD'
GROUP BY account, currency
ORDER BY account, currency
```

**Transaction register**

```sql
SELECT date, account, position, balance, filename, lineno
FROM #postings
WHERE account ~ '^Assets:Bank:Checking'
ORDER BY date, lineno
LIMIT 200
```

Use `#entries`/`#transactions` for one row per directive/transaction. Raw `#postings` is one row per posting, so group by `id` for transaction-level results.

**Accounts, balances, prices, and include probes**

```sql
SELECT account, open, close FROM #accounts ORDER BY account;
SELECT date, account, amount, tolerance, discrepancy FROM #balances ORDER BY date DESC;
SELECT date, currency, amount FROM #prices ORDER BY date DESC LIMIT 100;
SELECT id, date, type, filename, lineno FROM #entries ORDER BY date DESC, lineno DESC LIMIT 20;
```

**Editor validation**

```text
.errors
```

The plugin runs this in text mode and parses `file:line:message`. For troubleshooting, run without `-q` or run `bean-check` directly to preserve diagnostics.

[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/queries/index.ts]  
[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/journal.ts]  
[SOURCE: https://github.com/beancount/beanquery/blob/master/beanquery/sources/beancount.py]

## 7. UI feature surface

The unified dashboard is view type `beancount-unified-dashboard`. Its controllers cover Overview, Transactions, Balance Sheet, Commodities, and Income Statement; the Journal tab receives the journal store. Refresh reloads all controller queries and the store.

The modal supports adding transactions, balances, account open/close, notes, and named queries. It supports editing/deleting transactions, balances, and notes. Pad creation, bulk CSV import, arbitrary directive metadata, and general cost-lot repair are not complete modal workflows.

The CodeMirror `.beancount`/`.bean` view provides syntax, indent, completion, snippets, format-on-save, and lint. The linter runs bean-query `.errors`, not a separate full bean-check. `formatOnSave` may change layout; inspect the diff before treating it as a no-op.

Snippets live at `<structuredFolderName>/snippets.beancount`; they are reusable text and are not ledger state unless included/loaded.

[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/ui/views/dashboard/unified-dashboard-view.ts]  
[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/ui/modals/UnifiedTransactionModal.ts]  
[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/ui/views/beancount-file-view.ts]  
[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/lang/beancount-lint.ts]

## 8. File-layer AI workflows

### Universal preflight

1. Read `data.json` for executable/root/layout settings, but treat vault text as accounting state.
2. Read `ledger.beancount` and resolve every include relative to its parent.
3. Query `#accounts`, relevant `#balances`, `#prices`, and postings/lots.
4. Confirm account open/close dates, currency constraints, booking policy, and target route.
5. Create a backup or external snapshot before mutation.
6. Write one complete directive/block to the canonical target.
7. Verify the include graph and rerun `bean-check` on the root ledger.
8. Run a narrow BQL readback by date/id/filename/lineno; then refresh the dashboard.

### Add an account

```text
Read: ledger.beancount, #accounts, existing parent accounts.
Write: accounts.beancount.
Text: 2026-08-02 open Assets:Bank:Checking USD
Verify: bean-check; SELECT account, open FROM #accounts WHERE account = 'Assets:Bank:Checking'.
```

If the account starts with a nonzero historical balance, do not silently add a pad. Decide whether the source is an opening transaction, a simple-currency pad before a balance assertion, or a real historical import.

[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/accountDirectives.ts]  
[INFERENCE: https://beancount.github.io/docs/getting_started_with_beancount/]

### Append a balanced transaction

Read open/close state and current lots first. Calculate posting weights per currency. Emit explicit amounts when the source data is known:

```beancount
2026-08-02 * "Grocery Store" "Weekly food" #import ^bank-20260802
  Expenses:Food:Groceries       85.42 USD
  Assets:Bank:Checking          -85.42 USD
```

Route to `transactions/2026.beancount` or `transactions/2026/2026-08.beancount` according to `fileOrganization`, back up, ensure inclusion, run `bean-check`, then read back:

```sql
SELECT id, date, narration, filename, lineno
FROM #entries
WHERE date = 2026-08-02 AND narration = 'Weekly food'
ORDER BY lineno DESC
LIMIT 10
```

For a costed sale, query and select the actual lot before writing. Do not balance the sale at market price when Beancount's cost weight controls the transaction.

[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/transactionDirectives.ts]  
[SOURCE: https://beancount.github.io/docs/beancount_language_syntax/]

### Add a balance assertion / pad

Use `balances.beancount` for a known unit assertion. Include one assertion per commodity. If the account has a simple currency balance and the discrepancy is a deliberate opening adjustment, put a `pad` in `pads.beancount` before the assertion and identify the equity source. Never use pad to fabricate a cost basis.

```sql
SELECT date, account, amount, tolerance, discrepancy
FROM #balances
WHERE account = 'Assets:Bank:Checking'
ORDER BY date DESC
LIMIT 20
```

[SOURCE: https://beancount.github.io/docs/beancount_language_syntax/]  
[INFERENCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/structuredLayout.ts]

### Named BQL query

Check for a name collision, escape embedded quotes, write a `query` directive to `queries.beancount`, ensure it is included, then run the named query through `bql-q:<name>` or direct bean-query. The query definition is text; the result is not stored in `data.json`.

### Price fetch

1. Read `commodity` metadata and confirm the `price` source is supported.
2. Run the configured `bean-price` path against the root ledger.
3. Capture raw stdout/stderr and exit status.
4. Inspect accepted lines in `prices.beancount`.
5. Query `#prices` and compare price dates with `getprice()` output.

Do not infer that “no new line” means a zero price or a failure until source metadata, active balances, market availability, and the plugin's output regex have been checked.

### Bulk CSV import

There is no verified first-class bulk importer in v2.3.1. The safe AI recipe is:

1. Keep the original CSV unchanged and record its hash/name/date range outside the ledger or in import metadata.
2. Define columns: date, payee/description, amount/change, currency, bank account, and optional source id.
3. Normalize dates to ISO and reject rows with invalid dates or ambiguous signs.
4. Map every source row to two or more explicit postings; never rely on an inferred amount when the import knows the amount.
5. Preserve a stable link/tag such as `^bank-20260802-001` or `#import:bank-202608`.
6. Group output into the canonical yearly/monthly transaction files.
7. Back up, append, and run `bean-check` after each bounded batch.
8. Reconcile running balances against the bank's statement balance; investigate duplicates, missing opening balances, fees, and sign inversions.
9. Add balance assertions only after the transaction population is correct.

[INFERENCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/csvParsers.ts]  
[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/structuredLayout.ts]

### Reconciliation

Use the external statement's ending date and balance as an assertion target. Query the latest ledger balance and posting register. Difference alone does not identify the cause: check account lifecycle, currencies, duplicate imported rows, opening balance, pending transactions, and date inclusivity. For investments, reconcile units and lots before market value.

[SOURCE: https://beancount.github.io/docs/getting_started_with_beancount/]  
[SOURCE: https://beancount.github.io/docs/how_inventories_work/]

## 9. Error and edge-case catalog

| Layer | Typical symptom | Diagnosis | Recovery |
|---|---|---|---|
| Parser/date | malformed date or directive | ISO/date/indentation/quote/cost syntax | fix named source line; rerun `bean-check` |
| Currency syntax | currency rejected | lowercase/invalid symbol or unsupported constraint | normalize uppercase and inspect `open` constraint |
| Account lifecycle | posting rejected | account/parent unopened or closed; date out of range | query `#accounts`, correct lifecycle or route |
| Transaction balance | “Transaction does not balance” | weights differ by currency; wrong `@`/`@@`; missing posting | calculate weights and add/correct explicit leg |
| Inferred posting | surprising balance | one elided amount hides source/classification error | emit explicit amounts during AI import |
| Balance assertion | discrepancy | wrong date/commodity/units/tolerance | compare register and assertion; fix data or deliberately pad simple currency |
| Pad | unused/multiple/cost-basis error | no matching later assertion, repeated pad, or lot-backed holding | remove/relocate pad or record real transaction/lots |
| Cost lot | ambiguous/insufficient/negative inventory | wrong cost/date/label/booking or quantity | inspect `cost(position)` and lot columns; select exact lot |
| Include graph | query returns no new data | target file not included or relative path wrong | repair root includes, probe `filename` |
| BQL | compile error/no rows | invalid grammar, wrong source/row grain/filter | reduce to small explicit `SELECT`, `FROM #...`, `LIMIT` |
| Process | missing command/timeout/stderr/cap | executable setting, WSL path, package, output size | probe command, capture `SpawnError`, narrow query |
| Price | no accepted prices | no metadata/market/source, timeout, regex reject, stale data | inspect raw bean-price output and `#prices` |
| Mutation | wrong block/duplicate | stale filename/lineno, concurrent edit, no backup | restore; re-query location immediately before edit |
| CSV | empty/zero/shifted fields | header skip, relaxed columns, malformed quotes, unconvertible currency | preserve raw CSV; validate schema and reject silent defaults |
| UI lint | no squiggles | `.errors` unavailable, no command/root, skipped exception | run direct `bean-check`; inspect command/path |

Important distinctions:

- A negative simple-currency balance can be valid; negative cost-basis inventory is a different failure.
- A USD balance assertion can pass while EUR, securities, or cost lots remain wrong.
- `sum(position)` is an inventory; a converted scalar requires an explicit currency selection.
- `-q` suppresses normal query errors; use raw output/direct `bean-check` while diagnosing.
- A price row may exist but be stale; inspect date and conversion path together.
- A writer success response proves text I/O only, not semantic ledger validity.

[SOURCE: https://beancount.github.io/docs/beancount_language_syntax/]  
[SOURCE: https://beancount.github.io/docs/how_inventories_work/]  
[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/queryRunner.ts]  
[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/csvParsers.ts]

## 10. Source map and evidence gaps

### Primary plugin source

- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/main.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/settings.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/structuredLayout.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/queryRunner.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/execSafe.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/queries/index.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/journal.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/services/journal.service.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/services/price.service.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/csvParsers.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/accountDirectives.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/transactionDirectives.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/balanceDirectives.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/commodityDirectives.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/noteDirectives.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/queryDirectives.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/ui/modals/UnifiedTransactionModal.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/ui/views/dashboard/unified-dashboard-view.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/ui/views/beancount-file-view.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/lang/beancount-lint.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/README.md]
- [SOURCE: https://mkshp-dev.github.io/obsidian-finance-plugin/]

### Upstream tools and docs

- [SOURCE: https://beancount.github.io/docs/beancount_language_syntax/]
- [SOURCE: https://beancount.github.io/docs/how_inventories_work/]
- [SOURCE: https://beancount.github.io/docs/trading_with_beancount/]
- [SOURCE: https://beancount.github.io/docs/getting_started_with_beancount/]
- [SOURCE: https://beancount.github.io/docs/running_beancount_and_generating_reports/]
- [SOURCE: https://beancount.github.io/docs/beancount_query_language.html]
- [SOURCE: https://github.com/beancount/beancount/blob/master/pyproject.toml]
- [SOURCE: https://github.com/beancount/beanquery/blob/master/beanquery/parser/bql.ebnf]
- [SOURCE: https://github.com/beancount/beanquery/blob/master/beanquery/shell.py]
- [SOURCE: https://github.com/beancount/beanquery/blob/master/beanquery/sources/beancount.py]
- [SOURCE: https://github.com/beancount/beanquery/blob/master/beanquery/query_env.py]
- [SOURCE: https://github.com/beancount/beanquery/blob/master/beanquery/query_execute_test.py]
- [SOURCE: https://github.com/beancount/beanprice/blob/master/README.md]
- [SOURCE: https://github.com/beancount/beanprice/blob/master/beanprice/price.py]

### Known evidence gaps and version drift

1. The compiled repository-root `main.js` at the requested `2.3.1` ref was not available through the repository/file or release-download paths checked. The source tree is authoritative for the claims in this artifact; compiled-output-specific behavior remains unverified.
2. The official “Running Beancount” page contains v2-era tooling notes. The current v3 `bean-check` entry point was verified from `pyproject.toml`; exact error wording can vary with Beancount version.
3. beanquery's current `master` grammar is newer than some prose in the older BQL manual. Use the installed beanquery version's grammar/help for edge syntax, while the plugin's query builders are pinned by the 2.3.1 source.
4. The plugin README describes `bean-check` capability, but the inspected source's editor validation path is `.errors`; the exact internal v2.3.1 bean-check service wrapper was not found. Direct invocation is the safe operational gate.

## 11. Final operating checklist

Before a write:

- [ ] Read `data.json` executable/root/layout settings.
- [ ] Read the root ledger and resolve all includes.
- [ ] Query account lifecycle, currencies, balances, prices, and lots.
- [ ] Choose canonical target file from structured routing.
- [ ] Back up before mutation.
- [ ] Write explicit, balanced text with stable tags/links when importing.
- [ ] Run `bean-check` on the same root passed to bean-query.
- [ ] Run a narrow BQL readback and inspect filename/lineno/date/id.
- [ ] Refresh/reopen UI only after text and validation agree.

For diagnosis, retain the raw CSV/input, exact query, command arguments, root path, exit code, stderr, stdout, and before/after file diff. That evidence distinguishes a real zero from a missing include, skipped lint, failed conversion, permissive parser default, or hidden process error.
