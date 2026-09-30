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

The hub's own benchmarkable surface is routing. A Jev request must land on mode `cli-jev`, over the `cli-usage` packet. A Deem request must land on `cli-deem`. A request that names both backends by their aliases routes to both in tie-break order. An out-of-domain request must resolve nothing. The scenarios live in `manual-testing-playbook/hub-routing/`.

Each transport's own contract is measured in its packet. `cli-usage/benchmark/reports/` holds the Jev judgment runs. `cli-deem/scripts/tests/cli-deem.test.mjs` pins the Deem client with `node --test` against a fake server.

The two runs under `reports/` predate this hub's Jev mode. They measured the Jev routing surface when it was the separate `cli-jev` hub, and they stay as written. A new run is a new dated folder under `reports/`, never inline in this file.

---

## 2. LAYOUT

| Path | Contents |
|---|---|
| [`reports/`](./reports/) | One folder per run, indexed by `reports/README.md` |
| [`injection-screen/`](./injection-screen/) | `score-injection-screen.mjs` and its tests: an offline check of whether a Jev or Deem `noul` spots text that tries to instruct an agent. The default run makes zero model calls. `--jev` and `--deem` each run one backend behind that backend's own gate |
| [`pi-transport/`](./pi-transport/) | `score-pi-transport.mjs` and its tests: a replay of the recorded CLI choice calls through Pi's classifier runtime. The default run makes zero model calls and writes nothing. `--pi --out <dir>` runs the Pi side behind the package and model gate, and `--cli --out <dir>` runs the paired CLI rerun behind the shared jev gate |

---

## 3. BASELINES

| Baseline | Where the evidence lives |
|---|---|
| Hub routing for both transports | `manual-testing-playbook/hub-routing/` |
| The Jev transport's judgment contract | `cli-usage/benchmark/reports/` |
| Compiled-routing activation | `.skilled/bin/lib/compiled-routing/013-live-activation/activation/cli-classifier/manifest.json` |
