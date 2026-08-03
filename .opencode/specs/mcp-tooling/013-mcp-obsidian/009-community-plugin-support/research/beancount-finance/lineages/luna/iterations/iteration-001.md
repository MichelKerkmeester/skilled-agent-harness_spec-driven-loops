# Iteration 1 — plugin-owned contract

## Focus

Source verification of the Beancount Ledger plugin at the 2.3.1 source ref: persisted settings, commands, structured layout, directive writers, and the bean-query/bean-price process boundary.

## Findings

1. The available 2.3.1 source is TypeScript under `src/`; `src/main.ts` is the authoritative source inspected for this lineage. A fetch of the expected repository-root compiled `main.js` returned 404, so claims below are source-verified against `src/main.ts` and its imported modules, not reverse-engineered from a compiled bundle. This is an evidence gap to retain in the final knowledge base. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/main.ts] [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/main.js]

2. The persisted `.obsidian/plugins/beancount-finance/data.json` schema is the `BeancountPluginSettings` object merged over `DEFAULT_SETTINGS` by `loadData()` and `Object.assign()`. The complete key set is: `beancountCommand` (`""`), `operatingCurrency` (`"USD"`), `maxTransactionResults` (`2000`), `maxJournalResults` (`1000`), `dashboardDefaultPeriod` (`"this-month"`), `bqlShowTools` (`true`), `bqlShowQuery` (`false`), `debugMode` (`false`), `createBackups` (`true`), `maxBackupFiles` (`10`), `structuredFolderName` (`"Finances"`), `fileOrganization` (`"yearly"`), `autoPriceFetch` (`false`), `priceFetchIntervalHours` (`24`), `lastAutoPriceFetch` (`0`), `beanPriceCommand` (`""`), `accountAutocomplete` (`true`), `enableUserSnippets` (`false`), `formatOnSave` (`false`), `lintMode` (`"on-save"`), and `onboardingCompleted` (`false`). [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/settings.ts]

3. `isConnectionReady` is runtime state, not a persisted data.json key. On load, the plugin probes the configured `beancountCommand` with `--version` and then `--help`; the in-memory readiness flag controls connection-dependent views. The persisted command fields are `beancountCommand` for bean-query and `beanPriceCommand` for bean-price. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/main.ts] [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/ui/partials/settings/ConnectionSettings.svelte]

4. Settings migration is observable and must be preserved by a file-layer AI: if `operatingCurrency` is absent, legacy `reportingCurrency` or `defaultCurrency` is uppercased and saved; if a legacy record has `structuredFolderName` but no `onboardingCompleted`, onboarding is marked complete and saved. Unknown future keys are retained by the raw object merge, but a missing known key receives the current default. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/main.ts]

5. The registered command IDs are `add-beancount-transaction`, `open-beancount-unified-dashboard`, `open-beancount-snapshot`, `run-beancount-onboarding`, `format-beancount-document`, `fetch-commodity-prices`, and `open-beancount-snippets`. The plugin also registers `.beancount` and `.bean` file views, the `bql` fenced code-block processor, and inline BQL post-processing. There is no registered “insert BQL query block” command in this source. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/main.ts]

6. Structured layout routes the vault through `Finances/ledger.beancount` (or the configured `structuredFolderName`) and includes `commodities.beancount`, `accounts.beancount`, `prices.beancount`, `pads.beancount`, `balances.beancount`, `queries.beancount`, `notes.beancount`, `events.beancount`, plus transaction files under `transactions/`. Yearly mode writes `transactions/YYYY.beancount`; monthly mode writes `transactions/YYYY/YYYY-MM.beancount`. The generated include order is commodities, accounts, prices, pads, balances, queries, notes, events, then transaction files. The generated ledger also writes `option "operating_currency" "<currency>"`. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/structuredLayout.ts]

7. The UI/file writers support direct append or targeted replacement of transactions, balances, open/close directives, notes, commodities, prices, and named query directives. Transaction rendering supports flags, payee/narration, tags, links, metadata, posting-level flags/comments/metadata, per-unit or total costs (`{}`/`{{}}`), and per-unit or total prices (`@`/`@@`). The transaction writer creates the year/month file, creates a backup, and appends text; it does not itself run bean-check before returning success. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/transactionDirectives.ts] [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/models/journal.ts]

