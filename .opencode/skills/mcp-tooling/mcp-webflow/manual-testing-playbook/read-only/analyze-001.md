---
title: "Scenario ANALYZE-001: Analyze reports read-only"
description: "Webflow Analyze add-on reports are read-only and pass ungated (site must have the Analyze add-on)."
trigger_phrases: ["webflow playbook analyze", "webflow analytics scenario"]
importance_tier: normal
version: 1.0.0.0
---

# ANALYZE-001: Analyze reports read-only

## Objective

Verify Analyze actions (`data_analyze_tool`) run without confirmation and return report data.

## Steps

1. Ask: "traffic trend for the test site over the last 30 days".
2. Ask: "rank top pages by visits last week".

## Expected

- Both execute after a scope check only (RO).
- Guide actions (`get_query_guide`, `get_resolve_event_element_guide`) used first when the query
  shape is unclear.

## Evidence

`data_analyze_tool` read flag; requires the Analyze add-on (error without it) —
`references/action-reference.md` Analyze group.
