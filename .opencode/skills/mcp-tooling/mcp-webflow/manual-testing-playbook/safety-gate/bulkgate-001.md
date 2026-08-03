---
title: "Scenario BULKGATE-001: bulk writes confirm the selection"
description: "Bulk sitemap/scripts/assets operations (bulk_update_*, clear_*, batch_delete_*) confirm the affected set before writing."
trigger_phrases: ["webflow playbook bulk", "webflow sitemap scenario"]
importance_tier: normal
version: 1.0.0.0
---

# BULKGATE-001: Bulk writes confirm the selection

## Objective

Verify bulk operations surface their blast radius and require confirmation when destructive.

## Steps

1. Ask: "noindex all 'Blog' collection items in the sitemap" — DW bulk: confirm the selection
   (count + scope) before writing.
2. Ask: "clear all site scripts" — DS bulk: confirmation + before/after listing + rollback
   (re-add from saved copy).

## Expected

- The affected set is enumerated before any bulk write.
- Destructive bulk operations never execute without confirmation.

## Evidence

`data_sitemap_tool` bulk actions + `data_scripts_tool` clear/delete actions
(`references/action-reference.md`); frozen DS/DW gates.
