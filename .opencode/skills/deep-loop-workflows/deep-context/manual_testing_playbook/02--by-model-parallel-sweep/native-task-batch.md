---
title: "SWEEP-002 -- Native Task Batch"
description: "This scenario validates Native Task Batch for `SWEEP-002`. It focuses on the concurrent parallel Task dispatch of @deep-context LEAF seats and the read-only boundary enforced by the agent definition."
version: 1.2.0.4
---

# SWEEP-002 -- Native Task Batch

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SWEEP-002`.

---

## 1. OVERVIEW

This scenario validates Native Task Batch for `SWEEP-002`. It focuses on `step_sweep_native_batch` dispatching all native `@deep-context` seats as a single parallel Task batch (not sequential), each seat receiving the mandatory four-part lineage contract, and the `@deep-context` agent definition enforcing the LEAF read-only boundary.

### Why This Matters

Native seats that run sequentially would allow earlier seats to indirectly influence later seats via the host's displayed tool calls, violating the independence assumption behind cross-executor agreement. The agent's `task: deny` permission ensures seats cannot nest sub-agents and its `write: deny` ensures the host retains exclusive write authority over merged state.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SWEEP-002` and confirm the expected signals without contradictory evidence.

- Objective: Verify that native seats are dispatched as a parallel batch (not sequentially), the agent has LEAF permissions, and the four-part lineage contract is documented.
- Real user request: `Verify that native deep-context seats run as a concurrent batch and that the agent cannot write files or dispatch sub-agents.`
- Prompt: `As a manual-testing orchestrator, validate the native Task batch dispatch contract for deep-context against the auto YAML, the @deep-context agent definition, and loop_protocol.md. Verify step_sweep_native_batch dispatches a parallel Task batch (not sequential), each seat receives gather-subject + scope/slice + known-context + output schema, and the agent is LEAF-only (no writes, no sub-agent dispatch). Return a concise verdict.`
- Expected execution process: Read auto YAML for `step_sweep_native_batch`; read `.opencode/agents/deep-context.md` for permission block (`task: deny`, `write: deny`); read loop_protocol.md §5 for the four-part lineage contract; read agent definition for the LEAF boundary section.
- Expected signals: `step_sweep_native_batch` and `agent: deep-context` appear in the auto YAML; `.opencode/agents/deep-context.md` has `task: deny` and `write: deny`; loop_protocol.md §5 describes the four-part contract (gather-subject, scope/slice, known-context, output schema).
- Desired user-visible outcome: Native seats run concurrently in a single Task batch, each reading only its assigned slice, and returning structured findings to the host without writing any shared file.
- Pass/fail: PASS if the YAML shows parallel batch dispatch, the agent has deny permissions on task and write, and the four-part contract is documented in loop_protocol.md; FAIL if any of these are missing.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Stay local; doc-verification plus agent-file inspection.
3. Execute the deterministic steps exactly as written.
4. Compare observed output against the desired outcome.
5. Return a concise final answer.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SWEEP-002 | Native Task Batch | Verify parallel LEAF batch dispatch with read-only agent boundary | `Verify that native deep-context seats run as a concurrent batch and that the agent cannot write files or dispatch sub-agents.` | 1. `rg "step_sweep_native_batch\|agent.*deep-context" .opencode/commands/deep/assets/deep_context_auto.yaml` -> 2. `rg "task.*deny\|write.*deny" .opencode/agents/deep-context.md` -> 3. `rg "gather-subject\|known-context\|output schema\|lineage contract\|four.part" .opencode/skills/deep-loop-workflows/deep-context/references/protocol/loop_protocol.md` -> 4. `rg "LEAF\|leaf.*only\|no.*sub.agent" .opencode/agents/deep-context.md` | Step 1: step name and agent dispatch found; Step 2: deny permissions found; Step 3: four-part contract documented; Step 4: LEAF boundary described | Read outputs from all four commands | PASS if steps 1-4 all return matches; FAIL if agent write or task permission is not denied | 1. Confirm `.opencode/agents/deep-context.md` is the correct agent path. 2. Check for alternative permission syntax in the agent frontmatter. 3. Search loop_protocol.md for "lineage contract" or "four fields". |

### Optional Supplemental Checks

Confirm the agent returns findings via stdout and does not emit a file write path:

```bash
rg "stdout\|writes nothing\|returns.*finding\|final message" .opencode/agents/deep-context.md
```

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/02--by-model-parallel-sweep/native-task-batch.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/commands/deep/assets/deep_context_auto.yaml` | `step_sweep_native_batch`: parallel Task batch dispatch step |
| `.opencode/agents/deep-context.md` | Agent definition: permission block, LEAF boundary, output schema |
| `.opencode/skills/deep-loop-workflows/deep-context/references/protocol/loop_protocol.md` | §5: four-part lineage contract for native seat prompts |

---

## 5. SOURCE METADATA

- Group: By-Model Parallel Sweep
- Playbook ID: SWEEP-002
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--by-model-parallel-sweep/native-task-batch.md`
