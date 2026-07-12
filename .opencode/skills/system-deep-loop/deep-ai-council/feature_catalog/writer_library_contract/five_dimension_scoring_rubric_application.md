---
title: "Five-dimension scoring rubric application"
description: "Verify the 5-dimension rubric is documented with weights matching agent 6 and can be applied to a hypothetical seat output."
trigger_phrases:
  - "five-dimension scoring rubric application"
  - "scoring_rubric"
  - "apply 5-dimension rubric"
  - "council seat scoring weights"
  - "score hypothetical seat output"
version: 2.3.0.9
---

# Five-dimension scoring rubric application

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Verify the 5-dimension rubric is documented with weights matching agent 6 and can be applied to a hypothetical seat output.

Council synthesis must score every seat with the same rubric. Without the fixed weights, selection drifts back into subjective picking.

Operators use this feature when the real request is: Score this hypothetical council seat output using the 5-dimension rubric and show the comparison table row.

---

## 2. HOW IT WORKS

The shipped surface is anchored by `deep-ai-council`. The playbook scenario `writer-library-contract/five-dimension-scoring-rubric-application.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-015.

Current behavior is grounded in `.opencode/skills/system-deep-loop/deep-ai-council/references/scoring/scoring_rubric.md`, which the scenario identifies as rubric and comparison-table reference. Validation is anchored by `manual_testing_playbook/writer_library_contract/five_dimension_scoring_rubric_application.md`, covering manual scenario contract.

The user-visible contract is concrete: Verify the 5-dimension rubric is documented with weights matching agent 6 and can be applied to a hypothetical seat output. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/system-deep-loop/deep-ai-council/references/scoring/scoring_rubric.md` | Reference | Rubric and comparison-table reference |
| `.opencode/agents/ai-council.md` | Runtime Mirror | Authoritative synthesis protocol |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/writer_library_contract/five_dimension_scoring_rubric_application.md` | Automated test | Manual scenario contract |

---

## 4. SOURCE METADATA
- Group: Writer Library Contract
- Feature ID: DAC-015
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `feature_catalog/writer_library_contract/five_dimension_scoring_rubric_application.md`
- Playbook scenario: `manual_testing_playbook/writer_library_contract/five_dimension_scoring_rubric_application.md`
Related references:
- [library-writer-call-sequence.md](../writer_library_contract/library_writer_call_sequence.md) — Library writer call sequence
- [hunter-skeptic-referee-cross-critique.md](../writer_library_contract/hunter_skeptic_referee_cross_critique.md) — Hunter Skeptic Referee cross-critique
