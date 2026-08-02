---
title: "Beancount Ledger File-Layer Workflows"
description: "Validated terminal recipes for editing a Beancount Ledger vault, querying it with bean-query, fetching prices with bean-price, importing entries, reconciling balances, and checking the result with bean-check."
trigger_phrases:
  - "beancount file layer workflow"
  - "add beancount account"
  - "append balanced beancount transaction"
  - "bean-query dashboard query"
  - "bean-check ledger validation"
  - "beancount reconciliation workflow"
importance_tier: "normal"
contextType: "implementation"
version: 1.0.0.0
---

# Beancount Ledger File-Layer Workflows

These recipes operate the text files that Beancount Ledger reads. Each mutation is staged, validated, and read back through the same root ledger that the plugin passes to `bean-query` and `bean-price`.

---

## 1. OVERVIEW

The plugin is a desktop Obsidian UI over a structured Beancount file graph. Its query runner shells out with `-q -f <format> <ledger> <query>`, its price service shells out with `bean-price <ledger>`, and its directive writers do not guarantee a full `bean-check` before returning. The safest agent workflow is therefore: resolve the root → inspect includes and current state → stage one file-layer change → run `bean-check` and `.errors` → query a focused readback. ([queryRunner.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/queryRunner.ts), [price.service.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/services/price.service.ts), [transaction directives](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/transactionDirectives.ts))

### Terminal profile and preflight

Use the same command names and argument order as the plugin, but run them from a terminal where their paths are visible:

```bash
command -v bean-query
command -v bean-price
command -v bean-check
python3 -m site --user-base
```

If the commands were installed into the Python user base, prepend its `bin` directory for the current shell:

```bash
export PATH="$(python3 -m site --user-base)/bin:$PATH"
bean-query --version
bean-price --help
bean-check --help
```

A user-local installation route is:

```bash
python3 -m pip install --user beancount beanquery beanprice
```

On macOS, the resulting user executable directory is commonly shaped like `~/Library/Python/3.x/bin`; the exact path depends on the active Python version. A GUI-launched Obsidian process may not inherit the interactive shell `PATH`, so use an absolute executable path in `beancountCommand` or `beanPriceCommand` when the plugin cannot detect the command. ([plugin README](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/README.md), [main.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/main.ts), [queryRunner.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/queryRunner.ts))

Set these variables after reading the actual vault settings; do not assume the default folder if `structuredFolderName` differs:

```bash
VAULT="/path/to/Vault"
STRUCTURED="Finances"
LEDGER="$VAULT/$STRUCTURED/ledger.beancount"
```

The root ledger and component files are defined by the plugin's structured layout. ([structuredLayout.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/structuredLayout.ts), [settings.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/settings.ts))

### Mutation safety

Before replacing a component file, make a timestamped copy, re-read the file immediately before the write, and abort if its contents changed during preparation. The plugin uses backup-first/atomic writer paths for its own writes, but the independent validation and concurrency checks below are the agent's responsibility. ([transaction directives](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/transactionDirectives.ts), [file editor](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/fileEditor.ts))

---

## 2. ADD AN ACCOUNT

### Goal

Create an account that can receive a later posting without violating account lifecycle or currency constraints.

### Exact file edit / command

1. Read `ledger.beancount`, `accounts.beancount`, and the relevant `commodity` declarations. Confirm that the root ledger includes `accounts.beancount`.
2. Append this block to `<structuredFolderName>/accounts.beancount`, changing the date, account, and allowed currency to the real values:

```beancount
2026-01-01 open Assets:Bank:Checking USD
```

For a costed inventory account, declare the commodity and an intentional booking method instead:

```beancount
2026-01-01 open Assets:Brokerage AAPL "FIFO"
```

3. Preserve the existing trailing newline and do not duplicate an identical `open` directive.

### Verify

Run the full checker and a focused account query against the root ledger:

```bash
bean-check "$LEDGER"
bean-query -q -f text "$LEDGER" \
  "SELECT account, open_date(account), close_date(account) FROM #accounts WHERE account = 'Assets:Bank:Checking'"
bean-query -q -f text "$LEDGER" ".errors"
```

