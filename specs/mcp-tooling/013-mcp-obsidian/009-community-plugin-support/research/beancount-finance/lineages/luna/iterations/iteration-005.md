# Iteration 5 — Errors, reconciliation, CSV import, and AI recipes

## Focus

Close the loop with a layered troubleshooting catalog and repeatable file-layer procedures. The catalog separates parser/loader errors, Beancount semantic errors, BQL/process errors, plugin writer hazards, and external price/CSV failures.

## Findings

1. Current Beancount v3 still exposes the `bean-check` console script (`beancount.scripts.check:main`), and the plugin README describes local execution of `bean-check`, `bean-query`, and `bean-price`. The plugin's editor linter is a different path: it runs bean-query's `.errors` command through `runQuery(..., 'text')`, parses `file:line:message`, and silently returns no diagnostics when the command is unavailable. A full AI validation gate should therefore run `bean-check` directly and use `.errors` for fast editor-local feedback. [SOURCE: https://github.com/beancount/beancount/blob/master/pyproject.toml] [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/README.md] [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/lang/beancount-lint.ts]

2. Parser and lexical failures include malformed dates, which must be ISO `YYYY-MM-DD`; lowercase or invalid currency tokens; account names with spaces or invalid components; missing quotes around descriptions; malformed tags/links; and invalid directive or cost syntax. These errors stop reliable loading before any dashboard query can be trusted. The recovery is to fix the source line named by bean-check, then rerun it from the ledger root. [SOURCE: https://beancount.github.io/docs/getting_started_with_beancount/] [SOURCE: https://beancount.github.io/docs/beancount_language_syntax/] [SOURCE: https://beancount.github.io/docs/running_beancount_and_generating_reports/]

3. Account lifecycle failures include posting before `open`, posting after `close`, a parent account that was never opened, duplicate or invalid account declarations, and a posting currency rejected by an `open` currency constraint. Open/close dates are semantic dates after parsing; moving the line to another included file does not bypass them. Query `#accounts` and inspect `open_date(account)`/`close_date(account)` before adding a posting. [SOURCE: https://beancount.github.io/docs/beancount_language_syntax/] [SOURCE: https://github.com/beancount/beanquery/blob/master/beanquery/sources/beancount.py]

4. Transaction failures include an unbalanced transaction, more than one elided amount, invalid negative cost/price annotations, incompatible currencies with no conversion weight, and a price annotation that does not control a costed posting's balancing weight. One inferred posting can be useful, but an AI import should calculate and emit explicit balancing amounts whenever the source data is known. [SOURCE: https://beancount.github.io/docs/beancount_language_syntax/]

5. Balance and pad failures include a discrepancy outside tolerance, an assertion for the wrong commodity, an assertion that omits a second currency, an assertion against a parent account that was not opened, an unused pad, multiple pads for one account/commodity, and attempts to pad a cost-basis position. `balance` checks units at the beginning of the date; it does not assert total cost. Fix the underlying posting or add a deliberately documented pad only for simple unit balances. [SOURCE: https://beancount.github.io/docs/beancount_language_syntax/] [SOURCE: https://beancount.github.io/docs/getting_started_with_beancount/]

6. Cost-basis failures include no matching lot, insufficient units, ambiguous lot selection under strict booking, mismatched lot date/label/cost, negative cost-basis inventory, and reducing an inventory with a selector that matches the wrong commodity. Read `position`, `cost(position)`, `cost_number`, `cost_currency`, `cost_date`, and `cost_label` before generating a reduction. Do not use a pad to invent a cost basis; record the actual acquisition lot or correct the booking policy. [SOURCE: https://beancount.github.io/docs/how_inventories_work/] [SOURCE: https://beancount.github.io/docs/trading_with_beancount/]

7. Include and layout failures include a missing included file, a newly created target that is not reachable from the root ledger, relative paths resolved from the wrong including file, and layout settings changed without migrating includes. The plugin's Vault write can succeed while bean-query still sees the old graph. Re-read `ledger.beancount`, resolve every include path, then run a one-row `SELECT filename, lineno FROM #entries LIMIT 1` probe against the same root path used by the plugin. [SOURCE: https://beancount.github.io/docs/beancount_language_syntax/] [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/structuredLayout.ts]

8. Query and process failures include missing `beancountCommand`, missing `bean-query`, a failed `--version`/`--help` probe, non-zero exit, stderr output, a query syntax/compile error, invalid CSV shape, WSL path mismatch, timeout, and output over the plugin's 50 MiB cap. The plugin uses shell-free spawned arguments, so quoting should be fixed at the query/value layer rather than by concatenating a shell command. Capture command, arguments, ledger path, exit code, stderr, and stdout before retrying. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/main.ts] [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/queryRunner.ts] [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/execSafe.ts] [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/SystemDetector.ts]

9. The plugin's CSV parsers are intentionally permissive but lossy: they strip CR characters, skip blank lines, skip the first row as a header, relax column counts, ignore malformed short rows, and return empty/default maps on parser exceptions. Commodity conversion parsing explicitly sets converted value to zero when `convert()` returns a cell still denominated in a non-operating currency. An AI must preserve the raw CSV and validate headers/row counts before using a zero or empty result as accounting data. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/csvParsers.ts]

10. Price failures include an unavailable `bean-price` executable, a non-zero/timeout result, missing `commodity` price-source metadata, an unsupported source, no active balance to price, stale or missing price directives, and a valid output line that the plugin's simple regex rejects. The plugin calls only `bean-price <ledger>`, filters dated price lines, deduplicates exact existing lines, and appends to `prices.beancount`; it does not rewrite historical price directives with `--update`. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/services/price.service.ts] [SOURCE: https://github.com/beancount/beanprice/blob/master/beanprice/price.py] [SOURCE: https://github.com/beancount/beanprice/blob/master/README.md]

11. Mutation hazards include writing to a noncanonical file, duplicate open/commodity/price directives, unescaped quotes in named queries or metadata, stale filename/lineno after another edit, missing backup, format-on-save changing a diff, and a valid directive that is never included. The plugin's update/delete path reads filename and lineno from BQL immediately before editing, but an external AI should perform the same read-after-write verification and never reuse cached line numbers across mutations. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/transactionDirectives.ts] [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/queryDirectives.ts] [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/settings.ts]

12. The plugin has no dedicated bulk CSV-import workflow in the inspected v2.3.1 source. A safe AI import is: preserve the source CSV; define a column map and account/currency map; parse and normalize every date to ISO; group records by target year/month; create explicit two-sided postings; write to the canonical transaction files; run `bean-check`; compare source running balances against BQL balances; and only then add balance assertions or archive the import. [INFERENCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/csvParsers.ts] [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/structuredLayout.ts] [SOURCE: https://github.com/beancount/beanquery/blob/master/beanquery/sources/beancount.py]

13. Reconciliation should use the bank statement's ending date and balance as an external assertion, not as a blind balancing plug. Query the account's latest postings and `#balances`, determine the difference, inspect currency and opening/closing dates, then add the missing transaction or a documented simple-currency pad. For investment accounts, reconcile units and lots separately from market value and never use a cash-style pad to resolve a cost-basis discrepancy. [SOURCE: https://beancount.github.io/docs/getting_started_with_beancount/] [SOURCE: https://beancount.github.io/docs/beancount_language_syntax/] [SOURCE: https://beancount.github.io/docs/how_inventories_work/]

14. AI recipe — add an account: read `ledger.beancount` and `#accounts`; confirm parent accounts and desired currency constraints; append `YYYY-MM-DD open Assets:Bank:Checking USD` to `accounts.beancount`; ensure the include exists; run `bean-check`; then query the account's open date. If the account represents a historical nonzero balance, add a separate opening transaction or carefully scoped pad before the first assertion. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/accountDirectives.ts] [SOURCE: https://beancount.github.io/docs/getting_started_with_beancount/]

15. AI recipe — append a balanced transaction: read open/close dates, currency constraints, current positions, and price/cost requirements; calculate every known posting weight; emit a dated header and explicit postings into the year/month target; preserve tags/links/metadata; backup; run `bean-check`; then query `SELECT id, date, narration, filename, lineno FROM #entries WHERE date = <date> ORDER BY lineno DESC LIMIT 10`. If a posting is costed, verify the lot selector and the balancing currency separately. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/transactionDirectives.ts] [SOURCE: https://github.com/beancount/beanquery/blob/master/beanquery/sources/beancount.py] [SOURCE: https://beancount.github.io/docs/beancount_language_syntax/]

16. AI recipe — dashboard-compatible readback: use `number(only('USD', convert(sum(position), 'USD')))` for a scalar only after filtering one account root and date range; use `sum(cost(position))` for cost basis; use `units(sum(position))` for units; use `getprice()` only with a known price path; and use `SELECT ... FROM #postings ORDER BY date, lineno` for a register. Always query the raw inventory and currency beside a converted scalar when a result drives a decision. [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/queries/index.ts] [SOURCE: https://github.com/beancount/beanquery/blob/master/beanquery/query_env.py]

17. AI recipe — validate and troubleshoot: run `bean-check ledger.beancount`; if it fails, classify the first error as parser, account lifecycle, balance/weight, cost-lot, include, or plugin-path; fix one source block; rerun; then run `.errors`/`SELECT ...` probes. Do not suppress errors with beanquery `-q` while diagnosing, and do not interpret the plugin's empty lint result as “clean” when the executable or ledger path was unavailable. [SOURCE: https://beancount.github.io/docs/running_beancount_and_generating_reports/] [SOURCE: https://github.com/beancount/beanquery/blob/master/beanquery/shell.py] [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/lang/beancount-lint.ts]

## Error and Recovery Catalog

| Layer | Symptom | Likely cause | Recovery |
|---|---|---|---|
| Parse | `Invalid date`, malformed directive, or no loaded rows | non-ISO date, indentation, quoting, cost syntax | fix the named line; rerun `bean-check` |
| Account | posting rejected before/after lifecycle | unopened/closed account, parent not open, currency constraint | query `#accounts`; correct open/close or account currency |
| Transaction | “Transaction does not balance” | weights do not sum by currency; wrong `@`/`@@`; missing leg | calculate weights explicitly; add/correct posting |
| Balance | assertion discrepancy | wrong units/date/commodity/tolerance | compare `#balances` and postings; fix data or add deliberate assertion |
| Pad | unused/multiple/cost-basis pad error | no matching subsequent assertion or lot-backed position | remove pad or replace with real transaction/lot data |
| Lot | ambiguous/insufficient/negative inventory | wrong cost/date/label/booking or sale quantity | inspect `cost(position)` and lot columns; choose exact lot |
| Include | query sees old data | target not included or relative path wrong | repair root include graph; probe `filename` |
| BQL | compile error/empty CSV | bad grammar, wrong row grain, filter, conversion | run small `SELECT`; use explicit `FROM #...`; capture stderr |
| Process | command unavailable/timeout/cap | setting/path/package/WSL/output issue | probe executable; check paths; narrow query; inspect `SpawnError` |
| Price | no new price rows | metadata/source/market/output/regex/timeout issue | inspect commodity metadata and raw bean-price output; query `#prices` |
| Mutation | wrong block changed or duplicate directive | stale line number, concurrent edit, no backup | restore backup; re-query location; apply one atomic change |
| CSV | missing/zero/shifted values | header/row count/quote/currency conversion parse issue | preserve raw CSV; validate schema; reject silent defaults |

## Ruled Out

- The plugin does not provide a first-class bulk CSV importer in the inspected v2.3.1 source.
- `.errors`/editor lint is not a full substitute for `bean-check`, and an empty lint result can mean the command was skipped.
- A balance assertion or converted dashboard scalar is not proof that every currency and cost lot reconciles.
- Automatic pricing is not historical price maintenance because the plugin does not pass bean-price update flags.

## Dead Ends

- The older official “Running Beancount” page documents `bean-check` behavior but explicitly describes v2-era tooling; current v3 availability was verified from Beancount's `pyproject.toml` console scripts.
- The plugin source search found README-level bean-check capability and editor `.errors` integration, but no separate v2.3.1 `getBeanCheckCommand` implementation; direct validation invocation remains an operational workflow rather than a verified plugin service method.
- Silent CSV parser defaults cannot be used as a correctness signal; raw input and row-level validation are required.

## Edge Cases

- A valid account can have a negative simple-currency balance; do not classify it as a cost-basis error.
- A balance assertion can pass for USD while EUR or security units remain unreconciled.
- Same-day price directives, same-day transactions, and line-based mutation all need deterministic ordering/readback.
- A missing market price can leave the raw holding intact while its converted dashboard value is absent or zeroed by parser logic.
- Bulk import can be balanced per transaction while the running bank balance still disagrees because of a missing opening balance, duplicate row, or sign inversion.
- Restoring a backup may restore text but not an already-refreshed dashboard; rerun the query after recovery.

## Sources Consulted

- [SOURCE: https://github.com/beancount/beancount/blob/master/pyproject.toml]
- [SOURCE: https://beancount.github.io/docs/getting_started_with_beancount/]
- [SOURCE: https://beancount.github.io/docs/running_beancount_and_generating_reports/]
- [SOURCE: https://beancount.github.io/docs/beancount_language_syntax/]
- [SOURCE: https://beancount.github.io/docs/how_inventories_work/]
- [SOURCE: https://beancount.github.io/docs/trading_with_beancount/]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/README.md]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/lang/beancount-lint.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/csvParsers.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/structuredLayout.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/accountDirectives.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/transactionDirectives.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/services/price.service.ts]
- [SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/queryRunner.ts]
- [SOURCE: https://github.com/beancount/beanquery/blob/master/beanquery/shell.py]
- [SOURCE: https://github.com/beancount/beanquery/blob/master/beanquery/query_env.py]
- [SOURCE: https://github.com/beancount/beanquery/blob/master/beanquery/sources/beancount.py]
- [SOURCE: https://github.com/beancount/beanprice/blob/master/beanprice/price.py]
- [SOURCE: https://github.com/beancount/beanprice/blob/master/README.md]

## Assessment

The reliable operating contract is layered: preserve and route text, validate with `bean-check`, query with beanquery, and treat plugin UI/process helpers as fallible adapters. This catches both accounting errors and integration errors that a dashboard alone can conceal.

## Reflection

The hardest failure to diagnose is a false zero: permissive CSV parsing, hidden `-q` diagnostics, missing includes, absent prices, and skipped lints can all make “no data” look like a valid result. The recovery protocol must always retain raw command output and query the underlying ledger directly.

## Recommended Next Focus

All requested research angles are covered; synthesize the verified knowledge base and publish the resource map/convergence record inside this lineage.
