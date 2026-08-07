---
title: "Beancount Ledger Data Model"
description: "Complete file-layer data model for the Beancount Ledger community plugin, including its 21-key settings object, structured ledger layout, Beancount directives, BQL surface, and bean-price behavior."
trigger_phrases:
  - "beancount finance data model"
  - "beancount settings data.json"
  - "structured beancount ledger"
  - "bean-query virtual tables"
  - "bean-price price directives"
importance_tier: "normal"
contextType: "implementation"
version: 0.1.0.0
---

# Beancount Ledger Data Model

Beancount Ledger is an Obsidian rendering and query layer over ordinary Beancount files. The file-layer agent edits those files and the plugin settings JSON; the plugin then renders and queries the resulting text.

---

## 1. OVERVIEW

The plugin identity is `beancount-finance`, displayed as **Beancount Ledger**, authored by `mkshp`, version 2.3.1, desktop-only, with minimum Obsidian version 1.7.2. The inspected repository source is TypeScript under `src/`; the tag does not contain a tracked root `main.js`, so source links below are the verified implementation boundary. ([manifest.json](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/manifest.json), [src/main.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/main.ts))

The durable accounting source of truth is plain `.beancount` text. `.obsidian/plugins/beancount-finance/data.json` controls plugin behavior, but it does not replace the ledger. ([plugin main source](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/main.ts), [Beancount syntax](https://beancount.github.io/docs/beancount_language_syntax/))

### Core Principle

Treat the plugin as a file graph plus two external command adapters: preserve valid Beancount semantics first, then use `bean-query` or `bean-price` to read and extend that graph. The plugin writers do not establish a ledger-wide `bean-check` gate for every mutation, so an AI must add that gate. ([transaction directives](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/transactionDirectives.ts), [Beancount getting started](https://beancount.github.io/docs/getting_started_with_beancount/))

### File-layer locations

| Data | Location | Role |
|---|---|---|
| Plugin settings | `<vault>/.obsidian/plugins/beancount-finance/data.json` | Persisted 21-key settings object, shallow-merged over current defaults. |
| Structured root | `<vault>/<structuredFolderName>/ledger.beancount` | Main ledger passed to `bean-query` and `bean-price`. |
| Ledger components | `<vault>/<structuredFolderName>/*.beancount` | Accounts, commodities, prices, pads, balances, queries, notes, events, and transactions split by directive kind. |

The exact settings merge and structured layout are source-backed by [`src/settings.ts`](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/settings.ts), [`src/main.ts`](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/main.ts), and [`src/utils/structuredLayout.ts`](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/structuredLayout.ts).

---

## 2. PERSISTED SETTINGS SCHEMA

The plugin loads raw data and shallow-merges it over `DEFAULT_SETTINGS`; a missing known key receives its current default, while unknown raw keys can survive a later save. Legacy `reportingCurrency` or `defaultCurrency` values migrate to uppercase `operatingCurrency`, and a legacy structured-folder record can migrate to `onboardingCompleted: true`. `isConnectionReady` is runtime state and is not one of the 21 persisted keys. ([settings.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/settings.ts), [main.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/main.ts))

| Key | Type | Default | What it controls | File-layer relevance |
|---|---|---:|---|---|
| `beancountCommand` | string | `""` | The configured Beancount query executable or command prefix; the plugin uses it for `bean-query`-compatible BQL execution and readiness probes. | Set an absolute executable path when the Obsidian GUI cannot see the shell `PATH`; it changes how the ledger is read, not the ledger text. |
| `operatingCurrency` | string | `"USD"` | Default/reporting currency used by entry helpers and dashboard conversions. | Match the ledger `option "operating_currency"` and query conversions; changing it does not rebalance postings. |
| `maxTransactionResults` | number | `2000` | Maximum transaction rows requested by transaction/dashboard views. | A display/query limit only; it does not truncate the ledger. |
| `maxJournalResults` | number | `1000` | Maximum journal rows returned by journal views. | A display/query limit only; it does not remove journal entries. |
| `dashboardDefaultPeriod` | `this-month \| last-month \| this-year \| last-year` | `"this-month"` | Initial period selected by dashboard period builders. | Use the same date interval when reproducing a dashboard query at the terminal. |
| `bqlShowTools` | boolean | `true` | Whether BQL blocks expose format, refresh, copy, and export controls. | No ledger effect; the agent still runs BQL directly when working at the file layer. |
| `bqlShowQuery` | boolean | `false` | Whether rendered BQL blocks show their query source in a collapsible panel. | No ledger effect; preserve query text in notes or named query directives when it is part of the workflow. |
| `debugMode` | boolean | `false` | Enables plugin debug logging. | No ledger effect; useful only when diagnosing plugin-side execution. |
| `createBackups` | boolean | `true` | Enables timestamped backups before plugin writes. | Keep enabled for plugin writes; create an independent snapshot before an AI bulk mutation. |
| `maxBackupFiles` | number | `10` | Backup retention count; the settings UI documents `0` as unlimited. | Controls recovery copies, not ledger semantics. |
| `structuredFolderName` | string | `"Finances"` | Root folder for the structured ledger and its component files. | Resolve this before reading or writing; every relative component path depends on it. |
| `fileOrganization` | `yearly \| monthly` | `"yearly"` | Transaction partitioning strategy. | Routes transactions to `transactions/YYYY.beancount` or `transactions/YYYY/YYYY-MM.beancount`. |
| `autoPriceFetch` | boolean | `false` | Enables scheduled commodity-price retrieval. | A scheduler setting; it does not create a price without a valid `bean-price` result. |
| `priceFetchIntervalHours` | number | `24` | Interval for automatic price retrieval; the UI accepts positive integers. | Controls when the plugin invokes `bean-price`; it does not change historical directives. |
| `lastAutoPriceFetch` | number | `0` | Stored epoch-millisecond marker for the last automatic price run. | Operational metadata only; do not treat it as a market price or accounting date. |
| `beanPriceCommand` | string | `""` | The configured `bean-price` executable or command prefix. | Use an absolute path when the GUI cannot inherit the shell `PATH`; the command appends to the prices component through plugin logic. |
| `accountAutocomplete` | boolean | `true` | Enables account completion in the Beancount editor. | No ledger effect; account names still must be valid in the file. |
| `enableUserSnippets` | boolean | `false` | Enables user snippets stored under the structured folder. | Snippets are templates unless the root ledger explicitly includes their file; they are not automatically accounting state. |
| `formatOnSave` | boolean | `false` | Formats Beancount text on editor save. | May change whitespace and alignment; inspect the diff before treating a formatted file as unchanged. |
| `lintMode` | `off \| on-save \| on-change` | `"on-save"` | Controls the editor's BQL-backed lint timing. | The editor lint is not a replacement for direct `bean-check`; use `.errors` and `bean-check` for validation. |
| `onboardingCompleted` | boolean | `false` | Suppresses the first-run onboarding path. | No ledger effect; do not infer that onboarding completion means the ledger validates. |

The command registry at this version contains seven IDs: `add-beancount-transaction`, `open-beancount-unified-dashboard`, `open-beancount-snapshot`, `run-beancount-onboarding`, `format-beancount-document`, `fetch-commodity-prices`, and `open-beancount-snippets`. The former insert-BQL command is not registered. ([main.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/main.ts))

---

## 3. STRUCTURED LEDGER LAYOUT

With the default `structuredFolderName`, the root is `Finances/ledger.beancount`. The plugin generates includes for `commodities.beancount`, `accounts.beancount`, `prices.beancount`, `pads.beancount`, `balances.beancount`, `queries.beancount`, `notes.beancount`, `events.beancount`, and transaction files. The organizational include order is not a substitute for Beancount's chronological semantics: dated directives are evaluated by date after parsing. ([structuredLayout.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/structuredLayout.ts), [Beancount language syntax](https://beancount.github.io/docs/beancount_language_syntax/))

```text
<vault>/Finances/
├── ledger.beancount
├── commodities.beancount
├── accounts.beancount
├── prices.beancount
├── pads.beancount
├── balances.beancount
├── queries.beancount
├── notes.beancount
├── events.beancount
├── snippets.beancount
└── transactions/
    ├── 2026.beancount                 # fileOrganization = yearly
    └── 2026/
        └── 2026-08.beancount          # fileOrganization = monthly
```

The transaction directory uses one of these shapes:

| `fileOrganization` | Transaction target for `2026-08-02` |
|---|---|
| `yearly` | `<structuredFolderName>/transactions/2026.beancount` |
| `monthly` | `<structuredFolderName>/transactions/2026/2026-08.beancount` |

Directive routing is deterministic: account `open`/`close` lines go to `accounts.beancount`; `commodity` to `commodities.beancount`; `price` to `prices.beancount`; `pad` to `pads.beancount`; `balance` to `balances.beancount`; named `query` to `queries.beancount`; `note` to `notes.beancount`; events/indicators to `events.beancount`; and transactions to the date-derived transaction file. A newly created component is invisible to the root query until it is included by `ledger.beancount`. ([structuredLayout.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/structuredLayout.ts))

---

## 4. BEANCOUNT V3 DIRECTIVES

All dated directives use ISO `YYYY-MM-DD`. Account names are colon-separated under `Assets`, `Liabilities`, `Equity`, `Income`, or `Expenses`; declarations are date-sensitive rather than position-sensitive in the include graph. ([Beancount language syntax](https://beancount.github.io/docs/beancount_language_syntax/))

### `open` and account lifecycle

```beancount
2026-01-01 open Assets:Bank:Checking USD
2026-01-01 open Assets:Brokerage AAPL "FIFO"
2026-01-01 close Assets:Bank:Checking
```

An account must be opened on or before its first posting. Currency constraints after the account name limit which commodities may be posted there; an optional booking method such as `FIFO`, `LIFO`, or `STRICT` controls ambiguous cost-lot reductions. A `close` directive prevents later postings but does not by itself assert a zero balance. ([Beancount language syntax](https://beancount.github.io/docs/beancount_language_syntax/), [inventory booking](https://beancount.github.io/docs/how_inventories_work/))

### Transactions and postings

```beancount
2026-08-02 * "Grocery Store" "Weekly shop" #household ^statement-2026-08-02
  Expenses:Food:Groceries  42.50 USD
  Assets:Bank:Checking    -42.50 USD
```

The transaction flag, payee/narration, tags, links, metadata, posting flags, posting comments, and posting metadata are all representable in the plugin's transaction serializer. The accounting invariant is balance by posting weight in every balancing currency, not merely equal nominal units. At most one posting amount may be omitted for Beancount interpolation; explicit amounts are safer for imports and reconciliation. ([transactionDirectives.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/transactionDirectives.ts), [Beancount syntax](https://beancount.github.io/docs/beancount_language_syntax/))

### Multi-currency, `@`, `@@`, and cost lots

```beancount
2026-08-03 * "Broker" "Buy shares"
  Assets:Brokerage  2 AAPL {180.00 USD}
  Assets:Bank:Checking  -360.00 USD

2026-08-20 * "Broker" "Sell shares"
  Assets:Bank:Checking  450.00 USD
  Assets:Brokerage  -2 AAPL {180.00 USD} @@ 450.00 USD
```

`@` is a per-unit price and `@@` is a total price. A per-unit cost lot uses `{number currency}`; plugin serialization also represents total costs as `{{...}}`. Cost determines the balancing weight for a costed posting, while a simultaneous price annotation is market-price information. A reduction should query current `position` and cost fields first, then select the exact cost/date/label when strict booking would otherwise match multiple lots. ([transactionDirectives.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/transactionDirectives.ts), [Beancount language syntax](https://beancount.github.io/docs/beancount_language_syntax/), [how inventories work](https://beancount.github.io/docs/how_inventories_work/))

Raw units in different currencies do not balance by themselves. Supply a conversion with `@`/`@@`, or add a posting whose weight is in the balancing currency; the `operatingCurrency` option is for reporting and does not alter ledger processing. ([Beancount language syntax](https://beancount.github.io/docs/beancount_language_syntax/))

### `balance` and `pad`

```beancount
2026-08-31 balance Assets:Bank:Checking 957.50 USD ~ 0.01
2026-09-01 pad Assets:Bank:Checking Equity:Opening-Balances
```

`balance` asserts the units of one named commodity at the beginning of the assertion date. A multi-currency account needs one assertion per currency; a parent-account assertion includes descendants only when the parent is itself open. `pad` creates a synthetic balancing transaction for the next matching balance assertion, is an error when unused, and is not a safe way to create or repair cost-basis inventory. ([Beancount language syntax](https://beancount.github.io/docs/beancount_language_syntax/))

### `commodity`, `price`, and `note`

```beancount
2026-01-01 commodity AAPL
  name: "Apple Inc."
  price: "USD:yahoo/AAPL"

2026-08-02 price AAPL 227.16 USD
2026-08-02 note Assets:Bank:Checking "Statement reconciled"
```

`commodity` declares a symbol and can carry the `price:` metadata that `bean-price` uses. `price` records a dated base-to-quote rate. `note` attaches a dated comment to an account without adding postings. The plugin routes these directives to the corresponding structured component files. ([Beancount language syntax](https://beancount.github.io/docs/beancount_language_syntax/), [structuredLayout.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/structuredLayout.ts), [beanprice README](https://github.com/beancount/beanprice/blob/master/README.md))

### `include` and named `query`

```beancount
include "accounts.beancount"
include "transactions/2026.beancount"
2026-01-01 query "net-worth" "SELECT ..."
```

Include paths resolve relative to the including file. The plugin stores named query directives in `queries.beancount`, and inline `bql-q:<name>` resolves and runs those definitions; a live fenced `bql` block is an execution surface, not a new persisted query command. ([Beancount language syntax](https://beancount.github.io/docs/beancount_language_syntax/), [query directives](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/queryDirectives.ts), [inline BQL processor](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/ui/markdown/InlineBQLProcessor.ts))

---

## 5. BQL AND THE EXTERNAL QUERY SURFACE

The plugin shells out to a Beancount query executable. Its runner passes an argument sequence equivalent to `bean-query -q -f <format> <ledger-path> <query>`, where the accepted formats are `csv`, `text`, and `beancount`; CSV is the default, output is capped at 50 MiB, and non-empty stderr is treated as a query failure. The mode's terminal profile should use the same argument shape. ([queryRunner.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/queryRunner.ts), [beanquery shell](https://github.com/beancount/beanquery/blob/master/beanquery/shell.py))

### Statement surface

The current beanquery grammar exposes:

| Form | File-layer use |
|---|---|
| `SELECT` | Aggregation, filtering, grouping, conversion, inventory and register queries. |
| `BALANCES` | Balance-oriented query form for account positions. |
| `JOURNAL` | Journal-oriented rows over a date/account scope. |
| `PRINT` | Emit matching Beancount directives, useful for migration or targeted inspection. |
| `PIVOT BY` | Pivot a `SELECT` result by a field or expression. |

The grammar also supports `DISTINCT`, `FROM`, `WHERE`, `GROUP BY`, `HAVING`, `ORDER BY`, `LIMIT`, regex predicates, date/range predicates, subqueries, `CREATE TABLE`, and `INSERT`. ([beanquery grammar](https://github.com/beancount/beanquery/blob/master/beanquery/parser/bql.ebnf))

### Virtual tables and typed columns

Use an explicit virtual table when the row grain matters. The Beancount source adapter exposes `#postings`, `#entries`, `#transactions`, `#prices`, `#balances`, `#notes`, `#events`, `#documents`, `#accounts`, and `#commodities`. Posting rows include fields such as `date`, `filename`, `lineno`, `payee`, `narration`, `tags`, `links`, `account`, `number`, `currency`, cost fields, `position`, `price`, `weight`, and running `balance`. ([beanquery Beancount source](https://github.com/beancount/beanquery/blob/master/beanquery/sources/beancount.py))

The plugin's dashboard scalar pattern is `number(only('USD', convert(sum(position), 'USD')))`. `sum(position)` is an inventory; extract a number only after selecting one currency. Use `units(sum(position))` for units, `sum(cost(position))` for cost basis, and `getprice()` only when a known price path exists. ([plugin query builders](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/queries/index.ts), [beanquery query environment](https://github.com/beancount/beanquery/blob/master/beanquery/query_env.py))

### The `.errors` validation channel

Beanquery's `-q`/`--no-errors` option hides normal ledger-load error reporting. The plugin's editor lint path explicitly runs the `.errors` query in text mode and parses `filename:line:message`; this is the diagnostic surface to use when a query appears to work over a malformed ledger. A successful BQL result is not proof that `bean-check` passes. ([beancount-lint.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/lang/beancount-lint.ts), [beanquery shell](https://github.com/beancount/beanquery/blob/master/beanquery/shell.py))

---

## 6. BEAN-PRICE AND MARKET PRICES

`bean-price` reads commodity `price:` metadata and emits Beancount `price` directives. The plugin invokes it as `bean-price <main-ledger-path>` with no `--update`, `--all`, or `--clobber` flags, filters simple dated price lines, exact-deduplicates them against the target price file, and appends new lines to `prices.beancount` through the vault API. A fetch therefore adds current parsable prices; it does not perform historical price maintenance. ([price.service.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/services/price.service.ts), [beanprice README](https://github.com/beancount/beanprice/blob/master/README.md))

The relevant terminal command is:

```bash
bean-price "/path/to/Vault/Finances/ledger.beancount"
```

Inspect the raw output before copying directives into a file-layer workflow. No output can mean missing `price:` metadata, an unsupported provider, no active balance to price, network/provider failure, or an unavailable executable; it does not authorize inventing a `price` line. ([beanprice README](https://github.com/beancount/beanprice/blob/master/README.md), [price.service.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/services/price.service.ts))

---

## 7. SOURCES AND RELATED ASSETS

The complete source boundary is the tagged plugin repository and the primary Beancount/beanquery/beanprice documentation:

- [Beancount Ledger repository](https://github.com/mkshp-dev/obsidian-finance-plugin/tree/2.3.1)
- [`src/settings.ts`](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/settings.ts)
- [`src/main.ts`](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/main.ts)
- [`src/utils/structuredLayout.ts`](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/structuredLayout.ts)
- [`src/queries/index.ts`](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/queries/index.ts)
- [Beancount language syntax](https://beancount.github.io/docs/beancount_language_syntax/)
- [How inventories work](https://beancount.github.io/docs/how_inventories_work/)
- [beanquery grammar](https://github.com/beancount/beanquery/blob/master/beanquery/parser/bql.ebnf)
- [beanquery Beancount source adapter](https://github.com/beancount/beanquery/blob/master/beanquery/sources/beancount.py)
- [beanprice README](https://github.com/beancount/beanprice/blob/master/README.md)

File-layer examples and shared workflows live in [`../../../assets/plugins/beancount-finance/example.beancount`](../../../assets/plugins/beancount-finance/example.beancount), [`../../../assets/plugins/beancount-finance/example.data.json`](../../../assets/plugins/beancount-finance/example.data.json), and [`../../../assets/workflows.md`](../../../assets/workflows.md).
