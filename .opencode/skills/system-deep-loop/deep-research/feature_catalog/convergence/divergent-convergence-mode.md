---
title: "deep-research: Divergent convergence mode"
description: "Current-state catalog entry for eligible research STOP translation into a bounded native Council pivot."
trigger_phrases:
  - "research divergent convergence"
  - "research pivot council"
  - "composite_converged pivot"
  - "all_questions_answered pivot"
version: 1.14.0.1
---

# Divergent convergence mode

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`divergent` is an opt-in convergence-mode modifier. It keeps the normal research convergence and legal-stop checks, then changes only the handling of an eligible legal STOP.

---

## 2. HOW IT WORKS

The auto workflow admits the exact reasons `composite_converged` and `all_questions_answered`. A successful pivot selects a new focus from persisted adjacent questions, contradiction or verification gaps, missing source classes, alternate evidence methods, and independent finding checks. The shared adapter runs exactly three native seats in one round, persists the transaction under `<artifactRoot>/divergent/pivots/<pivotId>/council/**`, restores the selected focus, and continues the loop.

`maxIterationsReached`, `blockedStop`, `stuckRecovery`, `minIterationsNotReached`, `error`, `manualStop`, and `userPaused` do not pivot. A pivot failure follows the existing synthesis path.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Workflow | Owns STOP eligibility, native seat dispatch, continuation, and fail-closed synthesis routing. |
| `.opencode/skills/system-deep-loop/deep-research/scripts/divergent-research-pivot.ts` | Mode adapter | Builds bounded research candidates and the three research seat mandates. |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts` | Shared runtime | Owns the mechanics-only pivot transaction, event vocabulary, quorum, agreement, and artifact layout. |
| `.opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs` | Shared runtime | Validates the four-value convergence-mode enum without translating STOP decisions. |
| `.opencode/skills/system-deep-loop/deep-research/references/convergence/convergence.md` | Reference | Defines the operator-facing convergence-mode and cost contract. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/convergence-and-recovery/divergent-convergence-mode.md` | Manual playbook | Verifies eligibility, hard boundaries, continuation, and existing-mode isolation. |

---

## 4. SOURCE METADATA

- Group: Convergence
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `convergence/divergent-convergence-mode.md`

Related references:
- [anti-convergence-floor.md](anti-convergence-floor.md) - Minimum-iteration and off-mode behavior
- [quality-guards.md](quality-guards.md) - Legal-stop quality gates
