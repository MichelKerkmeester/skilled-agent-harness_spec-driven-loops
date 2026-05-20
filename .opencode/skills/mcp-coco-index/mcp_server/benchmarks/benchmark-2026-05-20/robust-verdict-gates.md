---
title: "ROBUST verdict gates (May 20, 2026)"
description: "The five measurable release gates a future retrieval-stack default flip must clear before claiming a ROBUST verdict: repeated-run threshold, expanded-fixture hit rate, p95 latency budget, status/doctor metadata visibility, and observable diagnostics counters."
trigger_phrases:
  - "robust verdict gates"
  - "release gates retrieval stack"
  - "023B verdict gates"
  - "reranker promotion gates"
importance_tier: "important"
contextType: "reference"
---

# ROBUST verdict gates (May 20, 2026)

The five measurable release gates that a retrieval-stack default flip must clear before claiming a ROBUST verdict.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. GATE TABLE](#2--gate-table)
- [3. RELEASE INTERPRETATION](#3--release-interpretation)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

023B defines the measurable release gates for flipping the retrieval stack from regression-grade evidence to a ROBUST verdict. The Qwen3-Reranker-0.6B promotion cleared GATE-1 through GATE-5 against the expanded 73-probe fixture; any future default change must clear the same gates with fresh evidence against the then-current fixture.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:gate-table -->
## 2. GATE TABLE

| Gate | Requirement | Verification source | Status in this packet |
|---|---|---|---|
| GATE-1 | Repeated benchmark runs hold `n >= 3` with mean hit rate at least `14/18` on the original corrected fixture and no regression on the expanded fixture. | `run-expanded-bench.sh --runs 3`, per-run JSON, aggregate CI95. | Harnessed, long run deferred. |
| GATE-2 | Expanded fixture hit rate is at least `60%` until an operator chooses a stricter release threshold. | `expanded-calibration-summary.md` after full run. | Threshold defined; sample smoke is not a release verdict. |
| GATE-3 | p95 search latency remains below `10s` for bounded valid inputs. | Per-run JSON `latency_ms.p95`; hard input caps owned by upstream packet. | Harness records p95. |
| GATE-4 | Model, license, prompt, index, and effective config metadata are visible in `ccc status` / `ccc doctor`. | Live status/doctor output. | Prerequisite verified by shipped metadata-fingerprint, license-registry, doctor-UX, and config-snapshot packets. |
| GATE-5 | Reranker fallback, candidate, fanout, and boost-flip counters are observable. | `RetrievalDiagnostics` fields and residual taxonomy classifier. | Prerequisite verified by observability counters and the harness taxonomy hook. |

<!-- /ANCHOR:gate-table -->

---

<!-- ANCHOR:release-interpretation -->
## 3. RELEASE INTERPRETATION

All five gates must be green before claiming ROBUST. A sample smoke run can prove the harness still executes, but it cannot satisfy GATE-1 or GATE-2.

<!-- /ANCHOR:release-interpretation -->
