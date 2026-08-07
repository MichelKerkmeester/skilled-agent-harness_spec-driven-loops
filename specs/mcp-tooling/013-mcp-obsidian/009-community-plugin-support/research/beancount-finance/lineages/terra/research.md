# Beancount Ledger v2.3.1 — verified file-layer knowledge base

## Scope, confidence, and source boundary

This is a source-backed operating model for the Obsidian community plugin Beancount Ledger:

- plugin id: beancount-finance
- name: Beancount Ledger
- author: mkshp
- version: 2.3.1
- desktop-only; minimum Obsidian version 1.7.2

The ledger remains plain Beancount text inside the vault. The plugin supplies editors, live BQL presentation, dashboards, and external-tool integration; it does not replace the ledger with a database.

One source caveat matters. The public repository exposes TypeScript source and a release build process. The tracked reviewed entry point is src/main.ts, which is the source that builds the installed main.js bundle. A tracked built main.js was not available at the examined revision, so this report does not claim byte-level inspection of a local release artifact. The behavior below is confirmed when a source module or primary documentation is cited; the AI workflow sections are recommendations derived from those facts.

[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/manifest.json]
[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/main.ts]
[SOURCE: https://beancount.github.io/docs/index.html]

## 1. Operating model and file boundary

### What is canonical

Canonical accounting data is the main Beancount ledger and the files it includes. The plugin resolves those files inside the Obsidian vault, reads and writes them through the Obsidian Vault API, and runs configured local accounting executables against the resolved main ledger.

The plugin’s own persistent state is a shallow JSON object at:

    .obsidian/plugins/beancount-finance/data.json

This JSON config is not ledger state. Do not infer balances, accounts, transactions, market prices, or reconciliation status from it.

### What the plugin contributes

- editor/view support for .beancount and .bean files
- transaction, balance, account open/close, note, and query entry paths
- a unified dashboard, snapshot, transaction views, balance sheet, income statement, and net-worth/history views
- fenced and inline BQL results in Markdown notes
- external BeanQuery and bean-price integration
- optional automated price refresh, backups, snippets, formatting, lint mode, and account autocomplete

### File-layer AI boundary

An AI operating only at the file layer should:

1. locate the configured main ledger and resolve every include before editing;
2. read existing account, currency, commodity, metadata, and file-layout conventions;
3. write only a designated included journal or generated staging file;
4. validate with a parser/check command and targeted BQL queries before and after mutation;
5. preserve a rollback copy or use the plugin backup feature where available.

The plugin’s use of atomic vault writes and optional backups is helpful, but it is not a substitute for ledger validation. The reviewed transaction writer does not establish a local balanced-entry or bean-check gate before appending text.

[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/utils/directives/transactionDirectives.ts]

## 2. Exact persisted data.json schema

Settings are loaded by taking DEFAULT_SETTINGS and shallow-merging raw saved data over it. A partial data.json therefore inherits every omitted default. Two legacy keys, reportingCurrency and defaultCurrency, are migrated to operatingCurrency. Older data with structuredFolderName but no onboardingCompleted gets that onboarding completion flag migrated as well.

The following are the source-backed persisted settings and defaults:

| Key | Default | Meaning at the file or feature boundary |
| --- | --- | --- |
| beancountCommand | empty string | Command used for BeanQuery / Beancount connection detection and querying. |
| operatingCurrency | USD | Dashboard and valuation currency after legacy migration. |
| maxTransactionResults | 2000 | Result cap used by transaction-oriented views. |
| maxJournalResults | 1000 | Result cap used by journal-oriented views. |
| dashboardDefaultPeriod | this-month | Initial dashboard period. Supported values are this-month, last-month, this-year, last-year. |
| bqlShowTools | true | Shows BQL result controls such as refresh/copy/export. |
| bqlShowQuery | false | Controls source-query visibility in BQL presentation. |
| debugMode | false | Enables plugin debugging behavior. |
| createBackups | true | Enables backup creation for supported mutating operations. |
| maxBackupFiles | 10 | Backup retention count. |
| structuredFolderName | Finances | Root folder name used by the plugin’s structured ledger-related files and snippets. |
| fileOrganization | yearly | Date-based organization policy. Supported values are yearly and monthly. |
| autoPriceFetch | false | Enables scheduled price refresh. |
| priceFetchIntervalHours | 24 | Interval used by automatic price refresh. |
| lastAutoPriceFetch | 0 | Persisted epoch timestamp of the latest automatic price fetch. |
| beanPriceCommand | empty string | Explicit bean-price command; otherwise detection is used. |
| accountAutocomplete | true | Enables account suggestions in transaction entry. |
| enableUserSnippets | false | Enables the snippets-file feature. |
| formatOnSave | false | Enables formatting on save. |
| lintMode | on-save | Lint policy. Supported values are off, on-save, on-change. |
| onboardingCompleted | false | Marks onboarding completion. |

Runtime state is separate. isConnectionReady is set from a connection probe and is not a data.json key. The probe invokes the configured Beancount command with --version, falls back to --help, and uses a short timeout. A successful probe only says the executable answered; it does not prove that every included ledger file parses.

When enableUserSnippets is active, main.ts creates or opens a snippets file under the configured structured folder, using Finances when no folder name is set.

[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/settings.ts]
[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/main.ts]

### Safe data.json handling

Treat the file as owned configuration:

- preserve unknown keys during manual edits because loadSettings accepts saved raw values;
- write valid JSON only and retain a backup before changing command paths;
- use absolute or reliably PATH-resolvable command forms that match the target operating system;
- do not set lastAutoPriceFetch by hand unless intentionally suppressing the scheduler;
- do not place ledger content, credentials, shell fragments, or arbitrary execution strings in data.json.

## 3. Every registered command and full feature surface

| Command id | Display title | Observed effect |
| --- | --- | --- |
| add-beancount-transaction | Add Beancount transaction | Opens unified transaction entry. |
| open-beancount-unified-dashboard | Open Beancount unified dashboard | Opens dashboard surface. |
| open-beancount-snapshot | Open Beancount snapshot | Opens snapshot view. |
| run-beancount-onboarding | Run setup/onboarding | Reopens setup flow. |
| format-beancount-document | Format Beancount document | Formats the current Beancount document. Treat output as non-semantic until revalidated. |
| fetch-commodity-prices | Fetch commodity prices | Invokes the price service and writes extracted price directives. |
| open-beancount-snippets | Open Beancount snippets file | Opens the snippets file for the configured structured folder. |

The plugin also registers two ribbon actions: Add transaction and Open dashboard. It registers .beancount and .bean extensions and a Markdown language processor named bql.

The unified entry surface routes these creation types:

- transaction
- balance
- open
- close
- note
- query

It routes update and delete for transaction, balance, and note. Open and close are not editable in that modal path. Pad is not exposed as a modal create path, even though pad is valid Beancount syntax.

The dashboard query family covers:

- assets, liabilities, and net worth
- balance sheet
- income statement
- income, expenses, and savings for a selected period
- transaction history
- historical net worth by week or month
- commodity list, price information, and asset holdings

[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/main.ts]
[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/ui/modals/UnifiedTransactionModal.ts]
[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/queries/index.ts]

## 4. Exact Beancount ledger data model

### Account hierarchy and lifecycle

Beancount account names start with one of five roots:

- Assets
- Liabilities
- Equity
- Income
- Expenses

Open an account before using it in a transaction. An open directive can constrain accepted currencies:

    2026-01-01 open Assets:Bank:Checking USD, EUR
    2026-01-01 open Expenses:Food:Groceries
    2026-01-01 open Equity:Opening-Balances

An account can later be closed:

    2026-12-31 close Assets:Bank:Checking

An AI should not post to an unopened or closed account. First query or scan existing open directives. If the intended account does not exist, create the open directive in the accounts file designated by the existing include layout, then verify it is reachable from the main ledger.

### Transaction and postings

Each transaction has a date, flag, optional payee/narration, optional tags and links, then one or more indented postings. The sum must balance under Beancount accounting rules.

    2026-08-02 * "Corner Shop" "Groceries" #food ^receipt-001
      Expenses:Food:Groceries  42.50 EUR
      Assets:Bank:Checking   -42.50 EUR

The plugin serializer emits a default flag of *, then selects these header string forms:

- payee plus narration: two quoted strings;
- payee only: payee then an empty narration string;
- narration only: one quoted string;
- neither: an empty quoted string.

It normalizes tags as #tag and links as ^link. Transaction metadata is indented two spaces; posting metadata is indented four spaces. It filters volatile filename and lineno metadata from output. It can append a semicolon comment to a posting.

A missing amount can be inferred by Beancount in some unambiguous cases, but a file-layer AI should generate all legs explicitly unless it has proved the omission is unambiguous. Explicit amounts make balancing and reconciliation auditable.

### Balance assertion

A balance directive asserts a quantity at a date. The plugin writes this form, with optional tolerance:

    2026-08-31 balance Assets:Bank:Checking 1200.00 EUR
    2026-08-31 balance Assets:Broker:Cash 1000.00 USD ~ 0.01 USD

Balance assertions are validation points, not transactions. They do not create money or fix a discrepancy. On failure, find the missing or duplicate postings before adjusting the assertion.

### Price and commodity

A price directive records an exchange or market value:

    2026-08-02 price AAPL 215.00 USD
    2026-08-02 price EUR 1.09 USD

A commodity directive establishes commodity metadata. beanprice uses metadata such as price to select a provider:

    2026-01-01 commodity AAPL
      name: "Apple Inc."
      price: "USD:yahoo/AAPL"

The plugin creates or updates a target price file after bean-price output is collected. It does not turn price metadata into an entry automatically without a successful external price run and a parsed price line.

### Pad

A pad directive tells Beancount which account may be used to pad a failed later balance assertion:

    2026-01-01 pad Assets:Bank:Checking Equity:Opening-Balances
    2026-01-01 balance Assets:Bank:Checking 1000.00 EUR

Use pad for initial balances or explicitly justified adjustments, not to hide unknown reconciliation errors. The plugin UI does not offer a pad creation path; a file-layer workflow may write it only after an accountant-approved decision.

### Note

A note attaches text to an account:

    2026-08-31 note Assets:Bank:Checking "Reconciled to August statement"

The plugin note writer can include tags and links after the quoted comment. Use notes for durable operational facts, not volatile AI run logs.

### Include

Include composes the primary ledger from other files:

    include "accounts/*.beancount"
    include "journal/2026/*.beancount"
    include "prices.beancount"

The main ledger plus all reachable includes must parse as one ledger. A correct-looking entry in an unreferenced file has no accounting effect. Before adding a file, establish a real include path and test the full main ledger.

### Multi-currency postings

Multi-currency transactions must include a valid valuation or balancing relationship. A simple exchange can be expressed with a price annotation:

    2026-08-03 * "Foreign exchange"
      Assets:Cash:EUR   -92.00 EUR
      Assets:Cash:USD   100.00 USD @ 0.92 EUR

The exact representation should follow the vault’s existing convention. Do not mix units, cost, and price annotations arbitrarily. A dashboard conversion also depends on price data at the relevant date; absence of a suitable price can yield an empty/failed conversion rather than a meaningful net-worth value.

### Cost-basis lots

Per-unit cost uses one pair of braces. Total cost uses double braces. Costs can contain a number/currency and optional acquisition date and label:

    2026-08-05 * "Buy shares"
      Assets:Broker:AAPL  5 AAPL {185.00 USD, 2026-08-05, "lot-20260805"}
      Assets:Broker:Cash -925.00 USD

    2026-08-06 * "Allocate total lot cost"
      Assets:Broker:Fund  10 FUND {{1000.00 USD}}
      Assets:Broker:Cash -1000.00 USD

The plugin serializer exposes per-unit versus total cost and supports date-only or label-only cost components. For a sale, read the existing lot syntax and booking policy before emitting a reducing posting. A syntactically valid lot may still select the wrong inventory if the vault uses booking methods or lot labels that the AI has not inspected.

### Plugin-supported directive writers

The inspected source confirms:

- transaction creation, update, and deletion;
- balance assertion creation, update, and deletion;
- note creation, update, and deletion;
- account open and close creation;
- named query directive creation.

The account and query UI routes are source-confirmed, but the ledger remains authoritative. Every direct file mutation should therefore pass an independent parse/check afterward.

[SOURCE: https://beancount.io/docs/Basics/syntax]
[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/utils/directives/transactionDirectives.ts]
[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/utils/directives/balanceDirectives.ts]
[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/utils/directives/noteDirectives.ts]
[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/utils/directives/accountDirectives.ts]

## 5. How the plugin invokes BeanQuery, bean-query, and bean-price

### BQL command path

runQuery requires a configured/resolved main ledger path and beancountCommand. It selects a command name, with Windows special handling for a bare bean-query command and path conversion for WSL cases, then uses an argument array equivalent to:

    bean-query -q -f csv /absolute/path/to/main.beancount "SELECT ..."

The actual argument order is:

    -q
    -f
    format
    main-ledger-path
    query

The supported requested result formats in the plugin source are csv, text, and beancount. The runner uses a 50 MiB maximum buffer, removes an exact echoed query line from stdout, and rejects if stderr is nonempty. That last rule means a query that exits successfully but writes a warning to stderr is still surfaced as an error by the plugin.

SystemDetector tries command candidates including:

- an explicitly found executable;
- bean-query;
- python3 -m beanquery;
- python -m beanquery;
- python3 -m beancount.query;
- python -m beancount.query;
- py -m beancount.query.

For a ledger-aware probe it runs a tiny SELECT TRUE LIMIT 1 check using a CSV output option. Detection tries --version, then --help, before treating a candidate as unavailable.

[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/utils/queryRunner.ts]
[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/utils/SystemDetector.ts]

### Price command path

PriceService resolves beanPriceCommand or detects a command. It runs bean-price against the main ledger using a shell-disabled process wrapper and a 60-second collection timeout. It captures output even when the tool returns nonzero, treats stderr as informational, then searches stdout for simple date-price lines matching:

    YYYY-MM-DD price COMMODITY NUMBER CURRENCY

It exact-deduplicates those lines against the existing target price file and writes only new lines through the vault API. A no-price result is a successful zero-write outcome; it does not invent a price. The plugin parser deliberately has narrow syntax: negative prices, complex numeric formatting, or other valid-but-unmatched forms may not be written by this path.

Price-source validation allows only a restricted identifier pattern, invokes a source test with shell disabled, and applies a ten-second validation timeout. Beanprice documentation shows provider metadata and commands such as:

    bean-price ledger.beancount
    bean-price --update ledger.beancount
    bean-price -e "USD:yahoo/AAPL"

The plugin itself writes captured output to its price target rather than relying on the bean-price --update path.

[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/services/price.service.ts]
[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/utils/validators.ts]
[SOURCE: https://github.com/beancount/beanprice/blob/d3227dc26715d2a963e3f17e5ed35906cc693cd4/README.md]

### Security implications

The inspected query and price code passes command arguments as arrays and uses shell-disabled spawning in the reviewed validator. This lowers risk from values being interpreted as shell syntax. It does not make arbitrary executable paths trustworthy. A file-layer AI should treat data.json command paths as privileged configuration, avoid replacing them without user authority, and never place shell pipelines or credentials in them.

## 6. BQL language surface and plugin presentation

### Language surface

BeanQuery BQL includes:

- SELECT, BALANCES, JOURNAL, PRINT, CREATE TABLE, and INSERT statements;
- SELECT DISTINCT, target lists, and star selection;
- FROM table/subquery forms and account-date options;
- WHERE, GROUP BY, HAVING, ORDER BY with ASC/DESC, PIVOT BY, and LIMIT;
- arithmetic, comparisons, AND/OR/NOT, IN and NOT IN, BETWEEN, NULL checks, regular-expression matching, functions, attributes, and subscripts;
- aggregation subject to grouping rules.

The query shell exposes a ledger filename and optional query; output format and no-errors options; and documents the distinction between filtering directives in FROM versus postings in WHERE. Verify a query against the installed BeanQuery version because function availability evolves independently from the plugin.

[SOURCE: https://github.com/beancount/beanquery/blob/82da652dec21d1fa25829456a114668920256158/beanquery/parser/bql.ebnf]
[SOURCE: https://github.com/beancount/beanquery/blob/c28ab32e39adfed15d8ed4ad2ad2a8d30aa40423/beanquery/shell.py]

### Plugin presentation surface

Fenced Markdown blocks tagged bql run as live queries. The processor can render:

- CSV/table results;
- text results;
- Beancount-formatted results;
- optional refresh, copy, and export controls;
- a collapsed error presentation when the external query fails.

Direct inline query syntax begins with bql: followed by the SELECT expression. Named inline syntax begins with bql-q: followed by the name of a Beancount query directive in queries.beancount. Named query contents are cached for 30 seconds. The renderer displays the first CSV data row or a fallback 0 USD value, and shows an error marker on failure.

[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/ui/markdown/BQLCodeBlockProcessor.ts]
[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/ui/markdown/InlineBQLProcessor.ts]

### Dashboard-matching BQL recipe families

Use the plugin-generated queries as the reference style. Replace OPERATING_CURRENCY, DATE, START_DATE, END_DATE, LIMIT, and filters with valid values from the active vault. Do not assume a missing conversion price equals zero.

| Objective | Source-backed query pattern |
| --- | --- |
| Total assets | Sum positions for accounts matching ^Assets, convert to operating currency at the requested date, select a single converted amount. |
| Total liabilities | Sum positions for ^Liabilities, convert at date, and negate for presentation. |
| Net worth | Combine the asset and liability aggregates. |
| Income / expenses / savings | Restrict date range and account roots. Income is negated for display; savings uses the combined Income and Expenses roots. |
| Balance sheet | Group accounts under Assets, Liabilities, and Equity, excluding closed accounts; select values in convert, cost, or units mode. |
| Income statement | Group accounts under Income and Expenses with the same valuation modes. |
| Transaction history | Select date, payee, narration, position, and balance; order descending by date and line number; apply account/date/payee/tag filters and a result limit. |
| Historical net worth | Select balance-at-date points, convert them, and bucket the series by weekly or monthly interval. |
| Holdings | Group Assets positions by commodity/currency. |
| Prices / commodities | Query commodity metadata and price records, then use those result rows for dashboard panels. |

Representative shapes from the dashboard source include:

    SELECT round(number(only("USD", convert(sum(position), "USD", DATE))), 2)
    WHERE account ~ "^Assets" AND date < DATE

    SELECT account,
           number(only("USD", convert(sum(position), "USD"))) AS operating_currency
    WHERE account ~ "^(Assets|Liabilities|Equity)"
      AND NOT close_date(account)
    GROUP BY account
    ORDER BY account

    SELECT date, payee, narration, position, balance
    ORDER BY date DESC, lineno DESC
    LIMIT LIMIT

Those are templates, not literal copy-paste commands: the dashboard substitutes its current currency, date, filter, and limit values. Keep the account-root regular expressions and grouping behavior aligned with the dashboard when reproducing dashboard totals in a Markdown note.

[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/queries/index.ts]

### Useful file-layer BQL recipes

1. Confirm an account is open before posting. Query accounts under the exact account prefix and inspect open/close dates.
2. List recent entries for reconciliation. Start from the transaction-history query family with a narrow account, statement period, and payee filter.
3. Recompute an operating-currency balance. Match the dashboard conversion/query form, then compare the result with the statement balance. If conversion returns no value, inspect prices rather than treating it as a numeric zero.
4. Review a security lot. Query positions for the commodity and inspect unit, cost, date, and label fields before constructing a sale.
5. Diagnose parse/account errors. Use the plugin ERRORS helper if available and independently run a full ledger checker. The source helper is query-based; do not call it a replacement for a full checker.

## 7. File-layer AI workflows

### Workflow A — preflight and establish a new account

1. Read the main ledger and recursively resolve includes.
2. Search for the intended full account path and its parent convention.
3. Decide allowed currencies from the account’s purpose and existing chart of accounts.
4. Add an open directive to the existing accounts file or a new included accounts file.
5. Run a parser/check against the main ledger.
6. Query/open the dashboard account list to verify the account is reachable.

Example:

    2026-08-01 open Assets:Bank:Travel EUR

Do not create an account in an orphaned file. Do not use a balance directive to fake an account opening.

### Workflow B — append a balanced ordinary transaction

1. Capture source facts: date, payee, narration, amount, currency, source account, destination account, tags, link, and any receipt identifier.
2. Verify both accounts are open for that date and accept the intended commodity/currency.
3. Calculate the signed posting amounts independently. For a same-currency transaction, their sum must be zero.
4. Generate an explicit candidate transaction with both legs.
5. Run a parser/check before append and again after append.
6. Query the account’s recent transactions and resulting balance.

Example:

    2026-08-02 * "Corner Shop" "Groceries" #food ^receipt-001
      Expenses:Food:Groceries  42.50 EUR
      Assets:Bank:Checking   -42.50 EUR

If a receipt was already imported, reuse a deterministic link such as ^receipt-001 to detect duplicates. The plugin supports links in the serializer; the duplicate policy is an AI control, not automatic plugin behavior.

### Workflow C — add a multi-currency transaction

1. Read existing examples for the vault’s chosen currency-conversion and booking convention.
2. Identify the required price or cost annotation and its quote currency.
3. Verify that a price exists where a dashboard conversion will need one.
4. Make both units and valuation explicit.
5. Check the ledger, then query the affected account and price data.

Do not use a direct arithmetic conversion solely because a current market quote exists; a historical transaction needs a dated, auditable valuation. Do not mix a price annotation and an unrelated cost annotation unless the existing ledger uses that exact pattern.

### Workflow D — acquire or sell inventory with a cost-basis lot

1. Query existing lots and booking style for the commodity.
2. For an acquisition, write a per-unit cost with braces or an intentional total cost with double braces.
3. Include acquisition date and label when the ledger convention uses them.
4. For a disposition, identify the specific lot or verified booking mechanism before writing the reducing posting.
5. Run validation and a holdings query before and after.

The plugin can serialize cost pieces; it cannot decide economic lot selection for an AI. Treat any sale without a verified existing lot as a stop condition.

### Workflow E — live BQL note matching dashboard numbers

1. Set operatingCurrency and inspect the dashboard’s current period.
2. Copy the dashboard query family, not a simplified ad hoc sum.
3. Use the same account root, conversion mode, date predicate, and grouping.
4. Run it as a fenced bql block for table output or named query for a compact inline metric.
5. If the result differs from the dashboard, compare query text, operating currency, date, price availability, and result limits.

Inline named query caching lasts 30 seconds. After a file edit, a stale inline display can be a cache artifact; refresh/reopen or wait before concluding the ledger is wrong.

### Workflow F — prices and dashboard valuation

1. Add/verify a commodity directive and provider metadata.
2. Validate the source identifier.
3. Run the plugin price command or bean-price against the main ledger.
4. Inspect the target prices file and count newly written exact price lines.
5. Run a holdings/net-worth BQL query at the needed date.

If the price service returns nonzero but produces valid stdout price directives, the service may still extract and write them. Review the result and source before accepting it. If the output format uses a negative or complex decimal that the plugin regex does not recognize, add a syntactically valid price directive through a controlled ledger edit rather than assuming the fetch worked.

### Workflow G — bulk CSV import

No dedicated CSV importer was established in the reviewed source. Use this controlled file-layer procedure instead:

1. Preserve the source CSV unchanged and record its checksum or immutable copy location.
2. Normalize rows into a staging table with date, external id, payee, narration, amount, currency, account, and import link.
3. Validate dates, decimal syntax, currency symbols, account mappings, and duplicate external ids.
4. Generate a separate included staging journal, never blind-append directly to the primary journal.
5. Generate explicit balanced postings; route unknown mappings to a review account only if the accounting policy permits it.
6. Run the ledger checker and a BQL duplicate query keyed by the deterministic import link.
7. Reconcile totals per statement period before promoting/including the staged journal.

An import is rejected when a row lacks a date, amount, currency, source account, destination account, or reliable duplicate key. Do not auto-pad import differences.

### Workflow H — reconciliation

1. Obtain the statement closing date, balance, currency, and transaction identifiers.
2. Query all journal transactions for the account and exact statement period.
3. Match rows using stable ids/links first, then amount/date/payee with human review for fuzzy matches.
4. Compare ending balance using a balance assertion or dashboard-matching BQL conversion.
5. Investigate unmatched rows rather than changing the balance assertion to fit.
6. Add a note recording the completed reconciliation and supporting statement reference.

Example:

    2026-08-31 balance Assets:Bank:Checking 1200.00 EUR
    2026-08-31 note Assets:Bank:Checking "Reconciled to August 2026 statement"

### Workflow I — update or delete a transaction

The plugin’s source resolves updates/deletes using filename and line number returned by BQL, then replaces/removes the block with backup support. A file-layer AI should not rely on stale line numbers after another process has modified a file. Re-query immediately before mutation, verify the full original block and immutable link, then re-run the parser/check and targeted transaction query after mutation.

## 8. Error and edge-case catalog

| Symptom or risk | Likely cause | How to detect | Safe recovery |
| --- | --- | --- | --- |
| Unbalanced transaction | A missing, wrong-signed, or wrong-currency posting; inference was ambiguous. | Full ledger checker; inspect generated postings. | Recalculate from source amount. Write explicit legs; do not pad an ordinary transaction. |
| Unopened account | Posting date predates open directive or account path does not exist. | Search open/close directives and account query. | Add/correct open directive in an included account file, then validate. |
| Closed account posting | Transaction date is after a close directive. | Inspect account lifecycle and parser error. | Reopen only if accounting policy requires it; otherwise post to the proper successor account. |
| Currency restriction mismatch | An open directive restricts the account to another commodity/currency. | Parse/check and inspect open declaration. | Use a valid account/currency or update policy deliberately; never silently convert. |
| Malformed date | CSV or AI output did not use YYYY-MM-DD or contains an impossible date. | Parse/check before write. | Normalize date with the source document; reject ambiguous locale dates. |
| Malformed quoted string, tag, link, metadata | Unescaped quotes or invalid syntax in generated text. | Parser/check plus source-text review. | Escape/regenerate only the affected field; retain original receipt text separately. |
| Balance assertion fails | Missing, duplicate, or incorrectly dated posting; not necessarily a current-balance problem. | Check error, statement comparison, period BQL. | Trace discrepancy; correct transactions or add authorized pad only for intended opening/adjustment policy. |
| Pad conceals error | Pad used to force a balance without economic explanation. | Look for pad followed by balance and unexplained equity impact. | Remove/review the pad; reconcile source transactions. |
| Missing conversion price | BQL convert or dashboard valuation cannot find a price at the required date. | Query price records; inspect dashboard missing/empty result. | Add/fetch a dated price with verified source; do not substitute today’s price for history. |
| bean-price reports no new prices | Missing commodity price metadata, unsupported source, no market data, or all lines deduplicated. | Inspect commodity directive, service output, target price file. | Fix metadata/source, rerun, or add vetted historical price manually. |
| Valid price output not saved | Price parser only matches simple positive-decimal line shape. | Compare raw stdout with target file. | Normalize and manually add a valid directive after review; do not assume a zero price. |
| Price-source validation timeout | Provider/source test exceeds ten seconds or source id fails restricted syntax. | Validation result/error. | Correct provider id, test tool outside plugin, or choose a supported source. |
| BQL error in Markdown | Bad grammar, missing executable, missing main ledger, warning on stderr, or stale named query. | Plugin error display; direct command run. | Validate query with bean-query, correct config, wait/refresh named query cache. |
| BQL result unexpectedly empty | WHERE filters postings/directives incorrectly, no price, result cap, or wrong date. | Remove filters incrementally; compare dashboard query family. | Restore the source dashboard predicate and inspect inputs. |
| Query output too large | Runner caps buffer at 50 MiB, or dashboard result limit is too high. | Runner failure/output truncation symptom. | Add account/date predicates, aggregation, and LIMIT; do not increase limits blindly. |
| stderr causes plugin query failure | queryRunner rejects nonempty stderr even on a zero exit code. | Run exact command and inspect stderr. | Fix warning/source issue or use an environment/version that emits clean stderr. |
| Wrong lot selected | Sale omitted cost/lot data or vault booking semantics were not inspected. | Holdings/lot query before write; check resulting inventory. | Roll back the transaction, inspect existing lot labels/booking, regenerate explicitly. |
| Total cost versus unit cost mistake | Double braces or single braces were used incorrectly. | Review units and total proceeds; ledger validation may not catch economic intent. | Correct annotation after calculating per-unit and total separately. |
| Include silently ineffective | New journal path is not included from main ledger. | Resolve include graph and full ledger parse. | Add an approved include, then re-run main-ledger validation. |
| Duplicate CSV import | Re-run has no stable id/link gate. | BQL query on external link/id and same amount/date. | Remove duplicate blocks carefully, retain source CSV, implement deterministic import link. |
| Reconciliation discrepancy | Bank timing, fees, missing transfer leg, duplicate, or wrong opening balance. | Period transaction query plus balance assertion. | Investigate each unmatched item; never auto-pad without documented authorization. |
| Edit/delete changes wrong block | BQL filename/line number stale after concurrent edits. | Re-query and compare original block/link immediately before mutation. | Abort, refresh target, then apply block-specific edit with backup. |
| Concurrent vault sync conflict | External sync rewrites a file during AI/plugin mutation. | File version change or unexpected diff. | Stop, merge human-readable ledger text, rerun validation; do not overwrite blindly. |
| Lint setting misunderstood | lintMode controls plugin behavior but does not prove every external checker runs. | Inspect configured lint mode and actual command output. | Run a deliberate full ledger checker as part of the AI workflow. |

## 9. AI-usage recipes

### Recipe 1 — answer “What is my net worth today?”

Read operatingCurrency, locate the main ledger, and use the dashboard net-worth query family. If the value is empty or differs from the dashboard, first compare date, price availability, and account-root filters. Report a qualified result: “Net worth in USD as of DATE, using prices available to the ledger.” Do not silently convert with a web price.

### Recipe 2 — add a receipt-backed expense

Create a deterministic link from the receipt identifier. Validate date and currency, query whether that link already exists, verify accounts are open, construct explicit postings, run a checker, append to the included journal, rerun checker, then query the link and account balance. The link makes retry idempotency visible.

### Recipe 3 — create an investment purchase

Inspect the existing commodity, broker account, cash account, and lot conventions. Add a commodity directive only if absent. Record shares, cash, per-unit cost, acquisition date, and a lot label consistent with nearby entries. Validate, then run holdings and price queries. Stop if the trade currency or intended lot selection is not known.

### Recipe 4 — maintain a weekly finance note

Use fenced BQL blocks for: current account balances, recent transactions, month-to-date expenses, and a net-worth series. Copy the plugin dashboard’s roots and conversion logic. Keep query output reviewable and do not turn query results into handwritten ledger facts.

### Recipe 5 — import a bank CSV safely

Stage, normalize, map, dedupe, generate explicit transaction text, validate, reconcile, then include/promote. Use one imported source file per statement or batch. Preserve raw CSV separately. Reject unmatched accounts/currencies instead of choosing a guessed category.

### Recipe 6 — investigate a bean-check failure

Read the exact error, then narrow to directive class: date/string syntax, account lifecycle, balance, commodity/currency, include, price, or inventory lot. Use BQL to inspect the local context, repair the smallest offending directive, then rerun the full main-ledger check. Do not rewrite unrelated history to silence one error.

## 10. Recommended validation gate

For every semantic mutation, the gate is:

1. full ledger parse/check from the main file;
2. target-specific BQL query before mutation;
3. backup or atomic preimage;
4. minimal write to the intended included file;
5. full ledger parse/check again;
6. target-specific BQL query after mutation;
7. reconciliation or balance assertion when the change affects a statement-controlled account.

The plugin offers an ERRORS query helper in its query module. Treat that as useful diagnostics, not as evidence that a command named bean-check ran. If bean-check is available in the local Beancount toolchain, invoke it explicitly for the full ledger. This distinction prevents a UI convenience from being mistaken for a durable validation guarantee.

[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/queries/index.ts]
[SOURCE: https://beancount.io/docs/Basics/syntax]

## 11. Evidence index

Plugin primary sources:

- https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/manifest.json
- https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/main.ts
- https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/settings.ts
- https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/utils/queryRunner.ts
- https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/utils/SystemDetector.ts
- https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/services/price.service.ts
- https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/utils/directives/transactionDirectives.ts
- https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/utils/directives/balanceDirectives.ts
- https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/utils/directives/noteDirectives.ts
- https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/ui/modals/UnifiedTransactionModal.ts
- https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/ui/markdown/BQLCodeBlockProcessor.ts
- https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/ui/markdown/InlineBQLProcessor.ts
- https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/queries/index.ts

Accounting and tool primary sources:

- https://beancount.io/docs/Basics/syntax
- https://beancount.github.io/docs/index.html
- https://github.com/beancount/beanquery/blob/82da652dec21d1fa25829456a114668920256158/beanquery/parser/bql.ebnf
- https://github.com/beancount/beanquery/blob/c28ab32e39adfed15d8ed4ad2ad2a8d30aa40423/beanquery/shell.py
- https://github.com/beancount/beanprice/blob/d3227dc26715d2a963e3f17e5ed35906cc693cd4/README.md

## Bottom line

Use the plugin as a carefully configured file editor and query front-end over a validated Beancount ledger. Its strengths are live query presentation, directive-oriented UI, dashboard queries, and tool integration. Its limits are equally important: ledger correctness remains the responsibility of the main file, includes, accounting conventions, price history, and explicit validation after every AI-generated mutation.
