---
title: "Scenario DISCOVER-DRIFT-001: tool-surface drift fails closed"
description: "When live discovery disagrees with the baseline inventory, the transport must fail closed on mismatched tools and record the drift."
trigger_phrases: ["webflow playbook drift", "webflow discovery drift"]
importance_tier: normal
version: 1.0.0.0
---

# DISCOVER-DRIFT-001: Tool-surface drift fails closed

## Objective

Verify the discovery-first contract: live `list_tools` output is authoritative; any tool not in
the baseline inventory (or renamed) is not called from memory.

## Steps

1. Run `list_tools`; filter `webflow.webflow.*`.
2. Compare names + input schemas against `references/tool-surface.md`.
3. On drift (missing/renamed/extra tools): record the drift, refuse calls to mismatched tools,
   and update `tool-surface.md` with a dated fixture.

## Expected

- No call to a drifted tool name.
- Drift recorded (dated) before any further action.

## Evidence

Fails closed by design; this scenario documents the required behavior for the first authenticated
session (currently BLOCKED — no token/test site).
