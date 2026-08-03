---
title: "Scenario NONWEBFLOW-001: non-Webflow intent defers"
description: "A non-hub or non-Webflow request must not route to the webflow transport."
trigger_phrases: ["webflow playbook negative", "non-webflow defer"]
importance_tier: normal
version: 1.0.0.0
stage: negative
---

# NONWEBFLOW-001: Non-Webflow intent defers

## Objective

Verify that requests outside the Webflow surface defer or route elsewhere — never execute a
Webflow tool from an off-topic request.

## Steps

1. Give the orchestrator: "review the auth module code" (non-hub) and "search refero for web
   product styles" (sibling mode).
2. Observe routing.

## Expected

- Non-hub intent: hub routes to DEFER (no-mode-scored) or the appropriate skill.
- Sibling intent: routes to the sibling mode (REFERO), not webflow.
- Zero Webflow tool calls in both cases.

## Evidence

Benchmark negative + boundary scenarios (2026-08-02 routing replay: 12/12, including
`review the auth module code` → DEFER PASS and `search refero ...` → REFERO PASS).

## 1. OVERVIEW



### Why This Matters

Off-topic requests never route to webflow tools.

## 2. SCENARIO CONTRACT

- Feature ID: `NON-WEBFLOW-001`
- Scenario Objective: Off-topic requests never route to webflow tools.
- Exact Prompt: `Review the auth module code; search refero for web product styles.`
- Expected Signals: Non-hub intent defers; sibling intent routes to the sibling mode; zero webflow calls.
- Evidence: Routing verdicts (benchmark replay 12/12).
- Pass/Fail Criteria: PASS if zero webflow calls occur on both prompts; FAIL if webflow activates.
- Failure Triage: 1. Check hub-router signals. 2. Verify the deferral path.

## 3. TEST EXECUTION

1. Execute the scenario per the SCENARIO CONTRACT prompt.
2. Capture evidence; grade PASS/FAIL/SKIP.

### Expected

Non-hub intent defers; sibling intent routes to the sibling mode; zero webflow calls.

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
| Stage | negative |
| Surface | remote + local OSS where noted |
| Authority | frozen contract + official docs (2026-08-03) |
| Version | 1.1.0.0 |
