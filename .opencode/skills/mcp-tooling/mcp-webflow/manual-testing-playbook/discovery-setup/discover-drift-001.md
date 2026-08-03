---
title: "Scenario DISCOVER-DRIFT-001: tool-surface drift fails closed"
description: "When live discovery disagrees with the baseline inventory, the transport must fail closed on mismatched tools and record the drift."
trigger_phrases: ["webflow playbook drift", "webflow discovery drift"]
importance_tier: normal
version: 1.0.0.0
stage: routing
---

# DISCOVER-DRIFT-001: Tool-surface drift fails closed

## Objective

Verify the discovery-first contract: live `list_tools` output is authoritative; any tool not in
the baseline inventory (or renamed) is not called from memory.

## Steps

1. Run `list_tools`; filter `webflow.webflow.*`.
2. Compare names + input schemas against `references/tool-surface.md`.
3. On drift (missing/renamed/extra tools): record the drift, refuse calls to mismatched tools,
   and update `tool-surface.md` with a dated fixture.

## Expected

- No call to a drifted tool name.
- Drift recorded (dated) before any further action.

## Evidence

Fails closed by design; this scenario documents the required behavior for the first authenticated
session (currently BLOCKED — no token/test site).

## 1. OVERVIEW



### Why This Matters

Live discovery is authoritative; drift is recorded and mismatched tools are never called.

## 2. SCENARIO CONTRACT

- Feature ID: `DISCOVER-DRIFT-001`
- Scenario Objective: Live discovery is authoritative; drift is recorded and mismatched tools are never called.
- Exact Prompt: `List tools and compare against the baseline inventory.`
- Expected Signals: Drift items are enumerated; no call is issued to a drifted tool.
- Evidence: Dated drift fixture, refused-call record.
- Pass/Fail Criteria: PASS if drift is recorded and no drifted tool is called; FAIL otherwise.
- Failure Triage: 1. Re-run discovery. 2. Pin the server version and refresh the fixture.

## 3. TEST EXECUTION

1. Execute the scenario per the SCENARIO CONTRACT prompt.
2. Capture evidence; grade PASS/FAIL/SKIP.

### Expected

Drift items are enumerated; no call is issued to a drifted tool.

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
