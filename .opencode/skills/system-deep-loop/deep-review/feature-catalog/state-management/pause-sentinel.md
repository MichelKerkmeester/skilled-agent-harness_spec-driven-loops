---
title: "Pause sentinel"
description: "File-based graceful suspension mechanism that halts the autonomous review loop between iterations and emits a normalized userPaused stop event."
trigger_phrases:
  - "pause sentinel"
  - ".deep-review-pause"
  - "pause review loop"
  - "userPaused event"
  - "graceful loop suspension"
version: 1.11.0.5
---

# Pause sentinel

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Lets an operator pause an autonomous review loop between iterations by creating a sentinel file, without killing the process or losing prior state.

In autonomous mode the sentinel is the only graceful intervention short of terminating the run. It gives operators a safe, reversible way to hold the loop, inspect state, and resume from exactly where the review left off.

## 2. HOW IT WORKS

Before each dispatch, Step 2a checks for `review/.deep-review-pause` (the file name uses the shared `-pause` suffix). When the sentinel exists, the loop logs a JSONL event `{"type":"event","event":"userPaused","mode":"review","stopReason":"userPaused","reason":"sentinel file detected"}` and halts with a message instructing the operator to delete the sentinel to resume. Resuming reads persisted state and continues from the last completed iteration rather than restarting from iteration 1.

A normalization rule governs the event name: if the runtime first observes a raw `paused` condition (or a raw `stuck_recovery` condition), it must rewrite the emitted JSONL event names to `userPaused` (and `stuckRecovery`) before appending. Persisted review JSONL should never contain raw `paused` or raw `stuck_recovery` rows after emission. The operator creates a pause with `touch {artifact_dir}/.deep-review-pause` at any time between iterations.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/protocol/loop-protocol.md` | Protocol | Step 2a Check Pause Sentinel, the userPaused event, the normalization rule, and the create/resume flow. |
| `references/state/state-format.md` | Schema | `userPaused` stop reason and the persisted event shape. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual-testing-playbook/pause-resume-and-fault-tolerance/pause-sentinel-halts-between-review-iterations.md` | Manual scenario | Verifies the sentinel halts the loop between iterations. |
| `manual-testing-playbook/pause-resume-and-fault-tolerance/resume-after-pause-sentinel-removal.md` | Manual scenario | Verifies removing the sentinel resumes from persisted state, not iteration 1. |

---

## 4. SOURCE METADATA

- Group: State management
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `state-management/pause-sentinel.md`
- Primary sources: `references/protocol/loop-protocol.md`, `references/state/state-format.md`
Related references:
- [graph-convergence-event.md](../../feature-catalog/state-management/graph-convergence-event.md) — Graph convergence event
