---
title: "Convergence check"
description: "Chooses whether the loop continues, enters stuck recovery, or reaches a legal stop."
trigger_phrases:
  - "convergence check"
  - "check convergence"
  - "legal-stop gates"
  - "blocked-stop handling"
  - "statistical stop vote"
version: 1.14.1.0
---

# Convergence check

## 1. OVERVIEW

Applies the statistical stop vote, legal-stop gates, and blocked-stop handling before research can end.

Convergence checking is the control point between one finished iteration and the next decision. It decides whether the loop continues, enters recovery mode, or can move into synthesis.

---

## 2. HOW IT WORKS

The live loop applies convergence in layers. Hard stops for `maxIterations` and all-questions-answered run first. convergence.cjs evaluates the weighted `shouldContinue()` signals from `convergence.md`, and when those signals or full question coverage nominate STOP, it applies the legal-stop bundle rather than stopping on novelty math alone.

That legal-stop bundle is workflow-visible, not only prose guidance. The workflow runs convergence.cjs with `--persist-snapshot` and `--stop-decision`, records the graph convergence result, and persists a first-class `blocked_stop` event when the decision is blocked. That event carries gate results, blockers, recovery guidance, session identifier, and generation so the reducer and dashboard can show why the loop had to continue.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md` | Reference | Defines the hard stops, weighted signals, legal-stop bundle, and stop labels. |
| `.skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md` | Reference | Defines the loop ordering, guard step, and blocked-stop persistence contract. |
| `.skilled/commands/deep/assets/deep-research.yaml` | Workflow | Runs convergence.cjs for the stop decision and persists `blocked_stop` events. Confirm mode adds approval gates. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/composite-convergence-stop-behavior.md` | Manual playbook | Verifies the composite convergence stop behavior. |
| `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/convergence-passes-guard-fails-override.md` | Manual playbook | Verifies that a nominated stop is overridden when the legal-stop guards fail. |
| `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/blocked-stop-reducer-surfacing.md` | Manual playbook | Verifies blocked-stop events surface through reducer-owned packet outputs. |

---

## 4. SOURCE METADATA

- Group: Loop lifecycle
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `loop-lifecycle/convergence-check.md`
Related references:
- [iteration-dispatch.md](../../feature-catalog/loop-lifecycle/iteration-dispatch.md) — Iteration dispatch
- [synthesis.md](synthesis.md) — Synthesis
