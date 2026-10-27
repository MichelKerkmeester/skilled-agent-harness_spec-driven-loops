---
title: "Review Reach Calibration"
description: "A P0 or P1 review finding must name its reach, an input or caller the code's stated contract allows, and a finding that cannot name one is P2."
trigger_phrases:
  - "review reach calibration"
  - "finding reach"
  - "out-of-contract input"
  - "review severity calibration"
version: 1.0.0.0
---

# Review Reach Calibration (sk-code-review)

## 1. OVERVIEW

A P0 or P1 review finding must name its reach, an input or caller the code's stated contract allows, and a finding that cannot name one is P2.

The rule keeps a review from blocking a merge on a failure no real caller can trigger. The stated contract is what the code promises through its signature, types, doc comment, name and the checks it already makes.

---

## 2. HOW IT WORKS

### The Rule

A `P0` or `P1` finding names its reach in its `Case:` line: an input or call path the stated contract allows, or a real caller that sends the failing input. A failure that needs input outside the contract, such as `NaN` where the contract says a number, a wrong type or an inverted range the code already rejects, is `P2` hardening.

### Exceptions

Input the code claims to validate stays in reach. When a guard, a thrown error or a doc line promises to reject an input class and the promise fails for an input in that class, the gap is a correctness finding and keeps `P1` or higher. A guard claims only the class it checks. At a trust boundary, such as user input, the network, files, the environment or another service, every value the outside can send is in reach, and the stated contract of internal code never narrows a security finding on that data.

### Escalation

The low-confidence escalation rule classifies toward the higher severity and states the uncertainty, and the confidence is confidence that the reach exists. It raises a finding whose reach is named but not proven. It never raises a finding with no reach, so it cannot lift an out-of-contract failure above `P2`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/sk-code/sk-code-review/references/review-core.md` | Shared | The full reach rule and the escalation rule |
| `.skilled/skills/sk-code/sk-code-review/SKILL.md` | Shared | The short form of the rule the review mode applies |
| `.skilled/agents/review.md` | Handler | The review agent that applies the rule |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/sk-code/sk-code-review/manual-testing-playbook/finding-accuracy/seeded-sql-injection.md` | Manual playbook | A seeded defect the review must report at a blocking severity |
| `.skilled/skills/sk-code/sk-code-review/manual-testing-playbook/finding-accuracy/clean-control.md` | Manual playbook | A clean control where an out-of-contract `NaN` note is allowed only at P2 |

---

## 4. SOURCE METADATA

- Group: Review Calibration
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `review-calibration/review-reach-calibration.md`

Related references:
- [codebase-agnostic-quality-gate.md](../quality-gate/codebase-agnostic-quality-gate.md) for the author-side gate that runs before review.
