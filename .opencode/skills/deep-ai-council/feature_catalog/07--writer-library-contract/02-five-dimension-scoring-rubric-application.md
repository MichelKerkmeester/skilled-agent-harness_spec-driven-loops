---
title: "Five-dimension scoring rubric application"
description: "Verify the 5-dimension rubric is documented with weights matching agent 6 and can be applied to a hypothetical seat output."
---

# Five-dimension scoring rubric application

## 1. OVERVIEW

Verify the 5-dimension rubric is documented with weights matching agent 6 and can be applied to a hypothetical seat output.

Council synthesis must score every seat with the same rubric. Without the fixed weights, selection drifts back into subjective picking.

Operators use this feature when the real request is: Score this hypothetical council seat output using the 5-dimension rubric and show the comparison table row.

---

## 2. CURRENT REALITY

The shipped surface is anchored by `deep-ai-council`. The playbook scenario `07--writer-library-contract/002-five-dimension-scoring-rubric-application.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-015.

Current behavior is grounded in `.opencode/skills/deep-ai-council/references/scoring/scoring_rubric.md`, which the scenario identifies as rubric and comparison-table reference. Validation is anchored by `manual_testing_playbook/07--writer-library-contract/002-five-dimension-scoring-rubric-application.md`, covering manual scenario contract.

The user-visible contract is concrete: Verify the 5-dimension rubric is documented with weights matching agent 6 and can be applied to a hypothetical seat output. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/deep-ai-council/references/scoring/scoring_rubric.md` | Reference | Rubric and comparison-table reference |
| `.opencode/agents/ai-council.md` | Runtime Mirror | Authoritative synthesis protocol |

### Validation And Tests

| File | Focus |
|------|-------|
| `manual_testing_playbook/07--writer-library-contract/002-five-dimension-scoring-rubric-application.md` | Manual scenario contract |

---

## 4. SOURCE METADATA
- Group: Writer Library Contract
- Feature ID: DAC-015
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `feature_catalog/07--writer-library-contract/02-five-dimension-scoring-rubric-application.md`
- Playbook scenario: `manual_testing_playbook/07--writer-library-contract/002-five-dimension-scoring-rubric-application.md`
