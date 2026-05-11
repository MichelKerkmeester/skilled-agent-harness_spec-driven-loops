---
title: "council_graph_upsert idempotency and self-loop rejection"
description: "Verify council_graph_upsert is idempotent and rejects self-loop edges."
---

# council_graph_upsert idempotency and self-loop rejection

## 1. OVERVIEW

Verify council_graph_upsert is idempotent and rejects self-loop edges.

Derived graph rows are replayable from ai-council/** artifacts.

Operators use this feature when the real request is: Upsert the same council session twice and check that nothing is duplicated, and confirm the tool refuses self-loop edges.

---

## 2. CURRENT REALITY

The shipped surface is anchored by `council_graph_upsert`, `council_graph_status`. The playbook scenario `08--council-graph-integration/001-council-graph-upsert-idempotency-and-self-loop-rejection.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-019.

Current behavior is grounded in `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/upsert.ts`, which the scenario identifies as mcp handler: idempotent upsert + self-loop rejection. Validation is anchored by `.opencode/skills/system-spec-kit/mcp_server/tests/council-graph.vitest.ts`, covering test: "upserts prompt-safe council graph data and queries unresolved disagreements and decision support".

The user-visible contract is concrete: Verify council_graph_upsert is idempotent and rejects self-loop edges. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/upsert.ts` | Handler | MCP handler: idempotent upsert + self-loop rejection |
| `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-db.ts` | Library | Storage layer: unique constraints |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Schema | Strict input schema for council_graph_upsert |

### Validation And Tests

| File | Focus |
|------|-------|
| `manual_testing_playbook/08--council-graph-integration/001-council-graph-upsert-idempotency-and-self-loop-rejection.md` | Manual scenario contract |
| `.opencode/skills/system-spec-kit/mcp_server/tests/council-graph.vitest.ts` | Test: "upserts prompt-safe council graph data and queries unresolved disagreements and decision support" |

---

## 4. SOURCE METADATA
- Group: Council Graph Integration
- Feature ID: DAC-019
- Canonical catalog source: `manual_testing_playbook.md`
- Feature file path: `feature_catalog/08--council-graph-integration/01-council-graph-upsert-idempotency-and-self-loop-rejection.md`
- Playbook scenario: `manual_testing_playbook/08--council-graph-integration/001-council-graph-upsert-idempotency-and-self-loop-rejection.md`
