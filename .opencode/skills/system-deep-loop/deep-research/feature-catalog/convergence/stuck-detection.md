---
title: "Stuck detection"
description: "Detects consecutive no-progress runs and routes the loop into targeted recovery instead of blind repetition."
trigger_phrases:
  - "stuck detection"
  - "detect stuck loop"
  - "no-progress recovery"
  - "stuckCount threshold"
  - "research circling recovery"
version: 1.14.0.10
---

# Stuck detection

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Detects consecutive no-progress runs and routes the loop into targeted recovery instead of blind repetition.

Stuck detection is the loop's way of noticing that research is circling. It prevents repeated low-value passes by moving the workflow into a recovery branch with a different angle.

---

## 2. HOW IT WORKS

The workflow computes `stuckCount` from the JSONL history. It increments the counter when an evidence iteration falls below the configured convergence threshold or self-reports `stuck`. `insight` resets the counter because a conceptual breakthrough still counts as progress, while `thought` is skipped because it is not evidence gathering.

When the counter reaches the configured threshold, the recovery protocol classifies the failure mode before changing direction. It can label the problem as shallow sources, contradictory evidence, topic too broad, repetitive findings, or source exhaustion. That classification then feeds one of the targeted recovery strategies such as trying opposites, combining prior findings, or auditing low-value iterations. If the recovery pass still fails to beat the threshold, the loop exits to synthesis with the remaining gaps documented.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/deep-research/references/convergence/convergence.md` | Reference | Defines stuck counting, failure-mode classification, and recovery strategy selection. |
| `.opencode/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md` | Reference | Places stuck recovery in the live loop state machine. |
| `.opencode/agents/deep-research.md` | Agent | Defines recovery-mode behavior for the iteration agent when the dispatcher marks a run as recovery. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/stuck-recovery-widens-focus-and-continues.md` | Manual playbook | Verifies stuck recovery changes the approach and continues on renewed progress. |
| `.opencode/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/029_insight_status_prevents_false_stuck.md` | Manual playbook | Verifies `insight` resets the stuck counter. |
| `.opencode/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/thought-status-convergence-handling.md` | Manual playbook | Verifies `thought` does not increase the stuck counter. |

---

## 4. SOURCE METADATA

- Group: Convergence
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `convergence/stuck-detection.md`
Related references:
- [three-signal-model.md](../../feature-catalog/convergence/three-signal-model.md) — Three-signal model
- [quality-guards.md](../../feature-catalog/convergence/quality-guards.md) — Quality guards
