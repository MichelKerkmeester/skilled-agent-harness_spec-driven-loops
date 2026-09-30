---
title: "cli-classifier: Feature Catalog"
description: "Unified reference combining the complete feature inventory and current-reality reference for the features the cli-classifier hub owns itself."
trigger_phrases:
  - "cli-classifier feature catalog"
  - "cli-classifier hub features"
  - "injection screen measurement"
  - "feature catalog"
last_updated: "2026-09-29"
version: 0.3.0.0
---

# cli-classifier: Feature Catalog

This document combines the current feature inventory for the `cli-classifier` hub into a single reference. It covers what the hub owns itself. Each transport keeps its own catalog: `cli-jev/feature-catalog/` for Jev and `cli-deem/feature-catalog/` for Deem.

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

### Pi transport comparison

#### Description

Compares Pi's classifier runtime against the jev CLI on the advisor's recorded choice calls, with a zero-call default and live arms behind an explicit switch.

#### Current Reality

`score-pi-transport.mjs` prints a zero-call census of Pi, jev, llama.cpp and the recorded calls file, then stops without writing anything. `--pi` and `--cli` each need `--out <dir>` and the operator's yes. No live run has happened, so the script has printed no verdict and no comparison numbers.

#### Source Files

See [`measurements/pi-transport-comparison.md`](measurements/pi-transport-comparison.md) for full implementation and test file listings.

### Pi classifier transport integration

#### Description

Carries an opt-in Pi route for Jev choice questions behind JEV_TRANSPORT, with the jev CLI as the default and the fallback.

#### Current Reality

`shared/scripts/jev-transport.mjs` resolves the switch per call, maps the declared `choice` arguments to Pi's classifier context and writes a Pi answer back in the CLI's shape. The CLI branch is the callers' own bounded spawn, so switch-off bytes do not move. `leaf-route-replay.cjs` and `score-clarify-default.cjs` are the two callers that opt in, and the predecessor phase's recorded run printed `verdict pi-transport: adopt` over `choice` rows only.

#### Source Files

See [`measurements/pi-transport-integration.md`](measurements/pi-transport-integration.md) for full implementation and test file listings.
