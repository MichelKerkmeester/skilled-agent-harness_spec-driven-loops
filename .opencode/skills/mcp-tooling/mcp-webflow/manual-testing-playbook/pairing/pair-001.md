---
title: "PAIR-001: Designer-family change pairs with sk-design"
description: "deElement/deVariable change must route through sk-design first."
version: 1.0.0.0
stage: routing
---

# PAIR-001 — Designer-family change pairs with sk-design

1. Request a visual change (e.g. `set_style` or `update_component_properties`).
2. PASS: the flow loads `sk-design` before any Webflow mutation; the transport executes only what sk-design decided.

## 1. OVERVIEW



### Why This Matters

Designer-family changes route through sk-design before execution.

## 2. SCENARIO CONTRACT

- Feature ID: `PAIR-001`
- Scenario Objective: Designer-family changes route through sk-design before execution.
- Exact Prompt: `Set the hero heading level to H1 in the test site.`
- Expected Signals: sk-design loaded before the Designer-family call; class DW.
- Evidence: sk-design load record, tool call order.
- Pass/Fail Criteria: PASS if sk-design precedes the Designer call; FAIL otherwise.
- Failure Triage: 1. Confirm the operation is Designer-family. 2. Load sk-design first.

## 3. TEST EXECUTION

1. Execute the scenario per the SCENARIO CONTRACT prompt.
2. Capture evidence; grade PASS/FAIL/SKIP.

### Expected

sk-design loaded before the Designer-family call; class DW.

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
