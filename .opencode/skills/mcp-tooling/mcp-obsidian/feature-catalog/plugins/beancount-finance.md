---
title: "Beancount Ledger file-layer operations"
description: "Append, query, price, and validate Beancount Ledger files for the beancount-finance community plugin."
trigger_phrases:
  - "beancount finance file layer"
  - "append balanced beancount transaction"
  - "bean-query dashboard query"
  - "bean-price price directive"
  - "bean-check ledger validation"
version: 0.1.0.0
---

# Beancount Ledger file-layer operations (`beancount-finance`)

## 1. OVERVIEW

`beancount-finance` is the **Beancount Ledger** community plugin from `mkshp-dev/obsidian-finance-plugin`. It renders and queries structured plain-text Beancount files; the durable contract is the ledger and its configured include tree, not the plugin dashboard.

The file layer can append balanced transactions and other Beancount directives, run `bean-query`/`bean-price` when those executables are available, and validate the resulting ledger with `bean-check`. Settings changes belong in the plugin's `data.json`; do not invent a separate database or drive the plugin UI.

## 2. HOW IT WORKS

Read the configured root ledger and its included component files before editing. Append a transaction only after the posting accounts are opened, preserve Beancount's dated directive syntax, and keep the postings balanced in each currency. Use BQL for read-side aggregation and `bean-price` only for parsable price directives; a dashboard reload is the final user-visible render check after a file write.

The safe workflow is read → patch the smallest ledger file → run a syntax/ledger check → inspect the diff → reload the relevant Obsidian view. If `bean-check`, `bean-query`, or `bean-price` is missing, report that boundary rather than claiming validation or a price fetch succeeded.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Shared | Routes finance-specific requests to only the Beancount Ledger reference family. |
| [`../../references/plugins/plugin-operation-logic.md`](../../references/plugins/plugin-operation-logic.md) | Shared | Defines the file-layer-over-UI operating boundary. |
| [`../../references/plugins/beancount-finance/data-model.md`](../../references/plugins/beancount-finance/data-model.md) | Plugin | Defines settings, structured layout, directives, BQL, and price behavior. |
| [`../../references/plugins/beancount-finance/workflows.md`](../../references/plugins/beancount-finance/workflows.md) | Plugin | Defines transaction, query, price, import, reconciliation, and validation recipes. |
| [`../../references/plugins/beancount-finance/troubleshooting.md`](../../references/plugins/beancount-finance/troubleshooting.md) | Plugin | Defines parse, account, balance, executable, include, and concurrent-edit recovery. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/plugin-tie-ins/beancount-transaction.md`](../../manual-testing-playbook/plugin-tie-ins/beancount-transaction.md) | Manual playbook | Appends and checks a balanced scratch transaction. |
| [`../../examples/beancount-transaction.sh`](../../examples/beancount-transaction.sh) | Reference | Runs the scratch-ledger append and optional `bean-check` flow. |
| [`../../assets/plugins/beancount-finance/ledger.example.beancount`](../../assets/plugins/beancount-finance/ledger.example.beancount) | Fixture | Provides a small valid ledger fixture. |
| [`../../assets/plugins/beancount-finance/beancount-data.example.json`](../../assets/plugins/beancount-finance/beancount-data.example.json) | Fixture | Provides a complete example settings payload. |

## 4. SOURCE METADATA

- Group: Plugins
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `plugins/beancount-finance.md`

Related references:
- [`../../references/plugins/beancount-finance/beancount-finance.md`](../../references/plugins/beancount-finance/beancount-finance.md) — plugin identity and deep-reference index.
- [`../../assets/workflows.md`](../../assets/workflows.md) — shared cross-plugin file-layer workflow asset.
