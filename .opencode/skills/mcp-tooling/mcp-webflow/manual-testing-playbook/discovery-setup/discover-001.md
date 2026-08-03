---
title: "DISCOVER-001: discovery and prefix contract"
description: "Verify list_tools surfaces the webflow manual and the doubled-prefix callables."
version: 1.0.0.0
stage: routing
---

# DISCOVER-001 — Discovery and prefix contract

1. Ensure `webflow_WEBFLOW_TOKEN` is exported (or record the blocker).
2. `list_tools()` → filter `name.startsWith("webflow.webflow.")`.
3. PASS: at least the data modules (pages, cms, sites, workflows, scripts, components) appear under the `webflow.webflow.*` namespace (expected convention; exact form recorded at first authenticated session).
4. Record the live inventory diff against `references/tool-surface.md`; pin the server version.

## 1. OVERVIEW



### Why This Matters

Discovery returns the webflow namespace and matches the baseline inventory.

## 2. SCENARIO CONTRACT

- Feature ID: `DISCOVER-001`
- Scenario Objective: Discovery returns the webflow namespace and matches the baseline inventory.
- Exact Prompt: `List the available Webflow MCP tools.`
- Expected Signals: Step 1 returns webflow.webflow.* entries; step 2 matches tool-surface/action-reference groups.
- Evidence: Full list_tools output (redacted), matched inventory, drift notes.
- Pass/Fail Criteria: PASS if the webflow namespace resolves and the inventory matches; FAIL on missing namespace or unrecorded drift.
- Failure Triage: 1. Run scripts/doctor.sh. 2. Check WEBFLOW_TOKEN presence and manual registration.

## 3. TEST EXECUTION

1. Execute the scenario per the SCENARIO CONTRACT prompt.
2. Capture evidence; grade PASS/FAIL/SKIP.

### Expected

Step 1 returns webflow.webflow.* entries; step 2 matches tool-surface/action-reference groups.

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
