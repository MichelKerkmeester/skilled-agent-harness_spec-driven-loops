---
title: "Analyze add-on"
description: "Webflow Analyze capability card: traffic trends, ranked pages, ranked dimensions, engagement, time-on-page reports (Analyze add-on required)."
trigger_phrases: ["webflow analyze", "webflow traffic", "webflow analytics"]
contextType: implementation
version: 1.0.0.0

# Analyze add-on

<!-- sk-doc-template: skill_asset_feature_catalog -->
## 1. OVERVIEW

Advisory, read-only access to Webflow Analyze report data for a site: traffic over time,
ranked pages, ranked dimensions, engagement events, and time on page. Requires the Webflow
Analyze add-on; actions return an error on sites without it.

---
## 2. HOW IT WORKS

### Actions (`data_analyze_tool`, read)

| Action | Params | Class |
|--------|--------|-------|
| `get_query_guide` | none | RO |
| `get_resolve_event_element_guide` | none | RO |
| `get_time_on_page_report` | `site_id`, `startTime`, `endTime`, `metricScope` | RO |
| traffic trend / ranked pages / ranked dimensions / engagement events | `site_id`, date range, filters | RO |

### Semantics

- Analyze is an **operational, read-only surface**: every action is RO — there is **no mutation
  surface at all**, so no DW/DS gates ever apply and there is nothing to confirm before a call.
- The reads are **advisory natural-language analytics**: they shape questions into report
  queries over the site's data; they never modify site data.
- Use the guide actions first when unsure how to shape a query or trace an event back to the
  element that produced it.

### Operational contract

- **Advisory, not authoritative**: report values are model-generated answers over the site's
  analytics data. Never trust them as fact — verify any number, trend, or ranking that feeds a
  decision against the raw API reads (traffic / ranked pages / ranked dimensions / engagement /
  time-on-page calls) before acting on it or reporting it.
- **RO advisory in practice**: treat the answer as a starting point for the operator, not as a
  data source to quote; when the numbers matter, cite the underlying raw reads.
- **Contradiction handling**: if a generated answer contradicts a raw read, the read wins —
  re-query, treat the discrepancy as a generation error, and report it to the operator.

### Example prompts

- "what is the traffic trend for the test site over the last 30 days"
- "rank the top pages of the test site by visits"
- "break down last week's visits by country"

---
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `../../references/action-reference.md` | Shared | Required parameters per action (Analyze (add-on)) |
| `../../references/tool-surface.md` | Shared | Local OSS baseline where applicable |
| `../../SKILL.md` | Shared | Frozen classes and gates |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../../manual-testing-playbook/` | Manual playbook | Relevant scenarios for this capability |


## 4. SOURCE METADATA

- Group: Analyze (add-on)
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `intelligence/analyze.md`

Related references:
- [`agent-instructions.md`](agent-instructions.md) — related capability
