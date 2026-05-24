---
title: "council_graph_upsert empty input no-op success"
description: "Verify council_graph_upsert returns explicit no-op success on empty input."
---

# council_graph_upsert empty input no-op success

## 1. OVERVIEW

Verify council_graph_upsert returns explicit no-op success on empty input.

Reducers and incremental updaters frequently issue diff-driven upserts where the diff for a given round may be empty (no new claims/disagreements/evidence since the previous tick).

Operators use this feature when the real request is: Try to upsert nothing into the council graph and tell me whether that errors or succeeds quietly.

---

## 2. CURRENT REALITY

The shipped surface is anchored by `council_graph_upsert`, `council_graph_status`, `deep-ai-council`. The playbook scenario `08--council-graph-integration/002-council-graph-upsert-empty-input-no-op-success.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-020.

Current behavior is grounded in `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/upsert.ts`, which the scenario identifies as mcp handler: explicit empty-input no-op branch (p1-001 remediation). Validation is anchored by `.opencode/skills/system-spec-kit/mcp_server/tests/council-graph.vitest.ts`, covering test: "treats empty upsert as an explicit no-op success".

The user-visible contract is concrete: Verify council_graph_upsert returns explicit no-op success on empty input. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/upsert.ts` | Handler | MCP handler: explicit empty-input no-op branch (P1-001 remediation) |

### Validation And Tests

| File | Focus |
|------|-------|
| `manual_testing_playbook/08--council-graph-integration/002-council-graph-upsert-empty-input-no-op-success.md` | Manual scenario contract |
| `.opencode/skills/system-spec-kit/mcp_server/tests/council-graph.vitest.ts` | Test: "treats empty upsert as an explicit no-op success" |
| Internal design notes | CHK-020 lists this behavior |

---

## 4. SOURCE METADATA
- Group: Council Graph Integration
- Feature ID: DAC-020
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `feature_catalog/08--council-graph-integration/02-council-graph-upsert-empty-input-no-op-success.md`
- Playbook scenario: `manual_testing_playbook/08--council-graph-integration/002-council-graph-upsert-empty-input-no-op-success.md`
