---
title: "Scenario REMOTE-SURFACE-001: remote vs local surface reconciliation"
description: "The remote deployed surface (31 tools / 216 actions) and the local OSS server (18 modules) differ; the pinned session's live discovery decides."
trigger_phrases: ["webflow playbook remote surface", "webflow surface reconciliation"]
importance_tier: normal
version: 1.0.0.0
stage: routing
---

# REMOTE-SURFACE-001: Remote vs local surface reconciliation

## Objective

Verify that the session resolves which surface is live (remote 31-tool / 216-action surface per
official docs vs local 18-module OSS server) and records it before any call.

## Steps

1. Run `list_tools()`; count `webflow.webflow.*` entries.
2. Compare against BOTH `references/action-reference.md` (remote, 216 actions) and
   `references/tool-surface.md` (local OSS, 18 modules).
3. Record which surface matched, pin the version, and note any drift.

## Expected

- The matched surface is identified and recorded (dated fixture).
- No call is made from the wrong surface's inventory.

## Evidence

Official docs data-tools/designer-tools/utility-tools (2026-08-03); OSS repo `src/tools/*` —
the version-surface contradiction documented in `references/mcp-wiring.md` §6.

## 1. OVERVIEW



### Why This Matters

The session resolves which surface is live (remote vs local OSS) before any call.

## 2. SCENARIO CONTRACT

- Feature ID: `REMOTE-SURFACE-001`
- Scenario Objective: The session resolves which surface is live (remote vs local OSS) before any call.
- Exact Prompt: `Run discovery and identify the live surface.`
- Expected Signals: Surface identified (31-tool/220-action remote vs 18-module local); version pinned.
- Evidence: list_tools count, surface verdict, pinned version.
- Pass/Fail Criteria: PASS if the surface is identified and recorded; FAIL if surfaces are mixed.
- Failure Triage: 1. Compare counts against both references. 2. Pin the version and record.

## 3. TEST EXECUTION

1. Execute the scenario per the SCENARIO CONTRACT prompt.
2. Capture evidence; grade PASS/FAIL/SKIP.

### Expected

Surface identified (31-tool/220-action remote vs 18-module local); version pinned.

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
