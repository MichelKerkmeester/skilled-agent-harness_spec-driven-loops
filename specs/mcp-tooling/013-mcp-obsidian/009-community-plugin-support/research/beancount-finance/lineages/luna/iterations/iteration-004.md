# Iteration 4 — UI surface, commands, and file-layer workflows

## Focus

Map the user-visible plugin surface and settings to the structured Beancount files that an AI would inspect or mutate directly.

## Findings

1. The unified dashboard view is an Obsidian `ItemView` with view type `beancount-unified-dashboard`. It instantiates controllers for Overview, Transactions, Balance Sheet, Commodities, and Income Statement, and passes the journal store for the Journal tab. A refresh reloads all controller datasets and the journal store together. The visible dashboard is therefore a collection of query-backed views over one ledger, not a separate persisted reporting database. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/ui/views/dashboard/unified-dashboard-view.ts] [SOURCE: https://mkshp-dev.github.io/obsidian-finance-plugin/]

2. The documented dashboard surface is Overview, Transactions, Journal, Accounts & Balances, Income Statement, and Commodities. Overview exposes net-worth and period metrics; Transactions exposes filtered transaction results; Journal exposes transactions, balances, and notes; Accounts & Balances maps to the balance-sheet queries; Income Statement maps to period income/expense queries; Commodities combines declarations, holdings, metadata, and price history. These labels describe projections of Beancount text and BQL results, not additional source-of-truth objects. [SOURCE: https://mkshp-dev.github.io/obsidian-finance-plugin/] [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/ui/views/dashboard/unified-dashboard-view.ts] [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/queries/index.ts]

3. The plugin registers commands for adding a Beancount transaction, opening the unified dashboard, opening a snapshot, running onboarding, formatting a Beancount document, fetching commodity prices, and opening snippets. It also registers `.beancount` and `.bean` file views. The command IDs are `add-beancount-transaction`, `open-beancount-unified-dashboard`, `open-beancount-snapshot`, `run-beancount-onboarding`, `format-beancount-document`, `fetch-commodity-prices`, and `open-beancount-snippets`. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/main.ts]

4. The structured layout has a root folder controlled by `structuredFolderName` (default `Finances`) and canonical files `ledger.beancount`, `accounts.beancount`, `commodities.beancount`, `prices.beancount`, `pads.beancount`, `balances.beancount`, `queries.beancount`, `notes.beancount`, `events.beancount`, plus a `transactions` directory. The generated root ledger includes these targets in a stable organizational order. Transactions route to `transactions/YYYY.beancount` for yearly organization or `transactions/YYYY/YYYY-MM.beancount` for monthly organization, controlled by `fileOrganization` (default `yearly`). [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/structuredLayout.ts] [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/settings.ts]

5. `getTargetFile()` routes directive kinds rather than asking the caller to choose a path: account/open and close directives go to `accounts.beancount`; commodity declarations to `commodities.beancount`; prices to `prices.beancount`; pads to `pads.beancount`; balances to `balances.beancount`; notes to `notes.beancount`; events/indicators to `events.beancount`; named queries to `queries.beancount`; and transactions to the date-derived transaction file. An AI should use the same routing model and then verify that the root ledger includes the file. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/structuredLayout.ts]

6. The unified transaction modal supports add flows for transaction, balance, open-account, close-account, note, and named query. It supports edit/delete for transaction, balance, and note. Open/close entries are creation-only in this modal, and pad creation is explicitly unsupported. Direct file edits remain necessary for pads, bulk imports, custom metadata, and any directive combination not represented by the modal. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/ui/modals/UnifiedTransactionModal.ts] [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/models/journal.ts]

7. Transaction writers format headers, flags, payees, narrations, tags, links, metadata, postings, cost lots, prices, posting comments, and posting metadata. They append through the Vault API and can create backups, but they do not run bean-check before returning success. Update/delete first query filename and lineno, then replace or remove the corresponding block. A file-layer AI should snapshot the target file, append a complete block, and run a ledger validation step rather than treating writer success as accounting success. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/transactionDirectives.ts] [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/fileEditor.ts]

8. Account, commodity, price, balance, note, query, and indicator writers follow the same text-first pattern with directive-specific validation. Account open lines can include currency constraints and a booking method; price writers require a valid date/symbol/amount/currency and format the amount to two decimals; balance writers include an optional tolerance; query writers escape embedded double quotes; notes and indicators carry metadata/tags where supported. The validation is local shape validation, not full Beancount semantic validation. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/accountDirectives.ts] [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/commodityDirectives.ts] [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/balanceDirectives.ts] [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/noteDirectives.ts] [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/queryDirectives.ts] [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/indicatorDirectives.ts]

9. The Beancount file view is a CodeMirror 6 `TextFileView` for `.beancount` and `.bean`. It provides syntax highlighting, indentation, account/snippet completion, optional user snippets, format commands, and a linter whose source is a bean-query `errors` query. `formatOnSave`, `accountAutocomplete`, `enableUserSnippets`, and `lintMode` control these behaviors; the editor's lint result is not a substitute for a full `bean-check` run. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/ui/views/beancount-file-view.ts] [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/settings.ts]

