---
title: "CMD-001 -- create-diagram command"
description: "This scenario validates the /create:diagram command router for `CMD-001`. It focuses on mode resolution, workflow YAML binding, and the presentation boundary between the router and the presentation contract."
version: 1.0.0.0
---

# CMD-001 -- create-diagram command

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CMD-001`.

---

## 1. OVERVIEW

This scenario validates the `/create:diagram` command router for `CMD-001`. It focuses on mode resolution, workflow YAML binding, and the presentation boundary between the router and the presentation contract.

### Why This Matters

`/create:diagram` is a thin router: it must separate execution routing from user-facing presentation. If the router invents user-facing wording, dispatches workflow behavior inline, or binds the wrong mode's YAML, the command's two surfaces bleed into each other and the workflow stops being predictable. `:auto` must run autonomously and `:confirm` must checkpoint, and both must draw their prompts and dashboards from the presentation contract, not from the router. This scenario verifies the contract as written, so the command stays a stable entry point for the packet.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CMD-001` and confirm the expected signals without contradictory evidence.

- Objective: verify the router loads the presentation contract, resolves `:auto` versus `:confirm`, executes the bound workflow YAML, and respects the presentation boundary
- Real user request: `/create:diagram docs/order-flow.html "sequence diagram of our order placement flow" :auto — sequence diagram of the order flow, no questions.`
- Prompt: `Run the /create:diagram command with argument docs/order-flow.html, description "sequence diagram of our order placement flow", mode :auto. Verify the router loads the presentation contract, binds create-diagram-auto.yaml, and the workflow produces the diagram without interactive questions.`
- Expected execution process: the router reads `.opencode/commands/create/diagram.md`, reads the presentation contract and runs its Phase 0 verification, resolves `:auto` from the arguments, binds `create-diagram-auto.yaml`, and the workflow executes its steps — detect the generate shape, load the style guide and `references/types/type-sequence.md`, draw, and verify the accessible-SVG contract — before the completion display is presented from the presentation contract.
- Expected signals: `:auto` completes without interactive questions; the omitted-mode case binds `create-diagram-confirm.yaml` and checkpoints; the workflow steps live in the YAML, not the router; user-facing wording comes from `create-diagram-presentation.txt`; the HTML lands at the argument path `docs/order-flow.html`.
- Desired user-visible outcome: an HTML sequence diagram at the argument path, produced by the bound workflow, with the router never inventing prompts or dashboards.
- Pass/fail: PASS if the mode resolves to `:auto`, the bound YAML executes, the HTML is written to the argument path, and the presentation boundary is respected; FAIL if the router binds the wrong mode, dispatches workflow behavior inline, invents user-facing wording, or the output lands anywhere other than the argument path.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the /create:diagram command with argument docs/order-flow.html, description "sequence diagram of our order placement flow", mode :auto. Verify the router loads the presentation contract, binds create-diagram-auto.yaml, and the workflow produces the diagram without interactive questions.`

### Commands

1. `agent: Read .opencode/commands/create/diagram.md (the router contract)`
2. `agent: Read .opencode/commands/create/assets/create-diagram-presentation.txt and the bound workflow .opencode/commands/create/assets/create-diagram-auto.yaml (for :auto)`
3. `agent: Execute the workflow YAML steps: detect the generate shape, load references/foundations/style-guide.md and references/types/type-sequence.md, draw, and verify the accessible-SVG contract`
4. `agent: Confirm the HTML exists at the argument path and that every user-facing prompt, dashboard, and completion line comes from the presentation contract, not the router`

### Expected

Step 2 shows the router owns only routing: it selects the presentation contract and the mode-bound YAML. Step 3 runs the sequence-diagram steps and writes `docs/order-flow.html`. Step 4 confirms `:auto` produced no interactive questions and that the setup/status/completion wording matches the presentation contract. Re-running with the mode omitted must bind `create-diagram-confirm.yaml` instead, proving the `:auto`/`:confirm` resolution is real.

### Evidence

Capture the router read, the resolved mode and bound YAML path, the argument-target path, the final `docs/order-flow.html` path, the list of workflow steps executed, and a sample of the completion wording traced back to the presentation contract.

### Pass / Fail

- **Pass**: `:auto` resolved to `create-diagram-auto.yaml`, the workflow executed its steps, the HTML exists at the argument path, and the presentation boundary held.
- **Fail**: the wrong mode was bound, workflow behavior was dispatched from the router, user-facing wording was invented outside the presentation contract, or the output did not land at the argument path.

### Failure Triage

1. If `:auto` asked questions, the router or presentation Phase 0 tried to run interactively — confirm the presentation contract's Phase 0 verification and setup resolution ran before mode resolution, and that `:auto` binds the autonomous YAML.
2. If the output landed elsewhere, re-check the argument-hint contract (`<target-diagram.html>` is the first positional argument) and confirm the workflow used it as the write path.
3. If wording does not match the presentation contract, grep `create-diagram-presentation.txt` for the offending line; wording that lives only in the router is a boundary violation.

### Optional Supplemental Checks

Run the `:confirm` variant with the same arguments and confirm the identical workflow steps run as an interactive checkpointed flow, proving the two modes share one workflow and differ only in checkpointing.

---

## 4. REFERENCES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `../../feature-catalog/command-and-hub-integration/create-diagram-command.md` | Feature-catalog source describing the implementation contract (authored next) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/commands/create/diagram.md` | Router contract and mode routing |
| `.opencode/commands/create/assets/create-diagram-presentation.txt` | Presentation boundary |
| `.opencode/commands/create/assets/create-diagram-auto.yaml` | Autonomous workflow |
| `.opencode/commands/create/assets/create-diagram-confirm.yaml` | Checkpointed workflow |

---

## 5. SOURCE METADATA

- Group: COMMAND AND HUB INTEGRATION
- Playbook ID: CMD-001
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `command-and-hub-integration/create-diagram-command.md`
