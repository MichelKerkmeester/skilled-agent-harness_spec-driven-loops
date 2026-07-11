---
title: "Resume after interrupted state"
description: "Verify an interrupted council run can resume from the last completed JSONL event and continue toward council_complete."
trigger_phrases:
  - "resume after interrupted state"
  - "append-only JSONL resume"
  - "resume interrupted council run"
  - "council state continuation"
  - "recover from council interruption"
version: 2.3.0.9
---

# Resume after interrupted state

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Verify an interrupted council run can resume from the last completed JSONL event and continue toward council_complete.

Council state is append-only. Resume behavior must continue from real JSONL events instead of guessing or rewriting history.

Operators use this feature when the real request is: Resume an interrupted council run from the last completed JSONL event and continue toward council_complete.

---

## 2. HOW IT WORKS

The shipped surface is anchored by `deep-ai-council`. The playbook scenario `depth-and-failure-handling/resume-after-interrupted-state.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-018.

Current behavior is grounded in `.opencode/skills/system-deep-loop/deep-ai-council/references/structure/state_format.md`, which the scenario identifies as resume semantics reference. Validation is anchored by `manual_testing_playbook/depth-and-failure-handling/resume-after-interrupted-state.md`, covering manual scenario contract.

The user-visible contract is concrete: Verify an interrupted council run can resume from the last completed JSONL event and continue toward council_complete. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/system-deep-loop/deep-ai-council/references/structure/state_format.md` | Reference | Resume semantics reference |
| `.opencode/agents/ai-council.md` | Runtime Mirror | Authoritative invocation and resume contract |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/depth-and-failure-handling/resume-after-interrupted-state.md` | Automated test | Manual scenario contract |

---

## 4. SOURCE METADATA
- Group: Depth And Failure Handling
- Feature ID: DAC-018
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `feature_catalog/depth-and-failure-handling/resume-after-interrupted-state.md`
- Playbook scenario: `manual_testing_playbook/depth-and-failure-handling/resume-after-interrupted-state.md`
Related references:
- [depth-detection-parallel-vs-sequential.md](depth-detection-parallel-vs-sequential.md) — Depth detection parallel vs sequential
