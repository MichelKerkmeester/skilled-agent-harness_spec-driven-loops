---
title: "Iteration dispatch"
description: "Dispatches one fresh-context deep-research iteration and syncs reducer-owned packet state afterward."
trigger_phrases:
  - "iteration dispatch"
  - "dispatch research iteration"
  - "fresh-context iteration"
  - "reducer-owned packet state"
  - "loop body execution"
---

# Iteration dispatch

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Dispatches one fresh-context deep-research iteration and syncs reducer-owned packet state afterward.

Iteration dispatch is the main loop body. It gives the LEAF agent a clean context window for one focused pass, then hands the new evidence back to the reducer-owned packet surfaces.

---

## 2. HOW IT WORKS

Before each dispatch, the workflow reads `deep-research-config.json`, `deep-research-state.jsonl`, and `deep-research-strategy.md`, checks the optional pause sentinel, and builds a short state summary for the agent prompt. The agent contract is strict. `.opencode/agents/deep-research.md` reads the packet files first, chooses one focus, performs 3 to 5 research actions, writes a new `iteration-NNN.md` file, appends one JSONL record, and only updates `research/research.md` when `progressiveSynthesis` is enabled.

After the agent finishes, the loop does not treat the strategy, dashboard, or findings registry as agent-owned surfaces. Instead, the workflow runs `reduce-state.cjs`, which rewrites the machine-owned strategy anchors, refreshes `findings-registry.json`, and regenerates `deep-research-dashboard.md`. That reducer pass is the live sync point between raw iteration output and the readable packet state.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/commands/deep/research.md` | Command | Describes the iterate phase, state-summary injection, and reducer sync boundary. |
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Workflow | Dispatches the LEAF agent, checks the pause sentinel, and runs the reducer after each iteration. |
| `.opencode/commands/deep/assets/deep_research_confirm.yaml` | Workflow | Mirrors dispatch flow with confirm-mode pause and review gates. |
| `.opencode/agents/deep-research.md` | Agent | Defines the single-iteration read, research, write, and progressive-synthesis rules. |
| `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs` | Reducer | Synchronizes strategy, findings registry, and dashboard from iteration artifacts and events. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/iteration-reads-state-before-research.md` | Manual playbook | Verifies every iteration reads state before researching. |
| `.opencode/skills/deep-loop-workflows/deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/iteration-writes-iteration-jsonl-and-strategy-update.md` | Manual playbook | Verifies the iteration file and JSONL append contract. |
| `.opencode/skills/deep-loop-workflows/deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/strategy-next-focus-and-exhausted-approach-discipline.md` | Manual playbook | Verifies next-focus selection and exhausted-approach discipline. |
| `.opencode/skills/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts` | Vitest | Verifies reducer sync writes stable registry, strategy, and dashboard outputs from iteration state. |

---

## 4. SOURCE METADATA

- Group: Loop lifecycle
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--loop-lifecycle/iteration-dispatch.md`
Related references:
- [initialization.md](initialization.md) — Initialization
- [convergence-check.md](convergence-check.md) — Convergence check
