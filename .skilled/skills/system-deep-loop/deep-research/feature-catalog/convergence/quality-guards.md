---
title: "Quality guards"
description: "Blocks weak or incomplete STOP decisions even after convergence math votes to stop."
trigger_phrases:
  - "quality guards"
  - "premature stop prevention"
  - "legal-stop bundle"
  - "source diversity check"
  - "blocked-stop event"
version: 1.14.5.0
---

# Quality guards

## 1. OVERVIEW

Blocks premature stops until source diversity and focus alignment pass. The bundle also carries a reserved single-weak-source entry that reports `notEvaluated`.

Quality guards sit after the convergence vote and before synthesis. They make sure a statistically quiet loop still has enough evidence quality and enough question coverage to stop safely.

---

## 2. HOW IT WORKS

The legal-stop bundle is explicit. convergence.cjs checks that each key question has evidence-backed coverage and that research stayed aligned with the key question list in the latest iteration record. The bundle also carries a reserved single-weak-source entry that reports `notEvaluated`. When the graph reads cleanly but holds no answered question, source diversity reports `insufficient` with `passed: false` instead of a pass, and `notEvaluated` there means the graph read failed. Only a guard whose status is `failed` blocks a stop, so `insufficient` reports missing evidence without changing the decision. A stop is legal only when both the convergence gate and these guard checks pass together.

Guard failures are visible in the stop decision, not quiet side effects. convergence.cjs reports the failed guard as `qualityGuardFailed` and names it in `stop_decision.blockedBy`, and the workflow logs the failed guard names when it continues. A failed guard writes no event, neither `guard_violation` nor `blocked_stop`. Only a graph `STOP_BLOCKED` records `blocked_stop`, which convergence.cjs appends itself through the append gateway, and that event carries gate results, blockers, recovery guidance, session identifier, and generation so the reducer and dashboard can show why the loop had to continue.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md` | Reference | Defines the legal-stop gate bundle and the source-diversity and focus-alignment rules. |
| `.skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md` | Reference | Defines when the guards run and how blocked-stop events are persisted. |
| `.skilled/commands/deep/assets/deep-research.yaml` | Workflow | Runs convergence.cjs with `--record-blocked-stop`, which persists `blocked_stop` events, and logs failed guard names. Confirm mode adds approval gates. |
| `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` | Reducer | Surfaces blocked-stop history and recovery hints into strategy and dashboard outputs. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/quality-guard-source-diversity.md` | Manual playbook | Verifies the source-diversity guard blocks weakly sourced stops. |
| `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/quality-guard-focus-alignment.md` | Manual playbook | Verifies the focus-alignment guard catches drift from the original charter. |
| `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/quality-guard-no-single-weak-source.md` | Manual playbook | Verifies tentative single-source answers cannot close the loop. |
| `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/convergence-passes-guard-fails-override.md` | Manual playbook | Verifies guard failure overrides a stop nomination back to CONTINUE. |

---

## 4. SOURCE METADATA

- Group: Convergence
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `convergence/quality-guards.md`
Related references:
- [stuck-detection.md](../../feature-catalog/convergence/stuck-detection.md) — Stuck detection
- [graph-convergence.md](../../feature-catalog/convergence/graph-convergence.md) — Graph convergence
