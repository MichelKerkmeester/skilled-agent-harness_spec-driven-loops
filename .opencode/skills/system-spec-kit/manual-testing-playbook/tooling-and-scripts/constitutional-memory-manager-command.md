---
title: "147 -- Constitutional memory manager command"
description: "This scenario validates Constitutional memory manager command for `147`. It focuses on Verify `/memory:learn` flows and active docs all reflect the constitutional-only workflow."
version: 3.6.0.20
id: tooling-and-scripts-constitutional-memory-manager-command
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 147 -- Constitutional memory manager command

> **DEPRECATED (constitutional-layer removal):** this feature was removed; the 20 rule files were deleted as well. Retained here for historical record.

## 1. OVERVIEW

This scenario validates Constitutional memory manager command for `147`. It focuses on Verify `/memory:learn` flows and active docs all reflect the constitutional-only workflow.

---

## 2. SCENARIO CONTRACT


- Objective: Verify `/memory:learn` flows and active docs all reflect the constitutional-only workflow.
- Real user request: `Please validate Constitutional memory manager command against /memory:learn and tell me whether the expected signals are present: Constitutional memory manager.`
- Prompt: `Validate Constitutional memory manager command against /memory:learn and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Constitutional memory manager
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Default flow shows overview, list/budget expose constitutional inventory, edit/remove guard with file discovery, active docs describe constitutional memory management; FAIL: `/memory:learn` missing-arg prompts instead of overview, active docs still describe legacy learning/corrections workflow

---

## 3. TEST EXECUTION

### Prompt

```
Validate Constitutional memory manager command against /memory:learn and report cited pass/fail evidence.
```

### Commands

1. Invoke `/memory:learn` with no arguments and verify it shows the overview dashboard with action hints instead of prompting for missing input
2. Invoke `/memory:learn list` and verify constitutional files plus aggregate budget are shown
3. Invoke `/memory:learn budget` and verify per-file and total budget usage are shown against the shared `~2000` token limit
4. Invoke `/memory:learn edit` with no filename and verify available constitutional files are listed before the command waits for a selection
5. Invoke `/memory:learn remove` with no filename and verify the same guarded selection flow occurs before destructive confirmation
6. Run `rg -n "/memory:learn | Constitutional memory manager | constitutional memories" .opencode/commands/README.txt .opencode/commands/memory/README.txt .opencode/commands/memory/search.md .opencode/commands/speckit/debug.md .opencode/commands/speckit/complete.md README.md .opencode/README.md .opencode/agents/speckit.md` and confirm no active doc describes `/memory:learn` as the retired learning/corrections command

### Expected

Default flow shows overview instead of a missing-argument prompt; list and budget flows expose constitutional inventory and shared-budget data; edit/remove missing-arg flows guard with file discovery; active docs consistently describe constitutional memory management rather than legacy explicit-learning capture.

### Evidence

Capture, for every step in the Commands sequence above:

- The exact command or tool call issued, its full output, and its exit status.
- The output lines that carry each expected signal listed in the Scenario Contract.
- Any deviation from the expected result, quoted verbatim from the output.
- The resolved path of every file the run reads or writes.

### Pass / Fail

- **Pass**: Default flow shows overview, list/budget expose constitutional inventory, edit/remove guard with file discovery, active docs describe constitutional memory management.
- **Fail**: `/memory:learn` missing-arg prompts instead of overview, active docs still describe legacy learning/corrections workflow.

### Failure Triage

Inspect the `/memory:learn` command flow and the active documentation files listed in the grep command if the overview behavior or constitutional-only wording regresses.

---

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [tooling-and-scripts/constitutional-memory-manager-command.md](../../feature-catalog/tooling-and-scripts/constitutional-memory-manager-command.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 147
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tooling-and-scripts/constitutional-memory-manager-command.md`
