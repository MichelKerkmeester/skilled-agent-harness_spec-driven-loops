---
title: "Council graph MCP surface retired"
description: "Verify council graph MCP entries are absent and the runtime council CLI remains covered."
trigger_phrases:
  - "council graph mcp surface retired"
  - "deep-loop-runtime --loop-type council"
  - "council graph no mcp context"
  - "mk-spec-memory council graph absent"
  - "council graph runtime cli only"
---

# Council graph MCP surface retired

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Verify council graph operations no longer consume mk-spec-memory MCP tool slots and remain available through `deep-loop-runtime --loop-type council`.

ADR-001 still keeps council graph semantics separate from research/review graph semantics; the ownership boundary moved from mk-spec-memory MCP handlers to runtime CLI scripts.

Operators use this feature when the real request is: Confirm council graph operations no longer consume MCP context while still supporting replay/query/status/convergence.

---

## 2. HOW IT WORKS

The shipped surface is anchored by `deep-loop-runtime/scripts/{upsert,query,status,convergence}.cjs --loop-type council`, plus `deep-ai-council/scripts/replay-graph-from-artifacts.cjs` for artifact replay. The playbook scenario `08--council-graph-integration/026-council-graph-tools-registered-separately-from-deep-loop.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-026.

Current behavior is grounded in `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts`, where the live registry now imports at 35 tools and has no council graph entries. Validation is anchored by `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts`, covering runtime script behavior for upsert, query, status, convergence, and error contracts.

The user-visible contract is concrete: council graph behavior remains available, but mk-spec-memory no longer exposes a council graph MCP family.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/deep-loop-runtime/scripts/upsert.cjs` | Runtime CLI | Council node/edge projection writes |
| `.opencode/skills/deep-loop-runtime/scripts/query.cjs` | Runtime CLI | Council graph query modes |
| `.opencode/skills/deep-loop-runtime/scripts/status.cjs` | Runtime CLI | Council readiness and recovery payload |
| `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` | Runtime CLI | Council convergence bridge fields |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | MCP registry | 35-tool live inventory without council graph entries |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/08--council-graph-integration/026-council-graph-tools-registered-separately-from-deep-loop.md` | Automated test | Manual scenario contract |
| `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts` | Automated test | Runtime council CLI coverage |

---

## 4. SOURCE METADATA

- Group: Council Graph Integration
- Feature ID: DAC-026
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `feature_catalog/08--council-graph-integration/026-council-graph-tools-registered-separately-from-deep-loop.md`
- Playbook scenario: `manual_testing_playbook/08--council-graph-integration/026-council-graph-tools-registered-separately-from-deep-loop.md`
Related references:
- [025-council-graph-derived-projection-rebuilds-from-artifacts.md](025-council-graph-derived-projection-rebuilds-from-artifacts.md) — Derived projection rebuilds from artifacts
