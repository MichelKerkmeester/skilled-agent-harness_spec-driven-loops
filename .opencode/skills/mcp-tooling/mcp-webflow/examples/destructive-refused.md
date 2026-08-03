---
title: "Example: destructive action refused without confirmation"
description: "Shows the fail-closed path for a destructive Webflow request: discovery, class DS, confirmation required, refusal without it."
trigger_phrases: ["webflow delete example", "webflow destructive example"]
importance_tier: normal
contextType: example
version: 1.0.0.0
---

# Example: destructive action refused without confirmation

## Prompt

> "delete all site scripts in the test site"

## Correct flow

1. **Discover**: `list_tools()` per session; confirm `delete_all_site_scripts` exists and its
   class (DS — destructive).
2. **Classify**: DS → operator confirmation required, idempotency guard, before/after listing,
   rollback statement (re-add from saved copy).
3. **Without confirmation**: REFUSE — no `tools/call` to the destructive action.
4. **With confirmation**: capture before-listing, execute, capture after-listing, record the
   rollback path.

## Why

Script deletion is permanent via the MCP surface (no undo endpoint). API-level site restore does
not exist in the Data API v2 surface, so the destructive class carries the strongest
confirmations.