The account must appear in `#accounts`, its open date must be no later than the first posting, and `.errors` must not report a load error. `bean-check` is the semantic gate; a successful file append alone is not. ([account directives](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/accountDirectives.ts), [Beancount syntax](https://beancount.github.io/docs/beancount_language_syntax/), [beanquery source adapter](https://github.com/beancount/beanquery/blob/master/beanquery/sources/beancount.py))

---

## 3. APPEND A BALANCED TRANSACTION

### Goal

Add one explicit transaction to the canonical year or month file, with postings whose weights balance in every currency.

### Exact file edit / command

1. Search the included ledger for an existing matching date, narration, amount, source reference, tag, or link before creating a new entry.
2. Confirm that every account is open, accepts the posting currency, and is not closed on the transaction date.
3. Route the block according to `fileOrganization`: `transactions/YYYY.beancount` for yearly organization, or `transactions/YYYY/YYYY-MM.beancount` for monthly organization.
4. Append a complete block with explicit amounts:

```beancount
2026-08-02 * "Grocery Store" "Weekly shop" #household ^statement-2026-08-02
  Expenses:Food:Groceries  42.50 USD
  Assets:Bank:Checking    -42.50 USD
```

For a cross-currency entry, make the conversion part of the posting weight:

```beancount
2026-08-03 * "Exchange" "USD to EUR"
  Assets:Bank:Euro  92.00 EUR
  Assets:Bank:USD  -100.00 USD @ 0.92 EUR
```

For a cost-basis reduction, query the current lot first and preserve its exact cost/date/label selector:

```beancount
2026-08-20 * "Broker" "Sell shares"
  Assets:Bank:Checking  450.00 USD
  Assets:Brokerage  -2 AAPL {180.00 USD} @@ 450.00 USD
```

5. Snapshot the target component, re-read it, append once, and run the validation commands:

```bash
cp "$VAULT/$STRUCTURED/transactions/2026.beancount" \
  "$VAULT/$STRUCTURED/transactions/2026.beancount.$(date -u +%Y%m%dT%H%M%SZ).bak"
bean-check "$LEDGER"
bean-query -q -f text "$LEDGER" ".errors"
```

### Verify

Use the canonical entry readback shape, including file and line location:

```bash
bean-query -q -f text "$LEDGER" \
  "SELECT id, date, narration, filename, lineno FROM #entries WHERE date = 2026-08-02 ORDER BY lineno DESC LIMIT 10"
```

Then run a posting-level check when the transaction is multi-currency or costed:

```bash
bean-query -q -f text "$LEDGER" \
  "SELECT date, account, number, currency, cost_number, cost_currency, cost_date, cost_label, weight FROM #postings WHERE date = 2026-08-02 ORDER BY lineno"
```

The entry must be present in the routed transaction file, all postings must be included by the root ledger, `bean-check` must exit successfully, and the readback must show the intended weights. Do not infer balance from nominal units when `@`, `@@`, or a cost lot changes the weight. ([transaction serializer](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/transactionDirectives.ts), [Beancount syntax](https://beancount.github.io/docs/beancount_language_syntax/), [beanquery source adapter](https://github.com/beancount/beanquery/blob/master/beanquery/sources/beancount.py))

---

## 4. REPRODUCE THE DASHBOARD WITH BQL

### Goal

Run the same query shapes used by the plugin's dashboard controllers without opening the Obsidian UI.

### Exact command / query

The plugin's terminal-equivalent invocation is:

```bash
bean-query -q -f csv "$LEDGER" "SELECT ..."
```

The following canonical query shapes are source-recovered. Replace the literal `USD` only when the settings and ledger use another operating currency, and retain the explicit account root/date/row-grain filters.

**Net worth:**

```sql
SELECT round(number(only('USD', convert(sum(position), 'USD'))), 2) AS _totalWorth
WHERE account ~ '^(Assets|Liabilities)'
```

**Accounts and balances:**

```sql
SELECT account,
       number(only('USD', convert(sum(position), 'USD'))) AS operating_currency
WHERE account ~ '^(Assets|Liabilities|Equity)' AND NOT close_date(account)
GROUP BY account ORDER BY account
```

**Income and expenses:**

```sql
SELECT account,
       number(only('USD', convert(sum(position), 'USD'))) AS operating_currency
WHERE account ~ '^(Income|Expenses)' AND NOT close_date(account)
GROUP BY account ORDER BY account
```

**Transaction history:**

```sql
SELECT date, payee, narration, position, balance
ORDER BY date DESC, lineno DESC LIMIT 2000
```

The query builders also have units, cost, period, tag, commodity, price, and holdings variants. Use `units(sum(position))` for units, `sum(cost(position))` for cost basis, and a separate `#prices` query for price history; a converted scalar is not interchangeable with raw inventory. ([plugin query builders](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/queries/index.ts), [beanquery query environment](https://github.com/beancount/beanquery/blob/master/beanquery/query_env.py))

### Verify

Start with a narrow `LIMIT`, request `text` while debugging, and query `.errors` separately:

```bash
bean-query -q -f text "$LEDGER" \
  "SELECT filename, lineno FROM #entries LIMIT 1"
bean-query -q -f text "$LEDGER" ".errors"
```

Check the result's row grain before using it to make a write decision. A `SELECT` over postings is not a transaction list unless rows are grouped by `id` or queried from `#entries`/`#transactions`. ([beanquery grammar](https://github.com/beancount/beanquery/blob/master/beanquery/parser/bql.ebnf), [beanquery source adapter](https://github.com/beancount/beanquery/blob/master/beanquery/sources/beancount.py))

---

## 5. BULK ENTRY FROM CSV

### Goal

Convert a batch of external rows into canonical transaction files without relying on a plugin-native importer or silently accepting malformed input.

### Exact file edit / command

The plugin has no dedicated bulk CSV import command. Preserve the raw CSV, define a column/account/currency map, normalize every date to ISO, normalize signs and `Decimal` amounts, and attach a deterministic source link or fingerprint to each generated transaction. Beancount's `beangulp` framework is the supported v3-oriented import direction; this mode's file-layer procedure still requires review before writing. ([beangulp README](https://github.com/beancount/beangulp/blob/master/README.rst), [beangulp CSV importer](https://github.com/beancount/beangulp/blob/master/beangulp/importers/csv.py))

For each accepted row, generate an explicit two-sided block in the correct year/month file:

```beancount
2026-08-02 * "Bank" "Card purchase" ^csv-20260802-0001
  Expenses:Uncategorized  42.50 USD
  Assets:Bank:Checking    -42.50 USD
```

Before appending the batch, query the ledger for the fingerprint/link and skip duplicates. Stage the new blocks outside the canonical file, review account/currency mappings, then append only after the staged ledger passes `bean-check`.

### Verify

Run a batch check and compare the source running balance with a focused BQL balance query:

```bash
bean-check "$LEDGER"
bean-query -q -f text "$LEDGER" ".errors"
bean-query -q -f text "$LEDGER" \
  "SELECT date, account, balance FROM #postings WHERE account = 'Assets:Bank:Checking' ORDER BY date, lineno"
```

Reject empty/default parser values, shifted columns, duplicate fingerprints, and batches that balance per transaction but disagree with the source account balance. ([csv parsers](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/csvParsers.ts), [Beancount getting started](https://beancount.github.io/docs/getting_started_with_beancount/))

---

## 6. FETCH MARKET PRICES

### Goal

Fetch current commodity prices through the same external path as the plugin and append only valid, new price directives.

### Exact file edit / command

1. Confirm the commodity declaration contains provider metadata:

```beancount
2026-01-01 commodity AAPL
  price: "USD:yahoo/AAPL"
```

2. Run the no-flag command against the root ledger:

```bash
bean-price "$LEDGER" > /tmp/beancount-prices.txt
```

3. Inspect the output and copy only dated lines shaped like this into `<structuredFolderName>/prices.beancount`, skipping exact lines already present:

```beancount
2026-08-02 price AAPL 227.16 USD
```

The plugin performs that filtering/deduplication itself when its price service runs, but a file-layer agent must apply the same rule rather than appending arbitrary stdout. It does not pass `--update`, `--all`, or `--clobber`, so this path is not a historical rewrite. ([price.service.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/services/price.service.ts), [beanprice README](https://github.com/beancount/beanprice/blob/master/README.md))

### Verify

```bash
bean-check "$LEDGER"
bean-query -q -f text "$LEDGER" \
  "SELECT date, currency, amount FROM #prices WHERE currency = 'AAPL' ORDER BY date DESC LIMIT 10"
bean-query -q -f text "$LEDGER" ".errors"
```

If the query returns no price rows, inspect the raw command output, the commodity metadata, provider/network diagnostics, and the actual executable path before changing the ledger. ([beanquery source adapter](https://github.com/beancount/beanquery/blob/master/beanquery/sources/beancount.py), [beanprice README](https://github.com/beancount/beanprice/blob/master/README.md))

---

## 7. RECONCILE WITH BALANCE ASSERTIONS

### Goal

Record an external statement balance as an assertion after repairing the underlying postings, without using a blind plug to hide a discrepancy.

### Exact file edit / command

1. Query the account's postings through the statement date and inspect existing `#balances` rows.
2. Identify missing, duplicate, wrong-sign, or misclassified transactions. For a simple currency account, add the statement assertion to `<structuredFolderName>/balances.beancount`:

```beancount
2026-08-31 balance Assets:Bank:Checking 957.50 USD ~ 0.01
```

3. For an account holding multiple currencies, add one assertion per currency. Do not use a cash-style `pad` to repair a cost-basis position; a pad is only appropriate for a deliberate simple-unit difference tied to a later assertion. ([Beancount language syntax](https://beancount.github.io/docs/beancount_language_syntax/), [how inventories work](https://beancount.github.io/docs/how_inventories_work/))

### Verify

```bash
bean-check "$LEDGER"
bean-query -q -f text "$LEDGER" \
  "SELECT date, account, number, currency FROM #balances WHERE account = 'Assets:Bank:Checking' ORDER BY date DESC"
bean-query -q -f text "$LEDGER" ".errors"
```

`balance` checks units of one commodity at the beginning of its date, not total cost. A passing USD assertion does not prove EUR or security units are correct. ([Beancount language syntax](https://beancount.github.io/docs/beancount_language_syntax/))

---

## 8. VALIDATE AND RECOVER

### Goal

Make validation explicit after every file-layer change and separate parser/accounting failures from plugin command-path failures.

### Exact command

```bash
bean-check "$LEDGER"
bean-query -q -f text "$LEDGER" ".errors"
bean-query -q -f text "$LEDGER" \
  "SELECT filename, lineno, date, type FROM #entries ORDER BY date DESC, lineno DESC LIMIT 20"
```

Use `bean-check` as the authoritative full-ledger gate. Use `.errors` to obtain file/line diagnostics through the same bean-query path used by the plugin. Retain the exact ledger path, command, query, exit code, stderr, and stdout when diagnosing failures because the plugin passes `-q` and its GUI process may have a different `PATH`. ([beancount pyproject console scripts](https://github.com/beancount/beancount/blob/master/pyproject.toml), [beancount-lint.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/lang/beancount-lint.ts), [queryRunner.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/queryRunner.ts))

### Verify

Do not call a mutation complete until all of these are true:

- `bean-check` exits zero.
- `.errors` returns no diagnostics and the command itself was found.
- The changed file is reachable from `ledger.beancount`.
- A focused BQL query returns the new directive at the intended row grain.
- A dashboard refresh or file reopen is requested only after the text-layer checks pass. ([structuredLayout.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/structuredLayout.ts), [unified dashboard](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/ui/views/dashboard/unified-dashboard-view.ts))

---

## 9. RELATED RESOURCES

- [`data-model.md`](data-model.md) — settings, layout, directive syntax, BQL tables, and price pipeline.
- [`troubleshooting.md`](troubleshooting.md) — error catalog and PATH/GUI recovery.
- [`../../../assets/plugins/beancount-finance/example.beancount`](../../../assets/plugins/beancount-finance/example.beancount) — small valid starter ledger.
- [`../../../assets/plugins/beancount-finance/example.data.json`](../../../assets/plugins/beancount-finance/example.data.json) — complete 21-key settings example.
- [`../../../assets/workflows.md`](../../../assets/workflows.md) — shared cross-plugin file-layer workflow index.
