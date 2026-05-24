---
title: "council_graph_query hostile metadata redaction"
description: "Verify council_graph_query redacts arbitrary metadata keys and bounds string lengths in its response."
---

# council_graph_query hostile metadata redaction

## 1. OVERVIEW

Verify council_graph_query redacts arbitrary metadata keys and bounds string lengths in its response.

Council artifacts are user-influenced text (seat output, deliberations, critiques).

Operators use this feature when the real request is: Query the council graph after I seed a node with weird metadata keys and oversized strings, and tell me what the query response actually exposes.

---

## 2. CURRENT REALITY

The shipped surface is anchored by `council_graph_upsert`, `council_graph_query`, `deep-ai-council`. The playbook scenario `08--council-graph-integration/003-council-graph-query-hostile-metadata-redaction.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-021.

Current behavior is grounded in `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-query.ts`, which the scenario identifies as allowlist + length bounds (p1-003 remediation). Validation is anchored by `.opencode/skills/system-spec-kit/mcp_server/tests/council-graph.vitest.ts`, covering test: "redacts arbitrary metadata from prompt-safe query output".

The user-visible contract is concrete: Verify council_graph_query redacts arbitrary metadata keys and bounds string lengths in its response. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-query.ts` | Library | Allowlist + length bounds (P1-003 remediation) |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/query.ts` | Handler | MCP handler: prompt-safe query envelope |
| `.opencode/skills/deep-ai-council/references/graph_support.md` | Reference | Documents the allowlist contract |

### Validation And Tests

| File | Focus |
|------|-------|
| `manual_testing_playbook/08--council-graph-integration/003-council-graph-query-hostile-metadata-redaction.md` | Manual scenario contract |
| `.opencode/skills/system-spec-kit/mcp_server/tests/council-graph.vitest.ts` | Test: "redacts arbitrary metadata from prompt-safe query output" |

---

## 4. SOURCE METADATA
- Group: Council Graph Integration
- Feature ID: DAC-021
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `feature_catalog/08--council-graph-integration/03-council-graph-query-hostile-metadata-redaction.md`
- Playbook scenario: `manual_testing_playbook/08--council-graph-integration/003-council-graph-query-hostile-metadata-redaction.md`
