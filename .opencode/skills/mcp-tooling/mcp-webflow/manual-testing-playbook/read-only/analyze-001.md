---
title: "Scenario ANALYZE-001: Analyze reports read-only"
description: "Webflow Analyze add-on reports are read-only and pass ungated (site must have the Analyze add-on)."
trigger_phrases: ["webflow playbook analyze", "webflow analytics scenario"]
importance_tier: normal
version: 1.0.0.0
stage: routing
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

## 1. OVERVIEW



### Why This Matters

Analyze reports are read-only and pass ungated (Analyze add-on required).

## 2. SCENARIO CONTRACT

- Feature ID: `ANALYZE-001`
- Scenario Objective: Analyze reports are read-only and pass ungated (Analyze add-on required).
- Exact Prompt: `Traffic trend for the test site over the last 30 days.`
- Expected Signals: Guide actions used first; report returned; or SKIP if the add-on is absent.
- Evidence: Report output or SKIP record naming the missing add-on.
- Pass/Fail Criteria: PASS if the report returns ungated, or SKIP with the add-on named; FAIL on gated execution.
- Failure Triage: 1. Verify the Analyze add-on. 2. Use get_query_guide for query shape.

## 3. TEST EXECUTION

1. Execute the scenario per the SCENARIO CONTRACT prompt.
2. Capture evidence; grade PASS/FAIL/SKIP.

### Expected

Guide actions used first; report returned; or SKIP if the add-on is absent.

### Verdict

Binary PASS / FAIL / SKIP (prerequisite-specific). A gated operation executed without
confirmation is FAIL regardless of outcome.

## 4. SOURCE FILES

- Root playbook: [`../manual-testing-playbook.md`](../manual-testing-playbook.md)
- Action reference: [`../../references/action-reference.md`](../../references/action-reference.md)
- Frozen contract: [`../../SKILL.md`](../../SKILL.md)


## 5. SOURCE METADATA

| Field | Value |
|-------|-------|
| Stage | routing |
| Surface | remote + local OSS where noted |
| Authority | frozen contract + official docs (2026-08-03) |
| Version | 1.1.0.0 |
