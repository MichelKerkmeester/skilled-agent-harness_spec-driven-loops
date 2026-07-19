---
title: "DR-007 -- Iteration reads state before research"
description: "Verify that each dispatched iteration reads JSONL and strategy state before performing research actions."
version: 1.14.0.15
---

# DR-007 -- Iteration reads state before research

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-007`.

---

## 1. OVERVIEW

This scenario validates iteration reads state before research for `DR-007`. The objective is to verify that each dispatched iteration reads JSONL and strategy state before performing research actions.

### WHY THIS MATTERS

Fresh-context iterations only stay coherent if the agent rehydrates itself from the persisted state at the start of every cycle.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that each dispatched iteration reads JSONL and strategy state before performing research actions.
- Real user request: Make sure each deep-research iteration actually reads prior state before it starts searching again.
- Prompt: `Validate each deep-research iteration reads JSONL and strategy state before any research action.`
- Expected execution process: Inspect the workflow loop steps, then the quick reference iteration checklist, then the OpenCode runtime agent instructions for the single-iteration sequence.
- Desired user-visible outcome: The user is told that each iteration starts by reading persisted state instead of relying on memory from prior runs.
- Expected signals: Loop step order begins with state reads, the quick reference checklist says the same, and the agent definition starts with JSONL plus strategy reads.
- Pass/fail posture: PASS if all sources agree that state is read before research actions; FAIL if any source allows research before rehydrating state.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate each deep-research iteration reads JSONL and strategy state before any research action.
### Commands
1. `bash: rg -n 'Step 1: Read State|Read current state|read state first' .opencode/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md .opencode/skills/system-deep-loop/deep-research/SKILL.md`
2. `bash: rg -n 'step_read_state|current_iteration|next_focus' .opencode/commands/deep/assets/deep-research-auto.yaml .opencode/commands/deep/assets/deep-research-confirm.yaml`
3. `bash: sed -n '1,220p' .opencode/skills/system-deep-loop/deep-research/references/guides/quick-reference.md && sed -n '1,220p' .opencode/agents/deep-research.md`
### Expected
Loop step order begins with state reads, the quick reference checklist says the same, and the agent definition starts with JSONL plus strategy reads.
### Evidence
Capture the loop step order, the quick-reference checklist, and the runtime agent step sequence.
### Pass/Fail
PASS if all sources agree that state is read before research actions; FAIL if any source allows research before rehydrating state.
### Failure Triage
Check the agent sequence under `Single Iteration Protocol` if the higher-level docs look ambiguous.
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page, integrated review protocol, and scenario summary |
| `feature-catalog/` | No dedicated feature catalog exists yet for `deep-research`; use the live docs below as the implementation contract |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md` | Iteration loop order; use `ANCHOR:phase-iteration-loop` |
| `.opencode/commands/deep/assets/deep-research-auto.yaml` | Loop state extraction; inspect `step_read_state` |
| `.opencode/commands/deep/assets/deep-research-confirm.yaml` | Loop state extraction; inspect `step_read_state` |
| `.opencode/skills/system-deep-loop/deep-research/references/guides/quick-reference.md` | Iteration checklist; use `ANCHOR:agent-iteration-checklist` |
| `.opencode/agents/deep-research.md` | Canonical runtime agent sequence; inspect `## 1. CORE WORKFLOW` |

---

## 5. SOURCE METADATA

- Group: ITERATION EXECUTION AND STATE DISCIPLINE
- Playbook ID: DR-007
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `iteration-execution-and-state-discipline/iteration-reads-state-before-research.md`
- Feature catalog status: No `feature-catalog/` package exists under `.opencode/skills/system-deep-loop/deep-research/` as of 2026-03-19.
