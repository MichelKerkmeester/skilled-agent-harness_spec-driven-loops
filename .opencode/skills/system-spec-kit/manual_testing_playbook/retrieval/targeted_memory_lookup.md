---
title: "M-002 -- Targeted Memory Lookup"
description: "This snippet preserves the canonical memory/spec-kit operator workflow for `M-002`."
audited_post_018: true
version: 3.6.0.16
id: retrieval-targeted-memory-lookup
expected_workflow_mode: system-spec-kit
expected_leaf_resources:
  - workflow_mode: system-spec-kit
    leaf_resource_id: references/memory/memory_system.md
---

# M-002 -- Targeted Memory Lookup

## 1. OVERVIEW

This snippet preserves the canonical memory/spec-kit operator workflow for `M-002`.

---

## 2. SCENARIO CONTRACT


- Objective: This snippet preserves the canonical memory/spec-kit operator workflow for `M-002`.
- Real user request: `Please validate Targeted Memory Lookup against memory_search({query:"<decision rationale>", specFolder:"specs/<target-spec>", anchors:["decision-record","rationale"]}) and tell me whether the expected signals are present: precise fact-level retrieval.`
- Prompt: `Validate targeted memory_search lookup for decision rationale and confirm precise fact-level retrieval from the target spec.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: precise fact-level retrieval
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: question answered with traceable result.

---

## 3. TEST EXECUTION

### Prompt

`Validate targeted memory_search lookup for decision rationale and confirm precise fact-level retrieval from the target spec.`
### Commands
- `memory_search({query:"<decision rationale>", specFolder:"specs/<target-spec>", anchors:["decision-record","rationale"]})`
### Expected

precise fact-level retrieval.
### Evidence

fact + source snippet.
### Pass/Fail

question answered with traceable result.
### Failure Triage

refine query terms; use focused mode.

---

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [retrieval/semantic_and_lexical_search_memorysearch.md](../../feature_catalog/retrieval/semantic_and_lexical_search_memorysearch.md)

---

## 5. SOURCE METADATA

- Group: Retrieval
- Playbook ID: M-002
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `retrieval/targeted_memory_lookup.md`
