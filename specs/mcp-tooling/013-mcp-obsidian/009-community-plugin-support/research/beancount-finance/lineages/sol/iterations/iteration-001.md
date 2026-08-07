# Iteration 001 — Plugin-owned state, commands, files, and subprocesses

## Focus

Establish the exact Beancount Ledger 2.3.1 contract from the tagged repository source: persisted settings, commands, structured files, BQL execution, dashboard queries, entry writers, and price fetching.

## Findings

### 1. Identity and bundle provenance

- The Obsidian community registry maps ID `beancount-finance` to `mkshp-dev/obsidian-finance-plugin`; `manifest.json` at tag `2.3.1` identifies Beancount Ledger 2.3.1, desktop-only, with minimum Obsidian 1.7.2. [SOURCE: https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugins.json] [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/manifest.json]
- The Git tree at tag `2.3.1` does not contain `main.js`; the compiled bundle is a release asset. The authoritative repository inputs that compile into it are the tag’s TypeScript sources. Claims below are therefore source-verified at tag 2.3.1, not falsely described as line reads from a tracked bundle. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/tree/2.3.1]

### 2. Exact persisted `data.json` schema

`loadSettings()` performs a shallow `Object.assign({}, DEFAULT_SETTINGS, raw)` and `saveSettings()` persists the resulting object with Obsidian `saveData()`. Thus a normal current-version `data.json` can contain all 21 keys below; missing keys receive defaults. Legacy `reportingCurrency` or `defaultCurrency` is migrated to `operatingCurrency`, and pre-flag existing users with a structured folder are migrated to `onboardingCompleted: true`. Unknown legacy keys are not removed by the shallow merge and can remain in the serialized object after a later save. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/settings.ts] [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/main.ts]

| Key | Type / allowed values | Default | Meaning |
|---|---|---:|---|
| `beancountCommand` | string | `""` | Resolved `bean-query`/WSL executable command. |
| `operatingCurrency` | string | `"USD"` | Transaction default and consolidation currency. |
| `maxTransactionResults` | number | `2000` | Dashboard transaction cap. |
| `maxJournalResults` | number | `1000` | Journal entry cap. |
| `dashboardDefaultPeriod` | `this-month|last-month|this-year|last-year` | `this-month` | Initial summary period. |
| `bqlShowTools` | boolean | `true` | Show format/refresh/copy/export controls. |
| `bqlShowQuery` | boolean | `false` | Show collapsible query source. |
| `debugMode` | boolean | `false` | Console debug logging. |
| `createBackups` | boolean | `true` | Timestamped backups before plugin writes. |
| `maxBackupFiles` | number | `10` | Retention; UI documents `0` as unlimited. |
| `structuredFolderName` | string | `"Finances"` | Vault-local ledger root. |
| `fileOrganization` | `yearly|monthly` | `yearly` | Transaction partitioning. |
| `autoPriceFetch` | boolean | `false` | Scheduled `bean-price`. |
| `priceFetchIntervalHours` | number | `24` | Schedule interval; UI accepts positive integers. |
| `lastAutoPriceFetch` | number | `0` | Epoch-millisecond runtime state. |
| `beanPriceCommand` | string | `""` | Resolved `bean-price` executable. |
| `accountAutocomplete` | boolean | `true` | Editor completions. |
| `enableUserSnippets` | boolean | `false` | Load `snippets.beancount`. |
| `formatOnSave` | boolean | `false` | Normalize indentation/alignment/price spacing. |
| `lintMode` | `off|on-save|on-change` | `on-save` | Inline bean-query/validation diagnostics. |
| `onboardingCompleted` | boolean | `false` | Suppress first-run wizard. |

### 3. Exact commands and note-query forms

Seven command-palette IDs are registered at 2.3.1: `add-beancount-transaction`, `open-beancount-unified-dashboard`, `open-beancount-snapshot`, `run-beancount-onboarding`, `format-beancount-document`, `fetch-commodity-prices`, and `open-beancount-snippets`. The source comment explicitly says the former “Insert BQL Query Block” command was removed. Ribbon actions add a transaction and open the dashboard. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/main.ts]

- Fenced code blocks use language `bql`; their entire trimmed body is run and can render `csv` as a table, `text`, or `beancount`, with optional refresh/copy/export controls. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/ui/markdown/BQLCodeBlockProcessor.ts]
- Inline code `` `bql:SELECT ...` `` runs a direct query and displays the first data cell. `` `bql-q:name` `` resolves a dated Beancount `query` directive from `queries.beancount`, caches the name map for 30 seconds, then displays the first data cell. Empty or header-only output becomes `0 USD`; this fallback is display behavior, not an accounting result. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/ui/markdown/InlineBQLProcessor.ts] [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/queryDirectives.ts]

### 4. Structured vault model and write routing

