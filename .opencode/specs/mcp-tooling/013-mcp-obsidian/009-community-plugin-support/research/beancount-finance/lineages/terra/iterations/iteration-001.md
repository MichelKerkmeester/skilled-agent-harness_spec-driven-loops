# Iteration 001 — plugin contract and execution boundary

## Result

The plugin contract is source-backed enough to distinguish the persisted configuration from runtime state and to describe the two external command paths. The review used the tagged repository identity for 2.3.1 and source revision a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81. The repository exposes TypeScript source rather than a tracked built main.js, so src/main.ts is the reviewed equivalent of the release entry bundle.

## Recovered plugin identity and surface

- manifest.json identifies id beancount-finance, name Beancount Ledger, version 2.3.1, author mkshp, desktop-only, and minimum Obsidian version 1.7.2.
- src/main.ts registers .beancount and .bean views, fenced BQL blocks, inline BQL postprocessing, two ribbon actions, settings, onboarding, a connection probe, optional automatic price fetch, and snippets creation.
- It registers these commands:
  - add-beancount-transaction — Add Beancount transaction
  - open-beancount-unified-dashboard — Open Beancount unified dashboard
  - open-beancount-snapshot — Open Beancount snapshot
  - run-beancount-onboarding — Run setup/onboarding
  - format-beancount-document — Format Beancount document
  - fetch-commodity-prices — Fetch commodity prices
  - open-beancount-snippets — Open Beancount snippets file

[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/manifest.json]
[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/main.ts]

## Configuration findings

Settings load by merging raw plugin data over DEFAULT_SETTINGS. Legacy reportingCurrency or defaultCurrency is migrated to operatingCurrency. isConnectionReady is observed runtime state, not a data.json field. The complete persisted schema is carried into synthesis.

[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/settings.ts]

## External process findings

The BQL runner resolves the configured main ledger and command, then executes an argument array equivalent to:

    bean-query -q -f csv /absolute/path/to/main.beancount SELECT ...

It accepts csv, text, or beancount format; caps buffered output at 50 MiB; treats stderr as failure; strips an exact echoed query line; and uses platform-specific Windows/WSL handling. A missing file path or command is an immediate failure.

PriceService resolves beanPriceCommand or an autodetected executable and runs it with the main ledger path. It wraps execution at 60 seconds, treats stderr as informational, extracts only simple positive-decimal price lines, removes exact duplicates against the target price file, then writes through the Obsidian vault API.

[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/utils/queryRunner.ts]
[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/services/price.service.ts]
[SOURCE: https://github.com/mkshp-dev/obsidian-finance-plugin/blob/a686c5003b75de554a4cd1a1cfb9c5c76fe6cb81/src/utils/SystemDetector.ts]

## Boundary conclusion

The plugin deliberately operates on vault-resolved files and passes command arguments rather than constructing a shell command. This reduces shell-injection exposure in the inspected paths, but it does not validate every ledger mutation before write. The latter is an operational gap for a file-layer AI and is deliberately reserved for the final safety pass.
