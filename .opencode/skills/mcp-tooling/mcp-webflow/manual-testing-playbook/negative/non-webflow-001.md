---
title: "Scenario NONWEBFLOW-001: non-Webflow intent defers"
description: "A non-hub or non-Webflow request must not route to the webflow transport."
trigger_phrases: ["webflow playbook negative", "non-webflow defer"]
importance_tier: normal
version: 1.0.0.0
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