The plugin treats `<vault>/<structuredFolderName>/ledger.beancount` as the BQL entry point and generates these includes in order: `commodities.beancount`, `accounts.beancount`, `prices.beancount`, `pads.beancount`, `balances.beancount`, `queries.beancount`, `notes.beancount`, `events.beancount`, then transaction files newest-first. It also writes `option "title" "Personal Finance"` and `option "operating_currency" "<currency>"`. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/structuredLayout.ts]

Operation routing is exact: accounts/open/close → `accounts.beancount`; commodity → `commodities.beancount`; price → `prices.beancount`; pad → `pads.beancount`; balance → `balances.beancount`; note → `notes.beancount`; event → `events.beancount`; named query → `queries.beancount`; transaction → `transactions/YYYY.beancount` or `transactions/YYYY/YYYY-MM.beancount`. An AI should preserve this split so the UI’s edit lookups and include maintenance continue to work. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/structuredLayout.ts]

The migration path uses BQL `PRINT FROM type='…'` for commodity, open/close, price, pad, balance, note, event, query, and transaction directives. This proves the plugin recognizes that broader directive set even though the unified modal only creates transaction, balance, open, close, note, and query entries; pad has no UI creation path. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/structuredLayout.ts] [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/ui/modals/UnifiedTransactionModal.ts]

### 5. Entry serialization

- Transaction header: `date flag payee/narration #tags ^links`; metadata is emitted as indented quoted values. Each posting can carry an optional posting flag, units, per-unit `{number CUR[, date][, "label"]}` or total `{{...}}` cost, date-only/label-only cost, per-unit `@ amount CUR` or total `@@ amount CUR` price, comment, and posting metadata. A posting may omit its amount to let Beancount infer the balancing leg. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/transactionDirectives.ts]
- Open: `date open Account CUR1,CUR2 "BOOKING"`; close: `date close Account`. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/accountDirectives.ts]
- Balance: `date balance Account  amount CUR [~ tolerance]`. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/balanceDirectives.ts]
- Note: `date note Account "comment" #tags ^links`. Named query: `date query "name" "escaped BQL"`. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/noteDirectives.ts] [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/queryDirectives.ts]
- Plugin entry writes are backup-first and atomic. A file-layer AI should emulate that safety by validating a staged candidate and using an atomic replacement, never blind in-place mutation.

### 6. Exact subprocess contracts

- BQL: `[beancountCommand, '-q', '-f', format, ledgerPath, query]` with `format ∈ {csv,text,beancount}`, a 50 MiB output buffer, WSL path conversion when the command string contains `wsl`, and `bean-query.exe` substitution on native Windows. Any nonempty stderr is treated as a query failure. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/queryRunner.ts]
- Prices: `[beanPriceCommand, ledgerPath]` with 20 MiB buffer and a 60-second timeout. Stderr/nonzero exit may be informational; the service still extracts stdout lines matching `YYYY-MM-DD price SYMBOL AMOUNT CURRENCY`, deduplicates exact lines against `prices.beancount`, and appends new directives. Commodity directives need `price:` metadata understood by bean-price. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/services/price.service.ts]

### 7. Dashboard-equivalent BQL recipes

The source’s canonical query shapes are:

```sql
SELECT round(number(only('USD', convert(sum(position), 'USD'))), 2) AS _totalWorth
WHERE account ~ '^(Assets|Liabilities)'

SELECT account,
       number(only('USD', convert(sum(position), 'USD'))) AS operating_currency
WHERE account ~ '^(Assets|Liabilities|Equity)' AND NOT close_date(account)
GROUP BY account ORDER BY account

SELECT account,
       number(only('USD', convert(sum(position), 'USD'))) AS operating_currency
WHERE account ~ '^(Income|Expenses)' AND NOT close_date(account)
GROUP BY account ORDER BY account

SELECT date, payee, narration, position, balance
ORDER BY date DESC, lineno DESC LIMIT 2000
```

It also provides cost and units variants (`cost(sum(position))`, `units(sum(position))`), month/week historical groups, period filters with unquoted ISO date literals, tag membership (`'tag' IN tags`), `#commodities`, `#prices`, and commodity holdings grouped by currency. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/queries/index.ts]

## What was tried and failed

- Raw GitHub fetches of release assets returned cache misses, and GitHub Contents correctly returned 404 for `main.js` at tag 2.3.1 because the bundle is not in the tree. Repository source inspection at the exact tag is the verified fallback; do not claim a tracked `main.js` line location.
- Search results for `obsidian-flat-financing` describe a different plugin and were rejected.

## Remaining gaps / next focus

Plugin behavior is resolved. Iteration 2 must verify Beancount v3 grammar, booking/cost-basis semantics, beanquery’s language/CLI, beanprice metadata, validation errors, reconciliation, and CSV-import workflow against primary Beancount/beanquery sources.

## Novelty

`newInfoRatio = 0.86`: this pass established nearly all plugin-specific facts from previously uninspected tag source, including exact keys, commands, paths, arguments, and serializers.
