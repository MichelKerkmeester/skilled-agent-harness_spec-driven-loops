---
title: "Council graph MCP surface retired"
description: "Verify council graph MCP entries are absent and the runtime council CLI remains covered."
trigger_phrases:
  - "council graph mcp surface retired"
  - "runtime/ --loop-type council"
  - "council graph no mcp context"
  - "mk-spec-memory council graph absent"
  - "council graph runtime cli only"
version: 2.3.0.10
---

# Council graph MCP surface retired

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Verify council graph operations no longer consume mk-spec-memory MCP tool slots and remain available through `runtime/ --loop-type council`.

ADR-001 still keeps council graph semantics separate from research/review graph semantics; the ownership boundary moved from mk-spec-memory MCP handlers to runtime CLI scripts.

Operators use this feature when the real request is: Confirm council graph operations no longer consume MCP context while still supporting replay/query/status/convergence.

---

## 2. HOW IT WORKS

The shipped surface is anchored by `runtime//scripts/{upsert,query,status,convergence}.cjs --loop-type council`, plus `deep-ai-council/scripts/replay-graph-from-artifacts.cjs` for artifact replay. The playbook scenario `council-graph-integration/council-graph-tools-registered-separately-from-deep-loop.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-026.

Current behavior is grounded in `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts`, where the live registry now imports at 35 tools and has no council graph entries. Validation is anchored by `.opencode/skills/system-deep-loop/runtime/tests/integration/council-graph-script.vitest.ts`, covering runtime script behavior for upsert, query, status, convergence, and error contracts.

The user-visible contract is concrete: council graph behavior remains available, but mk-spec-memory no longer exposes a council graph MCP family.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs` | Runtime CLI | Council node/edge projection writes |
| `.opencode/skills/system-deep-loop/runtime/scripts/query.cjs` | Runtime CLI | Council graph query modes |
| `.opencode/skills/system-deep-loop/runtime/scripts/status.cjs` | Runtime CLI | Council readiness and recovery payload |
| `.opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs` | Runtime CLI | Council convergence bridge fields |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | MCP registry | 35-tool live inventory without council graph entries |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/council_graph_integration/council_graph_tools_registered_separately_from_deep_loop.md` | Automated test | Manual scenario contract |
| `.opencode/skills/system-deep-loop/runtime/tests/integration/council-graph-script.vitest.ts` | Automated test | Runtime council CLI coverage |

---

## 4. SOURCE METADATA

- Group: Council Graph Integration
- Feature ID: DAC-026
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `feature_catalog/council_graph_integration/council_graph_tools_registered_separately_from_deep_loop.md`
- Playbook scenario: `manual_testing_playbook/council_graph_integration/council_graph_tools_registered_separately_from_deep_loop.md`
Related references:
- [council-graph-derived-projection-rebuilds-from-artifacts.md](../council_graph_integration/council_graph_derived_projection_rebuilds_from_artifacts.md) — Derived projection rebuilds from artifacts
