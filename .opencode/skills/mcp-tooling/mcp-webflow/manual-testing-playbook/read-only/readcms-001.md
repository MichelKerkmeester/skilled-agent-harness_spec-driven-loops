---
title: "READCMS-001: read CMS collection"
description: "RO class: list collection items without any gate."
version: 1.0.0.0
stage: routing
---

# READCMS-001 — Read CMS collection

1. Discover tools.
2. `data_cms_tool` → `get_collection_list` + `list_collection_items` (test site).
3. PASS: items returned; no confirmation asked; no mutation performed.

## 1. OVERVIEW



### Why This Matters

RO CMS reads pass without confirmation.

## 2. SCENARIO CONTRACT

- Feature ID: `READCMS-001`
- Scenario Objective: RO CMS reads pass without confirmation.
- Exact Prompt: `List the CMS collection items in the test site.`
- Expected Signals: Scope check passes; collection items returned.
- Evidence: Tool output (redacted).
- Pass/Fail Criteria: PASS if items are returned without a confirmation gate; FAIL otherwise.
- Failure Triage: 1. Check token scopes (cms:read). 2. Confirm the collection id.

## 3. TEST EXECUTION

1. Execute the scenario per the SCENARIO CONTRACT prompt.
2. Capture evidence; grade PASS/FAIL/SKIP.

### Expected

Scope check passes; collection items returned.

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
