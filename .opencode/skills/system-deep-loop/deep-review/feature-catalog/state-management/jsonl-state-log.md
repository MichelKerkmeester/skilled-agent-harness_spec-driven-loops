---
title: "JSONL state log"
description: "Stores the append-only execution history for the deep-review lineage."
trigger_phrases:
  - "jsonl state log"
  - "deep-review-state.jsonl"
  - "append-only review history"
  - "iteration event spine"
  - "convergence replay"
version: 1.11.0.6
---

# JSONL state log

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Stores the append-only execution history for the deep-review lineage.

`deep-review-state.jsonl` is the packet's event spine. It captures config, iteration output, stop decisions, pause and recovery events, graph-assisted convergence data, and the final synthesis result in one ordered stream.

## 2. HOW IT WORKS

The JSONL log starts with a config record, then appends one record per iteration with required fields for focus, dimensions, files reviewed, findings counts, severity-weighted `newFindingsRatio`, session lineage, and timing. Optional fields extend the record with traceability checks, graph events, coverage, ruled-out directions, and convergence signals.

The same file also persists first-class lifecycle events such as `blocked_stop`, `graph_convergence`, `userPaused`, `stuckRecovery`, and `synthesis_complete`. Because the loop recomputes decisions from stored state, the JSONL contract is load-bearing for convergence replay, dashboard refreshes, and restart-safe reducer output.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/state/state-format.md` | Schema | Defines the config record, iteration fields, event payloads, graph events, and normalization rules. |
| `references/protocol/loop-protocol.md` | Protocol | Requires JSONL reads before dispatch and appends state after each loop phase. |
| `references/convergence/convergence.md` | Protocol | Defines the shared stop-reason enum and blocked-stop persistence rules that land in JSONL. |
| `assets/review-mode-contract.yaml` | Contract | Declares required iteration and synthesis-event fields and lifecycle metadata. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual-testing-playbook/iteration-execution-and-state-discipline/review-iteration-writes-findings-jsonl-and-strategy-update.md` | Manual scenario | Verifies per-iteration JSONL append behavior. |
| `manual-testing-playbook/iteration-execution-and-state-discipline/severity-classification-in-jsonl.md` | Manual scenario | Checks severity-weighted JSONL findings fields. |
| `manual-testing-playbook/pause-resume-and-fault-tolerance/malformed-jsonl-lines-are-skipped-with-defaults.md` | Manual scenario | Exercises malformed-line handling and state recovery expectations. |
| `manual-testing-playbook/pause-resume-and-fault-tolerance/jsonl-reconstruction-from-review-iteration-files.md` | Manual scenario | Verifies reconstruction from write-once iteration files. |

---

## 4. SOURCE METADATA

- Group: State management
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `state-management/jsonl-state-log.md`
- Primary sources: `references/state/state-format.md`, `references/protocol/loop-protocol.md`, `references/convergence/convergence.md`, `assets/review-mode-contract.yaml`
Related references:
- [strategy-tracking.md](../../feature-catalog/state-management/strategy-tracking.md) — Strategy tracking
