---
title: "council_graph_status recovery payload and readiness"
description: "Verify council_graph_status returns readiness + counts + schema version + signals + namespace-scoped recovery payload, with no false-safe empty success."
---

# council_graph_status recovery payload and readiness

## 1. OVERVIEW

Verify council_graph_status returns readiness + counts + schema version + signals + namespace-scoped recovery payload, with no false-safe empty success.

Callers need to know whether the graph is empty-because-pristine, empty-because-deleted, stale, or corrupted -- so they can decide between replay-from-artifacts or block-and-escalate.

Operators use this feature when the real request is: Tell me whether the council graph is ready to use and how to recover if it is broken.

---

## 2. CURRENT REALITY

The shipped surface is anchored by `council_graph_upsert`, `council_graph_status`, `sk-ai-council`. The playbook scenario `08--council-graph-integration/006-council-graph-status-recovery-payload-and-readiness.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-024.

Current behavior is grounded in `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/status.ts`, which the scenario identifies as mcp handler: counts/schema/signals + recovery payload (p2-001 remediation). Validation is anchored by `.opencode/skills/system-spec-kit/mcp_server/tests/council-graph.vitest.ts`, covering test: "blocks convergence for empty derived graphs instead of returning false-safe success".

The user-visible contract is concrete: Verify council_graph_status returns readiness + counts + schema version + signals + namespace-scoped recovery payload, with no false-safe empty success. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/status.ts` | Handler | MCP handler: counts/schema/signals + recovery payload (P2-001 remediation) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-db.ts` | Library | Storage layer: counts + namespace filter |
| `.opencode/skills/sk-ai-council/references/graph_support.md 5` | Reference | Documents the recovery contract |

### Validation And Tests

| File | Focus |
|------|-------|
| `manual_testing_playbook/08--council-graph-integration/006-council-graph-status-recovery-payload-and-readiness.md` | Manual scenario contract |
| `.opencode/skills/system-spec-kit/mcp_server/tests/council-graph.vitest.ts` | Test: "blocks convergence for empty derived graphs instead of returning false-safe success" |

---

## 4. SOURCE METADATA
- Group: Council Graph Integration
- Feature ID: DAC-024
- Canonical catalog source: `manual_testing_playbook.md`
- Feature file path: `feature_catalog/08--council-graph-integration/06-council-graph-status-recovery-payload-and-readiness.md`
- Playbook scenario: `manual_testing_playbook/08--council-graph-integration/006-council-graph-status-recovery-payload-and-readiness.md`
