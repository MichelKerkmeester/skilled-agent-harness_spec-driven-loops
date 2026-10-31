---
title: "Iteration 005 — final parity and handoff audit"
trigger_phrases: []
---
# Iteration 005 — final parity and handoff audit

## Focus

Perform the final independent completeness audit after the iteration-004 rebuild. Re-run the exact lossless external scan, compare every path-plus-line key with inventory.external.json, verify required hit fields and exclusion boundaries, confirm the five runtime configs and requested agent/command/hook/plugin/bin roots, and reconcile the 41-tool MCP aggregate. Produce final handoff facts for phase 002 and phase 003. Stop only at maxIterations 5; convergence telemetry is not an early-stop condition.

## Required evidence

- Scan with rg --json and --no-ignore-global, preserving the explicit z_archive, lineage, node_modules, and target MCP-tree exclusions.
- Confirm scan and inventory parity, zero parser errors, zero malformed path keys, and complete per-hit fields.
- Confirm root configuration coverage and negative controls, including opencode.json and .utcp_config.json.
- Confirm the MCP aggregate, exposed tool list, server flag count, external flag count, lifecycle split, phase counts, and parent-estimate corrections.
- Preserve the shared advisor/HF/IPC, workflow/API, package, generator, and deep-loop break-risk handoff.
- Do not run repository validation, generated-context, memory MCP, or git write operations.