10. The persisted settings object in `.obsidian/plugins/beancount-finance/data.json` is merged over defaults. The full v2.3.1 key set is `beancountCommand`, `operatingCurrency`, `maxTransactionResults`, `maxJournalResults`, `dashboardDefaultPeriod`, `bqlShowTools`, `bqlShowQuery`, `debugMode`, `createBackups`, `maxBackupFiles`, `structuredFolderName`, `fileOrganization`, `autoPriceFetch`, `priceFetchIntervalHours`, `lastAutoPriceFetch`, `beanPriceCommand`, `accountAutocomplete`, `enableUserSnippets`, `formatOnSave`, `lintMode`, and `onboardingCompleted`. A missing key receives its default; runtime connection readiness is not persisted. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/settings.ts] [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/main.ts]

11. The behavior-changing defaults are: `operatingCurrency: "USD"`, transaction/journal caps `2000`/`1000`, dashboard period `this-month`, BQL tools shown and query hidden, debug off, backups enabled with ten retained files, structured root `Finances`, yearly transaction organization, automatic price fetch off with a 24-hour interval, account autocomplete on, user snippets and format-on-save off, lint mode `on-save`, and onboarding incomplete. The settings UI caps transaction results at 10000, journal results at 5000, backups at 1000, requires positive query/interval values, and can persist operating currency to Beancount's `option operating_currency`. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/settings.ts]

12. Snippets live at `<structuredFolderName>/snippets.beancount`; the plugin can create a named snippet from a journal transaction, including postings, costs, prices, tags, links, comments, and metadata. User snippets are opt-in through `enableUserSnippets`, and the built-in snippet/autocomplete path is separate from ledger directives. An AI can use snippets as reusable templates, but should not confuse them with included ledger state unless the root ledger explicitly includes the snippets file. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/main.ts] [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/ui/partials/dashboard/JournalTab.svelte]

13. A safe file-layer workflow is: locate or initialize the structured root; read every include and current settings; query open accounts, currencies, balances, and relevant lots; route the new directive to its canonical target; make a backup; write one complete block; confirm the target is included; run `bean-check` and a small bean-query probe; then refresh the dashboard or reopen the file. This sequence matches the plugin's architecture while adding the semantic validation its writers intentionally omit. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/structuredLayout.ts] [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/transactionDirectives.ts] [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/main.ts]

## File-Layer Workflow Map

| Goal | Read first | Write target | Post-write check |
|---|---|---|---|
| Add account | `accounts`, `ledger.beancount`, existing account names | `accounts.beancount` | `bean-check`; query `#accounts` |
| Add transaction | open accounts, balances, prices/lots, target year/month | routed transaction file | `bean-check`; query transaction by date/narration/id |
| Add balance assertion | account open state and latest units | `balances.beancount` | `bean-check`; query `#balances` and discrepancy |
| Add price | commodity declaration and source metadata | `prices.beancount` or bean-price output | query `#prices`; inspect price date |
| Add note | account and include graph | `notes.beancount` | query `#notes` |
| Add named query | query name collision and quote escaping | `queries.beancount` | run `bql-q:<name>` or direct bean-query |
| Add pad | subsequent balance assertion and cost-basis status | `pads.beancount` | `bean-check`; inspect synthetic `P` transaction |
| Import CSV | column mapping, dates, currencies, account map | routed transaction files | batch `bean-check`; reconciliation query |

## Ruled Out

- The dashboard is not an independent database or an alternate ledger; its controllers re-query the configured text ledger.
- The modal is not a complete directive editor: pad creation and general arbitrary metadata edits remain outside its supported write surface.
- A successful local writer return is not proof that the included ledger loads or balances.
- `data.json` is not the accounting state; balances, postings, prices, and notes remain in Beancount files.

## Dead Ends

- Searching for a single “dashboard data file” produced none; state is distributed across generated Beancount targets and query results.
- `bean-check` was not found as the editor linter implementation; the editor linter uses bean-query's `errors` query, so full bean-check remains an external validation step.
- The requested compiled root `main.js` was not available at the inspected release ref; source modules provide the verified contract.

## Edge Cases

- Changing `structuredFolderName` or `fileOrganization` does not automatically migrate existing ledger files; stale includes can leave data invisible.
- A monthly route requires the target directory and year file path to be created consistently with the root include graph.
- Updating by cached filename/lineno after another edit can target the wrong block; re-query immediately before mutation.
- Format-on-save can change whitespace or inferred amount layout; inspect the diff before treating it as a semantic no-op.
- Backup retention and overwrite behavior depend on `createBackups` and `maxBackupFiles`; disable neither for a high-risk bulk operation without an independent snapshot.
- A snippet file can contain valid Beancount syntax yet be semantically inert if it is not included.

## Sources Consulted

- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/main.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/settings.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/structuredLayout.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/ui/views/dashboard/unified-dashboard-view.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/ui/modals/UnifiedTransactionModal.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/ui/views/beancount-file-view.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/transactionDirectives.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/accountDirectives.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/balanceDirectives.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/commodityDirectives.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/queryDirectives.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/indicatorDirectives.ts]
- [SOURCE: https://mkshp-dev.github.io/obsidian-finance-plugin/]

## Assessment

The UI is a convenience layer over a well-defined file graph. An AI at the FILE LAYER can reproduce nearly all durable behavior by following the structured routing and writer formats, but must add explicit backups, include checks, and `bean-check` validation at every mutation boundary.

## Reflection

The distinction between “supported by the modal” and “representable in Beancount” matters. The plugin renders a broad data model, while the UI intentionally leaves pads, bulk imports, and arbitrary metadata to direct file workflows.

## Recommended Next Focus

Build the complete validation, error, reconciliation, CSV-import, and AI-usage catalog, including bean-check failure classes and recovery actions.
