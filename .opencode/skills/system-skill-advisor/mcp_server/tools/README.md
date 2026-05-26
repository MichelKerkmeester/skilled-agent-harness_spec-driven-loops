---
title: "Skill Advisor Tools: MCP Tool Descriptors"
description: "Tool descriptor modules for native advisor and skill graph MCP endpoints."
trigger_phrases:
  - "advisor tools"
  - "skill advisor descriptors"
  - "advisor mcp tools"
---

# Skill Advisor Tools: MCP Tool Descriptors

<!-- sk-doc-template: skill_readme -->

---

## 1. OVERVIEW

`mcp_server/tools/` contains MCP `ToolDefinition` descriptors for the standalone `mk_skill_advisor` surface. Each descriptor defines a tool name, prompt-safe description and JSON Schema input contract.

Current state:

- `advisor_recommend` routes prompts through the native advisor scorer.
- `advisor_status` reports freshness, trust state and daemon availability.
- `advisor_rebuild` rebuilds checked-in skill metadata when status is stale or absent.
- `advisor_validate` runs the heavier advisor validation bundle after explicit confirmation.
- `skill_graph_scan`, `skill_graph_query`, `skill_graph_status` and `skill_graph_validate` expose the advisor-owned skill graph MCP surface.

---

## 2. DIRECTORY TREE

```text
tools/
+-- advisor-contract-keys.ts  # Shared parameter key tuples for selected contracts
+-- advisor-rebuild.ts        # advisor_rebuild descriptor
+-- advisor-recommend.ts      # advisor_recommend descriptor
+-- advisor-status.ts         # advisor_status descriptor
+-- advisor-validate.ts       # advisor_validate descriptor
+-- index.ts                  # Descriptor barrel exports
+-- skill-graph-tools.ts      # skill_graph_* descriptors and dispatcher
+-- types.ts                  # Descriptor type contract
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `index.ts` | Re-exports all advisor tool descriptors. |
| `advisor-recommend.ts` | Defines the `advisor_recommend` input schema and descriptor text. |
| `advisor-status.ts` | Defines the `advisor_status` workspace-root schema. |
| `advisor-rebuild.ts` | Defines the explicit rebuild descriptor and optional `force` flag. |
| `advisor-validate.ts` | Defines the heavy validation descriptor with `confirmHeavyRun: true`. |
| `advisor-contract-keys.ts` | Keeps selected descriptor property keys aligned with schema consumers. |
| `skill-graph-tools.ts` | Defines `skill_graph_scan`, `skill_graph_query`, `skill_graph_status` and `skill_graph_validate`. |
| `types.ts` | Defines the local `ToolDefinition` contract. |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Descriptor modules import `ToolDefinition` and contract-key tuples only. |
| Exports | `index.ts` exports descriptor constants for registration code. |
| Ownership | Runtime scoring, cache, rebuild and validation logic belongs in advisor libraries and handlers, not descriptor files. |

Main flow:

```text
Tool descriptor file
        │
        ▼
index.ts barrel export
        │
        ▼
MCP server registration
        │
        ▼
Advisor handler validates input and runs logic
```

---

## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `advisorRecommendTool` | Descriptor | Registers `advisor_recommend`. |
| `advisorStatusTool` | Descriptor | Registers `advisor_status`. |
| `advisorRebuildTool` | Descriptor | Registers `advisor_rebuild`. |
| `advisorValidateTool` | Descriptor | Registers `advisor_validate`. |
| `skillGraphScanTool` | Descriptor | Registers `skill_graph_scan`. |
| `skillGraphQueryTool` | Descriptor | Registers `skill_graph_query`. |
| `skillGraphStatusTool` | Descriptor | Registers `skill_graph_status`. |
| `skillGraphValidateTool` | Descriptor | Registers `skill_graph_validate`. |

---

## 6. VALIDATION

Run from the repository root.

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-skill-advisor/mcp_server/tools/README.md
```

Expected result: exit code `0`.

---

## 7. RELATED

- [`../README.md`](../README.md)
- [`index.ts`](index.ts)
