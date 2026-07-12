---
title: "Library writer call sequence"
description: "Verify lib/persist-artifacts.cjs exports the 7 named writers and that they emit artifact_written events."
trigger_phrases:
  - "library writer call sequence"
  - "lib/persist-artifacts.cjs"
  - "council writer sequence"
  - "artifact_written event"
  - "7 named writers contract"
version: 2.3.0.9
---

# Library writer call sequence

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Verify lib/persist-artifacts.cjs exports the 7 named writers and that they emit artifact_written events.

Council persistence depends on a stable writer library. Missing writers or missing audit events break artifact recovery and completion evidence.

Operators use this feature when the real request is: Show me the canonical writer sequence the council uses.

---

## 2. HOW IT WORKS

The shipped surface is anchored by `deep-ai-council`. The playbook scenario `writer-library-contract/library-writer-call-sequence.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-013.

Current behavior is grounded in `.opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/persist-artifacts.cjs`, which the scenario identifies as writer library and audit event implementation. Validation is anchored by `manual_testing_playbook/writer_library_contract/library_writer_call_sequence.md`, covering manual scenario contract.

The user-visible contract is concrete: Verify lib/persist-artifacts.cjs exports the 7 named writers and that they emit artifact_written events. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/persist-artifacts.cjs` | Library | Writer library and audit event implementation |
| `.opencode/agents/ai-council.md` | Runtime Mirror | Canonical writer sequence in invocation contract |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/writer_library_contract/library_writer_call_sequence.md` | Automated test | Manual scenario contract |

---

## 4. SOURCE METADATA
- Group: Writer Library Contract
- Feature ID: DAC-013
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `feature_catalog/writer_library_contract/library_writer_call_sequence.md`
- Playbook scenario: `manual_testing_playbook/writer_library_contract/library_writer_call_sequence.md`
Related references:
- [five-dimension-scoring-rubric-application.md](../writer_library_contract/five_dimension_scoring_rubric_application.md) — Five-dimension scoring rubric application
