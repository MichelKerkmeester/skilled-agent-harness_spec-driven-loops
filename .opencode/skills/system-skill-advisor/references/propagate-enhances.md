---
title: "Skill Graph Propagate Enhances Tool"
description: "Internal MCP tool for detecting and optionally applying missing inbound enhances edges across skills."
trigger_phrases:
  - "propagate enhances"
  - "missing enhances edges"
  - "enhances edge propagation"
---

# Skill Graph Propagate Enhances Tool

<!-- sk-doc-template: skill_reference -->

---

<!-- ANCHOR:1-overview -->
## 1. OVERVIEW

`skill_graph_propagate_enhances` is an internal MCP tool that detects and optionally applies missing inbound `enhances` edges across skills. It is the internal trusted-caller tool in the `mk_skill_advisor` MCP server. See [tool-ids-reference.md](./tool-ids-reference.md) §4 for the canonical list of all 8 public plus 1 internal tools. It is gated behind trusted-caller authentication.

The tool combines three weighted detection rules into a composite confidence score in the range 0 to 1. Higher confidence values indicate stronger evidence that a missing edge should exist. The tool is not invoked by other handlers automatically.

---

<!-- /ANCHOR:1-overview -->

<!-- ANCHOR:2-detection-rules -->
## 2. DETECTION RULES

Three rules contribute to the composite confidence score with capped maximum contributions:

| Rule | Max Contribution | Condition |
|---|---|---|
| family-inference | 0.45 | Source skill already enhances many peers in target's family |
| asset-shape | 0.30 | Target has files or assets matching source's `enhance_when` rules |
| sibling-transitivity | 0.15 | Source enhances B and B has target as a sibling |

Family-inference is the strongest signal and requires at least three existing `enhances` entries before it contributes. Asset-shape inspects the target skill's filesystem layout against the source's declared trigger shape. Sibling-transitivity walks one hop through known sibling links.

---

<!-- /ANCHOR:2-detection-rules -->

<!-- ANCHOR:3-operation-modes -->
## 3. OPERATION MODES

Three modes control read-write behavior:

- `report` - Returns candidates without making any changes. This is the default.
- `propose` - Returns candidates without making any changes. Functionally an alias for `report`.
- `apply` - Writes selected candidates to source `graph-metadata.json` files.

`apply` mode only writes candidates that are explicitly selected by ID or selected through `applyAllHighConfidence=true` for candidates above `minConfidence` (default 0.75). `dryRun` defaults to true so a fresh `apply` call without explicit `dryRun:false` still produces a no-write preview.

---

<!-- /ANCHOR:3-operation-modes -->

<!-- ANCHOR:4-invariants -->
## 4. INVARIANTS

The tool enforces several invariants on every call:

- Trusted-caller authentication is required via `requireTrustedCaller`. Untrusted callers receive an authentication error before any detection runs.
- The workspace-escape guard resolves `skillsRoot` and verifies it stays under the current working directory. External absolute paths are rejected.
- The default mode is `report`. No writes occur unless `mode:'apply'` is set explicitly.
- The default `dryRun` is true. Writes only occur when `dryRun:false` is set explicitly.
- `apply` mode only writes candidates that match an explicit `applyCandidateIds[]` entry OR meet `minConfidence` when `applyAllHighConfidence=true`.

---

<!-- /ANCHOR:4-invariants -->

<!-- ANCHOR:5-when-it-runs -->
## 5. WHEN IT RUNS

The tool is invoked manually through MCP with a trusted caller context. It is not triggered automatically by other handlers or hooks.

Typical use cases:

- Maintenance sweeps that discover missing `enhances` relationships across a refactored skill set.
- Authoring assistance after adding a new skill that fits an existing family.
- Validation runs that report candidate edges without writing, so operators can review the proposal before applying.

The tool sits beside the eight other skill-graph tools as a low-frequency, high-trust authoring helper.

<!-- /ANCHOR:5-when-it-runs -->
