---
title: "008 code_graph_context readiness block"
description: "Verify context retrieval preserves readiness metadata and blocks full-scan-required states."
trigger_phrases:
  - "008"
  - "code graph context readiness block"
  - "system-code-graph manual testing"
importance_tier: "normal"
version: 1.2.0.3
id: code-graph-context-readiness-block
category: context_retrieval
stage: routing
expected_workflow_mode: system-code-graph
expected_leaf_resources:
  - workflow_mode: system-code-graph
    leaf_resource_id: manual_testing_playbook/context_retrieval/code_graph_context_readiness_block.md
---
# 008 code_graph_context readiness block

Prompt: Check that code_graph_context blocks broad stale state and returns readiness metadata instead of omitting graph-safety details.

## 1. OVERVIEW

Verify context retrieval preserves readiness metadata and blocks full-scan-required states.

---

## 2. SCENARIO CONTRACT

- Objective: Verify context retrieval preserves readiness metadata and blocks full-scan-required states.
- Real user request: `Check that code_graph_context blocks broad stale state and returns readiness metadata instead of omitting graph-safety details.`
- Operator prompt: `Validate code_graph_context against broad stale state in a disposable workspace. Show the blocked payload, graph omission and readiness metadata, then return PASS/FAIL.`
- Expected execution process: Run a full scan, touch more than 50 tracked source files and call `code_graph_context` in neighborhood mode for `handleCodeGraphQuery`.
- Expected signals: Payload returns `status:"blocked"`, `graphAnswersOmitted:true`, `requiredAction:"code_graph_scan"`, readiness, canonical readiness and trust state.
- Desired user-visible outcome: A concise verdict explaining whether context retrieval blocked safely and exposed the needed diagnostics.
- Pass/fail: PASS if broad stale state blocks with graph omission and readiness metadata. FAIL if context answers stale graph data, omits `requiredAction` or drops readiness/trust fields.

---

## 3. TEST EXECUTION

### Commands

1. Run full scan.
2. Touch more than 50 tracked source files.
3. Call `code_graph_context({"queryMode":"neighborhood","subject":"handleCodeGraphQuery"})`.

### Expected Output / Verification

Payload returns `status:"blocked"`, `graphAnswersOmitted:true`, `requiredAction:"code_graph_scan"`, readiness, canonical readiness and trust state.

### Cleanup

`rm -rf "$WORK"`

### Variant Scenarios

Call with a single stale file and verify selective self-heal mirrors query behavior.

---

## 4. SOURCE FILES

| File | Role |
| --- | --- |
| `../manual_testing_playbook.md` | Root playbook index |
| `../../feature_catalog/feature_catalog.md` | Runtime feature catalog |

---

## 5. SOURCE METADATA

- Group: Code Graph Runtime
- Playbook ID: 008
- Canonical root source: `manual_testing_playbook.md`
