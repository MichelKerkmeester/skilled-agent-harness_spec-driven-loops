---
title: "Review minIterations floor"
description: "A review run with a configured minIterations floor turns a stop candidate into CONTINUE with minIterationsNotReached until its iteration count reaches the floor, so no stop candidate ends a review before the floor. The iteration cap and the halt after three consecutive failed iterations are checked first and can still stop it earlier."
trigger_phrases:
  - "review minIterations"
  - "minIterationsNotReached"
  - "review iteration floor"
  - "antiConvergence minIterations review"
version: 1.0.4.0
---

# Review minIterations floor

## 1. OVERVIEW

The review convergence check holds a stop below the configured floor. `config.minIterations` when present, else `antiConvergence.minIterations`, sets the floor, capped at `maxIterations`; the shipped default is 2. The floor applies to research and review alike.

---

## 2. HOW IT WORKS

### Floor Check

`runtime/scripts/convergence.cjs` returns `CONTINUE` with the reason `minIterationsNotReached` when a stop candidate forms while the iteration count is below a floor above 1. Below the floor with no candidate the reason stays `noStopCandidate`, and stuck recovery, `convergenceModeOff` and `stopPolicyMaxIterations` return before the floor is checked. A stop candidate below the floor never ends the review. The iteration cap and the three-failure halt come earlier in the stop order, so either can still end a run below the floor.

### Stop Order

The review command's `step_check_convergence` places the floor in the fixed stop order after the candidate line and before the gates, so the floor is checked before any gate can end the run.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` | Script | The floor check that returns `CONTINUE` with `minIterationsNotReached`. |
| `.skilled/commands/deep/assets/deep-review.yaml` | Command workflow | The floor's position in the fixed stop order of `step_check_convergence`. |
| `.skilled/skills/system-deep-loop/deep-review/assets/deep-review-config.json` | Config | `antiConvergence.minIterations`, default 2. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/runtime/tests/unit/stop-decision.vitest.ts` | Vitest | The review floor case: `CONTINUE` with `minIterationsNotReached`. |
| `.skilled/skills/system-deep-loop/runtime/tests/integration/review-depth-convergence.vitest.ts` | Vitest | A configured floor above 2. |
| `.skilled/skills/system-deep-loop/runtime/tests/integration/review-stop-path-replay.vitest.ts` | Vitest | The shipped floor replays unchanged. |
| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-min-iterations-floor.md` | Manual playbook | DRV-072: a review run holds below its minIterations floor. |

---

## 4. SOURCE METADATA

- Group: Loop lifecycle
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `loop-lifecycle/min-iterations-floor.md`

Related references:
- [convergence-check.md](convergence-check.md) - Convergence check
- [convergence-signals.md](../severity-system/convergence-signals.md) - Convergence signals
