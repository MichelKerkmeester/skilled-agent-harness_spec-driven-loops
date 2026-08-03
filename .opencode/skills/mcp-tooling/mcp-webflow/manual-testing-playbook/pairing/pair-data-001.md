---
title: "Scenario PAIR-DATA-001: data-family runs transport-only"
description: "Data-family operations do not require sk-design; the negative pairing check."
trigger_phrases: ["webflow playbook pairing data", "webflow data family"]
importance_tier: normal
version: 1.0.0.0
stage: routing
---

# PAIR-DATA-001: Data-family runs transport-only

## Objective

Verify the pairing boundary: CMS CRUD, analytics, scripts, workflows, webhooks, comments run
transport-only — no `sk-design` load is required (and none should be forced).

## Steps

1. Ask: "create a draft CMS item in the 'Blog' collection".
2. Observe whether `sk-design` is loaded.

## Expected

- The data-family draft-write executes without `sk-design` (DW class, scope check only).
- Designer-family prompts (PAIR-001) still load `sk-design` — the boundary holds both ways.

## Evidence

Frozen pairing rule (decision record): Designer-family → sk-design; Data-family transport-only.

## 1. OVERVIEW



### Why This Matters

Data-family operations run transport-only (negative pairing check).

## 2. SCENARIO CONTRACT

- Feature ID: `PAIR-DATA-001`
- Scenario Objective: Data-family operations run transport-only (negative pairing check).
- Exact Prompt: `Create a draft CMS item in the 'Blog' collection.`
- Expected Signals: Draft-write executes without sk-design; Designer prompts still pair.
- Evidence: Tool call order; no forced sk-design load.
- Pass/Fail Criteria: PASS if the data-family op runs transport-only; FAIL if sk-design is forced or skipped where required.
- Failure Triage: 1. Confirm the class (DW). 2. Verify pairing boundary both ways.

## 3. TEST EXECUTION

1. Execute the scenario per the SCENARIO CONTRACT prompt.
2. Capture evidence; grade PASS/FAIL/SKIP.

### Expected

Draft-write executes without sk-design; Designer prompts still pair.

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
