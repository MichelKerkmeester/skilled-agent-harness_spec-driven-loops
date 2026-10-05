---
title: "cli-classifier: Feature Catalog"
description: "Unified reference combining the complete feature inventory and current-reality reference for the features the cli-classifier hub owns itself."
trigger_phrases:
  - "cli-classifier feature catalog"
  - "cli-classifier hub features"
  - "injection screen measurement"
  - "feature catalog"
last_updated: "2026-10-02"
version: 0.3.0.0
---

# cli-classifier: Feature Catalog

This document combines the current feature inventory for the `cli-classifier` hub into a single reference. It covers what the hub owns itself. The hub currently holds `cli-jev` as its only transport mode; a future classifier gets a new mode and packet.

---

## 1. OVERVIEW

Use this catalog as the canonical inventory for hub-level features, the ones that belong to neither a transport alone nor its packet. The section below holds offline measurement records for the shared routing and classifier surfaces.

---

## 2. MEASUREMENTS

### Injection screen measurement

#### Description

Tests offline whether Jev's `noul` spots text that tries to instruct an AI agent better than flag-nothing and a fixed lexical screen.

#### Current Reality

`score-injection-screen.mjs` prints a fetch census and a corpus census with zero model calls. It then stops at the label gate until the operator labels the drawn rows. `--jev` runs the hosted classifier behind its gate and prints one verdict line. No hook uses the result.

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

Answers Jev choice and noul questions through Pi when its preflight passes and through the jev CLI otherwise, with the environment or a per-call option forcing either route.

#### Current Reality

`shared/scripts/jev-transport.mjs` resolves the switch per call, maps the declared `choice` and `noul` arguments to Pi's classifier context and writes a Pi answer back in the CLI's shape. The CLI branch is the callers' own bounded spawn, so fallback bytes do not move. Four callers route their calls through the transport: `cite-drift-scan.mjs` (sk-doc), `score-injection-screen.mjs` (cli-classifier), and `score-verdict-fallback.cjs` and `score-d4-agreement.cjs` (system-deep-loop deep-improvement). The three scorers record the answering route as `transport` in their call records. Each outcome also names the model that answered, and a Pi answer's payload carries its token usage. The predecessor phase's recorded run printed `verdict pi-transport: adopt` over `choice` rows only.

#### Source Files

See [`measurements/pi-transport-integration.md`](measurements/pi-transport-integration.md) for full implementation and test file listings.
