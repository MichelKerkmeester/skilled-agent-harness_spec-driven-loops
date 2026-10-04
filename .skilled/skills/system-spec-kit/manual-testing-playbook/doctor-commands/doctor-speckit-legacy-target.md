---
title: "DOC-351 -- Doctor speckit legacy target"
description: "Manual scenario validating that /doctor:speckit deep-loop renders the moved-target notice naming /doctor:deep-loop and stops without loading a workflow."
version: 1.0.0.0
id: doctor-commands-doctor-speckit-legacy-target
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-351 -- Doctor speckit legacy target

## 1. OVERVIEW

This scenario validates the moved-target path in the `/doctor:speckit` router. When the positional names a target that another doctor command owns, the router renders the presentation contract's moved-target notice and stops without loading any workflow.

The command takes no target of its own. The `deep-loop` positional belongs to `/doctor:deep-loop`, so the correct result is the notice plus a cancelled status, and no diagnostic phase may run.

---

## 2. SCENARIO CONTRACT

- Objective: Prove a moved target renders the exact notice, names the owning command, and stops before any workflow load.
- Playbook ID: DOC-351.
- Real user request: `Run the deep-loop doctor check through the speckit command.`
- Prompt: `Run the deep-loop doctor check through the speckit command.`
- Preconditions: A repository checkout with the doctor command assets in place. No scratch directory is required because the route stops before any workflow phase.
- Expected execution process: Run `/doctor:speckit deep-loop`, capture the full output, and confirm that no workflow was loaded and no report or state log was written.
- Expected signals: The output renders the moved-target template with `'deep-loop'` and `/doctor:deep-loop`, so it shows `'deep-loop' moved to /doctor:deep-loop.`, followed by `Run: /doctor:deep-loop` and `STATUS=CANCEL REASON="target_moved"`. No route setup dashboard, no Phase 0 discovery output, and no report or state log appears.
- Desired user-visible outcome: A short notice that names the owning command and reports a cancelled status.
- Pass/fail: PASS if the three notice lines render as expected and no workflow phase or file write follows.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Run the deep-loop doctor check through the speckit command.
```

### Commands

1. Record the current listing of the packet scratch directory when one is bound.
2. Run `/doctor:speckit deep-loop` through the real runtime.
3. Capture the full output.

```text
'deep-loop' moved to /doctor:deep-loop.
Run: /doctor:deep-loop
STATUS=CANCEL REASON="target_moved"
```

4. Confirm the output contains no `DOCTOR ROUTE SETUP` dashboard, no `DOCTOR DIAGNOSTIC RESULT` summary, and no Phase 0 discovery block.
5. Confirm the packet scratch listing from step 1 is unchanged.

### Expected

The router recognizes `deep-loop` as a target another doctor command owns, renders the moved-target notice from the presentation contract, and stops. No workflow YAML is loaded, both interactive gates are skipped, and no report or state log is written.

### Evidence

- The command transcript with the three notice lines.
- The absence of the setup dashboard, the diagnostic summary, and the Phase 0 discovery block.
- The scratch directory listing before and after the run.

### Pass / Fail

- **Pass**: The three notice lines render as expected and no workflow phase or file write follows.
- **Fail**: A workflow loads, the notice names a different command, or a report or state log appears.

### Failure Triage

If a workflow loads for `deep-loop`, inspect the positional dispatch in the mode routing of `.skilled/commands/doctor/speckit.md`. If the notice names a different command, inspect the moved-target table in `doctor-speckit-presentation.txt`. If the status line differs, inspect the notice template in the same presentation contract.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/speckit.md](../../../../commands/doctor/speckit.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml](../../../../commands/doctor/assets/doctor-speckit-retrieval.yaml)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-speckit-presentation.txt](../../../../commands/doctor/assets/doctor-speckit-presentation.txt)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../../../commands/doctor/_routes.yaml)

Provenance: manual only - /doctor:speckit deep-loop

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-351
- Feature name: Doctor speckit legacy target
- Command mode: `/doctor:speckit deep-loop`
- YAML asset: none, the route stops before workflow load
- Mutation boundary: no writes at all. The route renders a notice and stops.
- Feature file path: `doctor-commands/doctor-speckit-legacy-target.md`
