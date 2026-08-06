---
title: Beancount Ledger Troubleshooting
description: "Cause, detection, and file-layer recovery for Beancount Ledger parse, account, balance, lot, BQL, bean-price, PATH, include, and concurrent-edit failures."
trigger_phrases:
  - "beancount ledger error"
  - "bean-query not found"
  - "bean-price not detected"
  - "bean-check failed"
  - "beancount unopened account"
  - "beancount swallowed load errors"
  - "beancount cost basis lot error"
importance_tier: "normal"
contextType: "general"
version: 0.1.0.0
---

# Beancount Ledger Troubleshooting

Diagnose the file, the external command, and the plugin process boundary separately. A rendered dashboard or a successful text append is not evidence that the included ledger is valid.

---

## 1. OVERVIEW

Most failures fall into four layers: Beancount parsing and accounting semantics, the include/layout graph, the `bean-query`/`bean-price` executables, and plugin-side presentation or mutation state. The plugin's BQL path uses `-q`, which suppresses ordinary load-error reporting, while its editor lint path uses `.errors`; direct `bean-check` remains the full validation gate. ([queryRunner.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/queryRunner.ts), [beancount-lint.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/lang/beancount-lint.ts), [Beancount getting started](https://beancount.github.io/docs/getting_started_with_beancount/))

### Triage order

1. Resolve the exact root ledger from `structuredFolderName` and read its include graph.
2. Confirm `bean-query`, `bean-price`, and `bean-check` are executable from the relevant process environment.
3. Run `bean-check` and capture stderr before interpreting any dashboard or BQL result.
4. Run `.errors` through bean-query and then a small explicit `#entries`/`#postings` query.
5. Repair one source block, rerun the gates, and only then refresh the Obsidian view.

