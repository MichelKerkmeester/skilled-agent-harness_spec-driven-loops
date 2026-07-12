---
title: "runtime query CLI hostile metadata redaction"
description: "Verify runtime query CLI redacts arbitrary metadata keys and bounds string lengths in its response."
trigger_phrases:
  - "runtime query cli hostile metadata redaction"
  - "council-graph-query allowlist"
  - "redact council graph metadata"
  - "metadata key allowlist"
  - "prompt-safe query output"
version: 2.3.0.10
---

# runtime query CLI hostile metadata redaction

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Verify runtime query CLI redacts arbitrary metadata keys and bounds string lengths in its response.

Council artifacts are user-influenced text (seat output, deliberations, critiques).

Operators use this feature when the real request is: Query the council graph after I seed a node with weird metadata keys and oversized strings, and tell me what the query response actually exposes.

---

## 2. HOW IT WORKS

The shipped surface is anchored by `runtime upsert CLI`, `runtime query CLI`, `deep-ai-council`. The playbook scenario `council-graph-integration/council-graph-query-hostile-metadata-redaction.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-021.

Current behavior is grounded in `.opencode/skills/system-deep-loop/runtime/lib/council/council-graph-query.ts`, which the scenario identifies as allowlist + length bounds (p1-003 remediation). Validation is anchored by `.opencode/skills/system-deep-loop/runtime/tests/integration/council-graph-script.vitest.ts`, covering test: "redacts arbitrary metadata from prompt-safe query output".

The user-visible contract is concrete: Verify runtime query CLI redacts arbitrary metadata keys and bounds string lengths in its response. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/system-deep-loop/runtime/lib/council/council-graph-query.ts` | Library | Allowlist + length bounds (P1-003 remediation) |
| `.opencode/skills/system-deep-loop/runtime/scripts/query.cjs` | Handler | runtime CLI script: prompt-safe query envelope |
| `.opencode/skills/system-deep-loop/deep-ai-council/references/integration/graph_support.md` | Reference | Documents the allowlist contract |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/council_graph_integration/council_graph_query_hostile_metadata_redaction.md` | Automated test | Manual scenario contract |
| `.opencode/skills/system-deep-loop/runtime/tests/integration/council-graph-script.vitest.ts` | Automated test | Test: "redacts arbitrary metadata from prompt-safe query output" |

---

## 4. SOURCE METADATA
- Group: Council Graph Integration
- Feature ID: DAC-021
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `feature_catalog/council_graph_integration/council_graph_query_hostile_metadata_redaction.md`
- Playbook scenario: `manual_testing_playbook/council_graph_integration/council_graph_query_hostile_metadata_redaction.md`
Related references:
- [council-graph-upsert-empty-input-no-op-success.md](../council_graph_integration/council_graph_upsert_empty_input_no_op_success.md) — runtime upsert CLI empty input no-op success
- [council-graph-query-five-modes-prompt-safe-context.md](../council_graph_integration/council_graph_query_five_modes_prompt_safe_context.md) — runtime query CLI five modes return prompt-safe context
