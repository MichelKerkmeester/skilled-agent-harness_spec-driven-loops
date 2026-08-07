---
title: "Beancount Ledger Plugin Reference"
description: "Slim index for the beancount-finance community plugin: identity, file-layer doctrine, deep data model, workflows, troubleshooting, and copyable assets."
trigger_phrases:
  - "beancount finance plugin"
  - "beancount ledger plugin"
  - "beancount-finance"
  - "beancount file layer"
  - "bean-query bean-price"
importance_tier: "normal"
contextType: "implementation"
version: 0.1.0.0
---

# Beancount Ledger Plugin Reference

Index for the verified `beancount-finance` plugin contract and its file-layer operating material.

---

## 1. OVERVIEW

### Identity

| Field | Value |
|---|---|
| Name | **Beancount Ledger** |
| Plugin ID | `beancount-finance` |
| Author | `mkshp` |
| Repository | [`mkshp-dev/obsidian-finance-plugin`](https://github.com/mkshp-dev/obsidian-finance-plugin) |
| Version | `2.3.1` |
| Platform | Desktop-only |
| Minimum Obsidian | `1.7.2` |

These identity fields come from the tagged [`manifest.json`](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/manifest.json).

### What it does

Beancount Ledger owns a structured plain-text Beancount ledger under a configurable vault folder, runs live BQL through the external `bean-query` command, runs `bean-price` to append parsable market-price directives, and renders transaction/directive entry plus net-worth, balance, journal, income, and commodity dashboards. The seven registered command IDs and external process boundary are source-backed by [`src/main.ts`](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/main.ts), [`src/utils/queryRunner.ts`](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/queryRunner.ts), and [`src/services/price.service.ts`](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/services/price.service.ts).

### File-layer doctrine

Operate the data, not the UI: edit the `.beancount` files the plugin reads and `.obsidian/plugins/beancount-finance/data.json` when settings must change. The plugin renders and queries those files; it is not a separate financial database. ([plugin operation logic](../plugin-operation-logic.md), [structured layout](https://github.com/mkshp-dev/obsidian-finance-plugin/blob/2.3.1/src/utils/structuredLayout.ts))

---

## 2. DEEP REFERENCES

- [`data-model.md`](data-model.md) — complete 21-key settings table, structured on-disk layout, Beancount v3 directives, lots and prices, BQL statements/virtual tables, and bean-price behavior.
- [`workflows.md`](workflows.md) — add accounts, append balanced transactions, reproduce dashboard queries, bulk entry, fetch prices, reconcile, and validate from the terminal.
- [`troubleshooting.md`](troubleshooting.md) — error/edge catalog plus `bean-query`/`bean-price` PATH setup for Python user-base and GUI environments.

---

## 3. COPYABLE ASSETS

- [`../../../assets/plugins/beancount-finance/example.beancount`](../../../assets/plugins/beancount-finance/example.beancount) — small valid ledger with opened accounts, balanced transactions, a balance assertion, and a price directive.
- [`../../../assets/plugins/beancount-finance/example.data.json`](../../../assets/plugins/beancount-finance/example.data.json) — realistic complete 21-key settings payload.
- [`../../../assets/workflows.md`](../../../assets/workflows.md) — shared cross-plugin file-layer workflow asset with the Beancount Ledger section.

---

## 4. SOURCE BOUNDARY

Use the tagged plugin source plus the primary Beancount, beanquery, and beanprice references cited in the deep documents. The repository's TypeScript source is the inspected implementation boundary for version 2.3.1; do not invent a tracked root `main.js` source location.
