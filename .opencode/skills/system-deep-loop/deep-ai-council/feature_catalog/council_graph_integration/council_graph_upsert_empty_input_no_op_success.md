---
title: "runtime upsert CLI empty input no-op success"
description: "Verify runtime upsert CLI returns explicit no-op success on empty input."
trigger_phrases:
  - "runtime upsert cli empty input no-op success"
  - "upsert.cjs empty-input"
  - "upsert empty council graph"
  - "no-op upsert branch"
  - "empty diff upsert handling"
version: 2.3.0.10
---

# runtime upsert CLI empty input no-op success

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Verify runtime upsert CLI returns explicit no-op success on empty input.

Reducers and incremental updaters frequently issue diff-driven upserts where the diff for a given round may be empty (no new claims/disagreements/evidence since the previous tick).

Operators use this feature when the real request is: Try to upsert nothing into the council graph and tell me whether that errors or succeeds quietly.

---

## 2. HOW IT WORKS

The shipped surface is anchored by `runtime upsert CLI`, `runtime status CLI`, `deep-ai-council`. The playbook scenario `council-graph-integration/council-graph-upsert-empty-input-no-op-success.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-020.

Current behavior is grounded in `.opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs`, which the scenario identifies as runtime CLI script: explicit empty-input no-op branch (p1-001 remediation). Validation is anchored by `.opencode/skills/system-deep-loop/runtime/tests/integration/council-graph-script.vitest.ts`, covering test: "treats empty upsert as an explicit no-op success".

The user-visible contract is concrete: Verify runtime upsert CLI returns explicit no-op success on empty input. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs` | Handler | runtime CLI script: explicit empty-input no-op branch (P1-001 remediation) |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/council_graph_integration/council_graph_upsert_empty_input_no_op_success.md` | Automated test | Manual scenario contract |
| `.opencode/skills/system-deep-loop/runtime/tests/integration/council-graph-script.vitest.ts` | Automated test | Test: "treats empty upsert as an explicit no-op success" |
| Internal design notes | Automated test | CHK-020 lists this behavior |

---

## 4. SOURCE METADATA
- Group: Council Graph Integration
- Feature ID: DAC-020
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `feature_catalog/council_graph_integration/council_graph_upsert_empty_input_no_op_success.md`
- Playbook scenario: `manual_testing_playbook/council_graph_integration/council_graph_upsert_empty_input_no_op_success.md`
Related references:
- [council-graph-upsert-idempotency-and-self-loop-rejection.md](../council_graph_integration/council_graph_upsert_idempotency_and_self_loop_rejection.md) — runtime upsert CLI idempotency and self-loop rejection
- [council-graph-query-hostile-metadata-redaction.md](../council_graph_integration/council_graph_query_hostile_metadata_redaction.md) — runtime query CLI hostile metadata redaction
