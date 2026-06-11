---
title: "Skill Graph Propagate Enhances Tool"
description: "Internal MCP tool for detecting and optionally applying missing inbound enhances edges across skills."
trigger_phrases:
  - "propagate enhances"
  - "missing enhances edges"
  - "enhances edge propagation"
importance_tier: "normal"
contextType: "implementation"
---

# Skill Graph Propagate Enhances Tool

Internal MCP tool for detecting and optionally applying missing inbound enhances edges across skills.

---

## 1. OVERVIEW

### Purpose

Documents the internal `skill_graph_propagate_enhances` tool for detecting and optionally applying missing inbound `enhances` edges.

### When to Use

- Auditing trusted-caller graph maintenance behavior.
- Reviewing candidate `enhances` edge propagation.
- Confirming why this tool is internal rather than a public hook path.

### Core Principle

Enhance-edge propagation is a high-trust authoring helper: report first, write only with explicit trusted-caller intent.

### Key Sources

- `mcp_server/handlers/skill-graph/propagate-enhances.ts`
- [`tool_ids_reference.md`](../runtime/tool_ids_reference.md)

---

## 2. DETECTION RULES

Three rules contribute to the composite confidence score with capped maximum contributions:

| Rule | Max Contribution | Condition |
|---|---|---|
| family-inference | 0.45 | Source skill already enhances many peers in target's family |
| asset-shape | 0.30 | Target has files or assets matching source's `enhance_when` rules |
| sibling-transitivity | 0.15 | Source enhances B and B has target as a sibling |

Family-inference is the strongest signal and requires at least three existing `enhances` entries before it contributes. Asset-shape inspects the target skill's filesystem layout against the source's declared trigger shape. Sibling-transitivity walks one hop through known sibling links.

---

## 3. OPERATION MODES

Three modes control read-write behavior:

- `report` - Returns candidates without making any changes. This is the default.
- `propose` - Returns candidates without making any changes. Functionally an alias for `report`.
- `apply` - Writes selected candidates to source `graph-metadata.json` files.

`apply` mode only writes candidates that are explicitly selected by ID or selected through `applyAllHighConfidence=true` for candidates above `minConfidence` (default 0.75). `dryRun` defaults to true so a fresh `apply` call without explicit `dryRun:false` still produces a no-write preview.

---

## 4. INVARIANTS

The tool enforces several invariants on every call:

- Trusted-caller authentication is required via `requireTrustedCaller`. Untrusted callers receive an authentication error before any detection runs.
- The workspace-escape guard resolves `skillsRoot` and verifies it stays under the current working directory. External absolute paths are rejected.
- The default mode is `report`. No writes occur unless `mode:'apply'` is set explicitly.
- The default `dryRun` is true. Writes only occur when `dryRun:false` is set explicitly.
- `apply` mode only writes candidates that match an explicit `applyCandidateIds[]` entry OR meet `minConfidence` when `applyAllHighConfidence=true`.

---

## 5. WHEN IT RUNS

The tool is invoked manually through MCP with a trusted caller context. It is not triggered automatically by other handlers or hooks.

Typical use cases:

- Maintenance sweeps that discover missing `enhances` relationships across a refactored skill set.
- Authoring assistance after adding a new skill that fits an existing family.
- Validation runs that report candidate edges without writing, so operators can review the proposal before applying.

The tool sits beside the eight other skill-graph tools as a low-frequency, high-trust authoring helper.
