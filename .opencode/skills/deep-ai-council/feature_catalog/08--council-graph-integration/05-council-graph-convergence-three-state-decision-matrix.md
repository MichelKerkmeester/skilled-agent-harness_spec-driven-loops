---
title: "council_graph_convergence three-state decision matrix"
description: "Verify council_graph_convergence returns the correct bucket for each of three documented signal configurations."
---

# council_graph_convergence three-state decision matrix

## 1. OVERVIEW

Verify council_graph_convergence returns the correct bucket for each of three documented signal configurations.

The three-state output is the council orchestrator's primary stop/continue/escalate signal.

Operators use this feature when the real request is: Decide whether the council should stop, continue, or block on three different setups.

---

## 2. CURRENT REALITY

The shipped surface is anchored by `council_graph_upsert`, `council_graph_convergence`, `deep-ai-council`. The playbook scenario `08--council-graph-integration/005-council-graph-convergence-three-state-decision-matrix.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-023.

Current behavior is grounded in `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/convergence.ts`, which the scenario identifies as mcp handler: three-state decision logic. Validation is anchored by `.opencode/skills/system-spec-kit/mcp_server/tests/council-graph.vitest.ts`, covering tests: "allows convergence when ... thresholds are met", "continues convergence when non-blocking thresholds are not met", "blocks convergence for empty derived graphs...".

The user-visible contract is concrete: Verify council_graph_convergence returns the correct bucket for each of three documented signal configurations. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/convergence.ts` | Handler | MCP handler: three-state decision logic |
| `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-query.ts` | Library | Per-signal helpers (`agreementRatio`, `dissentDensity`, etc.) |
| `.opencode/skills/deep-ai-council/references/graph_support.md 4` | Reference | Documents the convergence signals |

### Validation And Tests

| File | Focus |
|------|-------|
| `manual_testing_playbook/08--council-graph-integration/005-council-graph-convergence-three-state-decision-matrix.md` | Manual scenario contract |
| `.opencode/skills/system-spec-kit/mcp_server/tests/council-graph.vitest.ts` | Tests: "allows convergence when ... thresholds are met", "continues convergence when non-blocking thresholds are not met", "blocks convergence for empty derived graphs..." |

---

## 4. SOURCE METADATA
- Group: Council Graph Integration
- Feature ID: DAC-023
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `feature_catalog/08--council-graph-integration/05-council-graph-convergence-three-state-decision-matrix.md`
- Playbook scenario: `manual_testing_playbook/08--council-graph-integration/005-council-graph-convergence-three-state-decision-matrix.md`
