---
title: "DRAFTSET-001: draft page settings update"
description: "DW class: update settings without publishing; before-state captured."
version: 1.0.0.0
stage: routing
---

# DRAFTSET-001 — Draft page settings update

1. Read current page metadata (before-state).
2. `update_page_settings` with a non-publishing field only.
3. PASS: change applied; publish-status untouched; report states nothing published.

## 1. OVERVIEW



### Why This Matters

DW page settings update without publish-status change.

## 2. SCENARIO CONTRACT

- Feature ID: `DRAFTSET-001`
- Scenario Objective: DW page settings update without publish-status change.
- Exact Prompt: `Update the 'About' page title in the test site (draft).`
- Expected Signals: Before-state captured; settings updated; no publish-status flip.
- Evidence: Before/after settings, no publish receipt.
- Pass/Fail Criteria: PASS if updated as DW with no publish; FAIL if the status flipped without a PB gate.
- Failure Triage: 1. Review the update_page_settings payload. 2. Confirm no publish intent.

## 3. TEST EXECUTION

1. Execute the scenario per the SCENARIO CONTRACT prompt.
2. Capture evidence; grade PASS/FAIL/SKIP.

### Expected

Before-state captured; settings updated; no publish-status flip.

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
