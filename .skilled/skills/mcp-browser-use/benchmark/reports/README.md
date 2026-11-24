---
title: "mcp-browser-use Benchmark Reports"
description: "Index of recorded run reports for the mcp-browser-use hub, one row per run folder."
trigger_phrases:
  - "mcp-browser-use benchmark reports"
importance_tier: "normal"
contextType: "general"
---

# mcp-browser-use Benchmark Reports

> Recorded runs of the mcp-browser-use hub playbook, newest first. Raw execution evidence is named in each run's `source.md`.

---

## 1. OVERVIEW

Each row below is one run folder. A run whose result changes gets a new folder. A prior run is never overwritten. Each mode packet keeps its own runs under its own `benchmark/reports/`.

---

## 2. RUN INDEX

| Executed | Folder | Runtime | Result | Verdict | Source |
|---|---|---|---|---|---|
| 2026-11-24 | [`compiled-routing/2026-11-24--two-stage-replay--compiled--p2-triage/`](./compiled-routing/2026-11-24--two-stage-replay--compiled--p2-triage/README.md) | advisor 2.0.3.0 plus compiled router, 56 requests, hub 1.1.5.0 | 55 PASS, 1 FAIL | **PASS** except the known MBU-PB-04 stage-one gap, supersedes the run below | `source.md` in the run folder |
| 2026-11-24 | [`compiled-routing/2026-11-24--two-stage-replay--compiled--second-follow-up/`](./compiled-routing/2026-11-24--two-stage-replay--compiled--second-follow-up/README.md) | advisor 2.0.3.0 plus compiled router, 56 requests | 55 PASS, 1 FAIL | **PASS** except the known MBU-PB-04 stage-one gap, superseded by the run above; supersedes the run below | `source.md` in the run folder |
| 2026-11-24 | [`compiled-routing/2026-11-24--two-stage-replay--compiled--follow-up/`](./compiled-routing/2026-11-24--two-stage-replay--compiled--follow-up/README.md) | advisor 2.0.3.0 plus compiled router, 52 requests | 51 PASS, 1 FAIL | **PASS** except the known MBU-PB-04 stage-one gap | `source.md` in the run folder |
| 2026-11-24 | [`compiled-routing/2026-11-24--two-stage-replay--compiled/`](./compiled-routing/2026-11-24--two-stage-replay--compiled/README.md) | advisor 2.0.2.0 plus compiled router, 49 requests | 48 PASS, 1 FAIL | **PASS** except the known MBU-PB-04 stage-one gap | `source.md` in the run folder |
| 2026-11-21 | [`2026-11-21--manual-testing-playbook--hub-routing--post-review/`](./2026-11-21--manual-testing-playbook--hub-routing--post-review/README.md) | compiled router, seven prompts plus a canary probe, admission check | 7 PASS | **PASS**, supersedes the FAIL run below | `source.md` in the run folder |
| 2026-11-21 | [`compiled-routing/2026-11-21--two-stage-replay--compiled/`](./compiled-routing/2026-11-21--two-stage-replay--compiled/README.md) | advisor plus compiled router, six requests | 6 PASS | **PASS** | `source.md` in the run folder |
| 2026-11-21 | [`2026-11-21--manual-testing-playbook--hub-routing/`](./2026-11-21--manual-testing-playbook--hub-routing/) | compiled router, seven prompts, admission check | 6 PASS, 1 FAIL | **FAIL** | `manual-testing-playbook` |