8. The unified entry modal can add transactions, balance assertions, open directives, close directives, notes, and named queries. Pad entries are represented in the journal model and read by journal queries, but the modal explicitly rejects pad creation because there is no pad UI path. A file-layer AI may append a valid `pad` directive to `pads.beancount`, but that is a direct ledger edit rather than a supported modal operation. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/ui/modals/UnifiedTransactionModal.ts] [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/models/journal.ts]

9. BQL execution uses the configured command line as a base command, splits quoted command components, and invokes `spawn()` with a parameterized argument array. `runQuery()` passes `-q -f <format> <ledgerPath> <query>`; default format is CSV, accepted formats are `csv`, `text`, and `beancount`, and the output buffer is capped at 50 MiB. Non-empty stderr is treated as a query failure even after a zero exit code; exact query-echo lines are removed from output. Windows `bean-query` is normalized to `bean-query.exe`, and a command containing `wsl` converts the ledger path to WSL syntax. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/queryRunner.ts] [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/execSafe.ts]

10. Price fetching uses `bean-price <main-ledger-path>` with no extra flags, resolved from `beanPriceCommand` or automatic detection. It races the child process against a 60-second timeout, extracts only lines shaped like `YYYY-MM-DD price COMMODITY NUMBER CURRENCY`, de-duplicates against the target `prices.beancount`, and appends new lines through the vault API. Because no `--update`, `--all`, or `--clobber` flags are supplied, this is a latest-price fetch for the active/declared commodities recognized by bean-price; historical backfill is not implemented by this service call. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/services/price.service.ts] [SOURCE: https://github.com/beancount/beanprice/blob/master/beanprice/price.py]

## Ruled Out

- A separate persisted `beanquery` or `beanqueryPath` setting was not found; the configured BQL executable key is `beancountCommand`.
- A supported pad-creation UI was not found; pad is a readable journal type and a structured file target, not a modal action.
- The available source tree does not expose a repository-root `main.js` at the requested ref. The source-level contract is therefore not claimed to be a byte-for-byte reconstruction of the release bundle.

## Dead Ends

- The GitHub connector rejects release-download URLs, so the compiled release asset could not be fetched through that connector. The source ref remains usable for verification.

## Edge Cases

- `createTransaction()` appends caller-provided text after only structural formatting; balancing, account-open dates, currency constraints, duplicate commodities, and date validity remain Beancount/bean-check responsibilities.
- `saveOpenDirective()` and `saveCloseDirective()` append text without source-level account-name validation; validate account syntax and duplicates before writing.
- `createPriceDirective()` validates date shape, commodity characters, amount, and currency shape, but its `!amount` guard rejects numeric zero. It formats the amount to two decimals, which is a plugin formatting choice, not a Beancount precision rule.
- Targeted update/delete paths depend on BQL returning `filename` and `lineno`; a failed query, missing columns, a WSL path mismatch, or a stale line number prevents safe mutation.
- The current settings cap transaction results at 10,000 and journal results at 5,000 in the UI, while defaults are lower; an AI should not infer that the ledger itself is capped.

## Sources Consulted

- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/main.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/settings.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/structuredLayout.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/queryRunner.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/execSafe.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/services/price.service.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/transactionDirectives.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/ui/modals/UnifiedTransactionModal.ts]
- [SOURCE: https://github.com/beancount/beanprice/blob/master/beanprice/price.py]

## Assessment

This iteration resolves the plugin-owned schema and file/process boundary. The durable AI contract is local vault text plus `data.json`; the plugin does not provide a transactional database layer or a pre-write balance guarantee. The next iteration must verify Beancount v3 directive grammar, chronological semantics, balancing weights, assertions, padding, prices, includes, and cost-basis lots.

## Reflection

The source separates UI routing from ledger validity. The most important unresolved risk is confusing “writer returned success” with “ledger is valid”; every AI write must be followed by bean-check and a focused BQL readback.

## Recommended Next Focus

Beancount v3 directive semantics and cost-basis inventory behavior, with primary documentation for open, transaction/postings, balance, pad, note, commodity, price, include, multi-currency, and lot reductions.
