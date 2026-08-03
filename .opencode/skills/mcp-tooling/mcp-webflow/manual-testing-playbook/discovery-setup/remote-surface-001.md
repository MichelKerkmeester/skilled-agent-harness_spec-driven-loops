---
title: "Scenario REMOTE-SURFACE-001: remote vs local surface reconciliation"
description: "The remote deployed surface (31 tools / 216 actions) and the local OSS server (18 modules) differ; the pinned session's live discovery decides."
trigger_phrases: ["webflow playbook remote surface", "webflow surface reconciliation"]
importance_tier: normal
version: 1.0.0.0
---

# REMOTE-SURFACE-001: Remote vs local surface reconciliation

## Objective

Verify that the session resolves which surface is live (remote 31-tool / 216-action surface per
official docs vs local 18-module OSS server) and records it before any call.

## Steps

1. Run `list_tools()`; count `webflow.webflow.*` entries.
2. Compare against BOTH `references/action-reference.md` (remote, 216 actions) and
   `references/tool-surface.md` (local OSS, 18 modules).
3. Record which surface matched, pin the version, and note any drift.

## Expected

- The matched surface is identified and recorded (dated fixture).
- No call is made from the wrong surface's inventory.

## Evidence

Official docs data-tools/designer-tools/utility-tools (2026-08-03); OSS repo `src/tools/*` —
the version-surface contradiction documented in `references/mcp-wiring.md` §6.
