---
title: "JSONL state log"
description: "Provides the append-only deep-research ledger for config, iteration, and event records."
trigger_phrases:
  - "jsonl state log"
  - "deep-research-state.jsonl"
  - "append-only ledger"
  - "iteration event records"
  - "packet event trail"
version: 1.14.0.11
---

# JSONL state log

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Provides the append-only deep-research ledger for config, iteration, and event records.

`deep-research-state.jsonl` is the authoritative event trail for a packet. It captures what the loop has done so far in a form the reducer, convergence logic, and recovery logic can all re-read later.

---

## 2. HOW IT WORKS

The JSONL log begins with a config record, then appends one line per iteration plus typed event records such as `resumed`, `restarted`, `blocked_stop`, `graph_convergence`, `userPaused`, and `synthesis_complete`. Iteration rows can carry `newInfoRatio`, `noveltyJustification`, `convergenceSignals`, `ruledOut`, `focusTrack`, `sourceStrength`, and `graphEvents`, which makes the log the richest machine-readable packet surface.

The log is append-only by contract. The agent may add one iteration line, the workflow may append event lines, and the reader path is fault-tolerant. Malformed lines are skipped with defaults instead of breaking the loop, and reconstruction from iteration files is an explicit recovery path when the log is damaged.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/deep-research/references/state/state_format.md` | Reference | Defines the JSONL schema for config, iteration, and event lines. |
| `.opencode/skills/system-deep-loop/deep-research/references/convergence/convergence.md` | Reference | Defines how convergence readers parse JSONL safely and interpret stuck, insight, and thought statuses. |
| `.opencode/agents/deep-research.md` | Agent | Defines the one-line iteration append contract and required JSONL fields. |
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Workflow | Appends workflow-owned events such as `graph_convergence` and `blocked_stop`. |
| `.opencode/commands/deep/assets/deep_research_confirm.yaml` | Workflow | Mirrors the same event-writing path in confirm mode. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/iteration_execution_and_state_discipline/novelty_justification_in_jsonl.md` | Manual playbook | Verifies `noveltyJustification` is present and aligned with the iteration record. |
| `.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/pause_resume_and_fault_tolerance/malformed_jsonl_lines_are_skipped_with_defaults.md` | Manual playbook | Verifies tolerant parsing of malformed JSONL lines. |
| `.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/pause_resume_and_fault_tolerance/jsonl_reconstruction_from_iteration_files.md` | Manual playbook | Verifies state reconstruction when JSONL is damaged. |

---

## 4. SOURCE METADATA

- Group: State management
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `state-management/jsonl-state-log.md`
Related references:
- [strategy-tracking.md](../state_management/strategy_tracking.md) — Strategy tracking
