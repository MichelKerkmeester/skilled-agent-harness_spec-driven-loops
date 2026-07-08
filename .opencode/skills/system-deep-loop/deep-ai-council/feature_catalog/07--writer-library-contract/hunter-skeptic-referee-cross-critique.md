---
title: "Hunter Skeptic Referee cross-critique"
description: "Verify Hunter, Skeptic, and Referee roles are documented with the score adjustment rule and comparison-table treatment."
trigger_phrases:
  - "hunter skeptic referee cross-critique"
  - "scoring_rubric cross-critique"
  - "apply hunter skeptic referee pattern"
  - "score adjustment role"
  - "council anti-consensus critique"
version: 2.3.0.9
---

# Hunter Skeptic Referee cross-critique

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Verify Hunter, Skeptic, and Referee roles are documented with the score adjustment rule and comparison-table treatment.

Close scores and identical plans are where fake consensus hides. Hunter, Skeptic, and Referee roles force the council to test whether agreement is earned.

Operators use this feature when the real request is: Apply the Hunter / Skeptic / Referee critique pattern to a hypothetical close-score council and show the score adjustment.

---

## 2. HOW IT WORKS

The shipped surface is anchored by `deep-ai-council`. The playbook scenario `07--writer-library-contract/hunter-skeptic-referee-cross-critique.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-016.

Current behavior is grounded in `.opencode/skills/system-deep-loop/deep-ai-council/references/scoring/scoring_rubric.md`, which the scenario identifies as cross-critique reference. Validation is anchored by `manual_testing_playbook/07--writer-library-contract/hunter-skeptic-referee-cross-critique.md`, covering manual scenario contract.

The user-visible contract is concrete: Verify Hunter, Skeptic, and Referee roles are documented with the score adjustment rule and comparison-table treatment. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/system-deep-loop/deep-ai-council/references/scoring/scoring_rubric.md` | Reference | Cross-critique reference |
| `.opencode/agents/ai-council.md` | Runtime Mirror | Authoritative synthesis protocol |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/07--writer-library-contract/hunter-skeptic-referee-cross-critique.md` | Automated test | Manual scenario contract |

---

## 4. SOURCE METADATA
- Group: Writer Library Contract
- Feature ID: DAC-016
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `feature_catalog/07--writer-library-contract/hunter-skeptic-referee-cross-critique.md`
- Playbook scenario: `manual_testing_playbook/07--writer-library-contract/hunter-skeptic-referee-cross-critique.md`
Related references:
- [five-dimension-scoring-rubric-application.md](five-dimension-scoring-rubric-application.md) — Five-dimension scoring rubric application
- [out-of-scope-write-rejection.md](out-of-scope-write-rejection.md) — OUT_OF_SCOPE_WRITE rejection
