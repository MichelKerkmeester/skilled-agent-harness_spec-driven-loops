---
title: "deep-review: Divergent convergence mode"
description: "Current-state catalog entry for eligible clean review STOP translation into a bounded read-only Council pivot."
trigger_phrases:
  - "review divergent convergence"
  - "all_dimensions_clean pivot"
  - "read-only review pivot"
  - "review pivot council"
version: 1.11.0.1
---

# Divergent convergence mode

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`divergent` is an opt-in convergence-mode modifier. It preserves review's convergence math, legal-stop gates, security locks, read-only authority, and final verdict mapping.

---

## 2. HOW IT WORKS

The auto workflow admits only the exact reason `all_dimensions_clean`, after all nine legal-stop gates have run. Candidate sources include unswept dimensions, search debt, producer-consumer paths, negative-test gaps, and traceability gaps. Candidate generation rejects missing-evidence and mutation-shaped directions. The shared adapter runs exactly three native seats in one round, persists the transaction under `<artifactRoot>/divergent/pivots/<pivotId>/council/**`, and continues with the selected read-only direction.

`maxIterationsReached`, `blockedStop`, `stuckRecovery`, `error`, `manualStop`, and `userPaused` do not pivot. PASS/CONDITIONAL/FAIL is still derived only in `phase_synthesis`, and no pivot candidate authorizes a fix or target mutation.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/commands/deep/assets/deep_review_auto.yaml` | Workflow | Owns legal-stop gates, pivot eligibility, native seat dispatch, continuation, and synthesis-only verdict derivation. |
| `.opencode/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts` | Mode adapter | Builds evidence-grounded read-only candidates and rejects mutation-shaped directions. |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts` | Shared runtime | Owns the mechanics-only pivot transaction, event vocabulary, quorum, agreement, and artifact layout. |
| `.opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs` | Shared runtime | Validates the four-value convergence-mode enum without changing verdicts. |
| `.opencode/skills/system-deep-loop/deep-review/references/convergence/convergence.md` | Reference | Defines the operator-facing mode, cost, verdict, and read-only contract. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/convergence_and_recovery/divergent_convergence_mode.md` | Manual playbook | Verifies pivot eligibility, verdict isolation, security-gate preservation, and read-only behavior. |

---

## 4. SOURCE METADATA

- Group: Severity system
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `severity-system/divergent-convergence-mode.md`

Related references:
- [cross-mode-anti-convergence-contract.md](../severity_system/cross_mode_anti_convergence_contract.md) - Shared review floor and stop policy
- [quality-gates.md](../severity_system/quality_gates.md) - Review legal-stop gates
