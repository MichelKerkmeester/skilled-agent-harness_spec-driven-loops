---
title: "Quality guards"
description: "Blocks premature stops until source diversity, focus alignment, and weak-source checks all pass."
trigger_phrases:
  - "quality guards"
  - "premature stop prevention"
  - "legal-stop bundle"
  - "source diversity check"
  - "blocked-stop event"
---

# Quality guards

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Blocks premature stops until source diversity, focus alignment, and weak-source checks all pass.

Quality guards sit after the convergence vote and before synthesis. They make sure a statistically quiet loop still has enough evidence quality and enough question coverage to stop safely.

---

## 2. HOW IT WORKS

The legal-stop bundle is explicit. After a stop nomination, the workflow checks that each key question has evidence-backed coverage, that research stayed aligned with the original question set, and that the answered set is not leaning on a single tentative source. A stop is legal only when both the convergence gate and these guard checks pass together.

Guard failures are visible packet events, not quiet side effects. The workflow emits `guard_violation` lines for the specific issue and then persists a `blocked_stop` event with gate results, blocker names, recovery guidance, session identifier, and generation. The reducer uses those events to update next focus, blocked-stop history, and dashboard reporting for the next loop turn.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/deep-research/references/convergence/convergence.md` | Reference | Defines the legal-stop gate bundle and the source-diversity, focus-alignment, and weak-source rules. |
| `.opencode/skills/deep-research/references/protocol/loop_protocol.md` | Reference | Defines when the guards run and how blocked-stop events are persisted. |
| `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml` | Workflow | Emits guard and blocked-stop events in autonomous mode. |
| `.opencode/commands/deep/assets/deep_start-research-loop_confirm.yaml` | Workflow | Emits the same guard and blocked-stop events in confirm mode. |
| `.opencode/skills/deep-research/scripts/reduce-state.cjs` | Reducer | Surfaces blocked-stop history and recovery hints into strategy and dashboard outputs. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/deep-research/manual_testing_playbook/04--convergence-and-recovery/020-quality-guard-source-diversity.md` | Manual playbook | Verifies the source-diversity guard blocks weakly sourced stops. |
| `.opencode/skills/deep-research/manual_testing_playbook/04--convergence-and-recovery/021-quality-guard-focus-alignment.md` | Manual playbook | Verifies the focus-alignment guard catches drift from the original charter. |
| `.opencode/skills/deep-research/manual_testing_playbook/04--convergence-and-recovery/022-quality-guard-no-single-weak-source.md` | Manual playbook | Verifies tentative single-source answers cannot close the loop. |
| `.opencode/skills/deep-research/manual_testing_playbook/04--convergence-and-recovery/023-convergence-passes-guard-fails-override.md` | Manual playbook | Verifies guard failure overrides a stop nomination back to CONTINUE. |

---

## 4. SOURCE METADATA

- Group: Convergence
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--convergence/quality-guards.md`
Related references:
- [stuck-detection.md](stuck-detection.md) — Stuck detection
- [graph-convergence.md](graph-convergence.md) — Graph convergence
