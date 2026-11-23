---
title: "mcp-browser-use: Skill Benchmark Runs"
description: "Index of the benchmark runs for the mcp-browser-use hub, starting with the 2026-11-21 two-stage routing replay."
version: 1.1.0.0
---

# mcp-browser-use: Skill Benchmark Runs

## 1. OVERVIEW

This folder holds the benchmark runs for the `mcp-browser-use` hub. Each run sits in its own folder and is never overwritten. A run that needs different requests or gold gets a new folder.

---

## 2. STRUCTURE

- `reports/compiled-routing/<run-label>/`: one folder for each two-stage routing replay, in the same layout `mcp-tooling` uses.
- `reports/<run-label>/`: one folder for each hub-playbook run. [`reports/README.md`](./reports/README.md) indexes both kinds.

---

## 3. RUNS

| Run | What it measures | Verdict |
|---|---|---|
| [`2026-11-21--manual-testing-playbook--hub-routing`](./reports/2026-11-21--manual-testing-playbook--hub-routing/) | Seven hub-routing playbook scenarios through the compiled router, with the admission check | FAIL, 6 of 7: MT-H04 defers where its gold says Aside. Superseded by the post-review run |
| [`2026-11-21--manual-testing-playbook--hub-routing--post-review`](./reports/2026-11-21--manual-testing-playbook--hub-routing--post-review/README.md) | The same seven scenarios after the deep-review fixes, plus one canary probe and the admission check | PASS, 7 of 7. Canary PASS |
| [`2026-11-21--two-stage-replay--compiled`](./reports/compiled-routing/2026-11-21--two-stage-replay--compiled/README.md) | Six real requests through the advisor and the compiled front door: one per mode plus three tie-break requests | PASS, 6 of 6 |

---

## 4. VERDICT

The two-stage replay passes: each of the three modes was hit 2 of 2 times, and `mcp-tooling` stayed below threshold on every request. The hub-routing playbook run failed one holdout, MT-H04, which deferred on a request that mixes agentic and signed-in proof wording. The operator then changed that holdout's gold to `defer` on 2026-11-21, because the request fits two modes. After that change, `compiled-route-admission.cjs --hub mcp-browser-use` reports 7 pass and 0 drift. The post-review run then passed 7 of 7 and supersedes the earlier run. The earlier run folder keeps its original FAIL.
