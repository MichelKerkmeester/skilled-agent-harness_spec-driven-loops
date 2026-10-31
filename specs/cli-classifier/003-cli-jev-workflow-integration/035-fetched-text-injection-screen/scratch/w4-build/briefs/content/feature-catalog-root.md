---
title: "cli-classifier: Feature Catalog"
description: "Unified reference combining the complete feature inventory and current-reality reference for the features the cli-classifier hub owns itself."
trigger_phrases:
  - "cli-classifier feature catalog"
  - "cli-classifier hub features"
  - "injection screen measurement"
  - "feature catalog"
last_updated: "2026-09-29"
version: 1.0.0.0
---

# cli-classifier: Feature Catalog

This document combines the current feature inventory for the `cli-classifier` hub into a single reference. It covers what the hub owns itself. Each transport keeps its own catalog: `cli-usage/feature-catalog/` for Jev and `cli-deem/feature-catalog/` for Deem.

---

## 1. OVERVIEW

Use this catalog as the canonical inventory for hub-level features, the ones that belong to neither transport alone. The one section below holds the offline measurements that run both transports under one rule.

---

## 2. MEASUREMENTS

### Injection screen measurement

#### Description

Tests offline whether a Jev or Deem noul spots text that tries to instruct an AI agent better than flag-nothing and a fixed lexical screen.

#### Current Reality

`score-injection-screen.mjs` prints a fetch census and a corpus census with zero model calls. It then stops at the label gate until the operator labels the drawn rows. `--jev` and `--deem` each run one backend behind that backend's own gate and print one verdict line per backend. No hook uses the result.

#### Source Files

See [`measurements/injection-screen-measurement.md`](measurements/injection-screen-measurement.md) for full implementation and test file listings.
