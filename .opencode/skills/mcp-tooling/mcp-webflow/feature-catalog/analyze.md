---
title: "Capability: Analyze add-on reports"
description: "Webflow Analyze capability card: traffic trends, ranked pages, ranked dimensions, engagement, time-on-page reports (Analyze add-on required)."
trigger_phrases: ["webflow analyze", "webflow traffic", "webflow analytics"]
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Analyze add-on reports

## What it does

Read-only access to Webflow Analyze report data for a site: traffic over time, ranked pages,
ranked dimensions, engagement events, and time on page. Requires the Webflow Analyze add-on;
actions return an error on sites without it.

## Actions (`data_analyze_tool`, read)

| Action | Params | Class |
|--------|--------|-------|
| `get_query_guide` | none | RO |
| `get_resolve_event_element_guide` | none | RO |
| `get_time_on_page_report` | `site_id`, `startTime`, `endTime`, `metricScope` | RO |
| traffic trend / ranked pages / ranked dimensions / engagement events | `site_id`, date range, filters | RO |

## Semantics

- Use the guide actions first when unsure how to shape a query or trace an event back to the
  element that produced it.
- Read-only: no gates beyond scope check.

## Example prompts

- "what is the traffic trend for the test site over the last 30 days"
- "rank the top pages of the test site by visits"
- "break down last week's visits by country"
