---
title: "Hunter Skeptic Referee cross-critique"
description: "Verify Hunter, Skeptic, and Referee roles are documented with the score adjustment rule and comparison-table treatment."
---

# Hunter Skeptic Referee cross-critique

## 1. OVERVIEW

Verify Hunter, Skeptic, and Referee roles are documented with the score adjustment rule and comparison-table treatment.

Close scores and identical plans are where fake consensus hides. Hunter, Skeptic, and Referee roles force the council to test whether agreement is earned.

Operators use this feature when the real request is: Apply the Hunter / Skeptic / Referee critique pattern to a hypothetical close-score council and show the score adjustment.

---

## 2. CURRENT REALITY

The shipped surface is anchored by `deep-ai-council`. The playbook scenario `07--writer-library-contract/003-hunter-skeptic-referee-cross-critique.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-016.

Current behavior is grounded in `.opencode/skills/deep-ai-council/references/scoring/scoring_rubric.md`, which the scenario identifies as cross-critique reference. Validation is anchored by `manual_testing_playbook/07--writer-library-contract/003-hunter-skeptic-referee-cross-critique.md`, covering manual scenario contract.

The user-visible contract is concrete: Verify Hunter, Skeptic, and Referee roles are documented with the score adjustment rule and comparison-table treatment. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/deep-ai-council/references/scoring/scoring_rubric.md` | Reference | Cross-critique reference |
| `.opencode/agents/ai-council.md` | Runtime Mirror | Authoritative synthesis protocol |

### Validation And Tests

| File | Focus |
|------|-------|
| `manual_testing_playbook/07--writer-library-contract/003-hunter-skeptic-referee-cross-critique.md` | Manual scenario contract |

---

## 4. SOURCE METADATA
- Group: Writer Library Contract
- Feature ID: DAC-016
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `feature_catalog/07--writer-library-contract/03-hunter-skeptic-referee-cross-critique.md`
- Playbook scenario: `manual_testing_playbook/07--writer-library-contract/003-hunter-skeptic-referee-cross-critique.md`
