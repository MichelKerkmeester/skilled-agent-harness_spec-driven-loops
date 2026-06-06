---
title: "Correctness"
description: "Audits logic, invariants, and behavior against observable intent."
trigger_phrases:
  - "correctness"
  - "audit logic invariants"
  - "behavior correctness review"
  - "logic errors dimension"
  - "highest-priority review dimension"
---

# Correctness

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Audits logic, invariants, and behavior against observable intent.

Correctness is the review loop's highest-priority audit dimension. It asks whether the reviewed system does what it claims, handles edge cases, and preserves its own invariants under real execution paths.

## 2. HOW IT WORKS

The review contract ranks correctness first in the default dimension order. It is required for severity coverage and is one of the dimensions that must be examined before a clean stop is possible. The loop uses this dimension for logic errors, broken state transitions, off-by-one mistakes, wrong return behavior, and other direct behavior mismatches.

Correctness also feeds the severity system directly. Findings in this dimension can rise to P0 when they reflect hard failures or contradictions to intended behavior, which is why the dimension is prioritized before security, traceability, and maintainability in the initial review charter.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `assets/review_mode_contract.yaml` | Contract | Declares correctness as dimension `1`, labels its checks, and marks it as required for severity coverage. |
| `SKILL.md` | Skill contract | Summarizes correctness as the first review dimension in the live four-dimension model. |
| `references/protocol/loop_protocol.md` | Protocol | Orders correctness first during initialization and treats it as part of required dimension coverage. |
| `assets/deep_review_strategy.md` | Template | Seeds correctness as the first checkbox in the strategy file. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/02--initialization-and-state-setup/scope-discovery-and-dimension-ordering.md` | Manual scenario | Verifies dimension ordering starts with correctness. |
| `manual_testing_playbook/03--iteration-execution-and-state-discipline/review-iteration-writes-findings-jsonl-and-strategy-update.md` | Manual scenario | Exercises dimension coverage updates during iterations. |
| `manual_testing_playbook/04--convergence-and-recovery/dimension-coverage-convergence-signal.md` | Manual scenario | Verifies correctness participates in the full-dimension stop signal. |

---

## 4. SOURCE METADATA

- Group: Review dimensions
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--review-dimensions/correctness.md`
- Primary sources: `assets/review_mode_contract.yaml`, `SKILL.md`, `references/protocol/loop_protocol.md`, `assets/deep_review_strategy.md`
Related references:
- [security.md](security.md) — Security