This order follows the plugin's source boundary and Beancount's file-first validation model. ([structuredLayout.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/structuredLayout.ts), [Beancount running and reports](https://beancount.github.io/docs/running_beancount_and_generating_reports/))

---

## 2. COMMAND DETECTION AND GUI PATH

### The detection symptoms

Typical symptoms are:

- the plugin reports that Beancount is not connected;
- BQL blocks stay empty or fail without useful diagnostics;
- commodity fetching reports no executable or no saved prices;
- `command -v` works in a terminal, but the Obsidian desktop app cannot run the same command.

The plugin readiness path probes the configured `beancountCommand` with `--version` and `--help`. BQL uses `beancountCommand`; price fetching uses `beanPriceCommand`. There is no separate persisted `beanqueryCommand` key. ([main.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/main.ts), [settings.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/settings.ts), [ConnectionSettings.svelte](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/ui/partials/settings/ConnectionSettings.svelte))

### Detect the actual install directory

Run these commands in the shell where the tools are expected to work:

```bash
command -v bean-query || true
command -v bean-price || true
command -v bean-check || true
python3 -m site --user-base
python3 -m site --user-site
```

Python user installs place executables under the user base's `bin` directory. On macOS this is commonly shaped like `~/Library/Python/3.x/bin`, where `3.x` is the active Python version. Add the actual directory, not a guessed version:

```bash
export PATH="$(python3 -m site --user-base)/bin:$PATH"
command -v bean-query
command -v bean-price
command -v bean-check
```

If the tools are not installed in that environment, an example user-local installation is:

```bash
python3 -m pip install --user beancount beanquery beanprice
export PATH="$(python3 -m site --user-base)/bin:$PATH"
```

### Make the GUI process see the tools

Interactive shell startup files and GUI-launched applications can have different `PATH` values. Use one of these two fixes:

1. Set `beancountCommand` and `beanPriceCommand` in `.obsidian/plugins/beancount-finance/data.json` to absolute executable paths, for example:

```json
{
  "beancountCommand": "/Users/alice/Library/Python/3.12/bin/bean-query",
  "beanPriceCommand": "/Users/alice/Library/Python/3.12/bin/bean-price"
}
```

2. Put symlinks to the user-base executables in a system bin directory already inherited by the GUI process, then restart Obsidian so the process re-probes the commands:

```bash
sudo ln -s /Users/alice/Library/Python/3.12/bin/bean-query /usr/local/bin/bean-query
sudo ln -s /Users/alice/Library/Python/3.12/bin/bean-price /usr/local/bin/bean-price
```

Use the real user, Python version, and system bin directory. Do not write a path that only exists in another shell or machine. The plugin accepts configured command prefixes and uses spawned argument arrays; fix the executable path rather than concatenating shell text into a query. ([queryRunner.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/queryRunner.ts), [execSafe.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/execSafe.ts), [SystemDetector.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/SystemDetector.ts))

### Verify the configured path

Run the same probes the plugin uses, then the plugin-equivalent commands:

```bash
"/absolute/path/to/bean-query" --version
"/absolute/path/to/bean-query" --help
"/absolute/path/to/bean-price" --help
bean-check "/path/to/Vault/Finances/ledger.beancount"
```

If terminal probes pass but the plugin remains disconnected, inspect the JSON spelling and reload/restart the plugin process. `isConnectionReady` is runtime state; it is not a key to add to `data.json`. ([main.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/main.ts), [settings.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/settings.ts))

---

## 3. ERROR CATALOG

The table is the first response for a concrete symptom. Detection must use the same root ledger the plugin uses; checking a different standalone file can produce a false clean result.

| Symptom | Cause | Detection | Fix |
|---|---|---|---|
| `Transaction does not balance` | Posting signs, amounts, rounding, or conversion weights do not cancel in every balancing currency. | `bean-check "$LEDGER"`; inspect `number`, `currency`, `price`, and `weight` in `#postings`. | Correct the source postings; add explicit `@`/`@@` for conversion; do not balance by nominal units alone. |
| `Account ... does not exist` or posting before account open | Missing `open`, an open date after the posting, invalid account name, or missing opened parent for a parent assertion. | `bean-check`; `SELECT account, open_date(account), close_date(account) FROM #accounts`. | Add or correct the dated `open` in `accounts.beancount`; do not create a spelling variant to hide the missing declaration. |
| Posting after close | The account has a `close` date on or before the posting date. | Query `close_date(account)` from `#accounts`. | Move the posting before close or correct the lifecycle directive if the close was wrong. |
| Currency not allowed | The posting commodity is not in the account's `open` currency constraint. | Read the `open` line and inspect posting `currency` in `#postings`. | Use an allowed commodity or intentionally widen the account's constraint, then rerun `bean-check`. |
| Malformed date or parse error | Date is not ISO `YYYY-MM-DD`, is not a real calendar date, or a directive/token/quote/indentation is malformed. | `bean-check` stderr and `.errors` identify filename and line. | Fix the exact source line; rerun both checks from the root ledger. |
| `bean-check` reports an error after a successful write | Plugin/file writer checked local shape or wrote atomically but did not establish a full semantic validation gate. | Run `bean-check "$LEDGER"` directly and classify the first source error. | Restore the backup if needed, repair one directive, and validate the complete include graph before refreshing the UI. |
| Balance assertion fails | Wrong statement date, wrong sign, duplicate/missing posting, wrong commodity, or amount outside tolerance. | Query `#balances` and account postings through the assertion date. | Repair the underlying postings; add one assertion per currency. Use a `pad` only for a deliberate simple-unit difference tied to a later assertion. |
| Unused or duplicate `pad` error | No subsequent matching assertion, multiple pads for one account/commodity, or a cost-basis position is being padded. | `bean-check`; inspect `pads.beancount` and the next balance assertion. | Remove the redundant pad or replace it with a real opening/adjustment transaction; never use a pad to invent a lot. |
| Ambiguous cost-basis booking | `{}` matches multiple lots under strict booking, or the reduction omits a required cost/date/label selector. | Query `position`, `cost_number`, `cost_currency`, `cost_date`, and `cost_label` from `#postings`. | Select the exact lot, split the reduction, or use the account's declared booking policy intentionally. |
| Insufficient or negative cost-basis inventory | Sale quantity exceeds matching units, matches the wrong lot, or the acquisition is missing. | Inspect current inventory and lot fields before the reduction; rerun `bean-check`. | Add/correct the actual acquisition or reduce the correct lot quantity; do not use `pad` for cost inventory. |
| BQL returns rows despite an invalid ledger | Plugin passes `-q`, which hides normal load errors. | Run `.errors` and `bean-check`; retain stderr/stdout. | Treat `.errors` and `bean-check` as mandatory validation; do not treat BQL success as ledger validity. |
| `.errors` is empty but the ledger is not clean | The executable was unavailable, the wrong ledger path was checked, or the query did not reach the intended include graph. | Check `command -v`, inspect exit code, run `bean-check`, and query `filename` from `#entries`. | Fix the command/path/include problem, then rerun `.errors`; an empty lint result is not proof when the lint process was skipped. |
| BQL fails with stderr or compile error | Query grammar, quoting, wrong row grain, invalid field, missing include, or plugin's non-empty-stderr failure rule. | Run the exact `bean-query -q -f text "$LEDGER" "..."` argv in the terminal. | Reduce to a one-row `SELECT`, use explicit `FROM #...`, fix the expression, and rerun `.errors`. |
| `bean-query` not found / not detected | Package install directory is not on the terminal or GUI `PATH`; `beancountCommand` is empty or wrong. | `command -v bean-query`; `python3 -m site --user-base`; plugin `--version`/`--help` probe. | Add the user-base `bin` directory to `PATH`, configure an absolute `beancountCommand`, or provide a system-bin symlink; restart Obsidian. |
| `bean-price` not found / not detected | Package install directory is not on the GUI `PATH`, or `beanPriceCommand` is empty/wrong. | `command -v bean-price`; `bean-price --help`; inspect `beanPriceCommand`. | Add the user-base `bin` directory, set an absolute `beanPriceCommand`, or add a system-bin symlink; restart Obsidian. |
| No new prices saved | Missing commodity `price:` metadata, unsupported provider, network/provider failure, no active balance, no parsable output, or exact duplicate. | Run `bean-price "$LEDGER"` directly; inspect stdout/stderr and query `#commodities`/`#prices`. | Correct metadata or environment, inspect raw output, and append only valid new dated price lines. Never invent a price. |
| Price output exists but plugin appends nothing | Output does not match the service's narrow dated-price parser or the line already exists in `prices.beancount`. | Compare raw output with `YYYY-MM-DD price SYMBOL NUMBER CURRENCY`; search exact lines in the target file. | Normalize only when the source line is semantically valid; preserve existing exact directives and rerun the readback query. |
| Query times out or output is too large | Bean-query work exceeds the plugin process timeout/environment or the 50 MiB output cap. | Run the command directly with timing and a narrow `LIMIT`; inspect stderr. | Narrow date/account/currency filters, choose the right virtual table, and page the result. |
| New component file is ignored | File is not included by `ledger.beancount`, relative include path is wrong, or `structuredFolderName` changed without migration. | Read every `include`, resolve paths relative to the root, and query `filename` from `#entries`. | Repair the include graph or migrate the layout, then rerun `bean-check` and a focused query. |
| Empty BQL result or inline `0 USD` looks like a real zero | Filter/date range is wrong, row grain is wrong, price conversion is missing, file is not included, or the UI uses its empty-result display fallback. | Run raw `-f csv`/`-f text` query, inspect `#postings`, and query `#prices` separately. | Verify the source rows and valuation path before making an accounting decision. |
| Wrong transaction block changed | Cached `filename`/`lineno` became stale after another edit or format-on-save changed line positions. | Re-run the location query immediately before mutation; compare file content/hash. | Abort on concurrent change, re-read and re-plan the edit, and use a fresh backup. |
| Duplicate open/commodity/price directive | Import or retry appended a directive without checking existing declarations. | Search the exact account/commodity/price line and run `bean-check`. | Deduplicate according to the ledger's intended history; do not blindly delete a valid dated price series. |

The error classes and recoveries above follow the Beancount language/inventory rules and the inspected plugin paths for structured routing, linter behavior, process execution, price parsing, and transaction writes. ([Beancount syntax](https://beancount.github.io/docs/beancount_language_syntax/), [inventory booking](https://beancount.github.io/docs/how_inventories_work/), [structured layout](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/structuredLayout.ts), [price service](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/services/price.service.ts))

---

## 4. THE `-q` / `.ERRORS` TRAP

The plugin's `runQuery()` passes `-q`; beanquery documents this as suppressing normal ledger validation errors on load. A query can therefore return apparently useful rows while the source has errors. The plugin's linter compensates by executing the built-in `.errors` query and parsing its text output, but the linter can also return no diagnostics when the command is unavailable. ([queryRunner.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/queryRunner.ts), [beancount-lint.ts](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/lang/beancount-lint.ts), [beanquery shell](https://github.com/beancount/beanquery/blob/master/beanquery/shell.py))

Use this sequence when a result looks suspicious:

```bash
command -v bean-query
bean-check "$LEDGER"
bean-query -q -f text "$LEDGER" ".errors"
bean-query -q -f text "$LEDGER" \
  "SELECT filename, lineno, date, type FROM #entries ORDER BY date DESC, lineno DESC LIMIT 20"
```

Interpret an empty `.errors` result as clean only when the command was found, exited successfully, and the queried ledger path is the intended root. If any of those conditions is unknown, the result is **unverified**, not clean.

---

## 5. ACCOUNTING EDGE CASES

### Weights, prices, and currencies

Every transaction must balance by weight in each balancing currency. A raw USD posting and a raw EUR posting do not cancel; `@` is a per-unit conversion and `@@` is a total conversion. For a costed posting, the lot cost controls balancing while a simultaneous price is market-price information. ([Beancount language syntax](https://beancount.github.io/docs/beancount_language_syntax/))

When an entry fails, inspect the exact posting rows rather than adding a balancing plug:

```bash
bean-query -q -f text "$LEDGER" \
  "SELECT date, account, number, currency, price, cost_number, cost_currency, weight FROM #postings WHERE date = 2026-08-02 ORDER BY lineno"
```

### Lot booking

Under strict booking, a partial reduction that matches multiple lots is ambiguous. Query `cost_date` and `cost_label` as well as cost amount/currency, then emit the selector that identifies the intended lot. FIFO/LIFO is an account policy, not a reason to assume a lot when the account has no declared method. ([how inventories work](https://beancount.github.io/docs/how_inventories_work/), [Beancount syntax](https://beancount.github.io/docs/beancount_language_syntax/))

### Assertions and pads

`balance` checks one commodity's units at the beginning of its date. A successful USD assertion does not validate another currency or a security cost basis. `pad` is tied to a later matching balance assertion, fails when unused, and is not suitable for cost-basis inventory. ([Beancount language syntax](https://beancount.github.io/docs/beancount_language_syntax/))

---

## 6. FILE-LAYER RECOVERY

### Recover a failed mutation

1. Stop further writes to the affected component.
2. Preserve the current file and the backup; do not overwrite evidence.
3. Run `bean-check` against the root ledger and capture the first error location.
4. Run `.errors` and a narrow `#entries`/`#postings` query.
5. Repair only the identified source block, or restore the backup if the intended change cannot be isolated.
6. Re-run the complete validation sequence and query the changed directive by file/line.

The plugin's own writers can create backups and use atomic replacement, but the file-layer agent must still detect concurrent edits and validate the resulting include graph. ([file editor](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/fileEditor.ts), [transaction directives](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/directives/transactionDirectives.ts))

### Related resources

- [`data-model.md`](data-model.md) — settings, layout, directives, BQL, and price semantics.
- [`workflows.md`](workflows.md) — add, append, import, price, reconcile, and validate recipes.
- [`../../../assets/plugins/beancount-finance/ledger.example.beancount`](../../../assets/plugins/beancount-finance/ledger.example.beancount) — valid starter ledger.
- [`../../../assets/plugins/beancount-finance/beancount-data.example.json`](../../../assets/plugins/beancount-finance/beancount-data.example.json) — complete settings payload.
- [`../../../assets/workflows.md`](../../../assets/workflows.md) — shared cross-plugin workflow asset.

---

## 7. SOURCES

- [Beancount Ledger manifest](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/manifest.json)
- [Plugin settings](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/settings.ts)
- [Plugin startup and command detection](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/main.ts)
- [BQL process runner](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/queryRunner.ts)
- [Safe process execution](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/execSafe.ts)
- [Price service](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/services/price.service.ts)
- [Editor lint and `.errors`](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/lang/beancount-lint.ts)
- [Structured layout](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/structuredLayout.ts)
- [Beancount language syntax](https://beancount.github.io/docs/beancount_language_syntax/)
- [How inventories work](https://beancount.github.io/docs/how_inventories_work/)
- [beanquery shell](https://github.com/beancount/beanquery/blob/master/beanquery/shell.py)
- [beanprice README](https://github.com/beancount/beanprice/blob/master/README.md)
