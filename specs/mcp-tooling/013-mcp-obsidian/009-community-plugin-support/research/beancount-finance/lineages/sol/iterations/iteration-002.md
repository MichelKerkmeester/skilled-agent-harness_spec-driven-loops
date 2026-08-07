# Iteration 002 — Beancount semantics, BQL grammar, AI workflows, and failures

## Focus

Resolve the language-level and operational contract that a file-layer AI must preserve: directive grammar, weights and lots, validation, beanquery’s actual grammar and tables, beanprice metadata, import/reconciliation workflows, and recovery from common failures.

## Findings

### 1. Beancount directive model relevant to the plugin

All dated directives use ISO `YYYY-MM-DD`; declarations are evaluated by date, not file order. Accounts must be opened on or before their first posting, may optionally restrict currencies, and may set a booking method such as `STRICT`, `FIFO`, or `LIFO`. Commodity identifiers are uppercase-led symbols. [SOURCE: https://beancount.github.io/docs/beancount_language_syntax/]

The file-layer forms required by this plugin are:

```beancount
2000-01-01 commodity AAPL
  name: "Apple Inc."
  price: "USD:yahoo/AAPL"

2025-01-01 open Assets:Bank:Checking USD
2025-01-01 open Assets:Broker:AAPL AAPL "FIFO"

2025-03-01 * "Store" "Groceries" #food ^bank-abc123
  Assets:Bank:Checking  -42.50 USD
  Expenses:Food          42.50 USD

2025-03-31 balance Assets:Bank:Checking 1234.56 USD ~ 0.01
2025-01-01 pad Assets:Bank:Checking Equity:Opening-Balances
2025-03-15 note Assets:Bank:Checking "Statement reconciled"
2025-03-01 price AAPL 227.16 USD
2025-01-01 query "net-worth" "SELECT ..."

include "accounts.beancount"
```

`balance` asserts units of one commodity at a date; a multi-currency account needs one assertion per currency. Parent assertions include subaccounts, but the parent must itself be open. `pad` creates a balancing transaction for the next dated balance assertion, is an error when unused, cannot safely pad cost-basis positions, and multiple pads for the same account/commodity before an assertion are unsupported. `note` attaches a dated comment to an account. `price` records a base-to-quote conversion point; `include` paths may be absolute or relative to the including file. [SOURCE: https://beancount.github.io/docs/beancount_language_syntax/]

### 2. Transactions, multi-currency weights, and cost-basis lots

Every transaction must sum to zero by *weight* in every balancing currency. Plain units weigh as written; `@` multiplies units by a per-unit price; `@@` supplies a total price; a `{cost}` lot weighs at cost; when both cost and price exist, cost controls balancing and price only contributes market-price data. One posting amount may be omitted for interpolation, but an AI should omit at most one balancing leg and validate the result. [SOURCE: https://beancount.github.io/docs/beancount_language_syntax/]

`{183.07 USD}` creates/identifies a per-unit cost lot. Cost may additionally include acquisition date and/or label; `{{1830.70 USD}}` is total cost in plugin serialization. A reduction can match by exact cost, date, label, or `{}`. Under default `STRICT`, a partial reduction matching several lots is ambiguous and errors; `FIFO`/`LIFO` can choose automatically. Costed inventories normally cannot go negative. The safe AI rule is to query current lots before a sale and emit the exact cost/date/label, unless the account explicitly declares a non-STRICT method. [SOURCE: https://beancount.github.io/docs/beancount_language_syntax/]

### 3. beanquery BQL surface and tables

The plugin executes `bean-query -q -f <csv|text|beancount> <ledger> <query>`. In beanquery, `-q` means “do not report ledger validation errors on load”; it does not make the ledger valid. The plugin’s linter explicitly runs the built-in `.errors` command in text mode to recover `filename:line:message` diagnostics. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/queryRunner.ts] [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/lang/beancount-lint.ts] [SOURCE: https://github.com/beancount/beanquery/blob/master/beanquery/shell.py]

The current parser grammar supports `SELECT [DISTINCT]`, optional `FROM`, `WHERE`, `GROUP BY ... HAVING`, `ORDER BY`, `PIVOT BY`, and `LIMIT`; Boolean/arithmetic expressions; `IN`, `NOT IN`, regex `~`, `!~`, `?~`, `IS [NOT] NULL`, and `BETWEEN`; functions and aggregates; subselects; `OPEN ON`, `CLOSE [ON]`, and `CLEAR`; plus `BALANCES`, `JOURNAL`, `PRINT`, `CREATE TABLE`, and `INSERT INTO`. [SOURCE: https://github.com/beancount/beanquery/blob/master/beanquery/parser/bql.ebnf]

Default queries read postings. Explicit virtual tables include `#postings`, `#entries`, `#transactions`, `#prices`, `#balances`, `#notes`, `#events`, `#documents`, `#accounts`, and `#commodities`. Common posting columns include `date`, `filename`, `lineno`, `flag`, `payee`, `narration`, `tags`, `links`, `account`, `other_accounts`, `number`, `currency`, cost fields, `position`, `price`, `weight`, and running `balance`. [SOURCE: https://github.com/beancount/beanquery/blob/master/beanquery/sources/beancount.py]

### 4. beanprice contract

beanprice reads commodity metadata such as:

```beancount
2000-01-01 commodity AAPL
  price: "USD:yahoo/AAPL"
```

and `bean-price ledger.beancount` emits price directives; `--update` is beanprice’s historical/update mode. Beancount Ledger 2.3.1 does not pass `--update`: it invokes the configured command with only the ledger path, accepts parsable stdout even when stderr/nonzero status is informational, and appends only new exact directive lines. Network/provider failures, unavailable symbols, missing `price:` metadata, or unconfigured command paths therefore yield no saved price or a failed-symbol result rather than an accounting mutation. [SOURCE: https://github.com/beancount/beanprice/blob/master/README.md] [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/services/price.service.ts]

### 5. File-layer AI workflows

**Add account.** Read `ledger.beancount`, `accounts.beancount`, and referenced commodity definitions; choose an open date no later than first posting; validate the five-root account name; add required currencies and an intentional booking method; stage the change; run `bean-check ledger.beancount` and `.errors`; atomically replace only `accounts.beancount`.

**Append balanced transaction.** Identify the year/month target from `fileOrganization`; search `id`, links, payee/date/amount, and source reference for duplicates; derive all postings; add explicit `@`/`@@` for cross-currency or exact `{}` lot selectors for costed reductions; stage, validate, then atomically append with a trailing blank line. Never calculate correctness from nominal units when weights differ.

**Reconcile.** Query the account journal through the statement date, compare statement rows, add missing transactions, then add one `balance` per currency dated according to the institution’s statement semantics. Run `.errors`/`bean-check`; a discrepancy is evidence of a missing/incorrect posting, not permission to add a `pad`. Use `pad` only for a deliberate opening-balance or explicitly accepted unknown difference.

**Bulk CSV import.** The plugin has no bulk-CSV command. Beancount v3’s supported framework is beangulp, which maps CSV date, payee/narration, amount or debit/credit, balance, reference, account, and currency fields into directives. The safe pipeline is CSV read-only parse → normalize Decimal/date/sign/currency → stable row fingerprint/link → deduplicate against ledger → generate staged transactions with a suspense/uncategorized balancing leg if necessary → human/category review → `bean-check` → partition into the plugin’s transaction files → atomic replace. [SOURCE: https://github.com/beancount/beangulp/blob/master/README.rst] [SOURCE: https://github.com/beancount/beangulp/blob/master/beangulp/importers/csv.py]

### 6. Error and edge-case catalog

| Symptom | Likely cause | File-layer recovery |
|---|---|---|
| `Transaction does not balance` | signs wrong, missing leg, rounding, or cross-currency posting lacks price/cost | Compute posting weights per currency; fix source values; use `@`/`@@`; validate staged ledger. |
| Unknown/unopened account | missing `open`, open date after posting, or invalid root/name | Add/fix the dated `open`; do not hide with a spelling variant. |
| Currency not allowed | posting commodity conflicts with currencies listed on `open` | Correct the posting or deliberately extend the account’s allowed currencies. |
| Parse error / malformed date | not ISO `YYYY-MM-DD`, invalid calendar date, unquoted string, bad indentation/token | Fix the exact `filename:line` from `bean-check`/`.errors`. |
| Balance failed | ledger units differ from statement; assertion checks only named commodity | Reconcile missing/duplicate/wrong-sign postings; add separate assertions per currency. |
| Ambiguous lot | `{}` matches several lots under `STRICT` | Identify cost/date/label exactly, or use declared FIFO/LIFO policy. |
| Negative inventory at cost | sale exceeds matching units or matches wrong lot | Query current lots, correct units/selectors, split reduction across lots. |
| Unused/duplicate pad | no following balance or multiple pads target same account/commodity | Remove redundant pad; preserve one intentional pad tied to a later assertion. |
| BQL returns data despite invalid ledger | plugin passes beanquery `-q` | Always run `.errors` or `bean-check` as a separate pre/post-write gate. |
| Inline BQL displays `0 USD` | empty/header-only result is UI fallback | Inspect fenced BQL/CSV output; do not treat fallback as real zero. |
| BQL failure with stderr | plugin rejects any nonempty stderr | Run identical argv in terminal; fix query/ledger/command path; inspect `.errors`. |
| No prices saved | missing commodity `price:` metadata, provider/network failure, no new parsable lines | Test `bean-price ledger.beancount`; inspect stdout/stderr; add metadata; never invent a price. |
| Concurrent edit lost | AI and Obsidian/plugin write same partition | Re-read and compare content/hash immediately before atomic replacement; abort and merge on change. |

`bean-check` is quiet on success and prints filename, line, and description to stderr on errors. Reports should not be trusted until all validation errors are fixed. [SOURCE: https://beancount.github.io/docs/getting_started_with_beancount/] [SOURCE: https://beancount.github.io/docs/running_beancount_and_generating_reports/]

## Corrections to iteration 1

The settings interface/default object has **21**, not 19, current keys. The command registry has **seven**, not six. Iteration 1’s prose and registry were corrected after a source recount.

## What was tried and failed

- The 2.3.1 release page and direct `releases/download/2.3.1/main.js` URL were retried through web retrieval and remained cache misses. GitHub Contents returns 404 because `main.js` is not tracked. The exact tag’s TypeScript inputs are the strongest inspectable source, but bundle-level minification or release-asset drift was not independently checked.
- beanquery’s `docs/` tree contains only a minimal index, not a query reference. The authoritative grammar (`bql.ebnf`), shell command documentation, and Beancount source adapter were read instead.

## Novelty

`newInfoRatio = 0.68`: the second pass added language invariants, BQL grammar/tables, linter behavior, beanprice metadata, workflow gates, and a broad failure catalog while confirming the plugin-specific results from iteration 1.
