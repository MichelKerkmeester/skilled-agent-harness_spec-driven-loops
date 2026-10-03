---
title: "cli-classifier Benchmark Artifacts"
description: "Benchmark inputs and run reports for cli-classifier, kept beside the skill they measure."
trigger_phrases:
  - "cli-classifier benchmark"
  - "cli-classifier benchmark artifacts"
importance_tier: "important"
contextType: "general"
---

# cli-classifier Benchmark Artifacts

> Inputs and reports for benchmarking `cli-classifier`, kept beside the skill they measure.

---

## 1. OVERVIEW

The hub's own benchmarkable surface is routing. A Jev request must land on mode `cli-jev`, over the `cli-jev` packet. The hub has one mode today; a future classifier is added as a new mode with its own packet. An out-of-domain request must resolve nothing. The scenarios live in `manual-testing-playbook/hub-routing/`.

The transport's own contract is measured in its packet. `cli-jev/benchmark/reports/` holds the Jev judgment runs.

The two runs under `reports/` predate this hub's Jev mode. They measured the Jev routing surface when it was the separate `cli-jev` hub, and they stay as written. A new run is a new dated folder under `reports/`, never inline in this file.

---

## 2. LAYOUT

| Path | Contents |
|---|---|
| [`reports/`](./reports/) | One folder per run, indexed by `reports/README.md` |
| [`injection-screen/`](./injection-screen/) | `score-injection-screen.mjs` and its tests: an offline check of whether Jev `noul` spots text that tries to instruct an agent. The default run makes zero model calls. `--jev` runs the hosted classifier behind its gate |
| [`pi-transport/`](./pi-transport/) | `score-pi-transport.mjs` and its tests: a replay of the recorded CLI choice calls through Pi's classifier runtime. The default run makes zero model calls and writes nothing. `--pi --out <dir>` runs the Pi side behind the package and model gate, and `--cli --out <dir>` runs the paired CLI rerun behind the shared jev gate |

---

## 3. BASELINES

| Baseline | Where the evidence lives |
|---|---|
| Hub routing for `cli-jev` | `manual-testing-playbook/hub-routing/` |
| The Jev transport's judgment contract | `cli-jev/benchmark/reports/` |
| Compiled-routing activation | `.skilled/bin/lib/compiled-routing/013-live-activation/activation/cli-classifier/manifest.json` |
