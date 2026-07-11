---
title: "EX-018 -- Checkpoint deletion (checkpoint_delete)"
description: "This scenario validates Checkpoint deletion (checkpoint_delete) for `EX-018`. It focuses on Old snapshot cleanup."
version: 3.6.0.15
---

# EX-018 -- Checkpoint deletion (checkpoint_delete)

## 1. OVERVIEW

This scenario validates Checkpoint deletion (checkpoint_delete) for `EX-018`. It focuses on Old snapshot cleanup.

---

## 2. SCENARIO CONTRACT


- Objective: Old snapshot cleanup.
- Real user request: `Please validate Checkpoint deletion (checkpoint_delete) against checkpoint_list(specFolder:"<sandbox-spec>") and tell me whether the expected signals are present: Removed checkpoint absent from list.`
- Prompt: `Validate Checkpoint deletion in the sandbox list, verify the removed checkpoint is absent, and return a concise verdict with evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Removed checkpoint absent from list
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if checkpoint removed from sandbox list

---

## 3. TEST EXECUTION

### Prompt

```
Validate Checkpoint deletion in the sandbox list, verify the removed checkpoint is absent, and return a concise verdict with evidence.
```

### Commands

1. checkpoint_list(specFolder:"<sandbox-spec>")
2. checkpoint_delete(name:"<checkpoint-name>",confirmName:"<checkpoint-name>")
3. checkpoint_list(specFolder:"<sandbox-spec>")

### Expected

Removed checkpoint absent from list

### Evidence

Before/after list outputs

### Pass / Fail

- **Pass**: checkpoint removed from sandbox list
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Validate name, `confirmName`, and sandbox scope; retry

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [lifecycle/checkpoint-deletion-checkpointdelete.md](../../feature_catalog/lifecycle/checkpoint-deletion-checkpointdelete.md)

---

## 5. SOURCE METADATA

- Group: Lifecycle
- Playbook ID: EX-018
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `lifecycle/checkpoint-deletion-checkpoint-delete.md`
- audited_post_018: true
